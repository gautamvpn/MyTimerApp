import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TimerCard = ({ timer }) => {
  const [timeLeft, setTimeLeft] = useState(timer.duration);
  const [status, setStatus] = useState('Paused'); // Running | Paused | Completed
  const intervalRef = useRef(null);

  useEffect(() => {
    if (status === 'Running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setStatus('Completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [status]);
  

  const percentage = ((timer.duration - timeLeft) / timer.duration) * 100;

  const handleStart = () => {
    if (status !== 'Running' && timeLeft > 0) setStatus('Running');
  };

  const handlePause = () => {
    if (status === 'Running') {
      clearInterval(intervalRef.current);
      setStatus('Paused');
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(timer.duration);
    setStatus('Paused');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{timer.name}</Text>
      <Text>Time Left: {timeLeft}s</Text>
      <Text>Status: {status}</Text>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.percentageText}>{Math.round(percentage)}% elapsed</Text>

      <View style={styles.controls}>
        <Button title="Start" onPress={handleStart} disabled={status === 'Completed'} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Reset" onPress={handleReset} />
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
});
