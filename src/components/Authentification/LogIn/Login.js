import React, { Component } from 'react'
import {
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image
} from 'react-native'
import { connect } from 'react-redux'
import authActions from '../../../store/actions/auth'
import commonActions from '../../../store/actions/common'
import styles from '../styles'
import pushNotifications from '../../../shared/utils/pushNotifications'
import LinearGradient from 'react-native-linear-gradient'
import images from '../../../res/images/images'
import Biometrics from '../../Biometrics/Biometrics'

const initialState = {
    username: '',
    password: ''
}

class Login extends Component {
    state = initialState

    onLogin = () => {
        this.props.toggleLoader(true)
        const { username, password } = this.state

        this.props
            .login(username, password)
            .then(() => {
                pushNotifications.subscribeToPushNotifications(
                    this.props.session.user.id
                )
            })
            .catch(error => {
                this.props.toggleLoader(false)
                this.setState(initialState)
                this.props.toggleSnackBar(true, error.error_description)
            })
    }

    isLoginFormValid = () => {
        const { password, username } = this.state
        return password != '' && username != ''
    }

    render() {
        return (
            <LinearGradient
                style={{ flex: 1 }}
                colors={[
                    'rgba(107,79,158,1)',
                    'rgba(142,120,181,1)',
                    'rgba(191,172,226,1)',
                    'rgba(229,202,243,1)',
                    'rgba(248,223,221,1)'
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={this.props.isPortrait ? 'padding' : null}
                    enabled>
                    <ScrollView
                        contentContainerStyle={styles.centerScreen}
                        keyboardShouldPersistTaps='handled'>
                        <Image
                            source={images.logoTitle}
                            style={{ ...styles.logoTitle }}
                        />
                        <TextInput
                            value={this.state.username}
                            onChangeText={username =>
                                this.setState({ username })
                            }
                            placeholder='Логин'
                            placeholderTextColor='#202020'
                            style={styles.input}
                            maxLength={30}
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={password =>
                                this.setState({ password })
                            }
                            placeholder='Пароль'
                            placeholderTextColor='#202020'
                            secureTextEntry={true}
                            style={styles.input}
                            maxLength={30}
                        />
                        <TouchableOpacity
                            accessibilityRole='button'
                            activeOpacity={0.8}
                            onPress={() =>
                                this.props.navigation.navigate(
                                    'Authentification',
                                    {
                                        screen: 'ResetPassword'
                                    }
                                )
                            }>
                            <Text style={styles.link}>Забыли пароль?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole='button'
                            activeOpacity={0.8}
                            onPress={this.onLogin}
                            style={styles.button}
                            disabled={!this.isLoginFormValid()}>
                            <Text
                                style={
                                    this.isLoginFormValid()
                                        ? styles.buttonText
                                        : styles.disableButtonText
                                }>
                                войти
							</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole='button'
                            activeOpacity={0.8}
                            onPress={() =>
                                this.props.navigation.navigate(
                                    'Authentification',
                                    {
                                        screen: 'Registration'
                                    }
                                )
                            }
                            style={styles.transparentButton}>
                            <Text style={styles.transparentButtonText}>
                                регистрация
							</Text>
                        </TouchableOpacity>
                        <Biometrics isLogin={true}/>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        )
    }
}


const stateToProps = state => ({
    isPortrait: state.common.isPortrait,
    session: state.auth.session
})

const dispatchToProps = {
    login: authActions.login,
    toggleLoader: commonActions.toggleLoader,
    toggleSnackBar: commonActions.toggleSnackBar
}

export default connect(stateToProps, dispatchToProps)(Login)
