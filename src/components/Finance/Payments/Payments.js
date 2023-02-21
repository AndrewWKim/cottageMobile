import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { connect } from 'react-redux'
import commonActions from '../../../store/actions/common'
import billingActions from '../../../store/actions/billing'
import FinanceDatePicker from '../FinanceDatePicker/FinanceDatePicker'
import styles from './styles'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import profileActions from '../../../store/actions/profile'
import CardSwipe from '../Cards/CardSwipe'
import billingService from '../../../shared/services/billingService'
import {
    PAYMENT_RESULT_STATUS,
    PAYMENT_STATUS,
} from '../../../shared/const/constants'
import { PAYMENT_TYPE } from '../../../shared/const/constants'

class Payments extends Component {
    componentDidMount() {
        this.getCurrentData().then(() => {
            const { cottageBillings } = this.props
            if (cottageBillings.length > 0) {
                const indexOfLast = cottageBillings.length - 1
                this.props.setCurrentCottageBillingId(
                    cottageBillings[indexOfLast].id,
                )
            }
        })

        this.props.navigation.addListener('focus', () => {
            this.getCurrentData()
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', () => {
            this.getCurrentData()
        })
    }

    getCurrentData = async () => {
        this.props.toggleLoader(true)

        await this.props.fetchCottageBillings(this.props.session.user.id, false)
        await this.props.getUnpaidCommunalBillsCount(this.props.session.user.id)
        if (this.props.cottageBillings?.length > 0) {
            const id = this.props.currentCottageBillingId
                ? this.props.currentCottageBillingId
                : this.props.cottageBillings[this.props.cottageBillings.length - 1].id
            await this.props.fetchCommunalBills(id)
        }
        await this.props.fetchCurrentClient()
        this.props.toggleLoader(false)
    }

    hideConfirmationDialog = () => {
        this.props.toggleConfirmationDialog(false, null, null)
    }

    makePayment = (paymentType, billingId, price) => {
        //COMISSION
        let priceWithPercent = price + price * 0.025
        const canPayWithCard = true //priceWithPercent < 999;

        priceWithPercent = canPayWithCard
            ? priceWithPercent
            : Math.floor(price / 0.975)

        const confirmFunction = () => {
            this.props.toggleLoader(true)
            this.hideConfirmationDialog()

            if (canPayWithCard) {
                billingService
                    .payWithCard(
                        paymentType,
                        this.props.currentClient.id,
                        this.props.currentCardId,
                        billingId,
                    )
                    .then(paymentData => {
                        const status = paymentData.paymentResultStatus
                        if (status === PAYMENT_RESULT_STATUS.fail) {
                            this.props.toggleLoader(false)
                            this.hideConfirmationDialog()
                            Alert.alert(
                                'Ошибка',
                                'Оплата не произведена, повторите попытку позже',
                            )
                        } else if (
                            status === PAYMENT_RESULT_STATUS.show3DSecure
                        ) {
                            this.props.toggleLoader(false)
                            this.hideConfirmationDialog()
                            billingService
                                .checkPayment(paymentData.orderId)
                                .then(() =>
                                    console.log(
                                        'Проверка оплаты прошла успешно',
                                    ),
                                )
                            this.props.togglePaymentPageVisible(
                                true,
                                paymentData,
                            )
                        } else if (
                            status === PAYMENT_RESULT_STATUS.failedCardTime
                        ) {
                            const addCard = () => {
                                this.props.toggleLoader(true)
                                this.hideConfirmationDialog()
                                billingService
                                    .getCardAddPage(
                                        PAYMENT_TYPE.newCard,
                                        this.props.currentClient.id,
                                    )
                                    .then(newCardPaymentData => {
                                        this.props.toggleLoader(false)
                                        this.props.togglePaymentPageVisible(
                                            true,
                                            newCardPaymentData,
                                        )
                                    })
                                    .catch(error => {
                                        this.props.toggleLoader(false)
                                    })
                            }

                            this.hideConfirmationDialog()
                            setTimeout(() => {
                                this.props.toggleLoader(false)
                                this.props.toggleConfirmationDialog(
                                    true,
                                    'Данные вашей карты устарели. Ввести их заново?',
                                    addCard,
                                )
                            }, 1000)
                        } else {
                            this.props.toggleLoader(false)
                            this.hideConfirmationDialog()
                            this.getCurrentData()
                            Alert.alert('Успешно', 'Оплата прошла успешно.')
                        }
                    })
                    .catch(error => {
                        this.props.toggleLoader(false)
                        this.hideConfirmationDialog()
                    })
            } else {
                billingService
                    .getPaymentPage(
                        paymentType,
                        this.props.currentClient.id,
                        billingId,
                    )
                    .then(paymentData => {
                        this.hideConfirmationDialog()
                        this.props.toggleLoader(false)
                        billingService
                            .checkPayment(paymentData.orderId)
                            .then(() =>
                                console.log('Проверка оплаты прошла успешно'),
                            )
                        this.props.togglePaymentPageVisible(true, paymentData)
                    })
            }
        }

        // const confirmText = `Подтвердите операцию. Сумма платежа : ${priceWithPercent.toFixed(
        //     2,
        // )} UAH. Так же, может дополнительно взыматься комиссия по тарифам вашего банка. Время для проведения оплаты составляет 15 минут.`
        const confirmText = priceWithPercent.toFixed(2)
        this.props.toggleConfirmationDialog(true, confirmText, confirmFunction)
    }

