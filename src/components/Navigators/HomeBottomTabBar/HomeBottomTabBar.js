import React from 'react'
import { Text, View, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'

export default HomeBottomTabBar = ({
    state,
    descriptors,
    navigation,
    toggleSecurityTab,
    unvoitedIdeasCount,
    unpaidCommunalBillsCount,
    currentClientUploaded,
    unopenedCount,
    securityVisible
}) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options

    if (focusedOptions.tabBarVisible === false) {
        return null
    }

    return (
        <View style={styles.bottomTabBar}>
            {
                state.routes.map((route, index) => {
                    const { options } = descriptors[route.key]
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name

                    const isFocused = state.index === index

                    const onPress = () => {
                        if (route.name === 'Security') {
                            toggleSecurityTab(!securityVisible)
                            return
                        }
                        toggleSecurityTab(false)
                        if (!currentClientUploaded) {
                            return
                        }
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        })

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name)
                        }
                    }

                    const onLongPress = () => {
                        if (route.name === 'Security') {
                            toggleSecurityTab(!securityVisible)
                            return
                        }

                        toggleSecurityTab(false)
                        if (!currentClientUploaded) {
                            return
                        }
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        })
                    }

                    if (
                        route.name === 'Profile' ||
                        route.name === 'PassRequest' ||
                        route.name === 'VideoStreaming'
                    ) {
                        return null
                    }

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityStates={isFocused ? ['selected'] : []}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            activeOpacity={0.8}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            key={route.name}
                            style={styles.tabBarItem}
                        >
                            {options.tabBarIcon(
                                (color = isFocused ? '#6B4F9E' : '#ffffff'),
                                (size = ((route.name === 'News' || route.name === 'Ideas') && Platform.OS !== 'ios') ? 32 : 34),
                            )}
                            <Text
                                style={{
                                    color: isFocused ? '#6B4F9E' : '#ffffff',
                                    fontSize: 10,
                                    marginTop: 6
                                }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    )
                })
            }
            {
                unopenedCount ? (
                    <View style={styles.unvoitedIdeasIcon}>
                        <Text>{unopenedCount}</Text>
                    </View>
                ) : (
                    <></>
                )
            }
            {
                unpaidCommunalBillsCount ? (
                    <View style={styles.unpaidFinanceIcon}>
                        <Text>{unpaidCommunalBillsCount}</Text>
                    </View>
                ) : (
                    <></>
                )
            }
        </View>
    )
}
