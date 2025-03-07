import { useNavigation } from "@react-navigation/native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Back from "../../assets/icons/back.svg";
import SwitchView from "../../assets/icons/switch-view.svg";
import { usePicture } from "../../contexts/PictureContext";

export default function Camera(): React.JSX.Element {
  const navigation = useNavigation();
  const { picture, setPicture } = usePicture();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de votre permission pour afficher la caméra.
        </Text>
        <Button onPress={requestPermission} title="Autoriser" />
        <Button onPress={() => navigation.goBack()} title="Retour" />
      </View>
    );
  }

  function toggleCameraFacing(): void {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture(): Promise<void> {
    if (!camera) {
      console.log("Camera not ready!");
      return;
    }

    const photo = await camera.takePictureAsync();

    if (!photo) {
      console.log("No photo taken!");
      return;
    }

    setPicture(photo.uri);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={ref => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Back width={40} height={40} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <View style={styles.ring}>
              <View style={styles.takePicture}></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <SwitchView width={40} height={40} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  message: {
    textAlign: "center",
    paddingBottom: 10
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: 64
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  },
  ring: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderColor: "white",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    padding: 3
  },
  takePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: "white"
  }
});
