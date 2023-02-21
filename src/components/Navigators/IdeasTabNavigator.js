import React, { Component } from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import Ideas from '../Ideas/Ideas'
import IdeaDetails from '../Ideas/IdeaDetails'
import { connect } from 'react-redux'
import styles from './styles'
import TabBarItem from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'

const Stack = createStackNavigator()

class IdeasTabNavigator extends Component {
    componentDidMount() { }

    ideaDetailsOptions = route => {
        return {
            headerTitle: 'Детали',
            headerTitleStyle: styles.detailsHeader,
            headerTitleAlign: 'center',
            headerLeft: props => (
                <HeaderBackButton
                    {...props}
                    onPress={() => {
                        this.props.navigation.navigate('Ideas', {
                            screen: 'Ideas',
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
            <>
                <Stack.Navigator initialRouteName="Ideas" mode="card">
                    <Stack.Screen
                        name="Ideas"
                        component={Ideas}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="IdeaDetails"
                        component={IdeaDetails}
                        options={({ route }) => this.ideaDetailsOptions(route)}
                    />
                </Stack.Navigator>
            </>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(IdeasTabNavigator)
