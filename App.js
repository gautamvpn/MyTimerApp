import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimerListScreen from './Components/TimerListScreen';
import AddTimerScreen from './Components/AddTimerScreen';
import { TouchableOpacity, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TimerList">
        <Stack.Screen
          name="TimerList"
          component={TimerListScreen}
          options={({ navigation }) => ({
            title: 'Timers',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddTimer')}>
                <Text style={{ marginRight: 10, color: 'blue' }}>+ Add</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AddTimer"
          component={AddTimerScreen}
          options={{ title: 'Add Timer' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
