import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function isDirectory(source: string): Promise<boolean> {
  try {
    const stats = await stat(source);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function getDirectories(source: string): Promise<string[]> {
  try {
    const entries = await readdir(source);
    const paths = entries.map((name) => join(source, name));
    const directories = await Promise.all(
      paths.map(async (path) => ({
        path,
        isDir: await isDirectory(path),
      }))
    );
    return directories.filter((entry) => entry.isDir).map((entry) => entry.path);
  } catch (error) {
    console.error(`Error reading directory ${source}:`, error);
    return [];
  }
}
