import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  btnDark: {
    backgroundColor: "#585ce5",
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  buddyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  buddyName: {
    fontSize: 16,
  },
  buddyBirthday: {
    fontSize: 14,
    color: "#aaa",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default styles;
