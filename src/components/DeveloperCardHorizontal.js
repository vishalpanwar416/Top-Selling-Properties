import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.72;

const DeveloperCardHorizontal = ({ developer, onPress }) => {
    if (!developer) return null;
    const established = developer.established || '—';
    const projectsCount = developer.projectsCount ?? 0;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <Image
                source={{ uri: developer.logo || 'https://via.placeholder.com/80' }}
                style={styles.logo}
            />
            <View style={styles.body}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{developer.name}</Text>
                    <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.9)" />
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statBlock}>
                        <Text style={styles.statValue}>{established}</Text>
                        <Text style={styles.statLabel}>Year estd.</Text>
                    </View>
                    <View style={styles.statsDivider} />
                    <View style={styles.statBlock}>
                        <Text style={styles.statValue}>{projectsCount}</Text>
                        <Text style={styles.statLabel}>Projects</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        marginRight: 16,
    },
    logo: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
    body: {
        flex: 1,
        marginLeft: 14,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.white,
        flex: 1,
        marginRight: 4,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statBlock: {
        alignItems: 'flex-start',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.white,
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: 2,
    },
    statsDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        marginHorizontal: 12,
    },
});

export default DeveloperCardHorizontal;
