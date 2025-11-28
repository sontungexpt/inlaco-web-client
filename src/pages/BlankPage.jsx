import React from "react";
import Color from "@constants/Color";

const BlankPage = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#FFFFFF",
      color: Color.PrimaryWhite,
      flexDirection: "column",
    },
    heading: {
      fontSize: "4rem",
      marginBottom: "1rem",
    },
    text: {
      fontSize: "1.5rem",
    },
  };

  return <div style={styles.container}></div>;
};

export default BlankPage;
