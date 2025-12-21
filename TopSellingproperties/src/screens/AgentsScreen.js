import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import colors from '../theme/colors';
import agentsData from '../data/agents.json';
import agenciesData from '../data/agencies.json';

const { width } = Dimensions.get('window');
const STICKY_THRESHOLD = 120;
const mockAgents = agentsData.agents;
const mockAgencies = agenciesData.agencies;

const AgentsScreen = ({ navigation }) => {
    const [selectedTypes, setSelectedTypes] = useState(['Agents']); // Can select Agents, Agencies, or both
    const [selectedTransactions, setSelectedTransactions] = useState(['Buy']); // Can select Buy, Rent, or both
    const [location, setLocation] = useState('Dubai'); // Dubai or Abu Dhabi
    const [searchQuery, setSearchQuery] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [agents] = useState(mockAgents);
    const [agencies] = useState(mockAgencies);

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > STICKY_THRESHOLD);
    };

    // Toggle selection for type (Agents/Agencies)
    const toggleType = (type) => {
        setSelectedTypes(prev => {
            if (prev.includes(type)) {
                // If it's the only one selected, don't allow deselecting
                if (prev.length === 1) return prev;
                return prev.filter(t => t !== type);
            }
            return [...prev, type];
        });
    };

    // Toggle selection for transaction (Buy/Rent)
    const toggleTransaction = (transaction) => {
        setSelectedTransactions(prev => {
            if (prev.includes(transaction)) {
                // If it's the only one selected, don't allow deselecting
                if (prev.length === 1) return prev;
                return prev.filter(t => t !== transaction);
            }
            return [...prev, transaction];
        });
    };

    // Filter agents and agencies based on selections
    const filteredAgents = agents.filter(agent => {
        const matchesSearch = searchQuery === '' ||
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.serviceAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    const filteredAgencies = agencies.filter(agency => {
        const matchesSearch = searchQuery === '' ||
            agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agency.serviceAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    // Combine filtered results based on selected types
    const getFilteredData = () => {
        const data = [];
        if (selectedTypes.includes('Agents')) {
            filteredAgents.forEach(agent => {
                data.push({ ...agent, itemType: 'agent' });
            });
        }
        if (selectedTypes.includes('Agencies')) {
            filteredAgencies.forEach(agency => {
                data.push({ ...agency, itemType: 'agency' });
            });
        }
        return data;
    };

    const renderAgentCard = ({ item }) => {
        const serviceAreasText = item.serviceAreas.length > 1
            ? `${item.serviceAreas[0]} +${item.serviceAreas.length - 1} more`
            : item.serviceAreas[0];

        const languagesText = item.languages.slice(0, 2).join(', ');

        return (
            <TouchableOpacity
                style={styles.agentCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AgentDetails', { agent: item })}
            >
                <View style={styles.agentCardContent}>
                    <View style={styles.agentImageWrapper}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.agentImage}
                        />
                        {item.rating && (
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingBadgeText}>{item.rating}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.agentInfo}>
                        <View style={styles.agentHeader}>
                            <Text style={styles.agentName} numberOfLines={1}>{item.name}</Text>
                            <View style={styles.verifiedIcon}>
                                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.agentSpecialization} numberOfLines={1}>
                            {item.specialization || 'Real Estate Professional'}
                        </Text>
                        <View style={styles.serviceAreasRow}>
                            <Ionicons name="location" size={12} color={colors.textSecondary} />
                            <Text style={styles.serviceAreas} numberOfLines={1}>{serviceAreasText}</Text>
                        </View>
                        <View style={styles.languagesRow}>
                            <Ionicons name="chatbubbles" size={12} color={colors.textSecondary} />
                            <Text style={styles.languages} numberOfLines={1}>{languagesText}</Text>
                        </View>
                        <View style={styles.listingTags}>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.saleListings} Sale</Text>
                            </View>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.rentListings} Rent</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.agencyLogoContainer}>
                        <Image
                            source={{ uri: item.agencyLogo }}
                            style={styles.agencyLogo}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderAgencyCard = ({ item }) => {
        const serviceAreasText = item.serviceAreas.slice(0, 2).join(', ');
        const specializationsText = item.specializations.slice(0, 2).join(', ');

        return (
            <TouchableOpacity
                style={styles.agentCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AgencyDetails', { agency: item })}
            >
                <View style={styles.agentCardContent}>
                    <View style={styles.agencyLogoWrapper}>
                        <Image
                            source={{ uri: item.logo }}
                            style={styles.agencyCardLogo}
                        />
                        {item.verified && (
                            <View style={styles.verifiedBadgeSmall}>
                                <Ionicons name="checkmark-circle" size={14} color="#25D366" />
                            </View>
                        )}
                    </View>
                    <View style={styles.agentInfo}>
                        <View style={styles.agencyHeader}>
                            <Text style={styles.agentName} numberOfLines={1}>{item.name}</Text>
                        </View>
                        <Text style={styles.agencyDescription} numberOfLines={2}>{item.description}</Text>
                        <View style={styles.agencyStatsRow}>
                            <View style={styles.agencyStatItem}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.agencyStatText}>{item.rating}</Text>
                            </View>
                            <Text style={styles.agencyStatDivider}>•</Text>
                            <Text style={styles.agencyStatText}>{item.yearsInBusiness} years</Text>
                        </View>
                        <View style={styles.serviceAreasRow}>
                            <Ionicons name="location" size={12} color={colors.textSecondary} />
                            <Text style={styles.serviceAreas} numberOfLines={1}>{serviceAreasText}</Text>
                        </View>
                        <View style={styles.listingTags}>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.totalAgents} Agents</Text>
                            </View>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.totalListings} Listings</Text>
                            </View>
                        </View>
                        {specializationsText && (
                            <View style={styles.specializationsRow}>
                                <Ionicons name="star-outline" size={12} color={colors.textSecondary} />
                                <Text style={styles.specializations} numberOfLines={1}>{specializationsText}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => {
        if (item.itemType === 'agency') {
            return renderAgencyCard({ item });
        }
        return renderAgentCard({ item });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
                bounces={true}
            >
                {/* Hero Section - Clean Design */}
                <View style={styles.heroSection}>
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={28} color={colors.primary} />
                    </TouchableOpacity>

                    {/* Title with Icon */}
                    <View style={styles.titleRow}>
                        <Ionicons name="home" size={28} color={colors.primary} />
                        <Text style={styles.welcomeTitle}>Find My Agent</Text>
                    </View>

                    {/* Agents/Agencies Toggle */}
                    <View style={styles.typeToggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.typeToggleButton,
                                selectedTypes.includes('Agents') && styles.activeTypeToggleButton
                            ]}
                            onPress={() => toggleType('Agents')}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.typeToggleText,
                                selectedTypes.includes('Agents') && styles.activeTypeToggleText
                            ]}>
                                Agents
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeToggleButton,
                                selectedTypes.includes('Agencies') && styles.activeTypeToggleButton
                            ]}
                            onPress={() => toggleType('Agencies')}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.typeToggleText,
                                selectedTypes.includes('Agencies') && styles.activeTypeToggleText
                            ]}>
                                Agencies
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Buy/Rent Tabs */}
                    <View style={styles.buyRentContainer}>
                        <TouchableOpacity
                            style={[
                                styles.buyRentButton,
                                selectedTransactions.includes('Buy') && styles.activeBuyRentButton
                            ]}
                            onPress={() => toggleTransaction('Buy')}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.buyRentText,
                                selectedTransactions.includes('Buy') && styles.activeBuyRentText
                            ]}>
                                Buy
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.buyRentButton,
                                selectedTransactions.includes('Rent') && styles.activeBuyRentButton
                            ]}
                            onPress={() => toggleTransaction('Rent')}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.buyRentText,
                                selectedTransactions.includes('Rent') && styles.activeBuyRentText
                            ]}>
                                Rent
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sticky Search Bar */}
                <SearchBar
                    placeholder="Search by Agent name or Location"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={true}
                    isSticky={isSticky}
                    containerStyle={{ backgroundColor: '#FFF5F5' }}
                />

                {/* Location Filter Section */}
                <View style={styles.filtersSection}>
                    {/* Location Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.locationTabsContainer}
                        contentContainerStyle={styles.locationTabsContent}
                        nestedScrollEnabled={true}
                    >
                        {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah'].map((loc) => (
                            <TouchableOpacity
                                key={loc}
                                style={[
                                    styles.locationTab,
                                    location === loc && styles.activeLocationTab
                                ]}
                                onPress={() => setLocation(loc)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.locationTabText,
                                    location === loc && styles.activeLocationTabText
                                ]}>
                                    {loc}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* TSPBroker Section */}
                <View style={styles.truBrokerSection}>
                    <View style={styles.truBrokerBadge}>
                        <Text style={styles.truBrokerText}>TSPBroker™</Text>
                    </View>
                    <Text style={styles.truBrokerDescription}>
                        Explore agents with a proven track record of high response rates and authentic listings.
                    </Text>
                </View>

                {/* Agents/Agencies List */}
                <View style={styles.agentsListContainer}>
                    <FlatList
                        data={getFilteredData()}
                        keyExtractor={(item) => `${item.itemType}-${item.id}`}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        contentContainerStyle={styles.agentsList}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heroSection: {
        backgroundColor: '#FFF5F5',
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    backButton: {
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    welcomeTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: colors.primary,
        letterSpacing: -0.5,
    },
    typeToggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 25,
        padding: 4,
        alignSelf: 'flex-start',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    typeToggleButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    activeTypeToggleButton: {
        backgroundColor: colors.primary,
    },
    typeToggleText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    activeTypeToggleText: {
        color: colors.white,
    },
    buyRentContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    buyRentButton: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeBuyRentButton: {
        borderBottomColor: colors.primary,
    },
    buyRentText: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    activeBuyRentText: {
        color: colors.primary,
    },
    filtersSection: {
        backgroundColor: '#FFF5F5',
        paddingTop: 8,
        paddingBottom: 16,
    },
    typeContainer: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 16,
        padding: 6,
        marginHorizontal: 20,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    activeTypeButton: {
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    typeText: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        color: colors.textSecondary,
    },
    activeTypeText: {
        color: colors.primary,
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryContent: {
        paddingHorizontal: 20,
    },
    categoryPill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeCategoryPill: {
        backgroundColor: colors.black,
        borderColor: colors.black,
    },
    categoryPillText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
    },
    activeCategoryPillText: {
        color: colors.white,
    },
    transactionContainer: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 16,
        padding: 6,
        marginHorizontal: 20,
    },
    transactionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    activeTransactionButton: {
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    transactionText: {
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
        color: colors.textSecondary,
    },
    activeTransactionText: {
        color: colors.primary,
    },
    locationTabsContainer: {
        marginTop: 12,
        marginBottom: 8,
    },
    locationTabsContent: {
        paddingHorizontal: 20,
    },
    locationTab: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeLocationTab: {
        backgroundColor: colors.black,
        borderColor: colors.black,
    },
    locationTabText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    activeLocationTabText: {
        color: colors.white,
    },
    truBrokerSection: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    truBrokerBadge: {
        backgroundColor: colors.maroon,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 12,
    },
    truBrokerText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    truBrokerDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
    },
    agentsListContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: colors.white,
    },
    agentsList: {
        paddingBottom: 20,
    },
    agentCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    agentCardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
    },
    agentImageWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    agentImage: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        borderWidth: 2,
        borderColor: 'rgba(185, 28, 28, 0.1)',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    ratingBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textPrimary,
        marginLeft: 2,
    },
    agentInfo: {
        flex: 1,
    },
    agentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    agentName: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.textPrimary,
        flex: 1,
    },
    verifiedIcon: {
        marginLeft: 6,
    },
    agentSpecialization: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    serviceAreasRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    serviceAreas: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 4,
        flex: 1,
    },
    languagesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    languages: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 4,
        flex: 1,
    },
    listingTags: {
        flexDirection: 'row',
        gap: 8,
    },
    listingTag: {
        backgroundColor: '#E6F3FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    listingTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4299E1',
    },
    agencyLogoContainer: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    agencyLogo: {
        width: 40,
        height: 40,
    },
    agencyLogoWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    agencyCardLogo: {
        width: 70,
        height: 70,
        borderRadius: 16,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: 'rgba(185, 28, 28, 0.1)',
    },
    verifiedBadgeSmall: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 2,
        borderWidth: 1.5,
        borderColor: '#25D366',
    },
    agencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    agencyDescription: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 8,
        lineHeight: 16,
    },
    agencyStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    agencyStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    agencyStatText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 4,
        fontWeight: '600',
    },
    agencyStatDivider: {
        fontSize: 12,
        color: colors.textTertiary,
        marginHorizontal: 6,
    },
    specializationsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    specializations: {
        fontSize: 11,
        color: colors.textTertiary,
        marginLeft: 4,
        flex: 1,
        fontStyle: 'italic',
    },
});

export default AgentsScreen;
