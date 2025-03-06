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

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const selectedActivity = globalDataContext.selectedActivity
  const navigation = useNavigation()
  const [isCancelingActivity, setIsCancelingActivity] = React.useState(false)
  const router = useRouter()
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Running Activity...",
      headerRight: () => {
        return (
          <Button
            variant={'ghost'}
            className="flex-row"
            onPressIn={() => {setIsCancelingActivity(true) }}
          >
            <CircleX className='text-foreground' size={23} strokeWidth={1.25} />
          </Button>
        )
      }
    })
  }, [navigator])

  return (
    <React.Fragment>
      {/* Main View */}
      <View className='bg-background'>
        <View className="items-center">
          <Text className="text-[24px] mb-10 mt-10 font-bold">{selectedActivity?.title}</Text>
          <CountdownCircleTimer
            isPlaying={true}
            duration={5}
            colors={['#f20089', '#e500a4', '#db00b6', '#d100d1', '#db00b6', '#e500a4']}
            onComplete={() => {
              return { shouldRepeat: true, delay: 0 } // repeat animation in 1.5 seconds
            }}
            colorsTime={[5, 4, 3, 2, 1, 0]}
          >
            {({ remainingTime }) => <Text>{remainingTime}</Text>}
          </CountdownCircleTimer>
          <Button variant={'outline'} className='mt-10 flex-row'>
            <CircleStop className="text-foreground mr-3"/>
            <Text style={{marginTop:-2}} className="font-bold">End Activity</Text>
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
      {/* Handle Cancel Activity */}
    </React.Fragment>
  );
}
