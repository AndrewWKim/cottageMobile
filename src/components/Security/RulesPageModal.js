import React, { Component } from 'react';
import { connect } from "react-redux";
import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";
import styles from "../Finance/PaymentPageModal/styles";
import WebView from "react-native-webview";
import commonActions from '../../store/actions/common'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'

class RulesPageModal extends Component {

    handleCloseButtonPress = () => {
        this.props.toggleRulesPageVisible(false, null)
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.rulesPageVisible}
                statusBarTranslucent={true}>
                <View style={styles.modalBackground}>
                    {
                        this.props.rulesHtml
                            ? <WebView
                                source={{ html: this.props.rulesHtml }}
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
                                    flex: 1,
                                    width: Dimensions.get('window').width - 10,
                                    height: Dimensions.get('window').height - 10,
                                }}></WebView>
                            : <></>
                    }
                    <TouchableOpacity style={{
                        position: "absolute",
                        left: 8,
                        top: 35,
                        zIndex: 10
                    }}
                        onPress={this.handleCloseButtonPress}
                    >
                        <TabBarItem size={30} name='close-circle' color={'rgb(142,120,181)'} />
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

const stateToProps = state => ({
    rulesPageVisible: state?.common?.rulesPageVisible,
    rulesHtml: state?.common?.rulesHtml
})

const dispatchToProps = {
    toggleRulesPageVisible: commonActions.toggleRulesPageVisible
}

export default connect(stateToProps, dispatchToProps)(RulesPageModal)
