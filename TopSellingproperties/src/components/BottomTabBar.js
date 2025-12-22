import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const BottomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    
    // Check if current route is AgentDetails or AgencyDetails
    const focusedRoute = state.routes[state.index];
    let focusedRouteName = focusedRoute.name;
    
    // Get nested route name if it exists
    if (focusedRoute.state) {
        const nestedRouteName = getFocusedRouteNameFromRoute(focusedRoute);
        if (nestedRouteName) {
            focusedRouteName = nestedRouteName;
        }
    }
    
    // Hide tab bar on AgentDetails or AgencyDetails screens
    if (focusedRouteName === 'AgentDetails' || focusedRouteName === 'AgencyDetails') {
        return null;
    }
    
    const getIconName = (routeName, focused) => {
        switch (routeName) {
            case 'Home':
                return 'home';
            case 'Properties':
                return 'search';
            case 'Projects':
                return 'document-text';
            case 'Agents':
                return 'people';
            case 'More':
                return 'ellipsis-horizontal';
            default:
                return 'home';
        }
    };

    const getIconColor = (routeName, focused) => {
        if (focused) {
            // Active state - red color for all tabs
            return colors.red;
        }
        // Inactive state - grey
        return colors.gray;
    };

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const iconName = getIconName(route.name, isFocused);
                const iconColor = getIconColor(route.name, isFocused);

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons 
                                name={iconName} 
                                size={24} 
                                color={iconColor} 
                            />
                        </View>
                        <Text
                            style={[
                                styles.label,
                                isFocused && styles.labelFocused,
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: 12,
        paddingHorizontal: 4,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        ...Platform.select({
            ios: {
                borderTopWidth: 0.5,
                borderTopColor: colors.border,
            },
        }),
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    iconContainer: {
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
    },
    label: {
        fontSize: 11,
        color: colors.darkGray,
        fontFamily: 'Lato_400Regular',
        marginTop: 2,
    },
    labelFocused: {
        color: colors.red,
        fontFamily: 'Lato_400Regular',
    },
});

export default BottomTabBar;

