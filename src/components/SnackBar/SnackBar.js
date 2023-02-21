import React, { Component } from 'react'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import { Snackbar } from 'react-native-paper'
import { Platform, Alert } from 'react-native'
import styles from './styles'

class SnackBar extends Component {

    render() {
        if (Platform.OS === 'ios' && this.props.snackBarVisible) {
            Alert.alert(this.props.snackBarText, null, [{ text: 'Ок', onPress: () => this.props.toggleSnackBar(false) }])
        }
        return (
            <Snackbar
                visible={this.props.snackBarVisible}
                onDismiss={() => this.props.toggleSnackBar(false)}
                duration={1500}
                style={styles.snackbar}>
                {this.props.snackBarText}
            </Snackbar>
        )
    }
}

const stateToProps = state => ({
    snackBarVisible: state.common.snackBarVisible,
    snackBarText: state.common.snackBarText,
})

const dispatchToProps = {
    toggleSnackBar: commonActions.toggleSnackBar,
}

export default connect(stateToProps, dispatchToProps)(SnackBar)
