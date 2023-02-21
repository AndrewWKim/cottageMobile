import React, { Component } from 'react'
import { connect } from 'react-redux'
import commonActions from '../../../store/actions/common'
import billingActions from '../../../store/actions/billing'
import dateToRuString from '../../../shared/utils/dateToRuString'
import SelectorButton from "../../Selector/SelectorButton"
import { View } from "react-native";


class FinanceDatePicker extends Component {

    onDateSelect = (cottageBillingId) => {
        // this.props.toggleLoader(true)
        //setTimeout(() => this.props.toggleSnackBar(true, '1'), 1000)

        if (cottageBillingId) {
            this.props.setCurrentCottageBillingId(cottageBillingId)

            this.props.fetchCommunalBills(cottageBillingId).then(() => {
                this.props.toggleLoader(false)
                //setTimeout(() => this.props.toggleSnackBar(true, '2'), 2500)
            }).catch(() => {
                this.props.toggleLoader(false)
                //setTimeout(() => this.props.toggleSnackBar(true, '3'), 3500)
            })
            this.props.getUnpaidCommunalBillsCount(this.props.session.user.id)
            //setTimeout(() => this.props.toggleSnackBar(true, '3'), 4500)
        } else {
            this.props.toggleLoader(false)
        }
    }

    generateCottageBillingSelectorOptions = () => {
        return this.props.cottageBillings.map(cottageBilling => {
            const isFocused = this.props.currentCottageBillingId === cottageBilling.id

            const dateRuString = dateToRuString(
                cottageBilling.billingDate,
                'MMMM YYYY',
            )

            let date = dateRuString.charAt(0).toUpperCase() + dateRuString.slice(1);

            return {
                title: date,
                value: cottageBilling.id,
                iconName: cottageBilling.totalPrice === 0.00 ? null : "circle",
                isFocused
            }
        })
    }

    render() {
        const options = this.generateCottageBillingSelectorOptions()

        return (
            <>
                <View style={{ width: 250, alignSelf: 'center' }}>
                    <SelectorButton options={options} onItemSelect={this.onDateSelect}
                        emptyPlaceholder={'Данных за месяц нет'} />
                </View>
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
    ...commonActions,
}

export default connect(stateToProps, dispatchToProps)(FinanceDatePicker)
