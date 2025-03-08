
import { SQLiteDatabase } from "expo-sqlite";

export async function deleteEventsByActivity(id: string, db: SQLiteDatabase) {
  await db.execAsync(`DELETE FROM events WHERE activityId = '${id}';`);
}