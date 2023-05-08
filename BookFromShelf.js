import { StyleSheet, View, Image } from 'react-native';
import { Button, Text } from '@rneui/themed';

export default function Book({ route }) {
  const { book } = route.params;

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        {(book.volumeInfo.imageLinks != undefined) ? (
          <Image style={{ width: 250, height: 300, resizeMode: 'contain' }} source={{ uri: book.volumeInfo.imageLinks.thumbnail, }} />
        ) : (
          <Text style={{ marginTop: 30, marginBottom: 30 }}>No image</Text>
        )}
          <Text style={styles.title}>{book.volumeInfo.title}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
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
        <View style={{ flex: 1 }}>
          <Text style={styles.body}>{book.volumeInfo.title}</Text>
          <Text style={styles.body}>{book.volumeInfo.title}</Text>
          <Button title='add date' />
        </View>
      </View>
      <Text style={styles.body}>{book.volumeInfo.description}</Text>
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