import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import LoginStackNavigator from './LoginStackNavigator'
import HomeBottomTabBarNavigator from './HomeBottomTabNavigator'
import React, { Component } from 'react'
import { TouchableOpacity, Text, Dimensions } from 'react-native'
import commonActions from '../../store/actions/common'
import authActions from '../../store/actions/auth'
import { connect } from 'react-redux'
import styles from './styles'
import authService from '../../shared/services/authService'
import NetInfo from '@react-native-community/netinfo'
import NetConnectionError from '../NetConnectionError/NetConnectionError'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import GlobalFont from 'react-native-global-font'

const Stack = createStackNavigator()

class RootStackNavigator extends Component {
    state = {
        session: null,
        netConnected: true,
    }

    componentDidMount() {
        GlobalFont.applyGlobal('GothamPro')
        this.props.toggleLoader(true)

        authService
            .getSession()
            .then(session => {
                this.props.updateSession(session)
                this.props.toggleLoader(false)
            })
            .catch(error => {
                this.props.toggleLoader(false)
            })
        this.props.setIsPortrait(this.isPortrait())
        Dimensions.addEventListener(
            'change',
            async () => await this.props.setIsPortrait(this.isPortrait()),
        )
        NetInfo.fetch().then(networkState => {
            this.setState({
                netConnected:
                    networkState.isConnected &&
                    networkState.isInternetReachable,
            })
        })

        const unsubscribe = NetInfo.addEventListener(
            this.handleConnectivityChange,
        )

        this.props.setNetInfoUnsubscriber(unsubscribe)
    }

    handleConnectivityChange = networkState => {
        this.setState({
            netConnected:
                networkState.isConnected && networkState.isInternetReachable,
        })
    }

    componentWillUnmount() {
        if (this.props.netInfoUnsubscriber) {
            this.props.netInfoUnsubscriber()
        }
        Dimensions.removeEventListener(
            'change',
            async () => await this.props.setIsPortrait(this.isPortrait()),
        )
    }

    isPortrait = () => {
        const dim = Dimensions.get('screen')
        return dim.height >= dim.width
    }

    getHeaderTitle = routeName => {
        const titleContainer = title => {
            return <Text style={styles.headerTitle}>{title}</Text>
        }

        switch (routeName) {
            case 'News':
                return titleContainer('ТЕКУЩИЕ ГОЛОСОВАНИЯ')
            case 'Finance':
                return titleContainer('ФИНАНСОВЫЕ ВОПРОСЫ')
            case 'Ideas':
                return titleContainer('ИДЕЯ')
            case 'Security':
                return titleContainer('ОХРАНА')
            case 'Services':
                return titleContainer('УСЛУГИ')
            case 'Profile':
                return titleContainer('ПРОФИЛЬ')
            case 'PassRequest':
                return titleContainer('ЗАЯВКА НА ПРОПУСК')
            case 'VideoStreaming':
                return titleContainer('КАМЕРЫ НАБЛЮДЕНИЯ')
            default:
                return titleContainer('ТЕКУЩИЕ ГОЛОСОВАНИЯ')
        }
    }

    homeScreenOptions = (route, navigation) => {
        const routeName = route.state
            ? route.state.routes[route.state.index].name
            : route.params?.screen || 'News'
        return {
            headerTitle: this.getHeaderTitle(routeName),
            headerRight: () => (
                <TouchableOpacity
                    accessibilityRole="button"
                    style={{
                        marginRight: 20,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        this.props.toggleSecurityTab(false)
                        navigation.navigate('Home', { screen: 'Profile' })
                    }}>
                    <TabBarItem name="account-circle-outline" color={'#202020'} size={30} />
                </TouchableOpacity>
            ),
            headerLeft:
                route.state?.routes[route.state.index].state?.index === 1 && //if current page is Home -> Profile -> Questionnaires
                    route.state?.routes[route.state.index].state?.routes[1].state
                        ?.index === 1 //if current page is Questionnaires -> ResidentQuestionnarie
                    ? props => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => {
                                this.props.toggleSecurityTab(false)
                                this.props.questionnairesNavigator.goBack()
                            }}
                            labelVisible={false}
                            backImage={() => (
                                <TabBarItem
                                    name="arrow-left-circle-outline"
                                    color={'black'}
                                    size={30}
                                />
                            )}
                        />
                    )
                    : null,
            headerTitleAlign: 'left',
            headerStyle: styles.headerStyle,
            cardStyle: {
                backgroundColor: 'rgba(248,223,221,1)',
            },
            headerStatusBarHeight: 0,
        }
    }

    render() {
        return (
            <>
                {this.state.netConnected ? (
                    <>
                        <Stack.Navigator mode="modal">
                            {this.props.session ? (
                                <Stack.Screen
                                    name="Home"
                                    component={HomeBottomTabBarNavigator}
                                    options={({ route, navigation }) =>
                                        this.homeScreenOptions(
                                            route,
                                            navigation,
                                        )
                                    }
                                />
                            ) : (
                                <Stack.Screen
                                    name="Authentification"
                                    component={LoginStackNavigator}
                                    options={{ headerShown: false }}
                                />
                            )}
                        </Stack.Navigator>
                    </>
                ) : (
                    <NetConnectionError />
                )}
            </>
        )
    }
}

const stateToProps = state => ({
    securityVisible: state.common.securityVisible,
    isPortrait: state.common.isPortrait,
    session: state.auth.session,
    netInfoUnsubscriber: state.common.netInfoUnsubscriber,
    questionnairesNavigator: state.profile.questionnairesNavigator,
})

const dispatchToProps = {
    ...commonActions,
    updateSession: authActions.updateSession,
}

export default connect(stateToProps, dispatchToProps)(RootStackNavigator)
