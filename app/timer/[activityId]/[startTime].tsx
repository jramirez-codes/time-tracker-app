import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useGlobalDataContext } from '~/components/ui-blocks/layout/data-wrapper';
import { useNavigation, useRouter } from 'expo-router';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button } from '~/components/ui/button';
import { CircleX } from '~/lib/icons/CircleX';
import { CircleStop } from '~/lib/icons/CircleStop';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import { useGetTime } from '~/components/ui-blocks/timer/hooks/use-get-time';
import { createEventRecord } from '~/util/db/events/create-event-record';
import { updateActivityRecord } from '~/util/db/activities/update-activity-record';
import { accentColor } from '~/assets/static-states/accent-color';

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Running Activity...",
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
      if (selectedActivity?.hasOwnProperty('averageTimeMS')) {
        await updateActivityRecord({
          ...selectedActivity,
          averageTimeMS: Math.ceil(((selectedActivity.averageTimeMS * selectedActivity.totalEvents) + eventDuration) / (selectedActivity.totalEvents + 1)),
          totalEvents: selectedActivity.totalEvents + 1
        }, db)
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
          <CountdownCircleTimer
            isPlaying={true}
            duration={5}
            // @ts-ignore
            colors={[accentColor]}
            onComplete={() => {
              return { shouldRepeat: true, delay: 0 } // repeat animation in 1.5 seconds
            }}
            // colorsTime={[5, 4, 3, 2, 1, 0]}
          >
            {({ }) => <Text className="font-bold text-3xl">{timerDisplayString}</Text>}
          </CountdownCircleTimer>
          <Button
            variant={isConfirmingEndActivity ? 'default' : 'outline'}
            className='mt-10 flex-row'
            onPressIn={() => { handleEndActivity() }}
          >
            {isConfirmingEndActivity ? (
              <CircleStop className="text-background mr-3" />
            ) : (

              <CircleStop className="text-foreground mr-3" />
            )}
            <Text style={{ marginTop: -2 }} className="font-bold">End Activity</Text>
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
