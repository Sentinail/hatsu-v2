"use client";

import compress from "graphql-query-compress";
import { openDB, IDBPDatabase } from "idb";

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

// Ensure IndexedDB is only accessed in the browser
if (typeof window !== "undefined") {
  dbPromise = openDB("graphql-cache", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("queries")) {
        db.createObjectStore("queries", { keyPath: "queryKey" });
      }
    },
  });
}

export async function hash(string: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getNormalizedQueryKey(query: string, variables: object) {
  const minifiedQuery = compress(query);

  const queryKey = await hash(minifiedQuery + JSON.stringify(variables));

  return queryKey;
}

export async function cache(queryKey: string, data: object) {
  if (!dbPromise) return; // Prevent execution on the server

  const db = await dbPromise;

  await db.put("queries", { queryKey, data, timestamp: Date.now() });
}

export async function getCached(queryKey: string, maxAge = 60 * 60 * 1000) {
  if (!dbPromise) return null; // Prevent execution on the server
  const db = await dbPromise;

  const cached = await db.get("queries", queryKey);

  if (!cached) return null;
  if (Date.now() - cached.timestamp > maxAge) return null;

  return cached.data;
}
