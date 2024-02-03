import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CensoLuminariaIndexScreen } from "../screens/CensoLuminaria/CensoLuminariaIndexScreen";
import { CensoLuminariaScreen } from "../screens/CensoLuminaria/CensoLuminariaScreen";
import { CensoLuminariaMapaScreen } from "../screens/CensoLuminaria/CensoLuminariaMapaScreen";
import React from "react";

const Stack = createNativeStackNavigator();

export function CensoLuminariaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CensoLuminariaIndex"
        component={CensoLuminariaIndexScreen}
        options={{ title: "Censo de luminaria" }}
      />
        <Stack.Screen
        name="CensoLuminariaMapaStack"
        component={CensoLuminariaMapaScreen}
        options={{ title: "Ubica el punto" }}
      />
      <Stack.Screen
        name="CensoLuminariaStack"
        component={CensoLuminariaScreen}
        options={{ title: "Censo de luminaria" }}
      />
    </Stack.Navigator>
  );
}
