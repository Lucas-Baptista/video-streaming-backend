import path from 'path';
import { readdir } from 'fs/promises';

export default async function listFilesRecursively(
    dir: string,
    startFrom?: string,
): Promise<string[]> {

    const entries = await readdir(
        dir,
        {
            withFileTypes: true,
        },
    );

    const files: string[] = [];

    for (const entry of entries) {

        const fullPath = path.join(
            dir,
            entry.name,
        );

        if (entry.isDirectory()) {
            files.push(
                ...(await listFilesRecursively(fullPath)),
            );
        } else {
            files.push(fullPath);
        }
    }

    files.sort();

    if (!startFrom) {
        return files;
    }

    const index = files.indexOf(startFrom);

    return index === -1
        ? files
        : files.slice(index);
}