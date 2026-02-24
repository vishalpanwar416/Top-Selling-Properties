import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.76;
const imageHeight = 140;
const stripHeight = 72;

const ProjectCardCompact = ({ project, onPress }) => {
    const [imageIndex] = useState(0);
    if (!project) return null;

    const images = project.images?.length ? project.images : ['https://via.placeholder.com/400x250'];
    const imageUri = images[imageIndex];

    const formatPrice = (p) => {
        if (!p) return 'Price on Request';
        if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
        if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
        return `₹${(p / 100000).toFixed(0)} L`;
    };
    const priceStr = project.priceRange || (project.startingPrice ? formatPrice(project.startingPrice) : 'Price on Request');
    const typeLabel = project.bedroomRange || 'Residential';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
            <View style={styles.imageWrap}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.strip}>
                <View style={styles.stripTop}>
                    <Text style={styles.name} numberOfLines={1}>{project.name || 'Project'}</Text>
                    <TouchableOpacity style={styles.contactBtn} onPress={onPress} activeOpacity={0.8}>
                        <Text style={styles.contactBtnText}>Contact</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.location} numberOfLines={1}>{project.location || project.city || '—'}</Text>
                <Text style={styles.type}>{typeLabel}</Text>
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
    },
    image: {
        width: '100%',
        height: '100%',
    },
    strip: {
        backgroundColor: colors.darkGray,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: stripHeight,
    },
    stripTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.white,
        flex: 1,
        marginRight: 8,
    },
    contactBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    contactBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.white,
    },
    location: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 2,
    },
    type: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
    },
});

export default ProjectCardCompact;
