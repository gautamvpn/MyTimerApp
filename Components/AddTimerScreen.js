import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTimerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const saveTimer = async () => {
    if (!name || !duration || !category) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration),
      category,
    };

    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const timers = storedTimers ? JSON.parse(storedTimers) : [];
      timers.push(newTimer);
      console.log('storedTimers',storedTimers);
      console.log('timers is ',timers);

      await AsyncStorage.setItem('timers', JSON.stringify(timers));
      Alert.alert('Success', 'Timer saved successfully!');
      // navigation.goBack(); // or reset form
    } catch (error) {
      Alert.alert('Error', 'Failed to save timer');
      console.error('error getting',error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., Workout Timer"
      />

      <Text style={styles.label}>Duration (seconds)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="e.g., 300"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="e.g., Workout"
      />

      <Button title="Save Timer" onPress={saveTimer} />
    </View>
  );
};

export default AddTimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});
