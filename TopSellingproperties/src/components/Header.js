import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

const Header = ({ navigation, title = 'Top Selling Properties', transparent = false }) => {
    const insets = useSafeAreaInsets();

    const handleMenuPress = () => {
        if (navigation && navigation.openDrawer) {
            navigation.openDrawer();
        }
    };

    return (
        <View style={[
            styles.container,
            { paddingTop: insets.top + 10 },
            transparent && styles.transparentContainer
        ]}>
            <View style={styles.leftContainer}>
                <Image
                    source={require('../../assets/logo.svg')}
                    style={[
                        styles.logoImage,
                        { tintColor: transparent ? '#FFFFFF' : (colors.maroon || colors.red) }
                    ]}
                />
            </View>

            <View style={styles.logoContainer}>
                <Text style={[styles.logoText, transparent && { color: '#FFFFFF' }]}>TOP SELLING </Text>
                <Text style={[styles.logoTextAccent, transparent && { color: '#FFFFFF' }]}>PROPERTIES</Text>
            </View>

            <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
                <View style={[styles.hamburgerLine, transparent && { backgroundColor: '#FFFFFF' }]} />
                <View style={[styles.hamburgerLine, transparent && { backgroundColor: '#FFFFFF' }]} />
                <View style={[styles.hamburgerLine, transparent && { backgroundColor: '#FFFFFF' }]} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    transparentContainer: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    leftContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    menuButton: {
        padding: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hamburgerLine: {
        width: 22,
        height: 2.5,
        backgroundColor: colors.black,
        marginVertical: 2,
        borderRadius: 2,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        letterSpacing: 0.5,
    },
    logoTextAccent: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.red,
        letterSpacing: 0.5,
    },
});

export default Header;
