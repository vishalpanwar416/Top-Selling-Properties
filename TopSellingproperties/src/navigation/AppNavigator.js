import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PropertyDetails from '../screens/PropertyDetails';
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import SearchScreen from '../screens/SearchScreen';
import Sidebar from '../components/Sidebar';
import colors from '../theme/colors';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
            }}
        >
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen 
                name="Search" 
                component={SearchScreen}
                options={{
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    gestureEnabled: true,
                    animation: 'slide_from_bottom',
                    animationDuration: 300,
                }}
            />
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <Sidebar {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        width: 280,
                    },
                    drawerType: 'front',
                    overlayColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <Drawer.Screen name="Home" component={HomeStack} />
                <Drawer.Screen name="Favorites" component={FavoritesScreen} />
                <Drawer.Screen name="Contact" component={ContactScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
