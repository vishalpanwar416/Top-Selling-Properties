import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Animated,
    Keyboard,
    ScrollView,
    Modal,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const { width } = Dimensions.get('window');

// Filter options
const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
const locations = ['Any', 'Downtown', 'Marina', 'JBR', 'Business Bay', 'Palm Jumeirah', 'Dubai Hills', 'Arabian Ranches'];
const propertyTypes = ['All in Residential', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'All in Commercial', 'Office', 'Retail', 'Warehouse', 'Shop'];
const priceRanges = ['Any', '< 500K', '500K - 1M', '1M - 2M', '2M - 5M', '5M+'];
const bedsOptions = ['Any', 'Studio', '1', '2', '3', '4', '5', '6', '7+'];

// Quick suggestions
const quickSuggestions = [
    { id: '1', text: 'Apartments in Dubai', icon: 'business-outline' },
    { id: '2', text: 'Villas for Sale', icon: 'home-outline' },
    { id: '3', text: 'Properties under 1M', icon: 'cash-outline' },
    { id: '4', text: 'Downtown Dubai', icon: 'location-outline' },
];

const SearchScreen = (props) => {
    const navigation = (props && typeof props === 'object' && props.navigation) ? props.navigation : {};
    const route = (props && typeof props === 'object' && props.route) ? props.route : {};

    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProperties, setFilteredProperties] = useState(
        Array.isArray(propertiesData?.properties) ? propertiesData.properties : []
    );
    const [recentSearches] = useState(['Dubai Marina', '2 Bedroom Apartment', 'Villa in Palm Jumeirah']);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const modalAnimation = useRef(new Animated.Value(0)).current;

    // Filter states
    const [selectedCity, setSelectedCity] = useState('Dubai');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('All in Residential');
    const [selectedPriceRange, setSelectedPriceRange] = useState('Any');
    const [selectedBeds, setSelectedBeds] = useState('Any');

    // Modal states
    const [showCityModal, setShowCityModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showBedsModal, setShowBedsModal] = useState(false);

    const hasActiveFilters = selectedCity !== 'Dubai' || selectedLocation || 
        selectedPropertyType !== 'All in Residential' || selectedPriceRange !== 'Any' || selectedBeds !== 'Any';

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        const allProperties = Array.isArray(propertiesData?.properties) ? propertiesData.properties : [];
        let filtered = allProperties;

        // Search filter
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(property =>
                (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (property.type && property.type.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // City filter
        if (selectedCity && selectedCity !== 'Any') {
            filtered = filtered.filter(property =>
                (property.city && property.city.toLowerCase() === selectedCity.toLowerCase()) ||
                (property.location && property.location.toLowerCase().includes(selectedCity.toLowerCase()))
            );
        }

        // Location filter
        if (selectedLocation && selectedLocation !== 'Any') {
            filtered = filtered.filter(property =>
                property.location && property.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        // Property type filter
        if (selectedPropertyType && selectedPropertyType !== 'All in Residential' && selectedPropertyType !== 'All in Commercial') {
            filtered = filtered.filter(property =>
                property.type && property.type.toLowerCase().includes(selectedPropertyType.toLowerCase())
            );
        }

        // Price range filter
        if (selectedPriceRange && selectedPriceRange !== 'Any') {
            filtered = filtered.filter(property => {
                const price = property.price || 0;
                switch (selectedPriceRange) {
                    case '< 500K':
                        return price < 500000;
                    case '500K - 1M':
                        return price >= 500000 && price < 1000000;
                    case '1M - 2M':
                        return price >= 1000000 && price < 2000000;
                    case '2M - 5M':
                        return price >= 2000000 && price < 5000000;
                    case '5M+':
                        return price >= 5000000;
                    default:
                        return true;
                }
            });
        }

        // Beds filter
        if (selectedBeds && selectedBeds !== 'Any') {
            filtered = filtered.filter(property => {
                const beds = property.bedrooms || 0;
                if (selectedBeds === 'Studio') return beds === 0;
                if (selectedBeds === '7+') return beds >= 7;
                return beds === parseInt(selectedBeds);
            });
        }

        setFilteredProperties(filtered);
    }, [searchQuery, selectedCity, selectedLocation, selectedPropertyType, selectedPriceRange, selectedBeds]);

    const handlePropertyPress = (property) => {
        if (navigation?.navigate) {
            navigation.navigate('PropertyDetails', { property });
        }
    };

    const handleBack = () => {
        if (navigation?.canGoBack && navigation.canGoBack()) {
            navigation.goBack();
        } else if (navigation?.navigate) {
            navigation.navigate('Home');
        }
    };

    const handleQuickSuggestion = (suggestion) => {
        setSearchQuery(suggestion.text);
    };

    const handleRecentSearch = (search) => {
        setSearchQuery(search);
    };

    const clearAllFilters = () => {
        setSelectedCity('Dubai');
        setSelectedLocation('');
        setSelectedPropertyType('All in Residential');
        setSelectedPriceRange('Any');
        setSelectedBeds('Any');
    };

    const openModal = (setter) => {
        modalAnimation.setValue(0);
        setter(true);
        Animated.spring(modalAnimation, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    };

    const closeModal = (setter) => {
        Animated.timing(modalAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setter(false);
            modalAnimation.setValue(0);
        });
    };

    const renderBottomSheet = (visible, onClose, title, children, icon) => {
        if (!visible) return null;

        return (
            <Modal
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <Animated.View
                        style={[
                            styles.bottomSheet,
                            {
                                transform: [{
                                    translateY: modalAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [400, 0],
                                    })
                                }]
                            }
                        ]}
                    >
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.bottomSheetHandle} />
                            {title && (
                                <View style={styles.bottomSheetHeader}>
                                    {icon && (
                                        <Ionicons name={icon} size={22} color={colors.primary} style={{ marginRight: 10 }} />
                                    )}
                                    <Text style={styles.bottomSheetTitle}>{title}</Text>
                                </View>
                            )}
                            {children}
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    };

    const renderFilterChip = (label, value, onPress, isActive, icon) => (
        <TouchableOpacity
            style={[styles.filterChip, isActive && styles.activeFilterChip]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            {icon && (
                <Ionicons 
                    name={icon} 
                    size={14} 
                    color={isActive ? colors.white : colors.textSecondary} 
                    style={styles.filterIcon}
                />
            )}
            <View style={styles.filterChipContent}>
                <Text style={styles.filterLabel}>{label}</Text>
                <Text style={[styles.filterValue, isActive && styles.activeFilterValue]} numberOfLines={1}>
                    {value}
                </Text>
            </View>
            <Ionicons
                name="chevron-down"
                size={14}
                color={isActive ? colors.white : colors.textSecondary}
            />
        </TouchableOpacity>
    );

    const showEmptyState = searchQuery.trim() === '' && !hasActiveFilters;
    const showNoResults = (searchQuery.trim() !== '' || hasActiveFilters) && filteredProperties.length === 0;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }
            ]}
        >
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <SearchBar
                    placeholder="Search properties, locations..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={true}
                    searchType="general"
                    showClearButton={true}
                    onClear={() => setSearchQuery('')}
                    autoFocus={true}
                    returnKeyType="search"
                    containerStyle={styles.searchBarContainer}
                />
            </View>

            {/* Filters Section */}
            <View style={styles.filtersSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                >
                    {renderFilterChip(
                        'City',
                        selectedCity,
                        () => openModal(setShowCityModal),
                        selectedCity !== 'Dubai',
                        'location-outline'
                    )}
                    {renderFilterChip(
                        'Location',
                        selectedLocation || 'Any',
                        () => openModal(setShowLocationModal),
                        selectedLocation !== '' && selectedLocation !== 'Any',
                        'map-outline'
                    )}
                    {renderFilterChip(
                        'Type',
                        selectedPropertyType.length > 15 ? selectedPropertyType.substring(0, 15) + '...' : selectedPropertyType,
                        () => openModal(setShowPropertyTypeModal),
                        selectedPropertyType !== 'All in Residential' && selectedPropertyType !== 'All in Commercial',
                        'home-outline'
                    )}
                    {renderFilterChip(
                        'Price',
                        selectedPriceRange,
                        () => openModal(setShowPriceModal),
                        selectedPriceRange !== 'Any',
                        'cash-outline'
                    )}
                    {renderFilterChip(
                        'Beds',
                        selectedBeds,
                        () => openModal(setShowBedsModal),
                        selectedBeds !== 'Any',
                        'bed-outline'
                    )}
                    {hasActiveFilters && (
                        <TouchableOpacity
                            style={styles.clearFiltersButton}
                            onPress={clearAllFilters}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close-circle" size={16} color={colors.primary} />
                            <Text style={styles.clearFiltersText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            {/* Content */}
            {showEmptyState ? (
                <ScrollView 
                    style={styles.content}
                    contentContainerStyle={styles.emptyContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Quick Suggestions */}
                    <View style={styles.suggestionsSection}>
                        <Text style={styles.sectionTitle}>Quick Suggestions</Text>
                        <View style={styles.suggestionsGrid}>
                            {quickSuggestions.map((suggestion) => (
                                <TouchableOpacity
                                    key={suggestion.id}
                                    style={styles.suggestionCard}
                                    onPress={() => handleQuickSuggestion(suggestion)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.suggestionIcon}>
                                        <Ionicons name={suggestion.icon} size={20} color={colors.primary} />
                                    </View>
                                    <Text style={styles.suggestionText} numberOfLines={2}>
                                        {suggestion.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <View style={styles.recentSection}>
                            <View style={styles.recentHeader}>
                                <Text style={styles.sectionTitle}>Recent Searches</Text>
                                <TouchableOpacity activeOpacity={0.7}>
                                    <Text style={styles.clearRecentText}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                            {recentSearches.map((search, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.recentItem}
                                    onPress={() => handleRecentSearch(search)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                                    <Text style={styles.recentItemText}>{search}</Text>
                                    <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Popular Locations */}
                    <View style={styles.popularSection}>
                        <Text style={styles.sectionTitle}>Popular Locations</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.popularContent}
                        >
                            {cities.slice(0, 6).map((city) => (
                                <TouchableOpacity
                                    key={city}
                                    style={styles.popularChip}
                                    onPress={() => {
                                        setSelectedCity(city);
                                        setSearchQuery(city);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="location" size={16} color={colors.primary} />
                                    <Text style={styles.popularChipText}>{city}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            ) : showNoResults ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="search" size={64} color={colors.textTertiary} />
                    </View>
                    <Text style={styles.emptyTitle}>No Results Found</Text>
                    <Text style={styles.emptySubtitle}>
                        Try adjusting your search terms or filters to find what you're looking for
                    </Text>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            setSearchQuery('');
                            clearAllFilters();
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.resetButtonText}>Reset Search</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.resultsContainer}>
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsCount}>
                            {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
                        </Text>
                        {hasActiveFilters && (
                            <TouchableOpacity
                                onPress={clearAllFilters}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.clearAllText}>Clear Filters</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <FlatList
                        data={filteredProperties}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrapper}>
                                <PropertyCard
                                    property={item}
                                    onPress={() => handlePropertyPress(item)}
                                    fullWidth={true}
                                />
                            </View>
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}

            {/* City Modal */}
            {renderBottomSheet(
                showCityModal,
                () => closeModal(setShowCityModal),
                'Select City',
                <ScrollView style={styles.modalContent}>
                    {cities.map((city) => (
                        <TouchableOpacity
                            key={city}
                            style={[
                                styles.modalOption,
                                selectedCity === city && styles.activeModalOption
                            ]}
                            onPress={() => {
                                setSelectedCity(city);
                                closeModal(setShowCityModal);
                            }}
                        >
                            <Text style={[
                                styles.modalOptionText,
                                selectedCity === city && styles.activeModalOptionText
                            ]}>{city}</Text>
                            {selectedCity === city && (
                                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>,
                'location-outline'
            )}

            {/* Location Modal */}
            {renderBottomSheet(
                showLocationModal,
                () => closeModal(setShowLocationModal),
                'Select Location',
                <ScrollView style={styles.modalContent}>
                    {locations.map((location) => (
                        <TouchableOpacity
                            key={location}
                            style={[
                                styles.modalOption,
                                (selectedLocation === location || (!selectedLocation && location === 'Any')) && styles.activeModalOption
                            ]}
                            onPress={() => {
                                setSelectedLocation(location === 'Any' ? '' : location);
                                closeModal(setShowLocationModal);
                            }}
                        >
                            <Text style={[
                                styles.modalOptionText,
                                (selectedLocation === location || (!selectedLocation && location === 'Any')) && styles.activeModalOptionText
                            ]}>{location}</Text>
                            {(selectedLocation === location || (!selectedLocation && location === 'Any')) && (
                                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>,
                'map-outline'
            )}

            {/* Property Type Modal */}
            {renderBottomSheet(
                showPropertyTypeModal,
                () => closeModal(setShowPropertyTypeModal),
                'Property Type',
                <ScrollView style={styles.modalContent}>
                    {propertyTypes.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.modalOption,
                                selectedPropertyType === type && styles.activeModalOption
                            ]}
                            onPress={() => {
                                setSelectedPropertyType(type);
                                closeModal(setShowPropertyTypeModal);
                            }}
                        >
                            <Text style={[
                                styles.modalOptionText,
                                selectedPropertyType === type && styles.activeModalOptionText
                            ]}>{type}</Text>
                            {selectedPropertyType === type && (
                                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>,
                'home-outline'
            )}

            {/* Price Range Modal */}
            {renderBottomSheet(
                showPriceModal,
                () => closeModal(setShowPriceModal),
                'Price Range',
                <View style={styles.optionsModalContent}>
                    <View style={styles.optionsGrid}>
                        {priceRanges.map((range) => (
                            <TouchableOpacity
                                key={range}
                                style={[
                                    styles.optionPill,
                                    selectedPriceRange === range && styles.selectedOptionPill
                                ]}
                                onPress={() => {
                                    setSelectedPriceRange(range);
                                    closeModal(setShowPriceModal);
                                }}
                            >
                                <Text style={[
                                    styles.optionPillText,
                                    selectedPriceRange === range && styles.selectedOptionPillText
                                ]}>
                                    {range}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>,
                'cash-outline'
            )}

            {/* Beds Modal */}
            {renderBottomSheet(
                showBedsModal,
                () => closeModal(setShowBedsModal),
                'Number of Beds',
                <View style={styles.optionsModalContent}>
                    <View style={styles.optionsGrid}>
                        {bedsOptions.map((beds) => (
                            <TouchableOpacity
                                key={beds}
                                style={[
                                    styles.optionPill,
                                    selectedBeds === beds && styles.selectedOptionPill
                                ]}
                                onPress={() => {
                                    setSelectedBeds(beds);
                                    closeModal(setShowBedsModal);
                                }}
                            >
                                <Text style={[
                                    styles.optionPillText,
                                    selectedBeds === beds && styles.selectedOptionPillText
                                ]}>
                                    {beds === 'Any' ? 'Any' : beds === 'Studio' ? 'Studio' : `${beds} Bed${beds !== '1' ? 's' : ''}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>,
                'bed-outline'
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingBottom: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    searchBarContainer: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    filtersSection: {
        backgroundColor: colors.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filtersContent: {
        paddingHorizontal: 16,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.border,
        minWidth: 80,
    },
    activeFilterChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterIcon: {
        marginRight: 6,
    },
    filterChipContent: {
        flex: 1,
        marginRight: 4,
    },
    filterLabel: {
        fontSize: 9,
        fontFamily: 'Lato_700Bold',
        color: colors.textTertiary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    filterValue: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
    },
    activeFilterValue: {
        color: colors.white,
    },
    clearFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    clearFiltersText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.primary,
        marginLeft: 4,
    },
    content: {
        flex: 1,
    },
    emptyContent: {
        paddingBottom: 40,
    },
    suggestionsSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    suggestionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    suggestionCard: {
        width: (width - 44) / 2,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    suggestionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    suggestionText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        lineHeight: 20,
    },
    recentSection: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    clearRecentText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.primary,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    recentItemText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        marginLeft: 12,
    },
    popularSection: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    popularContent: {
        paddingRight: 16,
    },
    popularChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    popularChipText: {
        fontSize: 13,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
        marginLeft: 6,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    resetButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    resetButtonText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
    },
    resultsContainer: {
        flex: 1,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    resultsCount: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
    },
    clearAllText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.primary,
    },
    cardWrapper: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 24,
        backgroundColor: colors.background,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: colors.textPrimary,
        letterSpacing: -0.3,
    },
    modalContent: {
        paddingVertical: 8,
        maxHeight: 500,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    activeModalOption: {
        backgroundColor: 'rgba(185, 28, 28, 0.05)',
    },
    modalOptionText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textPrimary,
    },
    activeModalOptionText: {
        fontFamily: 'Lato_400Regular',
        color: colors.primary,
    },
    optionsModalContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionPill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedOptionPill: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    optionPillText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    selectedOptionPillText: {
        color: colors.white,
    },
});

export default SearchScreen;
