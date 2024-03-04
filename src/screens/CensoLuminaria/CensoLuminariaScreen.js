import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import React, { useState, useEffect } from "react";

import { API_HOST } from "../../utils/constants";
import { styles } from "./CensoLuminariaStyles";
import { dropStyles } from "./CensoLuminariaStyles";
import { Dropdown } from "react-native-element-dropdown";
import RNPickerSelect from "react-native-picker-select";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import {  Icon } from "react-native-elements";

import { useSession } from "../../utils/SessionContext";

export function CensoLuminariaScreen(props) {
  const {
    latitude,
    longitude,
    idDepartamento,
    idDistrito,
    Direccion,
  } = props.route.params;
  const { navigation } = props;

  const { userId, userName, userEmail } = useSession();

  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoId, setDepartamentoId] = useState();
  const [distritos, setDistritos] = useState([]);
  const [distritoId, setDistritoId] = useState();
  const [municipios, setMunicipios] = useState([]);
  const [municipioId, setMunicipioId] = useState();

  const [tipoLuminaria, setTipoLuminaria] = useState([]);
  const [tipoLuminariaId, setTipoLuminariaId] = useState();

  const [potenciaPromedio, setPotenciaPromedio] = useState([]);
  const [potenciaPromedioId, setPotenciaPromedioId] = useState("");

  const [consumoPromedio, setConsumoPromedio] = useState("");
  const [potenciaNominal, setPotenciaNominal] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [direccion, setDireccion] = useState("");

  const [condicionLampara, setCondicionLampara] = useState(false);
  const [tiposFalla, setTiposFalla] = useState([]);
  const [tiposFallaId, setTiposFallaId] = useState();
  const [observacion, setObservacion] = useState();

  const [puntosCercanos, setPuntosCercanos] = useState();

  const toggleSwitch = () => {
    setCondicionLampara((previousState) => !previousState);
    setTiposFallaId(""); // Esto reseteará `tiposFallaId` a una cadena vacía cada vez que se llame a toggleSwitch
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("puntosCercanos",puntosCercanos);
      setDepartamentoId(idDepartamento);
      if (idDistrito) {
        setDistritoId(idDistrito);

        const response = await fetch(
          `${API_HOST}/api_get_municipio_id/${idDistrito}`
        );
        const result = await response.json();
        if (result) {
          setMunicipioId(result.municipioId);
        }
      }
      setDireccion(Direccion);
      const response = await fetch(
        `${API_HOST}/api_censo_luminaria/get_data_create/${idDepartamento}/${idDistrito}/${latitude}/${longitude}`
      );
      const result = await response.json();

      const DepartamentoArray = [];
      for await (const departamento of result.departamentos) {
        DepartamentoArray.push({
          value: departamento.id,
          label: departamento.nombre,
        });
      }
      setDepartamentos(DepartamentoArray);

      const MunicipioArray = [];
      for await (const municipio of result.municipios) {
        MunicipioArray.push({
          value: municipio.id,
          label: municipio.nombre,
        });
      }
      setMunicipios(MunicipioArray);

      const DistritoArray = [];
      for await (const distrito of result.distritos) {
        DistritoArray.push({
          value: distrito.id,
          label: distrito.nombre,
        });
      }
      setDistritos(DistritoArray);

      const tipoLuminariaArray = [];
      for await (const tipo of result.tipos) {
        tipoLuminariaArray.push({
          value: tipo.id,
          label: tipo.nombre,
        });
      }
      setTipoLuminaria(tipoLuminariaArray);

      const tipoFallaArray = [];
      for await (const tipo of result.tipos_falla) {
        tipoFallaArray.push({
          value: tipo.id,
          label: tipo.nombre,
        });
      }
      setTiposFalla(tipoFallaArray);
      setPuntosCercanos(result.puntosCercanos);
      console.log("tipos falla", tipoFallaArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataMunicipios = async (value) => {
    //console.log(value);
    try {
      const url = `${API_HOST}/api_get_municipios/${value}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud. Código de estado: ${response.status}`
        );
      }

      const data = await response.json();

      const municipiosArray = [];
      for await (const municipio of data.municipios) {
        municipiosArray.push({
          value: municipio.id,
          label: municipio.nombre,
        });
      }

      setMunicipios(municipiosArray);
      //console.log(distritosArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      console.log(value);
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
      console.log("dattaa:  ", data);
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
        //setPotenciaPromedioShow();
        console.log("show 1");
      } else {
        setPotenciaPromedio([]);
        setIsEditable(true);
        console.log("show 2");
        //setPotenciaPromedioShow(false);
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

  const calculoPotencia = () => {
    if (potenciaNominal !== "" && parseFloat(potenciaNominal) > 0) {
      let consumo_mensual = (parseFloat(potenciaNominal) * 360) / 1000;
      //console.log("El usuario abandonó el campo de entrada", consumo_mensual);
      setConsumoPromedio(consumo_mensual.toString()); // Convertir a cadena
    } else {
      setConsumoPromedio("");
    }
  };

  const handSendData = async (value) => {
    if (!latitude || !longitude) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Las coordenadas ya han sido registradas o no son accesibles",
        button: "Cerrar",
      });
      return;
    }
    // Validar que los campos obligatorios no sean nulos
    if (!distritoId || !tipoLuminariaId) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, completa todos los campos obligatorios.",
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
    } else if (condicionLampara == false && !tiposFallaId) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, seleccionar el tipo de falla.",
        button: "Cerrar",
      });
      return;
    }
    //9999
    else {
      // Datos a enviar en el cuerpo de la solicitud
      const data = {
        usuario: userId,
        latitud: latitude,
        longitud: longitude,
        distrito_id: distritoId,
        direccion: direccion,
        tipo_luminaria_id: tipoLuminariaId,
        potencia_nominal: potenciaNominal,
        potencia_promedio: potenciaPromedioId,
        consumo_mensual: consumoPromedio,
        condicion_lampara: condicionLampara,
        tipo_falla: tiposFallaId,
        observacion: observacion,
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

        console.log(responseBody);

        if (responseBody.value === 1) {
          // Restablecer variables a su estado original
          setTipoLuminariaId(null);
          setPotenciaPromedio([]);
          setConsumoPromedio("");
          setPotenciaNominal("");
          setIsEditable(false);
          setObservacion("");
          setCondicionLampara(false);

          navigation.navigate("CensoLuminariaCodigoQrStack", {
            codigo: responseBody.codigo,
          });
        }
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Error al realizar la solicitud..",
          button: "Cerrar",
        });
        return;
        console.error("Error al realizar la solicitud:", error);
      }
    }
  };

  return (
    <ScrollView>
       {puntosCercanos > 0 && (
      <View
        style={{
          backgroundColor: "yellow",
          padding: 10,
          borderRadius: 5,
          margin: 10,
        }}
      >
       
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="warning" type="font-awesome" color="black" size={24} />
          <Text style={{ fontSize: 16, marginLeft: 5 }}>
            Existen puntos cercanos ya registrados. Por favor verifica
          </Text>
        </View>
       
      </View> )}
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
                  fetchDataMunicipios(value);
                }
              }}
              value={departamentoId}
              placeholder={{
                label: "Selecciona un departamento",
                value: null,
              }}
            />
          )}
        </View>

        <Text style={styles.label}>MUNICIPIO</Text>
        <View style={styles.formControl}>
          {municipios && (
            <Dropdown
              style={dropStyles.dropdown}
              placeholderStyle={dropStyles.placeholderStyle}
              selectedTextStyle={dropStyles.selectedTextStyle}
              inputSearchStyle={dropStyles.inputSearchStyle}
              iconStyle={dropStyles.iconStyle}
              data={municipios}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="SELECCIONAR"
              searchPlaceholder="BUSCAR..."
              value={municipioId}
              onChange={(item) => {
                if (item.value !== municipioId) {
                  setMunicipioId(item.value);
                  fetchDataDistritos(item.value);
                }
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

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>DIRECCIÓN</Text>
          <TextInput
            style={styles.textInput}
            value={direccion}
            onChangeText={setDireccion}
            multiline
            numberOfLines={3}
          />
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

        {isEditable == false && (
          <View>
            <Text style={styles.label}>POTENCIA PROMEDIO(Voltio)</Text>

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
          </View>
        )}

        {isEditable == true && (
          <View style={styles.formControlNumber}>
            <Text style={styles.label}>POTENCIA NOMINAL (Vatio)</Text>
            <TextInput
              style={styles.textInput}
              value={potenciaNominal}
              onChangeText={setPotenciaNominal}
              editable={isEditable}
              keyboardType="numeric"
              onBlur={calculoPotencia}
            />
          </View>
        )}

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>CONSUMO MENSUAL (Kwh)</Text>
          <TextInput
            style={styles.textInput}
            value={consumoPromedio}
            editable={false}
          />
        </View>

        <View style={{ flex: 1, justifyContent: "flex-start", paddingTop: 5 }}>
          <Text style={styles.label}>
            ¿ESTÁ LA LÁMPARA EN BUENAS CONDICIONES?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 20,
              paddingTop: 10,
            }}
          >
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={condicionLampara ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={condicionLampara}
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // Ajusta estos valores según necesites
            />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>
              {" "}
              {condicionLampara ? "Si" : "No"}
            </Text>
          </View>
        </View>

        {condicionLampara == false && (
          <View>
            <Text style={styles.label}>TIPO FALLA</Text>

            <View style={styles.formControl}>
              {tipoLuminaria && (
                <RNPickerSelect
                  items={tiposFalla.map((tipo) => ({
                    label: tipo.label,
                    value: tipo.value,
                  }))}
                  onValueChange={(value) => {
                    if (value !== tiposFallaId && value !== "") {
                      setTiposFallaId(value);
                    }
                  }}
                  value={tiposFallaId}
                  placeholder={{
                    label: "Selecciona un tipo",
                    value: null,
                  }}
                />
              )}
            </View>
          </View>
        )}

        <View style={styles.formControlNumber}>
          <Text style={styles.label}>OBSERVACIÓN</Text>
          <TextInput
            style={styles.textInput}
            value={observacion}
            onChangeText={setObservacion}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: "#0F172A",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            marginTop: 10,
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
