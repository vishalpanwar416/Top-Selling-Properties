import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MORE_TINT = '#E5EDE7'; // matches auth start tint

const MoreScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.content}
                contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 4 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Credai logo hero - no app header */}
                <View style={[styles.hero, { paddingTop: insets.top + 16, paddingBottom: 20 }]}>
                    <Image
                        source={require('../../assets/logo.jpeg')}
                        style={styles.heroLogo}
                        resizeMode="contain"
                    />
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="person" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>My account</Text>
                            <Text style={styles.cardDesc}>Profile, saved properties & searches</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('AuthStart')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="log-in-outline" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Log in</Text>
                            <Text style={styles.cardDesc}>Sign in to save favorites and get alerts</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>
                </View>

                {/* Project development solutions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project development solutions</Text>
                    <Text style={styles.sectionSubtitle}>Home loans, legal support & interiors</Text>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('HomeLoan')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="home" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Home loan</Text>
                            <Text style={styles.cardDesc}>Best rates, quick approval from partner banks</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('LegalServices')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="document-text" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Legal services</Text>
                            <Text style={styles.cardDesc}>Documentation, RERA & agreement support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('HomeInterior')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="color-palette" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Home interiors</Text>
                            <Text style={styles.cardDesc}>End-to-end design & execution packages</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.menuCard}>
                        <TouchableOpacity
                            style={styles.menuRow}
                            onPress={() => navigation.navigate('Settings')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="settings-outline" size={22} color={colors.logoGreen} />
                            <Text style={styles.menuRowText}>Settings</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity
                            style={styles.menuRow}
                            onPress={() => navigation.navigate('Notifications')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="notifications-outline" size={22} color={colors.logoGreen} />
                            <Text style={styles.menuRowText}>Notifications</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick links */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick links</Text>
                    <View style={styles.menuCard}>
                        <TouchableOpacity
                            style={styles.menuRow}
                            onPress={() => navigation.navigate('Favorites')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="heart-outline" size={22} color={colors.logoGreen} />
                            <Text style={styles.menuRowText}>Favorites</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity
                            style={styles.menuRow}
                            onPress={() => navigation.navigate('Contact')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="mail-outline" size={22} color={colors.logoGreen} />
                            <Text style={styles.menuRowText}>Contact us</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* About & legal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About & legal</Text>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('About')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="business-outline" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>About us</Text>
                            <Text style={styles.cardDesc}>Our story, mission & website</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="shield-checkmark-outline" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Privacy policy</Text>
                            <Text style={styles.cardDesc}>How we use your data</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('Terms')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconWrap}>
                            <Ionicons name="document-text-outline" size={26} color={colors.logoGreen} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Terms of use</Text>
                            <Text style={styles.cardDesc}>Terms and conditions</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.logoGreen} />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 Credai</Text>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MORE_TINT,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    hero: {
        backgroundColor: colors.logoGreen,
        marginHorizontal: -20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    heroLogo: {
        width: 160,
        height: 56,
    },
    section: {
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 14,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: colors.logoGreen,
    },
    cardIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.filterRedLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    cardDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    menuCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    menuDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 52,
    },
    menuRowText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginLeft: 14,
        flex: 1,
    },
    footer: {
        paddingTop: 6,
        paddingBottom: 2,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    versionText: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 4,
    },
});

export default MoreScreen;
