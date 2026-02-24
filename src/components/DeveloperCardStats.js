import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.58;

const DeveloperCardStats = ({ developer, onPress }) => {
    if (!developer) return null;
    const established = developer.established || '—';
    const projectsCount = developer.projectsCount ?? 0;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <Image
                source={{ uri: developer.logo || 'https://via.placeholder.com/80' }}
                style={styles.logo}
            />
            <Text style={styles.name} numberOfLines={2}>{developer.name}</Text>
            {developer.badge ? (
                <View style={styles.badge}>
                    <Ionicons name="shield-checkmark" size={10} color={colors.white} />
                    <Text style={styles.badgeText}>{developer.badge}</Text>
                </View>
            ) : null}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{established}</Text>
                    <Text style={styles.statLabel}>Established</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{projectsCount}</Text>
                    <Text style={styles.statLabel}>Projects</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: 16,
        padding: 14,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.28)',
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
    },
    name: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.28)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 10,
        gap: 4,
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: colors.white,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
        paddingTop: 10,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.white,
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: 2,
    },
});

export default DeveloperCardStats;
