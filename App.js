import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import Search from './Search.js';
import Diary from './Diary.js';
import Reading from './Reading.js';
import Finished from './Finished.js';
import Wanttoread from './Wanttoread.js';
import Book from './Book.js';
import BookFromShelf from './BookFromShelf.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ShelfScreen({ navigation }) {
  return (
    <>
      <Text style={{...styles.title, alignSelf: 'center', marginTop: 160}}>Your bookshelves</Text>
      <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', margin: 12 }}>
        <Button
          radius={'md'}
          raised
          title="Reading"
          onPress={() => navigation.navigate('Reading')}
        />
        <Button
          radius={'md'}
          raised
          title="Finished"
          onPress={() => navigation.navigate('Finished')}
        />
        <Button
          radius={'md'}
          raised
          title="Want to read"
          onPress={() => navigation.navigate('Wanttoread')}
        />
      </View>
    </>
  );
}

function SearchNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchScreen" component={Search} options={{ title: 'Search' }} />
      <Stack.Screen name="Book" component={Book} />
    </Stack.Navigator>
  );
}

function ShelfNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ShelfScreen" component={ShelfScreen} options={{ title: 'Shelf' }} />
      <Stack.Screen name="Reading" component={Reading} />
      <Stack.Screen name="Finished" component={Finished} />
      <Stack.Screen name="Wanttoread" component={Wanttoread} options={{ title: 'Want to read' }} />
      <Stack.Screen name="BookFromShelf" component={BookFromShelf} options={{ title: 'Book' }} />
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
        <Tab.Screen name="Search" component={SearchNav} options={{ headerShown: false }} />
        <Tab.Screen name="Shelf" component={ShelfNav} options={{ headerShown: false }} />
        <Tab.Screen name="Diary" component={Diary} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
});