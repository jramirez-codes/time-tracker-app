import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Events } from '~/types/events';
import { useSQLiteContext } from 'expo-sqlite';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const selectedActivity = globalDataContext.selectedActivity
  const [currentEvents, setCurrentEvents] = React.useState<Events[]>([])
  const navigation = useNavigation()
  const db = useSQLiteContext()
  const { activityId } = useLocalSearchParams();

  React.useEffect(() => {
    const setUp = async () => {
      const events = await db.getAllAsync<Events>(`SELECT * FROM events WHERE activityId = '${activityId}';`)
      setCurrentEvents(events)
    }
    setUp()
  }, [])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedActivity?.title,
    })
  }, [navigator])

  return (
    <View className='bg-background'>
      <Text className="pl-7 pr-7">{currentEvents.length}</Text>
    </View>
  );
}
