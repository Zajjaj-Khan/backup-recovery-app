import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
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

  return (
    <SafeAreaView style={styles.container}>
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
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});