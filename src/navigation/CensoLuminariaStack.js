import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CensoLuminariaScreen } from "../screens/CensoLuminaria/CensoLuminariaScreen";
import React from 'react'

const Stack = createNativeStackNavigator();

export function CensoLuminariaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CensoLuminariaScreen"
        component={CensoLuminariaScreen}
        options={{ title: "Censo de luminaria" }}
      />
    </Stack.Navigator>
  )
}