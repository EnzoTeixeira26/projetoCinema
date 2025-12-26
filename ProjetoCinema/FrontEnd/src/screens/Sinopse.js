import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Sinopse = ({ route, navigation }) => {
  const { filme, tipo } = route.params;
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [jaFavoritado, setJaFavoritado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkUsuarioLogado();
    checkFavorito();
  }, []);

  const checkUsuarioLogado = async () => {
    try {
      const id = await AsyncStorage.getItem('usuarioId');
      const nome = await AsyncStorage.getItem('usuarioNome');

      if (id && nome) {
        setUsuarioLogado(true);
        setUsuarioId(id);
      } else {
        setUsuarioLogado(false);
        setUsuarioId(null);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    }
  };

  const checkFavorito = async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) return;

      const response = await axios.get(`http://localhost:8080/api/v1/favoritos/usuario/${usuarioId}`);
      const favoritos = response.data;

      const isFavorito = favoritos.some(fav =>
        fav.conteudoId === filme.id && fav.tipo === getTipoConteudo()
      );

      setJaFavoritado(isFavorito);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const getTipoConteudo = () => {
    // Se o tipo foi passado como parâmetro, usa ele
    if (tipo) {
      return tipo;
    }
    
    // Caso contrário, usa a lógica de detecção automática
    if (filme.categoria && ['Shounen', 'Shoujo', 'Seinen'].includes(filme.categoria)) {
      return 'ANIME';
    }
    
    const seriesTitles = [
      'Stranger Things', 'Diários de um Vampiro', 'The Mandalorian', 
      'Young Royals', 'Breaking Bad', 'Game of Thrones', 'The Witcher',
      'Lucifer', 'Friends', 'The Office', 'Money Heist', 'The Crown',
      'Black Mirror', 'The Boys', 'WandaVision', 'Peaky Blinders',
      'Sherlock', 'The Umbrella Academy', 'House of the Dragon', 'Dark',
      'Squid Game', 'Dexter'
    ];
    
    if (seriesTitles.some(serie => filme.titulo.includes(serie))) {
      return 'SERIE';
    }
    
    return 'FILME';
  };

  const adicionarFavorito = async () => {
    if (!usuarioLogado) {
      setModalVisible(true);
      return;
    }

    try {
      const favoritoData = {
        usuarioId: parseInt(usuarioId),
        conteudoId: filme.id,
        titulo: filme.titulo,
        tipo: getTipoConteudo(),
        imagemUrl: filme.imagemUrl,
        categoria: filme.categoria,
        sinopse: filme.sinopse
      };

      await axios.post('http://localhost:8080/api/v1/favoritos', favoritoData);
      setJaFavoritado(true);
      Alert.alert('Sucesso', 'Adicionado aos favoritos!');
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
    }
  };

  const removerFavorito = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/favoritos/usuario/${usuarioId}`);
      const favoritos = response.data;

      const favorito = favoritos.find(fav =>
        fav.conteudoId === filme.id && fav.tipo === getTipoConteudo()
      );

      if (favorito) {
        await axios.delete(`http://localhost:8080/api/v1/favoritos/${favorito.id}`);
        setJaFavoritado(false);
        Alert.alert('Sucesso', 'Removido dos favoritos!');
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      Alert.alert('Erro', 'Não foi possível remover dos favoritos.');
    }
  };

  const handleFazerLogin = () => {
    setModalVisible(false);
    navigation.navigate('Login');
  };

  const handleFecharModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF0000" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Image source={{ uri: filme.imagemUrl }} style={styles.image} />
        <Text style={styles.title}>{filme.titulo}</Text>
        <TouchableOpacity
          style={[
            styles.favoritoButton,
            jaFavoritado ? styles.favoritoButtonRemover : styles.favoritoButtonAdicionar
          ]}
          onPress={jaFavoritado ? removerFavorito : adicionarFavorito}
        >
          <Ionicons
            name={jaFavoritado ? "heart" : "heart-outline"}
            size={24}
            color="#FFF"
          />
          <Text style={styles.favoritoText}>
            {jaFavoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.sinopse}>
          {filme.sinopse || 'Sinopse não disponível.'}
        </Text>
        <Text style={styles.categoria}>
          Categoria: <Text style={styles.categoriaValor}>{filme.categoria || 'Sem categoria'}</Text>
        </Text>
        <Text style={styles.categoria}>
          Tipo: <Text style={styles.categoriaValor}>{getTipoConteudo()}</Text>
        </Text>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleFecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Ionicons name="heart-dislike" size={50} color="#FF0000" />
            </View>
            <Text style={styles.modalTitle}>Acesso Restrito</Text>
            <Text style={styles.modalMessage}>
              Você precisa estar logado para adicionar conteúdos aos favoritos.
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleFecharModal}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                  Fechar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleFazerLogin}
              >
                <Ionicons name="log-in-outline" size={20} color="#FFF" />
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Fazer Login
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalFooter}>
              Junte-se à comunidade Cinefilos!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#FF0000',
    fontSize: 16,
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    color: '#FF0000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  favoritoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  favoritoButtonAdicionar: {
    backgroundColor: '#E53935',
  },
  favoritoButtonRemover: {
    backgroundColor: '#666',
  },
  favoritoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sinopse: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  categoria: {
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  categoriaValor: {
    fontWeight: 'bold',
    color: '#FF0000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FF0000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  modalButtonPrimary: {
    backgroundColor: '#E53935',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalButtonTextPrimary: {
    color: '#FFF',
  },
  modalButtonTextSecondary: {
    color: '#CCC',
  },
  modalFooter: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Sinopse;