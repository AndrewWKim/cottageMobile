import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import commonStyles from '../../commonStyles'

class Documents extends Component {
    render() {
        return (
            <>
                <View style={commonStyles.centerScreen}>
                    <Text style={commonStyles.developing}>В РАЗРАБОТКЕ</Text>
                </View>
            </>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(Documents)
