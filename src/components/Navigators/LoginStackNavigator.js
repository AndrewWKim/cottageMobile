import { createStackNavigator } from '@react-navigation/stack'
import Login from '../Authentification/LogIn/Login'
import Registration from '../Authentification/Registration/Registration'
import ResetPassword from '../Authentification/ResetPassword/ResetPassword'
import React, { Component } from 'react'
import { connect } from 'react-redux'

const Stack = createStackNavigator()

class LoginStackNavigator extends Component {
    render() {
        return (
            <>
                <Stack.Navigator mode="modal">
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Registration"
                        component={Registration}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ResetPassword"
                        component={ResetPassword}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(LoginStackNavigator)
