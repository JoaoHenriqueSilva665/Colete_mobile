import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import * as ImagePicker from 'expo-image-picker'

import api from "../../../services/api";
import styles from "./styles";

interface ItemProps {
  id: number;
  title: string;
  image_url: string;
}

interface PointDataParams {
  position: {
    latitude: number;
    longitude: number;
  };
}

export default function PointData() {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [selecetedItems, setSelecetedItems] = useState<Number[]>([]);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState<string[]>([])

  const route = useRoute();
  const params = route.params as PointDataParams;
  const navigation = useNavigation()

  async function handlerCreatePoint() {
    const { latitude, longitude } = params.position;

    const data = new FormData()

    data.append('name', name)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('whatsapp', whatsapp)
    data.append('email', email)
    data.append('items', String(selecetedItems))
    images.forEach((image, index) =>{
      data.append('image', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any)
    })

    await api.post('points', data)
    navigation.navigate('Points')
  }

  function handlerSelectItem(id: number) {
    const alredySelected = selecetedItems.findIndex((item) => item === id);
    if (alredySelected >= 0) {
      const filteredItems = selecetedItems.filter((item) => item !== id);
      setSelecetedItems(filteredItems);
    } else {
      setSelecetedItems([...selecetedItems, id]);
    }
  }
  
  async function handlerSelectImages(){
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert('Eita, Precisamos de permisão...')
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if (result.cancelled) {
      return;
    }

    const {uri: image} = result
    setImages([...images, image])

  }

  useEffect(() => {
    api.get("/items").then((response) => {
      setItems(response.data);
    });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
        value={whatsapp}
        onChangeText={setWhatsapp}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Image</Text>
      <View style={styles.uploadImagesContainer}>
        {images.map(image => {
          return(
            <Image 
              key={image}
              source={{ uri: image}}
              style={styles.uploadImages} 
            />
          )
        })}
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handlerSelectImages}>
        <Feather name="plus" size={24} color="#34CB79" />
      </TouchableOpacity>

      <Text style={styles.title}>Ítens de coleta</Text>
      <View>
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

      <RectButton style={styles.nextButton} onPress={handlerCreatePoint}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  );
}
