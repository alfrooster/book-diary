import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Search from './Search.js';
import Shelf from './Shelf.js';
import Diary from './Diary.js';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Search') {
              iconName = 'search';
            } else if (route.name === 'Shelf') {
              iconName = 'library-outline';
            } else if (route.name === 'Diary') {
              iconName = 'book-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Shelf" component={Shelf} />
        <Tab.Screen name="Diary" component={Diary} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}