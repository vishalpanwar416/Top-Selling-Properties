import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width - 40;

const PropertyCard = ({ property, onPress }) => {
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
            style={styles.container} 
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
                
                {/* Gradient Overlay */}
                <View style={styles.imageOverlay} />
                
                {/* Badges */}
                <View style={styles.badgesContainer}>
                {property.featured && (
                    <View style={styles.featuredBadge}>
                        <Ionicons name="star" size={12} color={colors.white} style={{ marginRight: 4 }} />
                        <Text style={styles.featuredText}>Featured</Text>
                    </View>
                )}
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{(property.type || 'Property').toUpperCase()}</Text>
                    </View>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Price and Title */}
                <View style={styles.headerSection}>
                    <Text style={styles.price}>{formatPrice(property.price)}</Text>
                    <Text style={styles.title} numberOfLines={2}>{property.title || 'Property'}</Text>
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={16} color={colors.textSecondary} style={styles.locationIcon} />
                    <Text style={styles.location} numberOfLines={1}>{property.location || 'Location not available'}</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Property Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="bed" size={20} color={colors.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>Bedrooms</Text>
                        <Text style={styles.detailValue}>{property.bedrooms || 'Studio'}</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="shower" size={20} color={colors.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>Bathrooms</Text>
                        <Text style={styles.detailValue}>{property.bathrooms}</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="ruler-square" size={20} color={colors.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>Area</Text>
                        <Text style={styles.detailValue}>{property.area ? property.area.toLocaleString() : 'N/A'} {property.areaUnit || 'sqft'}</Text>
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
        borderRadius: 24,
        marginHorizontal: 20,
        marginVertical: 12,
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 12,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 260,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgesContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    featuredText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    typeBadge: {
        backgroundColor: 'rgba(122, 30, 62, 0.95)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    typeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    content: {
        padding: 24,
    },
    headerSection: {
        marginBottom: 12,
    },
    price: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 19,
        fontWeight: '600',
        color: colors.textPrimary,
        lineHeight: 26,
        letterSpacing: -0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    location: {
        fontSize: 15,
        color: colors.textSecondary,
        flex: 1,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 16,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    detailIcon: {
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 11,
        color: colors.textTertiary,
        marginBottom: 4,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    detailDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },
});

export default PropertyCard;
