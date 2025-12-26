import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ImageBackground, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PerfilUsuario({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    
    const loadUser = async () => {
      try {
        const id = await AsyncStorage.getItem("usuarioId");
        if (!id) {
          navigation.replace("Login");
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/v1/usuarios/${id}`);
        setUsuario(response.data);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário");
      }
    };

    const unsubscribe = navigation.addListener("focus", loadUser);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["usuarioId", "usuarioNome"]);
    navigation.replace("Login");
  };

  if (!usuario) return null;

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80" }}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cinefilos IF - Trindade</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.card}>
          <Text style={styles.info}>ID: {usuario.id}</Text>
          <Text style={styles.info}>Nome: {usuario.nome}</Text>
          <Text style={styles.info}>Email: {usuario.email}</Text>
          <Text style={styles.info}>Telefone: {usuario.telefone}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Favoritos")}>
          <Text style={styles.buttonText}>Ver Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AtualizarDados", { usuario })}>
          <Text style={styles.buttonText}>Atualizar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#FFD700" }]} onPress={() => navigation.navigate("ExcluirConta", { usuario })}>
          <Text style={[styles.buttonText, { color: "#000" }]}>Excluir Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#E53935" }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#0b0b0b" },
  headerTitle: { color: "#FF0000", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 20, color: "#FFD700", textAlign: "center" },
  card: {
    width: "100%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#E53935",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#222"
  },
  info: { fontSize: 18, marginBottom: 10, color: "#fff" },
  button: {
    width: "100%",
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});