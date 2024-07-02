import React, { useState, useEffect, useReducer } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  StyleSheet,
  View,
  Button,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { API_HOST } from "../../utils/constants";
import { KEY } from "../../utils/constants";
import { useSession } from "../../utils/SessionContext";

export function CensoLuminariaMapaScreen(props) {
  const { navigation } = props;
  const { userId, userName, userEmail } = useSession();
  const [location, setLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  let departamentoId = "";
  let distritoId = "";
  let departamentoNombre = "";
  let distritoNombre = "";
  let direccion = "";
  let distrito_valido = true;
  const [isLoading, setIsLoading] = useState(false);

  const [, forceUpdate] = useReducer((x) => x + 1, 0); // Hook para forzar la actualización de la vista

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
      forceUpdate();
    })();
  }, []);

  const handleMarkerDragEnd = (e) => {
    setMarkerLocation(e.nativeEvent.coordinate);
  };

  const handleCensoLuminaria = async () => {
    if (markerLocation) {
      try {
        setIsLoading(true);
        // Llamamos primero a obtenerUbicacion
        await obtenerUbicacion(
          markerLocation.latitude,
          markerLocation.longitude
        );

        // Después de obtener la ubicación, llamamos a getDepartamento y getDistrito
        const [departamento, distrito] = await Promise.all([
          getDepartamento(departamentoNombre),
          getDistrito(distritoNombre),
        ]);


        navigation.navigate("CensoLuminariaStack", {
          latitude: markerLocation.latitude,
          longitude: markerLocation.longitude,
          idDepartamento: departamentoId,
          idDistrito: distritoId,
          Direccion: direccion,
          distrito_valido: distrito_valido,
        });
      } catch (error) {
        console.error("Error en la navegación:", error);
      } finally {
        setIsLoading(false); // Ocultar imagen de carga
      }
    } else {
      Alert.alert("Error", "No se ha seleccionado una ubicación válida.");
    }
  };

  const obtenerUbicacion = async (latitud, longitud) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitud}&lon=${longitud}`;

      const response = await fetch(url);
      const data = await response.json();
      //console.log("ubicacion: ", data);
      if (data.address) {
        const departamento = data.address.state;
        const municipio =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county;

        departamentoNombre = departamento;
        distritoNombre = municipio;
        direccion = data.display_name;

      } else {
        console.error("No se pudo obtener la información de ubicación.");
      }
    } catch (error) {
      console.log(
        "Error al obtener la información de ubicación:",
        error.message
      );
    }
  };

  const getDepartamento = async (nombre) => {
    try {
      const baseUrl = `${API_HOST}/api_get_departamento_id`;
      const urlCompleta = `${baseUrl}/${nombre}`;

      const response = await fetch(urlCompleta, {
        headers: {
          "Authorization": KEY
        }
      });

      const data = await response.json();
      departamentoId = data.departamentoId;
      console.log("departamento: ", departamentoId);
    } catch (error) {
      console.log(
        "Error al obtener la información del departamento:",
        error.message
      );
    }
  };

  const getDistrito = async (nombre) => {
    try {
      if (nombre === undefined) {
        distritoId = 0;
      }
      else {
        const baseUrl = `${API_HOST}/api_get_distrito_id`;
        const urlCompleta = `${baseUrl}/${nombre}/${userId}`;

        const response = await fetch(urlCompleta, {
          headers: {
            "Authorization": KEY
          }
        });

        const data = await response.json();
        distritoId = data.distritoId;
        distrito_valido = data.id_distrito_valido;
        console.log("distritoId: ", distritoId);
        console.log("distrito_valido: ", distrito_valido);
      }

    } catch (error) {
      console.log(
        "Error al obtener la información del departamento:",
        error.message
      );
    }
  };

  const handleMapPress = (e) => {
    // Capturar el punto cuando se presiona en el mapa
    setMarkerLocation(e.nativeEvent.coordinate);
  };

  // Espera hasta que obtengamos las coordenadas iniciales
  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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
        onPress={handleMapPress}
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
      <Button title="Aceptar ubicación" onPress={handleCensoLuminaria} />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
