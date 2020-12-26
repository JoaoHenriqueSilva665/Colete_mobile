import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./pages/Home";
import Points from "./pages/Points";
import Detail from "./pages/Detail";
import SelectMapPosition from "./pages/CreateOrphanages/SelectMap";
import PointData from "./pages/CreateOrphanages/MapData";
import Header from "./components/Header";

const { Navigator, Screen } = createStackNavigator();
const Routes = () => {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "#f0f0f5",
          },
        }}
      >
        <Screen name="Home" component={Home} />
        <Screen name="Points" component={Points} />
        <Screen
          name="Detail"
          component={Detail}
          options={{
            headerShown: true,
            header: () => <Header showCancel={false} title="Detalhes" />,
          }}
        />
        <Screen
          name="SelectMapPosition"
          component={SelectMapPosition}
          options={{
            headerShown: true,
            header: () => <Header title="Selecione o Ponto" />,
          }}
        />
        <Screen
          name="PointData"
          component={PointData}
          options={{
            headerShown: true,
            header: () => <Header title="Criar ponto" />,
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default Routes;
