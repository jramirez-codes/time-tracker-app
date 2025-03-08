import { SQLiteDatabase } from "expo-sqlite";

export async function deleteActivityRecord(id: string, db: SQLiteDatabase) {
  await db.execAsync(`
  DELETE FROM activities WHERE id = '${id}';
  `)
}