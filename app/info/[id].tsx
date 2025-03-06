import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { useNavigation } from 'expo-router';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const selectedActivity = globalDataContext.selectedActivity
  const navigation = useNavigation()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedActivity?.title,
    })
  }, [navigator])

  return (
    <View className='bg-background'>
      <Text className="pl-2 pr-2">{selectedActivity?.description}</Text>
    </View>
  );
}
