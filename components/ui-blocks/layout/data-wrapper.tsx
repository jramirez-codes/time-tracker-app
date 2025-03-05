import { useSQLiteContext } from "expo-sqlite";
import React, { ReactNode } from "react";
import { Alert, Text } from "react-native";
import { Activity } from "~/types/activity";

interface GlobalDataContextProps {
  activities: Activity[],
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>
}

export const GlobalDataContext = React.createContext<GlobalDataContextProps | undefined>(undefined)

export const useGlobalDataContext = () => {
  const globalDataContext = React.useContext(GlobalDataContext)
  if (!globalDataContext) {
    throw new Error("Incorrect Usage")
  }
  return globalDataContext
}

export function DataWrapper(props: { children: ReactNode }) {
  const db = useSQLiteContext()
  const [activities, setActivities] = React.useState<Activity[]>([])

  React.useEffect(() => {
    const setUp = async () => {
      const activities = await db.getAllAsync<Activity>('select * from activities')
      setActivities(activities)
    }
    setUp()
  }, [])

  return (
    <>
      <GlobalDataContext.Provider value={{
        activities: activities,
        setActivities: setActivities
      }}>
        {props.children}
      </GlobalDataContext.Provider>
    </>
  )
}