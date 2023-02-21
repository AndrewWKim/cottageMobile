import React, {Component} from 'react'
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";
import styles from "../Finance/FinanceDatePicker/styles";
import commonActions from "../../store/actions/common";
import billingActions from "../../store/actions/billing";
import {connect} from "react-redux";
import TabBarItem from "react-native-vector-icons/MaterialCommunityIcons";
import images from '../../res/images/images'

class SelectorButton extends Component {

    render() {
        const focusedOption = this.props.options.length > 0
            ? this.props.options.find(option => option.isFocused)
            : null;

        return (<>
                <TouchableWithoutFeedback
                    onPress={() => this.props.toggleSelectorModal(true, this.props.options, this.props.onItemSelect)}
                >
                    <View style={{
                        ...styles.pickerContainer,
                    }}>
                        <View style={{
                            marginHorizontal: 5, marginBottom: 10, display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text style={{fontSize: 18}}>
                                {
                                    focusedOption ?
                                        focusedOption.title
                                        : this.props.emptyPlaceholder || 'Данных нет'
                                }
                            </Text>
                            {
                                focusedOption ?
                                    <TabBarItem
                                        name={focusedOption.iconName}
                                        color={'#202020'}
                                        size={10}
                                        style={{marginLeft: 10}}/>
                                    : <></>
                            }

                            {
                                !!this.props.options.length &&
                                <TabBarItem name={'chevron-down'}
                                            style={{color: '#202020', marginLeft: 'auto'}}
                                            size={25}/>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const stateToProps = state => ({
    session: state.auth.session,
    cottageBillings: state.billing.cottageBillings,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    ...billingActions,
    toggleSelectorModal: commonActions.toggleSelectorModal,
}

export default connect(stateToProps, dispatchToProps)(SelectorButton)