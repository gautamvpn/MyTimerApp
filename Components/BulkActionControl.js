// components/BulkActionControls.js

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const BulkActionControls = ({ category, onStartAll, onPauseAll, onResetAll }) => {
  return (
    <View style={styles.controls}>
      <Button title="Start All" onPress={() => onStartAll(category)} />
      <Button title="Pause All" onPress={() => onPauseAll(category)} />
      <Button title="Reset All" onPress={() => onResetAll(category)} />
    </View>
  );
};

export default BulkActionControls;

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
});
