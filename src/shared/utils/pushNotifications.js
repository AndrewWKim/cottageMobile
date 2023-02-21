import OneSignal from 'react-native-onesignal'
import { Platform } from 'react-native'
import deviceService from '../services/deviceService'
import commonActions from '../../store/actions/common'
import { store } from '../../../Cottage'


const subscribeToPushNotifications = userId => {
    let retry = 1
    const subscribe = () => {
        OneSignal.setSubscription(true)
        OneSignal.getPermissionSubscriptionState(state => {
            deviceService
                .subscribeDevice(userId, state.userId)
                .catch(error => {
                    if (error.playerId) {
                        if (retry) {
                            retry--
                            setTimeout(subscribe, 1000)
                        } else {
                            store.dispatch(commonActions.toggleSnackBar(true, error.playerId[0]))
                        }
                    }
                }
                )
        })
    }
    if (Platform.OS === 'ios') {
        OneSignal.promptForPushNotificationsWithUserResponse(res => {
            if (res) subscribe()
        })
    } else {
        subscribe()
    }
}

const unsubscribeFromPushNotifications = () => {
    OneSignal.setSubscription(false)
    OneSignal.getPermissionSubscriptionState(state => {
        deviceService.unsubscribeDevice(state.userId)
    })
}

const pushNotifications = {
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
}

export default pushNotifications
