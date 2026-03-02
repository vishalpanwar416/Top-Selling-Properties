import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MORE_TINT = '#E5EDE7';
const DEFAULT_CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];

const SettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState(true);
    const [locationEnabled, setLocationEnabled] = useState(true);
    const [defaultCity, setDefaultCity] = useState('Bangalore');

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Ionicons name="settings-outline" size={40} color="rgba(255,255,255,0.95)" />
                    <Text style={styles.heroTitle}>Preferences</Text>
                    <Text style={styles.heroSubtitle}>Manage app behaviour</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Ionicons name="notifications-outline" size={22} color={colors.logoGreen} style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>Push notifications</Text>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: colors.border, true: colors.filterRedLight }}
                                thumbColor={notifications ? colors.logoGreen : colors.gray}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Ionicons name="location-outline" size={22} color={colors.logoGreen} style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>Use location</Text>
                            <Switch
                                value={locationEnabled}
                                onValueChange={setLocationEnabled}
                                trackColor={{ false: colors.border, true: colors.filterRedLight }}
                                thumbColor={locationEnabled ? colors.logoGreen : colors.gray}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Default city</Text>
                    <Text style={styles.sectionSubtitle}>Show projects from this city first</Text>
                    <View style={styles.card}>
                        {DEFAULT_CITIES.map((city) => (
                            <TouchableOpacity
                                key={city}
                                style={styles.cityRow}
                                onPress={() => setDefaultCity(city)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cityText}>{city}</Text>
                                {defaultCity === city && (
                                    <Ionicons name="checkmark-circle" size={22} color={colors.logoGreen} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
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
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
    sectionSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: colors.logoGreen,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    rowIcon: { marginRight: 12 },
    rowLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    divider: { height: 1, backgroundColor: colors.border, marginLeft: 50 },
    cityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    cityText: { fontSize: 16, color: colors.textPrimary },
});

export default SettingsScreen;
