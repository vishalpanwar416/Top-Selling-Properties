import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MORE_TINT = '#E5EDE7';
const WEBSITE_URL = 'https://credai.in';

const AboutScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const openWebsite = () => {
        Linking.openURL(WEBSITE_URL).catch(() => {});
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About us</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Ionicons name="business-outline" size={44} color="rgba(255,255,255,0.95)" />
                    <Text style={styles.heroTitle}>Credai</Text>
                    <Text style={styles.heroSubtitle}>Your dream home starts here</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our story</Text>
                    <View style={styles.card}>
                        <Text style={styles.body}>
                            Credai connects homebuyers with verified developers and the best property options across India.
                            We focus on transparency, RERA compliance, and end-to-end support—from discovery to home loan
                            and legal services.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our mission</Text>
                    <View style={styles.card}>
                        <Text style={styles.body}>
                            To make finding and buying a home simple, safe, and stress-free. We partner with trusted
                            builders and banks to offer you the right projects, financing, and legal support under one roof.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.websiteBtn} onPress={openWebsite} activeOpacity={0.9}>
                    <Ionicons name="globe-outline" size={22} color={colors.white} />
                    <Text style={styles.websiteBtnText}>Visit our website</Text>
                    <Ionicons name="open-outline" size={18} color={colors.white} />
                </TouchableOpacity>

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
    scrollContent: { paddingBottom: 24 },
    hero: {
        margin: 16,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: colors.logoGreen,
    },
    heroTitle: { fontSize: 22, fontWeight: '800', color: colors.white, marginTop: 12 },
    heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    section: { paddingHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 18,
        borderLeftWidth: 4,
        borderLeftColor: colors.logoGreen,
    },
    body: { fontSize: 15, color: colors.textPrimary, lineHeight: 24 },
    websiteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.logoGreen,
        marginHorizontal: 16,
        marginTop: 28,
        paddingVertical: 16,
        borderRadius: 14,
        gap: 10,
    },
    websiteBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
});

export default AboutScreen;
