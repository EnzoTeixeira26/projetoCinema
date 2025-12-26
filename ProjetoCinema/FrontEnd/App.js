import { StatusBar } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

import HomeScreen from './src/screens/HomeScreen'
import Filmes from './src/screens/Filmes'
import Series from './src/screens/Series'
import sinopse from './src/screens/Sinopse'
import Animes from './src/screens/Animes'
import LoginScreen from './src/usuario/LoginScreen'
import PerfilUsuario from './src/usuario/PerfilUsuario'
import ExcluirConta from './src/usuario/ExcluirConta'
import AtualizarDados from './src/usuario/AtualizarDados'
import Favoritos from './src/usuario/Favoritos'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} options={{headerShown: false}}/>    
        <Stack.Screen name="ExcluirConta" component={ExcluirConta} options={{headerShown: false}}/> 
        <Stack.Screen name="AtualizarDados" component={AtualizarDados} options={{headerShown: false}}/> 
        <Stack.Screen name="Favoritos" component={Favoritos} options={{headerShown: false}}/>
        <Stack.Screen name="Filmes" component={Filmes} options={{headerShown: false}}/>
        <Stack.Screen name="Sinopse" component={sinopse} options={{headerShown: false}}/>
        <Stack.Screen name="Series" component={Series} options={{headerShown: false}}/> 
        <Stack.Screen name="Animes" component={Animes} options={{headerShown: false}}/> 
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>

    
  )
}