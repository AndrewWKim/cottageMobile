import React, {Component} from 'react'
import {
    Text,
    View,
    FlatList,
    AppState,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import commonActions from '../../store/actions/common'
import ideaActions from '../../store/actions/idea'
import newsActions from '../../store/actions/news'
import {connect} from 'react-redux'
import commonStyles from '../commonStyles'
import styles from './styles'
import TabBarItem from 'react-native-vector-icons/MaterialCommunityIcons'
import TabBarItemM from 'react-native-vector-icons/MaterialIcons'
import dateToRuString from '../../shared/utils/dateToRuString'
import billingActions from '../../store/actions/billing'
import ideaService from '../../shared/services/ideaService'
import newsService from '../../shared/services/newsService'
import authActions from '../../store/actions/auth'
import {NEWS_TYPE} from '../../shared/const/constants'
import LinearGradient from 'react-native-linear-gradient'

const initialState = {
    showMore: false,
}

class News extends Component {
    state = initialState;

    componentDidMount() {
        const userId = this.props.session.user.id
        this.props.toggleLoader(true)

        Promise.all([
            this.props.fetchIdeas(userId),
            this.props.getUnpaidCommunalBillsCount(userId),
            this.props.fetchAllNews(),
        ])
            .then(() => {
                this.props.toggleLoader(false)
                this.interval = setInterval(() => {
                    this.trySendRequestIdeas()
                    this.trySendRequestNews()
                }, 10000)
            })
            .catch(error => {
                this.props.toggleLoader(false)
                this.props.logout()
            })
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    openIdea(id) {
        const userId = this.props.session.user.id
        ideaService
            .readIdea(id)
            .then(() => {
                this.props.fetchIdeas(userId)
                this.props.getUnpaidCommunalBillsCount(userId)
            })
            .catch(error =>
                this.props.toggleSnackBar(true, 'Произошла ошибка.')
            )
    }

    openNews(id) {
        const userId = this.props.session.user.id
        newsService
            .readNews(id)
            .then(() => {
                this.props.fetchAllNews()
                this.props.getUnpaidCommunalBillsCount(userId)
            })
            .catch(error => {
                this.props.toggleSnackBar(true, 'Произошла ошибка.')
            })
    }

    trySendRequestIdeas() {
        if (
            AppState.currentState.match(/inactive|background/) ||
            !this.props.session
        ) {
            return
        }
        return this.props.fetchIdeas(this.props.session.user.id)
    }

    trySendRequestNews() {
        if (
            AppState.currentState.match(/inactive|background/) ||
            !this.props.session
        ) {
            return
        }
        return this.props.fetchAllNews()
    }

    onTextLayout = e => {
        this.setState({...this.state, showMore: e.nativeEvent.lines.length > 2})
    }

    renderItem = item => {
        const date = dateToRuString(item.publicationDate, 'DD MMM YYYY')
        return (
            <>
                {
                    item.newsType === NEWS_TYPE.Idea ? (
                        <TouchableOpacity
                            accessibilityRole="link"
                            activeOpacity={0.8}
                            onPress={() => {
                                this.openIdea(item.id)
                                this.props.navigation.navigate('NewsIdeaDetails', {
                                    item: item,
                                })
                            }}
                            style={styles.touchableItem}>
                            <TabBarItem
                                name="circle"
                                color={item.isOpened ? 'transparent' : '#1A1A1A'}
                                size={10}
                                style={styles.dot}
                            />
                            <View
                                style={{
                                    ...styles.item,
                                    width: Dimensions.get('window').width - 70,
                                }}>
                                <Text style={styles.date}>{date}</Text>
                                <View style={styles.row}>
                                    <Text style={styles.itemTitle} numberOfLines={2}>
                                        {item.additionalInfo}
                                    </Text>
                                </View>

                                <View style={styles.row}>
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
                                    <View style={styles.spacer}/>
                                    {/* <View style={styles.comments}>	
                                    <TabBarItem name="comment-multiple" color={'#202020'} size={15} />	
                                    <Text style={styles.commentsTitle}>{item.comments.length} Комментариев</Text>	
                                </View> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <Text style={styles.heading}>НОВОСТЬ</Text>

                            <TouchableOpacity
                                accessibilityRole="link"
                                activeOpacity={0.8}
                                onPress={() => {
                                    this.openNews(item.id)
                                    this.props.navigation.navigate('NewsDetails', {
                                        item: item,
                                    })
                                }}
                                style={styles.touchableItem}>
                                <TabBarItem
                                    name="circle"
                                    color={item.isOpened ? 'transparent' : '#1A1A1A'}
                                    size={10}
                                    style={styles.dot}
                                />
                                <View
                                    style={{
                                        ...styles.item,
                                        width: Dimensions.get('window').width - 70,
                                    }}>
                                    <Text style={styles.date}>{date}</Text>
                                    <View style={styles.row}>
                                        <Text
                                            style={{
                                                ...styles.itemTitle,
                                                fontSize: 20,
                                                lineHeight: 24,
                                                display: 'flex',
                                                flex: 1,
                                                width: '100%'
                                            }} onTextLayout={this.onTextLayout} numberOfLines={2}
                                            ellipsizeMode={'clip'}>
                                            {item.additionalInfo}
                                        </Text>

                                        {this.state.showMore &&
                                        <TabBarItemM
                                            name="keyboard-arrow-right"
                                            color={'black'}
                                            size={30}
                                        />
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>
                    )
                }
            </>
        )
    }

    render() {
        const data =
            this.props.ideas && this.props.allNews
                ? [...this.props.ideas, ...this.props.allNews].sort(
                (a, b) => a.publicationDate < b.publicationDate,
                )
                : []
        return (
            <LinearGradient style={{flex: 1}}
                            colors={['rgba(107,79,158,1)', 'rgba(142,120,181,1)', 'rgba(191,172,226,1)', 'rgba(229,202,243,1)', 'rgba(248,223,221,1)']}
                            start={{x: 0, y: 1}} end={{x: 0, y: 0}}>
                <View style={commonStyles.centerScreen}>
                    {
                        data.length > 0 ?
                            <FlatList
                                data={data}
                                renderItem={({item}) => this.renderItem(item)}
                                keyExtractor={item => item.id}

                            />
                            :
                            <View>
                                <Text style={{fontSize: 18, color: '#202020', fontWeight: 'bold', textAlign: 'center'}}>
                                    {`СКОРО МЫ РАССКАЖЕМ\n ВСЕ НОВОСТИ`}
                                </Text>
                            </View>
                    }
                </View>
            </LinearGradient>
        )
    }
}

const stateToProps = state => ({
    ideas: state.idea.ideas,
    allNews: state.news.allNews,
    session: state.auth.session,
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {
    ...commonActions,
    fetchIdeas: ideaActions.fetchIdeas,
    fetchAllNews: newsActions.fetchAllNews,
    getUnpaidCommunalBillsCount: billingActions.getUnpaidCommunalBillsCount,
    logout: authActions.logout,
}

export default connect(stateToProps, dispatchToProps)(News)
