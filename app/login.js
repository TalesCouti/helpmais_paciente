import axios from 'axios';
import React, { useState,useEffect  } from 'react';
import { styles } from "./styles";
import { View, Image, StatusBar, TextInput, TouchableOpacity, Text } from 'react-native';
import icons from '../constants/icons';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

const API_URL = 'https://helpmais-paciente.onrender.com'



export default function Teladelogin() {
  const router = useRouter();
  const [cpf, setcpf] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  
  const navigateToinicio = () => {
    router.push('/inicio'); 
  };


  useEffect(() => {
    NfcManager.start();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        cpf,
        password: senha,
      });
      const { token } = response.data;
      Alert.alert('Login realizado', `Token: ${token}`);
      navigateToinicio(); 
    } catch (error) {
      console.warn('Erro ao logar:', error);
      Alert.alert('Erro no login', error.response?.data || 'Falha na requisição');
    }
  };
  const readNfc = async () => {
    try {
     
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Tag NFC lida:', tag);
      Alert.alert('NFC Detectado', JSON.stringify(tag));
    } catch (ex) {
      console.warn('Erro ao ler NFC', ex);
    } finally {
     
      NfcManager.cancelTechnologyRequest();
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004aad" />

      <Image
        source={icons.iconlogo}
        style={styles.imagem}
        resizeMode="contain"
      />

<View style={styles.inputContainer}>
  <Image
    source={icons.iconperfil} 
    style={styles.icon}
    resizeMode="contain"
  />
  <TextInput
    style={styles.input}
    placeholder="CPF"
    placeholderTextColor="#ccc"
    onChangeText={setcpf}
    value={cpf}
    keyboardType="numeric"
    maxLength={11}
  />
</View>

<View style={styles.inputContainer}>
  <Image
    source={icons.iconsegu}
    style={styles.icon}
    resizeMode="contain"
  />
  
  <TextInput
    style={styles.input}
    placeholder="Senha"
    placeholderTextColor="#ccc"
    onChangeText={setSenha}
    value={senha}
    secureTextEntry={!senhaVisivel} 
  />
  
  <TouchableOpacity  onPress={() => setSenhaVisivel(!senhaVisivel)}>
    <Image
      source={senhaVisivel ? icons.iconver : icons.iconocul} 
      style={styles.iconEye}
      resizeMode="contain"
    />
  </TouchableOpacity>
</View>


      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.botao} onPress={readNfc}>
        <Text style={styles.textoBotao}>NFC</Text>
      </TouchableOpacity>
    </View>
  );
}
