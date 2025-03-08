import * as React from 'react';
import { View, Dimensions, ScrollView, Vibration, Animated } from 'react-native';
import { Text } from '~/components/ui/text';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Event } from '~/types/event';
import { useSQLiteContext } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GraphPoint, LineGraph } from 'react-native-graph';
import { formatMs } from '~/util/format-ms';
import { accentColor } from '~/assets/static-states/accent-color';
import { Button } from '~/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { cn } from '~/lib/utils';
import { Card } from '~/components/ui/card';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const selectedActivity = globalDataContext.selectedActivity
  const [currentEvents, setCurrentEvents] = React.useState<Event[]>([])
  const navigation = useNavigation()
  const db = useSQLiteContext()
  const { activityId } = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [selectedEvent, setSelectedEvent] = React.useState<GraphPoint | null>(null)
  const [hasZeroEvents, setHasZeroEvents] = React.useState(false)
  const tableBodyRef = React.useRef<View | null>(null)
  const [tableBodyHeight, setTableBodyHeight] = React.useState(0)

  React.useEffect(() => {
    const setUp = async () => {
      const events = await db.getAllAsync<Event>(`SELECT * FROM events WHERE activityId = '${activityId}' order by startTime desc;`)
      setCurrentEvents(events.map(e => {
        const newDate = new Date(e.startTime)
        return { ...e, startDateString: `${newDate.toLocaleDateString()} - ${newDate.toLocaleTimeString()}` }
      }))
      if (events.length > 0) {
        setSelectedEvent({
          date: new Date(events[0].startTime),
          value: events[0].duration
        })
      }
      else {
        setHasZeroEvents(true)
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
        <GestureHandlerRootView style={{ flex: 1 }} >
          <LineGraph
            style={{ width: windowWidth, height: 100 }}
            points={lineGraphData}
            animated={true}
            color={accentColor}
            onPointSelected={(e) => { setSelectedEvent(e) }}
            // onGestureStart={() => { Vibration.vibrate(50); }}
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
      {!hasZeroEvents && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50vw]' >
                <Text className="text-left pl-1">Date</Text>
              </TableHead>
              <TableHead className='w-[50vw]' >
                <Text className="text-right pr-1">Event Duration</Text>
              </TableHead>
            </TableRow>
          </TableHeader>
          <View style={{ maxHeight: tableBodyHeight }} ref={tableBodyRef}
            onLayout={(_) => {
              tableBodyRef.current?.measureInWindow((_: any, y: any, __: any, ___: any) => {
                setTableBodyHeight(windowHeight - y)
              })
            }}
          >
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <TableBody>
                {currentEvents.map((obj, index) => {
                  return (
                    <TableRow
                      // onPress={() => { handleDoubleAndSinglePress(obj) }}
                      className={cn('active:bg-secondary', index % 2 && 'bg-muted/40 ')}
                      onLongPress={() => {
                        Vibration.vibrate(50);
                        // globalDataContext.setSelectedActivity(obj)
                        // setIsDeletingActivity(true);
                      }}
                      delayLongPress={1000}
                      key={obj.id}
                    >
                      <TableCell className="w-[50vw]">
                        <Text>{obj.startDateString}</Text>
                      </TableCell>
                      <TableCell className="w-[50vw] relative">
                        <Card className="absolute top-1/2 right-2 p-2 -translate-y-1">
                          <Text style={{ color: accentColor }}>
                            {formatMs(obj.duration)}
                          </Text>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </ScrollView>
          </View>
        </Table>
      )}
      {
        hasZeroEvents && (
          <View className="p-10">
            <Text className="font-bold text-4xl text-center mb-2">
              No Events for "{selectedActivity?.title}"
            </Text>
            <Text style={{ color: accentColor }} className="text-xl text-center mb-2">
              Start adding new events
            </Text>
            <Button>
              <Text>Create New Event</Text>
            </Button>
          </View>
        )
      }
    </React.Fragment >
  );
}
