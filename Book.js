import { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Text, Dialog, CheckBox } from '@rneui/themed';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push } from 'firebase/database';
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

export default function Book({ route }) {
  const { book } = route.params;
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(1);
  const [option, setOption] = useState('');

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const saveItem = (option) => {
    obj = {'title': book.volumeInfo.title,
    'authors': "Unknown",
    'date': book.volumeInfo.publishedDate,
    'isbn': book.volumeInfo.industryIdentifiers[0].identifier,
    'image': "No image",
    'description': "No description"};
    if (book.volumeInfo.authors != undefined) {
      obj.authors = book.volumeInfo.authors
    }
    if (book.volumeInfo.imageLinks != undefined) {
      obj.image = book.volumeInfo.imageLinks.thumbnail
    }
    if (book.volumeInfo.description != undefined) {
      obj.description = book.volumeInfo.description
    }
    push(
      ref(database, `books/${option}`), obj
    )
  }

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        {(book.volumeInfo.imageLinks != undefined) ? (
          <Image style={{ width: 250, height: 300, resizeMode: 'contain' }} source={{ uri: book.volumeInfo.imageLinks.thumbnail, }} />
        ) : (
          <Text style={{ marginTop: 30, marginBottom: 30 }}>No image</Text>
        )}
          <Text style={{...styles.title, marginTop: 10 }}>{book.volumeInfo.title}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20, marginRight: 20, marginBottom: 0 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.boldbody}>Authors:</Text>
          {(book.volumeInfo.authors != undefined) ? (
            book.volumeInfo.authors.map((author, key) =>
              <Text style={styles.body}>{author}</Text>
            )
          ) : (
            null
          )}
          <Text style={styles.boldbody}>Publication date:</Text>
          <Text style={styles.body}>{book.volumeInfo.publishedDate}</Text>
          <Text style={styles.boldbody}>ISBN:</Text>
          {(book.volumeInfo.industryIdentifiers != undefined) ? (              
            <Text style={styles.body}>{book.volumeInfo.industryIdentifiers[0].identifier}</Text>
          ) : (
            null
          )}
        </View>
        <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
          <Button
            onPress={() => {
              toggleDialog();
            }}
            title='ADD TO SHELF'
          />
        </View>
      </View>
      <View style={{flex: 2, marginLeft: 10, marginRight: 10}}>
        <Text style={styles.body}>{book.volumeInfo.description}</Text>
      </View>
      <Dialog
        isVisible={visible}
        onBackdropPress={toggleDialog}
      >
        <Dialog.Title title="Add to shelf:"/>
        {['Reading', 'Finished', 'Want to read'].map((l, i) => (
          <CheckBox
            key={i}
            title={l}
            containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={checked === i + 1}
            onPress={() => {
              setChecked(i + 1);
              setOption(l);
            }}
          />
        ))}

        <Dialog.Actions>
          <Dialog.Button
            title="CONFIRM"
            onPress={() => {
              console.log(`${book.volumeInfo.title} was saved in ${option}`);
              saveItem(option);
              toggleDialog();
            }}
          />
          <Dialog.Button title="CANCEL" onPress={toggleDialog} />
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 28
  },
  body: {
    fontSize: 16
  },
  boldbody: {
    fontWeight: 'bold',
    fontSize: 16
  },
});