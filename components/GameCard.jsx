import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import flags from './flags';

export default function GameCard({ game, favorito, onToggleFavorito }) {

    const flagCasa = flags[game.sigla_casa];
    const flagFora = flags[game.sigla_fora];
    const ehJogoBrasil = game.sigla_casa === 'BRA' || game.sigla_fora === 'BRA';

    return (
        <View style={[styles.jogo, ehJogoBrasil && styles.jogoBrasil]}>

            <View style={styles.cabecalho}>
                {ehJogoBrasil && (
                    <Text style={styles.labelBrasil}>JOGO DO BRASIL</Text>
                )}
                <TouchableOpacity onPress={onToggleFavorito} style={styles.estrela}>
                    <Text style={[styles.estrelaTexto, favorito && styles.estrellaAtiva]}>
                        {favorito ? '★' : '☆'}
                    </Text>
                </TouchableOpacity>
            </View>

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
        paddingBottom: 15,
    },
    jogoBrasil: {
        borderLeftWidth: 3,
        borderLeftColor: '#009c3b',
        paddingLeft: 10,
        backgroundColor: '#061a0e',
        borderRadius: 8,
        borderBottomColor: '#009c3b',
    },
    cabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    labelBrasil: {
        color: '#009c3b',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    estrela: {
        marginLeft: 'auto',
        padding: 4,
    },
    estrelaTexto: {
        fontSize: 20,
        color: '#8fa3b8',
    },
    estrellaAtiva: {
        color: '#f2cc2f',
    },
    grupo: {
        color: '#8fa3b8',
        fontSize: 12,
        marginBottom: 10,
    },
    linhaPrincipal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bandeira: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    sigla: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    horario: {
        alignItems: 'center',
    },
    hora: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    local: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subTitulo: {
        color: '#8fa3b8',
        fontSize: 12,
    },
});
