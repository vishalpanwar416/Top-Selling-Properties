import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    StatusBar,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewer = ({ visible, stories, initialIndex = 0, onClose }) => {
    const insets = useSafeAreaInsets();
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progressInterval = useRef(null);

    const currentStory = stories[currentStoryIndex];
    const currentMedia = currentStory?.media?.[currentMediaIndex];

    useEffect(() => {
        if (visible && currentMedia) {
            startProgress();
        } else {
            stopProgress();
        }
        return () => stopProgress();
    }, [visible, currentStoryIndex, currentMediaIndex]);

    const startProgress = () => {
        progressAnim.setValue(0);
        progressInterval.current = Animated.timing(progressAnim, {
            toValue: 1,
            duration: STORY_DURATION,
            useNativeDriver: false,
        });
        progressInterval.current.start(({ finished }) => {
            if (finished) {
                handleNext();
            }
        });
    };

    const stopProgress = () => {
        if (progressInterval.current) {
            progressInterval.current.stop();
        }
        progressAnim.setValue(0);
    };

    const handleNext = () => {
        if (currentMediaIndex < currentStory.media.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        } else if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            setCurrentMediaIndex(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        } else if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
            const prevStory = stories[currentStoryIndex - 1];
            setCurrentMediaIndex(prevStory.media.length - 1);
        }
    };

    const handleStoryPress = (index) => {
        setCurrentStoryIndex(index);
        setCurrentMediaIndex(0);
    };

    if (!visible || !currentStory || !currentMedia) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                {/* Story Image/Video */}
                <Image
                    source={{ uri: currentMedia.url }}
                    style={styles.storyImage}
                    resizeMode="cover"
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.gradientOverlay}
                />

                {/* Progress Bars */}
                <View style={[styles.progressContainer, { top: insets.top + 8 }]}>
                    {currentStory.media.map((_, index) => (
                        <View key={index} style={styles.progressBarContainer}>
                            <View style={styles.progressBarBackground} />
                            {index === currentMediaIndex && (
                                <Animated.View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: progressAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', '100%'],
                                            }),
                                        },
                                    ]}
                                />
                            )}
                            {index < currentMediaIndex && (
                                <View style={[styles.progressBarFill, { width: '100%' }]} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Header */}
                <View style={[styles.header, { top: insets.top + 50 }]}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={{ uri: currentStory.avatar }}
                            style={styles.headerAvatar}
                        />
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerName}>{currentStory.name}</Text>
                            <Text style={styles.headerTime}>{currentStory.time}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Story Navigation - Tap left for prev, right for next */}
                <View style={styles.navigationContainer}>
                    <TouchableOpacity
                        style={[styles.navArea, { left: 0 }]}
                        onPress={handlePrev}
                        activeOpacity={1}
                    />
                    <TouchableOpacity
                        style={[styles.navArea, { right: 0 }]}
                        onPress={handleNext}
                        activeOpacity={1}
                    />
                </View>

                {/* Story List at Bottom */}
                <View style={[styles.storyList, { bottom: insets.bottom + 20 }]}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.storyListContent}
                    >
                        {stories.map((story, index) => (
                            <TouchableOpacity
                                key={story.id}
                                style={[
                                    styles.storyThumbnail,
                                    currentStoryIndex === index && styles.activeStoryThumbnail,
                                ]}
                                onPress={() => handleStoryPress(index)}
                            >
                                <Image
                                    source={{ uri: story.avatar }}
                                    style={styles.storyThumbnailImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Media Counter */}
                <View style={[styles.mediaCounter, { bottom: insets.bottom + 80 }]}>
                    <Text style={styles.mediaCounterText}>
                        {currentMediaIndex + 1} / {currentStory.media.length}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    storyImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: 'absolute',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    progressContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 8,
        gap: 4,
        zIndex: 10,
    },
    progressBarContainer: {
        flex: 1,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.white,
        borderRadius: 2,
    },
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.white,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 15,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
    },
    headerTime: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        zIndex: 5,
    },
    navArea: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
    storyList: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
    },
    storyListContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    storyThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    activeStoryThumbnail: {
        borderColor: colors.white,
    },
    storyThumbnailImage: {
        width: '100%',
        height: '100%',
    },
    mediaCounter: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        zIndex: 10,
    },
    mediaCounterText: {
        fontSize: 12,
        fontFamily: 'Lato_400Regular',
        color: colors.white,
    },
});

export default StoryViewer;

