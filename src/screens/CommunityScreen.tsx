import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDynamicHeader } from "../components/navigation/useDynamicHeader";

export default function CommunityScreen(): React.JSX.Element {
  useDynamicHeader();

  return (
    <View style={styles.container}>
      <Text>Prochainement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
