import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Modal, Text, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native'
import commonActions from "../../store/actions/common";
import TabBarItem from "react-native-vector-icons/MaterialCommunityIcons";
import styles from './styles'

class SelectorModal extends Component {

    onPressHandler = value => {
        this.props.selectorAction(value);
        this.props.toggleSelectorModal(false)
    }

    render() {
        return (
            <>
                <Modal
                    transparent={true}
                    animationType={'fade'}
                    visible={this.props.selectorModalVisible}
                    statusBarTranslucent={true}
                >
                    <TouchableWithoutFeedback onPress={() => this.props.toggleSelectorModal(false)} style={{ zIndex: 1 }}>
                        <View style={styles.backgroundCover}>
                            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                                {
                                    this.props.selectorOptions.map((option, index) =>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.onPressHandler(option.value)}>
                                            <View
                                                style={[styles.modalOption, option.isFocused ? { backgroundColor: '#43276c' } : {},
                                                index !== this.props.selectorOptions.length - 1 ? styles.whiteBorderBottom : null]}
                                            >
                                                <Text
                                                    style={[styles.optionText, option.isFocused ? { fontWeight: 'bold' } : {}]}>{option.title}</Text>
                                                <TabBarItem
                                                    name={option.iconName}
                                                    color={'#fff'}
                                                    size={10}
                                                    style={{ marginLeft: 10 }} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                }
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </>
        )
    }
}

const stateToProps = state => ({
    selectorModalVisible: state.common.selectorModalVisible,
    selectorOptions: state.common.selectorOptions,
    selectorAction: state.common.selectorAction,
    communalBills: state.billing.communalBills,
});

const dispatchToProps = {
    toggleSelectorModal: commonActions.toggleSelectorModal
}

export default connect(stateToProps, dispatchToProps)(SelectorModal)