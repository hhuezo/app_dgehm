import React, { useState, useEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Button, Alert, Text } from "react-native";
import * as Location from "expo-location";

export function ReporteMapaScreen(props) {

  const { navigation } = props;
  const [location, setLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso de ubicación",
          "Se requiere permiso para acceder a la ubicación"
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setMarkerLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleMarkerDragEnd = (e) => {
    setMarkerLocation(e.nativeEvent.coordinate);
  };

  
  const goToReporteFalla = () => {
    if (markerLocation) {
     /* console.log(        "Coordenadas del Marker:",        markerLocation.latitude,        markerLocation.longitude      );*/
  
      navigation.navigate("ReporteFallaStack", {
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude,
      });
    } else {
      Alert.alert("Error", "No se ha seleccionado una ubicación válida.");
    }
  };

  // Espera hasta que obtengamos las coordenadas iniciales
  if (!location) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mueve el punto para cambiar la ubicación</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markerLocation && (
          <Marker
            coordinate={markerLocation}
            draggable
            onDragEnd={handleMarkerDragEnd}
          >
            <Callout>
              <View>
                <Text style={{ fontWeight: "bold" }}>Mi Punto</Text>
                <Text>Descripción del punto</Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>
      <Button title="Aceptar ubicación" onPress={goToReporteFalla} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
});
