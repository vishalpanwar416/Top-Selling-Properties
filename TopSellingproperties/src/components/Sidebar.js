import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

const menuItems = [
    { name: 'Home', icon: '🏠', screen: 'Home' },
    { name: 'Favorites', icon: '❤️', screen: 'Favorites' },
    { name: 'Contact Us', icon: '📞', screen: 'Contact' },
];

const Sidebar = (props) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 30 }]}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>TOP SELLING</Text>
                    <Text style={styles.logoTextAccent}> PROPERTIES</Text>
                </View>
                <Text style={styles.tagline}>Premium Real Estate Experience</Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={styles.menuText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </DrawerContentScrollView>

            <View style={styles.footer}>
                <View style={styles.divider} />
                <Text style={styles.footerText}>© 2024 Top Selling Properties</Text>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        backgroundColor: colors.maroon,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        letterSpacing: 1,
    },
    logoTextAccent: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.red,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    menuContainer: {
        paddingTop: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 12,
        marginVertical: 2,
        borderRadius: 10,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 16,
    },
    footerText: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    versionText: {
        fontSize: 11,
        color: colors.gray,
        textAlign: 'center',
        marginTop: 4,
    },
});

export default Sidebar;
