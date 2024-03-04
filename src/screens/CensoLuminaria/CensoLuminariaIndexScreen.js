import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Card, Icon } from "react-native-elements";

import { useSession } from "../../utils/SessionContext";

export function CensoLuminariaIndexScreen(props) {
  const { navigation } = props;
  const { userId, userName, userEmail } = useSession();

  const goToMapa = () => {
    navigation.navigate("CensoLuminariaMapaStack");
  };
  const handInicioSesion = () => {
    navigation.navigate("Login");
  };
  
  return (
    <View>
      
  {/*{!userName ? (
        <Card>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../.././assets/account.png")}
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
                Acceso denegado, debe iniciar sesión
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: "#0F172A",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              flexDirection: "row", // Añade esta propiedad para alinear el ícono y el texto en una fila
              paddingLeft: 10, // Espaciado a la izquierda del contenedor para separar el ícono del texto
            }}
            onPress={handInicioSesion}
          >
    
            <Text style={{ color: "white", fontSize: 23, marginLeft: 10 }}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </Card>
          ) : ( )}*/}
        <View>
          <TouchableOpacity onPress={goToMapa}>
            <Card style={{ alignItems: "center" }}>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../.././assets/falla.png")}
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
                    Censo de luminaria
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          <Card style={{ alignItems: "center" }}>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../.././assets/tutorial.png")}
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
                  ¿Como registrar un censo?
                </Text>
              </View>
            </View>
          </Card>
        </View>
     
    </View>
  );
}
