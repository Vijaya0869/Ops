import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export function diskStorageFor(subdir: string) {
  const dir = join(process.cwd(), 'uploads', subdir);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return diskStorage({
    destination: dir,
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  });
}

export function publicUrlFor(subdir: string, filename: string): string {
  return `/uploads/${subdir}/${filename}`;
}

export function absolutePathFor(relativeUrl: string): string {
  return join(process.cwd(), relativeUrl.replace(/^\//, ''));
}
