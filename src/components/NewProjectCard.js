import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import LikeButton from './LikeButton';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.8;
const imageWidth = cardWidth;

const NewProjectCard = ({ project, onPress, fullWidth = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const autoScrollTimer = useRef(null);

    if (!project) {
        return null;
    }

    const images = project.images && project.images.length > 0
        ? project.images
        : ['https://via.placeholder.com/400x250'];

    useEffect(() => {
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
            }, 4000);
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

    const formatPrice = (price) => {
        if (!price) return 'Price on Request';
        if (price >= 1000000) {
            return `AED ${(price / 1000000).toFixed(1)}M`;
        }
        if (price >= 1000) {
            return `AED ${(price / 1000).toFixed(0)}K`;
        }
        return `AED ${price.toLocaleString()}`;
    };

    const getStatusColor = () => {
        if (project.completion === 'Ready' || project.status === 'Ready to Move') {
            return ['#10B981', '#059669'];
        }
        return [colors.maroon, colors.primary];
    };

    const getStatusText = () => {
        if (project.completion === 'Ready' || project.status === 'Ready to Move') {
            return 'READY';
        }
        return project.completion || 'OFF-PLAN';
    };

    return (
        <TouchableOpacity
            style={[styles.container, fullWidth && styles.fullWidthContainer]}
            onPress={onPress}
            activeOpacity={0.95}
        >
            {/* Image Container */}
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

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.5)']}
                    locations={[0, 0.4, 1]}
                    style={styles.imageGradient}
                    pointerEvents="none"
                />

                {/* Top Row */}
                <View style={styles.topRow}>
                    <LinearGradient
                        colors={getStatusColor()}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.statusBadge}
                    >
                        <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
                    </LinearGradient>
                    <View style={{ flex: 1 }} />
                    <LikeButton size={16} buttonStyle={styles.favoriteButton} />
                </View>

                {/* Bottom Row - Developer & Photos */}
                <View style={styles.bottomRow}>
                    {project.developer && (
                        <View style={styles.developerBadge}>
                            <Ionicons name="business" size={10} color={colors.white} />
                            <Text style={styles.developerText} numberOfLines={1}>
                                {project.developer}
                            </Text>
                        </View>
                    )}
                    <View style={{ flex: 1 }} />
                    <View style={styles.photoCount}>
                        <Ionicons name="images-outline" size={11} color={colors.white} />
                        <Text style={styles.photoCountText}>{images.length}</Text>
                    </View>
                </View>

                {/* Pagination Dots */}
                {images.length > 1 && (
                    <View style={styles.paginationContainer}>
                        {images.slice(0, 4).map((_, index) => (
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
            </View>

            {/* Content Section - Compact */}
            <View style={styles.content}>
                {/* Title & Location Row */}
                <View style={styles.titleLocationRow}>
                    <View style={styles.titleSection}>
                        <Text style={styles.projectName} numberOfLines={1}>
                            {project.name || project.title || 'New Project'}
                        </Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={12} color={colors.primary} />
                            <Text style={styles.location} numberOfLines={1}>
                                {project.location || 'Location not available'}
                            </Text>
                        </View>
                    </View>
                    {project.featured && (
                        <View style={styles.featuredBadge}>
                            <Ionicons name="star" size={10} color="#FFA500" />
                        </View>
                    )}
                </View>

                {/* Price & Handover Row */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Starting from</Text>
                        <Text style={styles.priceValue}>
                            {formatPrice(project.startingPrice || project.launchPrice || project.price)}
                        </Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Handover</Text>
                        <Text style={styles.infoValue}>{project.handover || 'TBA'}</Text>
                    </View>
                    {project.bedroomRange && (
                        <>
                            <View style={styles.infoDivider} />
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Bedrooms</Text>
                                <Text style={styles.infoValue}>{project.bedroomRange}</Text>
                            </View>
                        </>
                    )}
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
        marginRight: 14,
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
    },
    imageContainer: {
        width: '100%',
        height: 150,
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
        height: 150,
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    topRow: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusBadgeText: {
        color: colors.white,
        fontSize: 9,
        fontFamily: 'Lato_900Black',
        letterSpacing: 0.6,
    },
    favoriteButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomRow: {
        position: 'absolute',
        bottom: 28,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    developerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        maxWidth: '55%',
    },
    developerText: {
        color: colors.white,
        fontSize: 10,
        fontFamily: 'Lato_400Regular',
        marginLeft: 4,
    },
    photoCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 8,
    },
    photoCountText: {
        color: colors.white,
        fontSize: 10,
        fontFamily: 'Lato_400Regular',
        marginLeft: 3,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    paginationDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    paginationDotActive: {
        width: 16,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: colors.white,
    },
    content: {
        padding: 12,
    },
    titleLocationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    titleSection: {
        flex: 1,
    },
    projectName: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 3,
        flex: 1,
        fontFamily: 'Lato_400Regular',
    },
    featuredBadge: {
        backgroundColor: 'rgba(255, 165, 0, 0.12)',
        padding: 6,
        borderRadius: 8,
        marginLeft: 8,
    },
    infoRow: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FB',
        borderRadius: 10,
        padding: 10,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 9,
        color: colors.textTertiary,
        fontFamily: 'Lato_400Regular',
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 13,
        fontFamily: 'Lato_900Black',
        color: colors.primary,
    },
    infoValue: {
        fontSize: 12,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
    },
    infoDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },
});

export default NewProjectCard;
