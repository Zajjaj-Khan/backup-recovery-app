import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function App() {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [viewType, setViewType] = useState('list');
  const navigate = useNavigation()
async function loadMedia() {
  try {
    console.log('📸 loadMedia() called');

    let permission = permissionResponse;

    if (!permission || permission.status !== 'granted') {
      permission = await requestPermission();
      console.log('Permission:', permission.status);
    }

    if (permission.status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    const result = await MediaLibrary.getAssetsAsync({
      mediaType: [
        MediaLibrary.MediaType.photo,
        MediaLibrary.MediaType.video,
      ],
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      first: 100,
    });

    console.log('Assets fetched:', result.assets.length);

    setAssets(result.assets);
  } catch (err) {
    console.error('❌ loadMedia error:', err);
  }
}

  useEffect(() => {
    loadMedia();
  }, [permissionResponse]);

    useEffect(() => {
    loadMedia();
    
    // Subscribe to media library updates
    const subscription = MediaLibrary.addListener(loadMedia);

    // Unsubscribe when the component unmounts
    return () => {
      subscription.remove();
    };
  }, [permissionResponse]);
  const toggleView = () => {
    setViewType(prev => (prev === 'list' ? 'grid' : 'list'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Home</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Toggle View Button */}
          <TouchableOpacity onPress={toggleView} style={{ marginRight: 15 }}>
            <Ionicons 
              name={viewType === 'list' ? "grid-outline" : "list-outline"} 
              size={24} 
              color="black" 
            />
          </TouchableOpacity>

          {/* Drawer Button */}
          <TouchableOpacity
            onPress={() => navigate.dispatch(DrawerActions.openDrawer())}
            style={styles.drawerButton}
          >
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {assets && assets.map((asset) => (
          <View key={asset?.id} style={styles.albumContainer}>
            <Image source={{ uri: asset.uri }} style={{ width: 100, height: 100 }} />
            <Text>{asset?.filename}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerButton: {
    padding: 5,
  },
});