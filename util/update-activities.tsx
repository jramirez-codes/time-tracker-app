import { Activity } from "~/types/activity"

export function updateActivities(oldActivies: Activity[], id: string, averageTimeMS: number, totalEvents: number): Activity[] {
  let updatedActivities = [...oldActivies]
  for (const idx in updatedActivities) {
    if (updatedActivities[idx].id === id) {
      updatedActivities[idx].averageTimeMS = averageTimeMS
      updatedActivities[idx].totalEvents = totalEvents
      return updatedActivities
    }
  }
  return updatedActivities
}