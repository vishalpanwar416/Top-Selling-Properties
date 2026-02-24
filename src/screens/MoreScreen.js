import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import colors from '../theme/colors';

const MoreScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.title}>More</Text>
                    <Text style={styles.subtitle}>Additional options and settings</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project development solutions</Text>
                    <Text style={styles.sectionSubtitle}>Home loans, legal support & interiors</Text>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('HomeLoan')}
                        activeOpacity={0.85}
                    >
                        <View style={[styles.cardIconWrap, { backgroundColor: colors.filterRedLight }]}>
                            <Ionicons name="home" size={28} color={colors.primary} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Home loan</Text>
                            <Text style={styles.cardDesc}>Best rates, quick approval from partner banks</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('LegalServices')}
                        activeOpacity={0.85}
                    >
                        <View style={[styles.cardIconWrap, { backgroundColor: colors.tealLight }]}>
                            <Ionicons name="document-text" size={28} color={colors.teal} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Legal services</Text>
                            <Text style={styles.cardDesc}>Documentation, RERA & agreement support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('HomeInterior')}
                        activeOpacity={0.85}
                    >
                        <View style={[styles.cardIconWrap, { backgroundColor: colors.filterRedLight }]}>
                            <Ionicons name="color-palette" size={28} color={colors.primary} />
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Home interiors</Text>
                            <Text style={styles.cardDesc}>End-to-end design & execution packages</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.menuRow}
                        onPress={() => navigation.navigate('Favorites')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="heart-outline" size={24} color={colors.textSecondary} />
                        <Text style={styles.menuRowText}>Favorites</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuRow}
                        onPress={() => navigation.navigate('Contact')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="mail-outline" size={24} color={colors.textSecondary} />
                        <Text style={styles.menuRowText}>Contact us</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

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
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    section: {
        paddingVertical: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
    cardDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    menuRowText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginLeft: 14, flex: 1 },
});

export default MoreScreen;
