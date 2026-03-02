import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MORE_TINT = '#E5EDE7';

const NOTIFICATION_TYPES = [
    { id: 'new_projects', label: 'New projects in your city', desc: 'When new projects are added', icon: 'home-outline' },
    { id: 'price_drop', label: 'Price drop alerts', desc: 'When saved properties change price', icon: 'trending-down-outline' },
    { id: 'recommendations', label: 'Recommendations', desc: 'Personalised project suggestions', icon: 'bulb-outline' },
    { id: 'offers', label: 'Offers & promotions', desc: 'Home loan and partner offers', icon: 'pricetag-outline' },
];

const NotificationsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [settings, setSettings] = useState({
        new_projects: true,
        price_drop: true,
        recommendations: false,
        offers: true,
    });

    const toggle = (id) => {
        setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Ionicons name="notifications-outline" size={40} color="rgba(255,255,255,0.95)" />
                    <Text style={styles.heroTitle}>Notification preferences</Text>
                    <Text style={styles.heroSubtitle}>Choose what you want to receive</Text>
                </View>

                <View style={styles.section}>
                    {NOTIFICATION_TYPES.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.row}>
                                <Ionicons name={item.icon} size={22} color={colors.logoGreen} style={styles.rowIcon} />
                                <View style={styles.rowBody}>
                                    <Text style={styles.rowLabel}>{item.label}</Text>
                                    <Text style={styles.rowDesc}>{item.desc}</Text>
                                </View>
                                <Switch
                                    value={settings[item.id]}
                                    onValueChange={() => toggle(item.id)}
                                    trackColor={{ false: colors.border, true: colors.filterRedLight }}
                                    thumbColor={settings[item.id] ? colors.logoGreen : colors.gray}
                                />
                            </View>
                        </View>
                    ))}
                </View>

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
    section: { paddingHorizontal: 16, marginTop: 24 },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.logoGreen,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowIcon: { marginRight: 12 },
    rowBody: { flex: 1 },
    rowLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    rowDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});

export default NotificationsScreen;
