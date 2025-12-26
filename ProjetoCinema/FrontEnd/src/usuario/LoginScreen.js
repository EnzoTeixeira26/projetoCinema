import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity,StyleSheet, ScrollView, Modal, StatusBar, ImageBackground} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatarDataParaEnvio = (data) => {
    if (!data) return null;

    const numeros = data.replace(/\D/g, '');
    if (numeros.length !== 8) return null; 

    const dia = parseInt(numeros.substring(0, 2), 10);
    const mes = parseInt(numeros.substring(2, 4), 10);
    const ano = parseInt(numeros.substring(4), 10);

    const dataObj = new Date(ano, mes - 1, dia);
    if (
      dataObj.getFullYear() !== ano ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getDate() !== dia
    ) {
      return null;
    }

    return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
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

  const dataFormatada = formatarDataParaEnvio(dataNascimento);

  const handleCadastro = async () => {
    if (!nome || !telefone || !email || !dataNascimento || !senha) {
      setMensagem('Preencha todos os campos');
      return;
    }

    const dataParaEnvio = formatarDataParaEnvio(dataNascimento);

    if (!dataParaEnvio) {
      setMensagem('Data de nascimento inválida. Use DD/MM/AAAA');
      return;
    }

    const novoUsuario = {
      nome,
      telefone,
      email,
      dataNascimento: dataParaEnvio, 
      senha
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/usuarios', novoUsuario);
      console.log("Cadastro realizado:", response.data); 
      setMensagem('Cadastro realizado!');
      setIsModalVisible(true);
    } catch (error) {
      console.log("Erro ao cadastrar:", error.response?.data || error.message);
      setMensagem('Erro ao cadastrar usuário');
    }
  };


  const handleEntrar = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/usuarios');
      const dados = response.data;
      const usuarioEncontrado = dados.find(usuario => usuario.email === email && usuario.senha === senha);

      if (usuarioEncontrado) {
        try {
          await AsyncStorage.multiSet([
            ['usuarioNome', usuarioEncontrado.nome],
            ['usuarioId', usuarioEncontrado.id.toString()]
          ]);
          setIsModalVisible(false)
          navigation.navigate('Home');
        } catch (error) {
          console.error('Erro ao salvar os dados no AsyncStorage:', error)
        }
      } else {
        setMensagem('Usuário não cadastrado');
      }
    } catch (error) {
      console.error('Erro ao consultar a API:', error)
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80' }}
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
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>

          {!isLogin ? (
            <>
              <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#ccc" value={nome} onChangeText={setNome} />
              <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#ccc" keyboardType="numeric" value={telefone} onChangeText={setTelefone} />
              <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#ccc" keyboardType="email-address" value={email} onChangeText={setEmail} />
              <TextInput style={styles.input} placeholder="Data de nascimento (DD/MM/AAAA)" placeholderTextColor="#ccc" keyboardType="numeric" value={dataNascimento} onChangeText={formatarDataDigitada} />
              <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#ccc" secureTextEntry value={senha} onChangeText={setSenha} />

              <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsLogin(true)}>
                <Text style={styles.toggleText}>Já sou cadastrado? Entrar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#ccc" value={email} onChangeText={setEmail} />
              <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#ccc" secureTextEntry value={senha} onChangeText={setSenha} />

              <TouchableOpacity style={styles.button} onPress={handleEntrar}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsLogin(false)}>
                <Text style={styles.toggleText}>Não tem cadastro? Criar conta</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.message}>{mensagem}</Text>

          <Modal transparent visible={isModalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>Cadastro realizado com sucesso. Deseja logar?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleEntrar}>
                    <Text style={styles.modalButtonText}>Sim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Não</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    marginBottom: 10 
  },

  headerTitle: { 
    color: '#FFD700', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 15 
  },

  background: { 
    flex: 1, 
    resizeMode: 'cover' 
  },

  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16 
  },

  formContainer: { 
    width: '100%', 
    maxWidth: 400, 
    padding: 20, 
    borderRadius: 10, 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFD700', 
    textAlign: 'center', 
    marginBottom: 20 
  },

  input: { 
    width: '100%', 
    height: 50, 
    borderColor: '#FFD700', 
    borderWidth: 1, 
    borderRadius: 8, 
    marginBottom: 12, 
    paddingHorizontal: 15, 
    color: '#fff' 
  },

  button: { 
    backgroundColor: '#E53935', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 10 
  },

  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  toggleText: { 
    color: '#FFD700', 
    textAlign: 'center', 
    marginTop: 10, 
    fontWeight: 'bold' 
  },

  message: { 
    textAlign: 'center', 
    marginTop: 10, 
    color: '#E53935', 
    fontWeight: 'bold' 
  },

  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },

  modalContainer: { 
    backgroundColor: '#222', 
    padding: 20, 
    borderRadius: 10, 
    width: '80%', 
    alignItems: 'center' 
  },

  modalText: { 
    color: '#FFD700', 
    fontSize: 18, 
    marginBottom: 20, 
    textAlign: 'center' 
  },

  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%' 
  },

  modalButton: { 
    backgroundColor: '#E53935', 
    padding: 10, 
    borderRadius: 8 
  },

  modalButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});