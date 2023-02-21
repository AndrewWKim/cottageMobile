import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native'
import { connect } from 'react-redux'
import commonStyles from '../../commonStyles'
import styles from './styles'
import dateToRuString from '../../../shared/utils/dateToRuString'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import ImagePicker from 'react-native-image-picker'
import clientService from '../../../shared/services/clientService'
import commonActions from '../../../store/actions/common'
import profileActions from '../../../store/actions/profile'

const imagePickerOptions = {
    title: 'Фото профиля',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
}

class ClientProfile extends Component {
    state = {
        clientPhoto: null,
    }

    componentDidMount() {
        this.getCurrentClient()

        this.props.navigation.addListener('focus', () => {
            this.getCurrentClient()
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', () => {
            this.getCurrentClient()
        })
    }

    checkCurrentClientHavePhoto = () => {
        if (this.props.currentClient.photoUrl) {
            this.setState({ clientPhoto: this.props.currentClient.photoUrl })
            return
        }
        this.setState({ clientPhoto: null })
    }

    getCurrentClient = () => {
        this.props.toggleLoader(true)
        this.props.fetchCurrentClient().then(() => {
            this.checkCurrentClientHavePhoto()
            this.props.toggleLoader(false)
        })
    }

    renderClientDataField = (label, value) => {
        return (
            <View
                style={{
                    ...styles.clientField,
                    width: this.props.isPortrait
                        ? Dimensions.get('window').width - 60
                        : Dimensions.get('window').width - 60,
                }}>
                <Text style={styles.clientFieldLabel}>{label}</Text>
                <Text style={styles.clientFieldValue}>{value}</Text>
            </View>
        )
    }

    addClientPhotoFromCamera = () => {
        ImagePicker.launchCamera(imagePickerOptions, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else {
                this.props.toggleLoader(true)
                const source = response.data
                const fileExtension = response.type.substring(
                    response.type.lastIndexOf('/') + 1,
                )

                let client = this.props.currentClient
                client.photoUrl = source
                client.photoExtension = fileExtension

                client.cottageId = client.cottage.id

                clientService.updateClient(client).then(() => {
                    this.getCurrentClient()
                })
            }
        })
    }

    addClientPhotoFromGalery = () => {
        ImagePicker.launchImageLibrary(imagePickerOptions, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else {
                this.props.toggleLoader(true)
                const source = response.data
                const fileExtension = response.type.substring(
                    response.type.lastIndexOf('/') + 1,
                )

                let client = this.props.currentClient
                client.photoUrl = source
                client.photoExtension = fileExtension

                client.cottageId = client.cottage.id

                clientService.updateClient(client).then(() => {
                    this.getCurrentClient()
                })
            }
        })
    }

    formatDateToRuString(date) {
        if (date) {
            return dateToRuString(date, 'D MMMM YYYY')
        }
        return 'Не указано.'
    }

    render() {
        return (
            <>
                <View style={{ ...commonStyles.centerScreen }}>
                    <ScrollView style={{ marginTop: 20 }}>
                        <View style={styles.photoSelectContainer}>
                            {this.state.clientPhoto ? (
                                <Image
                                    key={this.props.isPortrait}
                                    resizeMode="center"
                                    resizeMethod="auto"
                                    source={{
                                        uri: this.state.clientPhoto,
                                    }}
                                    style={{
                                        width: this.props.isPortrait
                                            ? Dimensions.get('window').width -
                                            60
                                            : Dimensions.get('window').width -
                                            60,
                                        height: this.props.isPortrait
                                            ? Dimensions.get('window').width -
                                            140
                                            : Dimensions.get('window').height /
                                            2,
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            ) : (
                                <View
                                    key={this.props.isPortrait}
                                    style={{
                                        ...styles.emptyPhoto,
                                        width: this.props.isPortrait
                                            ? Dimensions.get('window').width -
                                            60
                                            : Dimensions.get('window').width -
                                            60,
                                        height: this.props.isPortrait
                                            ? Dimensions.get('window').width -
                                            140
                                            : Dimensions.get('window').height /
                                            2,
                                    }}>
                                    <TabBarItem
                                        name="camera-outline"
                                        color={'#ededed'}
                                        size={100}
                                    />
                                </View>
                            )}
                            {this.state.clientPhoto ? (
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        this.setState({ clientPhoto: null })
                                    }
                                    style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        изменить фото
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.pickPhotoButtons}>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        activeOpacity={0.8}
                                        onPress={this.addClientPhotoFromCamera}
                                        style={styles.pickPhotoButton}>
                                        <Text style={{ ...styles.buttonText, fontSize: 12 }}>
                                            сделать фото
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.spacer} />
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        activeOpacity={0.8}
                                        onPress={this.addClientPhotoFromGalery}
                                        style={styles.pickPhotoButton}>
                                        <Text style={{ ...styles.buttonText, fontSize: 12 }}>
                                            загрузить из галереи
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        {this.renderClientDataField(
                            'Имя',
                            this.props.currentClient?.firstName,
                        )}
                        {this.renderClientDataField(
                            'Фамилия',
                            this.props.currentClient?.lastName,
                        )}
                        {this.props.currentClient?.clientType === 1 ? (
                            this.renderClientDataField(
                                'ИНН',
                                this.props.currentClient?.itn,
                            )
                        ) : (
                            <></>
                        )}
                        {this.renderClientDataField(
                            'Дата Рождения',
                            this.formatDateToRuString(
                                this.props.currentClient?.dateOfBirth,
                            ),
                        )}
                        {this.renderClientDataField(
                            'Контактный телефон',
                            '+38 ' + this.props.currentClient?.phoneNumber,
                        )}
                        {this.renderClientDataField(
                            'Дополнительная информация',
                            this.props.currentClient?.additionalInfo,
                        )}
                        <View style={styles.listBottomSpacer} />
                    </ScrollView>
                </View>
            </>
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    fetchCurrentClient: profileActions.fetchCurrentClient,
}

export default connect(stateToProps, dispatchToProps)(ClientProfile)
