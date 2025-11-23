import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const p = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(p, 'utf8');
    return JSON.parse(raw) as T;
  } catch (err) {
    await writeJson(filename, fallback);
    return fallback;
  }
}

export async function writeJson(filename: string, data: any) {
  await ensureDataDir();
  const p = path.join(DATA_DIR, filename);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}
