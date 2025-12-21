import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const STICKY_TOP_PADDING = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10;

const SearchBar = ({
    onPress,
    placeholder = 'Search for a locality, area or city',
    value = '',
    onChangeText,
    editable = false,
    style,
    containerStyle,
    isSticky = false,
    showSortButton = false,
    sortValue = 'Latest',
    onSortPress,
}) => {
    const paddingAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(paddingAnim, {
            toValue: isSticky ? STICKY_TOP_PADDING : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isSticky]);

    // If editable, show TextInput; otherwise show TouchableOpacity
    if (editable && onChangeText) {
        return (
            <Animated.View style={[
                styles.container,
                containerStyle,
                { paddingTop: paddingAnim }
            ]}>
                <View style={[styles.searchBox, style]}>
                    <Ionicons name="search" size={22} color={colors.primary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={placeholder}
                        placeholderTextColor={colors.textTertiary}
                        value={value}
                        onChangeText={onChangeText}
                    />
                    {showSortButton && onSortPress && (
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={onSortPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="swap-vertical" size={18} color={colors.primary} />
                            <Text style={styles.sortButtonText}>{sortValue}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        );
    }

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
                {showSortButton && onSortPress && (
                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={onSortPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="swap-vertical" size={18} color={colors.primary} />
                        <Text style={styles.sortButtonText}>{sortValue}</Text>
                    </TouchableOpacity>
                )}
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
        fontFamily: 'Poppins_500Medium',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        fontFamily: 'Poppins_500Medium',
        padding: 0,
    },
    placeholder: {
        color: colors.textTertiary,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: 'rgba(185, 28, 28, 0.2)',
    },
    sortButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
        marginLeft: 4,
    },
});

export default SearchBar;
