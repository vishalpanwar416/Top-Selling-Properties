import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

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
                <Image
                    source={require('../../assets/logo.jpeg')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
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
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingLeft: 0,
        paddingRight: 20,
        paddingBottom: 16,
    },
    transparentContainer: {
        backgroundColor: 'transparent',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
    logoImage: {
        width: 140,
        height: 48,
    },
});

export default Header;
