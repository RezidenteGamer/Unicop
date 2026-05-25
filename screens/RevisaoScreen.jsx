import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatarData } from '../utils/formatarData';

const jogoJaComecou = (jogo) => {
  const dt = new Date(`${jogo.data_brasilia}T${jogo.hora_brasilia}:00-03:00`);
  return new Date() > dt;
};

export default function RevisaoScreen({ route, navigation }) {
  const { palpites, jogos, userId } = route.params
  const [confirmando, setConfirmando] = useState(false)

  const jogosPendentes = jogos.filter(
    j => palpites[j.id] && !palpites[j.id].confirmado && !jogoJaComecou(j)
  )

  const confirmarTodos = async () => {
    setConfirmando(true)

    const atualizacoes = jogosPendentes.map(j =>
      supabase
        .from('palpites')
        .update({ confirmado: true })
        .eq('user_id', userId)
        .eq('jogo_id', j.id)
    )

    const resultados = await Promise.all(atualizacoes)
    setConfirmando(false)

    const erros = resultados.filter(r => r.error)
    if (erros.length > 0) {
      Alert.alert('Erro', 'Alguns palpites não puderam ser confirmados.')
      return
    }

    Alert.alert(
      'Palpites confirmados! 🏆',
      `${jogosPendentes.length} palpite(s) confirmado(s) com sucesso!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarBtn}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Revisão de Palpites</Text>
      </View>

      {jogosPendentes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcone}>🎯</Text>
          <Text style={styles.emptyTexto}>Nenhum palpite pendente para confirmar.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.subtitulo}>
            {jogosPendentes.length} palpite(s) serão confirmados:
          </Text>

          <FlatList
            data={jogosPendentes}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.lista}
            renderItem={({ item: jogo }) => {
              const pal = palpites[jogo.id]
              return (
                <View style={styles.card}>
                  <Text style={styles.cardMeta}>
                    {formatarData(jogo.data_brasilia)} • {jogo.hora_brasilia}
                    {jogo.grupo ? `  •  Grupo ${jogo.grupo}` : ''}
                  </Text>
                  <Text style={styles.cardConfrontos}>{jogo.confronto}</Text>
                  <View style={styles.placarRow}>
                    <Text style={styles.placarTexto}>{pal.gols_casa}</Text>
                    <Text style={styles.xTexto}> × </Text>
                    <Text style={styles.placarTexto}>{pal.gols_fora}</Text>
                  </View>
                </View>
              )
            }}
          />

          <View style={styles.rodape}>
            <TouchableOpacity
              style={[styles.confirmarBtn, confirmando && styles.btnDesativado]}
              onPress={confirmarTodos}
              disabled={confirmando}
            >
              {confirmando
                ? <ActivityIndicator color="#040b13" />
                : <Text style={styles.confirmarTexto}>✅ Confirmar {jogosPendentes.length} palpite(s)</Text>
              }
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040b13' },
  cabecalho: { padding: 16, paddingTop: 48, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#1e2d3d' },
  voltarBtn: { paddingVertical: 6, paddingRight: 8 },
  voltarTexto: { color: '#f2cc2f', fontSize: 15, fontWeight: '700' },
  titulo: { color: 'white', fontSize: 20, fontWeight: '800' },
  subtitulo: { color: '#8fa3b8', fontSize: 13, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  lista: { padding: 16 },
  card: { backgroundColor: '#0c1b2a', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1e2d3d' },
  cardMeta: { color: '#8fa3b8', fontSize: 11, marginBottom: 4 },
  cardConfrontos: { color: 'white', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  placarRow: { flexDirection: 'row', alignItems: 'center' },
  placarTexto: { color: '#f2cc2f', fontSize: 28, fontWeight: '900' },
  xTexto: { color: '#8fa3b8', fontSize: 20, fontWeight: 'bold' },
  rodape: { padding: 16, borderTopWidth: 1, borderTopColor: '#1e2d3d' },
  confirmarBtn: { backgroundColor: '#f2cc2f', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnDesativado: { opacity: 0.6 },
  confirmarTexto: { color: '#040b13', fontWeight: '800', fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcone: { fontSize: 48, marginBottom: 12 },
  emptyTexto: { color: '#8fa3b8', fontSize: 15, textAlign: 'center' },
})
