import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import filmesData from '../data/filmes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.36;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const categoriasFilmes = [
  'All',
  'Ação',
  'Drama',
  'Crime',
  'Ficção',
  'Fantasia',
  'Romance',
  'Gótico',
  'Aventura',
  'Biografia',
  'Animação',
  'Terror',
  'Suspense'
];

const Filmes = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredFilmes = filmesData
    .filter(f => selectedCategory === 'All' || f.categoria === selectedCategory)
    .filter(f => f.titulo.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0b0b' }}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cinefilos IF - Trindade</Text>
      </View>

      <FlatList
        data={filteredFilmes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 15, alignItems: 'center' }}
        ListHeaderComponent={
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar filmes..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryBar}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {categoriasFilmes.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.categoryTag, selectedCategory === cat && styles.selectedCategory]}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && { color: '#fff' }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Sinopse', { filme: item, tipo: 'FILME' })}
          >
            <View style={styles.card}>
              <Image
                source={
                  typeof item.imagemUrl === 'string'
                    ? { uri: item.imagemUrl }
                    : item.imagemUrl
                }
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.overlay} />
              <Text style={styles.title}>{item.titulo}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.categoria}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Cinefilos IF - Trindade</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0b0b0b'
  },
  headerTitle: {
    color: '#FF0000',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  },
  searchInput: {
    marginHorizontal: 15,
    padding: 8,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    marginVertical: 10
  },
  categoryBar: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#333',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  selectedCategory: {
    backgroundColor: '#FF0000'
  },
  container: {
    paddingBottom: 15,
    alignItems: 'center'
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: 'flex-end',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  title: {
    position: 'absolute',
    bottom: 10,
    left: 5,
    right: 5,
    color: '#FF0000',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  tag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FF0000',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0b0b'
  },
  footer: {
    padding: 12,
    backgroundColor: '#0b0b0b',
    alignItems: 'center'
  },
  footerText: {
    color: '#888',
    fontSize: 14
  },
});

export default Filmes;