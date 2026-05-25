import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { formatarData } from '../utils/formatarData';

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'confirmados', label: 'Confirmados' },
]

const jogoJaComecou = (jogo) => {
  if (!jogo) return false;
  const dt = new Date(`${jogo.data_brasilia}T${jogo.hora_brasilia}:00-03:00`);
  return new Date() > dt;
};

export default function MeusPalpitesScreen() {
  const [palpites, setPalpites] = useState([])
  const [jogosMap, setJogosMap] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('todos')

  useFocusEffect(
    useCallback(() => {
      carregarPalpites()
    }, [])
  )

  const carregarPalpites = async () => {
    setCarregando(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setCarregando(false); return }

    const [{ data: palpitesData }, { data: jogosData }] = await Promise.all([
      supabase.from('palpites').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
      supabase.from('jogos').select('*'),
    ])

    setPalpites(palpitesData ?? [])

    const mapa = {}
    ;(jogosData ?? []).forEach(j => { mapa[j.id] = j })
    setJogosMap(mapa)
    setCarregando(false)
  }

  const palpitesFiltrados = palpites.filter(p => {
    if (filtro === 'pendentes') return !p.confirmado
    if (filtro === 'confirmados') return p.confirmado
    return true
  })

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f2cc2f" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Palpites</Text>

      <View style={styles.filtrosRow}>
        {FILTROS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filtroBtn, filtro === f.key && styles.filtroBtnAtivo]}
            onPress={() => setFiltro(f.key)}
          >
            <Text style={[styles.filtroTexto, filtro === f.key && styles.filtroTextoAtivo]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {palpitesFiltrados.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcone}>🎯</Text>
          <Text style={styles.emptyTexto}>Você ainda não cadastrou palpites</Text>
          <Text style={styles.emptySubTexto}>
            Vá na aba Palpites e salve seus placar esperados!
          </Text>
        </View>
      ) : (
        <FlatList
          data={palpitesFiltrados}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.lista}
          renderItem={({ item: pal }) => {
            const jogo = jogosMap[pal.jogo_id]
            const iniciado = jogoJaComecou(jogo)

            return (
              <View style={[
                styles.card,
                pal.confirmado && styles.cardConfirmado,
                iniciado && !pal.confirmado && styles.cardIniciado,
              ]}>
                {jogo && (
                  <Text style={styles.cardMeta}>
                    {formatarData(jogo.data_brasilia)} • {jogo.hora_brasilia}
                    {jogo.grupo ? `  •  Grupo ${jogo.grupo}` : ''}
                  </Text>
                )}
                <Text style={styles.cardConfrontos}>
                  {jogo ? jogo.confronto : `Jogo #${pal.jogo_id}`}
                </Text>

                <View style={styles.placarRow}>
                  <Text style={styles.placarTexto}>{pal.gols_casa} × {pal.gols_fora}</Text>
                  {pal.confirmado
                    ? <Text style={styles.badgeConfirmado}>✓ Confirmado</Text>
                    : iniciado
                      ? <Text style={styles.badgeIniciado}>🔒 Jogo iniciado</Text>
                      : <Text style={styles.badgePendente}>⏳ Pendente</Text>
                  }
                </View>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040b13', paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  titulo: { color: 'white', fontSize: 24, fontWeight: '800', paddingHorizontal: 16, marginBottom: 12 },
  filtrosRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  filtroBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#1e2d3d', backgroundColor: '#0c1b2a' },
  filtroBtnAtivo: { borderColor: '#f2cc2f', backgroundColor: '#1e2a00' },
  filtroTexto: { color: '#8fa3b8', fontSize: 13, fontWeight: '600' },
  filtroTextoAtivo: { color: '#f2cc2f' },
  lista: { padding: 16, paddingTop: 4 },
  card: { backgroundColor: '#0c1b2a', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1e2d3d' },
  cardConfirmado: { borderColor: '#009c3b' },
  cardIniciado: { opacity: 0.7 },
  cardMeta: { color: '#8fa3b8', fontSize: 11, marginBottom: 4 },
  cardConfrontos: { color: 'white', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  placarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placarTexto: { color: '#f2cc2f', fontSize: 22, fontWeight: '900' },
  badgeConfirmado: { color: '#009c3b', fontSize: 12, fontWeight: '700' },
  badgeIniciado: { color: '#8fa3b8', fontSize: 12 },
  badgePendente: { color: '#f2cc2f', fontSize: 12 },
  emptyIcone: { fontSize: 48, marginBottom: 12 },
  emptyTexto: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  emptySubTexto: { color: '#8fa3b8', fontSize: 13, textAlign: 'center' },
})
