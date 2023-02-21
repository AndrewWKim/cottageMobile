import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    Modal
} from 'react-native'
import Security from './Security'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from './styles'

class SecurityModal extends Component {
    /*state = {
        fadeAnim: new Animated.Value(0),
        zIndexAnim: new Animated.Value(0),
    }*/

    /*animateIn = () => {
        Animated.timing(this.state.zIndexAnim, {
            toValue: 40,
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
    }*/

    render() {
        return (
            <>
                <Modal
                    transparent={true}
                    animationType={'fade'}
                    visible={this.props.securityVisible}
                    statusBarTranslucent={true}>
                    <TouchableWithoutFeedback onPress={() => this.props.toggleSecurityTab(false)} style={{ zIndex: 1 }}>
                        <View style={styles.backgroundCover}>
                            <Security {...this.props} />
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    onPress={() =>
                        this.props.toggleSecurityTab(
                            !this.props.securityVisible,
                        )
                    }
                    style={{
                        ...styles.securityNavButton,
                        left: this.props.isPortrait ? '43%' : '45.5%',
                    }}>
                    <FontAwesomeIcon name="phone" color={'#1A1A1A'} size={25} />
                </TouchableOpacity> */}
            </>
        )
    }
}

const stateToProps = state => ({
    securityVisible: state.common.securityVisible,
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {
    toggleSecurityTab: commonActions.toggleSecurityTab,
}

export default connect(stateToProps, dispatchToProps)(SecurityModal)
