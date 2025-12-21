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
                    <Ionicons name="location-sharp" size={13} color={colors.primary} />
                    <Text style={styles.location} numberOfLines={1}>{property.location || 'Location not available'}</Text>
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
        height: 150,
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
        height: 60,
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
        color: '#FFD700',
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.3,
    },
    tagBadge: {
        backgroundColor: 'rgba(72, 187, 120, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    tagText: {
        color: colors.white,
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.3,
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
        color: colors.white,
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.3,
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
        color: colors.white,
        fontSize: 9,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.2,
    },
    priceOnImage: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceText: {
        fontSize: 17,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.white,
        letterSpacing: -0.4,
    },
    priceType: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: 'rgba(255,255,255,0.85)',
        marginLeft: 2,
    },
    content: {
        padding: 10,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        lineHeight: 18,
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
        fontSize: 13,
        color: colors.textPrimary,
        fontFamily: 'Poppins_700Bold',
    },
    detailLabel: {
        fontSize: 10,
        color: colors.textTertiary,
        fontFamily: 'Poppins_500Medium',
        marginTop: 0,
    },
    detailDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginVertical: 2,
    },
});

export default PropertyCard;
