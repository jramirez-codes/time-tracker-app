import { SQLiteDatabase } from "expo-sqlite";

export async function resetDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    DROP TABLE activities;
    DROP TABLE events;
    PRAGMA journal_mode = 'wal';
    PRAGMA encoding = 'UTF-8';
    CREATE TABLE activities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      averageTimeMS INTEGER NOT NULL,
      totalEvents INTEGER NOT NULL
    );
    CREATE TABLE events (
      id TEXT PRIMARY KEY,
      activityId TEXT NOT NULL,
      startTime INTEGER NOT NULL,
      duration INTEGER NOT NULL
    );
  `);
}