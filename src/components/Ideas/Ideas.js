import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    FlatList,
} from 'react-native'
import { connect } from 'react-redux'
import ideaActions from '../../store/actions/idea'
import ideaService from '../../shared/services/ideaService'
import commonActions from '../../store/actions/common'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './styles'
import profileActions from '../../store/actions/profile'
import { IDEA_STATUS } from '../../shared/const/constants'
import LinearGradient from 'react-native-linear-gradient'

const initialState = {
    additionalInfo: '',
}

class Ideas extends Component {
    state = initialState

    componentDidMount() {
        this.getIdeasByCreator()

        this.props.navigation.addListener('focus', () => {
            this.getIdeasByCreator()
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', () => {
            this.getIdeasByCreator()
        })
    }

    getIdeasByCreator = async () => {
        const userId = this.props.session.user.id
        this.props.toggleLoader(true)

        await this.props.fetchCurrentClient()
        this.props.fetchCreatorIdeas(userId).then(() => {
            this.props.toggleLoader(false)
        })
    }

    createIdea = () => {
        this.props.toggleLoader(true)
        const { additionalInfo } = this.state
        const userId = this.props.session.user.id

        const publicationDate = new Date()
            .toJSON()
            .slice(0, 19)
            .replace(/:/g, '-')

        const newIdea = {
            additionalInfo,
            userId,
            publicationDate,
            status: IDEA_STATUS.moderating,
        }

        ideaService.createIdea(newIdea).then(idea => {
            const ideaVoteData = {
                userId: userId,
                ideaId: idea.id,
                voteType: 1,
            }

            if (this.props.currentClient.canVote) {
                ideaService.voteIdea(ideaVoteData).then(() => {
                    this.props.fetchCreatorIdeas(userId).then(() => {
                        this.setState(initialState)
                        this.props.toggleLoader(false)
                    })
                })
            } else {
                this.props.fetchCreatorIdeas(userId).then(() => {
                    this.setState(initialState)
                    this.props.toggleLoader(false)
                })
            }
        })
    }

    isFormValid = () => {
        const { additionalInfo } = this.state
        return additionalInfo != ''
    }

    renderItem = item => {
        const date = dateToRuString(item.publicationDate, 'DD MMM YYYY')
        return (
            <>
                <View
                    style={{
                        ...styles.item,
                        width: this.props.isPortrait
                            ? Dimensions.get('window').width - 60
                            : Dimensions.get('window').width - 60,
                    }}>
                    <TouchableOpacity
                        accessibilityRole="link"
                        activeOpacity={0.8}
                        onPress={() => {
                            this.props.navigation.navigate('IdeaDetails', {
                                item: item,
                            })
                        }}>
                        <Text style={styles.date}>{date}</Text>
                        <View style={styles.row}>
                            <Text style={styles.ideaTitle} numberOfLines={2}>
                                {item.additionalInfo}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ ...styles.row }}>
                        <View style={styles.countBlock}>
                            <TabBarItem
                                name="vote"
                                color={'#202020'}
                                size={18}
                            />
                            <Text style={styles.voteCount}>
                                {item.voteCount}
                            </Text>
                        </View>
                        {/* <TabBarItem name="comment-multiple" color={'#7D7D7D'} size={15} />*/}
                        <View>
                            <Text style={styles.comments}>
                                {
                                    item.status === IDEA_STATUS.published
                                        ? 'Опубликовано'
                                        : item.status === IDEA_STATUS.archived
                                            ? 'В архиве' : 'На модерации'
                                }
                            </Text>
                        </View>
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
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: this.props.isPortrait ? '10%' : '0%',
                    }}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.formField}>
                        <Text style={{ color: '#4F4F4F', fontSize: 18 }}>
                            Идея
                        </Text>
                        <TextInput
                            value={this.state.additionalInfo}
                            multiline={true}
                            onChangeText={additionalInfo =>
                                this.setState({ additionalInfo })
                            }
                            style={{ ...styles.input }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={this.createIdea}
                            style={styles.button}
                            disabled={!this.isFormValid()}>
                            <Text style={
                                this.isFormValid()
                                    ? styles.buttonText : styles.disableButtonText}>
                                предложить
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ideaList}>
                        <Text style={styles.listTitle}>МОИ ИДЕИ</Text>
                        <FlatList
                            data={this.props.creatorIdeas}
                            renderItem={({ item }) => this.renderItem(item)}
                        />
                    </View>
                </ScrollView>
            </LinearGradient>
        )
    }
}

const stateToProps = state => ({
    creatorIdeas: state.idea.creatorIdeas,
    session: state.auth.session,
    isPortrait: state.common.isPortrait,
    currentClient: state.profile.currentClient,
})

const dispatchToProps = {
    fetchCreatorIdeas: ideaActions.fetchCreatorIdeas,
    toggleLoader: commonActions.toggleLoader,
    fetchCurrentClient: profileActions.fetchCurrentClient,
}

export default connect(stateToProps, dispatchToProps)(Ideas)
