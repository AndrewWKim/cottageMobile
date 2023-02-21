import { createStackNavigator } from '@react-navigation/stack'
import Questionnaires from '../Profile/Questionnaires/Questionnaires'
import ResidentQuestionnaire from '../Profile/Questionnaires/ResidentQuestionnaire'
import React, { Component } from 'react'
import { connect } from 'react-redux'

const Stack = createStackNavigator()

class QuestionnaireStackNavigator extends Component {
    render() {
        return (
            <>
                <Stack.Navigator mode="modal">
                    <Stack.Screen
                        name="Questionnaires"
                        component={Questionnaires}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ResidentQuestionnaire"
                        component={ResidentQuestionnaire}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export default connect(
    stateToProps,
    dispatchToProps,
)(QuestionnaireStackNavigator)
