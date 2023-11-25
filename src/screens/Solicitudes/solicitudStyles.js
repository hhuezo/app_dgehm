import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    loadingContainer: {
      position: "absolute !important",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)", // Ajusta la opacidad y color según tus necesidades
    },
    cardContainer: {
      // Ajusta el estilo de la tarjeta según tus necesidades
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    titleColumn: {
      flex: 1, // Ajusta el ancho de las columnas según tus necesidades
    },
    alignRight: {
      textAlign: "right",
    },
    boldText: {
      fontWeight: "bold",
    },
    bodyContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 5,
    },
    bodyColumn: {
      flex: 1, // Ajusta el ancho de las columnas según tus necesidades
    },
    borderBlue: {
      borderColor: "#0F172A",
      borderWidth: 2,
    },
  
    borderGreen: {
      borderColor: "#00B8D4",
      borderWidth: 2,
    },
    cardWithMargin: {
      marginBottom: 150,
    },
    noDataText: {
      color: "red",
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
    },
    container: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    scrollView: {
      flexGrow: 1,
      paddingBottom: 60, // Ajusta según el tamaño del botón
    },
    fab: {
      position: "absolute",
      bottom: 16,
      right: 16,
      zIndex: 1, // Asegura que el botón esté por encima del ScrollView
    },
  });
  