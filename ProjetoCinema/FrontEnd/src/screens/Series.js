import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4 + 10;

const categories = ['All', 'Ficção', 'Fantasia', 'Drama', 'Crime', 'Ação', 'Comédia', 'Policial', 'Suspense', 'Animação', 'Aventura'];

const Series = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const seriesMock = [
    { id: 1, titulo: "Dexter", categoria: "Crime", imagemUrl: "https://poltronanerd.com.br/wp-content/uploads/2020/06/b28117ea-41bc-47fe-93ef-f82a1f31717b.jpg", sinopse: "Dexter Morgan é um perito forense especializado em análise de sangue que também é um serial killer que caça outros assassinos." },
    { id: 2, titulo: "Dexter: New Blood", categoria: "Crime", imagemUrl: "https://i.ytimg.com/vi/dJDFFK9prU8/sddefault.jpg", sinopse: "Dexter Morgan vive sob uma nova identidade em uma pequena cidade, mas seu passado sombrio começa a alcançá-lo." },
    { id: 3, titulo: "Dexter: Original Sin", categoria: "Crime", imagemUrl: "https://m.media-amazon.com/images/M/MV5BYTVlZjNhYjktMWYyNy00MmYyLTk3ZjctMDQwMWIwYjdkODc3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", sinopse: "Série de animação que explora os primeiros casos de Dexter Morgan antes dos eventos da série principal." },
    { id: 4, titulo: "Dexter: Ressurection", categoria: "Crime", imagemUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4EtWxhrDvpiskbZ_fxI1Z0-3iR8f7u9ECMMcUFeq9jVU6aT9u1oqYe-lzlH6Rc9gMaFzoZK7j4XZv9WE5_GlYAQEMNuPl0Kb_-Vabcif9D2Zwg1Vg73Q7iiUvoLbaKP58fbbrLsUAY3sZl8myl73fxEtSWqXEdepJ9AU9srK0RYk44Pmb3MNmP0hYmAxe/w640-h360/72d06900cb2f47001ec763d6f66ab7cf06abf7444acb6be313784ae9d579ab97.jpg", sinopse: "Versão estendida e remasterizada com cenas inéditas dos momentos finais de Dexter Morgan." },
    { id: 5, titulo: "Stranger Things", categoria: "Ficção", imagemUrl: "https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png", sinopse: "Um grupo de crianças enfrenta forças sobrenaturais em sua cidade enquanto buscam um amigo desaparecido." },
    { id: 6, titulo: "Diários de um Vampiro", categoria: "Fantasia", imagemUrl: "https://i0.wp.com/metagalaxia.com.br/wp-content/uploads/2024/02/Diarios-de-um-Vampiro.webp?fit=1280%2C960&ssl=1", sinopse: "A vida de Elena Gilbert muda completamente quando se envolve com os irmãos vampiros Stefan e Damon Salvatore." },
    { id: 7, titulo: "The Mandalorian", categoria: "Aventura", imagemUrl: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/d9395a4b-7528-4317-a084-8496af0aaafe/compose?aspectRatio=1.78&format=webp&width=1200", sinopse: "Um caçador de recompensas solitário embarca em aventuras pela galáxia enquanto protege a criança conhecida como Grogu." },
    { id: 8, titulo: "Young Royals", categoria: "Drama", imagemUrl: "https://portalpopline.com.br/wp-content/uploads/2024/01/young-royals-netflix-jpg.webp", sinopse: "A vida do príncipe Wilhelm muda quando ele entra em um colégio interno e enfrenta dilemas amorosos e familiares." },
    { id: 9, titulo: "Breaking Bad", categoria: "Crime", imagemUrl: "https://nerdizmo.ig.com.br/wp-content/uploads/2013/12/Breaking-Bad-Movie-Wallpaper-Background.png", sinopse: "Um professor de química do ensino médio se torna fabricante de metanfetamina após diagnóstico terminal de câncer." },
    { id: 10, titulo: "Game of Thrones", categoria: "Fantasia", imagemUrl: "https://www.notebookcheck.info/fileadmin/Notebooks/News/_nc4/game-of-thrones-kingsroad-early-access.jpg", sinopse: "Nobres de Westeros lutam pelo controle do Trono de Ferro em meio a conspirações e batalhas épicas." },
    { id: 11, titulo: "The Witcher", categoria: "Fantasia", imagemUrl: "https://levelupnews.com.br/wp-content/uploads/2025/11/img_7562.jpg", sinopse: "Geralt de Rívia, um caçador de monstros, enfrenta criaturas e conflitos políticos em um mundo sombrio." },
    { id: 12, titulo: "Lucifer", categoria: "Policial", imagemUrl: "https://uploads.jovemnerd.com.br/wp-content/uploads/2021/08/lucifer.jpg", sinopse: "O Diabo decide tirar férias do Inferno e começa a ajudar a polícia de Los Angeles a resolver crimes." },
    { id: 13, titulo: "Friends", categoria: "Comédia", imagemUrl: "https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2023/08/friends-1.jpeg?w=1200&h=900&crop=0", sinopse: "Seis amigos em Nova York enfrentam os altos e baixos da vida, amor e carreira." },
    { id: 14, titulo: "The Office", categoria: "Comédia", imagemUrl: "https://veja.abril.com.br/wp-content/uploads/2016/11/s9to-elenco.jpg?quality=70&strip=info&w=1000&h=563&crop=1", sinopse: "Documentário falso sobre a rotina dos funcionários de um escritório de papel em Scranton." },
    { id: 15, titulo: "Money Heist", categoria: "Crime", imagemUrl: "https://static0.colliderimages.com/wordpress/wp-content/uploads/2021/05/MONEY-HEIST-SEASON-5.jpg?w=1200&h=628&fit=crop", sinopse: "Um grupo de criminosos planeja e executa roubos elaborados, liderados pelo Professor." },
    { id: 16, titulo: "The Crown", categoria: "Drama", imagemUrl: "https://occ-0-8407-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABYSZm4PV_00bGPdQPIvuhydEHANcFn_-JXX04n4uHkI357GJePBtuKKWkJluk7dLU0ivWJmSyzBedgKpGQ8OZDeXdecLZhSYoXqr.jpg?r=ae3", sinopse: "A história do reinado da Rainha Elizabeth II e os desafios pessoais e políticos da monarquia." },
    { id: 17, titulo: "Black Mirror", categoria: "Ficção", imagemUrl: "https://portaln10.com.br/wp-content/uploads/2025/03/black-mirror-poster-gbqux8n5pndwjdrn-1280x720.jpg", sinopse: "Cada episódio apresenta uma história independente sobre tecnologia, sociedade e futuros distópicos." },
    { id: 18, titulo: "The Boys", categoria: "Ação", imagemUrl: "https://www.otempo.com.br/adobe/dynamicmedia/deliver/dm-aid--b5320fc4-7431-4397-b732-b9e978219933/entretenimento-the-boys-prime-video-1709132251.jpg?quality=90&preferwebp=true&width=1200", sinopse: "Um grupo de vigilantes busca expor super-heróis corruptos que abusam de seus poderes." },
    { id: 19, titulo: "WandaVision", categoria: "Ficção", imagemUrl: "https://img.odcdn.com.br/wp-content/uploads/2021/03/wandavision-imagem-central-1800x1080.jpg", sinopse: "Wanda Maximoff e Visão vivem uma vida suburbana aparentemente perfeita, escondendo segredos sombrios." },
    { id: 20, titulo: "Peaky Blinders", categoria: "Crime", imagemUrl: "https://m.media-amazon.com/images/S/pv-target-images/5c3e0d6b9ad0460aa7e63bb1e1d56c4b75722a98f467f5aa8d22650c27a71e1b.jpg", sinopse: "Uma gangue liderada pela família Shelby controla Birmingham após a Primeira Guerra Mundial." },
    { id: 21, titulo: "Rick and Morty", categoria: "Animação", imagemUrl: "https://s2-techtudo.glbimg.com/QDIYAODrGD6Wx6lO5ALZoplvQJw=/0x0:1200x800/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/w/q/GQtAzUSC23yGNHAaG36A/8641cd99-093f-4f85-9a26-388494eb3a7f.jpg", sinopse: "As aventuras interdimensionais de Rick, um cientista alcoólatra, e seu neto Morty." },
    { id: 22, titulo: "Avatar: The Last Airbender", categoria: "Animação", imagemUrl: "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABd0xfPolfAzyxqDPSaUX2W_PDp9lzsD1XT-HS2-Zmf1-pFRyehAoDzazrhimUl0jvbHWjztoFBSVJsxEM__SKMWHx60jzATRP2R8.jpg?r=fc9", sinopse: "Aang, o último Dobrador de Ar, deve dominar os quatro elementos e derrotar a Nação do Fogo." },
    { id: 23, titulo: "Sherlock", categoria: "Suspense", imagemUrl: "https://imagens.ebc.com.br/1DqshcRZYr6y6q80FE6K6Ab18eg=/1170x700/smart/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/sherlock_02_.jpg?itok=uBe3rwz7", sinopse: "Sherlock Holmes e John Watson resolvem casos complexos em Londres moderna." },
    { id: 24, titulo: "The Umbrella Academy", categoria: "Aventura", imagemUrl: "https://igormiranda.com.br/wp-content/cache/seraphinite-accelerator/s/m/d/img/55858943e6e3ffbc7f0cc1bcdf6ef32d.ea03.jpeg", sinopse: "Uma família disfuncional de super-heróis se reúne para resolver o mistério da morte de seu pai adotivo." },
    { id: 25, titulo: "Stranger", categoria: "Suspense", imagemUrl: "https://m.media-amazon.com/images/I/71VQRSO+RHL._UF1000,1000_QL80_.jpg", sinopse: "Um promotor e uma detetive unem forças para desvendar casos de corrupção e assassinatos." },
    { id: 26, titulo: "House of the Dragon", categoria: "Fantasia", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkmlO5ZzbBdUWFxLNjJpe2SFUqkbskuaaJ0g&s", sinopse: "A história da Casa Targaryen e a guerra civil conhecida como Dança dos Dragões." },
    { id: 27, titulo: "Dark", categoria: "Ficção", imagemUrl: "https://versaodublada.com.br/wp-content/uploads/2020/06/wallpaper-de-dark-para-celular-800x445-1.jpg", sinopse: "Mistérios temporais e desaparecimentos afetam a cidade de Winden em um thriller complexo." },
    { id: 28, titulo: "Squid Game", categoria: "Suspense", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtvwCSCM8YnpVzsEXV_NASglwL007FLzOlVw&s", sinopse: "Participantes competem em jogos mortais por uma grande recompensa em dinheiro." },
  ];

  const categoriasDestaques = {
    'Destacados': seriesMock.slice(0, 8),
    'Mais assistidos': seriesMock.slice(8, 16),
    'Recomendados': seriesMock.slice(16, 25),
  };

  const scrollRefs = {
    'Destacados': useRef(null),
    'Mais assistidos': useRef(null),
    'Recomendados': useRef(null),
  };
  const [scrollX, setScrollX] = useState({
    'Destacados': 0,
    'Mais assistidos': 0,
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

      <Text style={styles.header}>Séries</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar séries..."
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
        {categories.map(cat => (
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
        {Object.entries(categoriasDestaques).map(([label, series]) => {
          const filteredSeries = series
            .filter(s => selectedCategory === 'All' || s.categoria === selectedCategory)
            .filter(s => s.titulo.toLowerCase().includes(searchText.toLowerCase()));

          return (
            <View key={label} style={{ marginBottom: 25 }}>
              <Text style={styles.carouselTitle}>{label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.arrowButton} onPress={() => scrollCarrossel(label, 'left', filteredSeries.length)}>
                  <Ionicons name="chevron-back-circle" size={36} color="#FF0000" />
                </TouchableOpacity>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={scrollRefs[label]}
                >
                  {filteredSeries.map(serie => (
                    <TouchableOpacity
                      key={serie.id}
                      style={styles.card}
                      onPress={() => navigation.navigate('Sinopse', { filme: serie, tipo: 'SERIE' })}
                    >
                      <Image source={{ uri: serie.imagemUrl }} style={styles.image} />
                      <Text style={styles.title}>{serie.titulo}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.arrowButton} onPress={() => scrollCarrossel(label, 'right', filteredSeries.length)}>
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
    marginBottom: 15,
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
export default Series;