import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggleCategory} from '../../../store/slices/categoriesSlice';
import {RootState} from '../../../store/store';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../../../lib/firebase';
import CategoryItem from '../../components/categories-item';

interface Category {
  c_id: string;
  name: string;
}

const WatchListScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const selectedCategories = useSelector(
    (state: RootState) => state.categories,
  );
  const [localCategories, setLocalCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedCategories: Category[] = querySnapshot.docs.map(doc => ({
          c_id: doc.id,
          ...doc.data(),
        })) as Category[];

        setLocalCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    dispatch(toggleCategory(categoryName));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Get deal alerts on your must-haves!</Text>
      <Text style={styles.subHeaderText}>
        Select your must-have items to add to your Watch List.
      </Text>

      <FlatList
        data={localCategories}
        numColumns={3}
        keyExtractor={item => item.c_id}
        renderItem={({item}) => (
          <CategoryItem
            item={item}
            isSelected={selectedCategories.some(
              selectedCat => selectedCat.name === item.name,
            )}
            onSelect={() => handleCategorySelect(item.name)}
          />
        )}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories found</Text>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('explore')}
          style={styles.browseButton}>
          <Text style={styles.browseButtonText}>Start browsing (2/2)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('explore')}>
          <Text style={styles.skipText}>Skip & start browsing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: 20},
  headerText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {justifyContent: 'center', paddingVertical: 10},
  footer: {marginTop: 20, alignItems: 'center'},
  browseButton: {
    backgroundColor: '#4C6EF5',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  browseButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
  skipText: {color: '#4C6EF5', fontSize: 14, textAlign: 'center'},
  emptyText: {textAlign: 'center', color: '#555', marginTop: 20, fontSize: 16},
});

export default WatchListScreen;
