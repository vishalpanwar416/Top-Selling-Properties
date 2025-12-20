import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Animated,
    Keyboard,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PropertyCard from '../components/PropertyCard';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const SearchScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProperties, setFilteredProperties] = useState(propertiesData.properties);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));
    const [headerOpacity] = useState(new Animated.Value(0));
    const [filtersOpacity] = useState(new Animated.Value(0));
    const [filtersTranslateY] = useState(new Animated.Value(20));
    
    // Filter states
    const [selectedCity, setSelectedCity] = useState('Dubai');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('All in Residential');
    const [selectedPriceRange, setSelectedPriceRange] = useState('Any');
    const [selectedBeds, setSelectedBeds] = useState('Any');

    useEffect(() => {
        // Smooth entrance animation with staggered elements
        Animated.sequence([
            // Main container fade and slide
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
            // Header fade in
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            // Filters fade in with slight delay
            Animated.parallel([
                Animated.timing(filtersOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(filtersTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Focus search input
        const timer = setTimeout(() => {
            Keyboard.dismiss();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProperties(propertiesData.properties);
        } else {
            const filtered = propertiesData.properties.filter(property =>
                (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (property.type && property.type.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredProperties(filtered);
        }
    }, [searchQuery]);

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const handleBack = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 30,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(headerOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(filtersOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                // If can't go back, navigate to Home
                navigation.navigate('Home');
            }
        });
    };

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
            {/* Search Header */}
            <Animated.View 
                style={[
                    styles.searchHeader, 
                    { 
                        paddingTop: insets.top + 12,
                        opacity: headerOpacity,
                    }
                ]}
            >
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search properties, locations..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}
                        >
                            <Ionicons name="close-circle" size={20} color={colors.white} />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>

            {/* Filters Section */}
            <Animated.View 
                style={[
                    styles.filtersContainer,
                    {
                        opacity: filtersOpacity,
                        transform: [{ translateY: filtersTranslateY }],
                    }
                ]}
            >
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                >
                    {/* City Filter */}
                    <TouchableOpacity 
                        style={styles.filterChip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterLabel}>CITY</Text>
                        <Text style={styles.filterValue}>{selectedCity}</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Location Filter */}
                    <TouchableOpacity 
                        style={styles.filterChip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterLabel}>LOCATION</Text>
                        <Text style={styles.filterValue}>{selectedLocation || 'Any'}</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Property Type Filter */}
                    <TouchableOpacity 
                        style={styles.filterChip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterLabel}>PROPERTY TYPE</Text>
                        <Text style={styles.filterValue} numberOfLines={1}>{selectedPropertyType}</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Price Range Filter */}
                    <TouchableOpacity 
                        style={styles.filterChip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterLabel}>PRICE RANGE</Text>
                        <Text style={styles.filterValue}>{selectedPriceRange}</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Beds Filter */}
                    <TouchableOpacity 
                        style={styles.filterChip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterLabel}>BEDS</Text>
                        <Text style={styles.filterValue}>{selectedBeds}</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* More Filters */}
                    <TouchableOpacity 
                        style={[styles.filterChip, styles.moreFilterChip]}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterLabel}>MORE</Text>
                        <Text style={styles.filterValue}>More filters</Text>
                        <Ionicons name="options" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>

            {/* Results */}
            <View style={styles.content}>
                {searchQuery.trim() === '' ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="search" size={80} color={colors.textTertiary} style={styles.emptyIcon} />
                        <Text style={styles.emptyTitle}>Start Searching</Text>
                        <Text style={styles.emptySubtitle}>
                            Enter a location, property type, or keyword to find properties
                        </Text>
                    </View>
                ) : filteredProperties.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="home" size={80} color={colors.textTertiary} style={styles.emptyIcon} />
                        <Text style={styles.emptyTitle}>No Results Found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try adjusting your search terms
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.resultsHeader}>
                            <Text style={styles.resultsCount}>
                                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
                            </Text>
                        </View>
                        <FlatList
                            data={filteredProperties}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <PropertyCard
                                    property={item}
                                    onPress={() => handlePropertyPress(item)}
                                />
                            )}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchHeader: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingBottom: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    backButtonText: {
        fontSize: 28,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 56,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 12,
        color: colors.primary,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '400',
    },
    clearButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.textTertiary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    filtersContainer: {
        backgroundColor: colors.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filtersContent: {
        paddingHorizontal: 20,
        paddingRight: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.border,
        minWidth: 100,
    },
    moreFilterChip: {
        backgroundColor: colors.white,
        borderColor: colors.primary,
        borderWidth: 1.5,
    },
    filterLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textTertiary,
        letterSpacing: 0.5,
        marginRight: 6,
        textTransform: 'uppercase',
    },
    filterValue: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
        marginRight: 4,
        flex: 1,
    },
    content: {
        flex: 1,
    },
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    resultsCount: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    listContent: {
        paddingBottom: 24,
        backgroundColor: colors.background,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    emptySubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
});

export default SearchScreen;
