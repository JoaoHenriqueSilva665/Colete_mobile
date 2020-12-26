import React from "react";
import { Image, Text, View, ImageBackground } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import logo from "../../assets/logologo.png";
import home from "../../assets/home-background.png";
import styles from "./styles";

const Home = () => {
  const { navigate } = useNavigation();

  function handlerNavigateToPoint() {
    navigate("Points");
  }

  function handlerNavigationToSelectPointMap(){
    navigate('SelectMapPosition')
  }

  return (
    <ImageBackground
      source={home}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={logo} />
        <Text style={styles.title}>Seu aplicativo para coleta de resíduos</Text>
        <Text style={styles.description}>
          Veja qual o ponto de coleta mais próximo da sua residencia
        </Text>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handlerNavigateToPoint}>
          <View style={styles.buttonIcon}>
            <Icon name="map-pin" color="#fff" size={20} />
          </View>
          <Text style={styles.buttonText}>Ver pontos</Text>
        </RectButton>

        <RectButton style={styles.SecondButton} onPress={handlerNavigationToSelectPointMap}>
          <View style={styles.buttonIconScond}>
            <Icon name="edit" color="#fff" size={20} />
          </View>
          <Text style={styles.buttonText}>Criar Ponto</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
