import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CommunityScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Communauté</Text>
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
