import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
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

const FindMyAgentScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Agents'); // Agents or Agencies
    const [transactionType, setTransactionType] = useState('Buy'); // Buy or Rent
    const [location, setLocation] = useState('Dubai'); // Dubai or Abu Dhabi
    const [searchQuery, setSearchQuery] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [agents] = useState(mockAgents);
    const [agencies] = useState(mockAgencies);

    const uaeLocations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah'];

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > STICKY_THRESHOLD);
    };

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

    const renderAgentCard = ({ item }) => {
        const serviceAreasText = item.serviceAreas.length > 1
            ? `Serves in ${item.serviceAreas[0]}... +${item.serviceAreas.length - 1} more`
            : `Serves in ${item.serviceAreas[0]}`;

        const languagesText = `Speaks: ${item.languages.join(' and ')}`;

        return (
            <TouchableOpacity
                style={styles.agentCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AgentDetails', { agent: item })}
            >
                <View style={styles.agentCardContent}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.agentImage}
                    />
                    <View style={styles.agentInfo}>
                        <Text style={styles.agentName}>{item.name}</Text>
                        <Text style={styles.serviceAreas}>{serviceAreasText}</Text>
                        <Text style={styles.languages}>{languagesText}</Text>
                        <View style={styles.listingTags}>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.saleListings} SALE</Text>
                            </View>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.rentListings} RENT</Text>
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
        const serviceAreasText = item.serviceAreas.join(', ');
        const specializationsText = item.specializations.slice(0, 2).join(', ');

        return (
            <TouchableOpacity
                style={styles.agentCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AgencyDetails', { agency: item })}
            >
                <View style={styles.agentCardContent}>
                    <Image
                        source={{ uri: item.logo }}
                        style={styles.agencyCardLogo}
                    />
                    <View style={styles.agentInfo}>
                        <View style={styles.agencyHeader}>
                            <Text style={styles.agentName}>{item.name}</Text>
                            {item.verified && (
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.black} />
                                </View>
                            )}
                        </View>
                        <Text style={styles.agencyDescription} numberOfLines={2}>{item.description}</Text>
                        <Text style={styles.serviceAreas}>📍 {serviceAreasText}</Text>
                        <Text style={styles.languages}>⭐ {item.rating} • {item.yearsInBusiness} years</Text>
                        <View style={styles.listingTags}>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.totalAgents} Agents</Text>
                            </View>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.totalListings} Listings</Text>
                            </View>
                        </View>
                        <Text style={styles.specializations}>Specializes in: {specializationsText}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
                bounces={true}
            >
                {/* Hero Section with Gradient */}
                <View style={styles.heroSection}>
                    <Header navigation={navigation} transparent />
                    <View style={styles.heroContent}>
                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeTitle}>Find My Agent</Text>
                            <Text style={styles.welcomeSubtitle}>Connect with trusted real estate professionals</Text>
                        </View>
                    </View>
                </View>

                {/* Sticky Search Bar */}
                <SearchBar
                    placeholder={activeTab === 'Agents' ? "Search by Agent name or Location" : "Search by Agency name or Location"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={true}
                    isSticky={isSticky}
                />

                {/* Filters Section */}
                <View style={styles.filtersSection}>
                    {/* Type Filter - Agents/Agencies */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryContainer}
                        contentContainerStyle={styles.categoryContent}
                        nestedScrollEnabled={true}
                    >
                        <TouchableOpacity
                            style={[
                                styles.categoryPill,
                                activeTab === 'Agents' && styles.activeCategoryPill
                            ]}
                            onPress={() => setActiveTab('Agents')}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.categoryPillText,
                                activeTab === 'Agents' && styles.activeCategoryPillText
                            ]}>
                                Agents
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.categoryPill,
                                activeTab === 'Agencies' && styles.activeCategoryPill
                            ]}
                            onPress={() => setActiveTab('Agencies')}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.categoryPillText,
                                activeTab === 'Agencies' && styles.activeCategoryPillText
                            ]}>
                                Agencies
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Transaction Types */}
                    <View style={styles.transactionContainer}>
                        {['Buy', 'Rent'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.transactionButton,
                                    transactionType === type && styles.activeTransactionButton
                                ]}
                                onPress={() => setTransactionType(type)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.transactionText,
                                    transactionType === type && styles.activeTransactionText
                                ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Location Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.locationTabsContainer}
                        contentContainerStyle={styles.locationTabsContent}
                        nestedScrollEnabled={true}
                    >
                        {uaeLocations.map((loc) => (
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
                        <Text style={styles.truBrokerText}>TruBroker™</Text>
                    </View>
                    <Text style={styles.truBrokerDescription}>
                        Explore agents with a proven track record of high response rates and authentic listings.
                    </Text>
                </View>

                {/* Agents/Agencies List */}
                <View style={styles.agentsListContainer}>
                    <FlatList
                        data={activeTab === 'Agents' ? filteredAgents : filteredAgencies}
                        keyExtractor={(item) => item.id}
                        renderItem={activeTab === 'Agents' ? renderAgentCard : renderAgencyCard}
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
    heroSection: {
        backgroundColor: colors.maroon,
        paddingBottom: 40,
        minHeight: 200,
    },
    heroContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    welcomeSection: {
        marginTop: 20,
    },
    welcomeTitle: {
        fontSize: 28,
        fontFamily: 'Poppins_800ExtraBold',
        color: colors.white,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Poppins_500Medium',
    },
    // Filters Section
    filtersSection: {
        backgroundColor: colors.white,
        paddingTop: 8,
        paddingBottom: 16,
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
    // TSPBroker Section
    truBrokerSection: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        marginHorizontal: 20,
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
        fontFamily: 'Poppins_700Bold',
    },
    truBrokerDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
        fontFamily: 'Poppins_500Medium',
    },
    agentsListContainer: {
        paddingHorizontal: 20,
        paddingTop: 0,
        backgroundColor: '#F0F4F8',
    },
    agentsList: {
        paddingBottom: 20,
    },
    agentCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    agentCardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    agentImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 16,
        borderWidth: 2,
        borderColor: colors.border,
    },
    agentInfo: {
        flex: 1,
    },
    agentName: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    serviceAreas: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginBottom: 4,
    },
    languages: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        marginBottom: 8,
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
        fontFamily: 'Poppins_600SemiBold',
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
    agencyCardLogo: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: colors.white,
        marginRight: 16,
    },
    agencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    verifiedBadge: {
        marginLeft: 6,
    },
    agencyDescription: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 6,
        lineHeight: 16,
    },
    specializations: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 4,
        fontStyle: 'italic',
    },
});

export default FindMyAgentScreen;

