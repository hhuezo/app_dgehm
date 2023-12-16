import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReporteFallaScreen } from "../screens/ReporteFalla/ReporteFallaScreen";
import { ReporteMapaScreen } from "../screens/ReporteFalla/ReporteMapaScreen";
import { ReporteIndexScreen } from "../screens/ReporteFalla/ReporteIndexScreen";
import React from "react";


const Stack = createNativeStackNavigator();

export function ReporteFallaStack() {
  return (
    <Stack.Navigator>
       <Stack.Screen
        name="ReporteIndexStack"
        component={ReporteIndexScreen}
        options={{ title: "Reporte de falla" }}
      />
      <Stack.Screen
        name="ReporteMapaStack"
        component={ReporteMapaScreen}
        options={{ title: "Ubica el punto" }}
      />
      <Stack.Screen
        name="ReporteFallaStack"
        component={ReporteFallaScreen}
        options={{ title: "Reporte de falla" }}
      />
    </Stack.Navigator>
  );
}
