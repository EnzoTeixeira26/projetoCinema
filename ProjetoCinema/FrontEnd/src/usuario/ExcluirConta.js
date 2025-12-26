import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ExcluirConta({ navigation, route }) {
  const { usuario } = route.params;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const formatarDataParaEnvio = (data) => {
    if (!data) return null;
    const numeros = data.replace(/\D/g, '');
    if (numeros.length !== 8) return null;
    const dia = numeros.substring(0, 2);
    const mes = numeros.substring(2, 4);
    const ano = numeros.substring(4);
    return `${ano}-${mes}-${dia}`;
  };

  const formatarDataDigitada = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = cleaned.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (cleaned.length > 4) {
      formatted = cleaned.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }
    setDataNascimento(formatted);
  };

  const handleExcluir = async () => {
    if (!email || !senha || !dataNascimento) {
      Alert.alert("Erro", "Preencha todos os campos para confirmar.");
      return;
    }

    const dataFormatada = formatarDataParaEnvio(dataNascimento);

    if (!dataFormatada) {
      Alert.alert("Erro", "Data de nascimento inválida. Use DD/MM/AAAA.");
      return;
    }

    try {
      if (
        email !== usuario.email ||
        senha !== usuario.senha ||
        dataFormatada !== usuario.dataNascimento
      ) {
        Alert.alert("Erro", "Dados não conferem. Verifique e tente novamente.");
        return;
      }

      await axios.delete(`http://localhost:8080/api/v1/usuarios/${usuario.id}`);

      await AsyncStorage.multiRemove(["usuarioId", "usuarioNome"]);
      Alert.alert("Sucesso", "Conta excluída com sucesso!");
      navigation.replace("Login");

    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      Alert.alert("Erro", "Não foi possível excluir a conta.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80" }}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Excluir Conta</Text>
        <Text style={styles.subtitle}>Para excluir sua conta, confirme seus dados abaixo:</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TextInput
            style={styles.input}
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={dataNascimento}
            onChangeText={formatarDataDigitada}
          />

          <TouchableOpacity style={styles.buttonDelete} onPress={handleExcluir}>
            <Text style={styles.buttonText}>Excluir Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonTextCancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    resizeMode: "cover" 
  },
  container: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "rgba(0,0,0,0.7)" 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#FFD700", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#fff", 
    marginBottom: 20, 
    textAlign: "center" 
  },
  card: { 
    width: "100%", 
    padding: 20, 
    borderRadius: 10, 
    backgroundColor: "#222", 
    borderWidth: 1, 
    borderColor: "#E53935" 
  },
  input: { 
    width: "100%", 
    backgroundColor: "#333", 
    color: "#fff", 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 15 
  },
  buttonDelete: { 
    backgroundColor: "#FFD700", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 10 
  },
  buttonText: { 
    color: "#000", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  buttonCancel: { 
    backgroundColor: "#E53935", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  buttonTextCancel: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});
