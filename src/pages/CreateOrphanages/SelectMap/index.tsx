import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import MapView, { MapEvent, Marker } from "react-native-maps";
import * as Location from "expo-location";

import styles from "./styles";

export default function SelectMapPosition() {
  const navigation = useNavigation();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [intialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Opsss!!",
          "Precisamos de sua permissão para obter sua localização"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }
    loadPosition();
  }, []);

  function handleNextStep() {
    navigation.navigate("PointData", { position });
  }

  function handlerSelectPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  return (
    <View style={styles.container}>
      {intialPosition[0] !== 0 && (
        <MapView
          loadingEnabled={intialPosition[0] === 0}
          style={styles.mapStyle}
          onPress={handlerSelectPosition}
          initialRegion={{
            latitude: intialPosition[0],
            longitude: intialPosition[1],
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
        >
          {position.latitude !== 0 && (
            <Marker
              coordinate={{
                latitude: position.latitude,
                longitude: position.longitude,
              }}
            />
          )}
        </MapView>
      )}

      {position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  );
}