    renderCommunalBill = communalBill => {
        const paymentStatus = communalBill.paymentStatus
        const uncuttedTypes = ['Обслуживание кооператива', 'Название не задано']

        return (
            <View
                style={{
                    ...styles.meterItem,
                    width: Dimensions.get('window').width - 60,
                    borderBottomWidth: 1,
                    borderBottomColor: '#202020',
                    opacity: paymentStatus == PAYMENT_STATUS.unpaid ? 1 : 0.5,
                }}>

                {
                    paymentStatus == PAYMENT_STATUS.unpaid ? (
                        <TabBarItem
                            name="circle"
                            color={'#202020'}
                            size={10}
                            style={{
                                ...styles.dot,
                                left: this.props.isPortrait ? '-50%' : '-30%',
                            }}
                        />
                    ) : (
                        <></>
                    )
                }

                <Text style={{ ...styles.communalType, flex: 1, paddingRight: 5 }}
                    numberOfLines={uncuttedTypes.includes(communalBill.communalType) ? 0 : 1}>
                    {communalBill.communalType}
                </Text>
                <Text style={styles.meterData}>{communalBill.price}</Text>
                {
                    paymentStatus == PAYMENT_STATUS.paid ? (
                        <View style={styles.paidInfoContainer}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textAlign: "center",
                                    width: 90
                                }}
                                numberOfLines={1}>
                                оплачено
                            </Text>
                        </View>
                    ) : paymentStatus == PAYMENT_STATUS.inProcess ? (
                        <View style={styles.paidInfoContainer}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                                numberOfLines={1}>
                                обрабатывается
                            </Text>
                        </View>
                    ) : paymentStatus == PAYMENT_STATUS.unpaid ? (
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => {
                                if (this.props.currentCardId) {
                                    this.makePayment(
                                        PAYMENT_TYPE.communalBill,
                                        communalBill.id,
                                        communalBill.price,
                                    )
                                } else {
                                    this.impossiblePaymentAlert()
                                }
                            }}
                            style={styles.button}>
                            <Text style={styles.buttonText} numberOfLines={1}>
                                оплатить
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.paidInfoContainer}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    width: 90,
                                    textAlign: 'center'
                                }}
                                numberOfLines={2}>
                                частично оплачено
                            </Text>
                        </View>
                    )
                }
            </View>

        )
    }

    impossiblePaymentAlert = () => {
        Alert.alert(
            'Оплата невозможна',
            'Для оплаты добавьте карту',
            [
                {
                    text: 'Добавить',
                    onPress: () => {
                        billingService.getCardAddPage(
                            PAYMENT_TYPE.newCard,
                            this.props.currentClient.id,
                        ).then(paymentData => {
                            this.props.togglePaymentPageVisible(true, paymentData)
                        })
                    },
                },
                { text: 'Позже' },
            ],
        )
    }

    render() {
        const {
            cottageBillings,
            currentCottageBillingId,
            communalBills,
        } = this.props

        const unpaidCommunalBills = communalBills?.filter(communalBill => {
            return communalBill.paymentStatus === PAYMENT_STATUS.unpaid
        })

        const isCottageBillingPaid =
            cottageBillings?.length > 0 && unpaidCommunalBills?.length === 0

        const monthPrice =
            cottageBillings.length > 0
                ? cottageBillings.find(cb => cb.id === currentCottageBillingId)
                    ?.totalPrice
                : 0

        const totalPrice =
            cottageBillings.length > 0
                ? cottageBillings
                    .map(cottageBilling => cottageBilling.totalPrice)
                    .reduce((a, b) => a + b, 0)
                : 0

        return (
            <>
                <ScrollView style={styles.paymentPage}>
                    <View style={styles.clientCard}>
                        {
                            this.props.currentClient?.cards.length > 0 ? (
                                <CardSwipe />
                            ) : (
                                <Text style={
                                    { fontSize: 16, fontWeight: 'bold' }
                                }>
                                    У Вас нет добавленных карт
                                </Text>
                            )
                        }
                    </View>
                    {
                        cottageBillings?.length > 0 ? (
                            <>
                                <FinanceDatePicker
                                    currentCottageBillingId={
                                        currentCottageBillingId
                                    }
                                    isForMeter={false}
                                />
                                <View style={{ marginTop: 10 }}>
                                    {
                                        communalBills?.map(communalBill => {
                                            return this.renderCommunalBill(communalBill)
                                        })
                                    }
                                    {
                                        isCottageBillingPaid ? (
                                            <></>
                                        ) : (
                                            <View>
                                                {
                                                    monthPrice ? (
                                                        <TouchableOpacity
                                                            accessibilityRole="button"
                                                            activeOpacity={0.8}
                                                            onPress={() => {
                                                                if (
                                                                    this.props.currentCardId
                                                                ) {
                                                                    this.makePayment(
                                                                        PAYMENT_TYPE.cottageBilling,
                                                                        currentCottageBillingId,
                                                                        monthPrice,
                                                                    )
                                                                } else {
                                                                    this.impossiblePaymentAlert()
                                                                }
                                                            }}
                                                            style={{
                                                                ...styles.paymentAllButton,
                                                                backgroundColor:
                                                                    'transparent',
                                                            }}>
                                                            <Text
                                                                style={{
                                                                    color: '#202020',
                                                                    fontSize: 18,
                                                                    fontWeight: 'bold',
                                                                    textAlign: 'center'
                                                                }} >
                                                                оплатить за месяц (
                                                                {monthPrice.toFixed(2)} uah)
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <></>
                                                    )
                                                }
                                            </View>
                                        )
                                    }
                                    <View style={{ marginBottom: 50 }}>
                                        <TouchableOpacity
                                            accessibilityRole="button"
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                if (this.props.currentCardId) {
                                                    this.makePayment(
                                                        PAYMENT_TYPE.all,
                                                        null,
                                                        totalPrice,
                                                    )
                                                } else {
                                                    this.impossiblePaymentAlert()
                                                }
                                            }}
                                            style={styles.paymentAllButton}>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontSize: 18,
                                                    fontWeight: 'bold',
                                                    textAlign: 'center'
                                                }}>
                                                оплатить ({totalPrice.toFixed(2)}{' '}
                                                uah)
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <View style={styles.emptyData}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                    }}>
                                    ДАННЫЕ ОТСУТСТВУЮТ
                                </Text>
                            </View>
                        )
                    }
                </ScrollView>
            </>
        )
    }
}

const stateToProps = state => ({
    session: state.auth.session,
    communalBills: state.billing.communalBills,
    cottageBillings: state.billing.cottageBillings,
    isPortrait: state.common.isPortrait,
    currentClient: state.profile.currentClient,
    currentCardId: state.billing.currentCardId,
    currentCottageBillingId: state.billing.currentCottageBillingId,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    toggleSnackBar: commonActions.toggleSnackBar,
    toggleConfirmationDialog: commonActions.toggleConfirmationDialog,
    ...billingActions,
    fetchCurrentClient: profileActions.fetchCurrentClient,
}

export default connect(stateToProps, dispatchToProps)(Payments)
