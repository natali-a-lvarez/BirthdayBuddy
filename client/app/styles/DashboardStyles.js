import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
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
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  upcomingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  upcomingList: {
    marginTop: 10,
  },
  upcomingItem: {
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ageText: {
    fontSize: 16,
    color: "#999",
  },
});

export default styles;
