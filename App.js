import React, { Component, createRef } from 'react';
import { PermissionsAndroid, StyleSheet, Text, TextInput, View, ScrollView, FlatList } from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import MapboxGL from '@react-native-mapbox-gl/maps';

import SearchBar from './Components/SearchBar';
import HorizontalCardFlatList from './Components/HorizontalCardFlatList';

import executeOverpassQuery from './data/overpass';

import {mapboxToken, getIsochrone} from './data/mapboxAPI';

MapboxGL.setAccessToken(mapboxToken);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'tomato'
  },
  map: {
    flex: 1,
    zIndex: -2,
    elevation: -2,
  },
  title: {
    fontSize: 100
  },
  search: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    top: 10,
    left: 10,
    right: 10,
    width: '90%',
    zIndex: 2,
    elevation: 2,
  },
});

class App extends Component {

  state = {
    inputText: "Berlin",
    center: {lat: 0, lon: 0},
    locations: [],
    isLoading: false,
    isEditing: false,
    selectedFeature: '',
    geoloc: false,
    userPosition: null,
    isochrone: null,
    profile: 'walking',
    minutes: 20,
    sport: 'swimming'
  };

  map = createRef();

  requestGeolocationPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const userPosition = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };

              this.setState({...this.state, userPosition, center: userPosition})
              this.fetchNewIsochrone();
            },
            (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          this.setState({...this.state, geoloc: false});
        }
      }).catch(console.warn);
  };
  
  componentDidMount() {
    this.requestGeolocationPermission();
  }

  setInputText = inputText => {
    this.setState({...this.state, inputText})
  }

  setLocations = locations => {
    this.setState({...this.state, locations}, flyToResults);
  }

  setIsEditing = isEditing => {
    this.setState({...this.state, isEditing})
  }

  setIsLoading = isLoading => {
    this.setState({...this.state, isLoading})
  }

  setProfile = profile => {
    console.log('new profile: ' + profile)
    this.setState({...this.state, profile})
    this.fetchNewIsochrone()
  }

  setMinutes = minutes => {
    this.setState({...this.state, minutes});
    this.fetchNewIsochrone()
  }

  setSport = sport => {
    this.setState({...this.state, sport});
  }


  fetchLocations() {
    const {inputText, sport} = this.state;
    this.setIsLoading(true)
    try {
      executeOverpassQuery(inputText, sport).then(data => {
        const nodes = data.elements.filter(obj => obj.type === 'node' && !!obj.lat && !! obj.lon);
    
        this.setState({...this.state, locations: nodes, isLoading: false});
      });
      
    } catch (e) {
      console.log(e)
    }
    
    console.log('not fetching anymore')
  }

  fetchNewIsochrone() {
    console.log('fetching new isochrone');
    const {profile, minutes, center} = this.state;
    getIsochrone(profile, center, minutes).then(d => {
      this.setState({...this.state, isochrone: d});
    })
  }

  setSelectedFeature(id) {
    this.setState({...this.state, selectedFeature: id});
  }

  getCenter() {
    const {selectedFeature, locations } = this.state;
    
    if (selectedFeature) {
      const loc = locations.filter(location => `${location.id}` === selectedFeature)[0];

      return [loc.lon, loc.lat]
    }
    if (locations.length > 0) {
      return [locations[0].lon, locations[0].lat];
    }
    if (this.state.userPosition !== null) {
      return [this.state.userPosition.lon, this.state.userPosition.lat];
    }
  }

  getTags(nodes) {
    return nodes.reduce((acc, curr) =>  {
      return curr.tags;
    }, {});
  }

  render() {
    const { inputText, locations, isEditing, isLoading, selectedFeature, minutes, isochrone, sport } = this.state;
    const center = this.getCenter();

    return (
      <View style={styles.page}>
        {/* displays a Searchbar and all search related filters time / profile */}
        <SearchBar
          style={ styles.search } 
          inputText={ inputText }
          onChangeText={text => this.setInputText(text) }
          onSearchTextFocus={ () => this.setIsEditing(isEditing) }
          onSearchTextBlur={ () => this.setIsEditing(!isEditing) }
          onSearch={ () => this.fetchLocations() }
          isLoading={isLoading}
          onProfileSelection={this.setProfile}
          minutes={minutes}
          onTimeSelection={this.setMinutes}
          sport={sport}
          setSport={this.setSport}
        />
      
        {/* show location details */}
        <HorizontalCardFlatList
          selectedFeature={selectedFeature}
          onTapCard={node => this.setSelectedFeature(`${node.id}`)}
          minify={this.isEditing}
          items={locations} 
          style={{flex: 1, height: '20%', backgroundColor: 'white'}}>
        </HorizontalCardFlatList>
        
        {/* Map view in the background */}
        <View style={styles.container}>
          <MapboxGL.MapView 
            logoEnabled={false}
            centerCoordinate={center}
            style={styles.map}>
                <MapboxGL.Camera
                  zoomLevel={10}
                  animationDuration={4000}
                  ref={this.camera} 
                  centerCoordinate={center}
                  animationMode='flyTo' />
                
                {/* display user position */}
                {
                  this.state.userPosition && 
                    <MapboxGL.PointAnnotation 
                      key={'userPosition'} 
                      id='user_position'
                      coordinate={[this.state.userPosition.lon, this.state.userPosition.lat]}/>
                }

                {/* show locations found from OSM overpass api */}
                {
                  locations.map(loc => {
                    return (
                      <MapboxGL.PointAnnotation 
                        id={`${loc.id}`} 
                        key={loc.id} 
                        coordinate={[loc.lon, loc.lat]}
                        onSelected={feature => this.setSelectedFeature(feature.properties.id)}
                      />
                    );
                  })
                }
                
                {/* Draw isochrone if there is one */}
                {
                  isochrone != null ? 
                    <MapboxGL.ShapeSource 
                      id='isochrone_dist' 
                      shape={isochrone}>
                        <MapboxGL.FillLayer
                          id="filllayer"
                          style={{
                           fillAntialias: true,
                           fillColor: 'red',
                           fillOutlineColor: 'black',
                            fillOpacity: 0.5,
                          }}
                        />
                    </MapboxGL.ShapeSource> : console.log('no isochrone to draw')
                }
          </MapboxGL.MapView>
        </View>

      </View>
    );
  }
}


export default App;