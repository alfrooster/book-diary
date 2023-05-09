import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { Input, Button, Text } from '@rneui/themed';
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

export default function Diary() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [keys, setKeys] = useState([]);

  const itemsRef = ref(database, 'notes/');

  useEffect(() => {
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setNotes(Object.values(data));
      setKeys(Object.keys(data));
    })
  }, []);
  
  const deleteItem = (id) => {
    remove(ref(database, 'notes/' + keys[id]));
  }
  
  const saveItem = () => {
    const time = new Date();
    push(itemsRef, 
      {title: title, note: note, time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`}
    )

    setNote('');
    setTitle('');
  }
  
  const itemSeparator = () => {
    return (
      <View style={{ height: 1, backgroundColor: 'lightgray', marginTop: 10, marginBottom: 10 }} />
    )
  }
  
  return (
    <View>
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
      <View style={{ width: 200, alignSelf: 'center' }}>
        <Button radius={'md'} raised icon={{name: 'save', color:'white'}} onPress={saveItem} />
      </View>
      <FlatList
        data={notes}
        style={{ marginLeft: 10, marginRight: 10 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 220 }}
        ItemSeparatorComponent={itemSeparator}
        renderItem={({ item, index }) =>
          <> 
          <View>
            <View>
              <Text style={styles.boldbody}>{item.title} ({item.bookname})</Text>
              <Text style={styles.body}>{item.time}</Text>
              <Text style={styles.body}>{item.note}</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 10 }}>
            <Button onPress={() => deleteItem(index)} radius={'md'} type='outline' raised title='DELETE' />
            <Button radius={'md'} type='outline' raised title='EDIT' />
          </View>
          </>}
      />
    </View>
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