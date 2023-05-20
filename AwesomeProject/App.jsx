import React, { useState, useEffect,useContext,createContext} from 'react';
import { View, Text,PermissionsAndroid} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./pages/HomeScreen"
import Player from "./pages/Player"
import MediaMeta from 'react-native-media-meta';
import RNFS from 'react-native-fs';
import TrackPlayer, { useProgress } from 'react-native-track-player';



const Stack = createNativeStackNavigator();
TrackPlayer.registerPlaybackService(() => require('./service'));
export const PlayerContext = createContext({
  play: false,
  setPlay: () => {},
  songInplay:{},
  setSongInplay: ()=>{},
  songs: [],
  TrackPlayer,
  isLoading:true,
  setIsLoading:() => {},
  position:{},
  buffered:{}, 
  duration :{}

});


export default function App() {
  const [musicPath, setMusicPath] = useState();
  const [play, setPlay] = useState(false);
  const [songs, setSongs] = useState([]);
  const [songInplay,setSongInplay]=useState();
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [loop,setLoop]=useState(false);

 
 
 
  
  useEffect(() => {
    
   
    const requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          {
            title: 'Mp34L Read Media Audio Permission',
            message:
              'Mp34L needs access to your Audio Media',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getAudioFiles();
          console.log('Storage permission granted');
        } else {
          console.log('Storage permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const checkPermission = async () => {
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
      );
      if (isGranted) {
        console.log('Storage permission already granted');
        getAudioFiles();
      } else {
        console.log('Storage permission not granted yet');
        requestStoragePermission();
      }
    };

    checkPermission();
  }, []);
  
  const getAudioFiles = async () => {
    try {
      const externalStoragePath = RNFS.ExternalStorageDirectoryPath;
      RNFS.readDir(externalStoragePath)
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].name === "Music" && result[i].isDirectory()) {
              const musicPath = result[i].path;
              setMusicPath(musicPath);
              break;
            }
          }
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    
    const loadSongs = async () => {
      try {
        const audioFiles = await RNFS.readDir(musicPath);
        const mp3Files = audioFiles.filter((file) => file.isFile() && file.path.endsWith(".mp3"));
        const audioFilesInfo = await Promise.all(
          mp3Files.map(async (file) => {
            const filePath = `${musicPath}/${file.name}`;
            const mediaInfo = await MediaMeta.get(filePath);
  
            return {
              id: file.name,
              path: filePath,
              duration: mediaInfo.duration,
              title: mediaInfo.title,
              artist: mediaInfo.artist,
            };
          })
        );
        setSongs(audioFilesInfo);
      } catch (error) {
        console.error(error);
      }
    };
    if (musicPath) {
      loadSongs();
      
    }
  }, [musicPath]);
  
  useEffect(() => {
    const startUpMp3 = async () => {
      await TrackPlayer.setupPlayer();
      if (songs.length > 0) {
        songs.forEach(async (song) => {
          TrackPlayer.add({
            id: song.id,
            url: song.path,
            duration: song.duration,
            title: song.title,
            artist: song.artist,
            artwork: song.artwork,
          }).catch(error => {
          
            console.error('Error occurred while adding song:', error);
          });
          
        });
        setSongInplay(songs[0]);
        setIsLoading(false);  
      }
    };
    
  
    if (songs.length > 0) {
      startUpMp3();
      
    }
  }, [songs]);
  



 

 


  return (
    <PlayerContext.Provider value={{ play, setPlay, songs,TrackPlayer,songInplay,
    setSongInplay,isLoading, setIsLoading}}>
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Player" component={Player}  options={{ headerShown: false }} />
      </Stack.Navigator>

    </NavigationContainer>
    </PlayerContext.Provider>
  );
}
