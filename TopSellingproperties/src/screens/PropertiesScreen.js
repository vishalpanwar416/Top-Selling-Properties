import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Animated, TouchableWithoutFeedback, Platform, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropertyCard from '../components/PropertyCard';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';
import categoriesData from '../data/categories.json';

const { width } = Dimensions.get('window');
const propertyCategories = categoriesData.propertyCategories;
const transactionTypes = categoriesData.transactionTypes;

const PropertiesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('Takaya Tower B');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeType, setActiveType] = useState('Buy');
    const [activePropertyType, setActivePropertyType] = useState('Residential');
    const [properties] = useState(propertiesData.properties);
    const [sortBy, setSortBy] = useState('Latest');
    const [showSortModal, setShowSortModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    // New Filter States
    const [selectedBeds, setSelectedBeds] = useState(null);
    const [selectedBaths, setSelectedBaths] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedAreaRange, setSelectedAreaRange] = useState(null);
    const [selectedSubType, setSelectedSubType] = useState(null);

    // Filter Modal States
    const [showBedsModal, setShowBedsModal] = useState(false);
    const [showBathsModal, setShowBathsModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);

    const sortModalAnim = useRef(new Animated.Value(0)).current;
    const sortModalTranslateY = useRef(new Animated.Value(300)).current;
    const filterModalAnim = useRef(new Animated.Value(0)).current;
    const filterModalTranslateY = useRef(new Animated.Value(400)).current;

    const sortOptions = [
        { id: 'Latest', label: 'Latest', icon: 'time-outline' },
        { id: 'Price: Low to High', label: 'Price: Low to High', icon: 'trending-up-outline' },
        { id: 'Price: High to Low', label: 'Price: High to Low', icon: 'trending-down-outline' },
    ];

    const bedsOptions = ['1', '2', '3', '4', '5', '6+'];
    const bathsOptions = ['1', '2', '3', '4', '5', '6+'];
    const priceRanges = [
        { id: '0-1M', label: 'Under 1M', min: 0, max: 1000000 },
        { id: '1M-2M', label: '1M - 2M', min: 1000000, max: 2000000 },
        { id: '2M-5M', label: '2M - 5M', min: 2000000, max: 5000000 },
        { id: '5M-10M', label: '5M - 10M', min: 5000000, max: 10000000 },
        { id: '10M+', label: 'Over 10M', min: 10000000, max: Infinity },
    ];
    const areaRanges = [
        { id: '0-500', label: 'Under 500 sqft', min: 0, max: 500 },
        { id: '500-1000', label: '500 - 1000 sqft', min: 500, max: 1000 },
        { id: '1000-2000', label: '1000 - 2000 sqft', min: 1000, max: 2000 },
        { id: '2000-5000', label: '2000 - 5000 sqft', min: 2000, max: 5000 },
        { id: '5000+', label: 'Over 5000 sqft', min: 5000, max: Infinity },
    ];
    const propertyTypes = [
        { id: 'Apartment', label: 'Apartment', icon: 'business-outline' },
        { id: 'Villa', label: 'Villa', icon: 'home-outline' },
        { id: 'Townhouse', label: 'Townhouse', icon: 'grid-outline' },
        { id: 'Penthouse', label: 'Penthouse', icon: 'layers-outline' },
        { id: 'Studio', label: 'Studio', icon: 'square-outline' },
    ];

    // Mock TruBroker Stories
    const truBrokerStories = [
        { id: '1', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', agentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', agentName: 'Sarah' },
        { id: '2', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', agentImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', agentName: 'John' },
        { id: '3', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', agentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', agentName: 'Mike' },
        { id: '4', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400', agentImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', agentName: 'David' },
    ];

    useEffect(() => {
        if (showSortModal) {
            Animated.parallel([
                Animated.timing(sortModalAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(sortModalTranslateY, {
                    toValue: 0,
                    tension: 65,
                    friction: 11,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(sortModalAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(sortModalTranslateY, {
                    toValue: 300,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showSortModal]);

    // Reset all filters
    const resetAllFilters = () => {
        setActiveCategory('All');
        setActiveType('Buy');
        setActivePropertyType('Residential');
        setSelectedBeds(null);
        setSelectedBaths(null);
        setSelectedPriceRange(null);
        setSelectedAreaRange(null);
        setSelectedSubType(null);
    };

    // Check if any filter is active
    const hasActiveFilters = selectedBeds || selectedBaths || selectedPriceRange || selectedAreaRange || selectedSubType;

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch = searchQuery === '' ||
            (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = activeCategory === 'All' ||
            (activeCategory === 'Ready' && property.completion === 'Ready') ||
            (activeCategory === 'Off-Plan' && (property.completion === 'Off-Plan' || property.tags?.includes('Off-Plan')));

        const matchesType = !property.purpose || property.purpose.toLowerCase().includes(activeType.toLowerCase());

        const matchesSubType = !selectedSubType || property.type === selectedSubType;

        const matchesBeds = !selectedBeds ||
            (selectedBeds === '6+' ? property.bedrooms >= 6 : property.bedrooms === parseInt(selectedBeds));

        const matchesBaths = !selectedBaths ||
            (selectedBaths === '6+' ? property.bathrooms >= 6 : property.bathrooms === parseInt(selectedBaths));

        const matchesPrice = !selectedPriceRange ||
            (property.price >= selectedPriceRange.min && property.price < selectedPriceRange.max);

        const matchesArea = !selectedAreaRange ||
            (property.area >= selectedAreaRange.min && property.area < selectedAreaRange.max);

        return matchesSearch && matchesCategory && matchesType && matchesSubType && matchesBeds && matchesBaths && matchesPrice && matchesArea;
    });

    // Sort properties
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        if (sortBy === 'Price: Low to High') {
            return (a.price || 0) - (b.price || 0);
        } else if (sortBy === 'Price: High to Low') {
            return (b.price || 0) - (a.price || 0);
        }
        return 0;
    });

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const formatPrice = (price) => {
        if (!price) return 'AED N/A';
        return `AED ${price.toLocaleString()}`;
    };

    const renderPropertyCard = ({ item }) => {
        const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'];
        const currentIndex = currentImageIndex[item.id] || 0;

        return (
            <TouchableOpacity
                style={styles.propertyCard}
                onPress={() => handlePropertyPress(item)}
                activeOpacity={0.95}
            >
                {/* Image Carousel */}
                <View style={styles.imageCarouselContainer}>
                    <Image
                        source={{ uri: images[currentIndex] }}
                        style={styles.propertyImage}
                        resizeMode="cover"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            {currentIndex > 0 && (
                                <TouchableOpacity
                                    style={[styles.carouselArrow, styles.carouselArrowLeft]}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex({ ...currentImageIndex, [item.id]: currentIndex - 1 });
                                    }}
                                >
                                    <Ionicons name="chevron-back" size={20} color={colors.white} />
                                </TouchableOpacity>
                            )}
                            {currentIndex < images.length - 1 && (
                                <TouchableOpacity
                                    style={[styles.carouselArrow, styles.carouselArrowRight]}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex({ ...currentImageIndex, [item.id]: currentIndex + 1 });
                                    }}
                                >
                                    <Ionicons name="chevron-forward" size={20} color={colors.white} />
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {/* Image Dots Indicator */}
                    {images.length > 1 && (
                        <View style={styles.imageDots}>
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentIndex === index && styles.dotActive
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Top Tags */}
                    <View style={styles.imageTopTags}>
                        <View style={styles.truCheckTag}>
                            <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                            <Text style={styles.truCheckText}>TruCheck™</Text>
                        </View>
                        {(item.completion === 'Off-Plan' || item.tags?.includes('Off-Plan')) && (
                            <View style={styles.offPlanTag}>
                                <Text style={styles.offPlanText}>Off-Plan</Text>
                            </View>
                        )}
                    </View>

                    {/* TruBroker Badge */}
                    {item.agent && (
                        <View style={styles.truBrokerBadge}>
                            <Image
                                source={{ uri: item.agent.image || 'https://via.placeholder.com/40' }}
                                style={styles.agentBadgeImage}
                            />
                            <Text style={styles.truBrokerText}>TruBroker™</Text>
                        </View>
                    )}

                    {/* Favorite Button */}
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            // Handle favorite
                        }}
                    >
                        <Ionicons name="heart-outline" size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Property Details */}
                <View style={styles.propertyDetails}>
                    <View style={styles.priceRow}>
                        <Text style={styles.propertyPrice}>{formatPrice(item.price)}</Text>
                        <View style={styles.viewedTag}>
                            <Ionicons name="checkmark-circle" size={14} color={colors.textSecondary} />
                            <Text style={styles.viewedText}>Viewed</Text>
                        </View>
                    </View>

                    {/* Specs */}
                    <View style={styles.specsRow}>
                        <View style={styles.specItem}>
                            <MaterialCommunityIcons name="bed-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.specText}>{item.bedrooms || '3'}</Text>
                        </View>
                        <View style={styles.specItem}>
                            <MaterialCommunityIcons name="shower" size={16} color={colors.textSecondary} />
                            <Text style={styles.specText}>{item.bathrooms || '3'}</Text>
                        </View>
                        <View style={styles.specItem}>
                            <MaterialCommunityIcons name="vector-square" size={16} color={colors.textSecondary} />
                            <Text style={styles.specText}>{item.area?.toLocaleString() || '1,641'} sqft</Text>
                        </View>
                    </View>

                    {/* Property Type */}
                    <Text style={styles.propertyType}>
                        {item.bedrooms || '3'}BR with Stud, {item.type || 'Apartment'}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="map-outline" size={16} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                setShowSortModal(true);
                            }}
                        >
                            <Ionicons name="swap-vertical-outline" size={16} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Sort</Text>
                        </TouchableOpacity>
                        <View style={styles.investmentTag}>
                            <Text style={styles.investmentText}>Investment</Text>
                        </View>
                    </View>

                    {/* Address */}
                    <Text style={styles.address}>{item.location || item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Search Bar with Location and Save */}
            <View style={[styles.searchBarContainer, { paddingTop: insets.top + 12 }]}>
                <View style={styles.searchBar}>
                    <Ionicons name="location" size={20} color={colors.primary} style={styles.locationIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search location..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={colors.textTertiary}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton}>
                    <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={styles.filterIconButton}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.typeButton, activeType === 'Buy' && styles.typeButtonActive]}
                    onPress={() => setActiveType('Buy')}
                >
                    <Text style={[styles.typeButtonText, activeType === 'Buy' && styles.typeButtonTextActive]}>
                        Buy
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={activeType === 'Buy' ? colors.white : colors.textSecondary} />
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryPillsContainer}
                >
                    {['All', 'Ready', 'Off-Plan'].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.categoryPillText, activeCategory === cat && styles.categoryPillTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={[styles.residentialButton, activePropertyType === 'Residential' && styles.residentialButtonActive]}
                    onPress={() => setShowPropertyTypeModal(true)}
                >
                    <Text style={[styles.residentialText, activePropertyType === 'Residential' && styles.residentialTextActive]}>
                        {activePropertyType}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={activePropertyType === 'Residential' ? colors.white : colors.textSecondary} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
            </View>

            {/* Secondary Filter Bar */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.secondaryFilterBar}
                contentContainerStyle={styles.secondaryFilterContent}
            >
                {/* Beds Filter */}
                <TouchableOpacity
                    style={[styles.filterDropdown, selectedBeds && styles.filterDropdownActive]}
                    onPress={() => setShowBedsModal(true)}
                >
                    <Text style={[styles.filterDropdownText, selectedBeds && styles.filterDropdownTextActive]}>
                        {selectedBeds ? `${selectedBeds} Beds` : 'Beds'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={selectedBeds ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>

                {/* Price Filter */}
                <TouchableOpacity
                    style={[styles.filterDropdown, selectedPriceRange && styles.filterDropdownActive]}
                    onPress={() => setShowPriceModal(true)}
                >
                    <Text style={[styles.filterDropdownText, selectedPriceRange && styles.filterDropdownTextActive]}>
                        {selectedPriceRange ? selectedPriceRange.label : 'Price'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={selectedPriceRange ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>

                {/* Area Filter */}
                <TouchableOpacity
                    style={[styles.filterDropdown, selectedAreaRange && styles.filterDropdownActive]}
                    onPress={() => setShowAreaModal(true)}
                >
                    <Text style={[styles.filterDropdownText, selectedAreaRange && styles.filterDropdownTextActive]}>
                        {selectedAreaRange ? selectedAreaRange.label : 'Area'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={selectedAreaRange ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>

                {/* Baths Filter */}
                <TouchableOpacity
                    style={[styles.filterDropdown, selectedBaths && styles.filterDropdownActive]}
                    onPress={() => setShowBathsModal(true)}
                >
                    <Text style={[styles.filterDropdownText, selectedBaths && styles.filterDropdownTextActive]}>
                        {selectedBaths ? `${selectedBaths} Baths` : 'Baths'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={selectedBaths ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>

                {/* All Filters */}
                <TouchableOpacity
                    style={styles.allFiltersButton}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons name="options-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.allFiltersText}>All Filters</Text>
                </TouchableOpacity>

                {/* Reset All Filters */}
                {hasActiveFilters && (
                    <TouchableOpacity onPress={resetAllFilters}>
                        <Text style={styles.resetFiltersText}>Reset All Filters</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* TruBroker Stories Section */}
                <View style={styles.storiesSection}>
                    <View style={styles.storiesHeader}>
                        <Ionicons name="play-circle" size={18} color={colors.primary} />
                        <Text style={styles.storiesTitle}>
                            TruBroker™ Stories in Motor City and nearby locations
                        </Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.storiesContainer}
                    >
                        {truBrokerStories.map((story) => (
                            <TouchableOpacity key={story.id} style={styles.storyCard}>
                                <Image
                                    source={{ uri: story.image }}
                                    style={styles.storyImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.storyAgentBadge}>
                                    <Image
                                        source={{ uri: story.agentImage }}
                                        style={styles.storyAgentImage}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Properties List */}
                <View style={styles.propertiesList}>
                    <FlatList
                        data={sortedProperties}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPropertyCard}
                        scrollEnabled={false}
                        contentContainerStyle={styles.propertiesListContent}
                    />
                </View>
            </ScrollView>

            {/* Floating Bottom Bar - Map & Sort */}
            <View style={styles.floatingBottomBar}>
                <TouchableOpacity style={styles.floatingButton}>
                    <Ionicons name="map-outline" size={18} color={colors.primary} />
                    <Text style={styles.floatingButtonText}>Map</Text>
                </TouchableOpacity>
                <View style={styles.floatingDivider} />
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => setShowSortModal(true)}
                >
                    <Ionicons name="swap-vertical-outline" size={18} color={colors.primary} />
                    <Text style={styles.floatingButtonText}>Sort</Text>
                </TouchableOpacity>
            </View>

            {/* Sort Modal */}
            {showSortModal && (
                <TouchableWithoutFeedback onPress={() => setShowSortModal(false)}>
                    <Animated.View
                        style={[
                            styles.sortModalOverlay,
                            { opacity: sortModalAnim }
                        ]}
                    >
                        <TouchableWithoutFeedback>
                            <Animated.View
                                style={[
                                    styles.sortModalContainer,
                                    { transform: [{ translateY: sortModalTranslateY }] }
                                ]}
                            >
                                <View style={styles.sortModalHandle} />
                                <Text style={styles.sortModalTitle}>Sort By</Text>

                                {sortOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.sortOption,
                                            sortBy === option.id && styles.sortOptionActive
                                        ]}
                                        onPress={() => {
                                            setSortBy(option.id);
                                            setShowSortModal(false);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.sortOptionIcon,
                                            sortBy === option.id && styles.sortOptionIconActive
                                        ]}>
                                            <Ionicons
                                                name={option.icon}
                                                size={20}
                                                color={sortBy === option.id ? colors.white : colors.primary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.sortOptionText,
                                            sortBy === option.id && styles.sortOptionTextActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {sortBy === option.id && (
                                            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}

            {/* Beds Filter Modal */}
            {showBedsModal && (
                <TouchableWithoutFeedback onPress={() => setShowBedsModal(false)}>
                    <View style={styles.filterModalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.filterModalContainer}>
                                <View style={styles.filterModalHandle} />
                                <View style={styles.filterModalHeader}>
                                    <MaterialCommunityIcons name="bed-outline" size={24} color={colors.textPrimary} />
                                    <Text style={styles.filterModalTitle}>Beds</Text>
                                </View>
                                <View style={styles.filterOptionsRow}>
                                    {bedsOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[styles.filterOptionPill, selectedBeds === option && styles.filterOptionPillActive]}
                                            onPress={() => setSelectedBeds(selectedBeds === option ? null : option)}
                                        >
                                            <Text style={[styles.filterOptionText, selectedBeds === option && styles.filterOptionTextActive]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() => setShowBedsModal(false)}
                                >
                                    <Text style={styles.applyButtonText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Baths Filter Modal */}
            {showBathsModal && (
                <TouchableWithoutFeedback onPress={() => setShowBathsModal(false)}>
                    <View style={styles.filterModalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.filterModalContainer}>
                                <View style={styles.filterModalHandle} />
                                <View style={styles.filterModalHeader}>
                                    <MaterialCommunityIcons name="shower" size={24} color={colors.textPrimary} />
                                    <Text style={styles.filterModalTitle}>Baths</Text>
                                </View>
                                <View style={styles.filterOptionsRow}>
                                    {bathsOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[styles.filterOptionPill, selectedBaths === option && styles.filterOptionPillActive]}
                                            onPress={() => setSelectedBaths(selectedBaths === option ? null : option)}
                                        >
                                            <Text style={[styles.filterOptionText, selectedBaths === option && styles.filterOptionTextActive]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() => setShowBathsModal(false)}
                                >
                                    <Text style={styles.applyButtonText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Price Filter Modal */}
            {showPriceModal && (
                <TouchableWithoutFeedback onPress={() => setShowPriceModal(false)}>
                    <View style={styles.filterModalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.filterModalContainer}>
                                <View style={styles.filterModalHandle} />
                                <View style={styles.filterModalHeader}>
                                    <Ionicons name="pricetag-outline" size={24} color={colors.textPrimary} />
                                    <Text style={styles.filterModalTitle}>Price Range</Text>
                                </View>
                                <View style={styles.filterOptionsList}>
                                    {priceRanges.map((range) => (
                                        <TouchableOpacity
                                            key={range.id}
                                            style={[styles.filterListOption, selectedPriceRange?.id === range.id && styles.filterListOptionActive]}
                                            onPress={() => setSelectedPriceRange(selectedPriceRange?.id === range.id ? null : range)}
                                        >
                                            <Text style={[styles.filterListOptionText, selectedPriceRange?.id === range.id && styles.filterListOptionTextActive]}>
                                                {range.label}
                                            </Text>
                                            {selectedPriceRange?.id === range.id && (
                                                <Ionicons name="checkmark" size={20} color={colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() => setShowPriceModal(false)}
                                >
                                    <Text style={styles.applyButtonText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Area Filter Modal */}
            {showAreaModal && (
                <TouchableWithoutFeedback onPress={() => setShowAreaModal(false)}>
                    <View style={styles.filterModalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.filterModalContainer}>
                                <View style={styles.filterModalHandle} />
                                <View style={styles.filterModalHeader}>
                                    <MaterialCommunityIcons name="vector-square" size={24} color={colors.textPrimary} />
                                    <Text style={styles.filterModalTitle}>Area</Text>
                                </View>
                                <View style={styles.filterOptionsList}>
                                    {areaRanges.map((range) => (
                                        <TouchableOpacity
                                            key={range.id}
                                            style={[styles.filterListOption, selectedAreaRange?.id === range.id && styles.filterListOptionActive]}
                                            onPress={() => setSelectedAreaRange(selectedAreaRange?.id === range.id ? null : range)}
                                        >
                                            <Text style={[styles.filterListOptionText, selectedAreaRange?.id === range.id && styles.filterListOptionTextActive]}>
                                                {range.label}
                                            </Text>
                                            {selectedAreaRange?.id === range.id && (
                                                <Ionicons name="checkmark" size={20} color={colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() => setShowAreaModal(false)}
                                >
                                    <Text style={styles.applyButtonText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Property Type Modal */}
            {showPropertyTypeModal && (
                <TouchableWithoutFeedback onPress={() => setShowPropertyTypeModal(false)}>
                    <View style={styles.filterModalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.filterModalContainer}>
                                <View style={styles.filterModalHandle} />
                                <View style={styles.filterModalHeader}>
                                    <Ionicons name="home-outline" size={24} color={colors.textPrimary} />
                                    <Text style={styles.filterModalTitle}>Property Types</Text>
                                </View>

                                {/* Residential / Commercial Toggle */}
                                <View style={styles.propertyTypeToggle}>
                                    <TouchableOpacity
                                        style={[styles.propertyTypeToggleBtn, activePropertyType === 'Residential' && styles.propertyTypeToggleBtnActive]}
                                        onPress={() => setActivePropertyType('Residential')}
                                    >
                                        <Text style={[styles.propertyTypeToggleText, activePropertyType === 'Residential' && styles.propertyTypeToggleTextActive]}>
                                            Residential
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.propertyTypeToggleBtn, activePropertyType === 'Commercial' && styles.propertyTypeToggleBtnActive]}
                                        onPress={() => setActivePropertyType('Commercial')}
                                    >
                                        <Text style={[styles.propertyTypeToggleText, activePropertyType === 'Commercial' && styles.propertyTypeToggleTextActive]}>
                                            Commercial
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Property Sub-Types */}
                                <View style={styles.propertySubTypes}>
                                    {propertyTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[styles.propertySubTypeCard, selectedSubType === type.id && styles.propertySubTypeCardActive]}
                                            onPress={() => setSelectedSubType(selectedSubType === type.id ? null : type.id)}
                                        >
                                            <Ionicons name={type.icon} size={28} color={selectedSubType === type.id ? colors.primary : colors.textSecondary} />
                                            <Text style={[styles.propertySubTypeText, selectedSubType === type.id && styles.propertySubTypeTextActive]}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() => setShowPropertyTypeModal(false)}
                                >
                                    <Text style={styles.applyButtonText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: colors.white,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    locationIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: colors.textPrimary,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    saveButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
        marginLeft: 6,
    },
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterIconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 12,
    },
    typeButtonActive: {
        backgroundColor: colors.primary,
    },
    typeButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
        marginRight: 4,
    },
    typeButtonTextActive: {
        color: colors.white,
    },
    categoryPillsContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    categoryPill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: colors.lightGray,
    },
    categoryPillActive: {
        backgroundColor: colors.primary,
    },
    categoryPillText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    categoryPillTextActive: {
        color: colors.white,
    },
    residentialButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
    },
    residentialButtonActive: {
        backgroundColor: colors.primary,
    },
    residentialText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    residentialTextActive: {
        color: colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    storiesSection: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: colors.white,
    },
    storiesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    storiesTitle: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
        marginLeft: 8,
        flex: 1,
    },
    storiesContainer: {
        paddingRight: 16,
    },
    storyCard: {
        width: 100,
        height: 130,
        borderRadius: 12,
        marginRight: 12,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    storyImage: {
        width: '100%',
        height: '100%',
    },
    storyAgentBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        alignItems: 'center',
    },
    storyAgentImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 3,
        borderColor: colors.primary,
    },
    propertiesList: {
        backgroundColor: colors.white,
    },
    propertiesListContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    propertyCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    imageCarouselContainer: {
        width: '100%',
        height: 240,
        position: 'relative',
    },
    propertyImage: {
        width: '100%',
        height: '100%',
    },
    carouselArrow: {
        position: 'absolute',
        top: '50%',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: -18 }],
    },
    carouselArrowLeft: {
        left: 12,
    },
    carouselArrowRight: {
        right: 12,
    },
    imageDots: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 3,
    },
    dotActive: {
        backgroundColor: colors.white,
        width: 20,
    },
    imageTopTags: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        gap: 8,
    },
    truCheckTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    truCheckText: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: colors.primary,
        marginLeft: 4,
    },
    offPlanTag: {
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    offPlanText: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
    },
    truBrokerBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
    },
    agentBadgeImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 6,
    },
    truBrokerText: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: colors.white,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    propertyDetails: {
        padding: 16,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    propertyPrice: {
        fontSize: 22,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    viewedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    viewedText: {
        fontSize: 11,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    specsRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    specText: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    propertyType: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    actionButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
        marginLeft: 4,
    },
    investmentTag: {
        backgroundColor: 'rgba(72, 187, 120, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    investmentText: {
        fontSize: 11,
        fontFamily: 'Poppins_600SemiBold',
        color: '#48BB78',
    },
    address: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        lineHeight: 18,
    },
    // Sort Modal Styles
    sortModalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    sortModalContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    sortModalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    sortModalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginBottom: 20,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 14,
        marginBottom: 8,
        backgroundColor: colors.lightGray,
    },
    sortOptionActive: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
    },
    sortOptionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    sortOptionIconActive: {
        backgroundColor: colors.primary,
    },
    sortOptionText: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },
    sortOptionTextActive: {
        color: colors.primary,
    },
    floatingBottomBar: {
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: [{ translateX: -80 }],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 30,
        paddingHorizontal: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    floatingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    floatingButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.primary,
        marginLeft: 6,
    },
    floatingDivider: {
        width: 1,
        height: 20,
        backgroundColor: colors.border,
    },
});

export default PropertiesScreen;
