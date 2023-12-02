import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  datePicker: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    borderColor: "#D5D8DC",
    borderWidth: 1,
    marginRight: 10,
    height: 50,
    fontSize: 16,
    color: "black",
  },

  inputNumber: {
    borderColor: "#D5D8DC",
    borderWidth: 1,
    height: 50,
    fontSize: 18,
    paddingLeft: 10,
    fontWeight: "bold",
  },

  inputDate: {
    borderColor: "#D5D8DC",
    borderWidth: 1,
    height: 50,
    fontSize: 16,
    color: "black",
    marginBottom: 16,
  },

  formControl: {
    borderWidth: 1,
    borderColor: "#D5D8DC",
    marginBottom: 16,
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },

  formControlNumber: {
    marginBottom: 16,
  },

  formControlImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    resizeMode: 'cover',
  },
});

export const dropStyles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 25,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
