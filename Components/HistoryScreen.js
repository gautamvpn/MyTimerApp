import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem('timerHistory');
    setHistory(stored ? JSON.parse(stored) : []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => item.id || `${index}`}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
            <Text style={styles.time}>{new Date(item.completedAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  entry: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  time: { fontSize: 12, color: '#666' },
  name: {
  fontSize: 16,
  fontWeight: '600',
},
category: {
  fontSize: 14,
  color: '#555',
  marginTop: 2,
},
});
