import { AppNavigation } from "./src/navigation/AppNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { SessionProvider } from "./src/utils/SessionContext";

export default function App() {
  return (
    <SessionProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </SessionProvider>
  );
}
