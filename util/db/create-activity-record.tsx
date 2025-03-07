import { SQLiteDatabase } from "expo-sqlite";
import { Activity } from "~/types/activity";

export async function createActivityRecord(newActivity: Activity, db: SQLiteDatabase) {
  await db.execAsync(`
  INSERT INTO activities (id, title, description, averageTimeMS, totalEvents) 
  VALUES ('${newActivity.id}', '${newActivity.title}', '${newActivity.description}', ${newActivity.averageTimeMS}, ${newActivity.totalEvents});  
  `)
}