import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PropertyDetails from '../screens/PropertyDetails';
import FavoritesScreen from '../screens/FavoritesScreen';
import ContactScreen from '../screens/ContactScreen';
import SearchScreen from '../screens/SearchScreen';
import FindMyAgentScreen from '../screens/FindMyAgentScreen';
import PropertiesScreen from '../screens/PropertiesScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import AgentsScreen from '../screens/AgentsScreen';
import MoreScreen from '../screens/MoreScreen';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';
import colors from '../theme/colors';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
            <Stack.Screen name="FindMyAgent" component={FindMyAgentScreen} />
        </Stack.Navigator>
    );
};

const PropertiesStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
            }}
        >
            <Stack.Screen name="PropertiesMain" component={PropertiesScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
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
        </Stack.Navigator>
    );
};

const ProjectsStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
            }}
        >
            <Stack.Screen name="ProjectsMain" component={ProjectsScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
        </Stack.Navigator>
    );
};

const AgentsStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
            }}
        >
            <Stack.Screen name="AgentsMain" component={AgentsScreen} />
            <Stack.Screen name="FindMyAgent" component={FindMyAgentScreen} />
        </Stack.Navigator>
    );
};

const MoreStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
            }}
        >
            <Stack.Screen name="MoreMain" component={MoreScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
        </Stack.Navigator>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen 
                name="Properties" 
                component={PropertiesStack}
                options={{
                    tabBarLabel: 'Properties',
                }}
            />
            <Tab.Screen 
                name="Projects" 
                component={ProjectsStack}
                options={{
                    tabBarLabel: 'Projects',
                }}
            />
            <Tab.Screen 
                name="Agents" 
                component={AgentsStack}
                options={{
                    tabBarLabel: 'Agents',
                }}
            />
            <Tab.Screen 
                name="More" 
                component={MoreStack}
                options={{
                    tabBarLabel: 'More',
                }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;
