import * as React from 'react';
import { Alert, Dimensions, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { useNavigation, useRouter } from 'expo-router';
import { Button } from '~/components/ui/button';
import { CircleX } from '~/lib/icons/CircleX';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import { useGetTime } from '~/components/ui-blocks/timer/hooks/use-get-time';
import { createEventRecord } from '~/util/db/events/create-event-record';
import { updateActivityRecord } from '~/util/db/activities/update-activity-record';
import { ActivityIndicator } from '~/components/ui-blocks/timer/activity-indicator';
import { updateActivities } from '~/util/update-activities';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const selectedActivity = globalDataContext.selectedActivity
  const navigation = useNavigation()
  const [isCancelingActivity, setIsCancelingActivity] = React.useState(false)
  const [isConfirmingEndActivity, setIsConfirmingEndActivity] = React.useState(false)
  const router = useRouter()
  const db = useSQLiteContext()
  const { activityId, startTime } = useLocalSearchParams();
  const timerDisplayString = useGetTime(Number(startTime))
  const windowWidth = Dimensions.get('window').width;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Running Activity...",
      headerBackVisible: false,
      headerRight: () => {
        return (
          <Button
            variant={'ghost'}
            className="flex-row"
            onPressIn={() => { setIsCancelingActivity(true) }}
          >
            <CircleX className='text-foreground' size={23} strokeWidth={1.25} />
          </Button>
        )
      }
    })
  }, [navigator])

  async function handleEndActivity() {
    if (isConfirmingEndActivity) {
      const eventDuration = (new Date).getTime() - Number(startTime)
      await createEventRecord(`${activityId}`, Number(startTime), eventDuration, db)
      if (selectedActivity?.hasOwnProperty("averageTimeMS")) {
        const averageTimeMS = Math.ceil(((selectedActivity.averageTimeMS * selectedActivity.totalEvents) + eventDuration) / (selectedActivity.totalEvents + 1))
        const totalEvents = selectedActivity.totalEvents + 1
        // Update SQLite Database
        await updateActivityRecord({
          ...selectedActivity,
          averageTimeMS: averageTimeMS,
          totalEvents: totalEvents
        }, db)
        // Update Frontend State
        globalDataContext.setActivities(e=>updateActivities(e, selectedActivity.id, averageTimeMS, totalEvents))
      }
      router.replace(`/`)
    }
    setIsConfirmingEndActivity(true)
  }

  return (
    <React.Fragment>
      {/* Main View */}
      <View className='bg-background'>
        <View className="items-center">
          <Text className="text-[24px] mb-10 mt-10 font-bold text-center">{selectedActivity?.title}</Text>
          <View className="relative">
          <ActivityIndicator height={300} width={windowWidth}/>
          <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Text className="font-bold text-3xl">{timerDisplayString}</Text>
          </View>
          </View>
          <Button
            variant={isConfirmingEndActivity ? 'default' : 'outline'}
            className='mt-10 flex-row'
            onPressIn={() => { handleEndActivity() }}
          >
            <Text style={{ marginTop: -2 }} className="font-bold">{!isConfirmingEndActivity?"Stop" :"Confirm End"} Activity</Text>
          </Button>
        </View>
      </View>
      {/* Handle Cancel Activity */}
      <Dialog open={isCancelingActivity} onOpenChange={e => setIsCancelingActivity(e)}>
        <DialogContent className='w-[75vw]'>
          <DialogHeader>
            <DialogTitle>Cancel Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel {selectedActivity?.title}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onPressIn={() => { router.replace(`/`) }}
              >
                <Text>Yes</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
