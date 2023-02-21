import React, { Component } from 'react'
import {
    View,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
} from 'react-native'
import { connect } from 'react-redux'
import VideoComponent from './VideoComponent'
import styles from './styles'
import commonService from '../../shared/services/commonService'
import commonActions from '../../store/actions/common'

class VideoStreaming extends Component {
    state = {
        videoUrls: [],
        currentVideo: null,
        page: null,
    }

    componentDidMount() {
        this.fetchCameraIPs(1)

        this.props.navigation.addListener('blur', () => {
            this.setState({ videoUrls: [] })
        })

        this.props.navigation.addListener('focus', () => {
            this.fetchCameraIPs(this.state?.page || 1)
        })
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('blur', () => {
            this.setState({ videoUrls: [] })
        })

        this.props.navigation.removeListener('focus', () => {
            this.fetchCameraIPs(this.state?.page || 1)
        })
    }

    fetchCameraIPs = page => {
        this.setState({ videoUrls: [], page: page })
        this.props.toggleLoader(true)
        setTimeout(() => {
            commonService.getCameraIPs(page).then(urls => {
                this.props.toggleLoader(false)
                this.setState({ videoUrls: urls, page: page })
            })
        }, 3000)
    }

    render() {
        return (
            <>
                {this.state.currentVideo === null ? (
                    <View style={{ flex: 1 }}>
                        <View style={styles.navButtons}>
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                onPress={() => this.fetchCameraIPs(1)}
                                style={
                                    this.state.page === 1
                                        ? styles.selectedButton
                                        : styles.button
                                }>
                                <Text style={this.state.page === 1
                                    ? styles.selectedButtonText
                                    : styles.buttonText}>1-10</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                onPress={() => this.fetchCameraIPs(2)}
                                style={
                                    this.state.page === 2
                                        ? styles.selectedButton
                                        : styles.button
                                }>
                                <Text style={this.state.page === 2
                                    ? styles.selectedButtonText
                                    : styles.buttonText}>11-20</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                onPress={() => this.fetchCameraIPs(3)}
                                style={
                                    this.state.page === 3
                                        ? styles.selectedButton
                                        : styles.button
                                }>
                                <Text style={this.state.page === 3
                                    ? styles.selectedButtonText
                                    : styles.buttonText}>21-30</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                onPress={() => this.fetchCameraIPs(4)}
                                style={
                                    this.state.page === 4
                                        ? styles.selectedButton
                                        : styles.button
                                }>
                                <Text style={this.state.page === 4
                                    ? styles.selectedButtonText
                                    : styles.buttonText}>31-38</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollViewContent}>
                            {
                                this.state.videoUrls?.map(el => (
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            this.setState({ currentVideo: el })
                                        }}
                                        key={el}>
                                        <View>
                                            <VideoComponent
                                                url={el}
                                                videoSize={'small'}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))
                            }
                        </ScrollView>
                    </View>
                ) : (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({ currentVideo: null })
                        }}>
                        <View style={styles.currentVideo}>
                            <VideoComponent
                                url={this.state.currentVideo}
                                videoSize={'big'}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </>
        )
    }
}

const stateToProps = state => ({})

const dispatchToProps = {
    toggleLoader: commonActions.toggleLoader,
}

export default connect(stateToProps, dispatchToProps)(VideoStreaming)
