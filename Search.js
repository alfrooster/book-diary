import { useState } from 'react';
import { FlatList, View, Image, StyleSheet } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
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

export default function Search() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(0);

  const itemsRef = ref(database, 'books/');

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

  const saveItem = (key) => {
    obj = {'title': data[key].volumeInfo.title,
    'authors': "Unknown",
    'date': data[key].volumeInfo.publishedDate,
    'isbn': data[key].volumeInfo.industryIdentifiers[0].identifier,
    'image': "No image"};
    if (data[key].volumeInfo.authors != undefined) {
      obj.authors = data[key].volumeInfo.authors
    }
    if (data[key].volumeInfo.imageLinks != undefined) {
      obj.image = data[key].volumeInfo.imageLinks.thumbnail
    }
    push(
      itemsRef, obj
    )
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
            <Button radius={'md'} type='outline' raised title='1' />
            <Button onPress={() => saveItem(index)} radius={'md'} type='outline' raised title='ADD to shelf' />
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