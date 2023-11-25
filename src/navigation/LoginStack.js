import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/Login/LoginScreen";
import React from 'react'

const Stack = createNativeStackNavigator();

export  function LoginStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="LoginStack"
      component={LoginScreen}
      options={{ title: "Login" }}
    />
  </Stack.Navigator>
  )
}