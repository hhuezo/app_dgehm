import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";

import { API_HOST } from "../../utils/constants";
import { styles } from "./CensoLuminariaStyles";
import { dropStyles } from "./CensoLuminariaStyles";
import { Dropdown } from "react-native-element-dropdown";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

import * as Location from "expo-location";

export function CensoLuminariaScreen() {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoId, setDepartamentoId] = useState();
  const [distritos, setDistritos] = useState([]);
  const [distritoId, setDistritoId] = useState();
  const [tipoLuminaria, setTipoLuminaria] = useState([]);
  const [tipoLuminariaId, setTipoLuminariaId] = useState();

  const [codigo, setCodigo] = useState("");
  const [potenciaPromedio, setPotenciaPromedio] = useState([]);
  const [potenciaPromedioId, setPotenciaPromedioId] = useState("");

  const [consumoPromedio, setConsumoPromedio] = useState("");
  const [potenciaNominal, setPotenciaNominal] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [dencidad, setDencidad] = useState("");

  //localización
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //para manejo de datepicker
  const [dateFecha, setDateFecha] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateFecha;
    setShow(Platform.OS === "ios");

    setDateFecha(currentDate);
    //console.log(currentDate);
  };

  const showMode = () => {
    setShow(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log("hola");
        const response = await fetch(`${API_HOST}/api_censo_luminaria/create`);
        const result = await response.json();

        const DepartamentoArray = [];
        for await (const departamento of result.departamentos) {
          DepartamentoArray.push({
            value: departamento.id,
            label: departamento.nombre,
          });
        }

        //console.log(DepartamentoArray);
        setDepartamentos(DepartamentoArray);

        const TipoLuminariaArray = [];
        for await (const tipo of result.tipos) {
          TipoLuminariaArray.push({
            value: tipo.id,
            label: tipo.nombre,
          });
        }
        setTipoLuminaria(TipoLuminariaArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    fetchData();
    getLocation();
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

  const fetchPotenciaPromedio = async (value) => {
    try {
      setTipoLuminariaId(value);
      setPotenciaPromedioId("");
      setPotenciaPromedio([]);
      const url = `${API_HOST}/api_censo_luminaria/get_potencia_promedio/${value}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud. Código de estado: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(data);
      if (data && data.value === 1) {
        const potenciasArray = [];
        for await (const potencia of data.potencia_promedio) {
          potenciasArray.push({
            value: potencia.id,
            label: potencia.potencia,
          });
        }
        setPotenciaPromedio(potenciasArray);
        setIsEditable(false);
      } else {
        setPotenciaPromedio([]);
        setIsEditable(true);
      }
      setConsumoPromedio("");

      setPotenciaNominal("");
    } catch (error) {
      setPotenciaPromedio([]);
      setPotenciaNominal("");
      console.error("Error fetching data:", error);
    }
  };

  const fetchConsumoMensual = async (value) => {
    try {
      if (value !== null) {
        setPotenciaPromedioId(value);
        const url = `${API_HOST}/api_censo_luminaria/get_consumo_mensual/${value}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Error en la solicitud. Código de estado: ${response.status}`
          );
        }

        const data = await response.json();

        const { consumo_promedio } = data;
        setConsumoPromedio(consumo_promedio.toString());
      }

      // console.log(consumo_promedio);
    } catch (error) {
      console.error("Error fetching data fetchConsumoMensual:", error);
    }
  };

  const handSendData = async (value) => {
    // Validar que los campos obligatorios no sean nulos

    console.log(potenciaPromedioId, isEditable);
    if (
      !distritoId ||
      !tipoLuminariaId ||
      !dencidad ||
      !dateFecha ||
      !location ||
      !codigo
    ) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, completa todos los campos obligatorios1.",
        button: "Cerrar",
      });
      return;
    } else if (isEditable == true && !potenciaNominal) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, completa el campo de potencia nominal.",
        button: "Cerrar",
      });
      return;
    } else if (isEditable == false && !potenciaPromedioId) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, seleccionar potencia promedio.",
        button: "Cerrar",
      });
      return;
    }
    //9999
   else if (dencidad > 9999.0) {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Error",
      textBody: "La dencidad luminicia esta fuera de rango, la deciada debe ser menor a 10,000.0",
      button: "Cerrar",
    });
    return;
  }
    else {
      console.log("aaa");

      const formattedDate = `${dateFecha.getFullYear()}-${padZero(
        dateFecha.getMonth() + 1
      )}-${padZero(dateFecha.getDate())}`;

      function padZero(value) {
        return value < 10 ? `0${value}` : `${value}`;
      }

      // Datos a enviar en el cuerpo de la solicitud

      var dencidad_decimal = parseFloat(dencidad);
      const data = {
        distrito_id: distritoId,
        tipo_luminaria_id: tipoLuminariaId,
        potencia_nominal: potenciaNominal,
        latitud: location.coords.latitude,
        longitud: location.coords.longitude,
        consumo_mensual: consumoPromedio,
        fecha_ultimo_censo: formattedDate,
        codigo_luminaria: codigo,
        dencidad_luminicia: dencidad_decimal,
      };

       // URL de la API
       const apiUrl = `${API_HOST}/api_censo_luminaria`;
       console.log(data);
       // Configuración de la solicitud
       const requestOptions = {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(data), // Convierte los datos a formato JSON
         
       };
 
       try {
         response = await fetch(apiUrl, requestOptions);
 
         const responseBody = await response.json(); // Lee el cuerpo de la respuesta una vez
 
         console.log("Body:", responseBody);
 
         // Manejar la respuesta del servidor
         if (!response.ok) {
           throw new Error(
             `Error al realizar la solicitud: ${response.status} - ${response.statusText}`
           );
         }
 
         //alert(responseBody.mensaje);
 
         if (responseBody.value === 1) {
           Dialog.show({
             type: ALERT_TYPE.SUCCESS,
             title: "Ok",
             textBody: "Regitro ingresado correctamente",
             button: "Cerrar",
           }); 

           return;
 
 
         }
       } catch (error) {
         Dialog.show({
           type: ALERT_TYPE.DANGER,
           title: "Error",
           textBody: "Error al realizar la solicitud",
           button: "Cerrar",
         });
         return;
         console.error("Error al realizar la solicitud:", error);
       }
    }
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
                if (value !== departamentoId) {
                  setDepartamentoId(value);
                  fetchDataDistritos(value);
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
                if (item.value !== distritoId) {
                  setDistritoId(item.value);
                }
              }}
            />
          )}
        </View>

        <Text style={styles.label}>TIPO LUMINARIA</Text>

        <View style={styles.formControl}>
          {tipoLuminaria && (
            <RNPickerSelect
              items={tipoLuminaria.map((tipo) => ({
                label: tipo.label,
                value: tipo.value,
              }))}
              onValueChange={(value) => {
                if (value !== tipoLuminariaId && value !== "") {
                  fetchPotenciaPromedio(value);
                }
              }}
              value={tipoLuminariaId}
              placeholder={{
                label: "Selecciona un tipo",
                value: null,
              }}
            />
          )}
        </View>

        <Text style={styles.label}>POTENCIA PROMEDIO</Text>

        <View style={styles.formControl}>
          {potenciaPromedio && (
            <RNPickerSelect
              items={potenciaPromedio.map((potencia) => ({
                label: potencia.label,
                value: potencia.value,
              }))}
              onValueChange={(value) => {
                if (value !== potenciaPromedioId) {
                  fetchConsumoMensual(value);
                }
              }}
              value={potenciaPromedioId}
              placeholder={{
                label: "Selecciona un tipo",
                value: null,
              }}
            />
          )}
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>CODIGO LUMINARIA</Text>
          <TextInput
            style={styles.textInput}
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>CONSUMO MENSUAL</Text>
          <TextInput
            style={styles.textInput}
            value={consumoPromedio}
            editable={false}
          />
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>POTENCIA NOMINAL</Text>
          <TextInput
            style={styles.textInput}
            value={potenciaNominal}
            onChangeText={setPotenciaNominal}
            editable={isEditable}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>DENCIDAD LUMINICIA</Text>
          <TextInput
            style={styles.textInput}
            value={dencidad}
            onChangeText={setDencidad}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>FECHA ULTIMO CENSO</Text>
        <View style={styles.inputDate}>
          <TouchableOpacity onPress={showMode}>
            <TextInput
              style={styles.inputDate}
              editable={false}
              value={"   " + dateFecha.toLocaleDateString()}
            />
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateFecha}
            mode={"date"}
            display="default"
            onChange={onChange}
          />
        )}

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
      <AlertNotificationRoot></AlertNotificationRoot>
    </ScrollView>
  );
}
