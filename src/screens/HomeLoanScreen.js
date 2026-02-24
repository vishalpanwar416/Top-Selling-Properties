import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    useWindowDimensions,
    Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

const HomeLoanScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [loanAmount, setLoanAmount] = useState('');
    const [tenure, setTenure] = useState('');
    const [income, setIncome] = useState('');

    const partners = [
        { name: 'HDFC Home Loan', rate: '8.5%', icon: 'business' },
        { name: 'ICICI Home Loan', rate: '8.6%', icon: 'business' },
        { name: 'SBI Home Loan', rate: '8.4%', icon: 'business' },
        { name: 'Axis Bank', rate: '8.55%', icon: 'business' },
    ];

    const handleApply = () => {
        Linking.openURL('tel:+918549988888').catch(() => {});
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Home Loan</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.hero}>
                    <Ionicons name="home" size={48} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.heroTitle}>Home Loans</Text>
                    <Text style={styles.heroSubtitle}>Get the best rates from our partner banks. Quick approval, transparent process.</Text>
                </LinearGradient>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Eligibility</Text>
                    <View style={styles.card}>
                        <Text style={styles.inputLabel}>Loan amount (₹)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 50,00,000"
                            placeholderTextColor={colors.textTertiary}
                            value={loanAmount}
                            onChangeText={setLoanAmount}
                            keyboardType="number-pad"
                        />
                        <Text style={styles.inputLabel}>Tenure (years)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 20"
                            placeholderTextColor={colors.textTertiary}
                            value={tenure}
                            onChangeText={setTenure}
                            keyboardType="number-pad"
                        />
                        <Text style={styles.inputLabel}>Monthly income (₹)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 1,50,000"
                            placeholderTextColor={colors.textTertiary}
                            value={income}
                            onChangeText={setIncome}
                            keyboardType="number-pad"
                        />
                        <TouchableOpacity style={styles.checkBtn} onPress={() => {}} activeOpacity={0.8}>
                            <Text style={styles.checkBtnText}>Check eligibility</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Partner banks & rates</Text>
                    {partners.map((p, i) => (
                        <TouchableOpacity key={i} style={styles.partnerCard} activeOpacity={0.8}>
                            <View style={styles.partnerIcon}>
                                <Ionicons name={p.icon} size={24} color={colors.primary} />
                            </View>
                            <View style={styles.partnerInfo}>
                                <Text style={styles.partnerName}>{p.name}</Text>
                                <Text style={styles.partnerRate}>From {p.rate} p.a.</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Credai Home Loan?</Text>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                        <Text style={styles.benefitText}>Best interest rates from top banks</Text>
                    </View>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                        <Text style={styles.benefitText}>Quick sanction & disbursement</Text>
                    </View>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                        <Text style={styles.benefitText}>Dedicated relationship manager</Text>
                    </View>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                        <Text style={styles.benefitText}>No hidden charges</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.9}>
                    <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.applyBtnGradient}>
                        <Ionicons name="call" size={20} color={colors.white} />
                        <Text style={styles.applyBtnText}>Apply / Get call back</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
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
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    placeholder: { width: 32 },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 24 },
    hero: {
        margin: 16,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    heroTitle: { fontSize: 22, fontWeight: '700', color: colors.white, marginTop: 12 },
    heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 8, textAlign: 'center' },
    section: { paddingHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    card: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    inputLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.textPrimary,
    },
    checkBtn: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingVertical: 14,
        marginTop: 20,
        alignItems: 'center',
    },
    checkBtnText: { fontSize: 16, fontWeight: '700', color: colors.white },
    partnerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    partnerIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.filterRedLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    partnerInfo: { flex: 1 },
    partnerName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    partnerRate: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    benefitText: { fontSize: 15, color: colors.textPrimary, marginLeft: 10, flex: 1 },
    applyBtn: { marginHorizontal: 16, marginTop: 28, borderRadius: 12, overflow: 'hidden' },
    applyBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    applyBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
});

export default HomeLoanScreen;
