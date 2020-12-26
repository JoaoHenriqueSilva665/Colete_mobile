import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";

import styles from "./styles";
import api from "../../services/api";
import AppLoading from "expo-app-loading";

interface ItemProps {
  id: number;
  title: string;
  image_url: string;
}

interface PointProps {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

const Points = () => {
  const navigation = useNavigation();

  const [points, setPoints] = useState<PointProps[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [selecetedItems, setSelecetedItems] = useState<Number[]>([]);
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

  useEffect(() => {
    api.get("/items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get("points", {
        params: {
          items: selecetedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [selecetedItems]);

  function handlerSelectItem(id: number) {
    const alredySelected = selecetedItems.findIndex((item) => item === id);
    if (alredySelected >= 0) {
      const filteredItems = selecetedItems.filter((item) => item !== id);
      setSelecetedItems(filteredItems);
    } else {
      setSelecetedItems([...selecetedItems, id]);
    }
  }

  function HandlerNavigationBack() {
    navigation.goBack();
  }

  function handlerNavigateToDetail(id: number) {
    navigation.navigate("Detail", { point_id: id });
  }

  if (!points) {
    return <AppLoading/>
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={HandlerNavigationBack}>
          <Icon name="arrow-left" size={25} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo!</Text>
        <Text style={styles.description}>
          vamos começar? encontre no mapa um ponto de coleta!
        </Text>

        <View style={styles.mapContainer}>
          {intialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={intialPosition[0] === 0}
              initialRegion={{
                latitude: intialPosition[0],
                longitude: intialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handlerNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{ uri: point.image_url }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map((item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={String(item.id)}
              style={[
                styles.item,
                selecetedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handlerSelectItem(item.id)}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Points;
