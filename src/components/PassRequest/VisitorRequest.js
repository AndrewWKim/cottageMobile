import React, {Component} from 'react'
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import {connect} from 'react-redux'
import passRequestActions from '../../store/actions/passRequest'
import passRequestService from '../../shared/services/passRequest'
import styles from './styles'
import RNPickerSelect from 'react-native-picker-select'
import {VISIT_TIMES, PASS_REQUEST_TYPE} from '../../shared/const/constants'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import dateToRuString from '../../shared/utils/dateToRuString'
import commonActions from '../../store/actions/common'
import SelectorButton from "../Selector/SelectorButton";

const initialState = {
    visitorFirstName: '',
    visitorLastName: '',
    visitDate: new Date(),
    visitTime: 1,
    additionalInfo: '',
    showDatePicker: false,
}

class VisitorRequest extends Component {
    state = initialState

    createVisitorPassRequest = () => {
        this.props.toggleLoader(true)

        const {
            visitorFirstName,
            visitorLastName,
            visitDate,
            visitTime,
            additionalInfo,
        } = this.state

        const newPassRequest = {
            passRequestType: PASS_REQUEST_TYPE.visitor,
            visitorName: visitorFirstName + ' ' + visitorLastName,
            visitDate: visitDate
                .toISOString()
                .substring(0, 19)
                .replace(/:/g, '-'),
            visitTime,
            additionalInfo,
            clientId: this.props.currentClient.id,
        }

        passRequestService.createPassRequest(newPassRequest).then(() => {
            this.setState(initialState)
            this.props
                .fetchPassRequests(this.props.currentClient.cottage.id)
                .then(() => {
                    this.props.setPassRequestType(null)
                    this.props.toggleLoader(false)
                })
        })
    }

    isFormValid = () => {
        const {
            visitorFirstName,
            visitorLastName,
            visitDate,
            visitTime,
        } = this.state
        return (
            visitorFirstName != '' &&
            visitDate != '' &&
            visitTime != 0
        )
    }

    renderPickerItem = visitTime => {
        const isFocused = this.state.visitTime === visitTime.id
        return {
            title: visitTime.name,
            value: visitTime.id,
            color: isFocused ? '#1A1A1A' : '#7D7D7D',
            isFocused
        }
    }

    showDatePicker = () => {
        this.setState({showDatePicker: true})
    }

    onDateChange = (event, selectedDate) => {
        if (selectedDate === undefined) {
            this.setState({showDatePicker: false})
            return
        }
        this.setState({visitDate: selectedDate, showDatePicker: false})
    }

    generateVisitTimesOptions = () => {
        return VISIT_TIMES.map(visitTime => {
            return this.renderPickerItem(visitTime)
        });
    }

    onTimePicked = (value) => {
        this.setState({...this.state, visitTime: value})
    }

    render() {
        const options = this.generateVisitTimesOptions();

        return (
            <>
                <ScrollView
                    keyboardShouldPersistTaps="handled">
                    <View
                        style={styles.formField}>
                        <Text style={styles.fieldTitle}>Имя</Text>
                        <TextInput
                            value={this.state.visitorFirstName}
                            onChangeText={visitorFirstName =>
                                this.setState({
                                    visitorFirstName: visitorFirstName,
                                })
                            }
                            maxLength={30}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.fieldTitle}>Фамилия</Text>
                        <TextInput
                            value={this.state.visitorLastName}
                            onChangeText={visitorLastName =>
                                this.setState({
                                    visitorLastName: visitorLastName,
                                })
                            }
                            maxLength={30}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.fieldTitle}>Дата</Text>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={this.showDatePicker}
                            style={styles.datePickerButton}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    marginBottom: 15,
                                    marginLeft: 3,
                                    marginTop: 5,
                                }}>
                                {dateToRuString(
                                    this.state.visitDate,
                                    'DD MMMM YYYY',
                                )}
                            </Text>
                        </TouchableOpacity>
                        {
                            this.state.showDatePicker ? (
                                <RNDateTimePicker
                                    value={this.state.visitDate}
                                    minimumDate={new Date()}
                                    mode="date"
                                    locale="ru-RU"
                                    is24Hour={true}
                                    display="calendar"
                                    onChange={this.onDateChange}
                                />
                            ) : (
                                <></>
                            )
                        }
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.fieldTitle}>Время</Text>
                        <SelectorButton options={options}
                                        onItemSelect={this.onTimePicked} />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.fieldTitle}>
                            Дополнительная информация
                        </Text>
                        <TextInput
                            value={this.state.additionalInfo}
                            multiline={true}
                            onChangeText={additionalInfo =>
                                this.setState({
                                    additionalInfo: additionalInfo,
                                })
                            }
                            style={{...styles.input}}
                        />
                    </View>
                    <View style={styles.requestButtons}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={this.createVisitorPassRequest}
                            style={styles.button}
                            disabled={!this.isFormValid()}>
                            <Text style={this.isFormValid()
                                ? styles.buttonText
                                : styles.disableButtonText}>отправить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => {
                                this.setState(initialState)
                                this.props.setPassRequestType(null)
                            }}
                            style={{...styles.transparentButton, marginLeft: 0}}>
                            <Text style={styles.transparentButtonText}>отмена</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </>
        )
    }
}

const stateToProps = state => ({
    currentClient: state.profile.currentClient,
})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
    ...passRequestActions,
}

export default connect(stateToProps, dispatchToProps)(VisitorRequest)
