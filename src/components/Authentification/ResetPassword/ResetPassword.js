import React, { Component } from 'react'
import {
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image,
} from 'react-native'
import { connect } from 'react-redux'
import authService from '../../../shared/services/authService'
import pushNotifications from '../../../shared/utils/pushNotifications'
import authActions from '../../../store/actions/auth'
import commonActions from '../../../store/actions/common'
import styles from '../styles'
import LinearGradient from 'react-native-linear-gradient'
import images from '../../../res/images/images'

const initialState = {
    registrationCode: '',
    password: '',
    confirmPassword: '',
    isPasswordsMatch: true,
}

class ResetPassword extends Component {
    state = initialState

    onSave = () => {
        this.props.toggleLoader(true)
        const { registrationCode, password } = this.state
        authService
            .resetPassword(registrationCode, password)
            .then(() => {
                this.props.navigation.navigate('Authentification', {
                    screen: 'Login',
                })
            })
            .catch(error => {
                this.setState(initialState)
                let message
                if (error.registrationCode) {
                    message = error.registrationCode[0]
                } else if (error.password) {
                    message = error.password[0]
                }
                else message = 'Ошибка соеденения с сервером'
                this.props.toggleSnackBar(true, message)
                throw error
            })
            .finally(() => this.props.toggleLoader(false))
    }

    checkMatchPasswords = () => {
        const { password, confirmPassword } = this.state
        this.setState({ isPasswordsMatch: password === confirmPassword })
    }

    isRegistrationFormValid = () => {
        const {
            confirmPassword,
            password,
            registrationCode,
            isPasswordsMatch,
        } = this.state
        return (
            confirmPassword != '' &&
            password != '' &&
            registrationCode != '' &&
            isPasswordsMatch
        )
    }

    componentWillUnmount() {
        this.props.clearSignUpError()
    }

    validateRegistrationCode(registrationCode) {
        return registrationCode.replace(/\D/g, '')
    }

    render() {
        return (
            <LinearGradient style={{ flex: 1 }}
                colors={['rgba(107,79,158,1)', 'rgba(142,120,181,1)', 'rgba(191,172,226,1)', 'rgba(229,202,243,1)', 'rgba(248,223,221,1)']}
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={this.props.isPortrait ? 'padding' : null}
                    enabled>
                    <ScrollView
                        contentContainerStyle={styles.centerScreen}
                        keyboardShouldPersistTaps="handled">
                        <Image
                            source={images.logoTitle}
                            style={{ ...styles.logoTitle }}
                        />
                        <Text style={styles.title}>ВОССТАНОВЛЕНИЕ ПАРОЛЯ</Text>
                        <TextInput
                            value={this.state.registrationCode}
                            onChangeText={registrationCode => {
                                const validCode = this.validateRegistrationCode(
                                    registrationCode,
                                )
                                this.setState({ registrationCode: validCode })
                            }}
                            placeholder="Код Регистрации"
                            placeholderTextColor="#202020"
                            keyboardType="numeric"
                            style={{
                                ...styles.input,
                                borderColor:
                                    this.props.signUpError &&
                                        this.props.signUpError.registrationCode
                                        ? 'red'
                                        : 'black',
                            }}
                            onBlur={this.props.clearSignUpError}
                            maxLength={6}
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                            placeholder="Пароль"
                            placeholderTextColor="#202020"
                            secureTextEntry={true}
                            style={{ ...styles.input, borderColor: 'black' }}
                            maxLength={30}
                        />
                        <TextInput
                            value={this.state.confirmPassword}
                            onChangeText={confirmPassword =>
                                this.setState({ confirmPassword })
                            }
                            placeholder="Повторите Пароль"
                            placeholderTextColor="#202020"
                            secureTextEntry={true}
                            style={{
                                ...styles.input,
                                borderColor: 'black',
                            }}
                            onBlur={this.checkMatchPasswords}
                            maxLength={30}
                        />
                        {this.props.signUpError &&
                            this.props.signUpError.registrationCode && (
                                <Text style={styles.error}>
                                    {this.props.signUpError.registrationCode[0]}
                                </Text>
                            )}
                        {this.props.signUpError &&
                            this.props.signUpError.userName && (
                                <Text style={styles.error}>
                                    {this.props.signUpError.userName[0]}
                                </Text>
                            )}
                        {!this.state.isPasswordsMatch && (
                            <Text style={styles.error}>Пароли не совпадают</Text>
                        )}
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={this.onSave}
                            style={styles.button}
                            disabled={!this.isRegistrationFormValid()}>
                            <Text style={this.isRegistrationFormValid()
                                ? styles.buttonText
                                : styles.disableButtonText}>сохранить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() =>
                                this.props.navigation.navigate('Authentification', {
                                    screen: 'Login',
                                })
                            }
                            style={styles.transparentButton}>
                            <Text style={styles.transparentButtonText}>отмена</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        )
    }
}

const stateToProps = state => ({
    signUpError: state.auth.signUpError,
    isPortrait: state.common.isPortrait,
    session: state.auth.session,
})

const dispatchToProps = {
    ...authActions,
    ...commonActions,
}

export default connect(stateToProps, dispatchToProps)(ResetPassword)
