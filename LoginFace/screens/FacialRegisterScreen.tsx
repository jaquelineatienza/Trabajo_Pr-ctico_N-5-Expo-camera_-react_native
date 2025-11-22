import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import { sendRegister } from "../utils/api";
import { setFacialRegistered } from "../utils/storage";

const CameraAny: any = Camera;

export default function FacialRegisterScreen({ navigation }: any) {
  const [permission, setPermission] = useState<any>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [cuil, setCuil] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const perm = await Camera.getCameraPermissionsAsync();
      setPermission(perm);
      if (!perm?.granted) {
        const req = await Camera.requestCameraPermissionsAsync();
        setPermission(req);
      }
    })();
  }, []);

  const requestPermission = async () => {
    const req = await Camera.requestCameraPermissionsAsync();
    setPermission(req);
  };

  const takePhoto = async () => {
    if (!cameraRef) return;

    setLoading(true);

    const picture = await cameraRef.takePictureAsync({ base64: false });

    const res = await sendRegister(cuil, picture.uri);

    setLoading(false);

    if (res.success) {
      await setFacialRegistered(true);
      alert("Rostro registrado correctamente.");
      navigation.goBack();
    } else {
      alert("Error registrando rostro: " + res.message);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Debe permitir usar la cámara.</Text>
        <Button title="Permitir" onPress={requestPermission} />
      </View>
    );
  }

  {
    loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  <>
    <CameraAny style={{ flex: 4 }} ref={(ref: any) => setCameraRef(ref)} />
    <View style={styles.bottom}>
      <View style={styles.bottom}>
        <TextInput
          placeholder="Ingrese CUIL"
          style={styles.input}
          value={cuil}
          onChangeText={setCuil}
        />

        <Button title="Registrar rostro" onPress={takePhoto} disabled={!cuil} />
      </View>
    </View>
  </>;
}

const styles = StyleSheet.create({
  bottom: {
    flex: 2,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
