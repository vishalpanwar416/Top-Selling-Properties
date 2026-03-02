import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import homeInteriorsData from '../data/homeInteriors.json';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2 - 6;

const { categories, packages, gallery, benefits } = homeInteriorsData;

const HomeInteriorScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const handleEnquire = () => {
        Linking.openURL('tel:+918549988888').catch(() => {});
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Home Interiors</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Ionicons name="color-palette" size={44} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.heroTitle}>Design your dream home</Text>
                    <Text style={styles.heroSubtitle}>End-to-end interior solutions with trusted partners</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rooms we design</Text>
                    <View style={styles.categoryGrid}>
                        {categories.map((cat) => (
                            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.9}>
                                <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="cover" />
                                <View style={styles.categoryOverlay} />
                                <Ionicons name={cat.icon} size={28} color={colors.white} style={styles.categoryIcon} />
                                <Text style={styles.categoryName}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Packages</Text>
                    {packages.map((pkg) => (
                        <TouchableOpacity key={pkg.id} style={styles.packageCard} activeOpacity={0.85}>
                            <View style={styles.packageHeader}>
                                <Text style={styles.packageName}>{pkg.name}</Text>
                                {pkg.tag ? (
                                    <View style={styles.packageTag}>
                                        <Text style={styles.packageTagText}>{pkg.tag}</Text>
                                    </View>
                                ) : null}
                            </View>
                            <Text style={styles.packagePrice}>{pkg.price}</Text>
                            <Text style={styles.packageDesc}>{pkg.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our work</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryContent}>
                        {gallery.map((item) => (
                            <Image key={item.id} source={{ uri: item.url }} style={styles.galleryImage} resizeMode="cover" />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Credai Interiors?</Text>
                    {benefits.map((text, i) => (
                        <View key={i} style={styles.benefitRow}>
                            <Ionicons name="checkmark-circle" size={22} color={colors.logoGreen} />
                            <Text style={styles.benefitText}>{text}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.enquireBtn} onPress={handleEnquire} activeOpacity={0.9}>
                    <View style={styles.enquireBtnInner}>
                        <Ionicons name="chatbubble-ellipses" size={20} color={colors.white} />
                        <Text style={styles.enquireBtnText}>Enquire now</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    placeholder: { width: 32 },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 24 },
    hero: {
        margin: 16,
        padding: 22,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: colors.logoGreen,
    },
    heroTitle: { fontSize: 20, fontWeight: '700', color: colors.white, marginTop: 10 },
    heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 6, textAlign: 'center' },
    section: { paddingHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryCard: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 0.85,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        position: 'relative',
    },
    categoryImage: { width: '100%', height: '100%' },
    categoryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    categoryIcon: { position: 'absolute', top: 12, left: 12 },
    categoryName: { position: 'absolute', bottom: 12, left: 12, right: 12, fontSize: 14, fontWeight: '700', color: colors.white },
    packageCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    packageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    packageName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
    packageTag: { backgroundColor: colors.logoGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    packageTagText: { fontSize: 11, fontWeight: '700', color: colors.white },
    packagePrice: { fontSize: 18, fontWeight: '800', color: colors.logoGreen, marginTop: 4 },
    packageDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    galleryContent: { paddingRight: 16, gap: 12 },
    galleryImage: { width: width * 0.7, height: 180, borderRadius: 12, marginRight: 12 },
    benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    benefitText: { fontSize: 15, color: colors.textPrimary, marginLeft: 10, flex: 1 },
    enquireBtn: { marginHorizontal: 16, marginTop: 28, borderRadius: 12, backgroundColor: colors.logoGreen },
    enquireBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    enquireBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
});

export default HomeInteriorScreen;
