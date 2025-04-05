import { Font, StyleSheet } from "@react-pdf/renderer";
import OpenSans from "../../assets/OpenSans-Regular.ttf";
import OpenSansBold from "../../assets/OpenSans-Bold.ttf";
import OpenSansSemiBold from "../../assets/OpenSans-SemiBold.ttf";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: OpenSans,
      fontWeight: "normal",
    },
    {
      src: OpenSansBold,
      fontWeight: "bold",
    },
    {
      src: OpenSansSemiBold,
      fontWeight: "semibold",
    }
  ],
});

export const reportDocumentStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Open Sans",
    fontWeight: "normal"
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "semibold",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  chartContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  chart: {
    width: "100%",
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    borderBottomStyle: "solid",
    alignItems: "center",
    height: 24,
    paddingLeft: 5,
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    paddingLeft: 5,
  },
  // tableCell: {
  //   flex: 1,
  //   padding: 5,
  //   fontSize: 10,
  // },
  statsSection: {
    marginVertical: 15,
  },
  // statsRow: {
  // 	flexDirection: "row",
  // 	marginBottom: 5,
  // },
  statsLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: "semibold",
  },
  statsValue: {
    flex: 1,
    fontSize: 10,
  },
});
