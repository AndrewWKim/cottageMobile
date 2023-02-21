import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import { connect } from 'react-redux'
import passRequestActions from '../../store/actions/passRequest'
import passRequestService from '../../shared/services/passRequest'
import styles from './styles'
import RNPickerSelect from 'react-native-picker-select'
import { VISIT_TIMES, PASS_REQUEST_TYPE } from '../../shared/const/constants'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import dateToRuString from '../../shared/utils/dateToRuString'
import commonActions from '../../store/actions/common'

const initialState = {
    carBrand: '',
    carModel: '',
    carLicensePlate: '',
    visitDate: new Date(),
    visitTime: 1,
    additionalInfo: '',
    showDatePicker: false,
}

class CarRequest extends Component {
    state = initialState

    createCarPassRequest = () => {
        this.props.toggleLoader(true)

        const {
            carBrand,
            carModel,
            carLicensePlate,
            visitDate,
            visitTime,
            additionalInfo,
        } = this.state

        const newPassRequest = {
            passRequestType: PASS_REQUEST_TYPE.car,
            carBrand,
            carModel,
            carLicensePlate,
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
            carBrand,
            carModel,
            carLicensePlate,
            visitDate,
            visitTime,
        } = this.state
        return (
            carBrand != '' &&
            carModel != '' &&
            carLicensePlate != '' &&
            visitDate != '' &&
            visitTime != 0
        )
    }

    renderPickerItem = visitTime => {
        const isFocused = this.state.visitTime === visitTime.id
        return {
            label: visitTime.name,
            value: visitTime.id,
            color: isFocused ? '#1A1A1A' : '#7D7D7D',
        }
    }

    showDatePicker = () => {
        this.setState({ showDatePicker: true })
    }

    onDateChange = (event, selectedDate) => {
        if (selectedDate === undefined) {
            this.setState({ showDatePicker: false })
            return
        }
        this.setState({ visitDate: selectedDate, showDatePicker: false })
    }

    render() {
        return (
            <>
                <ScrollView
                    style={{ marginTop: 20 }}
                    keyboardShouldPersistTaps="handled">
                    <View
                        style={{
                            ...styles.formField,
                            borderTopColor: '#7D7D7D',
                            borderTopWidth: 0.5,
                        }}>
                        <Text style={styles.fieldTitle}>Марка</Text>
                        <TextInput
                            value={this.state.carBrand}
                            onChangeText={carBrand =>
                                this.setState({ carBrand: carBrand })
                            }
                            maxLength={30}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.fieldTitle}>Модель</Text>
                        <TextInput
                            value={this.state.carModel}
                            onChangeText={carModel =>
                                this.setState({ carModel: carModel })
                            }
                            maxLength={30}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.fieldTitle}>Гос. номер</Text>
                        <TextInput
                            value={this.state.carLicensePlate}
                            onChangeText={carLicensePlate =>
                                this.setState({
                                    carLicensePlate: carLicensePlate,
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
                        {this.state.showDatePicker ? (
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
                        )}
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.fieldTitle}>Время</Text>
                        <RNPickerSelect
                            placeholder={{}}
                            value={this.state.visitTime}
                            style={{
                                inputIOS: {
                                    ...styles.inputIOS,
                                },
                                inputAndroid: {
                                    ...styles.inputAndroid,
                                },
                                viewContainer: {},
                            }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ visitTime: itemValue })
                            }
                            items={VISIT_TIMES.map(visitTime => {
                                return this.renderPickerItem(visitTime)
                            })}
                        />
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
                            style={{ ...styles.input }}
                        />
                    </View>
                    <View style={styles.requestButtons}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={this.createCarPassRequest}
                            style={
                                this.isFormValid()
                                    ? styles.sendButton
                                    : styles.disableButton
                            }
                            disabled={!this.isFormValid()}>
                            <Text style={styles.buttonText}>ОТПРАВИТЬ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.8}
                            onPress={() => {
                                this.setState(initialState)
                                this.props.setPassRequestType(null)
                            }}
                            style={styles.cancelButton}>
                            <Text style={styles.buttonText}>ОТМЕНА</Text>
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

export default connect(stateToProps, dispatchToProps)(CarRequest)
