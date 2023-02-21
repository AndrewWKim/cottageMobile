import React, { Component } from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import News from '../News/News'
import NewsIdeaDetails from '../News/NewsIdeaDetails'
import { connect } from 'react-redux'
import styles from './styles'
import TabBarItem from 'react-native-vector-icons/MaterialIcons'
import NewsDetails from '../News/NewsDetails'
import LinearGradient from 'react-native-linear-gradient'
import {
    View
} from 'react-native'

const Stack = createStackNavigator()

class NewsTabNavigator extends Component {
    componentDidMount() { }

    newsDetailsOptions = route => {
        return {
            headerTitle: 'Детали',
            headerTitleStyle: styles.detailsHeader,
            headerTitleAlign: 'center',
            headerLeft: props => (
                <HeaderBackButton
                    {...props}
                    onPress={() => {
                        this.props.navigation.navigate('News', {
                            screen: 'News',
                        })
                    }}
                    labelVisible={false}
                    backImage={() => (
                        <TabBarItem
                            name="keyboard-arrow-left"
                            color={'black'}
                            size={30}
                        />
                    )}
                />
            ),
            headerStatusBarHeight: 0,
            headerStyle: styles.detailsHeaderBlock,
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Stack.Navigator initialRouteName="News" mode="card">
                    <Stack.Screen
                        name="News"
                        component={News}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="NewsIdeaDetails"
                        component={NewsIdeaDetails}
                        options={({ route }) => this.newsDetailsOptions(route)}
                    />
                    <Stack.Screen
                        name="NewsDetails"
                        component={NewsDetails}
                        options={({ route }) => this.newsDetailsOptions(route)}
                    />
                </Stack.Navigator>
            </View>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(NewsTabNavigator)
