import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native'
import styles from './styles'
import { connect } from 'react-redux'

class TopTabBar extends Component {
    state = {
        leftAnim: new Animated.Value(0),
    }

    animateIn = (value) => {
        Animated.timing(this.state.leftAnim, {
            toValue: value,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }


    render() {
        const slideBarWidth = (Dimensions.get('window').width - 60) / 3
        const left = this.props.state.index === 0 ? 0 : slideBarWidth * this.props.state.index

        if (left !== this.state.leftAnim) {
            this.animateIn(left);
        }

        return (
            <View style={styles.topTabBar}>
                {
                    this.props.state.routes.map((route, index) => {
                        const { options } = this.props.descriptors[route.key]
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name

                        const isFocused = this.props.state.index === index

                        const onPress = () => {
                            const event = this.props.navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            })

                            if (!isFocused && !event.defaultPrevented) {
                                this.props.navigation.navigate(route.name)
                            }
                        }

                        const onLongPress = () => {
                            this.props.navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            })
                        }

                        return (
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityStates={isFocused ? ['selected'] : []}
                                accessibilityLabel={
                                    options.tabBarAccessibilityLabel
                                }
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                activeOpacity={1}
                                style={styles.tabBarItem
                                }>
                                <Text style={isFocused
                                    ? { color: '#202020', fontWeight: 'bold', fontSize: 16 }
                                    : { color: '#828282', fontWeight: 'normal', fontSize: 16 }} numberOfLines={1}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                }
                <Animated.View style={
                    {
                        width: slideBarWidth,
                        borderWidth: 1,
                        borderColor: '#202020',
                        position: 'absolute',
                        height: 0,
                        left: this.state.leftAnim,
                        top: Platform.OS === 'ios' ? 43 : 47
                    }
                }></Animated.View>
            </View>
        )
    }
}

const stateToProps = state => ({
})

const dispatchToProps = {
}

export default connect(stateToProps, dispatchToProps)(TopTabBar)
