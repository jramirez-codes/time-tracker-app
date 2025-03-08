import { SQLiteDatabase } from "expo-sqlite";

export async function deleteEventRecord(id: string, db: SQLiteDatabase) {
  await db.execAsync(`
    DELETE FROM events WHERE id = '${id}';
  `)
}