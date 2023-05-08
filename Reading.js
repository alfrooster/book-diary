import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, remove, push } from 'firebase/database';
import { Button, Text, Dialog, CheckBox } from '@rneui/themed';
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

export default function Reading({ navigation }) {
  const [books, setBooks] = useState([]);
  const [keys, setKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(1);
  const [index, setIndex] = useState('');

  const itemsRef = ref(database, 'books/Reading/');

  const toggleDialog = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setBooks(Object.values(data));
      setKeys(Object.keys(data));
    })
  }, []);

  const saveItem = (key, option) => {
    if (option == 1) {
        push(
            ref(database, `books/Finished`), books[key]
          )
    } else if (option == 2){
        push(
            ref(database, `books/Want to read`), books[key]
          )
    }
  }
  
  const deleteItem = (id) => {
    remove(ref(database, 'books/Reading/' + keys[id]));
  }

  const itemSeparator = () => {
    return (
      <View style={{ height: 1, backgroundColor: 'lightgray', marginTop: 10, marginBottom: 10 }} />
    )
  }

  return (
    <View>
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
            <Button onPress={() => {
              setIndex(index);
              toggleDialog();
              }}
              radius={'md'}
              type='outline'
              raised
              title='MOVE'
            />
            <Button onPress={() => navigation.navigate('BookFromShelf', {book: books[index], shelf: 'Reading', index: keys[index]})} radius={'md'} type='outline' raised title='SHOW BOOK' />
          </View>
          </>}
      />
      <Dialog
        isVisible={visible}
        onBackdropPress={toggleDialog}
      >
        <Dialog.Title title="Move to shelf:"/>
        {['Finished', 'Want to read'].map((l, i) => (
          <CheckBox
            key={i}
            title={l}
            containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={checked === i + 1}
            onPress={() => {
              setChecked(i + 1);
            }}
          />
        ))}

        <Dialog.Actions>
          <Dialog.Button
            title="MOVE"
            onPress={() => {
              console.log(`${books[index].title} was moved to option ${checked}`);
              saveItem(index, checked);
              deleteItem(index)
              toggleDialog();
            }}
          />
          <Dialog.Button title="CANCEL" onPress={toggleDialog} />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
});