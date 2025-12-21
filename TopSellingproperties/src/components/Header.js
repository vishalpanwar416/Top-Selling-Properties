import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';
import Logo from '../../assets/logo.svg';

const Header = ({ navigation, transparent = false }) => {
    const insets = useSafeAreaInsets();

    const handleMenuPress = () => {
        if (navigation && navigation.openDrawer) {
            navigation.openDrawer();
        }
    };

    return (
        <View style={[
            styles.container,
            { paddingTop: insets.top + 12 },
            transparent && styles.transparentContainer
        ]}>
            <View style={styles.leftContainer}>
                <Logo
                    width={48}
                    height={48}
                    fill={transparent ? colors.primary : colors.primary}
                />
                <Text style={styles.brandTitle} numberOfLines={1}>
                    <Text style={styles.topText}>Top </Text>
                    <Text style={styles.sellingText}>Selling </Text>
                    <Text style={styles.propertiesText}>Properties</Text>
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleMenuPress}
                style={styles.menuButton}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.hamburgerLine,
                    transparent && { backgroundColor: colors.primary }
                ]} />
                <View style={[
                    styles.hamburgerLine,
                    transparent && { backgroundColor: colors.primary }
                ]} />
                <View style={[
                    styles.hamburgerLine,
                    transparent && { backgroundColor: colors.primary }
                ]} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    transparentContainer: {
        backgroundColor: 'transparent',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    brandTitle: {
        marginLeft: 8,
    },
    topText: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.red,
        letterSpacing: -0.5,
    },
    sellingText: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.black,
        letterSpacing: -0.5,
    },
    propertiesText: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -0.5,
    },
    menuButton: {
        padding: 10,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: 'transparent',
    },
    hamburgerLine: {
        width: 26,
        height: 3,
        backgroundColor: colors.textPrimary,
        marginVertical: 3,
        borderRadius: 3,
    },
    logoText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    logoImage: {
        width: 52,
        height: 52,
    },
});

export default Header;
