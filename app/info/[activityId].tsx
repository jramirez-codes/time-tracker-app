import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Event } from '~/types/event';
import { useSQLiteContext } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GraphPoint, LineGraph } from 'react-native-graph';
import { formatMs } from '~/util/format-ms';
import { accentColor } from '~/assets/static-states/accent-color';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const selectedActivity = globalDataContext.selectedActivity
  const [currentEvents, setCurrentEvents] = React.useState<Event[]>([])
  const navigation = useNavigation()
  const db = useSQLiteContext()
  const { activityId } = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const [selectedEvent, setSelectedEvent] = React.useState<GraphPoint | null>(null)
  React.useEffect(() => {
    const setUp = async () => {
      const events = await db.getAllAsync<Event>(`SELECT * FROM events WHERE activityId = '${activityId}';`)
      setCurrentEvents(events)
      if (events.length > 0) {
        setSelectedEvent({
          date: new Date(events[0].startTime),
          value: events[0].duration
        })
      }
    }
    setUp()
  }, [])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedActivity?.title,
    })
  }, [navigator])

  const lineGraphData = React.useMemo(() => {
    return currentEvents.map((e) => {
      return {
        date: new Date(e.startTime),
        value: e.duration
      }
    })
  }, [currentEvents])

  return (
    <React.Fragment>
      {selectedEvent && (
        <View className="pl-5 mt-3">
          <Text className="font-bold text-lg">
            Event Duration (HH:MM:SS)
          </Text>
          <Text style={{ color: accentColor }} className="text-3xl">
            {formatMs(selectedEvent.value)}
          </Text>
        </View>
      )}
      <View className="relative h-[200px]">
        <GestureHandlerRootView style={{flex:1}} >
          <LineGraph
            style={{ width: windowWidth, height: 100 }}
            points={lineGraphData}
            animated={true}
            color={accentColor}
            onPointSelected={(e)=>{setSelectedEvent(e)}}
            enablePanGesture={true}
          />
        </GestureHandlerRootView>
        {selectedEvent && (
          <View className="absolute bottom-0 right-5">
            <Text className="font-bold text-lg text-right">
              Date
            </Text>
            <Text style={{ color: accentColor }} className="text-xl text-right">
              {selectedEvent.date.toLocaleDateString()}
            </Text>
            <Text style={{ color: accentColor }} className="text-xl text-right">
              {selectedEvent.date.toLocaleTimeString()}
            </Text>
          </View>
        )}

      </View>
    </React.Fragment>
  );
}
