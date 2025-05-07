import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TimerCard = ({ timer, onStart, onPause, onReset }) => {
    const progress = (1 - timer.timeLeft / timer.duration) * 100;
  
    return (
        <View style={styles.card}>
          <Text style={styles.name}>{timer.name}</Text>
          <Text>Time Left: {timer.timeLeft}s</Text>
          <Text>Status: {timer.status}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress}%` }]} />
          </View>
          <View style={styles.controls}>
            <Button title="Start" onPress={onStart} disabled={timer.status === 'Completed'} />
            <Button title="Pause" onPress={onPause} />
            <Button title="Reset" onPress={onReset} />
          </View>
        </View>
      );
    };

export default TimerCard;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
progressBar: {
  height: 6,
  backgroundColor: '#eee',
  borderRadius: 3,
  marginVertical: 6,
},
progress: {
  height: 6,
  backgroundColor: '#4caf50',
  borderRadius: 3,
},
});
