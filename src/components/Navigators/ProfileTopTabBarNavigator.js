import React, { Component } from 'react'
import ClientProfile from '../Profile/ClientProfile/ClientProfile'
import QuestionnaireStackNavigator from './QuestionnaireStackNavigator'
import Settings from '../Profile/Settings/Settings'
import TopTabBar from './TopTabBar/TopTabBar'
import { connect } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import LinearGradient from 'react-native-linear-gradient'

const Tab = createMaterialTopTabNavigator()

class ProfileTopTabBarNavigator extends Component {
    componentDidMount() { }

    render() {
        return (
            <Tab.Navigator
                initialRouteName="ClientProfile"
                tabBar={props => <TopTabBar {...props} />}>
                <Tab.Screen
                    name="ClientProfile"
                    component={ClientProfile}
                    options={{
                        tabBarLabel: 'Мои данные',
                    }}
                />
                <Tab.Screen
                    name="QuestionnaireStackNavigator"
                    component={QuestionnaireStackNavigator}
                    options={{
                        tabBarLabel: 'Анкеты',
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        tabBarLabel: 'Настройки',
                    }}
                />
            </Tab.Navigator>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(ProfileTopTabBarNavigator)
