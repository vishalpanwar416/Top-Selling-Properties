import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

// Mock agent data
const mockAgents = [
    {
        id: '1',
        name: 'Jitesh Jeswani',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        serviceAreas: ['Downtown Dubai', 'Business Bay', 'Dubai Marina'],
        languages: ['English', 'Hindi'],
        saleListings: 8,
        rentListings: 2,
        agencyLogo: 'https://via.placeholder.com/40?text=ROCKY',
        agencyName: 'ROCKY',
    },
    {
        id: '2',
        name: 'George Hamblyn',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        serviceAreas: ['Downtown Dubai'],
        languages: ['English'],
        saleListings: 11,
        rentListings: 4,
        agencyLogo: 'https://via.placeholder.com/40?text=SAVILLS',
        agencyName: 'savills',
    },
    {
        id: '3',
        name: 'Liam Joshua Dawett',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        serviceAreas: ['Dubai Marina', 'JBR'],
        languages: ['English', 'Arabic'],
        saleListings: 15,
        rentListings: 7,
        agencyLogo: 'https://via.placeholder.com/40?text=AGENCY',
        agencyName: 'Agency',
    },
    {
        id: '4',
        name: 'Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        serviceAreas: ['Palm Jumeirah', 'Dubai Marina'],
        languages: ['English', 'French'],
        saleListings: 9,
        rentListings: 3,
        agencyLogo: 'https://via.placeholder.com/40?text=AGENCY',
        agencyName: 'Agency',
    },
];

const FindMyAgentScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('Agents'); // Agents or Agencies
    const [transactionType, setTransactionType] = useState('Buy'); // Buy or Rent
    const [location, setLocation] = useState('Dubai'); // Dubai or Abu Dhabi
    const [searchQuery, setSearchQuery] = useState('');
    const [agents] = useState(mockAgents);

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = searchQuery === '' || 
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.serviceAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    const renderAgentCard = ({ item }) => {
        const serviceAreasText = item.serviceAreas.length > 1
            ? `Serves in ${item.serviceAreas[0]}... +${item.serviceAreas.length - 1} more`
            : `Serves in ${item.serviceAreas[0]}`;
        
        const languagesText = `Speaks: ${item.languages.join(' and ')}`;

        return (
            <TouchableOpacity style={styles.agentCard} activeOpacity={0.8}>
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Ionicons name="search" size={20} color={colors.primary} style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Find My Agent</Text>
                </View>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Tab Selector - Agents/Agencies */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Agents' && styles.tabActive]}
                        onPress={() => setActiveTab('Agents')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Agents' && styles.tabTextActive]}>
                            Agents
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Agencies' && styles.tabActive]}
                        onPress={() => setActiveTab('Agencies')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Agencies' && styles.tabTextActive]}>
                            Agencies
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Transaction Type - Buy/Rent */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, transactionType === 'Buy' && styles.filterButtonActive]}
                        onPress={() => setTransactionType('Buy')}
                    >
                        <Text style={[styles.filterText, transactionType === 'Buy' && styles.filterTextActive]}>
                            Buy
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, transactionType === 'Rent' && styles.filterButtonActive]}
                        onPress={() => setTransactionType('Rent')}
                    >
                        <Text style={[styles.filterText, transactionType === 'Rent' && styles.filterTextActive]}>
                            Rent
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by Agent name or Location"
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                </View>

                {/* Location Filter */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, location === 'Dubai' && styles.filterButtonActive]}
                        onPress={() => setLocation('Dubai')}
                    >
                        <Text style={[styles.filterText, location === 'Dubai' && styles.filterTextActive]}>
                            Dubai
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, location === 'Abu Dhabi' && styles.filterButtonActive]}
                        onPress={() => setLocation('Abu Dhabi')}
                    >
                        <Text style={[styles.filterText, location === 'Abu Dhabi' && styles.filterTextActive]}>
                            Abu Dhabi
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* TruBroker Section */}
                <View style={styles.truBrokerSection}>
                    <View style={styles.truBrokerBadge}>
                        <Text style={styles.truBrokerText}>TruBroker™</Text>
                    </View>
                    <Text style={styles.truBrokerDescription}>
                        Explore agents with a proven track record of high response rates and authentic listings.
                    </Text>
                </View>

                {/* Agents List */}
                <View style={styles.agentsListContainer}>
                    <FlatList
                        data={filteredAgents}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAgentCard}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#F0F4F8',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: colors.textPrimary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.white,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterButtonActive: {
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        borderColor: colors.primary,
    },
    filterText: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textSecondary,
    },
    filterTextActive: {
        color: colors.primary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
    },
    searchIcon: {
        marginLeft: 8,
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
        fontFamily: 'Poppins_700Bold',
    },
    truBrokerDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
    },
    agentsListContainer: {
        marginTop: 8,
    },
    agentsList: {
        paddingBottom: 20,
    },
    agentCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
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
        color: colors.textSecondary,
        marginBottom: 4,
    },
    languages: {
        fontSize: 13,
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
});

export default FindMyAgentScreen;

