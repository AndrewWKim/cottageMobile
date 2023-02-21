import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import NewsTabNavigator from './NewsTabNavigator'
import CottageServices from '../CottageServices/CottageServices'
import ProfileTopTabBarNavigator from './ProfileTopTabBarNavigator'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeBottomTabBar from './HomeBottomTabBar/HomeBottomTabBar'
import FinanceTopTabBarNavigator from './FinanceTopTabBarNavigator'
import PassRequest from '../PassRequest/PassRequest'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import SecurityModal from '../Security/SecurityModal'
import VideoStreaming from '../VideoStreaming/VideoStreaming'
import profileActions from '../../store/actions/profile'
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog'
import IdeasTabNavigator from './IdeasTabNavigator'
import authActions from '../../store/actions/auth'
import PaymentPageModal from '../Finance/PaymentPageModal/PaymentPageModal'
import LinearGradient from 'react-native-linear-gradient'
import NewSideIcon from '../NewSideIcon/NewSideIcon'
import SelectorModal from "../Selector/SelectorModal";
import RulesPageModal from "../Security/RulesPageModal";


const Tab = createBottomTabNavigator()

class HomeBottomTabBarNavigator extends Component {
    componentDidMount() {
        this.props.toggleLoader(true)
        this.props
            .fetchCurrentClient()
            .then(() => {
                this.props.toggleLoader(false)
            })
            .catch(error => {
                this.props.toggleLoader(false)
                this.props.logout()
            })
    }

    render() {
        return (
            <LinearGradient style={{ flex: 1 }}
                colors={['rgba(107,79,158,1)', 'rgba(142,120,181,1)', 'rgba(191,172,226,1)', 'rgba(229,202,243,1)', 'rgba(248,223,221,1)']}
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
                <RulesPageModal/>
                <PaymentPageModal />
                <SecurityModal {...this.props} />
                <ConfirmationDialog />
                <SelectorModal />
                <Tab.Navigator
                    initialRouteName="News"
                    tabBarOptions={{
                        activeTintColor: '#6B4F9E',
                    }}
                    tabBar={props => (
                        <HomeBottomTabBar
                            {...props}
                            toggleSecurityTab={this.props.toggleSecurityTab}
                            unopenedCount={
                                this.props.unopenedIdeasCount +
                                this.props.unopenedNewsCount
                            }
                            unpaidCommunalBillsCount={
                                this.props.currentClient?.canPay
                                    ? this.props.unpaidCommunalBillsCount
                                    : 0
                            }
                            currentClientUploaded={
                                this.props.currentClient !== null
                            }
                            securityVisible={this.props.securityVisible}
                        />
                    )}>
                    <Tab.Screen
                        name="News"
                        component={NewsTabNavigator}
                        options={{
                            tabBarLabel: 'Новости',
                            tabBarIcon: () => (
                                Platform.OS !== 'ios'
                                    ? <NewSideIcon
                                        name="chat"
                                        color={color}
                                        size={size}
                                    />
                                    :
                                    <TabBarItem
                                        name="forum"
                                        color={color}
                                        size={size}
                                    />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Finance"
                        component={FinanceTopTabBarNavigator}
                        options={{
                            tabBarLabel: 'Финансы',
                            tabBarIcon: () => (
                                Platform.OS !== 'ios'
                                    ? <NewSideIcon
                                        name="credit-card"
                                        color={color}
                                        size={size}
                                    />
                                    : <TabBarItem
                                        name="credit-card-multiple"
                                        color={color}
                                        size={size}
                                    />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Security"
                        component={SecurityModal}
                        options={{
                            tabBarLabel: 'Меню',
                            tabBarIcon: () => (
                                Platform.OS !== 'ios'
                                    ? <NewSideIcon
                                        name="menu"
                                        color={color}
                                        size={size}
                                    />
                                    : <TabBarItem
                                        name="border-all"
                                        color={color}
                                        size={size}
                                    />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Services"
                        component={CottageServices}
                        options={{
                            tabBarLabel: 'Услуги',
                            tabBarIcon: () => (
                                Platform.OS !== 'ios'
                                    ? <NewSideIcon
                                        name="contact-form"
                                        color={color}
                                        size={size}
                                    />
                                    : <TabBarItem
                                        name="clipboard-text"
                                        color={color}
                                        size={size}
                                    />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Ideas"
                        component={IdeasTabNavigator}
                        options={{
                            tabBarLabel: 'Идея',
                            tabBarIcon: () => (
                                Platform.OS !== 'ios'
                                    ? <NewSideIcon
                                        name="idea"
                                        color={color}
                                        size={size}
                                    />
                                    : <TabBarItem
                                        name="lightbulb-on"
                                        color={color}
                                        size={size}
                                    />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileTopTabBarNavigator}
                    />
                    <Tab.Screen name="PassRequest" component={PassRequest} />
                    <Tab.Screen
                        name="VideoStreaming"
                        component={VideoStreaming}
                    />
                </Tab.Navigator>
            </LinearGradient>
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
    unopenedIdeasCount: state.common.unopenedIdeasCount,
    unopenedNewsCount: state.common.unopenedNewsCount,
    unpaidCommunalBillsCount: state.common.unpaidCommunalBillsCount,
    securityVisible: state.common.securityVisible,
})

const dispatchToProps = {
    ...commonActions,
    fetchCurrentClient: profileActions.fetchCurrentClient,
    logout: authActions.logout,
}

export default connect(stateToProps, dispatchToProps)(HomeBottomTabBarNavigator)
