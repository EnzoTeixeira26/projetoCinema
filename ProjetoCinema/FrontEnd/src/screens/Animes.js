import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4 + 10;

const animeCategories = ['All', 'Shounen', 'Shoujo', 'Seinen', 'Ação', 'Aventura', 'Fantasia', 'Comédia', 'Romance', 'Suspense', 'Mistério'];

const Animes = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const animesMock = [
    { id: 1, titulo: "Naruto", categoria: "Shounen", imagemUrl: "https://br.web.img3.acsta.net/pictures/16/04/11/16/56/089875.jpg", sinopse: "Um jovem ninja busca reconhecimento e sonha em se tornar Hokage." },
    { id: 2, titulo: "Attack on Titan", categoria: "Shounen", imagemUrl: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", sinopse: "Humanidade luta para sobreviver contra gigantes devoradores de homens." },
    { id: 3, titulo: "Demon Slayer", categoria: "Shounen", imagemUrl: "https://br.web.img3.acsta.net/pictures/19/09/18/13/46/0198270.jpg", sinopse: "Um jovem caça-demônios em busca de cura para sua irmã." },
    { id: 4, titulo: "Death Note", categoria: "Shounen", imagemUrl: "https://m.media-amazon.com/images/M/MV5BYTgyZDhmMTEtZDFhNi00MTc4LTg3NjUtYWJlNGE5Mzk2NzMxXkEyXkFqcGc@._V1_.jpg", sinopse: "Um estudante encontra um caderno capaz de matar pessoas ao escrever seus nomes." },
    { id: 5, titulo: "One Piece", categoria: "Shounen", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbUFgoWQMHU93hyXCzppyDfhPEcAf76WscJg&s", sinopse: "Piratas em busca do tesouro One Piece e aventuras pelo mundo." },
    { id: 6, titulo: "My Hero Academia", categoria: "Shounen", imagemUrl: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", sinopse: "Jovens treinam para se tornar heróis em um mundo cheio de superpoderes." },
    { id: 7, titulo: "Tokyo Revengers", categoria: "Seinen", imagemUrl: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/b4231d6e-dff7-4c90-a77b-b7b20cc9e2cd/compose?aspectRatio=1.78&format=webp&width=1200", sinopse: "Um homem viaja no tempo para salvar sua ex-namorada e mudar o destino de gangues." },
    { id: 8, titulo: "One Punch Man", categoria: "Shounen", imagemUrl: "https://m.media-amazon.com/images/I/81VAgJoB3BL.jpg", sinopse: "Um herói extremamente poderoso luta contra vilões e busca emoção." },
  ];

  const categoriasDestaques = {
    'Populares': animesMock.slice(0, 4),
    'Mais Assistidos': animesMock.slice(4, 8),
    'Recomendados': animesMock.slice(0, 8),
  };

  const scrollRefs = {
    'Populares': useRef(null),
    'Mais Assistidos': useRef(null),
    'Recomendados': useRef(null),
  };

  const [scrollX, setScrollX] = useState({
    'Populares': 0,
    'Mais Assistidos': 0,
    'Recomendados': 0,
  });

  const scrollCarrossel = (label, direction, totalItems) => {
    let newX = scrollX[label];

    const scrollAmount = CARD_WIDTH * 2;
    const extraSpace = 40;

    const maxScroll = CARD_WIDTH * totalItems - width + extraSpace;

    if (direction === 'right') {
      newX = Math.min(scrollX[label] + scrollAmount, maxScroll);
    } else {
      newX = Math.max(scrollX[label] - scrollAmount, 0);
    }

    setScrollX(prev => ({ ...prev, [label]: newX }));
    scrollRefs[label].current.scrollTo({ x: newX, animated: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF0000" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Animes</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar animes..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        {animeCategories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.categoryTag, selectedCategory === cat && styles.selectedCategory]}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && { color: '#fff' }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(categoriasDestaques).map(([label, animes]) => {
          const filteredAnimes = animes
            .filter(s => selectedCategory === 'All' || s.categoria === selectedCategory)
            .filter(s => s.titulo.toLowerCase().includes(searchText.toLowerCase()));

          return (
            <View key={label} style={{ marginBottom: 25 }}>
              <Text style={styles.carouselTitle}>{label}</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.arrowButton} onPress={() => scrollCarrossel(label, 'left', filteredAnimes.length)}>
                  <Ionicons name="chevron-back-circle" size={36} color="#FF0000" />
                </TouchableOpacity>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={scrollRefs[label]}
                >
                  {filteredAnimes.map(anime => (
                    <TouchableOpacity
                      key={anime.id}
                      style={styles.card}
                      onPress={() => navigation.navigate('Sinopse', { filme: anime, tipo: 'ANIME' })}
                    >
                      <Image source={{ uri: anime.imagemUrl }} style={styles.image} />
                      <Text style={styles.title}>{anime.titulo}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.arrowButton} onPress={() => scrollCarrossel(label, 'right', filteredAnimes.length)}>
                  <Ionicons name="chevron-forward-circle" size={36} color="#FF0000" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    padding: 16
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  backText: {
    color: '#FF0000',
    fontSize: 16,
    marginLeft: 5
  },
  header: {
    fontSize: 28,
    color: '#FF0000',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12
  },
  categoryBar: {
    marginBottom: 10,
    paddingVertical: 10
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  selectedCategory: {
    backgroundColor: '#FF0000'
  },
  carouselTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  card: {
    width: width * 0.4,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10
  },
  title: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center'
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
});

export default Animes;