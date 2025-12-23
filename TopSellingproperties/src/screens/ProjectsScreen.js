import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LikeButton from '../components/LikeButton';
import projectsData from '../data/projects.json';

// Premium Color Palette
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

// Constants
const FILTER_TABS = [
    { id: 'all', label: 'All Projects', icon: 'apps' },
    { id: 'ready', label: 'Ready', icon: 'checkmark-circle' },
    { id: 'offplan', label: 'Off-Plan', icon: 'construct' },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'Latest', icon: 'time-outline' },
    { label: 'Price: Low to High', value: 'PriceLow', icon: 'trending-up-outline' },
    { label: 'Price: High to Low', value: 'PriceHigh', icon: 'trending-down-outline' },
    { label: 'Most Popular', value: 'Popular', icon: 'star-outline' },
];

// Utility Functions
const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 1000000) {
        return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
};

// Animated Header Component
const AnimatedHeader = memo(({ scrollY, insets, onMenuPress, onSearchPress }) => {
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const titleTranslate = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [30, 0],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[styles.animatedHeader, { paddingTop: insets.top }]}>
            <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]} />
            <View style={styles.headerContent}>
                <TouchableOpacity style={styles.headerIconBtn} onPress={onMenuPress}>
                    <Ionicons name="menu-outline" size={26} color={COLORS.text} />
                </TouchableOpacity>
                <Animated.Text
                    style={[styles.headerTitle, { transform: [{ translateY: titleTranslate }] }]}
                >
                    Projects
                </Animated.Text>
                <TouchableOpacity style={styles.headerIconBtn} onPress={onSearchPress}>
                    <Ionicons name="search-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
});

// Hero Section Component
const HeroSection = memo(({ project, onPress, scrollY }) => {
    const scale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.2, 1],
        extrapolate: 'clamp',
    });

    if (!project) return null;

    return (
        <TouchableOpacity
            style={styles.heroContainer}
            onPress={() => onPress(project)}
            activeOpacity={0.95}
        >
            <Animated.Image
                source={{ uri: project.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' }}
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
                        <View style={[styles.statusDot, project.completion === 'Ready' && styles.statusDotReady]} />
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
                        <Text style={styles.heroStatValue}>{formatPrice(project.startingPrice)}</Text>
                        <Text style={styles.heroStatLabel}>Starting from</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStatItem}>
                        <Text style={styles.heroStatValue}>{project.properties?.length || 0}</Text>
                        <Text style={styles.heroStatLabel}>Units</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStatItem}>
                        <Text style={styles.heroStatValue}>{project.handover}</Text>
                        <Text style={styles.heroStatLabel}>Handover</Text>
                    </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity style={styles.heroCTA} onPress={() => onPress(project)}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                        style={styles.heroCTABg}
                    />
                    <Text style={styles.heroCTAText}>Explore Project</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
});

// Filter Chip Component
const FilterChip = memo(({ filter, isActive, onPress }) => (
    <TouchableOpacity
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => onPress(filter.id)}
        activeOpacity={0.7}
    >
        {isActive && (
            <LinearGradient
                colors={COLORS.gradient1}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.filterChipGradient}
            />
        )}
        <Ionicons
            name={filter.icon}
            size={16}
            color={isActive ? '#fff' : COLORS.textSecondary}
        />
        <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
            {filter.label}
        </Text>
    </TouchableOpacity>
));

