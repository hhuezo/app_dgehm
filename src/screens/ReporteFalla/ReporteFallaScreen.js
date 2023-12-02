import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { API_HOST } from "../../utils/constants";
import { styles } from "./ReporteFallaStyles";
import { dropStyles } from "./ReporteFallaStyles";
import { Dropdown } from "react-native-element-dropdown";
import { TextInputMask } from "react-native-masked-text";

import RNPickerSelect from "react-native-picker-select";

import * as ImagePicker from "expo-image-picker";

import {  ALERT_TYPE,  Dialog,  AlertNotificationRoot,  Toast,} from "react-native-alert-notification";


import * as Location from 'expo-location';

export function ReporteFallaScreen() {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoId, setDepartamentoId] = useState();
  const [distritos, setDistritos] = useState([]);
  const [distritoId, setDistritoId] = useState();
  const [tiposFalla, setTiposFalla] = useState([]);
  const [tipoFallaId, setTipoFallaId] = useState();
  const [descripcion, setDescripcion] = useState();
  const [nombre, setNombre] = useState();
  const [telefono, setTelefono] = useState();
  const [image, setImage] = useState(null);

  //localización
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_HOST}/api_reporte_falla/create`);
        const result = await response.json();

        const DepartamentoArray = [];
        for await (const departamento of result.departamentos) {
          DepartamentoArray.push({
            value: departamento.id,
            label: departamento.nombre,
          });
        }
        setDepartamentos(DepartamentoArray);

        const TipoFallaArray = [];
        for await (const tipo of result.tipos) {
          TipoFallaArray.push({
            value: tipo.id,
            label: tipo.nombre,
          });
        }
        setTiposFalla(TipoFallaArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    const requestCameraPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access camera roll was denied!');
      }
    };

    fetchData();
    getLocation();
    requestCameraPermission();
  }, []);

  const fetchDataDistritos = async (value) => {
    //console.log(value);
    try {
      const url = `${API_HOST}/api_get_distritos/${value}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud. Código de estado: ${response.status}`
        );
      }

      const data = await response.json();

      const distritosArray = [];
      for await (const distrito of data.distritos) {
        distritosArray.push({
          value: distrito.id,
          label: distrito.nombre,
        });
      }

      setDistritos(distritosArray);
      //console.log(distritosArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handSendData = async () => {
    // Validar que los campos obligatorios no sean nulos
    if (!distritoId || !tipoFallaId || !descripcion || !nombre || !telefono || !location) {
      //alert("Por favor, completa todos los campos obligatorios.");
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, completa todos los campos obligatorios.",
        button: "Cerrar",
      });
      return;
    }
    else{

      console.log(location.coords.latitude);
      console.log(location.coords.longitude);
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Ok",
        textBody: "Regitro ingresado correctamente",
        button: "Cerrar",
      });
      return;
    }







  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Acceder a las imágenes seleccionadas a través del array "assets"
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking an image", error);
    }
  };

  const handleInputChange = (text) => {
    // Aquí deberías manejar la lógica de actualización del estado para el número de teléfono
    setTelefono(text);
  };

  return (
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.label}>DEPARTAMENTO</Text>

        <View style={styles.formControl}>
          {departamentos && (
            <RNPickerSelect
              items={departamentos.map((departamento) => ({
                label: departamento.label,
                value: departamento.value,
              }))}
              onValueChange={(value) => {
                setDepartamentoId(value);
                fetchDataDistritos(value);
              }}
              value={departamentoId}
              placeholder={{
                label: "Selecciona un tipo",
                value: null,
              }}
            />
          )}
        </View>

        <Text style={styles.label}>DISTRITO</Text>
        <View style={styles.formControl}>
          {distritos && (
            <Dropdown
              style={dropStyles.dropdown}
              placeholderStyle={dropStyles.placeholderStyle}
              selectedTextStyle={dropStyles.selectedTextStyle}
              inputSearchStyle={dropStyles.inputSearchStyle}
              iconStyle={dropStyles.iconStyle}
              data={distritos}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="SELECCIONAR"
              searchPlaceholder="BUSCAR..."
              value={distritoId}
              onChange={(item) => {
                setDistritoId(item.value);
              }}
            />
          )}
        </View>

        <Text style={styles.label}>TIPO FALLA</Text>

        <View style={styles.formControl}>
          {tiposFalla && (
            <RNPickerSelect
              items={tiposFalla.map((tipo) => ({
                label: tipo.label,
                value: tipo.value,
              }))}
              onValueChange={(value) => {
                setTipoFallaId(value);
              }}
              value={tipoFallaId}
              placeholder={{
                label: "Selecciona un tipo",
                value: null,
              }}
            />
          )}
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>DESCRIPCIÓN</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={2}
            value={descripcion}
            onChangeText={setDescripcion}
          />
        </View>
        <View style={styles.formControlNumber}>
          <Text style={styles.label}>NOMBRE CONTACTO</Text>
          <TextInput
            style={styles.textInput}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>TELÉFONO</Text>
          <TextInputMask
            style={styles.textInput}
            type={"custom"}
            options={{
              mask: "9999-9999",
            }}
            placeholder="Ingresa tu teléfono"
            keyboardType="numeric"
            value={telefono}
            onChangeText={handleInputChange}
          />
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>FOTOGRAFIA</Text>
          <Button title="Seleccionar imagen" onPress={pickImage} />
          <View style={styles.formControlImage}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200, borderRadius: 100 }}
            />
          )}
         </View>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: "#0F172A",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
          onPress={handSendData}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Enviar</Text>
        </TouchableOpacity>
      </View>
      <AlertNotificationRoot>     
    </AlertNotificationRoot>
    </ScrollView>
  );
}
