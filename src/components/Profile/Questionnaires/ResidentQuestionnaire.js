import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native'
import { connect } from 'react-redux'
import commonStyles from '../../commonStyles'
import commonActions from '../../../store/actions/common'
import profileActions from '../../../store/actions/profile'
import styles from './styles'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import commonServise from '../../../shared/services/commonService'
import CheckBox from '@react-native-community/checkbox'
import cottageService from '../../../shared/services/cottageService'
import clientService from '../../../shared/services/clientService'
import RNPickerSelect from 'react-native-picker-select'
import ImagePicker from 'react-native-image-picker'
import dateToRuString from '../../../shared/utils/dateToRuString'
import { CLIENT_TYPE } from '../../../shared/const/constants'
import LinearGradient from 'react-native-linear-gradient'
import SelectorButton from "../../Selector/SelectorButton";

const imagePickerOptions = {
    title: 'Фото профиля',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
}

class ResidentQuestionnaire extends Component {
    state = {
        clientPhoto: null,
        photoUrl: false,
        fileExtension: null,
        residentTypes: [],
        isMainSecurityContact: false,
        residentTypeId: null,
        clientType: null,
        canVote: false,
        canPay: false
    }

    componentDidMount() {
        this.props.toggleLoader(true)
        commonServise.getResidentTypes().then(residentTypes => {
            this.setState({
                residentTypes: residentTypes,
                isMainSecurityContact:
                    this.props.currentResident.cottage.mainSecurityContactId ===
                    this.props.currentResident.id,
                residentTypeId: this.props.currentResident.residentTypeId,
                clientType: this.props.currentResident.clientType,
                canVote: this.props.currentResident.canVote,
                canPay: this.props.currentResident.canPay
            })
            this.props.toggleLoader(false)
        })
        this.checkCurrentResidentHavePhoto()
    }

