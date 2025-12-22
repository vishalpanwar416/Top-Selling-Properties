import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const STICKY_TOP_PADDING = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10;

// Default placeholders based on search type
const getDefaultPlaceholder = (searchType) => {
    switch (searchType) {
        case 'properties':
            return 'Search location...';
        case 'projects':
            return 'Search projects...';
        case 'agents':
            return 'Search by Agent name or Location';
        case 'agencies':
            return 'Search by Agency name or Location';
        default:
            return 'Search for a locality, area or city';
    }
};

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
    searchType = 'general', // 'general', 'properties', 'projects', 'agents', 'agencies'
    showClearButton = false,
    onClear,
    autoFocus = false,
    returnKeyType = 'search',
}) => {
    const paddingAnim = useRef(new Animated.Value(0)).current;
    const finalPlaceholder = placeholder || getDefaultPlaceholder(searchType);

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
                    <Ionicons name="search" size={18} color={colors.primary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={finalPlaceholder}
                        placeholderTextColor={colors.textTertiary}
                        value={value}
                        onChangeText={onChangeText}
                        autoFocus={autoFocus}
                        returnKeyType={returnKeyType}
                    />
                    {showClearButton && value.length > 0 && (
                        <TouchableOpacity
                            onPress={onClear || (() => onChangeText && onChangeText(''))}
                            style={styles.clearButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
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
                <Ionicons name="search" size={18} color={colors.primary} style={styles.searchIcon} />
                <Text style={[styles.searchText, !value && styles.placeholder]}>
                    {value || finalPlaceholder}
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
        paddingBottom: 8,
        paddingHorizontal: 20,
        zIndex: 100,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingHorizontal: 14,
        height: 40,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchText: {
        flex: 1,
        fontSize: 14,
        color: colors.textPrimary,
        fontFamily: 'Lato_400Regular',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.textPrimary,
        fontFamily: 'Lato_400Regular',
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
        fontFamily: 'Lato_400Regular',
        color: colors.primary,
        marginLeft: 4,
    },
    clearButton: {
        marginLeft: 8,
        padding: 2,
    },
});

export default SearchBar;
