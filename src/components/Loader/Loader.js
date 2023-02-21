import React, { Component } from 'react'
import { View, Modal, ActivityIndicator } from 'react-native'
import styles from './styles'
import { connect } from 'react-redux'

class Loader extends Component {
    render() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.loaderVisible}
                statusBarTranslucent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={this.props.loaderVisible}
                            size="large"
                            color="#FFFFFF"
                        />
                    </View>
                </View>
            </Modal>
        )
    }
}

const stateToProps = state => ({
    loaderVisible: state.common.loaderVisible,
})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(Loader)
