import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    FlatList,
    StatusBar,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

const { width, height } = Dimensions.get('window');
const GALLERY_HEIGHT = width * 0.65;
const MAIN_IMAGE_WIDTH = width * 0.58;
const THUMBNAIL_GAP = 4;
const THUMBNAIL_WIDTH = (width - MAIN_IMAGE_WIDTH - THUMBNAIL_GAP * 3) / 2;
const THUMBNAIL_HEIGHT = (GALLERY_HEIGHT - THUMBNAIL_GAP) / 2;

const PhotoGalleryGrid = ({ images = [], onViewAll }) => {
    const insets = useSafeAreaInsets();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Ensure we have at least some images
    const galleryImages = images.length > 0
        ? images
        : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
            'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
        ];

    const mainImage = galleryImages[0];
    const thumbnails = galleryImages.slice(1, 5);
    const remainingCount = Math.max(0, galleryImages.length - 5);
    const totalPhotos = galleryImages.length;

    const openGallery = (index = 0) => {
        setCurrentIndex(index);
        setModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const closeGallery = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
        });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderFullScreenImage = ({ item, index }) => (
        <View style={styles.fullScreenImageContainer}>
            <Image
                source={{ uri: item }}
                style={styles.fullScreenImage}
                resizeMode="contain"
            />
        </View>
    );

    const goToImage = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index, animated: true });
        }
    };

    return (
        <View style={styles.container}>
            {/* Gallery Grid */}
            <View style={styles.galleryGrid}>
                {/* Main Large Image - Left Side */}
                <TouchableOpacity
                    style={styles.mainImageContainer}
                    onPress={() => openGallery(0)}
                    activeOpacity={0.95}
                >
                    <Image
                        source={{ uri: mainImage }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </TouchableOpacity>

                {/* Right Side - 2x2 Thumbnail Grid */}
                <View style={styles.thumbnailGrid}>
                    {/* Top Row */}
                    <View style={styles.thumbnailRow}>
                        {thumbnails[0] && (
                            <TouchableOpacity
                                style={styles.thumbnailContainer}
                                onPress={() => openGallery(1)}
                                activeOpacity={0.95}
                            >
                                <Image
                                    source={{ uri: thumbnails[0] }}
                                    style={styles.thumbnail}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                        {thumbnails[1] && (
                            <TouchableOpacity
                                style={styles.thumbnailContainer}
                                onPress={() => openGallery(2)}
                                activeOpacity={0.95}
                            >
                                <Image
                                    source={{ uri: thumbnails[1] }}
                                    style={styles.thumbnail}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Bottom Row */}
                    <View style={styles.thumbnailRow}>
                        {thumbnails[2] && (
                            <TouchableOpacity
                                style={styles.thumbnailContainer}
                                onPress={() => openGallery(3)}
                                activeOpacity={0.95}
                            >
                                <Image
                                    source={{ uri: thumbnails[2] }}
                                    style={styles.thumbnail}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                        {/* Last thumbnail with overlay */}
                        {thumbnails[3] ? (
                            <TouchableOpacity
                                style={styles.thumbnailContainer}
                                onPress={() => openGallery(4)}
                                activeOpacity={0.95}
                            >
                                <Image
                                    source={{ uri: thumbnails[3] }}
                                    style={styles.thumbnail}
                                    resizeMode="cover"
                                />
                                {/* Overlay with remaining count */}
                                {remainingCount > 0 && (
                                    <View style={styles.moreOverlay}>
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                                            style={styles.moreGradient}
                                        >
                                            <Text style={styles.moreCount}>+{remainingCount}</Text>
                                            <Text style={styles.moreText}>Property</Text>
                                            <Text style={styles.moreText}>& Guest</Text>
                                            <Text style={styles.moreText}>Photos</Text>
                                        </LinearGradient>
                                    </View>
                                )}
                                {remainingCount === 0 && totalPhotos >= 5 && (
                                    <View style={styles.moreOverlay}>
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
                                            style={styles.moreGradient}
                                        >
                                            <Ionicons name="images-outline" size={24} color={colors.white} />
                                            <Text style={styles.viewAllText}>View All</Text>
                                        </LinearGradient>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.thumbnailPlaceholder} />
                        )}
                    </View>
                </View>
            </View>

            {/* Full Screen Gallery Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="none"
                onRequestClose={closeGallery}
                statusBarTranslucent
            >
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { opacity: fadeAnim }
                    ]}
                >
                    <StatusBar barStyle="light-content" />

                    {/* Header */}
                    <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeGallery}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={28} color={colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.imageCounter}>
                            {currentIndex + 1} / {totalPhotos}
                        </Text>
                        <TouchableOpacity
                            style={styles.shareButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="share-outline" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Full Screen Image Gallery */}
                    <FlatList
                        ref={flatListRef}
                        data={galleryImages}
                        renderItem={renderFullScreenImage}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={currentIndex}
                        getItemLayout={(data, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                    />

                    {/* Thumbnail Strip at Bottom */}
                    <View style={[styles.thumbnailStrip, { paddingBottom: insets.bottom + 10 }]}>
                        <FlatList
                            data={galleryImages}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.stripThumbnail,
                                        currentIndex === index && styles.stripThumbnailActive
                                    ]}
                                    onPress={() => goToImage(index)}
                                >
                                    <Image
                                        source={{ uri: item }}
                                        style={styles.stripThumbnailImage}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => `strip-${index}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.stripContent}
                        />
                    </View>
                </Animated.View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    galleryGrid: {
        flexDirection: 'row',
        height: GALLERY_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    mainImageContainer: {
        width: MAIN_IMAGE_WIDTH,
        height: GALLERY_HEIGHT,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    thumbnailGrid: {
        flex: 1,
        paddingLeft: THUMBNAIL_GAP,
    },
    thumbnailRow: {
        flexDirection: 'row',
        flex: 1,
    },
    thumbnailContainer: {
        flex: 1,
        margin: THUMBNAIL_GAP / 2,
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    },
    thumbnailPlaceholder: {
        flex: 1,
        margin: THUMBNAIL_GAP / 2,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    moreOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 4,
        overflow: 'hidden',
    },
    moreGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    moreCount: {
        fontSize: 22,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        marginBottom: 2,
    },
    moreText: {
        fontSize: 11,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
        lineHeight: 14,
    },
    viewAllText: {
        fontSize: 12,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
        marginTop: 4,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageCounter: {
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
        color: colors.white,
    },
    shareButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenImageContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: width,
        height: height * 0.7,
    },
    thumbnailStrip: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: 12,
    },
    stripContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    stripThumbnail: {
        width: 60,
        height: 45,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        marginRight: 8,
    },
    stripThumbnailActive: {
        borderColor: colors.primary,
    },
    stripThumbnailImage: {
        width: '100%',
        height: '100%',
    },
});

export default PhotoGalleryGrid;
