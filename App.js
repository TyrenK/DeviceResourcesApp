import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import ImagePickerComponent from './src/components/ImagePickerComponent';
import ContactsComponent from './src/components/ContactsComponent';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImagePickerComponent/>
      <ContactsComponent/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f0f0f0', 
  },
});

export default App;