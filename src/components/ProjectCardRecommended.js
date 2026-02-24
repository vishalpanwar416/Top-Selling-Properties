import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import LikeButton from './LikeButton';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.72;
const imageHeight = 160;

const ProjectCardRecommended = ({ project, onPress }) => {
    const [imageIndex] = useState(0);
    if (!project) return null;

    const images = project.images?.length ? project.images : ['https://via.placeholder.com/400x250'];
    const imageUri = images[imageIndex];

    const formatPrice = (p) => {
        if (!p) return '';
        if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
        if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
        return `₹${(p / 100000).toFixed(0)} L`;
    };
    const priceStr = project.priceRange || (project.startingPrice ? `${formatPrice(project.startingPrice)} - ${formatPrice(project.startingPrice * 1.5)}` : 'Price on Request');
    const config = project.bedroomRange || '1, 2, 3, 4 BHK Apartment';
    const possession = project.handover ? `Possession from ${project.handover}` : '';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
            <View style={styles.imageWrap}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                <View style={styles.imageOverlay} />
                <View style={styles.topBadges}>
                    <View style={styles.reraBadge}>
                        <Ionicons name="checkmark-circle" size={12} color={colors.white} />
                        <Text style={styles.reraText}>RERA</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <LikeButton size={18} buttonStyle={styles.heartBtn} />
                </View>
                {possession ? (
                    <View style={styles.possessionWrap}>
                        <Text style={styles.possessionText}>{possession}</Text>
                    </View>
                ) : null}
            </View>
            <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>{project.name || 'Project'}</Text>
                <Text style={styles.config} numberOfLines={1}>{config}</Text>
                <Text style={styles.location} numberOfLines={1}>in {project.location || project.city || '—'}</Text>
                <Text style={styles.price}>{priceStr}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginRight: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    imageWrap: {
        height: imageHeight,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    topBadges: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    reraBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    reraText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
    },
    heartBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    possessionWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    possessionText: {
        fontSize: 11,
        color: colors.white,
    },
    body: {
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    config: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    location: {
        fontSize: 11,
        color: colors.textTertiary,
        marginBottom: 6,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
    },
});

export default ProjectCardRecommended;
