import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "./AddSolicitudStyles";
import { dropStyles } from "./AddSolicitudStyles";
import { API_HOST } from "../../utils/constants";
import { Dropdown } from "react-native-element-dropdown";

import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export function AddSolicitudScreen(props) {
  const [data, setData] = useState(null);  
  const [selectedSolicitante, setSelectedSolicitante] = useState(null);
  const [selectedFiador, setSelectedFiador] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);

  const [solicitantes, setSolicitantes] = useState([]);
  const [fiadores, setFiadores] = useState([]);

  //para manejo de datepicker
  const [dateFecha, setDateFecha] = useState(new Date());
  const [show, setShow] = useState(false);

  const [cantidad, setCantidad] = useState("");
  const [meses, setMeses] = useState("");

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
        const response = await fetch(`${API_HOST}/api-solicitud/create`);
        const result = await response.json();
        setData(result);
        //console.log(result);

        const solicitantesArray = [];
        for await (const solicitante of result.solicitantes) {
          solicitantesArray.push({
            value: solicitante.Id,
            label: solicitante.Nombre,
          });
        }

        setSolicitantes(solicitantesArray);

        //console.log(solicitantes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchDataFiador = async (value) => {
    //console.log(value);
    try {
      const url = `${API_HOST}/api-solicitud/getFiador/${value}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud. Código de estado: ${response.status}`
        );
      }

      const data = await response.json();

      const fiadoresArray = [];
      for await (const fiador of data) {
        fiadoresArray.push({
          value: fiador.Id,
          label: fiador.Nombre,
        });
      }

      setFiadores(fiadoresArray);

      // console.log(fiadoresArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handSendData = async () => {
    // Validar que los campos obligatorios no sean nulos
    if (!selectedSolicitante || !selectedTipo || !selectedFiador) {
      //alert("Por favor, completa todos los campos obligatorios.");
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, completa todos los campos obligatorios.",
        button: "Cerrar",
      });
      return;
    }

    

    // Validar que cantidad y meses no sean nulos y sean mayores a 0
    if (!cantidad || !meses || cantidad <= 0 || meses <= 0) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Cantidad y meses deben ser valores numéricos mayores a 0.",
        button: "Cerrar",
      });
      return;
    }

    // Validar que meses no sea un número decimal
    if (meses % 1 !== 0) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Meses no puede ser un número decimal.",
        button: "Cerrar",
      });
      return;
    }

    //const dateFecha = new Date("2023-11-21T04:57:09.375Z");

    const formattedDate = `${dateFecha.getFullYear()}-${padZero(
      dateFecha.getMonth() + 1
    )}-${padZero(dateFecha.getDate())}`;

    function padZero(value) {
      return value < 10 ? `0${value}` : `${value}`;
    }

    // Datos a enviar en el cuerpo de la solicitud
    const data = {
      Solicitante: selectedSolicitante,
      Tipo: selectedTipo,
      Fiador: selectedFiador,
      Cantidad: cantidad,
      Meses: meses,
      Fecha: formattedDate,
    };

    //console.log(data);

    // URL de la API
    const apiUrl = `${API_HOST}/api-solicitud`;

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

      //console.log("Body:", responseBody);

      // Manejar la respuesta del servidor
      if (!response.ok) {
        throw new Error(
          `Error al realizar la solicitud: ${response.status} - ${response.statusText}`
        );
      }

      alert(responseBody.message);

      if (responseBody.value === "1") {
        const { navigation } = props;
        navigation.navigate("Solicitudes", { screen: "SolicitudesStack" });
      }

      // Obtener y manejar la respuesta del servidor, si es necesario
      //const responseData = await response.json();
      //console.log(responseData);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <ScrollView>
     
      <View style={styles.container}>
        <Text style={styles.label}>FECHA</Text>
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

        <Text style={styles.label}>SOLICITANTE</Text>
        <View style={styles.formControl}>
          {solicitantes && (
            <Dropdown
              style={dropStyles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={solicitantes}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Seleccionar"
              searchPlaceholder="Buscar..."
              value={selectedSolicitante}
              onChange={(item) => {
                setSelectedSolicitante(item.value);
                fetchDataFiador(item.value);
              }}
            />
          )}
        </View>

        <Text style={styles.label}>FIADOR</Text>
        <View style={styles.formControl}>
          {fiadores && (
            <Dropdown
              style={dropStyles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={fiadores}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Seleccionar"
              searchPlaceholder="Buscar..."
              value={selectedFiador}
              onChange={(item) => {
                setSelectedFiador(item.value);
              }}
            />
          )}
        </View>

        <Text style={styles.label}>TIPO DE CRÉDITO</Text>

        <View style={styles.formControl}>
          {data && (
            <RNPickerSelect
              items={data.tipos.map((tipo) => ({
                label: tipo.Nombre,
                value: tipo.Id,
              }))}
              onValueChange={(value) => {
                setSelectedTipo(value);
              }}
              value={selectedTipo}
              placeholder={{
                label: "Selecciona un tipo",
                value: null,
              }}
            />
          )}
        </View>
        <View style={styles.formControlNumber}>
          <Text style={styles.label}>CANTIDAD</Text>
          <TextInput
            style={styles.inputNumber}
            keyboardType="numeric"
            value={cantidad}
            onChangeText={setCantidad}
          />
        </View>
        <View style={styles.formControlNumber}>
          <Text style={styles.label}>MESES</Text>
          <TextInput
            style={styles.inputNumber}
            keyboardType="numeric"
            value={meses}
            onChangeText={setMeses}
          />
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
