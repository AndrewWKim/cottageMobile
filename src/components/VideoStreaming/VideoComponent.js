import React, { Component } from 'react'
import { View, Dimensions, ActivityIndicator } from 'react-native'
import { VLCPlayer } from 'react-native-vlc-media-player'
import { connect } from 'react-redux'
import styles from './styles'

class VideoComponent extends Component {
    state = {
        isLoading: true,
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 10000)
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    calculateWidth = multipleIndex => {
        return this.props.isPortrait
            ? Dimensions.get('window').width * multipleIndex - 20
            : Dimensions.get('window').width * multipleIndex - 20
    }

    renderVideo() {
        const styleSmall = {
            width: this.calculateWidth(0.5),
            height: this.calculateWidth(0.5),
        }

        const styleBig = {
            width: this.calculateWidth(1),
            height: this.calculateWidth(1),
        }

        const isBig = this.props.videoSize === 'big';

        return (
            <View style={isBig ? { ...styleBig, ...styles.playerWrapper } : { ...styleSmall, ...styles.playerWrapper }}>
                <VLCPlayer
                    autoAspectRatio={true}
                    source={{ uri: this.props.url }}
                    style={isBig ? styleBig : styleSmall}
                    onPlaying={o => {
                        this.setState({ isLoading: true })
                    }}
                    onProgress={o => {
                        if (o.currentTime > 0 && this.state.isLoading) {
                            this.setState({ isLoading: false })
                        }
                    }}
                />
                {
                    this.state.isLoading ?
                        <View style={isBig ? styles.streamLoaderBig : styles.streamLoader}>
                            <ActivityIndicator
                                animating={true}
                                size="large"
                                color="#FFFFFF"
                            />
                        </View>
                        : <></>
                }
            </View>
        )
    }

    render() {
        return <View style={{ padding: 3 }}>{this.renderVideo()}</View>
    }
}

const stateToProps = state => ({
    isPortrait: state.common.isPortrait,
})

const dispatchToProps = {}

export default connect(stateToProps, dispatchToProps)(VideoComponent)
