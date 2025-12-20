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
    const [slideAnim] = useState(new Animated.Value(50));

    useEffect(() => {
        // Animate screen entrance
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
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            navigation.goBack();
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
            <View style={[styles.searchHeader, { paddingTop: insets.top + 12 }]}>
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
            </View>

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
