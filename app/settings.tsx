import { useNavigation } from "expo-router"
import React from "react"
import { Alert, View } from "react-native"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { useColorScheme } from "~/lib/useColorScheme"
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Updates from 'expo-updates';

export default function Page() {
  const navigation = useNavigation()
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const sqlLitePath = FileSystem.documentDirectory + 'SQLite/main.db'

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Settings',
    })
  }, [navigator])

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
  }

  async function handleExportDatabase() {
    await Sharing.shareAsync(sqlLitePath, { dialogTitle: 'share or copy your DB via' }).catch(error => {
      console.log(error);
    })
  }

  async function handleImportDatabase() {
    try {
      let result: DocumentPicker.DocumentPickerResult = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false
      });
      if (result.assets) {
        const fileUri = result.assets[0].uri;
        const cachedDBPath = sqlLitePath
        await FileSystem.deleteAsync(cachedDBPath, { idempotent: true })
        await FileSystem.copyAsync({
          from: fileUri,
          to: cachedDBPath
        })
        await Updates.reloadAsync();
      }
    }
    catch (e) {
      Alert.alert(String(e))
    }
  }

  return (
    <View className="p-10">
      <>
        <Text className="text-lg">Toggle Theme</Text>
        <Button onPressIn={() => { toggleColorScheme() }} variant="outline" className="mb-10 mt-1">
          <Text>
            Change to {isDarkColorScheme ? "Light" : "Dark"}
          </Text>
        </Button>
      </>
      <>
        <Text className="text-lg">Export Database</Text>
        <Button onPressIn={() => {
          handleExportDatabase()
        }} variant="outline" className="mb-10 mt-1">
          <Text>
            Export Now!
          </Text>
        </Button>
        <Text className="text-lg">Import Database</Text>
      </>
      <>
        <Button onPressIn={() => {
          handleImportDatabase()
        }} variant="outline" className="mb-10 mt-1">
          <Text>
            Import Here!
          </Text>
        </Button>
      </>
    </View>
  )
}