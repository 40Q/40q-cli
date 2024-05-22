import path from 'path';
import * as fs from 'fs';
import { toPascalCase, writeFile } from './utils';
import { TempDirs } from './types';

const tempDir = (dirName: string) => path.join(process.cwd(), dirName);
const componentsDir = 'resources/scripts/editor/components';
const blocksDir = 'resources/scripts/editor/blocks';
const utilsDir = path.join(process.cwd(), 'resources/scripts/editor/utils');

const tempPaths = (dirName: string): TempDirs => ({
    tempDir: tempDir(dirName),
    tempComponentsDir: path.join(tempDir(dirName), componentsDir),
    tempBlocksDir: path.join(tempDir(dirName), blocksDir),
    tempBlockPhpDir: path.join(tempDir(dirName), 'app/Blocks'),
    tempBlockBladeDir: path.join(tempDir(dirName), 'resources/views/blocks'),
    tempComponentPhpDir: path.join(tempDir(dirName), 'app/View/Components'),
    tempComponentBladeDir: path.join(tempDir(dirName), 'resources/views/components'),
    tempUtilsDir: path.join(tempDir(dirName), 'resources/scripts/editor/utils')
});

const getBlockPath = (blockName: string, tempDir: string) =>
    path.join(tempDir.replace('components', 'blocks'), blockName, `${blockName}.block.tsx`);

const getComponentPath = (componentName: string, tempDir: string) =>
    path.join(tempDir, componentName, `${componentName}.tsx`);

const getPaths = (name: string, type: 'block' | 'component', tempDirs: TempDirs) => {
    const namePascal = toPascalCase(name);
    const isBlock = type === 'block';
    const dirType = isBlock ? 'blocks' : 'components';
    const tsxFile = isBlock ? `${name}.block.tsx` : `${name}.tsx`;

    return {
        sourceTsxPath: path.join(tempDirs[`temp${isBlock ? 'Blocks' : 'Components'}Dir`], name, tsxFile),
        destTsxDir: path.join(process.cwd(), `resources/scripts/editor/${dirType}`, name),
        destTsxPath: path.join(process.cwd(), `resources/scripts/editor/${dirType}`, name, tsxFile),
        sourcePhpPath: path.join(tempDirs[`temp${isBlock ? 'Block' : 'Component'}PhpDir`], `${namePascal}.php`),
        destPhpDir: path.join(process.cwd(), isBlock ? 'app/Blocks' : 'app/View/Components'),
        destPhpPath: path.join(process.cwd(), isBlock ? 'app/Blocks' : 'app/View/Components', `${namePascal}.php`),
        sourceBladePath: path.join(tempDirs[`temp${isBlock ? 'Block' : 'Component'}BladeDir`], `${name}.blade.php`),
        destBladeDir: path.join(process.cwd(), `resources/views/${dirType}`),
        destBladePath: path.join(process.cwd(), `resources/views/${dirType}`, `${name}.blade.php`),
        utilsDir: utilsDir
    };
};

function copyDirectory(sourceDir: string, destDir: string, excludeFiles: string[] = []) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(sourceDir).forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);

        if (excludeFiles.includes(file)) {
            return;
        }

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destPath, excludeFiles);
        } else {
            writeFile(destPath, fs.readFileSync(sourcePath, 'utf-8'));
        }
    });
}

export { tempPaths, componentsDir, blocksDir, utilsDir, tempDir, getBlockPath, getComponentPath, getPaths, copyDirectory };
