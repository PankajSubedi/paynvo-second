// Browser-based storage using IndexedDB for temporary file storage
// Files are automatically cleaned up after 1 hour

const DB_NAME = 'InvoiceStorage';
const STORE_NAME = 'files';
const DB_VERSION = 1;
const EXPIRY_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface StoredFile {
  id: string;
  file: Blob;
  filename: string;
  contentType: string;
  uploadedAt: number;
  expiresAt: number;
}

class BrowserStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.cleanupExpiredFiles();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async uploadFile(file: File, path: string): Promise<string> {
    if (!this.db) await this.init();

    const id = `${path}/${Date.now()}_${file.name}`;
    const now = Date.now();
    
    const storedFile: StoredFile = {
      id,
      file,
      filename: file.name,
      contentType: file.type,
      uploadedAt: now,
      expiresAt: now + EXPIRY_DURATION,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(storedFile);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getFile(id: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const storedFile: StoredFile = request.result;
        if (!storedFile) {
          resolve(null);
          return;
        }

        // Check if file has expired
        if (Date.now() > storedFile.expiresAt) {
          this.deleteFile(id);
          resolve(null);
          return;
        }

        resolve(storedFile.file);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getPublicUrl(id: string): Promise<string | null> {
    const blob = await this.getFile(id);
    if (!blob) return null;
    return URL.createObjectURL(blob);
  }

  async deleteFile(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async cleanupExpiredFiles(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();
      const now = Date.now();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const storedFile: StoredFile = cursor.value;
          if (now > storedFile.expiresAt) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAllFiles(): Promise<StoredFile[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const browserStorage = new BrowserStorage();

// Run cleanup every 5 minutes
setInterval(() => {
  browserStorage.cleanupExpiredFiles();
}, 5 * 60 * 1000);
