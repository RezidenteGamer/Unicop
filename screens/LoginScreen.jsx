import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const entrar = async () => {
    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha.')
      return
    }
    if (!validarEmail(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail no formato correto.')
      return
    }

    setCarregando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setCarregando(false)

    if (error) {
      Alert.alert('Erro ao entrar', 'E-mail ou senha incorretos.')
    }
    // sucesso: App.js detecta a sessão e redireciona automaticamente
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Image style={styles.logo} source={require('../assets/unicopa.png')} />
      <Text style={styles.subtitulo}>Copa do Mundo FIFA 2026</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Entrar</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#4a6580"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="••••••••"
          placeholderTextColor="#4a6580"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btn, carregando && styles.btnDesativado]}
          onPress={entrar}
          disabled={carregando}
        >
          <Text style={styles.btnTexto}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkTexto}>
            Não tem conta? <Text style={styles.link}>Registre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040b13', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 200, height: 55, resizeMode: 'contain', marginBottom: 4 },
  subtitulo: { color: '#8fa3b8', fontSize: 13, marginBottom: 32 },
  card: { backgroundColor: '#0c1b2a', borderRadius: 16, padding: 24, width: '100%', maxWidth: 380, borderWidth: 1, borderColor: '#1e2d3d' },
  cardTitulo: { color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 20 },
  label: { color: '#8fa3b8', fontSize: 13, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#040b13', borderRadius: 10, borderWidth: 1, borderColor: '#1e2d3d', color: 'white', padding: 12, fontSize: 15, marginBottom: 16 },
  btn: { backgroundColor: '#f2cc2f', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 16 },
  btnDesativado: { opacity: 0.6 },
  btnTexto: { color: '#040b13', fontWeight: '800', fontSize: 16 },
  linkTexto: { color: '#8fa3b8', textAlign: 'center', fontSize: 14 },
  link: { color: '#f2cc2f', fontWeight: '700' },
})
