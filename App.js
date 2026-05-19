import { StyleSheet, Text, View, Image, ImageBackground, SectionList, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DiaCard from './components/DiaCard';
import { agruparPorData } from './utils/agruparPorData';
import dados from './assets/dados.json'

const GRUPOS = [null, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function App() {

  const jogos = dados.jogos
  const [favoritos, setFavoritos] = useState([])
  const [grupoSelecionado, setGrupoSelecionado] = useState(null)

  const toggleFavorito = (id) => {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const jogosFiltrados = grupoSelecionado
    ? jogos.filter(j => j.grupo === grupoSelecionado)
    : jogos

  const jogosAgrupados = agruparPorData(jogosFiltrados)

  const jogosTratados = Object.keys(jogosAgrupados).map(data => {
    return {
      title: data,
      data: jogosAgrupados[data]
    }
  })

  return (
    <ImageBackground style={styles.container}
      source={require('./assets/bg-overlay.png')}>
      <Image style={styles.logo}
        source={require('./assets/unicopa.png')}
      />

      <Text style={styles.title}>CALENDÁRIO</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtros}
        contentContainerStyle={styles.filtrosConteudo}
      >
        {GRUPOS.map((grupo) => (
          <TouchableOpacity
            key={grupo ?? 'todos'}
            style={[styles.filtroBtn, grupoSelecionado === grupo && styles.filtroBtnAtivo]}
            onPress={() => setGrupoSelecionado(grupo)}
          >
            <Text style={[styles.filtroTexto, grupoSelecionado === grupo && styles.filtroTextoAtivo]}>
              {grupo ? `Grupo ${grupo}` : 'Todos'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionList
        sections={jogosTratados}
        keyExtractor={(item, index) => item + index}
        renderItem={() => null}
        renderSectionHeader={({ section }) => (
          <DiaCard
            data={section.title}
            jogos={section.data}
            favoritos={favoritos}
            onToggleFavorito={toggleFavorito}
          />
        )}
      />

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#040b13',
    alignItems: 'center',
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 50,
    resizeMode: 'contain'
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  filtros: {
    marginTop: 12,
    marginBottom: 4,
    maxHeight: 40,
  },
  filtrosConteudo: {
    paddingHorizontal: 10,
    gap: 8,
  },
  filtroBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    backgroundColor: '#0c1b2a',
  },
  filtroBtnAtivo: {
    borderColor: '#f2cc2f',
    backgroundColor: '#1e2a00',
  },
  filtroTexto: {
    color: '#8fa3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  filtroTextoAtivo: {
    color: '#f2cc2f',
  },
});
