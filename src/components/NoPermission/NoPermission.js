import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import authActions from '../../store/actions/auth'
import commonStyles from '../commonStyles'

class NoPermission extends Component {
    render() {
        return (
            <>
                <View style={commonStyles.centerScreen}>
                    <Text style={commonStyles.developing}>
                        У вас нет доступа для {this.props.accessToTitle}.
                    </Text>
                </View>
            </>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(NoPermission)
