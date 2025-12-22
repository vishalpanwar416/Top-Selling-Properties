import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography, { fontFamilies } from '../theme/typography';
import LikeButton from './LikeButton';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.82;

const PropertyCard = ({ property, onPress, fullWidth = false }) => {
    if (!property) {
        return null;
    }

    const formatPrice = (price) => {
        if (!price) return 'AED N/A';
        if (price >= 1000000) {
            return `AED ${(price / 1000000).toFixed(1)}M`;
        }
        return `AED ${price.toLocaleString()}`;
    };

    return (
        <TouchableOpacity
            style={[styles.container, fullWidth && styles.fullWidthContainer]}
            onPress={onPress}
            activeOpacity={0.95}
        >
            {/* Image Container with Gradient Overlay */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: property.images && property.images[0] ? property.images[0] : 'https://via.placeholder.com/400x200' }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Bottom Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageGradient}
                />

                {/* Top Badges Row */}
                <View style={styles.topRow}>
                    {property.featured && (
                        <View style={styles.featuredBadge}>
                            <Ionicons name="star" size={9} color="#FFD700" style={{ marginRight: 3 }} />
                            <Text style={styles.featuredText}>FEATURED</Text>
                        </View>
                    )}
                    {property.tags && property.tags[0] && !property.featured && (
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>{property.tags[0]}</Text>
                        </View>
                    )}
                    <View style={{ flex: 1 }} />
                    <LikeButton
                        size={18}
                        buttonStyle={styles.favoriteButton}
                    />
                </View>

                {/* Property Type & Transaction Badge */}
                <View style={styles.typeBadgeContainer}>
                    <View style={[styles.typeBadge, property.transactionType === 'Rent' && styles.rentBadge]}>
                        <Text style={styles.typeText}>{property.type?.toUpperCase() || 'PROPERTY'}</Text>
                    </View>
                    {property.transactionType === 'Rent' && (
                        <View style={styles.rentTagBadge}>
                            <Text style={styles.rentTagText}>FOR RENT</Text>
                        </View>
                    )}
                </View>

                {/* Rating Badge on Image - MakeMyTrip Style */}
                {property.rating && (
                    <View style={styles.ratingBadgeOnImage}>
                        <Text style={styles.ratingTextOnImage}>{property.rating}</Text>
                    </View>
                )}

                {/* Price on Image */}
                <View style={styles.priceOnImage}>
                    <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>{property.title || 'Property'}</Text>

                {/* Rating Row - MakeMyTrip Style */}
                <View style={styles.ratingRow}>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{property.rating || '4.0'}</Text>
                    </View>
                    <View style={styles.starRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= Math.floor(property.rating || 4) ? "star" : "star-outline"}
                                size={12}
                                color="#FFB800"
                            />
                        ))}
                    </View>
                    {property.reviewsCount && (
                        <Text style={styles.reviewsText}>({property.reviewsCount} Reviews)</Text>
                    )}
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={14} color={colors.textSecondary} />
                    <Text style={styles.location} numberOfLines={1}>{property.location || 'Location not available'}</Text>
                </View>

                {/* Price Section - MakeMyTrip Style */}
                <View style={styles.priceSection}>
                    <View>
                        <Text style={styles.priceMain}>{formatPrice(property.price)}</Text>
                        <Text style={styles.pricePerNight}>Per {property.priceType || 'Month'}</Text>
                    </View>
                    {property.freeCancellation && (
                        <View style={styles.cancellationBadge}>
                            <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                            <Text style={styles.cancellationText}>Free Cancellation</Text>
                        </View>
                    )}
                </View>

                {/* Property Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="bed-outline" size={16} color={colors.primary} />
                        </View>
                        <Text style={styles.detailValue}>{property.bedrooms || 'Studio'}</Text>
                        <Text style={styles.detailLabel}>Beds</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="shower" size={16} color={colors.primary} />
                        </View>
                        <Text style={styles.detailValue}>{property.bathrooms || '-'}</Text>
                        <Text style={styles.detailLabel}>Baths</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="vector-square" size={16} color={colors.primary} />
                        </View>
                        <Text style={styles.detailValue}>{property.area ? property.area.toLocaleString() : 'N/A'}</Text>
                        <Text style={styles.detailLabel}>{property.areaUnit || 'sqft'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginRight: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
    },
    fullWidthContainer: {
        width: '100%',
        marginRight: 0,
        marginBottom: 10,
        marginVertical: 0,
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
    },
    topRow: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        backdropFilter: 'blur(10px)',
    },
    featuredText: {
        ...typography.badge,
        color: '#FFD700',
    },
    tagBadge: {
        backgroundColor: 'rgba(72, 187, 120, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    tagText: {
        ...typography.badge,
        color: colors.white,
    },
    favoriteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeBadgeContainer: {
        position: 'absolute',
        top: 8,
        right: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    typeText: {
        ...typography.badge,
        color: colors.white,
    },
    rentBadge: {
        backgroundColor: '#2563EB',
    },
    rentTagBadge: {
        backgroundColor: '#059669',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        marginLeft: 4,
    },
    rentTagText: {
        ...typography.badgeSmall,
        color: colors.white,
    },
    priceOnImage: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceText: {
        ...typography.price,
        color: colors.white,
    },
    content: {
        padding: 12,
    },
    title: {
        ...typography.propertyTitle,
        color: colors.textPrimary,
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    ratingBadge: {
        backgroundColor: '#1E40AF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 6,
    },
    ratingText: {
        ...typography.rating,
        color: colors.white,
    },
    starRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 6,
    },
    reviewsText: {
        ...typography.ratingLabel,
        color: colors.textSecondary,
    },
    ratingBadgeOnImage: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#1E40AF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingTextOnImage: {
        ...typography.rating,
        color: colors.white,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    location: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        flex: 1,
        marginLeft: 4,
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    priceMain: {
        ...typography.price,
        color: colors.textPrimary,
    },
    pricePerNight: {
        ...typography.pricePerNight,
        color: colors.textSecondary,
        marginTop: 2,
    },
    cancellationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    cancellationText: {
        ...typography.caption,
        color: '#10B981',
    },
    detailsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FB',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 6,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailIconWrapper: {
        width: 26,
        height: 26,
        borderRadius: 7,
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 3,
    },
    detailValue: {
        ...typography.bodySmall,
        color: colors.textPrimary,
        fontFamily: fontFamilies.bold,
    },
    detailLabel: {
        ...typography.caption,
        color: colors.textTertiary,
        marginTop: 0,
    },
    detailDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginVertical: 2,
    },
});

export default PropertyCard;
