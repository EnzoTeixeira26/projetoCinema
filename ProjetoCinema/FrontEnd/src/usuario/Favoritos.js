import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Alert, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;

const Favoritos = ({ navigation }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState('TODOS');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    checkUsuarioLogado();
    carregarFavoritos();
  }, []);

  const checkUsuarioLogado = async () => {
    try {
      const id = await AsyncStorage.getItem('usuarioId');
      const nome = await AsyncStorage.getItem('usuarioNome');
      setUsuarioLogado(!!(id && nome));
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    }
  };

  const carregarFavoritos = async () => {
    try {
      setCarregando(true);
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) {
        setUsuarioLogado(false);
        return;
      }

      console.log('Carregando favoritos para usuário:', usuarioId);
      const response = await axios.get(`http://localhost:8080/api/v1/favoritos/usuario/${usuarioId}`);
      console.log('Favoritos carregados:', response.data);
      
      // Garantir que cada item tenha uma chave única
      const favoritosComIdsUnicos = response.data.map((item, index) => ({
        ...item,
        uniqueKey: `${item.id}-${index}-${Date.now()}`
      }));
      
      setFavoritos(favoritosComIdsUnicos);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os favoritos.');
    } finally {
      setCarregando(false);
    }
  };

  const filtrarFavoritos = () => {
    if (categoriaAtiva === 'TODOS') {
      return favoritos;
    }
    return favoritos.filter(fav => fav.tipo === categoriaAtiva);
  };

  const categorias = [
    { key: 'TODOS', label: 'Todos' },
    { key: 'FILME', label: 'Filmes' },
    { key: 'SERIE', label: 'Séries' },
    { key: 'ANIME', label: 'Animes' }
  ];

  const favoritosFiltrados = filtrarFavoritos();

  // Otimizar a renderização dos cards
  const renderItem = useCallback(({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Sinopse', { 
          filme: {
            id: item.conteudoId,
            titulo: item.titulo,
            imagemUrl: item.imagemUrl,
            categoria: item.categoria,
            sinopse: item.sinopse
          }
        })}
      >
        <Image 
          source={{ uri: item.imagemUrl }} 
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay} />
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardType}>{item.tipo}</Text>
            <Text style={styles.cardCategory}>{item.categoria}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ), [navigation]);

  const keyExtractor = useCallback((item) => item.uniqueKey || item.id.toString(), []);

  // Componente de lista otimizado
  const ListaFavoritos = () => (
    <FlatList
      data={favoritosFiltrados}
      keyExtractor={keyExtractor}
      numColumns={2}
      contentContainerStyle={styles.listaContainer}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      initialNumToRender={10} // Reduz o número inicial de itens renderizados
      maxToRenderPerBatch={5} // Controla quantos itens são renderizados por lote
      windowSize={5} // Reduz a janela de itens mantidos na memória
      removeClippedSubviews={true} // Remove itens que não estão visíveis da memória
      updateCellsBatchingPeriod={50} // Período de batch para atualizações
    />
  );

  if (!usuarioLogado) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#FF0000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Favoritos</Text>
        </View>

        <View style={styles.conteudoCentralizado}>
          <Ionicons name="heart-outline" size={80} color="#666" />
          <Text style={styles.mensagemTitulo}>Acesso Restrito</Text>
          <Text style={styles.mensagemDescricao}>
            Você precisa estar logado para ver seus favoritos.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        
        <TouchableOpacity 
          style={styles.atualizarButton}
          onPress={carregarFavoritos}
          disabled={carregando}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color="#FF0000" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
        contentContainerStyle={styles.filtrosContent}
      >
        {categorias.map(categoria => (
          <TouchableOpacity
            key={categoria.key}
            style={[
              styles.filtroButton,
              categoriaAtiva === categoria.key && styles.filtroButtonAtivo
            ]}
            onPress={() => setCategoriaAtiva(categoria.key)}
          >
            <Text style={[
              styles.filtroText,
              categoriaAtiva === categoria.key && styles.filtroTextAtivo
            ]}>
              {categoria.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {carregando && (
        <View style={styles.carregandoContainer}>
          <Text style={styles.carregandoText}>Carregando favoritos...</Text>
        </View>
      )}

      {favoritosFiltrados.length === 0 ? (
        <View style={styles.conteudoCentralizado}>
          <Ionicons name="heart-outline" size={80} color="#666" />
          <Text style={styles.mensagemTitulo}>
            {categoriaAtiva === 'TODOS' ? 'Nenhum favorito' : `Nenhum ${categoriaAtiva.toLowerCase()} favorito`}
          </Text>
          <Text style={styles.mensagemDescricao}>
            {categoriaAtiva === 'TODOS' 
              ? 'Adicione filmes, séries e animes aos seus favoritos!'
              : `Adicione ${categoriaAtiva.toLowerCase()}s aos seus favoritos!`
            }
          </Text>
          <TouchableOpacity 
            style={styles.explorarButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.explorarButtonText}>Explorar Conteúdos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ListaFavoritos />
      )}
    </View>
  );
};

// Mantenha os mesmos estilos...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#0b0b0b',
  },
  headerTitle: {
    color: '#FF0000',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  atualizarButton: {
    padding: 5,
  },
  filtrosContainer: {
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: '#0b0b0b',
  },
  filtrosContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  filtroButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#222',
    borderRadius: 15,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtroButtonAtivo: {
    backgroundColor: '#FF0000',
  },
  filtroText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  filtroTextAtivo: {
    color: '#fff',
  },
  carregandoContainer: {
    padding: 10,
    alignItems: 'center',
  },
  carregandoText: {
    color: '#FFF',
    fontSize: 14,
  },
  listaContainer: {
    padding: 10,
  },
  card: {
    width: CARD_WIDTH,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardCategory: {
    color: '#888',
    fontSize: 12,
  },
  conteudoCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mensagemTitulo: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  mensagemDescricao: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  explorarButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  explorarButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Favoritos;