import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('timerHistory');
      const parsed = stored ? JSON.parse(stored) : [];
      setHistory(parsed);
    } catch (error) {
      console.error('Failed to load history', error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const filtered = history.filter(item => item.id !== id);
      await AsyncStorage.setItem('timerHistory', JSON.stringify(filtered));
      setHistory(filtered);
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this history item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteEntry(id), style: 'destructive' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.entry}>
      <Text style={styles.text}>
        {item.name} ({item.category}) - {new Date(item.completedAt).toLocaleString()}
      </Text>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    flex: 1,
  },
  delete: {
    fontSize: 18,
    color: 'red',
    marginLeft: 12,
  },
});
