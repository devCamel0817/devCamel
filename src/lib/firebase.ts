import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

/**
 * Firebase 클라이언트 초기화.
 * - VITE_FIREBASE_* 환경변수가 모두 채워져 있을 때만 활성화.
 * - 키가 없으면 null 반환 → 호출 측에서 graceful 처리.
 */

interface FirebaseHandles {
  app: FirebaseApp;
  db: Database;
}

let cached: FirebaseHandles | null | undefined;

function readConfig() {
  const env = import.meta.env;
  const cfg = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
  const ok = Object.values(cfg).every((v) => typeof v === 'string' && v.length > 0);
  return ok ? cfg : null;
}

export function getFirebase(): FirebaseHandles | null {
  if (cached !== undefined) return cached;
  const cfg = readConfig();
  if (!cfg) {
    cached = null;
    return null;
  }
  const app = initializeApp(cfg);
  const db = getDatabase(app);
  cached = { app, db };
  return cached;
}