    checkCurrentResidentHavePhoto = () => {
        if (this.props.currentResident.photoUrl) {
            this.setState({ clientPhoto: this.props.currentResident.photoUrl, photoUrl: true })
            return
        }
        this.setState({ clientPhoto: null, photoUrl: false })
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
                const source = response.data
                const fileExtension = response.type.substring(
                    response.type.lastIndexOf('/') + 1,
                )
                this.setState({
                    clientPhoto: source,
                    fileExtension: fileExtension,
                    photoUrl: false,
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
                const source = response.data
                const fileExtension = response.type.substring(
                    response.type.lastIndexOf('/') + 1,
                )
                this.setState({
                    clientPhoto: source,
                    fileExtension: fileExtension,
                    photoUrl: false,
                })
            }
        })
    }

    setIsMainSecurityContact = () => {
        this.setState({
            isMainSecurityContact: !this.state.isMainSecurityContact,
        })
    }

    toggleClientType = () => {
        this.setState({
            clientType: this.state.clientType === CLIENT_TYPE.mainResident ? CLIENT_TYPE.resident : CLIENT_TYPE.mainResident,
            canVote: false,
            canPay: false
        })
    }

    toggleCanVote = () => {
        this.setState({
            canVote: !this.state.canVote
        })
    }

    toggleCanPay = () => {
        this.setState({
            canPay: !this.state.canPay
        })
    }

    renderPickerItem = residentType => {
        const isFocused = this.state.residentTypeId === residentType.id
        return {
            title: residentType.type,
            value: residentType.id,
            color: isFocused ? '#1A1A1A' : '#7D7D7D',
            isFocused
        }
    }

    onResidentTypeIdChange = itemValue => {
        this.setState({...this.state,
            residentTypeId: itemValue,
        })
    }

    renderResidentTypeSelect = () => {
        const options = this.state.residentTypes.map(residentType => this.renderPickerItem(residentType))

        return (
                <SelectorButton options={options} onItemSelect={this.onResidentTypeIdChange} />
        )
    }

    updateClient = async () => {
        this.props.toggleLoader(true)
        let client = this.props.currentResident
        let cottage = this.props.currentResident.cottage
        const isCurrentClientMainContact =
            client.cottage.mainSecurityContactId === client.id

        client.cottageId = client.cottage.id
        client.residentTypeId = this.state.residentTypeId
        client.photoUrl = this.state.clientPhoto
        client.photoExtension = this.state.fileExtension
        client.clientType = this.state.clientType
        client.canVote = this.state.canVote
        client.canPay = this.state.canPay

        if (
            (isCurrentClientMainContact && !this.state.isMainSecurityContact) ||
            (!isCurrentClientMainContact && this.state.isMainSecurityContact)
        ) {
            cottage.mainSecurityContactId = this.state.isMainSecurityContact
                ? client.id
                : null
            await cottageService.updateCottage(cottage)
        }

        clientService
            .updateClient(client)
            .then(() => {
                this.props.navigation.navigate('Questionnaires')
            })
            .catch(error => {
                this.props.toggleLoader(false)
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
            <LinearGradient style={{ flex: 1 }}
                colors={['rgba(107,79,158,1)', 'rgba(142,120,181,1)', 'rgba(191,172,226,1)', 'rgba(229,202,243,1)', 'rgba(248,223,221,1)']}
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
                <View style={{ ...commonStyles.centerScreen }}>
                    <ScrollView style={{ marginTop: 20 }}>
                        <View style={styles.photoSelectContainer}>
                            {this.state.clientPhoto ? (
                                <Image
                                    resizeMode="center"
                                    resizeMethod="auto"
                                    source={
                                        this.state.photoUrl
                                            ? { uri: this.state.clientPhoto }
                                            : { uri: `data:image/${this.state.photoExtension};base64,${this.state.clientPhoto}` }
                                    }
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
                                        borderRadius: 20,
                                    }}
                                />
                            ) : (
                                <View
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
                            {
                                this.state.clientPhoto ? (
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
                                )
                            }
                        </View>
                        {
                            this.renderClientDataField(
                                'Имя',
                                this.props.currentResident.firstName,
                            )
                        }
                        {
                            this.renderClientDataField(
                                'Фамилия',
                                this.props.currentResident.lastName,
                            )
                        }
                        {
                            this.renderClientDataField(
                                'Дата Рождения',
                                this.formatDateToRuString(
                                    this.props.currentResident.dateOfBirth,
                                ),
                            )
                        }
                        {
                            this.renderClientDataField(
                                'Паспорт',
                                this.props.currentResident.passport.replace(
                                    '/',
                                    '',
                                ),
                            )
                        }
                        {
                            this.renderClientDataField(
                                'Контактный телефон',
                                '+38 ' + this.props.currentResident.phoneNumber,
                            )
                        }
                        <View
                            style={{
                                ...styles.clientField,
                                width: this.props.isPortrait
                                    ? Dimensions.get('window').width - 60
                                    : Dimensions.get('window').width - 60,
                                borderBottomWidth: 0
                            }}>
                            <Text style={styles.clientFieldLabel}>Статус</Text>
                            {this.renderResidentTypeSelect()}
                        </View>
                        {
                            this.renderClientDataField(
                                'Дополнительная информация',
                                this.props.currentResident.additionalInfo,
                            )
                        }
                        <View style={styles.securityCheckbox}>
                            <Text style={{ color: '#494949', fontSize: 18, fontWeight: 'bold' }}>
                                Основной контакт для охраны
                            </Text>
                            <View style={styles.spacer}></View>
                            <CheckBox
                                disabled={false}
                                value={this.state.isMainSecurityContact}
                                onValueChange={() => this.setIsMainSecurityContact()}
                                boxType={'square'}
                                tintColors={{
                                    true: '#202020',
                                }}
                                onCheckColor={'#202020'}
                                onFillColor={'white'}
                                onTintColor={'#202020'}
                            />
                        </View>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => this.toggleClientType()}
                            style={styles.activeButton}>
                            <Text style={styles.buttonText}>
                                {
                                    this.state.clientType === CLIENT_TYPE.mainResident
                                        ? 'деактивировать'
                                        : 'активировать'
                                }
                            </Text>
                        </TouchableOpacity>
                        {
                            this.state.clientType === CLIENT_TYPE.mainResident
                                ?
                                <>
                                    <View style={styles.securityCheckbox}>
                                        <Text style={{ color: '#494949', fontSize: 18, fontWeight: 'bold' }}>
                                            Оплачивать комм. платежи
                                        </Text>
                                        <View style={styles.spacer}></View>
                                        <CheckBox
                                            disabled={false}
                                            value={this.state.canPay}
                                            onValueChange={() => this.toggleCanPay()}
                                            boxType={'square'}
                                            tintColors={{
                                                true: '#202020',
                                            }}
                                            onCheckColor={'#202020'}
                                            onFillColor={'white'}
                                            onTintColor={'#202020'}
                                        />
                                    </View>
                                    <View style={styles.securityCheckbox}>
                                        <Text style={{ color: '#494949', fontSize: 18, fontWeight: 'bold' }}>
                                            Голосовать
                                        </Text>
                                        <View style={styles.spacer}></View>
                                        <CheckBox
                                            disabled={false}
                                            value={this.state.canVote}
                                            onValueChange={() => this.toggleCanVote()}
                                            boxType={'square'}
                                            tintColors={{
                                                true: '#202020',
                                            }}
                                            onCheckColor={'#202020'}
                                            onFillColor={'white'}
                                            onTintColor={'#202020'}
                                        />
                                    </View>
                                </>
                                : <></>
                        }
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => this.updateClient()}
                            style={styles.saveButton}>
                            <Text style={styles.buttonText}>
                                сохранить изменения
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.listBottomSpacer} />
                    </ScrollView>
                </View>
            </LinearGradient>
        )
    }
}

const stateToProps = state => ({
    currentResident: state.profile.currentResident,
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    ...profileActions,
}

export default connect(stateToProps, dispatchToProps)(ResidentQuestionnaire)
