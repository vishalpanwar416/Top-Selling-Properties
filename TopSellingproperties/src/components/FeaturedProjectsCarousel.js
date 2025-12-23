import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions,
    PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import LikeButton from './LikeButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
    primary: '#B91C1C',
    primaryDark: '#991B1B',
    primaryLight: 'rgba(185, 28, 28, 0.08)',
    secondary: '#1E293B',
    accent: '#F59E0B',
    success: '#10B981',
    background: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    gradient1: ['#B91C1C', '#DC2626', '#EF4444'],
    gradient2: ['#1E293B', '#334155', '#475569'],
    gradient3: ['#0F172A', '#1E293B'],
    glassBg: 'rgba(255, 255, 255, 0.85)',
    overlay: 'rgba(0, 0, 0, 0.6)',
};

const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 1000000) {
        return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
};

const FeaturedProjectsCarousel = ({ projects, onProjectPress, scrollY, autoRotateInterval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const panResponder = useRef(null);
    const autoRotateTimer = useRef(null);
    const isUserInteracting = useRef(false);

    const scale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.2, 1],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        if (projects.length === 0) return;

        // Auto-rotate when user is not interacting
        const startAutoRotate = () => {
            if (autoRotateTimer.current) {
                clearInterval(autoRotateTimer.current);
            }
            
            autoRotateTimer.current = setInterval(() => {
                if (!isUserInteracting.current) {
                    goToNext();
                }
            }, autoRotateInterval);
        };

        startAutoRotate();

        return () => {
            if (autoRotateTimer.current) {
                clearInterval(autoRotateTimer.current);
            }
        };
    }, [projects.length, autoRotateInterval]);

    const goToNext = () => {
        if (projects.length <= 1) return;
        const nextIndex = (currentIndex + 1) % projects.length;
        animateToIndex(nextIndex);
    };

    const goToPrevious = () => {
        if (projects.length <= 1) return;
        const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
        animateToIndex(prevIndex);
    };

    const animateToIndex = (index) => {
        const offset = (index - currentIndex) * SCREEN_WIDTH;
        setCurrentIndex(index);
        
        Animated.spring(translateX, {
            toValue: -index * SCREEN_WIDTH,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    };

    useEffect(() => {
        // Initialize position
        translateX.setValue(-currentIndex * SCREEN_WIDTH);
    }, []);

    // Pan responder for swipe gestures
    panResponder.current = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
        },
        onPanResponderGrant: () => {
            isUserInteracting.current = true;
            translateX.setOffset(translateX._value);
            translateX.setValue(0);
        },
        onPanResponderMove: (_, gestureState) => {
            // Only allow horizontal swiping
            if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
                translateX.setValue(gestureState.dx);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            translateX.flattenOffset();
            isUserInteracting.current = false;

            const swipeThreshold = SCREEN_WIDTH * 0.25;
            const velocityThreshold = 0.5;

            if (gestureState.dx > swipeThreshold || gestureState.vx > velocityThreshold) {
                // Swipe right - go to previous
                goToPrevious();
            } else if (gestureState.dx < -swipeThreshold || gestureState.vx < -velocityThreshold) {
                // Swipe left - go to next
                goToNext();
            } else {
                // Snap back to current
                animateToIndex(currentIndex);
            }
        },
    });

    if (projects.length === 0) return null;

    const currentProject = projects[currentIndex];

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.carouselContainer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
                {...panResponder.current.panHandlers}
            >
                {projects.map((project, index) => (
                    <ProjectSlide
                        key={project.id}
                        project={project}
                        onPress={onProjectPress}
                        scale={scale}
                        index={index}
                    />
                ))}
            </Animated.View>

            {/* Pagination Dots */}
            {projects.length > 1 && (
                <View style={styles.paginationContainer}>
                    {projects.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                isUserInteracting.current = true;
                                setTimeout(() => {
                                    isUserInteracting.current = false;
                                }, 2000);
                                animateToIndex(index);
                            }}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.paginationDot,
                                    index === currentIndex && styles.paginationDotActive,
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const ProjectSlide = React.memo(({ project, onPress, scale, index }) => {
    if (!project) return null;

    return (
        <View style={styles.slide}>
            <TouchableOpacity
                style={styles.heroContainer}
                onPress={() => onPress(project)}
                activeOpacity={0.95}
            >
                <Animated.Image
                    source={{
                        uri:
                            project.images?.[0] ||
                            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                    }}
                    style={[styles.heroImage, { transform: [{ scale }] }]}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
                    locations={[0, 0.5, 1]}
                    style={styles.heroGradient}
                />

                {/* Top Badges */}
                <View style={styles.heroBadgesTop}>
                    <View style={styles.featuredBadge}>
                        <LinearGradient
                            colors={COLORS.gradient1}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.featuredBadgeBg}
                        />
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.featuredBadgeText}>Featured Project</Text>
                    </View>
                    <LikeButton
                        size={22}
                        likedColor="#FF4757"
                        unlikedColor="#fff"
                        buttonStyle={styles.heroLikeBtn}
                    />
                </View>

                {/* Hero Content */}
                <View style={styles.heroContent}>
                    <View style={styles.developerRow}>
                        <View style={styles.developerBadge}>
                            <FontAwesome5 name="building" size={10} color="#fff" />
                            <Text style={styles.developerText}>{project.developer}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <View
                                style={[
                                    styles.statusDot,
                                    project.completion === 'Ready' && styles.statusDotReady,
                                ]}
                            />
                            <Text style={styles.statusText}>{project.completion}</Text>
                        </View>
                    </View>

                    <Text style={styles.heroTitle}>{project.name}</Text>

                    <View style={styles.heroLocationRow}>
                        <Ionicons name="location-sharp" size={16} color={COLORS.accent} />
                        <Text style={styles.heroLocation}>{project.location}</Text>
                    </View>

                    {/* Quick Stats Row */}
                    <View style={styles.heroStatsRow}>
                        <View style={styles.heroStatItem}>
                            <Text style={styles.heroStatValue}>
                                {formatPrice(project.startingPrice)}
                            </Text>
                            <Text style={styles.heroStatLabel}>Starting from</Text>
                        </View>
                        <View style={styles.heroStatDivider} />
                        <View style={styles.heroStatItem}>
                            <Text style={styles.heroStatValue}>
                                {project.properties?.length || 0}
                            </Text>
                            <Text style={styles.heroStatLabel}>Units</Text>
                        </View>
                        <View style={styles.heroStatDivider} />
                        <View style={styles.heroStatItem}>
                            <Text style={styles.heroStatValue}>{project.handover}</Text>
                            <Text style={styles.heroStatLabel}>Handover</Text>
                        </View>
                    </View>

                    {/* CTA Button */}
                    <TouchableOpacity
                        style={styles.heroCTA}
                        onPress={() => onPress(project)}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                            style={styles.heroCTABg}
                        />
                        <Text style={styles.heroCTAText}>Explore Project</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    carouselContainer: {
        flexDirection: 'row',
        width: SCREEN_WIDTH * 100, // Enough width for all slides
    },
    slide: {
        width: SCREEN_WIDTH,
    },
    heroContainer: {
        height: 320,
        marginHorizontal: 16,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroBadgesTop: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        overflow: 'hidden',
    },
    featuredBadgeBg: {
        ...StyleSheet.absoluteFillObject,
    },
    featuredBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Lato_700Bold',
    },
    heroLikeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    developerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    developerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    developerText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
    },
    statusDotReady: {
        backgroundColor: COLORS.success,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
    },
    heroTitle: {
        fontSize: 24,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
        marginBottom: 6,
    },
    heroLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    heroLocation: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
    },
    heroStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
    },
    heroStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    heroStatValue: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
    },
    heroStatLabel: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    heroStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    heroCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    heroCTABg: {
        ...StyleSheet.absoluteFillObject,
    },
    heroCTAText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Lato_700Bold',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
    },
    paginationDotActive: {
        width: 24,
        backgroundColor: COLORS.primary,
    },
});

export default FeaturedProjectsCarousel;

