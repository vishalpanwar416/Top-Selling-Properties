import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

const PropertyCard = ({ property, onPress }) => {
    const formatPrice = (price) => {
        if (price >= 1000000) {
            return `AED ${(price / 1000000).toFixed(1)}M`;
        }
        return `AED ${price.toLocaleString()}`;
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: property.images && property.images[0] ? property.images[0] : 'https://via.placeholder.com/400x200' }}
                    style={styles.image}
                    resizeMode="cover"
                    defaultSource={require('../../assets/icon.png')}
                />
                {property.featured && (
                    <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>Featured</Text>
                    </View>
                )}
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{property.type.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.price}>{formatPrice(property.price)}</Text>
                <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
                <View style={styles.locationRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.location} numberOfLines={1}>{property.location}</Text>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>🛏</Text>
                        <Text style={styles.detailText}>{property.bedrooms || 'Studio'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>🚿</Text>
                        <Text style={styles.detailText}>{property.bathrooms}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📐</Text>
                        <Text style={styles.detailText}>{property.area.toLocaleString()} {property.areaUnit}</Text>
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
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
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
    featuredBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: colors.red,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    featuredText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    typeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: colors.maroon,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    content: {
        padding: 16,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.maroon,
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    location: {
        fontSize: 14,
        color: colors.textSecondary,
        flex: 1,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    detailIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    detailText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});

export default PropertyCard;
