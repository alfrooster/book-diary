import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Alert, FlatList, ScrollView } from 'react-native';
import { Button, Text, Dialog, CheckBox, Input } from '@rneui/themed';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, remove, onValue, query, equalTo, orderByChild } from 'firebase/database';
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

export default function BookFromShelf({ route }) {
  const { book, shelf, index } = route.params;
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [checked, setChecked] = useState(1);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [keys, setKeys] = useState([]);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const toggleDialog2 = () => {
    setVisible2(!visible2);
  };

  useEffect(() => {
    const allNotesRef = query(ref(database, 'notes/'), orderByChild("bookkey"), equalTo(index));
    onValue(allNotesRef, (snapshot) => {
      const data = snapshot.val();
      setNotes(Object.values(data));
      setKeys(Object.keys(data));
    })
  }, []);

  const saveItem = (option) => {
    if (option == 1) {
      push(
        ref(database, `books/Reading`), book
      )
    } else if (option == 2){
      push(
        ref(database, `books/Finished`), book
      )
    } else if (option == 3){
      push(
        ref(database, `books/Want to read`), book
      )
    } 
  }
  
  const deleteItem = () => {
    remove(ref(database, `books/${shelf}/` + index));
  }

  const saveNote = () => {
    const time = new Date();
    push(ref(database, `notes/`), 
      {title: title, bookname: book.title, note: note, time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`, bookkey: index}
    )
    setTitle('');
    setNote('');
  }

  const deleteNote = (id) => {
    remove(ref(database, `notes/` + keys[id]));
  }
  
  const itemSeparator = () => {
    return (
      <View style={{ height: 1, backgroundColor: 'lightgray', marginTop: 10, marginBottom: 10 }} />
    )
  }

  return (
    <>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        {(book.image != "No image") ? (
          <Image style={{ width: 200, height: 240, resizeMode: 'contain' }} source={{ uri: book.image, }} />
        ) : (
          <Text style={{ marginTop: 30, marginBottom: 30 }}>No image</Text>
        )}
        <Text style={{...styles.title, marginTop: 10 }}>{book.title}</Text>
      </View>
      <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', margin: 12 }}>
        <Button radius={'md'} raised onPress={() => toggleDialog2()} title='ADD NOTE' />
        <Button radius={'md'} raised onPress={() => toggleDialog()} title='MOVE' />
        <Button
          radius={'md'}
          raised 
          onPress={() => {
            deleteItem();
            Alert.alert(`${book.title} was deleted`);
          }}
          title='DELETE'
        />
      </View>
      <ScrollView style={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
        <Text style={styles.boldbody}>Authors:</Text>
        {(book.authors != undefined) ? (
          book.authors.map((author, key) =>
            <Text style={styles.body}>{author}</Text>
          )
        ) : (
          null
        )}
        <Text style={styles.boldbody}>Publication date:</Text>
        <Text style={styles.body}>{book.date}</Text>
        <Text style={styles.boldbody}>ISBN:</Text>
        <Text style={styles.body}>{book.isbn}</Text>
        <Text style={styles.boldbody}>Description:</Text>
        <Text style={styles.body}>{book.description}</Text>
      </ScrollView>
      <Text style={{...styles.boldbody, alignSelf: 'center'}}>Notes:</Text>
      <FlatList
        data={notes}
        style={{ marginLeft: 10, marginRight: 10 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        ItemSeparatorComponent={itemSeparator}
        renderItem={({ item, index }) =>
          <> 
          <View>
            <View>
              <Text style={styles.boldbody}>{item.title}</Text>
              <Text style={styles.body}>{item.time}</Text>
              <Text style={styles.body}>{item.note}</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 10 }}>
            <Button onPress={() => deleteNote(index)} radius={'md'} type='outline' raised title='DELETE' />
            <Button radius={'md'} type='outline' raised title='EDIT' />
          </View>
          </>}
      />
      
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
            }}
          />
        ))}

        <Dialog.Actions>
          <Dialog.Button
            title="MOVE"
            onPress={() => {
              console.log(`${book.title} was moved to option ${checked}`);
              saveItem(checked);
              deleteItem();
              toggleDialog();
              Alert.alert(`${book.title} was moved`);
            }}
          />
          <Dialog.Button title="CANCEL" onPress={toggleDialog} />
        </Dialog.Actions>
      </Dialog>

      <Dialog
        isVisible={visible2}
        onBackdropPress={toggleDialog2}
      >
        <Input
          label='Entry title'
          value={title}
          placeholder='Title your note'
          onChangeText={text => setTitle(text)}
        />
        <Input
          label='Entry content'
          value={note}
          placeholder='Note here...'
          onChangeText={text => setNote(text)}
        />

        <Dialog.Actions>
        <Dialog.Button
            title="SAVE"
            onPress={() => {
              console.log(`Book key: ${index}, Note title: ${title}`);
              saveNote();
              toggleDialog2();
            }}
          />
          <Dialog.Button title="CANCEL" onPress={toggleDialog2} />
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