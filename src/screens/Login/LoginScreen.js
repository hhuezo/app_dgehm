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
import { Card, Icon } from "react-native-elements";

import { API_HOST } from "../../utils/constants";
import { useSession } from "../../utils/SessionContext";

import { styles } from "./Styles";

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";



export function LoginScreen(props) {
  const { navigation } = props;
  const { userId, userName, userEmail } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserId, setUserName, setUserEmail } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const handSendData = async (value) => {
    if (!email || !password) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, completa todos los campos obligatorios.",
        button: "Cerrar",
      });
      return;
    }

    // Validación del correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Por favor, ingresa un correo electrónico válido.",
        button: "Cerrar",
      });
      return;
    }

    setIsLoading(true); // Inicia el indicador de carga

    const data = {
      email: email,
      password: password,
    };

    // URL de la API
    const apiUrl = `${API_HOST}/login`;
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

      if (responseBody.value === 1) {
        //obteniendo los valores de la respuesta
        const { id, name, email } = responseBody.user;

        //guardando variables de sesion
        setUserId(id);
        setUserName(name);
        setUserEmail(email);
      } else {

        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "error",
          textBody: "Credenciales incorrectas",
          button: "Cerrar",
        });

        return;
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    } finally {
      setIsLoading(false); // Detiene el indicador de carga independientemente del resultado
    }

    console.log("hola");
  };

  const handleLogout = async (value) => {
    setUserId("");
    setUserName("");
    setUserEmail("");
  };

  return (
    <ScrollView>
        <AlertNotificationRoot></AlertNotificationRoot>
      {userName ? (
        <Card>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../.././assets/user.png")}
              style={{ width: 150, height: 150, padding: 20 }}
            />
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Bienvenid@ {userName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: "#F1595C",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              flexDirection: "row", // Añade esta propiedad para alinear el ícono y el texto en una fila
              paddingLeft: 10, // Espaciado a la izquierda del contenedor para separar el ícono del texto
            }}
            onPress={handleLogout}
          >
            <Icon
              type="material-community"
              name={"account-cancel"}
              color={"white"}
              size={30}
            />
            <Text style={{ color: "white", fontSize: 23, marginLeft: 10 }}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <View style={styles.container}>
 

          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../.././assets/logo-negro.png")}
              style={{ width: 150, height: 150, padding: 20 }}
            />
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Iniciar sesión
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Correo</Text>
          <View style={styles.formControl}>
            <TextInput
              style={styles.textInput}
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.formControl}>
            <TextInput
              style={styles.textInput}
              secureTextEntry
              onChangeText={setPassword}
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
            <Text style={{ color: "white", fontSize: 18 }}>Aceptar</Text>
          </TouchableOpacity>

          {isLoading && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      )}
    
    </ScrollView>
  );
}
