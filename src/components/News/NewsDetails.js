import React, { Component } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import commonActions from '../../store/actions/common'
import ideaActions from '../../store/actions/idea'
import profileActions from '../../store/actions/profile'
import LinearGradient from 'react-native-linear-gradient'

class NewsDetails extends Component {
    state = {
        news: null,
    }

    componentDidMount() {
        this.setState({ news: this.props.route.params.item })
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
                            {this.state.news &&
                                this.state.news.additionalInfo}
                        </Text>
                    </View>
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

export default connect(stateToProps, dispatchToProps)(NewsDetails)
