import { useSQLiteContext } from "expo-sqlite";
import React, { ReactNode } from "react";
import { Activity } from "~/types/activity";

interface GlobalDataContextProps {
  activities: Activity[],
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>,
  selectedActivity: Activity | null,
  setSelectedActivity: React.Dispatch<React.SetStateAction<Activity | null>>
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
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null)

  React.useEffect(() => {
    const setUp = async () => {
      const activities = await db.getAllAsync<Activity>('SELECT * FROM activities;')
      setActivities(activities)
    }
    setUp()
  }, [])

  return (
    <>
      <GlobalDataContext.Provider value={{
        activities: activities,
        setActivities: setActivities,
        selectedActivity: selectedActivity,
        setSelectedActivity: setSelectedActivity
      }}>
        {props.children}
      </GlobalDataContext.Provider>
    </>
  )
}