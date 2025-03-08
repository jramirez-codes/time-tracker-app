import { randomUUID } from "expo-crypto";
import { SQLiteDatabase } from "expo-sqlite";

export async function createEventRecord(activityId: string, startTime: number, duration: number, db: SQLiteDatabase) {
  await db.execAsync(`
    INSERT INTO events (id, activityId, startTime, duration) 
    VALUES ('${randomUUID()}', '${activityId}', ${startTime}, ${duration});
  `)
}