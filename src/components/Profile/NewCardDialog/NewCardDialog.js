import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    Animated,
    Image,
    TextInput,
    ScrollView,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import commonActions from '../../../store/actions/common'
import styles from './styles'
import clientService from '../../../shared/services/clientService'
import images from '../../../res/images/images'

const initialState = {
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    fadeAnim: new Animated.Value(0),
    zIndexAnim: new Animated.Value(0),
    scaleAnim: new Animated.Value(0),
}

class NewCardDialog extends Component {
    state = initialState

    animateIn = () => {
        Animated.timing(this.state.zIndexAnim, {
            toValue: 5,
            duration: 1,
            useNativeDriver: false,
        }).start()
        Animated.timing(this.state.fadeAnim, {
            toValue: 40,
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

    animateCardIn = () => {
        Animated.timing(this.state.scaleAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start()
    }

    animateCardOut = () => {
        Animated.timing(this.state.scaleAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start()
    }

    saveCard = () => {
        this.props.toggleLoader(true)

        const { cardNumber, cardExpMonth, cardExpYear } = this.state

        const card = {
            cardNumber,
            cardExpMonth,
            cardExpYear,
        }

        clientService
            .createClientCard(this.props.currentClient.id, card)
            .then(() => {
                this.props.toggleLoader(false)
                this.props.toggleNewCardDialog(false)
                this.setState(initialState)
                this.props.toggleSnackBar(true, 'Карта успешно добавлена')
            })
            .catch(error => {
                this.props.toggleLoader(false)
                if (error.сardNumber) {
                    this.props.toggleSnackBar(
                        true,
                        'Карта уже добавлена для этого клиента.',
                    )
                } else {
                    this.props.toggleSnackBar(true, 'Произошла ошибка.')
                }
            })
    }

    isFormValid = () => {
        const { cardNumber, cardExpMonth, cardExpYear } = this.state
        return (
            cardNumber != '' &&
            cardExpMonth != '' &&
            cardExpYear != '' &&
            cardNumber.length === 16 &&
            cardExpMonth.length === 2 &&
            cardExpYear.length === 2 &&
            Number.parseInt(cardExpMonth) <= 12
        )
    }

    renderCard = () => {
        this.props.newCardDialogVisible
            ? this.animateCardIn()
            : this.animateCardOut()

        return (
            <Animated.View
                style={
                    this.props.isPortrait
                        ? {
                              ...styles.cardPortrait,
                              transform: [
                                  {
                                      scale: this.state.scaleAnim,
                                  },
                              ],
                              opacity: this.state.fadeAnim,
                              zIndex: this.state.zIndexAnim,
                          }
                        : {
                              ...styles.cardLandscape,
                              transform: [
                                  {
                                      scale: this.state.scaleAnim,
                                  },
                              ],
                              opacity: this.state.fadeAnim,
                              zIndex: this.state.zIndexAnim,
                          }
                }>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.cardLogosContainer}>
                        {this.state.cardNumber ? (
                            this.state.cardNumber.charAt(0) === '4' ? (
                                <Image
                                    source={images.visa}
                                    style={{ ...styles.cardLogo }}
                                />
                            ) : (
                                <Image
                                    source={images.masterCard}
                                    style={{ ...styles.cardLogo }}
                                />
                            )
                        ) : (
                            <>
                                <Image
                                    source={images.visa}
                                    style={{ ...styles.cardLogo }}
                                />
                                <Image
                                    source={images.masterCard}
                                    style={{ ...styles.cardLogo }}
                                />
                            </>
                        )}
                    </View>
                    <TextInput
                        value={this.state.cardNumber}
                        onChangeText={cardNumber =>
                            this.setState({ cardNumber })
                        }
                        placeholder="5555 5555 5555 5555"
                        placeholderTextColor="#999999"
                        keyboardType="numeric"
                        style={
                            this.props.isPortrait
                                ? { ...styles.input }
                                : { ...styles.inputLandscape }
                        }
                        maxLength={16}
                    />
                    <View style={styles.expDate}>
                        <TextInput
                            value={this.state.cardExpMonth}
                            onChangeText={cardExpMonth =>
                                this.setState({ cardExpMonth })
                            }
                            placeholder="мм"
                            placeholderTextColor="#999999"
                            keyboardType="numeric"
                            style={{
                                ...styles.inputExpDate,
                                borderColor: 'black',
                            }}
                            maxLength={2}
                        />
                        <Text>/</Text>
                        <TextInput
                            value={this.state.cardExpYear}
                            onChangeText={cardExpYear =>
                                this.setState({ cardExpYear })
                            }
                            placeholder="гг"
                            placeholderTextColor="#999999"
                            keyboardType="numeric"
                            style={{
                                ...styles.inputExpDate,
                                borderColor: 'black',
                            }}
                            maxLength={2}
                        />
                    </View>
                    <TouchableOpacity
                        accessibilityRole="button"
                        activeOpacity={0.8}
                        onPress={this.saveCard}
                        style={
                            this.isFormValid()
                                ? styles.button
                                : styles.disableButton
                        }
                        disabled={!this.isFormValid()}>
                        <Text style={styles.buttonText}>Сохранить</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        )
    }

    render() {
        this.props.newCardDialogVisible ? this.animateIn() : this.animateOut()

        return (
            <>
                {
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                            this.props.toggleNewCardDialog(false)
                        }}>
                        <Animated.View
                            style={{
                                ...styles.backdropStyleWithoutAnimation,
                                opacity: this.state.fadeAnim,
                                zIndex: this.state.zIndexAnim,
                            }}></Animated.View>
                    </TouchableWithoutFeedback>
                }
                {this.renderCard()}
            </>
        )
    }
}

const stateToProps = state => ({
    newCardDialogVisible: state.common.newCardDialogVisible,
    isPortrait: state.common.isPortrait,
    currentClient: state.profile.currentClient,
})

const dispatchToProps = {
    ...commonActions,
}

export default connect(stateToProps, dispatchToProps)(NewCardDialog)
