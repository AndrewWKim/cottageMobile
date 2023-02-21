import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import SideSwipe from 'react-native-sideswipe'
import { connect } from 'react-redux'
import PaymentCard from './PaymentCard'
import billingActions from '../../../store/actions/billing'

class CardSwipe extends Component {
    componentDidMount() {
        this.props.setCurrentCardId(this.props.currentClient?.cards?.[0]?.id)
    }

    state = {
        currentIndex: 0,
    }

    render = () => {
        const { width } = Dimensions.get('window')
        const contentOffset = 15
        return (
            <SideSwipe
                index={this.state.currentIndex}
                itemWidth={width - 30}
                style={{ width }}
                data={this.props.currentClient?.cards}
                contentOffset={contentOffset}
                onIndexChange={index => {
                    this.props.setCurrentCardId(
                        this.props.currentClient?.cards[index].id,
                    )
                    this.setState({ currentIndex: index })
                }}
                renderItem={({ item }) => <PaymentCard card={item} />}
            />
        )
    }
}

const stateToProps = state => ({
    isPortrait: state.common.isPortrait,
    currentClient: state.profile.currentClient,
    currentCardId: state.billing.currentCardId,
})

const dispatchToProps = {
    setCurrentCardId: billingActions.setCurrentCardId,
}

export default connect(stateToProps, dispatchToProps)(CardSwipe)
