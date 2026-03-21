import { openDB, type DBSchema } from 'idb'
import type { TemplateData } from '../defaultTemplates'

interface KaisNBTEditorDB extends DBSchema {
  templates: {
    key: string
    value: TemplateData
  }
}

const DB_NAME = 'KaisNBTEditorDB'
const STORE_NAME = 'templates'

async function initDB() {
  return openDB<KaisNBTEditorDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export async function getCustomTemplates(): Promise<TemplateData[]> {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export async function addCustomTemplate(template: TemplateData): Promise<void> {
  const db = await initDB()
  await db.put(STORE_NAME, template)
}

export async function deleteCustomTemplate(id: string): Promise<void> {
  const db = await initDB()
  await db.delete(STORE_NAME, id)
}
