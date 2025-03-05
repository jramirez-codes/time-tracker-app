import { useSQLiteContext } from "expo-sqlite";
import React, { ReactNode } from "react";
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

const testActives: Activity[] = [
  {
    title: "One",
    description: "",
    id: "1",
    averageTimeMS: 0,
    totalEvents: 0,
  },
  {
    title: "Two",
    description: "",
    id: "2",
    averageTimeMS: 0,
    totalEvents: 0,
  },
  {
    title: "Three",
    description: "",
    id: "3",
    averageTimeMS: 0,
    totalEvents: 0,
  }
]

export function DataWrapper(props: { children: ReactNode }) {
  const db = useSQLiteContext()
  const [activities, setActivities] = React.useState<Activity[]>(testActives)
  
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