import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "./AddSolicitudStyles";
import { dropStyles } from "./AddSolicitudStyles";
import { API_HOST } from "../../utils/constants";
import { Dropdown } from "react-native-element-dropdown";

import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";

import {  ALERT_TYPE,  Dialog,  AlertNotificationRoot,  Toast,} from "react-native-alert-notification";

export function EditSolicitudScreen(props) {
  const id = props.route.params.id;

  const { navigation } = props;

  const [data, setData] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [solicitantes, setSolicitantes] = useState([]);

  const [numero, setNumero] = useState([]);

  const [dateFecha, setDateFecha] = useState();
  const [solicitante, setSolicitante] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [meses, setMeses] = useState([]);

  const [show, setShow] = useState(false);

  const showMode = () => {
    setShow(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${API_HOST}/api-solicitud/${id}/edit`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();

      setData(data);

      const solicitantesArray = [];
      for await (const solicitante of data.solicitantes) {
        solicitantesArray.push({
          value: solicitante.Id,
          label: solicitante.Nombre,
        });
      }
      setSolicitantes(solicitantesArray);

      const { Numero } = data.solicitud;
      const { Fecha } = data.solicitud;
      const { Solicitante } = data.solicitud;
      const { Monto } = data.solicitud;
      const { Meses } = data.solicitud;
      const { Tipo } = data.solicitud;
      

      const fechaObjeto = new Date(Fecha + " 00:00:00");

      setNumero(Numero.toString());
      setDateFecha(fechaObjeto);
      setSolicitante(Solicitante);
      setCantidad(Monto);
      setMeses(Meses.toString());
      setTipo(Tipo);
      //console.log(meses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateFecha;
    setShow(Platform.OS === "ios");

    setDateFecha(currentDate);
  };

  const handSendData = async () => {
    // Validar que los campos obligatorios no sean nulos
    if (!solicitante || !tipo) {
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
   
   // const dateFecha = new Date(dateFecha);

    const formattedDate = `${dateFecha.getFullYear()}-${padZero(
      dateFecha.getMonth() + 1
    )}-${padZero(dateFecha.getDate())}`;

    function padZero(value) {
      return value < 10 ? `0${value}` : `${value}`;
    }

    console.log(formattedDate);

    
    // Datos a enviar en el cuerpo de la solicitud
    const data = {
      Solicitante: solicitante,
      Tipo: tipo,
      Monto: cantidad,
      Meses: meses,
      Fecha: formattedDate,
    };



    //console.log(data);

    // URL de la API
    const apiUrl = `${API_HOST}/api-solicitud/${id}`;

    // Configuración de la solicitud
    const requestOptions = {
      method: "PUT",
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

     //alert(responseBody.message);

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Ok",
        textBody: responseBody.message,
        button: "Cerrar",
      });

      if (responseBody.value === "1") {
        const { navigation } = props;
        //navigation.navigate("Solicitudes", { screen: "SolicitudesStack" });
      }

      // Obtener y manejar la respuesta del servidor, si es necesario
      //const responseData = await response.json();
      //console.log(responseData);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const goToRecibos = (id) => {
    console.log(id);
  };

  return (
    <ScrollView>
      <View style={styles.container}>

      <View style={styles.formControlNumber}>
          <Text style={styles.label}>NÚMERO</Text>
          
          <TextInput
            style={styles.inputNumber}
            keyboardType="numeric"
            value={numero}
            editable={false}
          />
        </View>


        <Text style={styles.label}>FECHA</Text>
        <View style={styles.inputDate}>
          <TouchableOpacity onPress={showMode}>
            {dateFecha && (
              <TextInput
                style={styles.inputDate}
                editable={false}
                value={"  " + dateFecha.toLocaleDateString()}
              />
            )}
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
              value={solicitante}
              onChange={(item) => {
                setSelectedSolicitante(item.value);
                fetchDataFiador(item.value);
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
                setTipo(value);
              }}
              value={tipo}
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
