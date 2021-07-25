import React, {useLayoutEffect} from 'react';
import {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StatusBar} from 'react-native';
import MyButton from '../components/MyButton';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import STATE_DATA from '../data/state';
import {StyleSheet} from 'react-native';
import {AsyncStorage} from 'react-native';
import {useDispatch} from 'react-redux';
import {setPlace} from '../redux/actions/placeAction';
import {PlaceType} from '../types';
import {StackNavigationProp} from '@react-navigation/stack';

const ChooseScreen = () => {
  const [listState, setListState] = useState(STATE_DATA);
  const [listCity, setListCity] = useState([]);
  const [selectedValue, setSelectedValue] = useState<PlaceType>({
    state: {},
    city: {},
    cityIndex: null,
  });
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();

  const initScreen = async () => {
    try {
      const place = await AsyncStorage.getItem('placeDefault');

      if (place) {
        dispatch(setPlace(JSON.parse(place)));
        navigation.replace('Main Drawer');
        // navigation.navigate('Main Drawer');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const savePlace = async () => {
    try {
      await AsyncStorage.setItem('placeDefault', JSON.stringify(selectedValue));
      dispatch(setPlace(selectedValue));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(selectedValue);
    if (selectedValue.state.isoCode) {
      setListCity(selectedValue.state.cities);
    }
  }, [selectedValue]);

  useLayoutEffect(() => {
    initScreen();
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.textTitle}>Chọn Tỉnh</Text>
          {selectedValue.state.name && <Text>{selectedValue.state.name}</Text>}
          {!selectedValue.state.name && (
            <FlatList
              style={{flex: 1}}
              data={listState}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedValue({
                      ...selectedValue,
                      state: item,
                    })
                  }
                  style={styles.flatItem}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          {selectedValue.state.name && (
            <Text style={styles.textTitle}>Chọn thành phố</Text>
          )}
          {selectedValue.city.name && <Text>{selectedValue.city.name}</Text>}
          {!selectedValue.state.name ||
            (!selectedValue.city.name && (
              <FlatList
                data={listCity}
                style={{flex: 1}}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedValue({
                        ...selectedValue,
                        city: item,
                        cityIndex: index,
                      })
                    }
                    style={styles.flatItem}>
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            ))}
        </View>

        <MyButton
          callback={() => {
            savePlace();
            navigation.navigate('Main Drawer', {
              screen: 'Display Temp Screen',
            });
          }}
          title="Tiếp tục"
          styleContainer={{backgroundColor: '#e29baa'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e29baa',
    textDecorationLine: 'underline',
  },
  flatItem: {
    paddingVertical: 20,
    borderBottomColor: '#c5c5c5',
    borderBottomWidth: 1,
  },
});

export default ChooseScreen;
