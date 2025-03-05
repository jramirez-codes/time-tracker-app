import * as React from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Info } from '~/lib/icons/Info';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Play } from '~/lib/icons/PlayIcon';
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
import { useNavigation } from 'expo-router';
import { CreateActivityButton } from '~/components/ui-blocks/index/create-activity-button';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const activities: Activity[] = globalDataContext.activities
  const [open, setOpen] = React.useState(false)
  const navigation = useNavigation()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chronos',
      headerRight: () => <CreateActivityButton open={open} setOpen={setOpen} />,
    })
  }, [navigator, open])


  return (
    <View className='bg-background'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50vw]' >
              <Text className="text-left pl-1">Title</Text>
            </TableHead>
            <TableHead className='w-[50vw]' >
              <Text className="text-right pr-1">Average Time</Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <TableBody>
            {activities.map((obj, index) => {
              return (
                <TableRow
                  onPress={() => { }}
                  className={cn('active:bg-secondary', index % 2 && 'bg-muted/40 ')}
                  key={obj.id}
                >
                  <TableCell className="w-[50vw]">
                    <Text>{obj.title}</Text>
                  </TableCell>
                  <TableCell className="w-[50vw] relative">
                    <Card className="absolute top-1/2 right-2 p-2 -translate-y-1">
                      <Text>
                        00:00:00
                      </Text>
                    </Card>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </ScrollView>
      </Table>
    </View>
  );
}
