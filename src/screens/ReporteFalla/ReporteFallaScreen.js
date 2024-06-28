import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { API_HOST } from "../../utils/constants";
import { styles } from "./ReporteFallaStyles";
import { dropStyles } from "./ReporteFallaStyles";
import { Dropdown } from "react-native-element-dropdown";
import { MaskedTextInput } from "react-native-mask-text";;

import RNPickerSelect from "react-native-picker-select";

import * as ImagePicker from "expo-image-picker";

import { useSession } from "../../utils/SessionContext";

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";

import { AntDesign } from "@expo/vector-icons";

export function ReporteFallaScreen(props) {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoId, setDepartamentoId] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [municipioId, setMunicipioId] = useState();
  const [distritos, setDistritos] = useState([]);
  const [distritoId, setDistritoId] = useState();
  const [tiposFalla, setTiposFalla] = useState([]);
  const [tipoFallaId, setTipoFallaId] = useState();
  const [descripcion, setDescripcion] = useState();
  const [nombre, setNombre] = useState();
  const [telefono, setTelefono] = useState();
  const [correo, setCorreo] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [image, setImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const { latitude, longitude, idDepartamento, idDistrito } =
    props.route.params;
  const { navigation } = props;

  const { userId, userName, userEmail } = useSession();

  console.log("usuario", userId);



  useEffect(() => {
    setDepartamentoId(idDepartamento);
    setDistritoId(idDistrito);

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_HOST}/api_reporte_falla/create`);
        const result = await response.json();

        if (userId) {
          setNombre(userName);
          setCorreo(userEmail);
          setUsuarioId(userId);
        }

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

        const response_ubicacion = await fetch(
          `${API_HOST}/api_get_data_distrito/${idDistrito}/${idDepartamento}`
        );
        const result_ubicacion = await response_ubicacion.json();
        //console.log(result_ubicacion.response);

        const DistritosArray = [];
        for await (const distrito of result_ubicacion.response.distritos) {
          DistritosArray.push({
            value: distrito.id,
            label: distrito.nombre,
          });
        }
        setDistritos(DistritosArray);

        const MunicipiosArray = [];
        for await (const distrito of result_ubicacion.response.municipios) {
          MunicipiosArray.push({
            value: distrito.id,
            label: distrito.nombre,
          });
        }
        setMunicipios(MunicipiosArray);
        setMunicipioId(result_ubicacion.response.municipio);

        //console.log(DistritosArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const requestCameraPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access camera roll was denied!");
      }
    };

    fetchData();
    requestCameraPermission();
  }, []);

  const fetchDataMunicipios = async (value) => {
    try {
      if (value != null) {
        console.log("get distritos", value, " a", departamentoId);
        const url = `${API_HOST}/api_get_municipios/${value}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Error en la solicitud. Código de estado: ${response.status}`
          );
        }

        const data = await response.json();

        const municipiosArray = [];
        for await (const distrito of data.municipios) {
          municipiosArray.push({
            value: distrito.id,
            label: distrito.nombre,
          });
        }

        setMunicipios(municipiosArray);
        //console.log(distritosArray);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataDistritos = async (value) => {
    try {
      if (value != null) {
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
      }
      //console.log(distritosArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Función auxiliar para validar el formato del correo electrónico
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handSendData = async () => {
    // Validar que los campos obligatorios no sean nulos
    if (!distritoId || !tipoFallaId || !descripcion || !nombre || !telefono) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, completa todos los campos obligatorios.",
        button: "Cerrar",
      });
      return;
    } else if (!latitude || !longitude) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, debe ingresar la ubicación en el mapa.",
        button: "Cerrar",
      });
      return;
    } else if (correo.trim() !== "" && !isValidEmail(correo)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Correo no válido",
        button: "Cerrar",
      });
      return;
    }

    // Indicar que el envío de datos está en curso
    setIsLoading(true);

    // Datos a enviar en el cuerpo de la solicitud
    const data = {
      distrito_id: distritoId,
      tipo_falla_id: tipoFallaId,
      descripcion: descripcion,
      latitud: latitude,
      longitud: longitude,
      telefono_contacto: telefono,
      nombre_contacto: nombre,
      correo_contacto: correo,
      usuario_id: usuarioId,
      imagen: image ? image.base64 : null,
    };

    console.log(data);

    // URL de la API
    const apiUrl = `${API_HOST}/api_reporte_falla`;

    console.log(apiUrl);

    // Configuración de la solicitud
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convierte los datos a formato JSON
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const responseBody = await response.json(); // Lee el cuerpo de la respuesta una vez

      console.log("Body:", responseBody);

      // Manejar la respuesta del servidor
      if (!response.ok) {
        throw new Error(
          `Error al realizar la solicitud: ${response.status} - ${response.statusText}`
        );
      }

      if (responseBody.value === "1") {
        alert("Registro ingresado correctamente");

        // Resetear variables
        setDepartamentoId(null);
        setDistritoId(null);
        setTipoFallaId(null);
        setDescripcion("");
        setNombre("");
        setTelefono("");
        setCorreo("");
        setImage(null);

        navigation.navigate("ReporteFalla", { screen: "ReporteIndexStack" });

      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Error al realizar la solicitud",
          button: "Cerrar",
        });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al realizar la solicitud",
        button: "Cerrar",
      });
      console.error("Error al realizar la solicitud:", error);
    } finally {
      setIsLoading(false); // Desactivar el indicador de carga después de que la solicitud se haya completado
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
        // Cargar el archivo desde la ruta (uri) y convertirlo a base64
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        });

        setImage({ uri: result.assets[0].uri, base64 });
      }
    } catch (error) {
      console.error("Error al seleccionar una imagen", error);
    }
  };

  // Agrega una nueva función para manejar la toma de una foto
  const tomarFoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const { assets } = result;
        const response = await fetch(assets[0].uri);
        const blob = await response.blob();
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        });

        setImage({ uri: assets[0].uri, base64 });
      }
    } catch (error) {
      console.error("Error al tomar una foto", error);
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
                if (value !== departamentoId && value !== "") {
                  console.log("dataaa ", departamentoId, " ", value);
                  setDepartamentoId(value);
                  fetchDataMunicipios(value);
                }
              }}
              value={departamentoId}
              placeholder={{
                label: "Selecciona un tipo",
                value: null,
              }}
            />
          )}
        </View>

        <View style={styles.formControl}>
          {municipios && (
            <RNPickerSelect
              items={municipios.map((municipio) => ({
                label: municipio.label,
                value: municipio.value,
              }))}
              onValueChange={(value) => {
                if (value !== municipioId && value !== "") {
                  console.log(value, " data ", municipioId);
                  setMunicipioId(value);
                  fetchDataDistritos(value);
                }
              }}
              value={municipioId}
              placeholder={{
                label: "Selecciona un municipio",
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
          <Text style={styles.label}>CORREO CONTACTO</Text>
          <TextInput
            style={styles.textInput}
            value={correo}
            onChangeText={setCorreo}
          />
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>TELÉFONO</Text>
          <MaskedTextInput
            mask="9999-9999"
            onChangeText={handleInputChange}
            style={styles.input}
            keyboardType="numeric"
            value={telefono}
          />
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>FOTOGRAFÍA</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={{ alignItems: "center" }}
            >
              <AntDesign name="paperclip" size={24} color="black" />
              <Text>Adjuntar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={tomarFoto}
              style={{ alignItems: "center" }}
            >
              <AntDesign name="camerao" size={24} color="black" />
              <Text>Tomar foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formControlImage}>
            {image && (
              <Image
                source={{ uri: image.uri }}
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

        <View style={styles.formControlImage}>
          {isLoading && <ActivityIndicator size="large" color="#0F172A" />}
        </View>
      </View>
      <AlertNotificationRoot></AlertNotificationRoot>
    </ScrollView>
  );
}
