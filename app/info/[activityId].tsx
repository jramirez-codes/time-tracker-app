import * as React from 'react';
import { View, Dimensions, ScrollView, Vibration } from 'react-native';
import { Text } from '~/components/ui/text';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { deleteEventRecord } from '~/util/db/events/delete-event-record';
import { updateActivityRecord } from '~/util/db/activities/update-activity-record';
import { CirclePlay } from '~/lib/icons/CirclePlay';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const selectedActivity = globalDataContext.selectedActivity
  const [currentEvents, setCurrentEvents] = React.useState<Event[]>([])
  const navigation = useNavigation()
  const db = useSQLiteContext()
  const { activityId } = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [selectedEvent, setSelectedEvent] = React.useState<(GraphPoint) | null>(null)
  const [hasZeroEvents, setHasZeroEvents] = React.useState(false)
  const tableBodyRef = React.useRef<View | null>(null)
  const [tableBodyHeight, setTableBodyHeight] = React.useState(0)
  const [eventToDelete, setEventToDelete] = React.useState<Event | null>(null)
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme();
  const mainAccentColor = accentColor(isDarkColorScheme)
  const [isStartingActivity, setIsStartingActivity] = React.useState(false)

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
      headerRight: () => <Button variant={"ghost"} onPressIn={() => {
        setIsStartingActivity(true)
      }}><CirclePlay className='text-foreground' /></Button>
    })
  }, [navigator])

  const lineGraphData = React.useMemo(() => {
    const eventData = currentEvents.map((e) => {
      return {
        date: new Date(e.startTime),
        value: e.duration
      }
    })
    if (Array.isArray(eventData)) {
      return eventData.reverse()
    }
    return eventData
  }, [currentEvents])

  async function handleDeleteEvent(event: Event | null) {
    if (selectedActivity && event) {
      await deleteEventRecord(event.id, db)
      await updateActivityRecord({
        ...selectedActivity,
        averageTimeMS: Math.ceil(((selectedActivity.averageTimeMS * selectedActivity.totalEvents) + event.duration) / (selectedActivity.totalEvents + 1)),
        totalEvents: selectedActivity.totalEvents + 1
      }, db)
      setCurrentEvents(e => e.filter(s => s.id !== event.id))
    }
  }

  return (
    <React.Fragment>
      {selectedEvent && (
        <View className="pl-5 mt-3">
          <Text className="font-bold text-lg">
            Event Duration
          </Text>
          <Text style={{ color: mainAccentColor }} className="text-3xl">
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
            color={accentColor(true)}
            onPointSelected={(e) => { setSelectedEvent(e) }}
            onGestureEnd={() => {
              if (currentEvents.length > 0) setSelectedEvent({
                date: new Date(currentEvents[0].startTime),
                value: currentEvents[0].duration
              });
            }}
            enablePanGesture={true}
          />
        </GestureHandlerRootView>
        {selectedEvent && (
          <View className="absolute bottom-0 right-5">
            <Text className="font-bold text-lg text-right">
              Date
            </Text>
            <Text style={{ color: mainAccentColor }} className="text-xl text-right">
              {selectedEvent.date.toLocaleDateString()}
            </Text>
            <Text style={{ color: mainAccentColor }} className="text-xl text-right">
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
                <Text className="text-left pl-1">Start Time</Text>
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
                        setSelectedEvent({
                          date: new Date(obj.startTime),
                          value: obj.duration,
                        })
                        setEventToDelete(obj);
                      }}
                      delayLongPress={1000}
                      key={obj.id}
                    >
                      <TableCell className="w-[50vw]">
                        <Text>{obj.startDateString}</Text>
                      </TableCell>
                      <TableCell className="w-[50vw] relative">
                        <Card className="absolute top-1/2 right-2 p-2 -translate-y-1">
                          <Text style={{ color: mainAccentColor }}>
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
      {/* Content to Show if events is empty */}
      {hasZeroEvents && (
        <View className="p-10">
          <Text className="font-bold text-4xl text-center mb-2">
            No Events for "{selectedActivity?.title}"
          </Text>
          <Text style={{ color: mainAccentColor }} className="text-xl text-center mb-2">
            Start adding new events
          </Text>
          <Button onPressIn={() => {
            if (selectedActivity?.id) {
              router.replace(`/timer/${selectedActivity.id}/${(new Date()).getTime()}`)
            }
          }}>
            <Text>Create New Event</Text>
          </Button>
        </View>
      )}
      {/* Handle Delete Event */}
      <Dialog open={eventToDelete ? true : false} onOpenChange={_ => setEventToDelete(null)}>
        <DialogContent className='w-[75vw]'>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event at {selectedEvent?.date.toLocaleDateString()} - {selectedEvent?.date.toLocaleTimeString()}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onPressIn={() => { handleDeleteEvent(eventToDelete) }}
                variant={"destructive"}
              >
                <Text>Delete</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Start Activity */}
      <Dialog open={isStartingActivity} onOpenChange={e => setIsStartingActivity(e)}>
        <DialogContent className='w-[75vw]'>
          <DialogHeader>
            <DialogTitle>Start Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to start {selectedActivity?.title}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onPressIn={() => { router.replace(`/timer/${selectedActivity?.id}/${(new Date).getTime()}`) }}
              >
                <Text>Start</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment >
  );
}
