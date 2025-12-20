import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const STICKY_TOP_PADDING = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10;

const SearchBar = ({ 
    onPress, 
    placeholder = 'Search for a locality, area or city',
    value = '',
    style,
    containerStyle,
    isSticky = false,
}) => {
    const paddingAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(paddingAnim, {
            toValue: isSticky ? STICKY_TOP_PADDING : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isSticky]);

    return (
        <Animated.View style={[
            styles.container, 
            containerStyle,
            { paddingTop: paddingAnim }
        ]}>
            <TouchableOpacity
                style={[styles.searchBox, style]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <Ionicons name="search" size={22} color={colors.primary} style={styles.searchIcon} />
                <Text style={[styles.searchText, !value && styles.placeholder]}>
                    {value || placeholder}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingBottom: 12,
        paddingHorizontal: 20,
        zIndex: 100,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 26,
        paddingHorizontal: 18,
        height: 52,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchText: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    placeholder: {
        color: colors.textTertiary,
    },
});

export default SearchBar;
