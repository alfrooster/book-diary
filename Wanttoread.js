import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { Button, Text } from '@rneui/themed';
import { FB_API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

//initialize firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig)
}
const app = getApp();
const database = getDatabase(app);

export default function Wanttoread() {
  const [books, setBooks] = useState([]);
  const [keys, setKeys] = useState([]);

  const itemsRef = ref(database, 'books/Want to read/');

  useEffect(() => {
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setBooks(Object.values(data));
      setKeys(Object.keys(data));
    })
  }, []);
  
  const deleteItem = (id) => {
    remove(ref(database, 'books/Want to read/' + keys[id]));
  }

  const itemSeparator = () => {
    return (
      <View style={{ height: 1, backgroundColor: 'lightgray', marginTop: 10, marginBottom: 10 }} />
    )
  }

  return (
    <View>
      <Text style={{ marginTop: 10, marginLeft: 10 }}>X books in your collection</Text>
      <FlatList
        data={books}
        style={{ marginLeft: 10, marginRight: 10 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        ItemSeparatorComponent={itemSeparator}
        renderItem={({ item, index }) =>
          <> 
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <Text style={styles.title}>Title:</Text>
              <Text>{item.title}</Text>
              <Text style={styles.title}>Authors:</Text>
              {(item.authors != "Unknown") ? (
                item.authors.map((author, key) =>
                  <Text>{author}</Text>
                )
              ) : (
                null
              )}
              <Text style={styles.title}>Publication date:</Text>
              <Text>{item.date}</Text>
              <Text style={styles.title}>ISBN:</Text>
              <Text>{item.isbn}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {(item.image != "No image") ? (
                <Image style={{ width: 120, height: 135, resizeMode: 'contain' }} source={{ uri: item.image, }} />
              ) : (
                <Text style={{ marginRight: 34, marginTop: 57 }}>No image</Text>
              )}
            </View>
          </View>
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 10 }}>
            <Button onPress={() => deleteItem(index)} radius={'md'} type='outline' raised title='DELETE' />
            <Button radius={'md'} type='outline' raised title='2' />
            <Button radius={'md'} type='outline' raised title='SHOW BOOK' />
            {/* pressing on book will take you to book's page, stack navigation to Book.js */}
          </View>
          </>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
});