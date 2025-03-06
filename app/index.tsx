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
import { useNavigation } from 'expo-router';
import { CreateActivityButton } from '~/components/ui-blocks/index/create-activity-button';
import { randomUUID } from 'expo-crypto';
import { formatMs } from '~/util/format-ms';
import { createActivityRecord } from '~/util/db/create-activity-record';
import { useSQLiteContext } from 'expo-sqlite';

export default function Page() {
  const globalDataContext = useGlobalDataContext()
  const activities: Activity[] = globalDataContext.activities
  const [open, setOpen] = React.useState(false)
  const navigation = useNavigation()
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
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Astronos',
      headerRight: () => <CreateActivityButton open={open} setOpen={setOpen} handleCreateActivity={handleCreateActivity} />,
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
              <Text className="text-right pr-1">Average Time (HH:MM:SS)</Text>
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
    </View>
  );
}
