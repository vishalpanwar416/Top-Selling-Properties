import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MORE_TINT = '#E5EDE7';

const ProfileScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const isLoggedIn = false;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My account</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{isLoggedIn ? 'S' : '?'}</Text>
                    </View>
                    <Text style={styles.heroTitle}>{isLoggedIn ? 'Sam' : 'Guest'}</Text>
                    <Text style={styles.heroSubtitle}>
                        {isLoggedIn ? 'sam@example.com' : 'Log in to save favorites and get alerts'}
                    </Text>
                </View>

                {!isLoggedIn ? (
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate('AuthStart')}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.primaryBtnText}>Log in / Sign up</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Profile details</Text>
                            <View style={styles.card}>
                                <View style={styles.infoRow}>
                                    <Ionicons name="person-outline" size={20} color={colors.logoGreen} />
                                    <Text style={styles.infoLabel}>Name</Text>
                                    <Text style={styles.infoValue}>Sam</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Ionicons name="mail-outline" size={20} color={colors.logoGreen} />
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>sam@example.com</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Ionicons name="call-outline" size={20} color={colors.logoGreen} />
                                    <Text style={styles.infoLabel}>Phone</Text>
                                    <Text style={styles.infoValue}>+91 98765 43210</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Saved</Text>
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate('Favorites')}
                                activeOpacity={0.85}
                            >
                                <View style={styles.linkRow}>
                                    <Ionicons name="heart-outline" size={22} color={colors.logoGreen} />
                                    <Text style={styles.linkText}>Saved properties</Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} activeOpacity={0.85}>
                                <View style={styles.linkRow}>
                                    <Ionicons name="search-outline" size={22} color={colors.logoGreen} />
                                    <Text style={styles.linkText}>Saved searches</Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: MORE_TINT },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    placeholder: { width: 32 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
    hero: {
        marginBottom: 20,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: colors.logoGreen,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: { fontSize: 28, fontWeight: '700', color: colors.white },
    heroTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
    heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4, textAlign: 'center' },
    primaryBtn: {
        backgroundColor: colors.logoGreen,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    primaryBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
    section: { marginTop: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.logoGreen,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    infoLabel: { marginLeft: 12, fontSize: 14, color: colors.textSecondary, width: 80 },
    infoValue: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    divider: { height: 1, backgroundColor: colors.border, marginLeft: 32 },
    linkRow: { flexDirection: 'row', alignItems: 'center' },
    linkText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
});

export default ProfileScreen;
