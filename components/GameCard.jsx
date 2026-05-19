import { View, Text, Image, StyleSheet } from 'react-native';
import flags from './flags';

export default function GameCard({ game }) {

    const flagCasa = flags[game.sigla_casa];
    const flagFora = flags[game.sigla_fora];

    return (
        <View style={styles.jogo}>

            <Text style={styles.grupo}>
                GRUPO {game.grupo}  {game.confronto}
            </Text>

            <View style={styles.linhaPrincipal}>

                <View style={styles.time}>
                    {flagCasa && <Image style={styles.bandeira} source={flagCasa} />}
                    <Text style={styles.sigla}>{game.sigla_casa}</Text>
                </View>

                <View style={styles.horario}>
                    <Text style={styles.hora}>{game.hora_brasilia}</Text>
                    <Text style={styles.subTitulo}>VS</Text>
                </View>

                <View style={styles.time}>
                    <Text style={styles.sigla}>{game.sigla_fora}</Text>
                    {flagFora && <Image style={styles.bandeira} source={flagFora} />}
                </View>

            </View>

            <View style={styles.local}>
                <Text style={styles.subTitulo}>{game.estadio}</Text>
                <Text style={styles.subTitulo}>
                    {game.cidade} • {game.pais}
                </Text>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
  jogo: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2d3d',
    paddingBottom: 15
  },
  grupo: {
    color: '#8fa3b8',
    fontSize: 12,
    marginBottom: 10
  },
  linhaPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  bandeira: {
    width: 28,
    height: 28,
    borderRadius: 14
  },
  sigla: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  horario: {
    alignItems: 'center'
  },
  hora: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  local: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subTitulo: {
    color: '#8fa3b8',
    fontSize: 12
  }
});