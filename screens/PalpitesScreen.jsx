import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { formatarData } from '../utils/formatarData';

const jogoJaComecou = (jogo) => {
  const dt = new Date(`${jogo.data_brasilia}T${jogo.hora_brasilia}:00-03:00`);
  return new Date() > dt;
};

export default function PalpitesScreen({ navigation }) {
  const [jogos, setJogos] = useState([])
  const [palpites, setPalpites] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [user, setUser] = useState(null)

  useFocusEffect(
    useCallback(() => {
      carregarDados()
    }, [])
  )

  const carregarDados = async () => {
    setCarregando(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setCarregando(false); return }
    setUser(session.user)

    const [{ data: jogosData }, { data: palpitesData }] = await Promise.all([
      supabase.from('jogos').select('*').order('data_brasilia').order('hora_brasilia'),
      supabase.from('palpites').select('*').eq('user_id', session.user.id),
    ])

    setJogos(jogosData ?? [])

    const mapa = {}
    ;(palpitesData ?? []).forEach(p => {
      mapa[p.jogo_id] = {
        gols_casa: String(p.gols_casa),
        gols_fora: String(p.gols_fora),
        confirmado: p.confirmado,
      }
    })
    setPalpites(mapa)
    setCarregando(false)
  }

  const atualizarPalpite = (jogoId, campo, valor) => {
    const num = valor.replace(/[^0-9]/g, '')
    setPalpites(prev => ({
      ...prev,
      [jogoId]: { ...prev[jogoId], [campo]: num },
    }))
  }

  const salvarPalpite = async (jogo) => {
    const pal = palpites[jogo.id] ?? {}
    if (pal.gols_casa === undefined || pal.gols_fora === undefined ||
        pal.gols_casa === '' || pal.gols_fora === '') {
      Alert.alert('Palpite incompleto', 'Preencha o placar dos dois times.')
      return
    }

    const { error } = await supabase.from('palpites').upsert({
      user_id: user.id,
      jogo_id: jogo.id,
      gols_casa: parseInt(pal.gols_casa),
      gols_fora: parseInt(pal.gols_fora),
      confirmado: false,
    }, { onConflict: 'user_id,jogo_id' })

    if (error) {
      Alert.alert('Erro', 'Não foi possível salvar o palpite.')
    } else {
      setPalpites(prev => ({
        ...prev,
        [jogo.id]: { ...prev[jogo.id], confirmado: false },
      }))
      Alert.alert('Salvo! ✅', `Palpite para ${jogo.time_casa} x ${jogo.time_fora} guardado.`)
    }
  }

  const irParaRevisao = () => {
    const pendentes = jogos.filter(
      j => palpites[j.id] && !palpites[j.id].confirmado && !jogoJaComecou(j)
    )
    if (pendentes.length === 0) {
      Alert.alert('Sem palpites', 'Salve pelo menos um palpite antes de confirmar.')
      return
    }
    navigation.navigate('Revisao', { palpites, jogos, userId: user.id })
  }

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f2cc2f" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jogos}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.titulo}>Palpites</Text>
            <TouchableOpacity style={styles.revisaoBtn} onPress={irParaRevisao}>
              <Text style={styles.revisaoTexto}>Revisar e confirmar →</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: jogo }) => {
          const comecou = jogoJaComecou(jogo)
          const pal = palpites[jogo.id] ?? {}
          const confirmado = pal.confirmado

          return (
            <View style={[
              styles.card,
              comecou && styles.cardBloqueado,
              confirmado && styles.cardConfirmado,
            ]}>
              <Text style={styles.cardMeta}>
                {formatarData(jogo.data_brasilia)} • {jogo.hora_brasilia}
                {jogo.grupo ? `  •  Grupo ${jogo.grupo}` : ''}
              </Text>
              <Text style={styles.cardConfrontos}>{jogo.confronto}</Text>

              {confirmado ? (
                <View style={styles.statusRow}>
                  <Text style={styles.confirmadoTexto}>
                    ✓ Confirmado: {pal.gols_casa} x {pal.gols_fora}
                  </Text>
                </View>
              ) : comecou ? (
                <View style={styles.statusRow}>
                  <Text style={styles.bloqueadoTexto}>
                    🔒 {pal.gols_casa !== undefined
                      ? `Palpite: ${pal.gols_casa} x ${pal.gols_fora}`
                      : 'Sem palpite — jogo iniciado'}
                  </Text>
                </View>
              ) : (
                <View style={styles.placarRow}>
                  <TextInput
                    style={styles.placarInput}
                    value={pal.gols_casa ?? ''}
                    onChangeText={v => atualizarPalpite(jogo.id, 'gols_casa', v)}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="0"
                    placeholderTextColor="#4a6580"
                  />
                  <Text style={styles.xTexto}>×</Text>
                  <TextInput
                    style={styles.placarInput}
                    value={pal.gols_fora ?? ''}
                    onChangeText={v => atualizarPalpite(jogo.id, 'gols_fora', v)}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="0"
                    placeholderTextColor="#4a6580"
                  />
                  <TouchableOpacity style={styles.salvarBtn} onPress={() => salvarPalpite(jogo)}>
                    <Text style={styles.salvarTexto}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040b13' },
  center: { flex: 1, backgroundColor: '#040b13', justifyContent: 'center', alignItems: 'center' },
  lista: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  titulo: { color: 'white', fontSize: 24, fontWeight: '800', marginBottom: 10 },
  revisaoBtn: { backgroundColor: '#1e2a00', borderWidth: 1, borderColor: '#f2cc2f', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, alignSelf: 'flex-start' },
  revisaoTexto: { color: '#f2cc2f', fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: '#0c1b2a', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1e2d3d' },
  cardBloqueado: { opacity: 0.6 },
  cardConfirmado: { borderColor: '#009c3b' },
  cardMeta: { color: '#8fa3b8', fontSize: 11, marginBottom: 4 },
  cardConfrontos: { color: 'white', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  placarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  placarInput: { backgroundColor: '#040b13', borderWidth: 1, borderColor: '#1e2d3d', borderRadius: 8, color: 'white', fontSize: 20, fontWeight: 'bold', width: 52, height: 48, textAlign: 'center' },
  xTexto: { color: '#8fa3b8', fontSize: 18, fontWeight: 'bold' },
  salvarBtn: { marginLeft: 'auto', backgroundColor: '#f2cc2f', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  salvarTexto: { color: '#040b13', fontWeight: '800', fontSize: 13 },
  statusRow: { marginTop: 4 },
  confirmadoTexto: { color: '#009c3b', fontWeight: '700', fontSize: 13 },
  bloqueadoTexto: { color: '#8fa3b8', fontSize: 13 },
})
