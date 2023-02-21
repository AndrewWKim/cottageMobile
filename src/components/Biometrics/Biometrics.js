import React, { Component } from 'react'
import { Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import styles from './styles'
import images from '../../res/images/images'
import clientService from '../../shared/services/clientService'
import profileActions from '../../store/actions/profile'
import ReactNativeBiometrics from 'react-native-biometrics'
import authActions from '../../store/actions/auth'
import pushNotifications from '../../shared/utils/pushNotifications'

class Biometrics extends Component {
    tryLogin = async () => {
        let isSensorAvailable = await this.verifyIsSensorAvailable()

        if (isSensorAvailable) {
            let isKeyExists = await this.verifyIsKeyExists()

            if (!isKeyExists) {
                this.props.toggleSnackBar(true,
                    `Вы еще не добавляли биометрику в профиль с этого телефона. Или данные были удаленны, пожалуйста зайдите в ваш профиль и добавьте биометрические данные для входа`
                )
            } else {
                let signature = await this.createSignature()
                if (signature) {
                    this.props.toggleLoader(true)

                    this.props
                        .login(null, null, signature)
                        .then(() => {
                            pushNotifications.subscribeToPushNotifications(
                                this.props.session.user.id
                            )
                        })
                        .catch(error => {
                            this.props.toggleLoader(false)
                            if (error.error_description === 'Профиль не найден.') {
                                this.props.toggleSnackBar(true, 'Вы еще не добавляли биометрику в Профиле с этого телефона, пожалуйста, зайдите используя логин и пароль, затем в профиле добавьте биометрику')
                            } else {
                                this.props.toggleSnackBar(true, error.error_description || error.message || error)
                            }
                        })
                }
            }

        } else {
            this.showNotSupportMessage()
        }
    }

    changeSignature = async () => {
        let isSensorAvailable = await this.verifyIsSensorAvailable()

        if (isSensorAvailable) {
            let isKeyExists = await this.verifyIsKeyExists()

            if (isKeyExists) {
                await this.deleteKeys()
            }

            await this.createKeys()

            let signature = await this.createSignature()

            if (signature) {
                clientService.updateClientBiometrics(signature).then(
                    this.getCurrentClient()
                )
            }

        } else {
            this.showNotSupportMessage()
        }
    }

    getCurrentClient() {
        this.props.toggleLoader(true)
        this.props.fetchCurrentClient().then(() => {
            this.props.toggleLoader(false)
        }).catch(error => {
            this.props.toggleLoader(false)
        })
    }

    verifyIsSensorAvailable = async () => {
        let resultObject = await ReactNativeBiometrics.isSensorAvailable()
        const { available, biometryType } = resultObject
        return available &&
            (biometryType === ReactNativeBiometrics.TouchID
                || biometryType === ReactNativeBiometrics.FaceID
                || biometryType === ReactNativeBiometrics.Biometrics
            )
    }

    createKeys = async () => {
        let resultObject = await ReactNativeBiometrics.createKeys('NewSide fingerprint')
        const { publicKey } = resultObject
        console.log(`Key created: ${publicKey}`)
    }

    deleteKeys = async () => {
        let resultObject = await ReactNativeBiometrics.deleteKeys('NewSide fingerprint')
        const { keysDeleted } = resultObject
        console.log(`Key deleted: ${keysDeleted}`)
    }

    verifyIsKeyExists = async () => {
        let resultObject = await ReactNativeBiometrics.biometricKeysExist('NewSide fingerprint')
        const { keysExist } = resultObject
        console.log(`Key exists: ${keysExist}`)
        return keysExist
    }

    showNotSupportMessage = () => {
        this.props.toggleSnackBar(true, 'Ваш телефон не поддерживает биометрические параметры входа, и / или они не добавлены в настройки телефона')
    }

    createSignature = async () => {
        try {
            let resultObject = await ReactNativeBiometrics.createSignature({
                promptMessage: 'NewSide Biometric Signature',
                payload: 'NewSide Biometric Signature'
            })
            const { success, signature } = resultObject

            if (success) {
                return signature
            }

            return null;
        } catch (error) {
            this.props.toggleSnackBar(true, 'Биометрические данные были изменены, пожалуйста войдите в профиль с помощью пароля и измените биометрику')
            return null
        }
    }

    render() {
        return (
            <>
                {
                    this.props.isLogin ?
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => {
                                this.tryLogin()
                            }}>
                            <Image
                                source={images.faceId}
                                style={{ ...styles.faceIdIcon }}
                            />
                        </TouchableOpacity>
                        : <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => {
                                this.changeSignature()
                            }}
                            style={styles.button}>
                            <Text style={styles.buttonText}>
                                {
                                    this.props.currentClient && this.props.currentClient.biometricsSignature
                                        ? "изменить Биометрику"
                                        : "добавить Биометрику"
                                }
                            </Text>
                        </TouchableOpacity>
                }
            </>
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
    session: state.auth.session
})

const dispatchToProps = {
    login: authActions.login,
    toggleLoader: commonActions.toggleLoader,
    fetchCurrentClient: profileActions.fetchCurrentClient,
    toggleSnackBar: commonActions.toggleSnackBar
}

export default connect(stateToProps, dispatchToProps)(Biometrics)
