import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce';
import { SearchIcon } from '../icon';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (text: string) => void;
  value: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onSearch, value }) => {
  // Debounced callback to handle input changes
  const debouncedOnSearch = useCallback(
    debounce((text: string) => onSearch(text), 300),
    [onSearch]
  );

  const handleChangeText = (text: string) => {
    debouncedOnSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: 20, height: 20, marginLeft: 5}}>
        <SearchIcon />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Search Your Brands'}
        placeholderTextColor="#B0B0B0"
        onChangeText={handleChangeText}
        defaultValue={value}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light grey background for the input
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#F0EEFF', // Matches the container background
    color: '#333',
  },
  iconContainer: {
    backgroundColor: '#333', // Yellow background for the icon
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchInput;