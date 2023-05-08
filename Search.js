import { useState } from 'react';
import { FlatList, View, Image, StyleSheet } from 'react-native';
import { Input, Button, Text, Dialog, CheckBox } from '@rneui/themed';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push } from 'firebase/database';
import { API_KEY, FB_API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

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

export default function Search({ navigation }) {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(0);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(1);
  const [index, setIndex] = useState('');

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const fetchBook = () => {
    setLoading(true);
    if (author == '') {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=20&key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setData(data.items);
        setResults(data.totalItems);
        setLoading(false)
      })
      .catch(err => console.error(err))
    } else {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&maxResults=20&key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setData(data.items);
        setResults(data.totalItems);
        setLoading(false)
      })
      .catch(err => console.error(err))
    }
  }

  const saveItem = (key, option) => {
    obj = {'title': data[key].volumeInfo.title,
    'authors': "Unknown",
    'date': data[key].volumeInfo.publishedDate,
    'isbn': '',
    'image': "No image",
    'description': "No description"};
    if (data[key].volumeInfo.authors != undefined) {
      obj.authors = data[key].volumeInfo.authors
    }
    if (data[key].volumeInfo.imageLinks != undefined) {
      obj.image = data[key].volumeInfo.imageLinks.thumbnail
    }
    if (data[key].volumeInfo.industryIdentifiers != undefined) {
      obj.isbn = data[key].volumeInfo.industryIdentifiers[0].identifier
    }
    if (data[key].volumeInfo.description != undefined) {
      obj.description = data[key].volumeInfo.description
    }
    if (option == 1) {
      push(
        ref(database, `books/Reading`), obj
      )
    } else if (option == 2){
      push(
        ref(database, `books/Finished`), obj
      )
    } else if (option == 3){
      push(
        ref(database, `books/Want to read`), obj
      )
    } 
  }

  const itemSeparator = () => {
    return (
      <View style={{ height: 1, backgroundColor: 'lightgray', marginTop: 10, marginBottom: 10 }} />
    )
  }

  return (
    <View style={{ marginTop: 10 }}>
      <Input
        label='Search'
        value={title}
        placeholder='Title or keyword'
        onChangeText={text => setTitle(text)}
      />
      <Input
        label='Author (optional)'
        value={author}
        placeholder='Specify author'
        onChangeText={text => setAuthor(text)}
      />
      <View style={{ width: 200, alignSelf: 'center' }}>  
        {loading ? (
          <Button loading />
        ) : (
          <Button radius={'md'} raised icon={{name: 'search', color:'white'}} onPress={fetchBook} />
        )}
      </View>
      <Text style={{ marginTop: 10, marginLeft: 10 }}>Found {results} books, showing {data.length}</Text>
      <FlatList
        data={data}
        style={{ marginLeft: 10, marginRight: 10 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 240 }}
        ItemSeparatorComponent={itemSeparator}
        renderItem={({ item, index }) =>
          <> 
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <Text style={styles.title}>Title:</Text>
              <Text>{item.volumeInfo.title}</Text>
              <Text style={styles.title}>Authors:</Text>
              {(item.volumeInfo.authors != undefined) ? (
                item.volumeInfo.authors.map((author, key) =>
                  <Text>{author}</Text>
                )
              ) : (
                null
              )}
              <Text style={styles.title}>Publication date:</Text>
              <Text>{item.volumeInfo.publishedDate}</Text>
              <Text style={styles.title}>ISBN:</Text>
              {(item.volumeInfo.industryIdentifiers != undefined) ? (              
                <Text>{item.volumeInfo.industryIdentifiers[0].identifier}</Text>
              ) : (
                null
              )}
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {(item.volumeInfo.imageLinks != undefined) ? (
                <Image style={{ width: 120, height: 135, resizeMode: 'contain' }} source={{ uri: item.volumeInfo.imageLinks.thumbnail, }} />
              ) : (
                <Text style={{ marginRight: 34, marginTop: 57 }}>No image</Text>
              )}
            </View>
          </View>
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 10 }}>
            <Button onPress={() => {
              setIndex(index);
              toggleDialog();
              }}
              radius={'md'}
              type='outline'
              raised
              title='ADD TO SHELF'
            />
            <Button onPress={() => navigation.navigate('Book', {book: data[index]})} radius={'md'} type='outline' raised title='SHOW BOOK' />
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
            title="SAVE"
            onPress={() => {
              console.log(`${data[index].volumeInfo.title} was saved in option ${checked}`);
              saveItem(index, checked);
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