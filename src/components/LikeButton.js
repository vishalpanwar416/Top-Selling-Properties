import React, { useState, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const LikeButton = ({
    isLiked: initialIsLiked = false,
    onPress,
    size = 18,
    likedColor = '#FF4757',
    unlikedColor = colors.white,
    buttonStyle,
    iconStyle,
    showBackground = true,
    backgroundColor = 'rgba(0,0,0,0.45)',
}) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        // Scale animation with spring effect
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.3,
                    friction: 3,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.7,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Call the onPress callback if provided
        if (onPress) {
            onPress(newLikedState);
        }
    };

    const buttonSize = size + 14; // Button is slightly larger than icon

    return (
        <TouchableOpacity
            style={[
                styles.button,
                showBackground && {
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: buttonSize / 2,
                    backgroundColor: backgroundColor,
                },
                buttonStyle,
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={size}
                    color={isLiked ? likedColor : unlikedColor}
                    style={iconStyle}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LikeButton;


