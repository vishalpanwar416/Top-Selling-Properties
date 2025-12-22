import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.75; // Horizontal scrolling cards, similar to NewProjectCard
const imageWidth = cardWidth; // Image width matches card width

const SimplePropertyCard = ({ property, onPress, fullWidth = false }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const autoScrollTimer = useRef(null);

    const images = property?.images && property.images.length > 0 
        ? property.images 
        : ['https://via.placeholder.com/400x250'];

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
        if (price >= 10000000) {
            return `AED ${(price / 10000000).toFixed(2)} Cr`;
        }
        if (price >= 1000000) {
            return `AED ${(price / 1000000).toFixed(2)}M`;
        }
        if (price >= 100000) {
            return `AED ${(price / 100000).toFixed(1)}L`;
        }
        return `AED ${price.toLocaleString()}`;
    };

    const formatArea = (area) => {
        if (!area) return '';
        return `${area.toLocaleString()} sqft`;
    };

    const getPropertyType = () => {
        const bedrooms = property.bedrooms || 0;
        const type = property.type || 'Flat';
        if (bedrooms === 0) return `Studio ${type}`;
        if (bedrooms === 1) return `1 BHK ${type}`;
        return `${bedrooms} BHK ${type}`;
    };

    const getAvailability = () => {
        if (property.handover) return `Available from ${property.handover}`;
        if (property.availability) return `Available from ${property.availability}`;
        return 'Available Now';
    };

    return (
        <TouchableOpacity
            style={[styles.container, fullWidth && styles.fullWidthContainer]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Image Container with Scrollable Images */}
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
                        <Image
                            key={index}
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="cover"
                        />
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

                {/* Photo Count Badge - Bottom Left */}
                <View style={styles.photoCountBadge}>
                    <Ionicons name="images-outline" size={14} color={colors.white} />
                    <Text style={styles.photoCountText}>
                        {images.length}
                    </Text>
                </View>

                {/* Favorite Button - Top Right */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={18}
                        color={isFavorite ? "#FF4757" : colors.white}
                    />
                </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Property Type */}
                <Text style={styles.propertyType}>{getPropertyType()}</Text>

                {/* Price and Area */}
                <View style={styles.priceAreaRow}>
                    <Text style={styles.price}>{formatPrice(property.price)}</Text>
                    {property.area && (
                        <>
                            <Text style={styles.separator}> | </Text>
                            <Text style={styles.area}>{formatArea(property.area)}</Text>
                        </>
                    )}
                </View>

                {/* Location */}
                <Text style={styles.location} numberOfLines={1}>
                    {property.location || property.city || 'Location not available'}
                </Text>

                {/* Availability */}
                <Text style={styles.availability}>{getAvailability()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 12,
        marginRight: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
    imageScrollView: {
        width: '100%',
        height: '100%',
    },
    imageScrollContent: {
        flexDirection: 'row',
    },
    image: {
        width: imageWidth,
        height: 180,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white,
    },
    photoCountBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    photoCountText: {
        color: colors.white,
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 12,
    },
    propertyType: {
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    priceAreaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    price: {
        fontSize: 15,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
    },
    separator: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        marginHorizontal: 4,
    },
    area: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    location: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
        marginBottom: 4,
    },
    availability: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.textTertiary,
    },
});

export default SimplePropertyCard;

