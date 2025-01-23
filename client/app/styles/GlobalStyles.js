import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bckgLight: {
    backgroundColor: "#fff",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#ffbae4",
  },
  btnContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  btnText: {
    color: "#151718",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnText: {
    color: "#151718",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  btnTextLight: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnLight: {
    backgroundColor: "#ffbae4",
  },
  btnDark: {
    backgroundColor: "#585ce5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  redBtn: {
    backgroundColor: "#fd7672",
  },
});

export default globalStyles;
