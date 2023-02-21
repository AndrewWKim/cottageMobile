import React, { Component } from 'react'
import OneSignal from 'react-native-onesignal'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import 'react-native-gesture-handler'
import RootStackNavigator from './src/components/Navigators/RootStackNavigator'
import { Provider } from 'react-redux'
import { configureStore } from './src/store'
import Loader from './src/components/Loader/Loader'
import SnackBar from './src/components/SnackBar/SnackBar'
import { StatusBar, Platform } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import NewCardDialog from './src/components/Profile/NewCardDialog/NewCardDialog'
import { ONESIGNAL_ID } from './src/shared/const/constants'
import LinearGradient from 'react-native-linear-gradient'

const store = configureStore()

const transparentTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
        primary: 'transparent',
        card: 'transparent'
    },
};

export default class CottageMobApp extends Component {
    constructor(properties) {
        super(properties)
        OneSignal.init(ONESIGNAL_ID, {
            kOSSettingsKeyAutoPrompt: false,
            kOSSettingsKeyInAppLaunchURL: false,
            kOSSettingsKeyInFocusDisplayOption: 2,
        })
        OneSignal.inFocusDisplaying(2)
    }

    componentDidMount() {
        StatusBar.setHidden(false);
        StatusBar.setBackgroundColor('rgba(248,223,221,1)');
        StatusBar.setTranslucent(true);
    }

    render() {
        console.disableYellowBox = true
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <Loader />
                    <SnackBar />
                    <NewCardDialog />
                    {
                        Platform.OS !== 'ios'
                            ? <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(191,172,226,1)' }}>
                                <NavigationContainer theme={transparentTheme}>
                                    <RootStackNavigator />
                                </NavigationContainer>
                            </SafeAreaView>
                            : <>
                                <SafeAreaView style={{ flex: 0, backgroundColor: 'rgba(248,223,221,1)' }}></SafeAreaView>
                                <SafeAreaView style={{ flex: 1, backgroundColor: '#202020' }}>
                                    <NavigationContainer theme={transparentTheme}>
                                        <RootStackNavigator />
                                    </NavigationContainer>
                                </SafeAreaView>
                            </>
                    }

                </Provider>
            </SafeAreaProvider>
        )
    }
}