// Stats Card Component
const StatsCard = memo(({ projects }) => {
    const totalUnits = useMemo(() =>
        projects.reduce((sum, p) => sum + (p.properties?.length || 0), 0),
        [projects]
    );
    const readyProjects = projects.filter(p => p.completion === 'Ready').length;
    const offPlanProjects = projects.filter(p => p.completion === 'Off-Plan').length;

    return (
        <View style={styles.statsCard}>
            <LinearGradient
                colors={COLORS.gradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statsCardBg}
            />
            <View style={styles.statsCardContent}>
                <View style={styles.statBox}>
                    <View style={styles.statIconBox}>
                        <Ionicons name="business" size={20} color="#fff" />
                    </View>
                    <Text style={styles.statNumber}>{projects.length}</Text>
                    <Text style={styles.statLabel}>Projects</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <View style={[styles.statIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.3)' }]}>
                        <Ionicons name="home" size={20} color="#10B981" />
                    </View>
                    <Text style={styles.statNumber}>{totalUnits}</Text>
                    <Text style={styles.statLabel}>Properties</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <View style={[styles.statIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.3)' }]}>
                        <Ionicons name="checkmark-done" size={20} color="#F59E0B" />
                    </View>
                    <Text style={styles.statNumber}>{readyProjects}</Text>
                    <Text style={styles.statLabel}>Ready</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <View style={[styles.statIconBox, { backgroundColor: 'rgba(185, 28, 28, 0.3)' }]}>
                        <Ionicons name="construct" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.statNumber}>{offPlanProjects}</Text>
                    <Text style={styles.statLabel}>Off-Plan</Text>
                </View>
            </View>
        </View>
    );
});

// Premium Project Card Component
const ProjectCard = memo(({ project, onPress, index }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = project.images || [];
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleImageNav = useCallback((direction) => {
        if (direction === 'next') {
            setCurrentImage(prev => (prev < images.length - 1 ? prev + 1 : 0));
        } else {
            setCurrentImage(prev => (prev > 0 ? prev - 1 : images.length - 1));
        }
    }, [images.length]);

    return (
        <Animated.View style={[styles.projectCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
            <TouchableOpacity onPress={() => onPress(project)} activeOpacity={0.95}>
                {/* Image Section */}
                <View style={styles.cardImageContainer}>
                    <Image
                        source={{ uri: images[currentImage] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
                        locations={[0, 0.4, 1]}
                        style={styles.cardImageGradient}
                    />

                    {/* Badges */}
                    <View style={styles.cardBadgesTop}>
                        <View style={[styles.cardStatusBadge, project.completion === 'Ready' ? styles.readyBadge : styles.offPlanBadge]}>
                            <Ionicons
                                name={project.completion === 'Ready' ? 'checkmark-circle' : 'time'}
                                size={12}
                                color="#fff"
                            />
                            <Text style={styles.cardStatusText}>{project.completion}</Text>
                        </View>
                        {project.featured && (
                            <View style={styles.cardFeaturedBadge}>
                                <Ionicons name="star" size={10} color="#FFD700" />
                            </View>
                        )}
                    </View>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <TouchableOpacity
                                style={[styles.cardNavArrow, styles.cardNavLeft]}
                                onPress={() => handleImageNav('prev')}
                            >
                                <Ionicons name="chevron-back" size={16} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.cardNavArrow, styles.cardNavRight]}
                                onPress={() => handleImageNav('next')}
                            >
                                <Ionicons name="chevron-forward" size={16} color="#fff" />
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Image Dots */}
                    <View style={styles.cardDots}>
                        {images.slice(0, 5).map((_, idx) => (
                            <View key={idx} style={[styles.cardDot, currentImage === idx && styles.cardDotActive]} />
                        ))}
                    </View>

                    {/* Like Button */}
                    <LikeButton
                        size={18}
                        likedColor="#FF4757"
                        unlikedColor="#fff"
                        buttonStyle={styles.cardLikeBtn}
                    />

                    {/* Developer Tag */}
                    <View style={styles.cardDeveloperTag}>
                        <Text style={styles.cardDeveloperText}>by {project.developer}</Text>
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.cardContent}>
                    {/* Title & Location */}
                    <Text style={styles.cardTitle} numberOfLines={1}>{project.name}</Text>
                    <View style={styles.cardLocationRow}>
                        <Ionicons name="location" size={14} color={COLORS.primary} />
                        <Text style={styles.cardLocation} numberOfLines={1}>{project.location}</Text>
                    </View>

                    {/* Price Section */}
                    <View style={styles.cardPriceSection}>
                        <View>
                            <Text style={styles.cardPriceLabel}>Starting from</Text>
                            <Text style={styles.cardPrice}>{formatPrice(project.startingPrice)}</Text>
                        </View>
                        <View style={styles.cardPriceRange}>
                            <Text style={styles.cardPriceRangeText}>{project.priceRange}</Text>
                        </View>
                    </View>

                    {/* Quick Info Pills */}
                    <View style={styles.cardInfoPills}>
                        <View style={styles.cardInfoPill}>
                            <Ionicons name="home-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.cardInfoPillText}>{project.properties?.length || 0} Units</Text>
                        </View>
                        <View style={styles.cardInfoPill}>
                            <Ionicons name="bed-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.cardInfoPillText}>{project.bedroomRange}</Text>
                        </View>
                        <View style={styles.cardInfoPill}>
                            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.cardInfoPillText}>{project.handover}</Text>
                        </View>
                    </View>

                    {/* Property Types */}
                    <View style={styles.cardTypesRow}>
                        {project.propertyTypes?.slice(0, 3).map((type, idx) => (
                            <View key={idx} style={styles.cardTypePill}>
                                <Text style={styles.cardTypePillText}>{type}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                        <View style={styles.cardAvailability}>
                            <View style={styles.availabilityDot} />
                            <Text style={styles.availabilityText}>
                                {project.availableUnits} of {project.totalUnits} available
                            </Text>
                        </View>
                        <View style={styles.cardViewBtn}>
                            <Text style={styles.cardViewBtnText}>View</Text>
                            <Ionicons name="arrow-forward" size={14} color="#fff" />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

// Section Header Component
const SectionHeader = memo(({ title, count, onSortPress, sortBy }) => (
    <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
            <View>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.sectionCount}>{count} projects found</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={onSortPress}>
            <Ionicons name="swap-vertical" size={18} color={COLORS.primary} />
            <Text style={styles.sortBtnText}>{sortBy}</Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>
    </View>
));

// Sort Modal Component
const SortModal = memo(({ visible, onClose, sortBy, onSelect }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
            <View style={styles.sortModal}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Sort Projects</Text>
                {SORT_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[styles.sortOption, sortBy === option.value && styles.sortOptionActive]}
                        onPress={() => { onSelect(option.value); onClose(); }}
                    >
                        <View style={[styles.sortOptionIcon, sortBy === option.value && styles.sortOptionIconActive]}>
                            <Ionicons
                                name={option.icon}
                                size={20}
                                color={sortBy === option.value ? COLORS.primary : COLORS.textSecondary}
                            />
                        </View>
                        <Text style={[styles.sortOptionText, sortBy === option.value && styles.sortOptionTextActive]}>
                            {option.label}
                        </Text>
                        {sortBy === option.value && (
                            <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </TouchableOpacity>
    </Modal>
));

// Main Component
const ProjectsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeFilter, setActiveFilter] = useState('all');
    const [showSortModal, setShowSortModal] = useState(false);
    const [sortBy, setSortBy] = useState('Latest');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [projects] = useState(projectsData.projects);

    // Filtered and sorted projects
    const filteredProjects = useMemo(() => {
        let result = projects.filter(project => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'ready') return project.completion === 'Ready';
            if (activeFilter === 'offplan') return project.completion === 'Off-Plan';
            return true;
        });

        switch (sortBy) {
            case 'PriceLow':
                result = [...result].sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
                break;
            case 'PriceHigh':
                result = [...result].sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
                break;
            case 'Popular':
                result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
            default:
                break;
        }

        return result;
    }, [projects, activeFilter, sortBy]);

    const featuredProject = useMemo(() =>
        filteredProjects.find(p => p.featured) || filteredProjects[0],
        [filteredProjects]
    );

    const handleProjectPress = useCallback((project) => {
        navigation.navigate('ProjectDetail', { project });
    }, [navigation]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const handleMenuPress = useCallback(() => {
        navigation.openDrawer();
    }, [navigation]);

    const handleSearchPress = useCallback(() => {
        navigation.navigate('Search');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Animated Header */}
            <AnimatedHeader
                scrollY={scrollY}
                insets={insets}
                onMenuPress={handleMenuPress}
                onSearchPress={handleSearchPress}
            />

            <Animated.ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingTop: insets.top + 60 }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={COLORS.primary}
                        progressViewOffset={insets.top + 60}
                    />
                }
            >
                {/* Hero Featured Project */}
                <HeroSection
                    project={featuredProject}
                    onPress={handleProjectPress}
                    scrollY={scrollY}
                />

                {/* Stats Card */}
                <StatsCard projects={projects} />

                {/* Filter Chips */}
                <View style={styles.filterSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContent}
                    >
                        {FILTER_TABS.map((filter) => (
                            <FilterChip
                                key={filter.id}
                                filter={filter}
                                isActive={activeFilter === filter.id}
                                onPress={setActiveFilter}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Section Header */}
                <SectionHeader
                    title="Explore Projects"
                    count={filteredProjects.length}
                    onSortPress={() => setShowSortModal(true)}
                    sortBy={sortBy}
                />

                {/* Project Cards */}
                <View style={styles.projectsGrid}>
                    {filteredProjects
                        .filter(p => p !== featuredProject)
                        .map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onPress={handleProjectPress}
                                index={index}
                            />
                        ))}
                </View>

                {/* No Results */}
                {filteredProjects.length === 0 && (
                    <View style={styles.noResults}>
                        <View style={styles.noResultsIcon}>
                            <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
                        </View>
                        <Text style={styles.noResultsTitle}>No projects found</Text>
                        <Text style={styles.noResultsText}>Try adjusting your filters</Text>
                    </View>
                )}

                {/* Bottom Padding */}
                <View style={{ height: insets.bottom + 100 }} />
            </Animated.ScrollView>

            {/* Floating CTA */}
            <View style={[styles.floatingCTA, { bottom: insets.bottom + 70 }]}>
                <LinearGradient
                    colors={['#25D366', '#128C7E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.floatingCTABg}
                />
                <Ionicons name="logo-whatsapp" size={22} color="#fff" />
                <Text style={styles.floatingCTAText}>Get Expert Help</Text>
            </View>

            {/* Sort Modal */}
            <SortModal
                visible={showSortModal}
                onClose={() => setShowSortModal(false)}
                sortBy={sortBy}
                onSelect={setSortBy}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },

    // Animated Header
    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    headerBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
    },
    headerIconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: COLORS.text,
    },

    // Hero Section
    heroContainer: {
        height: 420,
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
        padding: 20,
    },
    developerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
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
        fontSize: 28,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
        marginBottom: 8,
    },
    heroLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
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
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
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

    // Stats Card
    statsCard: {
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    statsCardBg: {
        ...StyleSheet.absoluteFillObject,
    },
    statsCardContent: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '60%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignSelf: 'center',
    },

    // Filter Section
    filterSection: {
        marginBottom: 16,
    },
    filterContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: COLORS.cardBg,
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    filterChipActive: {
        borderColor: COLORS.primary,
    },
    filterChipGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    filterChipText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
    },
    filterChipTextActive: {
        fontFamily: 'Lato_700Bold',
        color: '#fff',
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitleRow: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: COLORS.text,
    },
    sectionCount: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sortBtnText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: COLORS.text,
    },

    // Projects Grid
    projectsGrid: {
        paddingHorizontal: 16,
    },

    // Project Card
    projectCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
    },
    cardImageContainer: {
        height: 200,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardImageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    cardBadgesTop: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        gap: 8,
    },
    cardStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    readyBadge: {
        backgroundColor: COLORS.success,
    },
    offPlanBadge: {
        backgroundColor: COLORS.primary,
    },
    cardStatusText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Lato_700Bold',
    },
    cardFeaturedBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardNavArrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardNavLeft: {
        left: 10,
    },
    cardNavRight: {
        right: 10,
    },
    cardDots: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
    },
    cardDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    cardDotActive: {
        backgroundColor: '#fff',
        width: 16,
    },
    cardLikeBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardDeveloperTag: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    cardDeveloperText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
        color: COLORS.text,
        marginBottom: 6,
    },
    cardLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    cardLocation: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
        flex: 1,
    },
    cardPriceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    cardPriceLabel: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
    },
    cardPrice: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: COLORS.primary,
    },
    cardPriceRange: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    cardPriceRangeText: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: COLORS.primary,
    },
    cardInfoPills: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    cardInfoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    cardInfoPillText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
    },
    cardTypesRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 14,
    },
    cardTypePill: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    cardTypePillText: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: '#fff',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardAvailability: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    availabilityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
    },
    availabilityText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
    },
    cardViewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    cardViewBtnText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Lato_700Bold',
    },

    // No Results
    noResults: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    noResultsIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    noResultsTitle: {
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
        color: COLORS.text,
    },
    noResultsText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
        marginTop: 4,
    },

    // Floating CTA
    floatingCTA: {
        position: 'absolute',
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 30,
        gap: 8,
        overflow: 'hidden',
        shadowColor: '#25D366',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    floatingCTABg: {
        ...StyleSheet.absoluteFillObject,
    },
    floatingCTAText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Lato_700Bold',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sortModal: {
        backgroundColor: COLORS.cardBg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: COLORS.text,
        marginBottom: 20,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    sortOptionActive: {
        backgroundColor: COLORS.primaryLight,
    },
    sortOptionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    sortOptionIconActive: {
        backgroundColor: 'rgba(185, 28, 28, 0.15)',
    },
    sortOptionText: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: COLORS.text,
    },
    sortOptionTextActive: {
        fontFamily: 'Lato_700Bold',
        color: COLORS.primary,
    },
});

export default ProjectsScreen;
