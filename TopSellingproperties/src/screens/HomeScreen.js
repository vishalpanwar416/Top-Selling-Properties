import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const { width } = Dimensions.get('window');

const propertyCategories = ['Residential', 'Commercial', 'Rooms For Rent', 'Monthly Short Term', 'Daily Short Term'];
const transactionTypes = ['Sale', 'Rent', 'Off-Plan', 'New Projects'];

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Residential');
    const [activeType, setActiveType] = useState('Rent');
    const [properties, setProperties] = useState(propertiesData.properties);

    const filteredProperties = properties.filter(property =>
        (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Hero Section with Gradient Background */}
            <View style={styles.heroSection}>
                <Header navigation={navigation} transparent />
                
                <View style={styles.heroContent}>
                    {/* Welcome Text */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeTitle}>Find Your Dream Property</Text>
                        <Text style={styles.welcomeSubtitle}>Discover premium real estate in UAE</Text>
                    </View>

                    {/* Modern Search Bar */}
                    <TouchableOpacity 
                        style={styles.searchContainer}
                        onPress={() => navigation.navigate('Search')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
                            <Text style={[styles.searchInput, !searchQuery && styles.searchPlaceholder]}>
                                {searchQuery || 'Search location, area, or city'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Category Pills - Modern Design */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.categoryContainer}
                        contentContainerStyle={styles.categoryContent}
                    >
                        {propertyCategories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryPill,
                                    activeCategory === cat && styles.activeCategoryPill
                                ]}
                                onPress={() => setActiveCategory(cat)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.categoryPillText,
                                    activeCategory === cat && styles.activeCategoryPillText
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Transaction Types - Modern Segmented Control */}
                    <View style={styles.transactionContainer}>
                        {transactionTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.transactionButton,
                                    activeType === type && styles.activeTransactionButton
                                ]}
                                onPress={() => setActiveType(type)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.transactionText,
                                    activeType === type && styles.activeTransactionText
                                ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* Results Header */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>
                    {filteredProperties.length} Properties Available
                </Text>
                <TouchableOpacity>
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredProperties}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <PropertyCard
                        property={item}
                        onPress={() => handlePropertyPress(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        backgroundColor: colors.white,
    },
    heroSection: {
        backgroundColor: colors.primary,
        paddingBottom: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    heroContent: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    welcomeSection: {
        marginBottom: 24,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '400',
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 56,
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '400',
    },
    searchPlaceholder: {
        color: colors.textTertiary,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryContent: {
        paddingRight: 20,
    },
    categoryPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeCategoryPill: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    categoryPillText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.white,
        letterSpacing: 0.2,
    },
    activeCategoryPillText: {
        color: colors.white,
    },
    transactionContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 14,
        padding: 4,
    },
    transactionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    activeTransactionButton: {
        backgroundColor: colors.secondary,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    transactionText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: 0.3,
    },
    activeTransactionText: {
        color: colors.white,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: -0.3,
    },
    filterText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
    },
    listContent: {
        paddingBottom: 24,
        backgroundColor: colors.background,
    },
});

export default HomeScreen;
