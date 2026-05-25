import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [carregando, setCarregando] = useState(false)

  const registrar = async () => {
    if (!email || !senha || !confirmar) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail, senha e confirmação.')
      return
    }
    if (!validarEmail(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail no formato correto.')
      return
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmar) {
      Alert.alert('Senhas diferentes', 'A senha e a confirmação não correspondem.')
      return
    }

    setCarregando(true)
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome: nome || null } },
    })
    setCarregando(false)

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message)
      return
    }

    Alert.alert(
      'Cadastro realizado! ✅',
      'Verifique seu e-mail para confirmar a conta e depois faça o login.',
      [{ text: 'Ir para Login', onPress: () => navigation.navigate('Login') }]
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Registrar-se</Text>
        <Text style={styles.subtitulo}>Crie sua conta UNICOPA</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome (opcional)</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor="#4a6580"
          />

          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#4a6580"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Senha * (mín. 6 caracteres)</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••••"
            placeholderTextColor="#4a6580"
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar senha *</Text>
          <TextInput
            style={styles.input}
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="••••••••"
            placeholderTextColor="#4a6580"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, carregando && styles.btnDesativado]}
            onPress={registrar}
            disabled={carregando}
          >
            <Text style={styles.btnTexto}>
              {carregando ? 'Cadastrando...' : 'Criar conta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkTexto}>
              Já tem conta? <Text style={styles.link}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040b13' },
  scroll: { alignItems: 'center', justifyContent: 'center', padding: 20, flexGrow: 1 },
  titulo: { color: '#f2cc2f', fontSize: 28, fontWeight: '900', marginBottom: 4 },
  subtitulo: { color: '#8fa3b8', fontSize: 13, marginBottom: 24 },
  card: { backgroundColor: '#0c1b2a', borderRadius: 16, padding: 24, width: '100%', maxWidth: 380, borderWidth: 1, borderColor: '#1e2d3d' },
  label: { color: '#8fa3b8', fontSize: 13, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#040b13', borderRadius: 10, borderWidth: 1, borderColor: '#1e2d3d', color: 'white', padding: 12, fontSize: 15, marginBottom: 16 },
  btn: { backgroundColor: '#f2cc2f', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 16 },
  btnDesativado: { opacity: 0.6 },
  btnTexto: { color: '#040b13', fontWeight: '800', fontSize: 16 },
  linkTexto: { color: '#8fa3b8', textAlign: 'center', fontSize: 14 },
  link: { color: '#f2cc2f', fontWeight: '700' },
})
