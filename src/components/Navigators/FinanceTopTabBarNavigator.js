import React, { Component } from 'react'
import Payments from '../Finance/Payments/Payments'
import Documents from '../Finance/Documents/Documents'
import Meters from '../Finance/Meters/Meters'
import TopTabBar from './TopTabBar/TopTabBar'
import { connect } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import NoPermission from '../NoPermission/NoPermission'
import commonActions from '../../store/actions/common'
import profileActions from '../../store/actions/profile'
import authActions from '../../store/actions/auth'

const Tab = createMaterialTopTabNavigator()

class FinanceTopTabBarNavigator extends Component {
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getCurrentClient()
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', () => {
            this.getCurrentClient()
        })
    }

    getCurrentClient() {
        this.props.toggleLoader(true)
        this.props.fetchCurrentClient().then(() => {
            this.props.toggleLoader(false)
        }).catch(error => {
            this.props.toggleLoader(false)
            this.props.logout()
        })
    }

    render() {
        return (
            <>
                {this.props.currentClient &&
                    !this.props.currentClient.canPay ? (
                    <NoPermission accessToTitle="финансовых операций" />
                ) : (
                    <Tab.Navigator
                        initialRouteName="Payments"
                        tabBar={props => <TopTabBar {...props} />}>
                        <Tab.Screen
                            name="Payments"
                            component={Payments}
                            options={{
                                tabBarLabel: 'Оплата',
                            }}
                        />
                        <Tab.Screen
                            name="Meters"
                            component={Meters}
                            options={{
                                tabBarLabel: 'Счетчики',
                            }}
                        />
                        <Tab.Screen
                            name="Documents"
                            component={Documents}
                            options={{
                                tabBarLabel: 'Документы',
                            }}
                        />
                    </Tab.Navigator>
                )}
            </>
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
})

const dispatchToProps = {
    ...commonActions,
    fetchCurrentClient: profileActions.fetchCurrentClient,
    logout: authActions.logout,
}

export default connect(stateToProps, dispatchToProps)(FinanceTopTabBarNavigator)
