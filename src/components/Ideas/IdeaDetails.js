import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import styles from './styles'
import ideaService from '../../shared/services/ideaService'
import commonActions from '../../store/actions/common'
import ideaActions from '../../store/actions/idea'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import NoPermission from '../NoPermission/NoPermission'
import profileActions from '../../store/actions/profile'
import { IDEA_STATUS } from '../../shared/const/constants'
import LinearGradient from 'react-native-linear-gradient'

class IdeaDetails extends Component {
    state = {
        idea: null,
    }

    componentDidMount() {
        this.setState({ idea: this.props.route.params.item })
    }

    render() {
        return (
            <LinearGradient style={{ flex: 1 }}
                colors={['rgba(107,79,158,1)', 'rgba(142,120,181,1)', 'rgba(191,172,226,1)', 'rgba(229,202,243,1)', 'rgba(248,223,221,1)']}
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
                <ScrollView
                    contentContainerStyle={{
                        paddingVertical: 30,
                        paddingHorizontal: 20,
                    }}>
                    <View
                        style={{
                            marginTop: this.props.isPortrait ? '0%' : '2%',
                        }}>
                        <Text style={{ fontSize: 15, padding: 20, lineHeight: 19 }}>
                            {this.state.idea &&
                                this.state.idea.additionalInfo}
                        </Text>
                    </View>
                    {
                        this.state.idea?.status === IDEA_STATUS.published ?
                            <>
                                <View style={styles.actions}>
                                    <View
                                        style={{
                                            ...styles.voteButton,
                                            ...styles.inFavour,
                                        }}>
                                        <Text>
                                            {this.state.idea &&
                                                this.state.idea
                                                    .votePercentInFavour}{' '}
                                            %
                                        </Text>
                                        <TabBarItem
                                            name="thumb-up"
                                            color={'black'}
                                            size={15}
                                        />
                                    </View>
                                    <View style={styles.buttonSpacer}></View>
                                    <View
                                        style={{
                                            ...styles.voteButton,
                                            ...styles.abstention,
                                        }}>
                                        <Text>
                                            {this.state.idea &&
                                                this.state.idea
                                                    .votePercentAbstention}{' '}
                                            %
                                        </Text>
                                        <TabBarItem
                                            name="thumbs-up-down"
                                            color={'black'}
                                            size={15}
                                        />
                                    </View>
                                    <View style={styles.buttonSpacer}></View>
                                    <View
                                        style={{
                                            ...styles.voteButton,
                                            ...styles.against,
                                        }}>
                                        <Text>
                                            {this.state.idea &&
                                                this.state.idea
                                                    .votePercentAgainst}{' '}
                                            %
                                        </Text>
                                        <TabBarItem
                                            name="thumb-down"
                                            color={'black'}
                                            size={15}
                                        />
                                    </View>
                                </View>
                            </>
                            : this.state.idea?.status === IDEA_STATUS.archived ?
                                <Text
                                    style={{ ...styles.actions, fontSize: 20, lineHeight: 25 }}>
                                    Ваша идея находится в архиве
                                    </Text>
                                : <Text
                                    style={{ ...styles.actions, fontSize: 20, lineHeight: 25 }}>
                                    Ваша идея находится на модерации
                                    </Text>
                    }
                </ScrollView>
            </LinearGradient>
        )
    }
}

const stateToProps = state => ({
    session: state.auth.session,
    isPortrait: state.common.isPortrait,
    currentClient: state.profile.currentClient,
})

const dispatchToProps = {
    ...commonActions,
    fetchIdeas: ideaActions.fetchIdeas,
    fetchCurrentClient: profileActions.fetchCurrentClient,
}

export default connect(stateToProps, dispatchToProps)(IdeaDetails)
