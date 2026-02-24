import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import homeSectionsData from '../data/homeSections.json';

const DevelopersScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const allDevelopers = useMemo(() => {
        const verified = homeSectionsData?.credaiVerifiedDevelopers ?? [];
        const top = homeSectionsData?.topDevelopers ?? [];
        const featured = homeSectionsData?.featuredDevelopers ?? [];
        const byId = new Map();
        [...verified, ...top, ...featured].forEach((d) => {
            if (d?.id && !byId.has(d.id)) byId.set(d.id, d);
        });
        return Array.from(byId.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Developers</Text>
                <View style={styles.placeholder} />
            </View>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.subtitle}>Credai verified and trusted developers</Text>
                {allDevelopers.length === 0 ? (
                    <Text style={styles.empty}>No developers listed yet.</Text>
                ) : (
                    allDevelopers.map((dev) => (
                        <TouchableOpacity
                            key={dev.id}
                            style={styles.card}
                            onPress={() => navigation.navigate('DeveloperProfile', { developer: dev })}
                            activeOpacity={0.85}
                        >
                            <Image
                                source={{ uri: dev.logo || 'https://via.placeholder.com/80' }}
                                style={styles.logo}
                            />
                            <View style={styles.cardBody}>
                                <Text style={styles.name} numberOfLines={2}>{dev.name}</Text>
                                {dev.location ? (
                                    <Text style={styles.location} numberOfLines={1}>{dev.location}</Text>
                                ) : null}
                                <View style={styles.meta}>
                                    {dev.badge ? (
                                        <View style={styles.badge}>
                                            <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
                                            <Text style={styles.badgeText}>{dev.badge}</Text>
                                        </View>
                                    ) : null}
                                    <Text style={styles.projects}>{dev.projectsCount ?? 0} projects</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
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
    title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    placeholder: { width: 32 },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingTop: 16 },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    empty: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 24,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.lightGray,
        marginRight: 14,
    },
    cardBody: { flex: 1 },
    name: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    location: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 10 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.filterRedLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 4,
    },
    badgeText: { fontSize: 11, fontWeight: '600', color: colors.primary },
    projects: { fontSize: 12, color: colors.textTertiary },
});

export default DevelopersScreen;
