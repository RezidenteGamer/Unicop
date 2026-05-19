import { View, Text, StyleSheet } from 'react-native';
import GameCard from './GameCard';
import { formatarData } from '../utils/formatarData';

export default function DiaCard({ data, jogos }) {
    const hoje = new Date().toISOString().split('T')[0];
    const ehHoje = data === hoje;

    return (
        <View style={[styles.card, ehHoje && styles.cardHoje]}>
            {ehHoje && <Text style={styles.labelHoje}>HOJE</Text>}
            <Text style={[styles.data, ehHoje && styles.dataHoje]}>
                {formatarData(data)}
            </Text>
            {jogos.map((jogo) => (
                <GameCard key={jogo.id} game={jogo} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        backgroundColor: '#0c1b2a',
        width: 320,
        borderRadius: 12,
        padding: 15,
    },
    cardHoje: {
        borderWidth: 2,
        borderColor: '#f2cc2f',
    },
    labelHoje: {
        color: '#f2cc2f',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 2,
    },
    data: {
        color: '#f2cc2f',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dataHoje: {
        fontSize: 26,
    },
});
