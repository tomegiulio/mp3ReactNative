import React, { useState, useEffect, useContext } from 'react';
import * as Icons from "react-native-heroicons/solid";
import * as UniIcon from "react-native-unicons";
import { PlayerContext } from '../App';
import TrackPlayer, { useProgress, formatTime } from 'react-native-track-player';
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
  PermissionsAndroid
} from 'react-native';

function Player({ route, navigation }) {
  const { songs, play, setPlay, songInplay, setSongInplay, isLoading, } = useContext(PlayerContext);
  const { position, buffered, duration } = useProgress();
  const [sliderValue, setSliderValue] = useState();

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
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    return `${minutes}:${remainingSeconds.padStart(2, '0')}`;
  }
  useEffect(() => {

    setSliderValue(position)
    if (Math.floor(duration - sliderValue) <= 0.1) {

    }

  }, [position])

  return (
    <SafeAreaView style={styles.darkBg}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://static.vecteezy.com/ti/vettori-gratis/p1/2916056-interfaccia-lettore-musicale-con-barra-di-caricamento-suoni-onda-suono-segno-e-cornice-per-album-foto-canzone-trendy-modello-targa-per-regalo-romantico-vettoriale.jpg",
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.songInfo}>
        <View style={styles.textContainer}>

          {songInplay.id.length > 5 ? (
            <Text style={styles.boldTitle}>
              {songInplay.id.slice(0, 26)}...

            </Text>
          ) : (<Text>{songInplay.id}</Text>)}

          <Text style={styles.gray}>Singer Name</Text>

        </View>

      </View>

      <View style={styles.container}>
        <Slider
          value={sliderValue}
          maximumValue={duration}
          onValueChange={value => { TrackPlayer.seekTo(parseFloat(value)) }}
          animateTransitions={true}
          animationType={'timing'}

        />


        <View style={styles.row}>
          <Text style={styles.position}>{formatTime(position)}</Text>
          <Text style={styles.duration}>{formatTime(duration)}</Text>

        </View>

      </View>

      <View style={styles.buttons}>

        <Icons.BackwardIcon onPress={previousOne} style={styles.button} color="white" fill="white" size={52}></Icons.BackwardIcon>
        {play ? (<Icons.PauseIcon style={styles.buttonStart} color="white" fill="white" size={62} onPress={StopSound}></Icons.PauseIcon>) : (<Icons.PlayIcon style={styles.buttonStart} color="white" fill="white" size={62} onPress={PlaySound}></Icons.PlayIcon>)}
        <Icons.ForwardIcon onPress={nextOne} style={styles.button} color="white" fill="white" size={52}></Icons.ForwardIcon>


      </View>




    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  duration: {
    color: "white",
    position: "absolute",
    right: 0
  },
  position: {
    color: "white",

  },
  container: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    width: "88%",

  },
  darkBg: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
  },
  white: {
    color: "white",
    fontSize: 18,
  },
  gray: {
    fontSize: 18,
  },
  boldTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,

  },
  imageContainer: {
    width: "90%",
    height: "45%",
    marginTop: 40,


  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 20,
    borderWidth: 3,

  },
  songInfo: {
    marginTop: 2,
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "90%",

  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 4,

  },
  buttons: {
    marginTop: 10,

    flex: 1,
    flexDirection: 'row',

  },
  button: {
    marginTop: 9,
    marginHorizontal: 53
  },
  button2: {
    marginTop: 16,
    marginHorizontal: 33
  },
  buttonStart: {
    marginTop: 6,
    marginHorizontal: 2
  }

});
export default Player;