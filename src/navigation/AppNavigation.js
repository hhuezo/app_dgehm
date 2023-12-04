import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ReporteFallaStack } from "./ReporteFallaStack";
import { CensoLuminariaStack } from "./CensoLuminariaStack";
import { LoginStack } from "./LoginStack";


import { Icon } from "react-native-elements";

const Tab = createBottomTabNavigator();

export function AppNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0f172a",
        tabBarInactiveTintColor: "#64748b",
        tabBarIcon: ({ color, size }) =>  screenOptions(route,color,size)
         
      })}
    >
      <Tab.Screen name="ReporteFalla" component={ReporteFallaStack} options={{title:"Reporte falla"}}  />
      <Tab.Screen name="CensoLuminaria" component={CensoLuminariaStack} options={{title:"Censo luminaria"}}  />
      <Tab.Screen name="Login" component={LoginStack} options={{title:"Login"}}  />
    </Tab.Navigator>
  );
}

function screenOptions(route, color, size) {
  let iconName;
  if (route.name === "ReporteFalla") {
    iconName = "file-document-outline";
  }

  if (route.name === "CensoLuminaria") {
    iconName = "folder-plus-outline";
  }


  if (route.name === "Login") {
    iconName = "account";
  }

  return (
    <Icon type="material-community" name={iconName} color={color} size={size} />
  );
}
