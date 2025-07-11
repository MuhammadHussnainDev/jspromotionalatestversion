import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchEntitiesByPostalCode} from '../../../actions/brand/fetch-brands';
import {toggleFavorite} from '../../../store/slices/favoritesSlice';
import {AuthContext} from '../../../lib/AuthContext';

const HomeScreen = ({navigation}: any) => {
  const {userData} = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const favorites = useSelector((state: any) => state.favorites);

  // const data = await fetchAllBrands(); // Fetch all brands from API
  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);

        // Fetch brands based on postal code
        const result = await fetchEntitiesByPostalCode(userData?.postalCode);

        if (result.success) {
          // @ts-expect-error ignore
          setStores(result.entities || []); // Set the brands if available
        } else {
          console.error('Error fetching brands:', result.message);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, [userData?.postalCode]);
  // @ts-expect-error ignore
  const handleToggleFavorite = brand => {
    dispatch(toggleFavorite(brand)); // Toggle favorite in Redux
    // dispatch(toggleFavorite({favorite: brand, userId: userData?.userId})); // Toggle favorite in Redux
  };

  const filteredStores = stores.filter(store =>
    // @ts-expect-error ignore
    store.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // @ts-expect-error ignore
  const renderStoreItem = ({item}) => {
    // Debugging logic for `isFavorite`
    // @ts-expect-error ignore
    const isFavorite = favorites.some(fav => fav.id === item.id);
    // console.log(`Is ${item.name} favorite?`, isFavorite);

    return (
      <Pressable
        style={[styles.storeItem, isFavorite && styles.favoriteItem]}
        onPress={() => handleToggleFavorite(item)}>
        <Image
          source={{uri: item?.image || 'https://via.placeholder.com/100'}}
          style={styles.storeIcon}
          resizeMode="cover"
        />
        <Text style={styles.storeName} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {filteredStores.length} Brands found near you!
      </Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a store"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={'#000'}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4C6EF5" />
      ) : (
        <FlatList
          data={filteredStores}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={renderStoreItem}
          contentContainerStyle={styles.storeList}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('categories')}
          style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next (1/2)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('categories')}>
          <Text style={styles.skipText}>Skip this step</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    position: 'relative',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchBar: {
    height: 50,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  storeList: {paddingHorizontal: 5},
  storeItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  favoriteItem: {
    borderWidth: 2,
    borderColor: '#4C6EF5',
  },
  storeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  nextButton: {
    backgroundColor: '#4C6EF5',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  nextButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  skipText: {color: '#4C6EF5', fontSize: 14, textAlign: 'center'},
});

export default HomeScreen;
