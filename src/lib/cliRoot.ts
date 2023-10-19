import * as fs from 'fs';
import * as path from 'path';

export function findCliRoot(startDir: string): string {
    let currentDir = startDir;

    while (currentDir !== path.parse(currentDir).root) {
        if (fs.existsSync(path.join(currentDir, '.cliroot'))) {
            return currentDir;
        }

        currentDir = path.dirname(currentDir);
    }

    throw new Error('CLI root directory with .cliroot marker not found.');
}
