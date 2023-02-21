import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { PAYMENT_TYPE } from '../../../shared/const/constants'
import billingService from '../../../shared/services/billingService'
import billingActions from '../../../store/actions/billing'
import authActions from '../../../store/actions/auth'
import commonActions from '../../../store/actions/common'
import commonStyles from '../../commonStyles'
import styles from './styles'
import Biometrics from '../../Biometrics/Biometrics'

class Settings extends Component {
    startAddingCard = () => {
        billingService.getCardAddPage(
            PAYMENT_TYPE.newCard,
            this.props.currentClient.id,
        ).then(paymentData => {
            this.props.togglePaymentPageVisible(true, paymentData)
        })
    }

    render() {
        return (
            <>
                <View style={commonStyles.centerScreen}>
                    <Biometrics/>
                    <TouchableOpacity
                        accessibilityRole="button"
                        activeOpacity={0.8}
                        onPress={this.startAddingCard}
                        style={styles.button}>
                        <Text style={styles.buttonText}>добавить карту оплаты</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityRole="button"
                        activeOpacity={0.8}
                        onPress={() => {
                            this.props.logout()
                        }}
                        style={styles.button}>
                        <Text style={styles.buttonText}>выйти из профиля</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
})

const dispatchToProps = {
    logout: authActions.logout,
    toggleNewCardDialog: commonActions.toggleNewCardDialog,
    ...billingActions,
}

export default connect(stateToProps, dispatchToProps)(Settings)
