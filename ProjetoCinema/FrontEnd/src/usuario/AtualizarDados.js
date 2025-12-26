import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView, StatusBar, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AtualizarDados({ navigation, route }) {
    const { usuario } = route.params || {};

    if (!usuario) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <Text style={{ color: '#FFD700', fontSize: 18 }}>Usuário não encontrado!</Text>
            </View>
        );
    }

    const formatarDataParaInput = (data) => {
        if (!data) return '';
        const numeros = data.replace(/\D/g, '');
        if (numeros.length !== 8) return data;
        const ano = numeros.substring(0, 4);
        const mes = numeros.substring(4, 6);
        const dia = numeros.substring(6, 8);
        return `${dia}/${mes}/${ano}`;
    };

    const [nome, setNome] = useState(usuario.nome || '');
    const [telefone, setTelefone] = useState(usuario.telefone || '');
    const [email, setEmail] = useState(usuario.email || '');
    const [dataNascimento, setDataNascimento] = useState(formatarDataParaInput(usuario.dataNascimento));
    const [senha, setSenha] = useState(usuario.senha || '');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const formatarDataParaEnvio = (data) => {
        if (!data) return null;
        const partes = data.split('/');
        if (partes.length !== 3) return null;
        const [dia, mes, ano] = partes;
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
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

    const handleAtualizar = async () => {
        const dataParaEnvio = formatarDataParaEnvio(dataNascimento);
        if (!dataParaEnvio) {
            Alert.alert('Erro', 'Data de nascimento inválida. Use DD/MM/AAAA');
            return;
        }

        try {
            const usuarioId = await AsyncStorage.getItem('usuarioId');
            if (!usuarioId) {
                Alert.alert('Erro', 'Usuário não encontrado no AsyncStorage');
                return;
            }

            const dadosAtualizados = { nome, telefone, email, dataNascimento: dataParaEnvio, senha };

            await axios.put(`http://localhost:8080/api/v1/usuarios/${usuarioId}`, dadosAtualizados);
            await AsyncStorage.setItem('usuarioNome', nome);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            Alert.alert('Erro', 'Não foi possível atualizar os dados.');
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        navigation.navigate('Home');
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1514894781627-7d9b1f6c01fa?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.background}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>🎬 Atualizar Dados</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        placeholderTextColor="#ccc"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Telefone"
                        placeholderTextColor="#ccc"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Data de Nascimento (DD/MM/AAAA)"
                        placeholderTextColor="#ccc"
                        value={dataNascimento}
                        onChangeText={formatarDataDigitada}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#ccc"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleAtualizar}>
                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                    </TouchableOpacity>
                </View>

                <Modal transparent visible={isModalVisible} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>🎉 Dados atualizados com sucesso!</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#282626ff'
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    title: {
        fontSize: 26,
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
        marginBottom: 15,
        paddingHorizontal: 15,
        color: '#fff',
        backgroundColor: 'rgba(50,50,50,0.8)'
    },
    button: {
        backgroundColor: '#E53935',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
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
        borderRadius: 12,
        width: '80%',
        alignItems: 'center'
    },
    modalText: {
        color: '#FFD700',
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center'
    },
    modalButton: {
        backgroundColor: '#E53935',
        padding: 12,
        borderRadius: 8,
        width: '50%',
        alignItems: 'center'
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
});