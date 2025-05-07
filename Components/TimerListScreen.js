import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerCard from './TimerCard';


const TimerListScreen = () => {
  const [timers, setTimers] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    loadTimers();
  }, []);

  const loadTimers = async () => {
    try {
      const stored = await AsyncStorage.getItem('timers');
      const parsed = stored ? JSON.parse(stored) : [];
      setTimers(parsed);
    } catch (error) {
      console.error('Failed to load timers', error);
    }
  };

  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderTimer = (timer) => <TimerCard key={timer.id} timer={timer} />;

  return (
    <FlatList
      data={Object.keys(groupedTimers)}
      keyExtractor={(item) => item}
      renderItem={({ item: category }) => (
        <View style={styles.categorySection}>
          <TouchableOpacity onPress={() => toggleCategory(category)}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text>{expandedCategories[category] ? '-' : '+'}</Text>
            </View>
          </TouchableOpacity>
          {expandedCategories[category] &&
            groupedTimers[category].map(renderTimer)}
        </View>
      )}
    />
  );
};

export default TimerListScreen;

const styles = StyleSheet.create({
  categorySection: {
    margin: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#c0c0c0',
    padding: 10,
    borderRadius: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerCard: {
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  timerName: {
    fontSize: 16,
    fontWeight: '600',
  },
});
