import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MORE_TINT = '#E5EDE7';

const POLICY_SECTIONS = [
    {
        title: 'Information we collect',
        body: 'We collect information you provide when you register, search for properties, contact developers, or use our home loan and legal services. This may include name, email, phone number, location, and search preferences.',
    },
    {
        title: 'How we use it',
        body: 'We use your information to show relevant properties, connect you with partners (banks, legal, interiors), send notifications about new projects and price alerts, and improve our services.',
    },
    {
        title: 'Sharing with third parties',
        body: 'We may share your contact and preference data with verified developers, partner banks, and service providers only when you express interest (e.g. apply for a loan or request a callback). We do not sell your personal data.',
    },
    {
        title: 'Data security',
        body: 'We use industry-standard measures to protect your data. You can request access, correction, or deletion of your data by contacting us.',
    },
    {
        title: 'Updates',
        body: 'We may update this policy from time to time. The latest version will always be available in the app and on our website.',
    },
];

const PrivacyPolicyScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Ionicons name="shield-checkmark-outline" size={40} color="rgba(255,255,255,0.95)" />
                    <Text style={styles.heroTitle}>Privacy policy</Text>
                    <Text style={styles.heroSubtitle}>Last updated: 2024</Text>
                </View>

                {POLICY_SECTIONS.map((s, i) => (
                    <View key={i} style={styles.section}>
                        <Text style={styles.sectionTitle}>{s.title}</Text>
                        <View style={styles.card}>
                            <Text style={styles.body}>{s.body}</Text>
                        </View>
                    </View>
                ))}

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
        padding: 22,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: colors.logoGreen,
    },
    heroTitle: { fontSize: 20, fontWeight: '700', color: colors.white, marginTop: 10 },
    heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    section: { paddingHorizontal: 16, marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: colors.logoGreen,
    },
    body: { fontSize: 15, color: colors.textPrimary, lineHeight: 24 },
});

export default PrivacyPolicyScreen;
