import { SQLiteDatabase } from "expo-sqlite";
import { Activity } from "~/types/activity";

export async function updateActivityRecord(activity: Activity, db: SQLiteDatabase) {
  await db.execAsync(`
    UPDATE activities 
    SET title = '${activity.title}', 
      description = '${activity.description}', 
      averageTimeMS = ${activity.averageTimeMS}, 
      totalEvents = ${activity.totalEvents} 
    WHERE id = '${activity.id}';
  `);
}
