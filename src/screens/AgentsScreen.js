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
import channelPartnersData from '../data/channelPartners.json';

const { width } = Dimensions.get('window');
const STICKY_THRESHOLD = 120;
const mockAgents = agentsData.agents;
const mockAgencies = agenciesData.agencies;
const mockChannelPartners = channelPartnersData.channelPartners;

const AgentsScreen = ({ navigation }) => {
    const [selectedTypes, setSelectedTypes] = useState(['Agents']);
    const [selectedTransactions, setSelectedTransactions] = useState(['Buy']);
    const [location, setLocation] = useState('Dubai');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [agents] = useState(mockAgents);
    const [agencies] = useState(mockAgencies);
    const [channelPartners] = useState(mockChannelPartners);

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsSticky(offsetY > STICKY_THRESHOLD);
    };

    // Select type (Agents/Agencies) - only one can be selected
    const selectType = (type) => {
        setSelectedTypes([type]);
    };

    // Select transaction (Buy/Rent) - only one can be selected
    const selectTransaction = (transaction) => {
        setSelectedTransactions([transaction]);
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

    const filteredChannelPartners = channelPartners.filter(partner => {
        const matchesSearch = searchQuery === '' ||
            partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.serviceAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
            partner.developers.some(dev => dev.toLowerCase().includes(searchQuery.toLowerCase()));
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
        if (selectedTypes.includes('Channel Partners')) {
            filteredChannelPartners.forEach(partner => {
                data.push({ ...partner, itemType: 'channelPartner' });
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
                            resizeMode="cover"
                        />
                        {item.rating && (
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={10} color="#FFD700" />
                                <Text style={styles.ratingBadgeText}>{item.rating}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.agentInfo}>
                        <View style={styles.agentHeader}>
                            <Text style={styles.agentName} numberOfLines={1}>{item.name}</Text>
                            <View style={styles.verifiedIcon}>
                                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.agentSpecialization} numberOfLines={1}>
                            {item.specialization || 'Real Estate Professional'}
                        </Text>
                        <View style={styles.serviceAreasRow}>
                            <Ionicons name="location" size={11} color={colors.textSecondary} />
                            <Text style={styles.serviceAreas} numberOfLines={1}>{serviceAreasText}</Text>
                        </View>
                        <View style={styles.languagesRow}>
                            <Ionicons name="chatbubbles" size={11} color={colors.textSecondary} />
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
        const serviceAreasText = item.serviceAreas?.slice(0, 2).join(', ') || '';
        const specializationsText = item.specializations?.slice(0, 2).join(', ') || '';

        return (
            <TouchableOpacity
                style={styles.agentCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AgencyDetails', { agency: item })}
            >
                <View style={styles.agentCardContent}>
                    <View style={styles.agencyLogoWrapper}>
                        <Image
                            source={{ uri: item.logo || 'https://via.placeholder.com/80' }}
                            style={styles.agencyCardLogo}
                            resizeMode="contain"
                        />
                        {item.verified && (
                            <View style={styles.verifiedBadgeSmall}>
                                <Ionicons name="checkmark-circle" size={14} color="#25D366" />
                            </View>
                        )}
                    </View>
                    <View style={styles.agentInfo}>
                        <View style={styles.agentHeader}>
                            <Text style={styles.agentName} numberOfLines={1}>{item.name || 'Agency'}</Text>
                            <View style={styles.verifiedIcon}>
                                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.agencyDescription} numberOfLines={2}>{item.description || ''}</Text>
                        <View style={styles.agencyStatsRow}>
                            <View style={styles.agencyStatItem}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.agencyStatText}>{item.rating || '0'}</Text>
                            </View>
                            <Text style={styles.agencyStatDivider}>•</Text>
                            <Text style={styles.agencyStatText}>{item.yearsInBusiness || 0} years</Text>
                        </View>
                        {serviceAreasText && (
                            <View style={styles.serviceAreasRow}>
                                <Ionicons name="location" size={11} color={colors.textSecondary} />
                                <Text style={styles.serviceAreas} numberOfLines={1}>{serviceAreasText}</Text>
                            </View>
                        )}
                        <View style={styles.listingTags}>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.totalAgents || 0} Agents</Text>
                            </View>
                            <View style={styles.listingTag}>
                                <Text style={styles.listingTagText}>{item.totalListings || 0} Listings</Text>
                            </View>
                        </View>
                        {specializationsText && (
                            <View style={styles.specializationsRow}>
                                <Ionicons name="star-outline" size={11} color={colors.textSecondary} />
                                <Text style={styles.specializations} numberOfLines={1}>{specializationsText}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderChannelPartnerCard = ({ item }) => {
        const serviceAreasText = item.serviceAreas.slice(0, 2).join(', ');
        const developersText = item.developers.slice(0, 2).join(', ');

        return (
            <TouchableOpacity
                style={styles.agentCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AgentDetails', { agent: item, isChannelPartner: true })}
            >
                <View style={styles.agentCardContent}>
                    <View style={styles.agencyLogoWrapper}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.agentImage}
                            resizeMode="cover"
                        />
                        {item.verified && (
                            <View style={styles.verifiedBadgeSmall}>
                                <Ionicons name="checkmark-circle" size={14} color="#25D366" />
                            </View>
                        )}
                    </View>
                    <View style={styles.agentInfo}>
                        <View style={styles.agentHeader}>
                            <Text style={styles.agentName} numberOfLines={1}>{item.name}</Text>
                        </View>
                        <Text style={styles.agentSpecialization} numberOfLines={1}>
                            {item.specialization}
                        </Text>
                        <View style={styles.agencyStatsRow}>
                            <View style={styles.agencyStatItem}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.agencyStatText}>{item.rating}</Text>
                            </View>
                            <Text style={styles.agencyStatDivider}>•</Text>
                            <Text style={styles.agencyStatText}>{item.yearsInBusiness} years</Text>
                        </View>
                        <View style={styles.serviceAreasRow}>
                            <Ionicons name="location" size={11} color={colors.textSecondary} />
                            <Text style={styles.serviceAreas} numberOfLines={1}>{serviceAreasText}</Text>
                        </View>
                        <View style={styles.listingTags}>
                            <View style={[styles.listingTag, { backgroundColor: '#E8F5E9' }]}>
                                <Text style={[styles.listingTagText, { color: '#4CAF50' }]}>{item.totalDeals} Deals</Text>
                            </View>
                            <View style={[styles.listingTag, { backgroundColor: '#FFF3E0' }]}>
                                <Text style={[styles.listingTagText, { color: '#FF9800' }]}>{item.activeProjects} Projects</Text>
                            </View>
                        </View>
                        <View style={styles.developersRow}>
                            <Ionicons name="business-outline" size={11} color={colors.textSecondary} />
                            <Text style={styles.developersText} numberOfLines={1}>{developersText}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => {
        if (item.itemType === 'agency') {
            return renderAgencyCard({ item });
        }
        if (item.itemType === 'channelPartner') {
            return renderChannelPartnerCard({ item });
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

                    {/* Agents/Agencies/Channel Partners Toggle */}
                    <View style={styles.typeToggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.typeToggleButton,
                                selectedTypes.includes('Agents') && styles.activeTypeToggleButton
                            ]}
                            onPress={() => selectType('Agents')}
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
                            onPress={() => selectType('Agencies')}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.typeToggleText,
                                selectedTypes.includes('Agencies') && styles.activeTypeToggleText
                            ]}>
                                Agencies
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeToggleButton,
                                selectedTypes.includes('Channel Partners') && styles.activeTypeToggleButton
                            ]}
                            onPress={() => selectType('Channel Partners')}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.typeToggleText,
                                selectedTypes.includes('Channel Partners') && styles.activeTypeToggleText
                            ]}>
                                Channel Partners
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
                            onPress={() => selectTransaction('Buy')}
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
                            onPress={() => selectTransaction('Rent')}
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
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={true}
                    isSticky={isSticky}
                    searchType="agents"
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
        paddingBottom: 16,
    },
    heroSection: {
        backgroundColor: '#FFF5F5',
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    backButton: {
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 10,
    },
    welcomeTitle: {
        fontSize: 22,
        fontFamily: 'Lato_700Bold',
        color: colors.primary,
        letterSpacing: -0.5,
    },
    typeToggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 25,
        padding: 4,
        alignSelf: 'flex-start',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    typeToggleButton: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
    },
    activeTypeToggleButton: {
        backgroundColor: colors.primary,
    },
    typeToggleText: {
        fontSize: 14,
        fontFamily: 'Lato_400Regular',
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
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeBuyRentButton: {
        borderBottomColor: colors.primary,
    },
    buyRentText: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    activeBuyRentText: {
        color: colors.primary,
    },
    filtersSection: {
        backgroundColor: '#FFF5F5',
        paddingTop: 6,
        paddingBottom: 12,
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
        fontFamily: 'Lato_700Bold',
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
        fontFamily: 'Lato_400Regular',
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
        fontFamily: 'Lato_700Bold',
        color: colors.textSecondary,
    },
    activeTransactionText: {
        color: colors.primary,
    },
    locationTabsContainer: {
        marginTop: 8,
        marginBottom: 6,
    },
    locationTabsContent: {
        paddingHorizontal: 20,
    },
    locationTab: {
        paddingHorizontal: 12,
        paddingVertical: 3,
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
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: colors.textSecondary,
    },
    activeLocationTabText: {
        color: colors.white,
    },
    truBrokerSection: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    truBrokerBadge: {
        backgroundColor: colors.maroon,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        marginBottom: 8,
    },
    truBrokerText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    truBrokerDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: colors.textSecondary,
    },
    agentsListContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        backgroundColor: colors.white,
    },
    agentsList: {
        paddingBottom: 16,
    },
    agentCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: 12,
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
        padding: 12,
        alignItems: 'center',
    },
    agentImageWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    agentImage: {
        width: 60,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(185, 28, 28, 0.1)',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    ratingBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: colors.textPrimary,
        marginLeft: 2,
    },
    agentInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    agentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    agentName: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
        flex: 1,
    },
    verifiedIcon: {
        marginLeft: 5,
    },
    agentSpecialization: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 5,
        fontWeight: '500',
    },
    serviceAreasRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    serviceAreas: {
        fontSize: 10,
        color: colors.textSecondary,
        marginLeft: 4,
        flex: 1,
    },
    languagesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    languages: {
        fontSize: 10,
        color: colors.textSecondary,
        marginLeft: 4,
        flex: 1,
    },
    listingTags: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 2,
    },
    listingTag: {
        backgroundColor: '#E6F3FF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    listingTagText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4299E1',
    },
    agencyLogoContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    agencyLogo: {
        width: 32,
        height: 32,
    },
    agencyLogoWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    agencyCardLogo: {
        width: 60,
        height: 60,
        borderRadius: 14,
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
        marginBottom: 4,
    },
    agencyDescription: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 6,
        lineHeight: 15,
    },
    agencyStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    agencyStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    agencyStatText: {
        fontSize: 11,
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
    developersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    developersText: {
        fontSize: 10,
        color: colors.primary,
        marginLeft: 4,
        flex: 1,
        fontWeight: '500',
    },
});

export default AgentsScreen;
