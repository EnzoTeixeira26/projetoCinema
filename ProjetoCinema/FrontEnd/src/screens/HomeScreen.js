
import { useEffect, useState } from "react";
import {View,Text,StyleSheet,TouchableOpacity,ImageBackground,StatusBar,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [usuarioNome, setUsuarioNome] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const nome = await AsyncStorage.getItem("usuarioNome");
      setUsuarioNome(nome);
    };

    checkLogin();
    const unsubscribe = navigation.addListener("focus", checkLogin);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("usuarioNome");
    await AsyncStorage.removeItem("usuarioId");
    setUsuarioNome(null);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
      }}
      style={styles.background}
      blurRadius={3}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} />

      <View style={styles.topBar}>
        {usuarioNome ? (
          <View style={styles.userArea}>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => navigation.navigate("PerfilUsuario")}
            >
              <Ionicons name="person-circle-outline" size={28} color="#fff" />
              <Text style={styles.welcomeText}>Olá, {usuarioNome}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="person-circle-outline" size={24} color="#fff" />
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>🎬 Cinefilos 2025 App</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Filmes")}
          >
            <Ionicons name="film-outline" size={28} color="white" />
            <Text style={styles.buttonText}>Filmes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Series")}
          >
            <Ionicons name="tv-outline" size={28} color="white" />
            <Text style={styles.buttonText}>Séries</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Animes")}
          >
            <Ionicons name="sparkles-outline" size={28} color="white" />
            <Text style={styles.buttonText}>Animes</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => navigation.navigate("Favoritos")}
        >
          <Ionicons name="heart-outline" size={28} color="#fff" />
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  favButton: {
    position: "absolute",
    bottom: 40,
    right: 25,
    backgroundColor: "rgba(255, 0, 80, 0.9)",
    padding: 16,
    borderRadius: 40,
    elevation: 6, 
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 }, 
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  topBar: { flexDirection: "row", justifyContent: "flex-end", padding: 10 },
  userArea: { flexDirection: "row", alignItems: "center", gap: 10 },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  welcomeText: { color: "#fff", fontSize: 15, fontWeight: "500", marginHorizontal: 8 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  logoutText: { color: "#fff", fontWeight: "600", marginLeft: 4 },
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  title: { color: "#fff", fontSize: 36, fontWeight: "bold", marginBottom: 40 },
  buttonContainer: { width: "100%", gap: 20 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,0,50,0.8)",
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
});

export default HomeScreen;