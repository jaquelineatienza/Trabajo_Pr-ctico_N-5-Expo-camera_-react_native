import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<any>;

export default function CameraLoginScreen({ navigation }: Props) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type] = useState(CameraType.front);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Debe permitir el uso de la cámara</Text>
        <Button title="Permitir" onPress={requestPermission} />
      </View>
    );
  }

  const handleFaceLogin = () => {
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} />

      <View style={styles.footer}>
        <Text style={styles.txt}>Apunte su rostro hacia la cámara</Text>
        <Button title="Validar rostro" onPress={handleFaceLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 4 },
  footer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    marginBottom: 20,
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
