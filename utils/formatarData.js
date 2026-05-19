export const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split('-')
    return `${dia}/${mes}`
}
