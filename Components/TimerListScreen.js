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
import BulkActionControls from './BulkActionControl';


const TimerListScreen = () => {
    const [timers, setTimers] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});


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
      



    useEffect(() => {
        loadTimers();
    }, []);

    const loadTimers = async () => {
        try {
            const stored = await AsyncStorage.getItem('timers');
            const parsed = stored ? JSON.parse(stored) : [];

            const enriched = parsed.map(t => ({
                ...t,
                timeLeft: t.duration,
                status: 'Paused',
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
        updateTimer(id, { timeLeft: timer.duration, status: 'Paused' });
      };

      useEffect(() => {
        const interval = setInterval(() => {
          setTimers(prev =>
            prev.map(timer => {
              if (timer.status === 'Running' && timer.timeLeft > 0) {
                const updatedTime = timer.timeLeft - 1;
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
