import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';
import { FontAwesome } from '@expo/vector-icons';

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#9B59B6', '#F39C12'];

const getAvatarColor = (name = '') => {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index] || AVATAR_COLORS[0];
};

const ContactsComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.slice(-9);
  };

  const dedupePhoneNumbers = (phoneNumbers = []) => {
    const seen = new Set();
    return phoneNumbers.filter((phone) => {
      const normalized = normalizePhone(phone.number);
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  };

  const loadContacts = async () => {
    setLoading(true);
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar contatos foi negada.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const cleanedData = data.map((contact) => ({
          ...contact,
          phoneNumbers: dedupePhoneNumbers(contact.phoneNumbers),
        }));
        setContacts(cleanedData);
      } else {
        Alert.alert('Sem Contatos', 'Nenhum contato encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os contatos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const renderItem = ({ item }) => {
    const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Sem nome';
    const initial = fullName.charAt(0).toUpperCase();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(fullName) }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.contactName}>{fullName}</Text>
        </View>

        {item.phoneNumbers && item.phoneNumbers.map((phone, index) => (
          <View key={index} style={styles.contactDetailRow}>
            <View style={styles.iconCircle}>
              <FontAwesome name="phone" size={12} color="#4ECDC4" />
            </View>
            <Text style={styles.contactDetail}>{phone.number}</Text>
          </View>
        ))}

        {item.emails && item.emails.map((email, index) => (
          <View key={index} style={styles.contactDetailRow}>
            <View style={styles.iconCircle}>
              <FontAwesome name="envelope" size={12} color="#FF6B6B" />
            </View>
            <Text style={styles.contactDetail}>{email.email}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Contatos</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadContacts} disabled={loading}>
          <FontAwesome name="refresh" size={14} color="#fff" />
          <Text style={styles.reloadButtonText}>{loading ? 'Carregando...' : 'Recarregar'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  reloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  contactDetail: {
    fontSize: 13,
    color: '#555',
  },
});

export default ContactsComponent;