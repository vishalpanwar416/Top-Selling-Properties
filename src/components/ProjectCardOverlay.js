import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.78;
const imageHeight = 180;

const ProjectCardOverlay = ({ project, onPress }) => {
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
    const config = project.bedroomRange || '2, 3, 4 BHK Apartment';

    const handleContact = (e) => {
        e?.stopPropagation?.();
        onPress?.();
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
            <View style={styles.imageWrap}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.95)']}
                    locations={[0.2, 0.6, 1]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.textOverlay}>
                    <Text style={styles.priceOverlay}>{priceStr}</Text>
                    <Text style={styles.nameOverlay} numberOfLines={1}>{project.name || 'Project'}</Text>
                    {project.developer ? (
                        <Text style={styles.developerOverlay}>by {project.developer}</Text>
                    ) : null}
                    <Text style={styles.configOverlay} numberOfLines={1}>{config}</Text>
                    <Text style={styles.locationOverlay} numberOfLines={1}>{project.location || project.city || ''}</Text>
                </View>
                <TouchableOpacity style={styles.contactBtn} onPress={handleContact} activeOpacity={0.8}>
                    <Text style={styles.contactBtnText}>Contact</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        borderRadius: 16,
        marginRight: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
    },
    imageWrap: {
        height: imageHeight,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 44,
        left: 12,
        right: 12,
    },
    priceOverlay: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 2,
    },
    nameOverlay: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 2,
    },
    developerOverlay: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 2,
    },
    configOverlay: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
    },
    locationOverlay: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    contactBtn: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    contactBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.white,
    },
});

export default ProjectCardOverlay;
