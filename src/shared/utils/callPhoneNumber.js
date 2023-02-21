import React from 'react'
import { Linking, Platform } from 'react-native'

export default callPhoneNumber = phone => {
    let phoneNumber = phone

    /*if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`
    }
    else {*/
    phoneNumber = `tel:${phone}`
    //}

    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                console.log('Phone number is not available')
            } else {
                return Linking.openURL(phoneNumber)
            }
        })
        .catch(err => console.log(err))
}
