import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { isDirectory, getDirectories } from './utils';

const TEST_DIR = join(process.cwd(), 'test-temp');

describe('utils', () => {
  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('isDirectory', () => {
    it('should return true for a directory', async () => {
      const dirPath = join(TEST_DIR, 'test-dir');
      await mkdir(dirPath);

      const result = await isDirectory(dirPath);

      expect(result).toBe(true);
    });

    it('should return false for a file', async () => {
      const filePath = join(TEST_DIR, 'test-file.txt');
      await writeFile(filePath, 'test content');

      const result = await isDirectory(filePath);

      expect(result).toBe(false);
    });

    it('should return false for a non-existent path', async () => {
      const nonExistentPath = join(TEST_DIR, 'non-existent');

      const result = await isDirectory(nonExistentPath);

      expect(result).toBe(false);
    });
  });

  describe('getDirectories', () => {
    it('should return all directories in a path', async () => {
      await mkdir(join(TEST_DIR, 'dir1'));
      await mkdir(join(TEST_DIR, 'dir2'));
      await mkdir(join(TEST_DIR, 'dir3'));
      await writeFile(join(TEST_DIR, 'file.txt'), 'test');

      const result = await getDirectories(TEST_DIR);

      expect(result).toHaveLength(3);
      expect(result).toContain(join(TEST_DIR, 'dir1'));
      expect(result).toContain(join(TEST_DIR, 'dir2'));
      expect(result).toContain(join(TEST_DIR, 'dir3'));
    });

    it('should return empty array for empty directory', async () => {
      const result = await getDirectories(TEST_DIR);

      expect(result).toEqual([]);
    });

    it('should return empty array for non-existent directory', async () => {
      const nonExistentPath = join(TEST_DIR, 'non-existent');

      const result = await getDirectories(nonExistentPath);

      expect(result).toEqual([]);
    });

    it('should exclude files and include only directories', async () => {
      await mkdir(join(TEST_DIR, 'dir1'));
      await writeFile(join(TEST_DIR, 'file1.txt'), 'test');
      await writeFile(join(TEST_DIR, 'file2.js'), 'test');

      const result = await getDirectories(TEST_DIR);

      expect(result).toHaveLength(1);
      expect(result).toContain(join(TEST_DIR, 'dir1'));
    });
  });
});
