export const agruparPorData = (jogos) => {
    const agrupado = jogos.reduce((acc, jogo) => {
        const data = jogo.data_brasilia

        if (!acc[data]) {
            acc[data] = []
        }

        acc[data].push(jogo)

        return acc
    }, {})

    Object.keys(agrupado).forEach(data => {
        agrupado[data].sort((a, b) => a.hora_brasilia.localeCompare(b.hora_brasilia))
    })

    return agrupado
}
