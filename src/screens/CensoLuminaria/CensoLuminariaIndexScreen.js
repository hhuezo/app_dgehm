import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Card } from "react-native-elements";

export function CensoLuminariaIndexScreen(props) {
  const { navigation } = props;
  const goToMapa = () => {
    navigation.navigate("CensoLuminariaMapaStack");
    console.log("hola");
  };
  return (
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
              style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}
            >
              ¿Como registrar un censo?
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}
