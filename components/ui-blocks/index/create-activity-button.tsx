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
import { Text } from 'react-native';

export function CreateActivityButton(props: {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <Text>OK</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
