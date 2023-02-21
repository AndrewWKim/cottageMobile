import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
} from 'react-native'
import { connect } from 'react-redux'
import styles from './styles'
import commonActions from '../../store/actions/common'

class ConfirmationDialog extends Component {
    state = {
        fadeAnim: new Animated.Value(0),
        zIndexAnim: new Animated.Value(0),
    }

    animateIn = () => {
        Animated.timing(this.state.zIndexAnim, {
            toValue: 100,
            duration: 1,
            useNativeDriver: false,
        }).start()
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start()
    }

    animateOut = () => {
        Animated.timing(this.state.fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start(({ finished }) => {
            Animated.timing(this.state.zIndexAnim, {
                toValue: 0,
                duration: 1,
                useNativeDriver: false,
            }).start()
        })
    }

    render() {
        this.props.confirmationDialogVisible
            ? this.animateIn()
            : this.animateOut()

        return (
            <>
                {
                    <TouchableWithoutFeedback
                        onPress={() =>
                            this.props.toggleConfirmationDialog(
                                false,
                                this.props.confirmText,
                                null,
                            )
                        }>
                        <Animated.View
                            style={{
                                ...styles.backdropStyleWithoutAnimation,
                                opacity: this.state.fadeAnim,
                                zIndex: this.state.zIndexAnim,
                                width: this.props.isPortrait
                                    ? Dimensions.get('window').width
                                    : Dimensions.get('window').width,
                                height: this.props.isPortrait
                                    ? Dimensions.get('window').height + 60
                                    : Dimensions.get('window').height + 60,
                            }}>
                            <View
                                style={
                                    this.props.isPortrait
                                        ? styles.confirmWindowPortrait
                                        : styles.confirmWindowLandscape
                                }>
                                <Text style={{ ...styles.confirmText, fontWeight: 'bold' }}>
                                    Подтвердите операцию
                                </Text>
                                <Text style={styles.confirmText}>
                                    Сумма платежа: <Text style={{ ...styles.confirmText, fontWeight: 'bold' }}>{this.props.confirmText} uah</Text>
                                </Text>
                                <Text style={styles.confirmText}>
                                    Так же, может дополнительно взыматься комиссия по тарифам вашего банка.
                                </Text>
                                <Text style={styles.confirmText}>
                                    {'Время для проведения оплаты \n 15 минут.'}
                                </Text>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        this.props.toggleConfirmationDialog(
                                            false,
                                            null,
                                            null,
                                        )
                                    }
                                    style={{ ...styles.button, backgroundColor: 'transparent' }}>
                                    <Text style={{ ...styles.buttonText, color: '#202020' }}>
                                        отмена
                                        </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    activeOpacity={0.8}
                                    onPress={this.props.confirmAction}
                                    style={styles.button}>
                                    <Text style={{ ...styles.buttonText }}>
                                        подтвердить оплату
                                        </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                }
            </>
        )
    }
}

const stateToProps = state => ({
    confirmationDialogVisible: state.common.confirmationDialogVisible,
    confirmText: state.common.confirmText,
    confirmAction: state.common.confirmAction,
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {
    toggleConfirmationDialog: commonActions.toggleConfirmationDialog,
}

export default connect(stateToProps, dispatchToProps)(ConfirmationDialog)
