import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const menuItems = [
    { name: 'Home', icon: 'home', iconType: 'Ionicons', screen: 'Home' },
    { name: 'Favorites', icon: 'heart', iconType: 'Ionicons', screen: 'Favorites' },
    { name: 'Contact Us', icon: 'phone', iconType: 'Ionicons', screen: 'Contact' },
];

const Sidebar = (props) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 32 }]}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>TOP SELLING</Text>
                    <Text style={styles.logoTextAccent}> PROPERTIES</Text>
                </View>
                <Text style={styles.tagline}>Premium Real Estate Experience</Text>
            </View>

            <DrawerContentScrollView 
                {...props} 
                contentContainerStyle={styles.menuContainer}
                showsVerticalScrollIndicator={false}
            >
                {menuItems.map((item, index) => {
                    const IconComponent = item.iconType === 'Ionicons' ? Ionicons : MaterialIcons;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.screen)}
                            activeOpacity={0.7}
                        >
                            <IconComponent 
                                name={item.icon} 
                                size={24} 
                                color={colors.primary} 
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuText}>{item.name}</Text>
                        </TouchableOpacity>
                    );
                })}
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
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        letterSpacing: 0.3,
    },
    logoTextAccent: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.secondary,
        letterSpacing: 0.3,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '400',
        letterSpacing: 0.2,
    },
    menuContainer: {
        paddingTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        marginHorizontal: 12,
        marginVertical: 4,
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    menuIcon: {
        marginRight: 20,
    },
    menuText: {
        fontSize: 17,
        color: colors.textPrimary,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    versionText: {
        fontSize: 12,
        color: colors.textTertiary,
        textAlign: 'center',
        marginTop: 6,
        fontWeight: '400',
    },
});

export default Sidebar;
