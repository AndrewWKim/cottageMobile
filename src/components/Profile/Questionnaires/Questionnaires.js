import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import commonActions from '../../../store/actions/common'
import profileActions from '../../../store/actions/profile'
import styles from './styles'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import commonServise from '../../../shared/services/commonService'
import LinearGradient from 'react-native-linear-gradient'

class Questionnaires extends Component {
    state = {
        residentTypes: [],
    }

    componentDidMount() {
        this.getCottageClients()
        this.props.setQuestionnairesNavigator(this.props.navigation)
        this.props.navigation.addListener('focus', () => {
            this.getCottageClients()
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', () => {
            this.getCottageClients()
        })
    }

    getCottageClients = () => {
        this.props.toggleLoader(true)
        Promise.all([
            commonServise.getResidentTypes(),
            this.props.fetchCottageClients(this.props.currentClient.cottage.id),
        ]).then(([residentTypes, response]) => {
            this.setState({ residentTypes: residentTypes })
            this.props.toggleLoader(false)
        })
    }

    getResidentType = residentTypeId => {
        var residentType = this.state.residentTypes.find(
            rt => rt.id == residentTypeId,
        )
        if (!residentType) {
            return 'Владелец'
        }
        return residentType.type
    }

    renderCottageClientInfo = item => {
        return (
            <>
                <View
                    style={{
                        ...styles.item,
                        width: this.props.isPortrait
                            ? Dimensions.get('window').width
                            : Dimensions.get('window').width,
                    }}>
                    <View style={styles.row}>
                        {item.cottage.mainSecurityContactId === item.id ? (
                            <TabBarItem
                                name="bell-outline"
                                color={'#4A4A4A'}
                                size={25}
                                style={{
                                    ...styles.bell,
                                    left: this.props.isPortrait ? '0%' : '0%',
                                }}
                            />
                        ) : (
                            <></>
                        )}
                        <View>
                            <Text style={styles.clientFullName}>
                                {item.firstName} {item.lastName}
                            </Text>
                            <Text style={styles.residentType}>
                                {this.getResidentType(item.residentTypeId)}
                            </Text>
                        </View>
                        <View style={styles.spacer} />
                        {
                            !this.props.currentClient.residentTypeId ?
                                <TouchableOpacity
                                    accessibilityRole="link"
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        this.props.toggleLoader(true)
                                        this.props
                                            .fetchCurrentResident(item.id)
                                            .then(() => {
                                                this.props.navigation.navigate(
                                                    'ResidentQuestionnaire',
                                                )
                                            })
                                    }}>
                                    <View style={styles.editButton}>
                                        <TabBarItem
                                            name="pencil-outline"
                                            color={'white'}
                                            size={25}
                                        />
                                    </View>
                                </TouchableOpacity>
                                : <></>
                        }
                    </View>
                </View>
            </>
        )
    }

    render() {
        return (
            <LinearGradient style={{ flex: 1 }}
                colors={['rgba(107,79,158,1)', 'rgba(142,120,181,1)', 'rgba(191,172,226,1)', 'rgba(229,202,243,1)', 'rgba(248,223,221,1)']}
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
                <ScrollView style={styles.clientList}>
                    <View
                        style={{ marginTop: 10 }}
                    />
                    {this.props.cottageClients?.map(cottageClient => {
                        return this.renderCottageClientInfo(cottageClient)
                    })}
                </ScrollView>
            </LinearGradient>
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
    cottageClients: state.profile.cottageClients,
    isPortrait: state.common.isPortrait,
    currentClient: state.profile.currentClient,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    ...profileActions,
}

export default connect(stateToProps, dispatchToProps)(Questionnaires)
