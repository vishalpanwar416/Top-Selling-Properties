import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.36;

const DeveloperCardClassic = ({ developer, onPress }) => {
    if (!developer) return null;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <Image
                source={{ uri: developer.logo || 'https://via.placeholder.com/80' }}
                style={styles.logo}
            />
            <Text style={styles.name} numberOfLines={2}>{developer.name}</Text>
            {developer.badge ? (
                <View style={styles.badge}>
                    <Ionicons name="shield-checkmark" size={12} color={colors.white} />
                    <Text style={styles.badgeText}>{developer.badge}</Text>
                </View>
            ) : null}
            <Text style={styles.count}>{developer.projectsCount ?? 0} Projects</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        alignItems: 'center',
        paddingVertical: 8,
        marginRight: 16,
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
        marginBottom: 8,
    },
    name: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 4,
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: colors.white,
    },
    count: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.9)',
    },
});

export default DeveloperCardClassic;
