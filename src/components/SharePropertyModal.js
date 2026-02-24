import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Share,
    Platform,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import contentData from '../data/content.json';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = Math.min(width - 48, 400);

const getShareConfig = () => ({
    appName: contentData?.share?.appName || 'Credai',
    website: contentData?.share?.website || 'https://credai.in',
    contactPhone: contentData?.share?.contactPhone || '+91 85499 88888',
    contactWhatsApp: contentData?.share?.contactWhatsApp || '+91 98454 00535',
    contactEmail: contentData?.share?.contactEmail || 'info@credai.in',
    appStoreUrl: contentData?.share?.appStoreUrl || 'https://apps.apple.com/app/credai',
    playStoreUrl: contentData?.share?.playStoreUrl || 'https://play.google.com/store/apps/details?id=com.anonymous.TopSellingProperties',
});

export const getPropertyDeepLink = (propertyId) => `credai://property/${propertyId || ''}`;

export const getPropertyShareMessage = (property, includeLinks = true) => {
    const config = getShareConfig();
    const deepLink = getPropertyDeepLink(property?.id);
    const storeUrl = Platform.OS === 'ios' ? config.appStoreUrl : config.playStoreUrl;
    const title = property?.title || property?.name || 'Property';
    const price = property?.price ? `₹ ${(property.price / 100000).toFixed(1)} L` : '';
    let message = `Check out this property: ${title}${price ? ` - ${price}` : ''}\n\n`;
    if (includeLinks) {
        message += `Open in Credai app: ${deepLink}\n`;
        message += `Download the app: ${storeUrl}`;
    }
    return message;
};

