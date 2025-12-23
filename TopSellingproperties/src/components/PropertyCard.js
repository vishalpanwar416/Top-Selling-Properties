import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography, { fontFamilies } from '../theme/typography';
import LikeButton from './LikeButton';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.82;
const imageWidth = cardWidth;

const PropertyCard = ({ property, onPress, fullWidth = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const autoScrollTimer = useRef(null);

    const images = property?.images && property.images.length > 0 
        ? property.images 
        : ['https://via.placeholder.com/400x200'];

    useEffect(() => {
        // Auto-scroll images every 3 seconds
        if (images.length > 1) {
            autoScrollTimer.current = setInterval(() => {
                setCurrentImageIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % images.length;
                    scrollViewRef.current?.scrollTo({
                        x: nextIndex * imageWidth,
                        animated: true,
                    });
                    return nextIndex;
                });
            }, 3000);
        }

        return () => {
            if (autoScrollTimer.current) {
                clearInterval(autoScrollTimer.current);
            }
        };
    }, [images.length]);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / imageWidth);
        setCurrentImageIndex(index);
    };

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
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.imageScrollView}
                    contentContainerStyle={styles.imageScrollContent}
                >
                    {images.map((imageUri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            {/* Bottom Gradient Overlay */}
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.7)']}
                                style={styles.imageGradient}
                            />
                        </View>
                    ))}
                </ScrollView>

                {/* Pagination Indicators */}
                {images.length > 1 && (
                    <View style={styles.paginationContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === currentImageIndex && styles.paginationDotActive
                                ]}
                            />
                        ))}
                    </View>
                )}

                {/* Top Badges Row */}
                <View style={styles.topRow}>
                    {property.featured && (
                        <View style={styles.featuredBadge}>
                            <Ionicons name="star" size={8} color="#FFD700" style={{ marginRight: 2 }} />
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
                        size={16}
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
                                size={10}
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
                    <Ionicons name="location-sharp" size={12} color={colors.textSecondary} />
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
                            <Ionicons name="checkmark-circle" size={10} color="#10B981" />
                            <Text style={styles.cancellationText}>Free Cancellation</Text>
                        </View>
                    )}
                </View>

                {/* Property Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="bed-outline" size={14} color={colors.primary} />
                        </View>
                        <Text style={styles.detailValue}>{property.bedrooms || 'Studio'}</Text>
                        <Text style={styles.detailLabel}>Beds</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="shower" size={14} color={colors.primary} />
                        </View>
                        <Text style={styles.detailValue}>{property.bathrooms || '-'}</Text>
                        <Text style={styles.detailLabel}>Baths</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="vector-square" size={14} color={colors.primary} />
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
        borderRadius: 12,
        marginRight: 12,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    fullWidthContainer: {
        width: '100%',
        marginRight: 0,
        marginBottom: 8,
        marginVertical: 0,
    },
    imageContainer: {
        width: '100%',
        height: 160,
        position: 'relative',
    },
    imageScrollView: {
        width: '100%',
        height: '100%',
    },
    imageScrollContent: {
        flexDirection: 'row',
    },
    imageWrapper: {
        width: imageWidth,
        height: 160,
        position: 'relative',
    },
    image: {
        width: imageWidth,
        height: 160,
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 6,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    paginationDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.white,
    },
    topRow: {
        position: 'absolute',
        top: 6,
        left: 6,
        right: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
    },
    featuredText: {
        ...typography.badge,
        color: '#FFD700',
    },
    tagBadge: {
        backgroundColor: 'rgba(72, 187, 120, 0.95)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 12,
    },
    tagText: {
        ...typography.badge,
        color: colors.white,
    },
    favoriteButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeBadgeContainer: {
        position: 'absolute',
        top: 6,
        right: 38,
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
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
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 3,
    },
    rentTagText: {
        ...typography.badgeSmall,
        color: colors.white,
    },
    priceOnImage: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceText: {
        ...typography.price,
        color: colors.white,
        fontSize: 18,
    },
    content: {
        padding: 10,
    },
    title: {
        ...typography.propertyTitle,
        color: colors.textPrimary,
        marginBottom: 4,
        fontSize: 15,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingBadge: {
        backgroundColor: '#1E40AF',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        marginRight: 4,
    },
    ratingText: {
        ...typography.rating,
        color: colors.white,
    },
    starRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    reviewsText: {
        ...typography.ratingLabel,
        color: colors.textSecondary,
        fontSize: 11,
    },
    ratingBadgeOnImage: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#1E40AF',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
    },
    ratingTextOnImage: {
        ...typography.rating,
        color: colors.white,
        fontSize: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    location: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        flex: 1,
        marginLeft: 3,
        fontSize: 12,
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    priceMain: {
        ...typography.price,
        color: colors.textPrimary,
        fontSize: 16,
    },
    pricePerNight: {
        ...typography.pricePerNight,
        color: colors.textSecondary,
        marginTop: 1,
        fontSize: 11,
    },
    cancellationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        gap: 3,
    },
    cancellationText: {
        ...typography.caption,
        color: '#10B981',
        fontSize: 10,
    },
    detailsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FB',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailIconWrapper: {
        width: 22,
        height: 22,
        borderRadius: 6,
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    detailValue: {
        ...typography.bodySmall,
        color: colors.textPrimary,
        fontFamily: fontFamilies.bold,
        fontSize: 13,
    },
    detailLabel: {
        ...typography.caption,
        color: colors.textTertiary,
        marginTop: 0,
        fontSize: 10,
    },
    detailDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginVertical: 1,
    },
});

export default PropertyCard;
