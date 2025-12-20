import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

const NewProjectCard = ({ project, onPress, fullWidth = false }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    if (!project) {
        return null;
    }

    const formatPrice = (price) => {
        if (!price) return 'AED N/A';
        if (price >= 1000000) {
            return `AED ${(price / 1000000).toFixed(1)}M`;
        }
        if (price >= 1000) {
            return `AED ${(price / 1000).toFixed(0)}K`;
        }
        return `AED ${price.toLocaleString()}`;
    };

    const handleWhatsApp = () => {
        const message = `Hi, I'm interested in ${project.title}`;
        const phoneNumber = '+971500000000';
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert('WhatsApp is not installed');
        });
    };

    return (
        <View style={[styles.container, fullWidth && styles.fullWidthContainer]}>
            {/* Image Container */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: project.images && project.images[0] ? project.images[0] : 'https://via.placeholder.com/400x250' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    
                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
                        locations={[0, 0.4, 1]}
                        style={styles.imageGradient}
                    />

                    {/* Top Row - Badge & Favorite */}
                    <View style={styles.topRow}>
                        {project.isNew && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>NEW LAUNCH</Text>
                            </View>
                        )}
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity 
                            style={styles.favoriteButton}
                            onPress={() => setIsFavorite(!isFavorite)}
                            activeOpacity={0.8}
                        >
                            <Ionicons 
                                name={isFavorite ? "heart" : "heart-outline"} 
                                size={18} 
                                color={isFavorite ? "#FF4757" : colors.white} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Row - Photos count */}
                    <View style={styles.bottomRow}>
                        <View style={styles.photoCount}>
                            <Ionicons name="images-outline" size={12} color={colors.white} />
                            <Text style={styles.photoCountText}>
                                {project.images?.length || 1} Photos
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Title & Type */}
                <View style={styles.titleRow}>
                    <View style={styles.titleContent}>
                        <Text style={styles.title} numberOfLines={1}>{project.title || 'Project Name'}</Text>
                        <View style={styles.typeTag}>
                            <Text style={styles.typeText}>{project.type || 'Apartments'}</Text>
                        </View>
                    </View>
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                    <View style={styles.locationIcon}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                    </View>
                    <Text style={styles.location} numberOfLines={1}>{project.location || 'Location not available'}</Text>
                </View>

                {/* Price & Handover Info */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Starting Price</Text>
                        <Text style={styles.infoValue}>{formatPrice(project.launchPrice || project.price)}</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Handover</Text>
                        <Text style={styles.infoValueSecondary}>{project.handover || 'Q1 2025'}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp} activeOpacity={0.8}>
                        <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                        <Text style={styles.whatsappText}>WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
                        <Ionicons name="call" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 20,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
    },
    fullWidthContainer: {
        width: '100%',
        marginRight: 0,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    topRow: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    newBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    newBadgeText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    favoriteButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomRow: {
        position: 'absolute',
        bottom: 10,
        right: 12,
    },
    photoCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    photoCountText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
    },
    content: {
        padding: 14,
    },
    titleRow: {
        marginBottom: 8,
    },
    titleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.textPrimary,
        flex: 1,
        letterSpacing: -0.3,
    },
    typeTag: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    typeText: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    location: {
        fontSize: 13,
        color: colors.textSecondary,
        flex: 1,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FB',
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        color: colors.textTertiary,
        marginBottom: 4,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.primary,
    },
    infoValueSecondary: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    infoDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    whatsappButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        paddingVertical: 12,
        borderRadius: 12,
        marginRight: 10,
    },
    whatsappText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#25D366',
        marginLeft: 6,
    },
    callButton: {
        width: 46,
        height: 46,
        borderRadius: 12,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NewProjectCard;
