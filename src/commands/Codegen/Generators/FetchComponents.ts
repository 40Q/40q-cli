import * as fs from 'fs';
import { getPaths, copyDirectory, utilsDir } from '../../../utils/paths';
import { writeFile } from '../../../utils/utils';
import { TempDirs } from '../../../utils/types';

export function fetchRepoComponents(tempComponentsDir: string): { name: string }[] {
    const componentFiles = fs.readdirSync(tempComponentsDir).map(file => ({
        name: file
    }));

    return componentFiles;
}

export function fetchRepoBlocks(tempBlocksDir: string): { name: string }[] {
    const blockFiles = fs.readdirSync(tempBlocksDir).map(file => ({
        name: file
    }));

    return blockFiles;
}

export function downloadAndSaveItems(
    items: { name: string }[],
    type: 'block' | 'component',
    tempDirs: TempDirs
): void {
    items.forEach(item => {
        const paths = getPaths(item.name, type, tempDirs);

        if (!fs.existsSync(paths.destTsxDir)) fs.mkdirSync(paths.destTsxDir, { recursive: true });
        if (!fs.existsSync(paths.destPhpDir)) fs.mkdirSync(paths.destPhpDir, { recursive: true });
        if (!fs.existsSync(paths.destBladeDir)) fs.mkdirSync(paths.destBladeDir, { recursive: true });

        writeFile(paths.destTsxPath, fs.readFileSync(paths.sourceTsxPath, 'utf-8'));
        writeFile(paths.destPhpPath, fs.readFileSync(paths.sourcePhpPath, 'utf-8'));
        writeFile(paths.destBladePath, fs.readFileSync(paths.sourceBladePath, 'utf-8'));
    });

    copyDirectory(tempDirs.tempUtilsDir, utilsDir, ['mocks.ts']);
}
