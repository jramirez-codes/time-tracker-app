import { SQLiteDatabase } from "expo-sqlite";

export async function initalizeDatabase(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let dbRes:any = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

  // Database is the Already on the most up to date version
  if (dbRes.hasOwnProperty('user_version') && dbRes?.user_version >= DATABASE_VERSION) {
    // Clean Run
    // await db.execAsync(`
    //   DELETE FROM activities WHERE id like '%';
    //   DELETE FROM events WHERE id like '%';
    // `);
    
    // Clean Start
    // await db.execAsync(`
    //   PRAGMA journal_mode = 'wal';
    //   DROP TABLE activities;
    //   DROP TABLE events;
    //   CREATE TABLE activities (
    //     id TEXT PRIMARY KEY,
    //     title TEXT NOT NULL,
    //     description TEXT NOT NULL,
    //     averageTimeMS INTEGER NOT NULL,
    //     totalEvents INTEGER NOT NULL
    //   );
    //   CREATE TABLE events (
    //     id TEXT PRIMARY KEY,
    //     activityId TEXT NOT NULL,
    //     startTime INTEGER NOT NULL,
    //     duration INTEGER NOT NULL
    //   );
    // `);
    return;
  }
  if (dbRes.user_version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
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
    dbRes.user_version = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${dbRes.user_version}`);
}