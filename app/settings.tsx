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
import { defaultDatabaseDirectory } from 'expo-sqlite';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"

export default function Page() {
  const navigation = useNavigation()
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const sqlLitePath = 'file://' + defaultDatabaseDirectory + '/astronos.db'
  const [isResettingData, setIsResettingData] = React.useState(false)

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

  async function handleResetData() {

  }

  async function handleImportDatabase() {
    try {
      let result: DocumentPicker.DocumentPickerResult = await DocumentPicker.getDocumentAsync({
        type: "application/octet-stream",
        copyToCacheDirectory: false
      });
      if (result.assets) {
        const fileUri = result.assets[0].uri;
        const cachedDBPath = sqlLitePath
        await FileSystem.copyAsync({
          from: fileUri,
          to: cachedDBPath
        })
        console.log("IMPORTED!")
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
      <>
        <Button onPressIn={() => {
          handleImportDatabase()
        }} variant="destructive" className="mb-10 mt-1">
          <Text>
            Reset Data
          </Text>
        </Button>
      </>
      <Dialog open={isResettingData} onOpenChange={e => setIsResettingData(e)}>
        <DialogContent className='w-[75vw]'>
          <DialogHeader>
            <DialogTitle>Reset Data</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset your data?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onPressIn={() => { handleResetData() }}
                variant={"destructive"}
              >
                <Text>Reset!</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}