import { useState } from 'react';

import { StyleSheet, View, TextInput } from "react-native"
import { IconButton } from 'react-native-paper';

import TimePicker from './TimePicker';
import ProfilePicker from './ProfilePicker';
import SportPicker from './SportPicker';

const styles = StyleSheet.create({
    searchInput: {
        backgroundColor: 'white',
        opacity: 0.8,
        flex: 1,
        height: '100%',
        padding: 10,
        borderRadius: 10,
      },
      searchBtn: {
        alignSelf: 'center',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        height: 40,
        width: 40,
        backgroundColor: 'lightgreen',
      },
      searchBtnLoading: {
        alignSelf: 'center',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        height: 40,
        width: 40,
        backgroundColor: 'lightgrey',
      },
      plusBtn: {
        alignSelf: 'center',
        height: 40,
        width: 40,
        backgroundColor: 'lightgrey',
      },
      searchBloc: {
        flexDirection: 'row',
        alignContent: 'space-around',
        width: '100%'
      },
      filters: {
        backgroundColor: 'white'
      },
      picker: {
        backgroundColor: 'white',
      }
});

export default SearchBar = (props) => {
    const { 
      style, 
      onSearch,
      isLoading,
      inputText, 
      onChangeText, 
      onSearchTextFocus, 
      onSearchTextBlur, 
      onProfileSelection,
      minutes,
      onTimeSelection,
      sport,
      setSport } = props;

    const [showFilters, setShowFilters] = useState(false);

    return (
        <View style={style}>
          <View style={styles.searchBloc}>
            <TextInput 
              style={styles.searchInput}
              value={inputText} 
              onFocus={onSearchTextFocus}
              onBlur={onSearchTextBlur}
              onChangeText={onChangeText}>
            </TextInput>
            <IconButton 
              icon={isLoading ? "progress-download":"magnify"}
              style={isLoading ? styles.searchBtnLoading : styles.searchBtn}
              onPress={() => onSearch()}
            />
            <IconButton 
              icon={showFilters ? "minus" : "plus"}
              style={styles.plusBtn}
              onPress={() => setShowFilters(!showFilters)}
            />
          </View>

          {showFilters && <View style={styles.filters}>
            <ProfilePicker onProfileSelection={onProfileSelection}/>
            <TimePicker
              style={styles.picker}
              minutes={minutes}
              setMinutes={onTimeSelection} 
            />
            <SportPicker
              sport={sport}
              setSport={setSport}>
            </SportPicker>
          </View>}

        </View>
    )
}