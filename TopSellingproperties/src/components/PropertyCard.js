import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.82;

const PropertyCard = ({ property, onPress, fullWidth = false }) => {
    const [isFavorite, setIsFavorite] = useState(false);

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
                            <Ionicons name="star" size={10} color="#FFD700" style={{ marginRight: 4 }} />
                            <Text style={styles.featuredText}>FEATURED</Text>
                        </View>
                    )}
                    {property.tags && property.tags[0] && !property.featured && (
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>{property.tags[0]}</Text>
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
                            size={20}
                            color={isFavorite ? "#FF4757" : colors.white}
                        />
                    </TouchableOpacity>
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

                {/* Price on Image */}
                <View style={styles.priceOnImage}>
                    <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
                    {property.priceType && (
                        <Text style={styles.priceType}>/{property.priceType}</Text>
                    )}
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>{property.title || 'Property'}</Text>

                {/* Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={14} color={colors.primary} />
                    <Text style={styles.location} numberOfLines={1}>{property.location || 'Location not available'}</Text>
                </View>

                {/* Property Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="bed-outline" size={18} color={colors.primary} />
                        </View>
                        <Text style={styles.detailValue}>{property.bedrooms || 'Studio'}</Text>
                        <Text style={styles.detailLabel}>Beds</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="shower" size={18} color={colors.primary} />
                        </View>
                        <Text style={styles.detailValue}>{property.bathrooms || '-'}</Text>
                        <Text style={styles.detailLabel}>Baths</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconWrapper}>
                            <MaterialCommunityIcons name="vector-square" size={18} color={colors.primary} />
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
        borderRadius: 20,
        marginRight: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    fullWidthContainer: {
        width: '100%',
        marginRight: 0,
        marginBottom: 16,
        marginVertical: 0,
    },
    imageContainer: {
        width: '100%',
        height: 200,
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
        height: 100,
    },
    topRow: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
    },
    featuredText: {
        color: '#FFD700',
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.5,
    },
    tagBadge: {
        backgroundColor: 'rgba(72, 187, 120, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    tagText: {
        color: colors.white,
        fontSize: 9,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.5,
    },
    favoriteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeBadgeContainer: {
        position: 'absolute',
        top: 12,
        right: 56,
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    typeText: {
        color: colors.white,
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.5,
    },
    rentBadge: {
        backgroundColor: '#2563EB',
    },
    rentTagBadge: {
        backgroundColor: '#059669',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 6,
    },
    rentTagText: {
        color: colors.white,
        fontSize: 8,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.3,
    },
    priceOnImage: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceText: {
        fontSize: 22,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.white,
        letterSpacing: -0.5,
    },
    priceType: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: 'rgba(255,255,255,0.8)',
        marginLeft: 2,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        lineHeight: 22,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    location: {
        fontSize: 13,
        color: colors.textSecondary,
        flex: 1,
        marginLeft: 4,
        fontFamily: 'Poppins_500Medium',
    },
    detailsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FB',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    detailValue: {
        fontSize: 14,
        color: colors.textPrimary,
        fontFamily: 'Poppins_700Bold',
    },
    detailLabel: {
        fontSize: 10,
        color: colors.textTertiary,
        fontFamily: 'Poppins_500Medium',
        marginTop: 2,
    },
    detailDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginVertical: 4,
    },
});

export default PropertyCard;
