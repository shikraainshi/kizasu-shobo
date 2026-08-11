import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { Bucket } from "@google-cloud/storage";

// firebase-adminはcert()の時点でprojectId等を即検証してthrowするため、
// モジュール読み込み時ではなく実際にFirestoreを使う直前まで初期化を遅延させる。
function getFirebaseApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Missing Firebase Admin SDK environment variables (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY)"
    );
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .envには改行が\nとして保存されるため実際の改行に戻す
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
  });
}

let firestore: Firestore | undefined;

export function getDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }
  return firestore;
}

let bucket: Bucket | undefined;

export function getBucket(): Bucket {
  if (!bucket) {
    if (!process.env.FIREBASE_STORAGE_BUCKET) {
      throw new Error("Missing FIREBASE_STORAGE_BUCKET environment variable");
    }
    bucket = getStorage(getFirebaseApp()).bucket();
  }
  return bucket;
}
