import React, { Component } from 'react'
import { View, Modal, Text, TouchableOpacity, Dimensions } from 'react-native'
import styles from './styles'
import { connect } from 'react-redux'
import billingActions from '../../../store/actions/billing'
import WebView from 'react-native-webview'
import commonActions from '../../../store/actions/common'

const initialState = {
    timerStarted: false,
}
class PaymentPageModal extends Component {
    state = initialState

    handleCloseButtonPress = () => {
        this.props.toggleLoader(true)
        Promise.all([
            this.props.getUnpaidCommunalBillsCount(this.props.session.user.id),
            this.props.fetchCottageBillings(this.props.session.user.id, false),
            this.props.fetchCommunalBills(this.props.currentCottageBillingId),
        ]).finally(() => {
            this.props.toggleLoader(false)
        })
        this.props.togglePaymentPageVisible(false)
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

    navigateWebBack = () => {
        this.webref.goBack()
    }

    reloadWeb = () => {
        this.webref.reload()
    }

    // startTimer = () => {
    //     if (!this.props.timerData.timerCount) {
    //         this.interval = setInterval(
    //             () => this.props.updateTimer(this.props.timerData),
    //             5000,
    //         )
    //     } else if (this.props.timerData.timerCount >= 899) {
    //         clearInterval(this.interval)
    //     }
    // }

    render() {
        if (!this.props.timerData.timerCount && !this.state.timerStarted && this.props.paymentPageVisible) {
            this.interval = setInterval(
                () => {
                    console.log('COUNT')
                    this.props.updateTimer(this.props.timerData)
                },
                1000,
            )
            this.setState({
                timerStarted: true,
            })
        } else if ((this.props.timerData.timerCount >= 899 || !this.props.paymentPageVisible) && this.state.timerStarted) {
            clearInterval(this.interval)
            this.setState({
                timerStarted: false,
            })
        }
        const source = this.props.htmlPaymentForm
            ? this.props.htmlPaymentForm.startsWith('http')
                ? { uri: this.props.htmlPaymentForm }
                : { html: this.props.htmlPaymentForm }
            : null
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.paymentPageVisible}
                statusBarTranslucent={true}>
                <View style={styles.modalBackground}>
                    <WebView
                        source={source}
                        javaScriptCanOpenWindowsAutomatically={true}
                        ref={r => (this.webref = r)}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        useWebKit={true}
                        allowUniversalAccessFromFileURLs={true}
                        mixedContentMode="always"
                        allowsBackForwardNavigationGestures={true}
                        allowFileAccess={true}
                        scalesPageToFit={true}
                        originWhitelist={['*', 'http://*', 'https://*']}
                        style={{
                            ...styles.paymentPage,
                            width: Dimensions.get('window').width - 50,
                        }}></WebView>
                    <View style={styles.webButtons}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                {this.props.timerData.tenMinutes}
                                {this.props.timerData.minutes}:
                                {this.props.timerData.tenSeconds}
                                {this.props.timerData.seconds}
                            </Text>
                        </View>
                        <View style={{ width: 10 }}></View>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={this.handleCloseButtonPress}
                            style={styles.button}>
                            <Text style={styles.buttonText}>закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const stateToProps = state => ({
    paymentPageVisible: state.billing.paymentPageVisible,
    htmlPaymentForm: state.billing.htmlPaymentForm,
    isPortrait: state.common.isPortrait,
    currentCottageBillingId: state.billing.currentCottageBillingId,
    session: state.auth.session,
    timerData: state.billing.timerData,
})

const dispatchToProps = {
    ...billingActions,
    toggleLoader: commonActions.toggleLoader,
}

export default connect(stateToProps, dispatchToProps)(PaymentPageModal)
