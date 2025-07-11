import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';

const CategoryItem = ({item, isSelected, onSelect}: any) => {
  return (
    <Pressable
      style={[styles.categoryItem, isSelected && styles.selectedCategory]}
      onPress={onSelect}>
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#F7F9FC',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#4C6EF5',
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C6EF5',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default CategoryItem;
