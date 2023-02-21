import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, Dimensions, Image } from 'react-native'
import styles from './styles'
import images from '../../../res/images/images'

class PaymentCard extends Component {
    getCardPanString = cardPan => {
        let result = `**** **** **** ${cardPan.slice(cardPan.length - 4)}`
        return result
    }

    render = () => {
        return (
            <View
                style={{
                    ...styles.paymentCard,
                    width: Dimensions.get('window').width - 50,
                }}>
                <Text style={styles.cardMask}>
                    {this.getCardPanString(this.props.card.cardPan)}
                </Text>
                <View style={styles.cardLogosContainer}>
                    {
                        <>
                            {this.props.card.cardPan.charAt(0) === '4' ? (
                                <Image
                                    source={images.visa}
                                    style={{ ...styles.cardLogo }}
                                />
                            ) : (
                                <Image
                                    source={images.masterCard}
                                    style={{ ...styles.cardLogo }}
                                />
                            )}
                        </>
                    }
                </View>
                {/* <View style={styles.expDate}>
                    <Text style={styles.expDateValue}>
                        {this.props.card.cardExpMonth}
                    </Text>
                    <Text style={styles.expDateValue}>/</Text>
                    <Text style={styles.expDateValue}>
                        {this.props.card.cardExpYear}
                    </Text>
                </View> */}
            </View>
        )
    }
}

const stateToProps = state => ({
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(PaymentCard)
