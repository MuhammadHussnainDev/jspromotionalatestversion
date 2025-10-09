import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCategory } from '../../../store/slices/categoriesSlice';
import { RootState } from '../../../store/store';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import CategoryItem from '../../components/categories-item';

interface Category {
  c_id: string;
  name: string;
}

const WatchListScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const selectedCategories = useSelector(
    (state: RootState) => state.categories,
  );
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedCategories: Category[] = querySnapshot.docs.map(doc => ({
          c_id: doc.id,
          ...doc.data(),
        })) as Category[];

        setLocalCategories(fetchedCategories);
        setFilteredCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(localCategories);
    } else {
      const filtered = localCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, localCategories]);

  const handleCategorySelect = (categoryName: string) => {
    dispatch(toggleCategory(categoryName));
  };

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Detect if device has gesture navigation (Android) or home indicator (iOS)
  const hasGestureNavigation = () => {
    if (Platform.OS === 'ios') {
      // iOS devices with home indicator (iPhone X and newer)
      return screenHeight >= 812; // iPhone X and newer have home indicator
    } else {
      // Android devices with gesture navigation
      return statusBarHeight === 0; // Gesture navigation typically has 0 status bar height
    }
  };

  // Calculate responsive top padding based on screen height and gesture navigation
  const getResponsiveTopPadding = () => {
    const hasGestures = hasGestureNavigation();

    if (screenHeight >= 900) {
      return hasGestures
        ? Platform.OS === 'ios'
          ? 100
          : 80 // Gesture devices need less padding
        : Platform.OS === 'ios'
        ? 120
        : 90; // Non-gesture devices need more padding
    }
    if (screenHeight >= 800) {
      return hasGestures
        ? Platform.OS === 'ios'
          ? 90
          : 70
        : Platform.OS === 'ios'
        ? 110
        : 80;
    }
    if (screenHeight >= 700) {
      return hasGestures
        ? Platform.OS === 'ios'
          ? 80
          : 60
        : Platform.OS === 'ios'
        ? 100
        : 70;
    }
    return hasGestures
      ? Platform.OS === 'ios'
        ? 70
        : 50
      : Platform.OS === 'ios'
      ? 90
      : 60;
  };

  // Comprehensive responsive breakpoints for all mobile screens
  const getResponsiveConfig = () => {
    if (screenWidth >= 1200) {
      // Large tablets and small desktops
      return {
        columns: 6,
        itemMargin: 10,
        fontSize: { header: 28, search: 19, button: 19 },
        padding: { horizontal: 30, vertical: 20 },
      };
    } else if (screenWidth >= 1024) {
      // Large tablets
      return {
        columns: 5,
        itemMargin: 8,
        fontSize: { header: 26, search: 18, button: 18 },
        padding: { horizontal: 25, vertical: 18 },
      };
    } else if (screenWidth >= 900) {
      // Medium tablets
      return {
        columns: 4,
        itemMargin: 7,
        fontSize: { header: 24, search: 17, button: 17 },
        padding: { horizontal: 22, vertical: 16 },
      };
    } else if (screenWidth >= 768) {
      // Small tablets
      return {
        columns: 4,
        itemMargin: 6,
        fontSize: { header: 22, search: 16, button: 16 },
        padding: { horizontal: 20, vertical: 15 },
      };
    } else if (screenWidth >= 650) {
      // Large phones (iPhone Plus, Pixel XL)
      return {
        columns: 3,
        itemMargin: 5,
        fontSize: { header: 20, search: 15, button: 15 },
        padding: { horizontal: 18, vertical: 12 },
      };
    } else if (screenWidth >= 600) {
      // Large phones
      return {
        columns: 3,
        itemMargin: 4,
        fontSize: { header: 19, search: 14, button: 14 },
        padding: { horizontal: 16, vertical: 10 },
      };
    } else if (screenWidth >= 480) {
      // Medium phones (iPhone 12/13/14)
      return {
        columns: 2,
        itemMargin: 8,
        fontSize: { header: 20, search: 16, button: 16 },
        padding: { horizontal: 20, vertical: 8 },
      };
    } else if (screenWidth >= 414) {
      // iPhone 11 Pro Max, iPhone 12/13/14 Pro Max
      return {
        columns: 2,
        itemMargin: 6,
        fontSize: { header: 19, search: 15, button: 15 },
        padding: { horizontal: 18, vertical: 6 },
      };
    } else if (screenWidth >= 375) {
      // iPhone 12/13/14, iPhone 11 Pro
      return {
        columns: 2,
        itemMargin: 5,
        fontSize: { header: 18, search: 14, button: 14 },
        padding: { horizontal: 16, vertical: 5 },
      };
    } else if (screenWidth >= 360) {
      // Android phones (Samsung Galaxy, Pixel)
      return {
        columns: 2,
        itemMargin: 4,
        fontSize: { header: 17, search: 13, button: 13 },
        padding: { horizontal: 14, vertical: 4 },
      };
    } else {
      // Small phones (iPhone SE, older Android)
      return {
        columns: 2,
        itemMargin: 3,
        fontSize: { header: 16, search: 12, button: 12 },
        padding: { horizontal: 12, vertical: 3 },
      };
    }
  };

  const responsiveConfig = getResponsiveConfig();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: responsiveConfig.padding.horizontal,
            paddingTop: getResponsiveTopPadding(),
          },
        ]}
      >
        <Text
          style={[
            styles.headerText,
            { fontSize: responsiveConfig.fontSize.header },
          ]}
        >
          {filteredCategories.length} Categories found near you!
        </Text>

        <TextInput
          style={[
            styles.searchBar,
            { fontSize: responsiveConfig.fontSize.search },
          ]}
          placeholder="Search for a category"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredCategories}
          numColumns={2}
          keyExtractor={item => item.c_id}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              isSelected={selectedCategories.some(
                selectedCat => selectedCat.name === item.name,
              )}
              onSelect={() => handleCategorySelect(item.name)}
            />
          )}
          contentContainerStyle={[
            styles.grid,
            {
              paddingBottom: screenHeight * 0.15,
            },
          ]}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                { fontSize: responsiveConfig.fontSize.search },
              ]}
            >
              No categories found
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('explore')}
            style={styles.browseButton}
          >
            <Text
              style={[
                styles.browseButtonText,
                { fontSize: responsiveConfig.fontSize.button },
              ]}
            >
              Next ({selectedCategories.length}/2)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('explore')}>
            <Text
              style={[
                styles.skipText,
                { fontSize: responsiveConfig.fontSize.search - 2 },
              ]}
            >
              Skip & start browsing
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 15,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchBar: {
    backgroundColor: '#F5F6FA',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 5,
    marginBottom: 25,
    borderWidth: 0,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  grid: {
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  browseButton: {
    backgroundColor: '#4C6EF5',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#4C6EF5',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
  },
});

export default WatchListScreen;
