import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import Search from './Search.js';
import Diary from './Diary.js';
import Reading from './Reading.js';
import Finished from './Finished.js';
import Wanttoread from './Wanttoread.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ShelfScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Your shelves</Text>
      <Button
        title="Reading"
        onPress={() => navigation.navigate('Reading')}
      />
      <Button
        title="Finished"
        onPress={() => navigation.navigate('Finished')}
      />
      <Button
        title="Want to read"
        onPress={() => navigation.navigate('Wanttoread')}
      />
    </View>
  );
}

function ShelfNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ShelfScreen" component={ShelfScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Reading" component={Reading} />
      <Stack.Screen name="Finished" component={Finished} />
      <Stack.Screen name="Wanttoread" component={Wanttoread} options={{ title: 'Want to read' }} />
    </Stack.Navigator>
  );
}

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
        <Tab.Screen name="Shelf" component={ShelfNav} />
        <Tab.Screen name="Diary" component={Diary} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});