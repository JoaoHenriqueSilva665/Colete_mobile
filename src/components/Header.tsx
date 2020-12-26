import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface HeaderProps{
  title: string,
  showCancel?: boolean
}

export default function Header({title, showCancel = true}: HeaderProps){
  const navigation = useNavigation()

  function handlerNavigationToHome(){
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container} >
      <BorderlessButton onPress={navigation.goBack}>
        <Icon name="arrow-left" size={24} color="#34cb79"/>
      </BorderlessButton>

      <Text style={styles.title}>{title}</Text>

      {showCancel ? (
        <BorderlessButton onPress={handlerNavigationToHome}>
        <Icon name="x" size={24} color="#ff669d"/>
      </BorderlessButton>
      ) : (
        <View />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    padding: 24,
    backgroundColor:"#fff",
    borderBottomWidth: 1,
    borderColor: '#dde3f0',
    paddingTop: 44,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title:{
    fontFamily: 'Ubuntu_700Bold',
    color: '#8fa7b3',
    fontSize: 16
  }
})