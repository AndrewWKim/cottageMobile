import React, { Component, createRef } from 'react'
import { Text, View, ScrollView, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import commonStyles from '../../commonStyles'
import FinanceDatePicker from '../FinanceDatePicker/FinanceDatePicker'
import styles from './styles'
import commonActions from '../../../store/actions/common'
import billingActions from '../../../store/actions/billing'
import { Tooltip } from 'react-native-elements';

class Meters extends Component {
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getCurrentData()
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', () => {
            this.getCurrentData()
        })
    }

    getCurrentData = () => {
        this.props.toggleLoader(true)
        this.props
            .fetchCottageBillings(this.props.session.user.id, true)
            .then((cottageBillings) => {
                this.props.toggleLoader(false)
            }).catch(error => {
                this.props.toggleLoader(false)
            })
    }

    getCommunalBillMeasure = (communalType) => {
        switch (communalType) {
            case 'Водоснабжение':
                return <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.meterData}> м</Text>
                    <Text style={{ ...styles.meterData, fontSize: 10 }}>3</Text>
                </View>
            case 'Канализация':
                return <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.meterData}> м</Text>
                    <Text style={{ ...styles.meterData, fontSize: 10 }}>3</Text>
                </View>
            case 'Електроэнергия':
                return <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.meterData}> кВт</Text>
                </View>
            case 'Название не задано':
                return <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.meterData}> кВт</Text>
                </View>
            default:
                return ''
        }
    }

    renderCommunalBill = communalBill => {
        if (communalBill.communalType == 'Обслуживание кооператива') {
            return <></>
        }

        return (
            <View
                style={{
                    ...styles.meterItem,
                    width: this.props.isPortrait
                        ? Dimensions.get('window').width - 60
                        : Dimensions.get('window').width - 60,
                    borderBottomWidth: 1,
                    borderBottomColor: '#202020',
                }}>
                <Text style={{ flex: 1, ...styles.communalType }} numberOfLines={1}>
                    {communalBill.communalType}
                </Text>
                <Tooltip popover={
                    <Text style={{ fontSize: 16, color: '#fff', }}>
                        На начало месяца: {communalBill.meterDataBegin.toFixed(2)} {"\n"}{"\n"}На конец
                        месяца: {communalBill.meterDataEnd.toFixed(2)}
                    </Text>
                }
                    backgroundColor={'rgb(142,120,181)'}
                    overlayColor={'rgba(0, 0, 0, 0.5)'}
                    skipAndroidStatusBar={false}
                    width={250}
                    height={90}
                    containerStyle={{ borderRadius: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.meterData}>
                            {communalBill.meterData.toFixed(2)}
                        </Text>
                        {
                            this.getCommunalBillMeasure(communalBill.communalType)
                        }
                    </View>
                </Tooltip>
            </View >
        )
    }

    render() {
        return (
            <>
                <View style={commonStyles.centerScreen}>
                    {
                        this.props.communalBills?.length > 0 ? (
                            <>
                                {
                                    this.props.currentCottageBillingId ? (
                                        <FinanceDatePicker
                                            currentCottageBillingId={
                                                this.props.currentCottageBillingId
                                            }
                                        />
                                    ) : (
                                        <Text style={{ ...commonStyles.developing, marginTop: '50%' }}>
                                            Данные по счетчикам отсутствуют.
                                        </Text>
                                    )
                                }
                                <ScrollView style={{ marginTop: 50 }}>
                                    {this.props.communalBills.map(communalBill => {
                                        return this.renderCommunalBill(communalBill)
                                    })}
                                </ScrollView>
                            </>
                        ) : (
                            <Text style={commonStyles.developing}>Данные отсутствуют.</Text>
                        )
                    }
                </View>
            </>
        )
    }
}

const stateToProps = state => ({
    communalBills: state.billing.communalBills,
    isPortrait: state.common.isPortrait,
    currentCottageBillingId: state.billing.currentCottageBillingId,
    session: state.auth.session,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    toggleSnackBar: commonActions.toggleSnackBar,
    ...billingActions,
}

export default connect(stateToProps, dispatchToProps)(Meters)
