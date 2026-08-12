import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const ImagePickerComponent = () => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const takePhoto = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar a câmera foi negada.');
      return;
    }

    setLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    setLoading(false);

    if (result.canceled) return;
    setImageUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar a galeria foi negada.');
      return;
    }

    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    setLoading(false);

    if (result.canceled) return;
    setImageUri(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Foto</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalVisible(true)} disabled={loading}>
          <FontAwesome name="image" size={14} color="#fff" />
          <Text style={styles.selectButtonText}>{loading ? 'Abrindo...' : 'Selecionar'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : loading ? (
          <ActivityIndicator size="large" color="#4ECDC4" />
        ) : (
          <View style={styles.placeholder}>
            <FontAwesome name="picture-o" size={32} color="#C4C8CC" />
            <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Adicionar foto</Text>

            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <View style={styles.modalIconCircle}>
                <FontAwesome name="camera" size={16} color="#4ECDC4" />
              </View>
              <Text style={styles.modalOptionText}>Tirar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={pickFromGallery}>
              <View style={styles.modalIconCircle}>
                <FontAwesome name="picture-o" size={16} color="#4ECDC4" />
              </View>
              <Text style={styles.modalOptionText}>Escolher da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#F7F8FA',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  placeholder: {
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modalOptionText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  modalCancel: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  modalCancelText: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default ImagePickerComponent;