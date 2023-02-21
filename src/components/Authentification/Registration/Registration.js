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
import pushNotifications from '../../../shared/utils/pushNotifications'
import authActions from '../../../store/actions/auth'
import commonActions from '../../../store/actions/common'
import styles from '../styles'
import LinearGradient from 'react-native-linear-gradient'
import images from '../../../res/images/images'

const initialState = {
    registrationCode: '',
    username: '',
    password: '',
    confirmPassword: '',
    isPasswordsMatch: true,
}

class Registration extends Component {
    state = initialState

    onSave = () => {
        this.props.toggleLoader(true)

        const { registrationCode, username, password } = this.state

        const accountData = {
            registrationCode,
            username,
            password,
        }

        this.props
            .signUp(accountData)
            .then(() => {
                this.props.toggleLoader(false)
                pushNotifications.subscribeToPushNotifications(
                    this.props.session.user.id,
                )
            })
            .catch(error => {
                this.props.toggleLoader(false)
                if (error.registrationCode) {
                    this.setState({ registrationCode: '' })
                }
                if (error.userName) {
                    this.setState({ username: '' })
                }
            })
    }

    checkMatchPasswords = () => {
        const { password, confirmPassword } = this.state
        this.setState({ isPasswordsMatch: password === confirmPassword })
    }

    isRegistrationFormValid = () => {
        const {
            confirmPassword,
            password,
            username,
            registrationCode,
        } = this.state
        return (
            confirmPassword != '' &&
            password != '' &&
            username != '' &&
            registrationCode != '' &&
            password === confirmPassword
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
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={this.props.isPortrait ? 'padding' : null}
                enabled>
                <LinearGradient style={{ flex: 1 }}
                    colors={['rgba(107,79,158,1)', 'rgba(142,120,181,1)', 'rgba(191,172,226,1)', 'rgba(229,202,243,1)', 'rgba(248,223,221,1)']}
                    start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
                    <ScrollView
                        contentContainerStyle={styles.centerScreen}
                        keyboardShouldPersistTaps="handled">
                        <Image
                            source={images.logoTitle}
                            style={{ ...styles.logoTitle }}
                        />
                        <Text style={styles.title}>РЕГИСТРАЦИЯ</Text>
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
                            value={this.state.username}
                            onChangeText={username => this.setState({ username })}
                            placeholder="Логин"
                            placeholderTextColor="#202020"
                            style={{
                                ...styles.input,
                                borderColor:
                                    this.props.signUpError &&
                                        this.props.signUpError.userName
                                        ? 'red'
                                        : 'black',
                            }}
                            onBlur={this.props.clearSignUpError}
                            maxLength={30}
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
                            this.props.signUpError.registrationCode ? (
                            <Text style={styles.error}>
                                {this.props.signUpError.registrationCode[0]}
                            </Text>
                        ) : (
                            <></>
                        )}
                        {this.props.signUpError &&
                            this.props.signUpError.userName ? (
                            <Text style={styles.error}>
                                {this.props.signUpError.userName[0]}
                            </Text>
                        ) : (
                            <></>
                        )}
                        {this.state.isPasswordsMatch ? (
                            <></>
                        ) : (
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
                </LinearGradient>
            </KeyboardAvoidingView>
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

export default connect(stateToProps, dispatchToProps)(Registration)
