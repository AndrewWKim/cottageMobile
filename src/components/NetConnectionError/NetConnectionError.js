import React, { Component } from 'react'
import { Text, View } from 'react-native'
import commonStyles from '../commonStyles'

export default class NetConnectionError extends Component {
    render() {
        return (
            <>
                <View style={commonStyles.centerScreen}>
                    <Text style={commonStyles.developing}>
                        Подключите интернет для работы приложения.
                    </Text>
                </View>
            </>
        )
    }
}
