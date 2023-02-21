import React, { Component } from 'react'
import {
    Text,
    View,
    Dimensions,
    Button,
    Linking,
    Animated,
    TouchableOpacity, Modal,
} from 'react-native'
import callPhoneNumber from '../../shared/utils/callPhoneNumber'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import settingsService from '../../shared/services/settingsService'
import styles from './styles'

class Security extends Component {
    state = {
        scaleAnim: new Animated.Value(0),
    }

    animateIn = () => {
        Animated.timing(this.state.scaleAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start()
    }

    animateOut = () => {
        Animated.timing(this.state.scaleAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start()
    }

    askRecall = () => {
        // send api request .then(SET_STATE_BELOW)
        this.props.setIsClientCallBackSent(true)
    }

    callAction = () => {
        settingsService
            .getSettings()
            .then(settings => callPhoneNumber(settings.securityPhoneNumber))
    }

    openRulesModal = () => {
        this.props.toggleLoader(true)
        settingsService
            .getSettings()
            .then(settings => {
                this.props.toggleLoader(false)
                this.props.toggleSecurityTab(false)
                this.props.toggleRulesPageVisible(true, settings.cottageRulesHTML)
            })
            .catch(e => {
                this.props.toggleLoader(false)
            })
    }

    renderButtons = () => {
        return (
            <>
                <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    onPress={this.openRulesModal}
                    style={styles.securityButton}>
                    <Text style={styles.buttonText}>
                        правила
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    onPress={() => {
                        this.props.toggleSecurityTab(false)
                        this.props.navigation.navigate('Home', {
                            screen: 'PassRequest',
                        })
                    }}
                    style={styles.securityButton}>
                    <Text style={styles.buttonText}>
                        заявка на пропуск гостя
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    onPress={() => {
                        this.props.toggleSecurityTab(false)
                        this.props.navigation.navigate('VideoStreaming')
                    }}
                    style={styles.securityButton}>
                    <Text style={styles.buttonText}>камеры наблюдения</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          onPress={() => {
            this.askRecall()
          }
          }
          style={styles.securityButton}>
          <Text style={styles.buttonText}>Перезвонить мне (в разработке)</Text>
        </TouchableOpacity> */}

                <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    onPress={this.callAction}
                    style={{ ...styles.securityButton, marginBottom: 0 }}>
                    <Text style={styles.buttonText}>позвонить на КПП</Text>
                </TouchableOpacity>
            </>
        )
    }

    render() {
        this.props.securityVisible ? this.animateIn() : this.animateOut()

        return (
            <Animated.View
                style={
                    this.props.isPortrait
                        ? {
                            ...styles.securityPortrait,
                            transform: [
                                {
                                    scale: this.state.scaleAnim,
                                },
                            ],
                        }
                        : {
                            ...styles.securityLandscape,
                            transform: [
                                {
                                    scale: this.state.scaleAnim,
                                },
                            ],
                        }
                }>
                {!this.props.isClientCallBackSent ? (
                    this.renderButtons()
                ) : (
                    <>
                        <Text style={styles.header}>Спасибо!</Text>
                        <Text style={styles.confirmText}>
                            Мы перезвоним Вам в самое кратчайшее время
                        </Text>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => {
                                this.props.toggleSecurityTab(false)
                            }}
                            style={styles.securityButton}>
                            <Text style={styles.buttonText}>Закрыть</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Animated.View>
        )
    }
}

const stateToProps = state => ({
    securityVisible: state.common.securityVisible,
    isPortrait: state.common.isPortrait,
    isClientCallBackSent: state.common.isClientCallBackSent,
})

const dispatchToProps = {
    ...commonActions,
}

export default connect(stateToProps, dispatchToProps)(Security)
