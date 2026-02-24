import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.68;

const DeveloperCardMinimal = ({ developer, onPress }) => {
    if (!developer) return null;
    const established = developer.established || '';
    const projectsCount = developer.projectsCount ?? 0;
    const subtitle = [established && `${established} estd.`, `${projectsCount} Projects`].filter(Boolean).join(' · ');

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.logoWrap}>
                <Image
                    source={{ uri: developer.logo || 'https://via.placeholder.com/80' }}
                    style={styles.logo}
                />
            </View>
            <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>{developer.name}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                <View style={styles.arrowWrap}>
                    <Text style={styles.viewText}>View</Text>
                    <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.95)" />
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
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: 14,
        padding: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.28)',
    },
    logoWrap: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    body: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.88)',
        marginBottom: 4,
    },
    arrowWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.95)',
        marginRight: 2,
    },
});

export default DeveloperCardMinimal;
