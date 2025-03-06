import React from "react";
import { DobuleTapEventProps } from "~/types/double-tap-event";

export function useDoubleTapRef(delayTime?: number) {
  const doubleTapRef = React.useRef<DobuleTapEventProps>({
    delayTime: delayTime ? delayTime : 150,
    firstPress: true,
    lastTime: new Date(),
    timer: 0
  })

  return doubleTapRef
}

export function handleDoubleTapEvent(doubleTapRef: React.MutableRefObject<DobuleTapEventProps>, singleTap?: Function, doubleTap?: Function) {
  // get the instance of time when pressed
  let now = new Date();

  if (doubleTapRef.current.firstPress) {
    // set the flag indicating first press has occured
    doubleTapRef.current.firstPress = false;

    //start a timer --> if a second tap doesnt come in by the delay, trigger singleTap event handler
    doubleTapRef.current.timer = Number(setTimeout(() => {
      //check if user passed in prop
      singleTap ? singleTap() : null;

      // reset back to initial state
      doubleTapRef.current.firstPress = true;
      doubleTapRef.current.timer = 0;
    }, doubleTapRef.current.delayTime))

    // mark the last time of the press
    doubleTapRef.current.lastTime = now;

  } else {
    //if user pressed immediately again within span of delayTime
    if (now.getTime() - doubleTapRef.current.lastTime.getTime() < doubleTapRef.current.delayTime) {
      // clear the timeout for the single press
      doubleTapRef.current.timer && clearTimeout(doubleTapRef.current.timer);

      //check if user passed in prop for double click
      doubleTap? doubleTap() : null;

      // reset back to initial state
      doubleTapRef.current.firstPress = true;
    }
  }
}