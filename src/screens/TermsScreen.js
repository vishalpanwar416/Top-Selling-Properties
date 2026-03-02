import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MORE_TINT = '#E5EDE7';

const TERMS_SECTIONS = [
    {
        title: 'Acceptance of terms',
        body: 'By using the Credai app, you agree to these terms. If you do not agree, please do not use our services.',
    },
    {
        title: 'Use of service',
        body: 'You may use the app to browse properties, connect with developers, and use our home loan, legal, and interior design partners. You must provide accurate information and use the service only for lawful purposes.',
    },
    {
        title: 'Listings and content',
        body: 'Property listings are provided by developers and partners. We do not guarantee the accuracy of every listing. You should verify details and visit properties before making decisions.',
    },
    {
        title: 'Third-party services',
        body: 'Home loan, legal, and interior services are offered by third parties. Your engagement with them is subject to their terms. Credai facilitates the connection but is not responsible for their services.',
    },
    {
        title: 'Limitation of liability',
        body: 'Credai is not liable for any loss arising from your use of the app or reliance on listings and partner services. Our liability is limited to the extent permitted by law.',
    },
];

const TermsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of use</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Ionicons name="document-text-outline" size={40} color="rgba(255,255,255,0.95)" />
                    <Text style={styles.heroTitle}>Terms of use</Text>
                    <Text style={styles.heroSubtitle}>Last updated: 2024</Text>
                </View>

                {TERMS_SECTIONS.map((s, i) => (
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

export default TermsScreen;
