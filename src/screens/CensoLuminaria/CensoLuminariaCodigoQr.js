import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card, Icon } from "react-native-elements";
import React from "react";
import QRCode from "react-native-qrcode-svg";

export function CensoLuminariaCodigoQr(props) {
  const { codigo } = props.route.params;
  console.log("codigo",codigo);
  const { navigation } = props;

  const goToCenso = async (value) => {
    navigation.navigate("CensoLuminariaIndex");
  };
  return (
    <View>

        <Card style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
          <QRCode
            value={codigo} // Este es el valor que el código QR representará
            size={200} // Tamaño del código QR
            color="black" // Color del QR
            backgroundColor="white" // Color de fondo del QR
          />
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Código: {codigo}
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
            marginTop: 10,
          }}
          onPress={goToCenso}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Volver</Text>
        </TouchableOpacity>
        </Card>
    </View>
  );
}
