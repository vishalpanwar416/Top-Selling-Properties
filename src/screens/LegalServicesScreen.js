import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const services = [
    { title: 'Property documentation', desc: 'Sale deed, title verification, encumbrance certificate' },
    { title: 'RERA & compliance', desc: 'Registration, project compliance, buyer agreements' },
    { title: 'Agreement review', desc: 'Builder-buyer agreement, lease agreements' },
];

const LegalServicesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const handleContact = () => {
        Linking.openURL('tel:+918549988888').catch(() => {});
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Legal services</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Ionicons name="document-text" size={44} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.heroTitle}>Property legal support</Text>
                    <Text style={styles.heroSubtitle}>Verified legal partners for documentation & compliance</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What we offer</Text>
                    {services.map((s, i) => (
                        <View key={i} style={styles.serviceCard}>
                            <Ionicons name="shield-checkmark" size={24} color={colors.logoGreen} style={styles.serviceIcon} />
                            <View style={styles.serviceBody}>
                                <Text style={styles.serviceTitle}>{s.title}</Text>
                                <Text style={styles.serviceDesc}>{s.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.contactBtn} onPress={handleContact} activeOpacity={0.9}>
                    <View style={styles.contactBtnInner}>
                        <Ionicons name="call" size={20} color={colors.white} />
                        <Text style={styles.contactBtnText}>Contact legal team</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
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
    heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 6, textAlign: 'center' },
    section: { paddingHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    serviceCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    serviceIcon: { marginRight: 14 },
    serviceBody: { flex: 1 },
    serviceTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    serviceDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    contactBtn: { marginHorizontal: 16, marginTop: 28, borderRadius: 12, backgroundColor: colors.logoGreen },
    contactBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    contactBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
});

export default LegalServicesScreen;
