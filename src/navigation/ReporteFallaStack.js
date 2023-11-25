import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReporteFallaScreen } from "../screens/ReporteFalla/ReporteFallaScreen";
import React from 'react'

const Stack = createNativeStackNavigator();

export  function ReporteFallaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReporteFallaStack"
        component={ReporteFallaScreen}
        options={{ title: "Reporte falla" }}
      />
    </Stack.Navigator>
  )
}