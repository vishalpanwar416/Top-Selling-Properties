import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Linking,
    Animated,
    Platform,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

const { width, height } = Dimensions.get('window');
const PHOTO_HEIGHT = width * 0.75;
const INITIAL_SHEET_POSITION = height * 0.70;

const PropertyDetails = ({ route, navigation }) => {
    const { property } = route.params || {};
    const insets = useSafeAreaInsets();
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isPhotoScrolling, setIsPhotoScrolling] = useState(false);
    const [isContentScrolling, setIsContentScrolling] = useState(false);
    const [contentScrollPosition, setContentScrollPosition] = useState(0);
    const [isInPhotoArea, setIsInPhotoArea] = useState(true);
    const photoScrollRef = useRef(null);
    const contentScrollRef = useRef(null);
    const contentScrollY = useRef(new Animated.Value(0)).current;

    if (!property) {
        return (
            <View style={styles.container}>
                <Text>Property not found</Text>
            </View>
        );
    }

    const images = property.images && property.images.length > 0 
        ? property.images 
        : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
            'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        ];

    const formatPrice = (price) => {
        return `AED  ${price?.toLocaleString() || 'N/A'}`;
    };

    const handleCall = () => {
        const phone = property.agent?.phone || '+971500000000';
        Linking.openURL(`tel:${phone}`);
    };

    const handleEmail = () => {
        const email = property.agent?.email || 'info@property.ae';
        Linking.openURL(`mailto:${email}?subject=Inquiry about ${property.title}`);
    };

    const handleWhatsApp = () => {
        const phone = property.agent?.phone || '+971500000000';
        const message = `Hi, I'm interested in ${property.title}`;
        Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`);
    };

    const handleShare = () => {
        // Share functionality
    };

    // Property info data
    const propertyInfo = [
        { label: 'Type', value: property.type || 'Apartment' },
        { label: 'Purpose', value: property.purpose || 'For Sale' },
        { label: 'Reference No.', value: property.referenceNo || `TS-${property.id}` },
        { label: 'Completion', value: property.completion || 'Ready' },
        { label: 'Furnishing', value: property.furnishing || 'Unfurnished' },
        { label: 'Added on', value: property.addedOn || '20th December, 2025' },
    ];

    // Building info data
    const buildingInfo = [
        { label: 'Building Name', value: property.buildingName || property.title?.split(' ')[0] || 'N/A' },
        { label: 'Floors', value: property.floors || '25' },
        { label: 'Parking Spaces', value: property.parking || '2' },
        { label: 'Building Area', value: `${property.buildingArea?.toLocaleString() || '100,000'} sqft` },
        { label: 'Elevators', value: property.elevators || '4' },
    ];

    // Amenities with icons
    const amenitiesWithIcons = [
        { name: 'Centrally Air-Conditioned', icon: 'snow-outline' },
        { name: 'Balcony or Terrace', icon: 'business-outline' },
        { name: 'Elevators in Building', icon: 'arrow-up-outline' },
        { name: 'Gym or Health Club', icon: 'fitness-outline' },
        { name: 'Swimming Pool', icon: 'water-outline' },
        { name: 'Shared Kitchen', icon: 'restaurant-outline' },
        { name: 'Laundry Room', icon: 'shirt-outline' },
        { name: 'Maids Room', icon: 'home-outline' },
    ];

    const displayAmenities = property.amenities?.length > 0
        ? property.amenities.map((a, i) => ({ name: a, icon: amenitiesWithIcons[i % amenitiesWithIcons.length].icon }))
        : amenitiesWithIcons;

    // Calculate total photos height
    const totalPhotosHeight = images.length * PHOTO_HEIGHT;

    // Handle photo scroll begin - disable content scrolling
    const handlePhotoScrollBegin = () => {
        setIsPhotoScrolling(true);
        if (contentScrollRef.current) {
            contentScrollRef.current.setNativeProps({ scrollEnabled: false });
        }
    };

    // Handle photo scroll end - enable content scrolling
    const handlePhotoScrollEnd = () => {
        setIsPhotoScrolling(false);
        if (contentScrollRef.current) {
            contentScrollRef.current.setNativeProps({ scrollEnabled: true });
        }
    };

    // Handle content scroll begin - disable photo scrolling
    const handleContentScrollBegin = () => {
        setIsContentScrolling(true);
        if (photoScrollRef.current) {
            photoScrollRef.current.setNativeProps({ scrollEnabled: false });
        }
    };

    // Handle content scroll end - enable photo scrolling
    const handleContentScrollEnd = () => {
        setIsContentScrolling(false);
        if (photoScrollRef.current) {
            photoScrollRef.current.setNativeProps({ scrollEnabled: true });
        }
    };

    // Handle content scroll - update animated value and track position
    const handleContentScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        contentScrollY.setValue(offsetY);
        setContentScrollPosition(offsetY);
        // Update whether we're in photo area
        setIsInPhotoArea(offsetY < INITIAL_SHEET_POSITION - 10);
    };

    // Combined scroll handler for Animated.event
    const onContentScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: contentScrollY } } }],
        { 
            useNativeDriver: true,
            listener: handleContentScroll
        }
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Photos - Full screen scrollable */}
            <View style={styles.photosBackground}>
                <ScrollView
                    ref={photoScrollRef}
                    showsVerticalScrollIndicator={true}
                    style={styles.photosScrollView}
                    contentContainerStyle={styles.photosContentContainer}
                    scrollEnabled={!isContentScrolling}
                    nestedScrollEnabled={true}
                    indicatorStyle="white"
                    scrollEventThrottle={16}
                    onScrollBeginDrag={handlePhotoScrollBegin}
                    onScrollEndDrag={handlePhotoScrollEnd}
                    onMomentumScrollBegin={handlePhotoScrollBegin}
                    onMomentumScrollEnd={handlePhotoScrollEnd}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.photoWrapper}>
                            <Image
                                source={{ uri: image }}
                                style={styles.photo}
                                resizeMode="cover"
                            />
                            {/* Photo counter badge */}
                            <View style={styles.photoCounterBadge}>
                                <Ionicons name="images-outline" size={14} color={colors.white} />
                                <Text style={styles.photoCounterText}>{index + 1} / {images.length}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                
                {/* Scroll hint indicator */}
                <View style={styles.scrollHintContainer}>
                    <View style={styles.scrollHint}>
                        <Ionicons name="chevron-down" size={16} color={colors.white} />
                        <Text style={styles.scrollHintText}>Scroll for more photos</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.white} />
                    </View>
                </View>
            </View>

            {/* Content Sheet Overlay - Always on top, full screen coverage */}
            <View style={styles.contentWrapper} pointerEvents="box-none">
                <Animated.ScrollView
                    ref={contentScrollRef}
                    style={styles.contentScrollView}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    scrollEnabled={!isPhotoScrolling}
                    onScroll={onContentScroll}
                    onScrollBeginDrag={handleContentScrollBegin}
                    onScrollEndDrag={handleContentScrollEnd}
                    onMomentumScrollBegin={handleContentScrollBegin}
                    onMomentumScrollEnd={handleContentScrollEnd}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.contentScrollContainer}
                >
                {/* Transparent spacer - shows photos behind initially, allows content to scroll over photos */}
                <View 
                    style={[styles.photosSpacer, { height: INITIAL_SHEET_POSITION }]} 
                    pointerEvents="none" 
                />
                
                {/* Content Sheet - white overlay on top, captures touches only in this area */}
                <View style={styles.contentSheet} pointerEvents="auto">
                    {/* Drag Handle */}
                    <View style={styles.dragHandle} />

                    {/* Price Row */}
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{formatPrice(property.price)}</Text>
                        <View style={styles.truCheckBadge}>
                            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                            <Text style={styles.truCheckText}>TruCheck™</Text>
                        </View>
                    </View>

                    {/* Property Specs */}
                    <View style={styles.specsRow}>
                        <View style={styles.specItem}>
                            <MaterialCommunityIcons name="bed-outline" size={18} color={colors.textSecondary} />
                            <Text style={styles.specText}>{property.bedrooms || 'Studio'} Beds</Text>
                        </View>
                        <View style={styles.specItem}>
                            <MaterialCommunityIcons name="shower" size={18} color={colors.textSecondary} />
                            <Text style={styles.specText}>{property.bathrooms || '1'} Baths</Text>
                        </View>
                        <View style={styles.specItem}>
                            <MaterialCommunityIcons name="vector-square" size={18} color={colors.textSecondary} />
                            <Text style={styles.specText}>{property.area?.toLocaleString() || 'N/A'} {property.areaUnit || 'sqft'}</Text>
                        </View>
                    </View>

                    {/* Location */}
                    <Text style={styles.locationText}>{property.location}</Text>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Action Buttons Row */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.actionsScrollView}
                        contentContainerStyle={styles.actionsContainer}
                    >
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Similar Transactions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="play-circle-outline" size={18} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Request Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="trending-up-outline" size={18} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Price Trends</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Description Section */}
                    <View style={styles.section}>
                        <Text style={styles.descriptionTitle}>{property.title?.toUpperCase() || 'LUXURY PROPERTY'}</Text>
                        <Text
                            style={styles.description}
                            numberOfLines={showFullDescription ? undefined : 4}
                        >
                            {property.description || 'This is a luxurious property located in the heart of the city. The property offers a unique blend of luxury, location, and investment potential. The residences are designed with modern architecture and premium finishes.'}
                        </Text>
                        <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                            <Text style={styles.readMoreText}>
                                {showFullDescription ? 'Read less' : 'Read more'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Property Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Property Information</Text>
                        <View style={styles.infoTable}>
                            {propertyInfo.map((item, index) => (
                                <View key={index} style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>{item.label}</Text>
                                    <Text style={styles.infoValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Building Information */}
                    <View style={styles.section}>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>Building Information</Text>
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                            </View>
                        </View>
                        <View style={styles.infoTable}>
                            {buildingInfo.map((item, index) => (
                                <View key={index} style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>{item.label}</Text>
                                    <Text style={styles.infoValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Features & Amenities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Features & Amenities</Text>
                        <View style={styles.amenitiesGrid}>
                            {displayAmenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityItem}>
                                    <Ionicons name={amenity.icon} size={20} color={colors.textSecondary} />
                                    <Text style={styles.amenityText}>{amenity.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Average Price Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Average Price/sqft</Text>
                        <Text style={styles.sectionSubtitle}>
                            for other {property.bedrooms || '2'} beds apartments in {property.location?.split(',')[0] || 'Dubai'}
                        </Text>
                        <View style={styles.chartContainer}>
                            <View style={styles.chartYAxis}>
                                <Text style={styles.chartLabel}>AED 5173</Text>
                                <Text style={styles.chartLabel}>AED 3879</Text>
                                <Text style={styles.chartLabel}>AED 2586</Text>
                                <Text style={styles.chartLabel}>AED 1293</Text>
                                <Text style={styles.chartLabel}>AED 0</Text>
                            </View>
                            <View style={styles.chartBars}>
                                <View style={styles.chartBarWrapper}>
                                    <View style={[styles.chartBar, { height: 120, backgroundColor: colors.primary }]} />
                                    <Text style={styles.chartBarLabel}>Avg.price/sqft</Text>
                                </View>
                                <View style={styles.chartBarWrapper}>
                                    <View style={[styles.chartBar, { height: 150, backgroundColor: colors.maroon }]} />
                                    <Text style={styles.chartBarLabel}>Asking price*</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.chartDisclaimer}>
                            *These trends are calculated using a proprietary algorithm based on prices advertised.
                        </Text>
                    </View>

                    {/* Popular Locations */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Popular Locations**</Text>
                        <Text style={styles.sectionSubtitle}>
                            with {property.bedrooms || '3'} beds apartments in {property.location?.split(',')[0] || 'Downtown Dubai'}
                        </Text>
                        <View style={styles.popularTable}>
                            <View style={styles.popularHeader}>
                                <Text style={[styles.popularHeaderText, { flex: 2 }]}></Text>
                                <Text style={styles.popularHeaderText}>Avg.price/sqft</Text>
                                <Text style={styles.popularHeaderText}>VS Q3 2025</Text>
                            </View>
                            {[
                                { rank: 1, name: 'The Address Residence...', price: '4600', change: '-5.6%', isDown: true },
                                { rank: 2, name: 'Opera District', price: '4200', change: '5.9%', isDown: false },
                                { rank: 3, name: 'The Address Residence...', price: '5200', change: '-2.3%', isDown: true },
                            ].map((item, index) => (
                                <View key={index} style={styles.popularRow}>
                                    <View style={styles.popularRankName}>
                                        <Text style={styles.popularRank}>{item.rank}</Text>
                                        <Text style={styles.popularName}>{item.name}</Text>
                                    </View>
                                    <Text style={styles.popularPrice}>{item.price}</Text>
                                    <View style={styles.popularChangeWrapper}>
                                        <Ionicons
                                            name={item.isDown ? 'caret-down' : 'caret-up'}
                                            size={12}
                                            color={item.isDown ? '#E53935' : '#48BB78'}
                                        />
                                        <Text style={[styles.popularChange, { color: item.isDown ? '#E53935' : '#48BB78' }]}>
                                            {item.change}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.chartDisclaimer}>
                            **Popularity is based on searches conducted by users over the last quarter.
                        </Text>
                    </View>

                    {/* Area Guide */}
                    <TouchableOpacity style={styles.areaGuideButton}>
                        <Image
                            source={{ uri: images[0] }}
                            style={styles.areaGuideImage}
                        />
                        <View style={styles.areaGuideContent}>
                            <Text style={styles.areaGuideLabel}>AREA GUIDE</Text>
                            <Text style={styles.areaGuideName}>{property.location?.split(',')[0] || 'Downtown Dubai'}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Regulatory Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Regulatory Information</Text>
                        <View style={styles.infoTable}>
                            {[
                                { label: 'Trakheesi Permit', value: property.permit || '71635604642', hasInfo: true },
                                { label: 'Zone Name', value: property.zone || 'Business Bay', hasInfo: true },
                                { label: 'Registered Agency', value: property.agency || 'TOP SELLING PROPERTIES', hasInfo: true },
                                { label: 'RERA', value: property.rera || '1858', hasInfo: true },
                                { label: 'BRN', value: property.brn || '69449', hasInfo: true },
                            ].map((item, index) => (
                                <View key={index} style={styles.infoRow}>
                                    <View style={styles.infoLabelRow}>
                                        <Text style={styles.infoLabel}>{item.label}</Text>
                                        {item.hasInfo && (
                                            <Ionicons name="information-circle-outline" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                                        )}
                                    </View>
                                    <Text style={styles.infoValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Agent Card */}
                    {property.agent && (
                        <View style={styles.agentSection}>
                            <LinearGradient
                                colors={[colors.maroon, colors.primary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.agentCard}
                            >
                                <View style={styles.agentImageWrapper}>
                                    <Image
                                        source={{ uri: property.agent.image || 'https://via.placeholder.com/100' }}
                                        style={styles.agentImage}
                                    />
                                </View>
                                <View style={styles.agentInfo}>
                                    <Text style={styles.agentBadge}>TruBroker™</Text>
                                    <Text style={styles.agentName}>{property.agent.name || 'Agent'}</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Bottom Spacing for fixed action buttons */}
                    <View style={{ height: 100 }} />
                </View>
            </Animated.ScrollView>
            
            {/* Touch interceptor for photo area - only blocks when scroll is at top (in photo area) */}
            {isInPhotoArea && contentScrollPosition < 10 && (
                <View 
                    style={[styles.photoTouchArea, { height: INITIAL_SHEET_POSITION }]} 
                    pointerEvents="box-none"
                />
            )}
            </View>

            {/* Floating Header Buttons */}
            <View style={[styles.floatingHeader, { top: insets.top + 10 }]}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerRightButtons}>
                    <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={22}
                            color={isFavorite ? '#FF4757' : colors.textPrimary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity style={styles.bottomButton} onPress={handleEmail}>
                    <Ionicons name="mail-outline" size={20} color={colors.primary} />
                    <Text style={styles.bottomButtonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={handleCall}>
                    <Ionicons name="call-outline" size={20} color={colors.primary} />
                    <Text style={styles.bottomButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButtonWhatsApp} onPress={handleWhatsApp}>
                    <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    photosBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: height,
        zIndex: 1,
    },
    photosScrollView: {
        flex: 1,
    },
    photosContentContainer: {
        paddingBottom: 20,
    },
    photoWrapper: {
        width: width,
        height: PHOTO_HEIGHT,
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoCounterBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    photoCounterText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    scrollHintContainer: {
        position: 'absolute',
        bottom: height - INITIAL_SHEET_POSITION + 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5,
    },
    scrollHint: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    scrollHintText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '500',
        marginHorizontal: 6,
    },
    contentWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    contentScrollView: {
        flex: 1,
    },
    contentScrollContainer: {
        flexGrow: 1,
    },
    photosSpacer: {
        backgroundColor: 'transparent',
    },
    photoTouchArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 12,
        backgroundColor: 'transparent',
    },
    contentSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        minHeight: height,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#D0D0D0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    price: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    truCheckBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    truCheckText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    specsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    specText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 6,
    },
    locationText: {
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 16,
    },
    actionsScrollView: {
        marginBottom: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.06)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(185, 28, 28, 0.2)',
    },
    actionButtonText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 6,
    },
    section: {
        marginBottom: 28,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.textSecondary,
    },
    readMoreText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    verifiedBadge: {
        marginLeft: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: -12,
        marginBottom: 16,
    },
    infoTable: {
        backgroundColor: colors.white,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 15,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
        maxWidth: '55%',
        textAlign: 'right',
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    amenityItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    amenityText: {
        fontSize: 14,
        color: colors.textPrimary,
        marginLeft: 10,
        flex: 1,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 200,
        marginVertical: 16,
    },
    chartYAxis: {
        justifyContent: 'space-between',
        height: '100%',
        marginRight: 10,
    },
    chartLabel: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    chartBars: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    chartBarWrapper: {
        alignItems: 'center',
    },
    chartBar: {
        width: 50,
        borderRadius: 4,
        marginBottom: 8,
    },
    chartBarLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    chartDisclaimer: {
        fontSize: 12,
        color: colors.textTertiary,
        fontStyle: 'italic',
        marginTop: 8,
    },
    popularTable: {
        marginTop: 8,
    },
    popularHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    popularHeaderText: {
        flex: 1,
        fontSize: 12,
        color: colors.textTertiary,
        textAlign: 'center',
    },
    popularRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    popularRankName: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    popularRank: {
        fontSize: 14,
        color: colors.textSecondary,
        width: 24,
    },
    popularName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
    },
    popularPrice: {
        flex: 1,
        fontSize: 14,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    popularChangeWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    popularChange: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4,
    },
    areaGuideButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 28,
    },
    areaGuideImage: {
        width: 60,
        height: 50,
        borderRadius: 8,
    },
    areaGuideContent: {
        flex: 1,
        marginLeft: 14,
    },
    areaGuideLabel: {
        fontSize: 11,
        color: colors.textTertiary,
        marginBottom: 2,
    },
    areaGuideName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    agentSection: {
        marginBottom: 20,
    },
    agentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 20,
        overflow: 'hidden',
    },
    agentImageWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    agentImage: {
        width: '100%',
        height: '100%',
    },
    agentInfo: {
        flex: 1,
        marginLeft: 16,
    },
    agentBadge: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
    },
    agentName: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    floatingHeader: {
        position: 'absolute',
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 100,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    headerRightButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 100,
    },
    bottomButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(185, 28, 28, 0.08)',
        paddingVertical: 14,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    bottomButtonText: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    bottomButtonWhatsApp: {
        width: 56,
        height: 52,
        borderRadius: 12,
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25D366',
    },
});

export default PropertyDetails;
