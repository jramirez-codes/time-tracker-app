import React from "react";

function formatTime(ms: number): string {
  const hours = Math.floor(ms / 3600000); // 1 hour = 3600000 ms
  const minutes = Math.floor((ms % 3600000) / 60000); // 1 minute = 60000 ms
  const seconds = Math.floor((ms % 60000) / 1000); // 1 second = 1000 ms

  // Format the time as HH:MM:SS
  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  return formattedTime;
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function useGetTime(startTime: number) {
  const [displayTime, setDisplayTime] = React.useState("00:00:00")
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(_ => formatTime(((new Date).getTime()) - startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return displayTime
}