const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} L`;
    return `₹ ${(price / 100000).toFixed(0)} L`;
};

const SharePropertyModal = ({ visible, onClose, property }) => {
    const posterRef = useRef(null);
    const [sharing, setSharing] = useState(false);
    const config = getShareConfig();

    if (!property) return null;

    const images = property.images?.length ? property.images : ['https://via.placeholder.com/400x300'];
    const imageUri = images[0];
    const priceStr = property.priceRange || (property.price ? formatPrice(property.price) : 'Price on Request');
    const configLabel = property.bedrooms ? `${property.bedrooms} BR` : (property.bedroomRange || '—');
    const status = property.status || property.completion || '—';
    const handover = property.handover || '—';
    const projectId = property.id || property.referenceNo || '—';
    const rera = property.rera || '—';

    const shareMessage = getPropertyShareMessage(property);
    const deepLink = getPropertyDeepLink(property.id);

    const handleSharePoster = async () => {
        setSharing(true);
        try {
            await Share.share({
                message: shareMessage,
                title: `Share: ${property.title || property.name || 'Property'}`,
                url: Platform.OS === 'ios' ? deepLink : undefined,
            });
        } catch (e) {
            if (e.message?.includes('cancel')) return;
            Alert.alert('Error', 'Could not share.');
        }
        setSharing(false);
    };

    const handleCopyLink = async () => {
        try {
            const Clipboard = require('expo-clipboard').default;
            if (Clipboard?.setStringAsync) {
                await Clipboard.setStringAsync(shareMessage);
                Alert.alert('Copied', 'Link and message copied to clipboard.');
                return;
            }
        } catch (_) {}
        Share.share({ message: shareMessage, title: 'Copy link' });
    };

    const handleDownload = () => {
        Alert.alert(
            'Download poster',
            'Share the property and save the image from the share menu, or install the latest app update for direct download.',
            [{ text: 'OK' }]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Share Property</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                            <Ionicons name="close" size={26} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View ref={posterRef} collapsable={false} style={[styles.poster, { width: POSTER_WIDTH }]}>
                            <View style={styles.posterImageWrap}>
                                <Image source={{ uri: imageUri }} style={styles.posterImage} resizeMode="cover" />
                                <View style={styles.posterImageOverlay} />
                                <Text style={styles.posterBrand}>{config.appName}</Text>
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color={colors.white} />
                                    <Text style={styles.verifiedText}>VERIFIED</Text>
                                </View>
                                {rera !== '—' && <Text style={styles.reraId} numberOfLines={1}>{rera}</Text>}
                            </View>
                            <View style={styles.posterBody}>
                                <Text style={styles.posterTitle} numberOfLines={1}>{property.title || property.name || 'Property'}</Text>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={12} color={colors.primary} />
                                    <Text style={styles.locationText} numberOfLines={2}>{property.location || property.address || '—'}</Text>
                                </View>
                                <View style={styles.specsRow}>
                                    <Text style={styles.specItem}><Text style={styles.specLabel}>CONFIG: </Text>{configLabel}</Text>
                                    <Text style={styles.specItem}><Text style={styles.specLabel}>STATUS: </Text>{status}</Text>
                                    <Text style={styles.specItem}><Text style={styles.specLabel}>HANDOVER: </Text>{handover}</Text>
                                    <Text style={styles.specItem}><Text style={styles.specLabel}>PROJECT ID: </Text>{projectId}</Text>
                                </View>
                                <View style={styles.qrPlaceholder}>
                                    <View style={styles.qrBox}><Text style={styles.qrText}>QR</Text></View>
                                    <Text style={styles.scanText}>SCAN TO VIEW</Text>
                                </View>
                                <Text style={styles.posterPrice}>{priceStr}</Text>
                                <View style={styles.contactSection}>
                                    <Text style={styles.contactHeading}>CONTACT</Text>
                                    <Text style={styles.contactBrand}>{config.appName}</Text>
                                    <Text style={styles.contactLine}>Call: {config.contactPhone}</Text>
                                    <Text style={styles.contactLine}>WhatsApp: {config.contactWhatsApp}</Text>
                                    <Text style={styles.contactLine}>{config.website}</Text>
                                    <Text style={styles.contactLine}>{config.contactEmail}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleSharePoster} disabled={sharing}>
                            <Ionicons name="share-social" size={20} color={colors.white} />
                            <Text style={styles.primaryButtonText}>Share poster with details</Text>
                        </TouchableOpacity>
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn} onPress={handleSharePoster}>
                                <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
                                <Text style={styles.socialLabel}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn} onPress={handleSharePoster}>
                                <Ionicons name="mail" size={26} color={colors.textSecondary} />
                                <Text style={styles.socialLabel}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn} onPress={handleCopyLink}>
                                <Ionicons name="link" size={26} color={colors.textSecondary} />
                                <Text style={styles.socialLabel}>Copy link</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleDownload}>
                            <Ionicons name="download-outline" size={20} color={colors.primary} />
                            <Text style={styles.secondaryButtonText}>Download</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '92%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    closeBtn: {
        padding: 4,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    poster: {
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    posterImageWrap: {
        height: 180,
        position: 'relative',
    },
    posterImage: {
        width: '100%',
        height: '100%',
    },
    posterImageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    posterBrand: {
        position: 'absolute',
        top: 12,
        right: 12,
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 36,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
    },
    reraId: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        fontSize: 9,
        color: 'rgba(255,255,255,0.9)',
    },
    posterBody: {
        padding: 14,
    },
    posterTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    locationText: {
        fontSize: 11,
        color: colors.textSecondary,
        marginLeft: 4,
        flex: 1,
    },
    specsRow: {
        marginBottom: 10,
    },
    specItem: {
        fontSize: 10,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    specLabel: {
        fontWeight: '700',
        color: colors.textPrimary,
    },
    qrPlaceholder: {
        alignItems: 'center',
        marginVertical: 10,
    },
    qrBox: {
        width: 56,
        height: 56,
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    scanText: {
        fontSize: 9,
        color: colors.textSecondary,
        marginTop: 4,
    },
    posterPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.primary,
        marginBottom: 12,
    },
    contactSection: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
    },
    contactHeading: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textSecondary,
        marginBottom: 4,
    },
    contactBrand: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 4,
    },
    contactLine: {
        fontSize: 10,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 20,
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginTop: 16,
    },
    socialBtn: {
        alignItems: 'center',
    },
    socialLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 4,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 12,
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
    },
});

export default SharePropertyModal;
