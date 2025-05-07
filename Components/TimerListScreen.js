import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerCard from './TimerCard';
import BulkActionControls from './BulkActionControl';
import TimerCompleteModal from './TimerCompleteFeedback';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


const TimerListScreen = () => {
  const [timers, setTimers] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [completedTimer, setCompletedTimer] = useState(null);

  const navigation = useNavigation();



  // for Bulk Actions
  const handleStartAll = (category) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.category === category && timer.status !== 'Completed'
          ? { ...timer, status: 'Running' }
          : timer
      )
    );
  };

  const handlePauseAll = (category) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.category === category && timer.status === 'Running'
          ? { ...timer, status: 'Paused' }
          : timer
      )
    );
  };

  const handleResetAll = (category) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.category === category
          ? { ...timer, timeLeft: timer.duration, status: 'Paused' }
          : timer
      )
    );
  };



  // This will reload timers every time the TimerListScreen is focused — no need to restart the app manually
  useFocusEffect(
    useCallback(() => {
      loadTimers();
    }, [])
  )

  //  Confirm Before Deleting Category
  const confirmDeleteCategory = (category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete the entire "${category}" category and its timers?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteCategory(category), style: 'destructive' },
      ]
    );
  };

  // Delete Category logic
  const deleteCategory = async (category) => {
    const filtered = timers.filter(timer => timer.category !== category);
    setTimers(filtered);
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to update storage after deleting category', err);
    }
  };

  const loadTimers = async () => {
    try {
      const stored = await AsyncStorage.getItem('timers');
      const parsed = stored ? JSON.parse(stored) : [];

      const enriched = parsed.map(t => ({
        ...t,
        timeLeft: t.duration,
        status: 'Paused',
        halfwayAlertFired: false,
      }));

      setTimers(enriched);
    } catch (error) {
      console.error('Failed to load timers', error);
    }
  };

  const updateTimer = (id, newProps) => {
    setTimers(prev =>
      prev.map(t => (t.id === id ? { ...t, ...newProps } : t))
    );
  };

  const handleStart = (id) => updateTimer(id, { status: 'Running' });
  const handlePause = (id) => updateTimer(id, { status: 'Paused' });
  const handleReset = (id) => {
    const timer = timers.find(t => t.id === id);
    updateTimer(id, {
      timeLeft: timer.duration,
      status: 'Paused',
      halfwayAlertFired: false,
    });
  };

  const saveToHistory = async (timer) => {
    if (!timer || typeof timer !== 'object') return; // ⛔ prevent crash

    try {
      const stored = await AsyncStorage.getItem('timerHistory');
      const history = stored ? JSON.parse(stored) : [];

      const newEntry = {
        id: timer.id,
        name: timer.name,
        category: timer.category || 'Uncategorized', // Fallback if undefined
        completedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('timerHistory', JSON.stringify([newEntry, ...history]));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  };


  // Navigate to the History screen with the completedTimers data
  const navigateToHistory = () => {
    navigation.navigate('History', { completedTimer });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev =>
        prev.map(timer => {
          if (timer.status === 'Running' && timer.timeLeft > 0) {
            const updatedTime = timer.timeLeft - 1;

            const halfwayPoint = Math.floor(timer.duration / 2);

          // Trigger halfway alert once
          if (
            updatedTime === halfwayPoint &&
            !timer.halfwayAlertFired
          ) {
            alert(`⏳ "${timer.name}" is halfway done!`);
            return {
              ...timer,
              timeLeft: updatedTime,
              halfwayAlertFired: true,
            };
          }

            if (updatedTime === 0) {
              if (timer) {
                saveToHistory(timer);
                setCompletedTimer(timer); // <- Trigger modal here


              }
            }
            return {
              ...timer,
              timeLeft: updatedTime,
              status: updatedTime === 0 ? 'Completed' : 'Running',
            };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);


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

  const renderTimer = (timer) => (
    <TimerCard
      key={timer.id}
      timer={timer}
      onStart={() => handleStart(timer.id)}
      onPause={() => handlePause(timer.id)}
      onReset={() => handleReset(timer.id)}
    />
  );

  return (
    <>
      {completedTimer && (
        <TimerCompleteModal
          timerName={completedTimer.name}
          onClose={() => setCompletedTimer(null)}
        />
      )}

      <View style={styles.container}>

        <TouchableOpacity onPress={navigateToHistory} style={styles.historyButton}>
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>

        <FlatList
          data={Object.keys(groupedTimers)}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => (
            <View style={styles.categorySection}>
              <TouchableOpacity onPress={() => toggleCategory(category)}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => toggleCategory(category)}>
                      <Text style={styles.toggle}>{expandedCategories[category] ? '-' : '+'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDeleteCategory(category)}>
                      <Text style={styles.delete}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </TouchableOpacity>
              {expandedCategories[category] && (
                <>
                  <BulkActionControls
                    category={category}
                    onStartAll={handleStartAll}
                    onPauseAll={handlePauseAll}
                    onResetAll={handleResetAll}
                  />
                  {groupedTimers[category].map(renderTimer)}
                </>
              )}
            </View>
          )}
        />
      </View>


    </>

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
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  historyButton: {
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'lightgrey',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  historyButtonText: {
    color: '#9C27B0',
    fontWeight: '600',
    fontSize: 14,
  },
  toggle: {
  fontSize: 18,
  paddingHorizontal: 8,
},
delete: {
  fontSize: 18,
  color: 'red',
  paddingHorizontal: 8,
},

});
