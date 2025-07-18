import { WaterLog, DailyReportData } from '../types';

const DB_NAME = 'HydroPalDB';
const STORE_NAME = 'waterLogs';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject("Error opening IndexedDB.");

        request.onsuccess = (event) => {
            db = (event.target as IDBRequest<IDBDatabase>).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = (event.target as IDBRequest<IDBDatabase>).result;
            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                const store = tempDb.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
};

export const initDB = async (): Promise<void> => {
    await openDB();
};

export const addWaterLog = (amount: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const log: Omit<WaterLog, 'id'> = { amount, timestamp: Date.now() };
        
        const request = store.add(log);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Failed to add log.");
    });
};

export const getLogsBetween = (startDate: number, endDate: number): Promise<WaterLog[]> => {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('timestamp');
        const range = IDBKeyRange.bound(startDate, endDate);
        
        const request = index.getAll(range);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Failed to fetch logs.");
    });
};

export const getTodaysIntake = async (): Promise<number> => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const logs = await getLogsBetween(todayStart.getTime(), todayEnd.getTime());
    return logs.reduce((total, log) => total + log.amount, 0);
};

export const getWeeklyReportData = async (goal: number): Promise<DailyReportData[]> => {
    const report: DailyReportData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);
        
        const logs = await getLogsBetween(dayStart.getTime(), dayEnd.getTime());
        const totalIntake = logs.reduce((total, log) => total + log.amount, 0);
        
        report.push({
            day: day.toLocaleDateString('en-US', { weekday: 'short' }),
            intake: totalIntake,
            goal: goal,
        });
    }
    
    return report;
};


export const clearAllLogs = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Failed to clear logs.");
    });
};