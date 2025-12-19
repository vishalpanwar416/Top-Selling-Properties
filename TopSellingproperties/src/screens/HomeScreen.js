import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import colors from '../theme/colors';
import propertiesData from '../data/properties.json';

const propertyCategories = ['Residential', 'Commercial', 'Rooms For Rent', 'Monthly Short Term', 'Daily Short Term'];
const transactionTypes = ['Sale', 'Rent', 'Off-Plan', 'New Projects'];

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Residential');
    const [activeType, setActiveType] = useState('Rent');
    const [properties, setProperties] = useState(propertiesData.properties);

    const filteredProperties = properties.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePropertyPress = (property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const renderHeader = () => (
        <View style={styles.headerHero}>
            <View style={styles.maroonOverlay}>
                <Header navigation={navigation} transparent />
                <View style={styles.headerContent}>
                    {/* Top Level: Property Categories */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {propertyCategories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.categoryPill, activeCategory === cat && styles.activeCategoryPill]}
                                onPress={() => setActiveCategory(cat)}
                            >
                                <Text style={[styles.categoryPillText, activeCategory === cat && styles.activeCategoryPillText]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Bottom Level: Transaction Types (Inside dark capsule) */}
                    <View style={styles.transactionCapsule}>
                        {transactionTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.typeTab, activeType === type && styles.activeTypeTab]}
                                onPress={() => setActiveType(type)}
                            >
                                <Text style={[styles.typeTabText, activeType === type && styles.activeTypeTabText]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Enhanced Search Bar */}
                    <View style={styles.searchBox}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for a locality, area or city"
                            placeholderTextColor={colors.gray}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Text style={styles.searchIcon}>🔍</Text>
                    </View>
                </View>
            </View>

            {/* Recent Searches */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
                    <TouchableOpacity style={styles.recentCard}>
                        <View style={styles.recentInfo}>
                            <Text style={styles.recentCity}>Dubai</Text>
                            <Text style={styles.recentType}>Residential Properties for S...</Text>
                            <View style={styles.badge}><Text style={styles.badgeText}>Off-Plan</Text></View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Banner Section */}
            <TouchableOpacity style={styles.bannerContainer}>
                <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>Sell or Rent Your Property</Text>
                    <Text style={styles.bannerSubtitle}>Connect with a trusted agent to secure the best deal, faster.</Text>
                </View>
                <View style={styles.bannerBadge}>
                    <Text style={styles.bannerBadgeText}>NEW</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                    {filteredProperties.length} Properties Found
                </Text>
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
        backgroundColor: '#FFFFFF',
    },
    headerHero: {
        backgroundColor: colors.maroon,
        paddingBottom: 20,
    },
    maroonOverlay: {
        width: '100%',
        backgroundColor: colors.maroon,
        paddingBottom: 24,
    },
    headerContent: {
        paddingHorizontal: 16,
    },
    categoryScroll: {
        marginVertical: 10,
    },
    categoryPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    activeCategoryPill: {
        backgroundColor: colors.red,
        borderColor: colors.red,
    },
    categoryPillText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    activeCategoryPillText: {
        color: '#FFFFFF',
    },
    transactionCapsule: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 30,
        padding: 4,
        marginVertical: 15,
        alignSelf: 'flex-start',
    },
    typeTab: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
    },
    activeTypeTab: {
        backgroundColor: colors.red,
    },
    typeTabText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    activeTypeTabText: {
        color: '#FFFFFF',
    },
    newBadgeText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 55,
        marginTop: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
    },
    searchIcon: {
        fontSize: 20,
        color: colors.maroon,
    },
    sectionContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    recentScroll: {
        flexDirection: 'row',
    },
    recentCard: {
        width: 280,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    recentInfo: {
        flex: 1,
    },
    recentCity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    recentType: {
        fontSize: 13,
        color: colors.textSecondary,
        marginVertical: 4,
    },
    badge: {
        backgroundColor: '#F0F0F0',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    bannerContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: colors.maroon,
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
    },
    bannerBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: colors.red,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bannerBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    resultsHeader: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
    },
    resultsText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
});

export default HomeScreen;
