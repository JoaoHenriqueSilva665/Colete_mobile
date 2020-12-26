import React, { useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Linking,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";

import styles from "./styles";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import api from "../../services/api";
import MapView, { Marker } from "react-native-maps";

interface Params {
  point_id: number;
}

interface DataProps {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<DataProps>({} as DataProps);
  const route = useRoute();
  const params = route.params as Params;

  useEffect(() => {
    api.get(`points/${params.point_id}`).then((response) => {
      setData(response.data);
    });
  }, []);

  function handlerComposerMail() {
    MailComposer.composeAsync({
      subject: "Interesse na Coleta",
      recipients: [data.point.email],
    });
  }

  function handlerWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=55${data.point.whatsapp}&text=Tenho interesse sobre a coleta de resíduos`
    );
  }

  function handlerOpenMapsRoutes(){
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${data.point?.latitude},${data.point?.longitude}`)
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>

          <Image
            source={{ uri: data.point.image_url }}
            style={styles.pointImage}
          />
          <Text style={styles.pointName}>{data.point.name}</Text>
          <Text style={styles.pointItems}>
            {data.items.map((item) => item.title).join(", ")}
          </Text>

          <View style={styles.address}>
            <Text style={styles.addressTitle}>Enderço</Text>
            <Text style={styles.addressContent}>Óbidos-Pa</Text>
          </View>
        </View>

         <View style={styles.mapContainer}>
          <MapView 
            initialRegion={{
              latitude: data.point.latitude,
              longitude: data.point.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }} 
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.mapStyle}
          >
            <Marker 
              coordinate={{ 
                latitude: data.point.latitude,
                longitude: data.point.longitude
              }}
            />
          </MapView>

          <TouchableOpacity onPress={handlerOpenMapsRoutes} style={styles.routesContainer}>
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handlerWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handlerComposerMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;
