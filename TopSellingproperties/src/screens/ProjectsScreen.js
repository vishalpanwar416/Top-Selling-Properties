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
import SearchBar from '../components/SearchBar';
import LocationSelector from '../components/LocationSelector';
import FeaturedProjectsCarousel from '../components/FeaturedProjectsCarousel';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showSortModal, setShowSortModal] = useState(false);
    const [sortBy, setSortBy] = useState('Latest');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('UAE');
    const [projects] = useState(() => {
        const loadedProjects = projectsData?.projects || [];
        console.log('Projects loaded:', loadedProjects.length);
        return loadedProjects;
    });

    // Filtered and sorted projects
    const filteredProjects = useMemo(() => {
        let result = projects.filter(project => {
            // Search filter
            const matchesSearch =
                !searchQuery ||
                (project.name && project.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.location && project.location.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Status filter
            let matchesFilter = true;
            if (activeFilter === 'ready') matchesFilter = project.completion === 'Ready';
            if (activeFilter === 'offplan') matchesFilter = project.completion === 'Off-Plan';
            
            return matchesSearch && matchesFilter;
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
    }, [projects, activeFilter, sortBy, searchQuery]);

    // Get eligible projects for featured rotation (prioritize featured ones, then all)
    const eligibleProjects = useMemo(() => {
        const featured = filteredProjects.filter(p => p.featured);
        return featured.length > 0 ? featured : filteredProjects;
    }, [filteredProjects]);

    const handleProjectPress = useCallback((project) => {
        navigation.navigate('ProjectDetail', { project });
    }, [navigation]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const handleScroll = useCallback((event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > 120);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                onScroll={Animated.event(
                    [
                        { nativeEvent: { contentOffset: { y: scrollY } } }
                    ],
                    {
                        useNativeDriver: true,
                        listener: handleScroll
                    }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Hero Section with Back Button and Title */}
                <View style={styles.heroSection}>
                    {/* Header Row with Back Button, Title, and Location */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <View style={styles.backButtonContainer}>
                                <Ionicons name="chevron-back" size={24} color="#991B1B" />
                            </View>
                        </TouchableOpacity>

                        {/* Title with Icon - Centered */}
                        <View style={styles.titleRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="business" size={24} color="#991B1B" />
                            </View>
                            <Text style={styles.welcomeTitle}>Projects</Text>
                        </View>

                        {/* Location Selector - Right Side */}
                        <LocationSelector
                            selectedLocation={selectedLocation}
                            onLocationChange={setSelectedLocation}
                        />
                    </View>
                </View>

                {/* Search Bar Section - Sticky */}
                <View style={[styles.searchSection, isSticky && styles.searchSectionSticky]}>
                    <View style={styles.searchRow}>
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            editable={true}
                            isSticky={isSticky}
                            searchType="projects"
                            containerStyle={styles.searchBarContainer}
                        />
                    </View>
                </View>

                {/* Filter Bar */}
                <View style={styles.filterBarContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterBarContent}
                    >
                        {FILTER_TABS.map((filter) => (
                            <TouchableOpacity
                                key={filter.id}
                                style={[
                                    styles.quickFilterPill,
                                    activeFilter === filter.id && styles.activeQuickFilterPill
                                ]}
                                onPress={() => setActiveFilter(filter.id)}
                            >
                                <Ionicons
                                    name={filter.icon}
                                    size={16}
                                    color={activeFilter === filter.id ? '#fff' : COLORS.textSecondary}
                                />
                                <Text style={[
                                    styles.quickFilterText,
                                    activeFilter === filter.id && styles.activeQuickFilterText
                                ]}>
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        
                        {/* Sort Button */}
                        <TouchableOpacity
                            style={styles.sortPill}
                            onPress={() => setShowSortModal(true)}
                        >
                            <Ionicons name="swap-vertical" size={16} color={COLORS.primary} />
                            <Text style={styles.sortPillText}>{sortBy}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                {/* Hero Featured Project Carousel */}
                {eligibleProjects.length > 0 && (
                    <FeaturedProjectsCarousel
                        projects={eligibleProjects}
                        onProjectPress={handleProjectPress}
                        scrollY={scrollY}
                        autoRotateInterval={5000}
                    />
                )}

                {/* Project Cards */}
                <View style={styles.projectsGrid}>
                    {filteredProjects
                        .filter(p => !eligibleProjects.some(ep => ep.id === p.id))
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
    
    // Search Section
    searchSection: {
        backgroundColor: COLORS.background,
        paddingTop: 16,
        paddingBottom: 12,
        paddingHorizontal: 20,
    },
    searchSectionSticky: {
        backgroundColor: COLORS.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    searchBarContainer: {
        flex: 1,
    },
    
    // Filter Bar
    filterBarContainer: {
        backgroundColor: COLORS.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingVertical: 12,
    },
    filterBarContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    quickFilterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 6,
        marginRight: 8,
    },
    activeQuickFilterPill: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    quickFilterText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: COLORS.textSecondary,
    },
    activeQuickFilterText: {
        fontFamily: 'Lato_700Bold',
        color: '#fff',
    },
    sortPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 6,
    },
    sortPillText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: COLORS.primary,
    },

    // Hero Section Header
    heroSection: {
        backgroundColor: '#FFF5F5',
        paddingTop: 44,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(185, 28, 28, 0.08)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    backButton: {
        zIndex: 1,
    },
    backButtonContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(153, 27, 27, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: 0,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(153, 27, 27, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeTitle: {
        fontSize: 24,
        fontFamily: 'Lato_700Bold',
        color: '#991B1B',
        letterSpacing: -0.3,
    },

    // Pagination Dots
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

    // Hero Featured Project Section
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
