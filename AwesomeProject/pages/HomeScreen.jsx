import React, { useState, useEffect, useContext } from 'react';
import * as Icons from "react-native-heroicons/solid";
import * as UniIcon from "react-native-unicons";
import { PlayerContext } from '../App';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { Slider } from '@miblanchard/react-native-slider';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  PermissionsAndroid,
  Button,
  TouchableOpacity
} from 'react-native';

function HomeScreen({ navigation }) {

  const { songs, play, setPlay, songInplay, setSongInplay, isLoading, setIsLoading } = useContext(PlayerContext);
  const { position, buffered, duration } = useProgress()

  const PlaySound = async (song) => {
    await TrackPlayer.play();
    setPlay(true);
  };
  const StopSound = async () => {
    await TrackPlayer.pause();
    setPlay(false)
  }
  const nextOne = async () => {

    await TrackPlayer.skipToNext();
    let trackIndex = await TrackPlayer.getCurrentTrack();
    setSongInplay(songs[trackIndex])
  }

  const previousOne = async () => {

    await TrackPlayer.skipToPrevious()
    let trackIndex = await TrackPlayer.getCurrentTrack();
    setSongInplay(songs[trackIndex])
  };






  return (

    <SafeAreaView style={styles.darkBg}>

      <View style={styles.topButton}>
        <UniIcon.Search color="white" width={30} height={30} ></UniIcon.Search>
        <UniIcon.Setting color="white" width={30} height={30} style={styles.topButton2}></UniIcon.Setting>
      </View>
      <View style={styles.flex}>
        <Text style={styles.songsLoader}>ALL</Text>
        <Text style={styles.songsLoader}>PLAYLIST</Text>
        <Text style={styles.songsLoader}>ARTIST</Text>
        <Text style={styles.songsLoader}>FRIENDS</Text>
      </View>
      <View style={styles.allSongs}>
        {songs.length > 0 ? (
          <ScrollView style={{ maxHeight: 600 }}>
            {songs.map((song) => (
              <TouchableOpacity key={song.id}
                onPress={() => {
                  TrackPlayer.skip(songs.indexOf(song))
                  setSongInplay(song);
                  navigation.navigate('Player', {

                  });
                }}>
                <View style={styles.song}>
                  {song.id.length > 35 ? (
                    <Text style={styles.white}>
                      {song.id.slice(0, 35)}...

                    </Text>
                  ) : (<Text style={styles.white}>{song.id}</Text>)}
                  <Text>Artist</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.white}>No songs available</Text>


        )}
      </View>
      {isLoading ? (<Text style={styles.white}>is loading..</Text>) : (
        <View style={styles.playStatus}>

          <Text style={styles.playStatusTitle} onPress={() => {
            navigation.navigate('Player', {

            });
          }}>
             {songInplay.id.slice(0, 20)}...
          </Text>
          <Text style={styles.playStatusArtist} onPress={() => {
            navigation.navigate('Player', {

            });
          }}>
            {songInplay.artist ? (<Text>{songInplay.artist}</Text>) : ("Unknow artist")}

          </Text>
          <View style={styles.bottonButton}>

            <Icons.BackwardIcon onPress={previousOne} style={styles.button} color="white" fill="white" size={38}></Icons.BackwardIcon>
            {play ? (<Icons.PauseIcon style={styles.buttonStart} color="white" fill="white" size={38} onPress={StopSound}></Icons.PauseIcon>) : (<Icons.PlayIcon style={styles.buttonStart} color="white" fill="white" size={38} onPress={PlaySound}></Icons.PlayIcon>)}
            <Icons.ForwardIcon onPress={nextOne} style={styles.button} color="white" fill="white" size={38}></Icons.ForwardIcon>

          </View>
        </View>
      )}


    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  darkBg: {
    backgroundColor: "black",
    flex: 1,
  },
  playStatus: {
    flex: 1,
    borderColor: "white",
    borderTopWidth: 1,
    elevation: 20,

  },
  playStatusTitle: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  playStatusArtist: {
    marginLeft: 10,
  },
  white: {
    color: "white",
    fontSize: 18,
  },
  boldTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,

  },
  topButton: {
    marginTop: 33,
    marginHorizontal: 5,
    flexDirection: 'row'
  },
  bottonButton: {
    flexDirection: 'row',
    marginTop: 13,
    position: "absolute",
    paddingTop: 4,
    right: 15,
    bottom: 8,
  },
  topButton2: {
    position: "absolute",
    right: 5
  },
  songsLoader: {
    color: "white",
    fontSize: 18,
    width: "25%",
    textAlign: "center",
    borderBottomColor: "white",
    borderWidth: 1,
    marginHorizontal: 1
  },
  flex: {
    flexDirection: 'row',
    marginTop: 40,

    padding: 2,
    borderWidth: 1
  },
  allSongs: {
    marginTop: 20,

  },
  song: {
    marginTop: 10,
    marginLeft: 10
  },
  buttonStart: {
    marginHorizontal: 12
  }


});

export default HomeScreen;