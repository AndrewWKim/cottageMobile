import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import profileActions from '../../store/actions/profile'
import passRequestActions from '../../store/actions/passRequest'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons'
import passRequestService from '../../shared/services/passRequest'
import { PASS_REQUEST_TYPE } from '../../shared/const/constants'
import VisitorRequest from './VisitorRequest'
import CarRequest from './CarRequest'
import dateToRuString from '../../shared/utils/dateToRuString'
import NewSideIcon from '../NewSideIcon/NewSideIcon'

class PassRequest extends Component {
    componentDidMount() {
        this.getPassRequests()

        this.props.navigation.addListener('focus', () => {
            this.getPassRequests()
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', () => {
            this.getPassRequests()
        })
    }

    getPassRequests = () => {
        this.props.toggleLoader(true)

        this.props.fetchCurrentClient().then(() => {
            this.props
                .fetchPassRequests(this.props.currentClient.cottage.id)
                .then(() => {
                    tthis.closeLoader()
                }).catch(error => {
                    this.closeLoader()
                })
        }).catch(error => {
            this.closeLoader()
        })
    }

    closeLoader = () => {
        setTimeout(() => this.props.toggleLoader(false), 2000)
    }

    onRemovePassRequest = id => {
        this.props.toggleLoader(true)

        passRequestService.deletePassRequest(id).then(() => {
            this.props
                .fetchPassRequests(this.props.currentClient.cottage.id)
                .then(() => {
                    this.props.toggleLoader(false)
                })
        })
    }

    renderItem = passRequest => {
        const isVisitor =
            passRequest.passRequestType == PASS_REQUEST_TYPE.visitor

        return (
            <View
                style={{
                    ...styles.passRequest,
                    width: this.props.isPortrait
                        ? Dimensions.get('window').width
                        : Dimensions.get('window').width,
                }}>
                {
                    /*isVisitor ? (
                        <Icon name="person-outline" color={'#444444'} size={40} />
                    ) : (
                        <TabBarItem
                            name="car-hatchback"
                            color={'#444444'}
                            size={40}
                        />
                    )*/
                }
                <View style={{
                    marginHorizontal: 20,
                    width: this.props.isPortrait
                        ? Dimensions.get('window').width - 200
                        : Dimensions.get('window').width - 200,
                }}>
                    {
                        isVisitor ? (
                            <Text style={styles.requestInfo}>
                                {passRequest.visitorName}
                            </Text>
                        ) : (
                            <Text style={styles.requestInfo}>
                                {passRequest.carBrand} {passRequest.carModel}{' '}
                                {passRequest.carLicensePlate}
                            </Text>
                        )
                    }
                    {
                        passRequest.additionalInfo ? (
                            <Text style={{ ...styles.requestData, marginBottom: 4 }}>
                                {passRequest.additionalInfo}
                            </Text>
                        ) : (
                            <></>
                        )
                    }
                    <Text style={styles.requestData}>
                        {dateToRuString(passRequest.visitDate, 'DD MMMM')} -{' '}
                        {passRequest.visitTime}
                    </Text>
                </View>
                <View style={{ flex: 4 }} />
                <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    onPress={() => this.onRemovePassRequest(passRequest.id)}
                    style={styles.deleteButton}>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 'bold'
                        }}>
                        удалить
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.passRequests}>
                <View style={styles.typeIcons}>
                    {
                        Platform.OS === 'ios' ? <Icon
                            name="person-outline"
                            color={'#202020'}
                            size={120}
                            style={{ marginBottom: -22 }}
                        />
                            : <NewSideIcon
                                name="user"
                                color={'#202020'}
                                size={100}
                            />
                    }
                    {/*<View style={styles.spacer} />
           <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            onPress={() => this.props.setPassRequestType(PASS_REQUEST_TYPE.car)}
            style={this.props.passRequestType === PASS_REQUEST_TYPE.car ? styles.selectedIcon : styles.icon}>
            <TabBarItem name="car-hatchback" color={this.props.passRequestType === PASS_REQUEST_TYPE.car ? 'white' : '#444444'} size={80} />
          </TouchableOpacity> */}
                </View>
                {
                    this.props.passRequestType === PASS_REQUEST_TYPE.visitor ? (
                        <VisitorRequest />
                    ) : this.props.passRequestType === PASS_REQUEST_TYPE.car ? (
                        <CarRequest />
                    ) : this.props.passRequests && this.props.passRequests.length > 0
                        ? <>
                            <FlatList
                                style={styles.requestList}
                                data={this.props.passRequests}
                                renderItem={({ item }) => this.renderItem(item)}
                            />

                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                onPress={() =>
                                    this.props.setPassRequestType(
                                        PASS_REQUEST_TYPE.visitor,
                                    )
                                }
                                style={{ ...styles.transparentButton, marginTop: 20, marginBottom: 20 }}>
                                <Text style={styles.transparentButtonText}>создать заявку</Text>
                            </TouchableOpacity>
                        </>
                        : <View style={{ ...styles.requestList, aligntItems: 'center', justifyContent: 'space-between', flex: 1, paddingBottom: 30 }}>
                            <View></View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#202020', textAlign: 'center' }}>ЗАЯВОК НЕТ</Text>
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                onPress={() =>
                                    this.props.setPassRequestType(
                                        PASS_REQUEST_TYPE.visitor,
                                    )
                                }
                                style={{ ...styles.transparentButton }}>
                                <Text style={styles.transparentButtonText}>создать заявку</Text>
                            </TouchableOpacity>
                        </View>
                }
            </View >
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
    passRequests: state.passRequest.passRequests,
    passRequestType: state.passRequest.passRequestType,
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    fetchCurrentClient: profileActions.fetchCurrentClient,
    ...passRequestActions,
}

export default connect(stateToProps, dispatchToProps)(PassRequest)
