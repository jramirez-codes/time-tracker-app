import * as React from 'react';
import { Alert, View } from 'react-native';
import {
  Card,
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { cn } from '~/lib/utils';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { Activity } from '~/types/activity';
import { useNavigation, useRouter } from 'expo-router';
import { CreateActivityButton } from '~/components/ui-blocks/index/create-activity-button';
import { randomUUID } from 'expo-crypto';
import { formatMs } from '~/util/format-ms';
import { createActivityRecord } from '~/util/db/create-activity-record';
import { useSQLiteContext } from 'expo-sqlite';
import { Vibration } from 'react-native';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { deleteActivityRecord } from '~/util/db/delete-activity-record';
import { handleDoubleTapEvent, useDoubleTapRef } from '~/util/double-tap-event';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const activities: Activity[] = globalDataContext.activities
  const selectedActivity = globalDataContext.selectedActivity
  const [isCreatingNewActivity, setIsisCreatingNewActivity] = React.useState(false)
  const doubleTapRef = useDoubleTapRef()
  const [isDeletingActivity, setIsDeletingActivity] = React.useState(false)
  const [isStartingActivity, setIsStartingActivity] = React.useState(false)
  const navigation = useNavigation()
  const router = useRouter()
  const db = useSQLiteContext()

  function handleCreateActivity(title: string, description: string) {
    const newActivity = {
      title: title,
      description: description,
      averageTimeMS: 0,
      totalEvents: 0,
      id: randomUUID(),
    }
    globalDataContext.setActivities(e => [...e, newActivity])
    createActivityRecord(newActivity, db)
  }

  function handleDeleteActivity() {
    if (globalDataContext.selectedActivity?.id) {
      const idToDelete = globalDataContext.selectedActivity.id
      globalDataContext.setActivities(e => e.filter(s => s.id !== idToDelete))
      globalDataContext.setSelectedActivity(null)
      deleteActivityRecord(idToDelete, db)
    }
  }

  function handleDoubleAndSinglePress(activity: Activity) {
    globalDataContext.setSelectedActivity(activity)
    handleDoubleTapEvent(doubleTapRef,
      () => {
        router.navigate(`/info/${activity.id}}`)
      },
      () => {
        setIsStartingActivity(true)
      })
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Astronos',
      headerRight: () => <CreateActivityButton open={isCreatingNewActivity} setOpen={setIsisCreatingNewActivity} handleCreateActivity={handleCreateActivity} />,
    })
  }, [navigator, isCreatingNewActivity])

  return (
    <View className='bg-background'>
      {/* Main Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50vw]' >
              <Text className="text-left pl-1">Title</Text>
            </TableHead>
            <TableHead className='w-[50vw]' >
              <Text className="text-right pr-1">Average Time (HH:MM:SS)</Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <TableBody>
            {activities.map((obj, index) => {
              return (
                <TableRow
                  onPress={() => { handleDoubleAndSinglePress(obj) }}
                  className={cn('active:bg-secondary', index % 2 && 'bg-muted/40 ')}
                  onLongPress={() => {
                    Vibration.vibrate(50);
                    globalDataContext.setSelectedActivity(obj)
                    setIsDeletingActivity(true);
                  }}
                  delayLongPress={1000}
                  key={obj.id}
                >
                  <TableCell className="w-[50vw]">
                    <Text>{obj.title}</Text>
                  </TableCell>
                  <TableCell className="w-[50vw] relative">
                    <Card className="absolute top-1/2 right-2 p-2 -translate-y-1">
                      <Text>
                        {formatMs(obj.averageTimeMS)}
                      </Text>
                    </Card>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </ScrollView>
      </Table>
      {/* Delete Activty Dialog */}
      <Dialog open={isDeletingActivity} onOpenChange={e => setIsDeletingActivity(e)}>
        <DialogContent className='w-[75vw]'>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedActivity?.title}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onPressIn={() => { handleDeleteActivity() }}
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
    </View>
  );
}
