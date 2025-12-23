import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import typography, { fontFamilies } from '../theme/typography';
import LikeButton from './LikeButton';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.88;
const imageWidth = cardWidth;

const ProjectCard = ({ project, onPress, fullWidth = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const autoScrollTimer = useRef(null);

    const images = project?.images && project.images.length > 0 
        ? project.images 
        : ['https://via.placeholder.com/400x250'];

    useEffect(() => {
        // Auto-scroll images every 4 seconds
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

    const handleCall = () => {
        const phoneNumber = '+971500000000';
        Linking.openURL(`tel:${phoneNumber}`).catch(() => {
            alert('Unable to make call');
        });
    };

    const isOffPlan = project.completion === 'Off-Plan' || project.status === 'Under Construction';
    const isReady = project.completion === 'Ready' || project.status === 'Ready to Move';

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

                {/* Top Row - Badges & Favorite */}
                <View style={styles.topRow}>
                    <View style={styles.badgesContainer}>
                        {project.featured && (
                            <View style={styles.featuredBadge}>
                                <Ionicons name="star" size={10} color="#FFD700" style={{ marginRight: 3 }} />
                                <Text style={styles.featuredText}>FEATURED</Text>
                            </View>
                        )}
                        {isOffPlan && (
                            <View style={styles.offPlanBadge}>
                                <MaterialCommunityIcons name="construct" size={10} color={colors.white} style={{ marginRight: 3 }} />
                                <Text style={styles.offPlanText}>OFF-PLAN</Text>
                            </View>
                        )}
                        {isReady && (
                            <View style={styles.readyBadge}>
                                <Ionicons name="checkmark-circle" size={10} color={colors.white} style={{ marginRight: 3 }} />
                                <Text style={styles.readyText}>READY</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ flex: 1 }} />
                    <LikeButton
                        size={18}
                        buttonStyle={styles.favoriteButton}
                    />
                </View>

                {/* Bottom Info on Image */}
                <View style={styles.imageBottomInfo}>
                    <View style={styles.priceOnImage}>
                        <Text style={styles.priceText}>{formatPrice(project.startingPrice || project.price)}</Text>
                        <Text style={styles.priceLabel}>Starting From</Text>
                    </View>
                    {images.length > 1 && (
                        <View style={styles.photoCount}>
                            <Ionicons name="images-outline" size={12} color={colors.white} />
                            <Text style={styles.photoCountText}>{images.length}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Title & Developer */}
                <View style={styles.titleSection}>
                    <Text style={styles.title} numberOfLines={2}>
                        {project.name || project.title || 'Project Name'}
                    </Text>
                    {project.developer && (
                        <View style={styles.developerRow}>
                            <Ionicons name="business-outline" size={12} color={colors.textSecondary} />
                            <Text style={styles.developer} numberOfLines={1}>
                                {project.developer}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                    <View style={styles.locationIcon}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                    </View>
                    <Text style={styles.location} numberOfLines={1}>
                        {project.location || project.city || 'Location not available'}
                    </Text>
                </View>

                {/* Project Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={styles.statIconWrapper}>
                            <MaterialCommunityIcons name="calendar-clock" size={14} color={colors.primary} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>Handover</Text>
                            <Text style={styles.statValue}>{project.handover || 'Q1 2025'}</Text>
                        </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconWrapper}>
                            <MaterialCommunityIcons name="cash-multiple" size={14} color={colors.primary} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>Payment Plan</Text>
                            <Text style={styles.statValue}>{project.paymentPlan || 'Flexible'}</Text>
                        </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconWrapper}>
                            <MaterialCommunityIcons name="home-variant" size={14} color={colors.primary} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>Available</Text>
                            <Text style={styles.statValue}>
                                {project.availableUnits || 0} / {project.totalUnits || 0}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Property Types */}
                {project.propertyTypes && project.propertyTypes.length > 0 && (
                    <View style={styles.typesContainer}>
                        {project.propertyTypes.slice(0, 3).map((type, index) => (
                            <View key={index} style={styles.typeChip}>
                                <Text style={styles.typeChipText}>{type}</Text>
                            </View>
                        ))}
                        {project.propertyTypes.length > 3 && (
                            <View style={styles.typeChip}>
                                <Text style={styles.typeChipText}>+{project.propertyTypes.length - 3}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity 
                        style={styles.callButton} 
                        onPress={handleCall}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="call" size={18} color={colors.primary} />
                    </TouchableOpacity>
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
        marginHorizontal: 0,
    },
    imageContainer: {
        width: '100%',
        height: 200,
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
        height: 200,
        position: 'relative',
    },
    image: {
        width: imageWidth,
        height: 200,
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: colors.white,
    },
    topRow: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    badgesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    featuredText: {
        fontSize: 9,
        fontFamily: fontFamilies.bold,
        color: '#FFD700',
        letterSpacing: 0.5,
    },
    offPlanBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    offPlanText: {
        fontSize: 9,
        fontFamily: fontFamilies.bold,
        color: colors.white,
        letterSpacing: 0.5,
    },
    readyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    readyText: {
        fontSize: 9,
        fontFamily: fontFamilies.bold,
        color: colors.white,
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
    imageBottomInfo: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 2,
    },
    priceOnImage: {
        flexDirection: 'column',
    },
    priceText: {
        fontSize: 20,
        fontFamily: fontFamilies.bold,
        color: colors.white,
        letterSpacing: -0.5,
    },
    priceLabel: {
        fontSize: 10,
        fontFamily: fontFamilies.regular,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    photoCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    photoCountText: {
        fontSize: 11,
        fontFamily: fontFamilies.regular,
        color: colors.white,
    },
    content: {
        padding: 14,
    },
    titleSection: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
        marginBottom: 4,
        letterSpacing: -0.3,
        lineHeight: 24,
    },
    developerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    developer: {
        fontSize: 12,
        fontFamily: fontFamilies.regular,
        color: colors.textSecondary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationIcon: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    location: {
        fontSize: 13,
        fontFamily: fontFamilies.regular,
        color: colors.textSecondary,
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FB',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statIconWrapper: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 10,
        fontFamily: fontFamilies.regular,
        color: colors.textTertiary,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 12,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 6,
    },
    typesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 12,
    },
    typeChip: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    typeChipText: {
        fontSize: 11,
        fontFamily: fontFamilies.regular,
        color: colors.primary,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    callButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProjectCard;

