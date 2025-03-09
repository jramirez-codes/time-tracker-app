import { Button } from '~/components/ui/button';
import { CirclePlusIcon } from '~/lib/icons/CirclePlusIcon';
import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { View } from 'react-native';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';

export function CreateActivityButton(props: {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  handleCreateActivity: Function
}) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  
  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.setOpen(e => !e)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          onPressIn={() => { props.setOpen(true) }}
        >
          <CirclePlusIcon className='text-foreground' size={23} strokeWidth={1.25} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create an Activity</DialogTitle>
          <DialogDescription>
            Add a new activity to the list.
          </DialogDescription>
        </DialogHeader>
        <View className="w-[75vw]">
          <Input
            placeholder='Title'
            value={title}
            onChangeText={(e) => { setTitle(e) }}
            aria-labelledby='inputLabel'
            aria-errormessage='inputError'
            className="mb-2"
          />
          <Textarea
            placeholder={`Description about ${title !== ""? "activity": title}...`}
            value={description}
            onChangeText={(e) => setDescription(e)}
            aria-labelledby='textareaLabel'
            className="mb-2"
          />
        </View>
        <DialogFooter>
          <DialogClose asChild>
            <Button onPress={() => {
              props.handleCreateActivity(title, description)
              setTitle("")
              setDescription("")
            }}>
              <Text>Create</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
