import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import { Templates } from '../Codegen.types';
import { findCliRoot } from '../../../lib/cliRoot';

export class GenerateBlock {
    static run(template: Templates, name: string | null) {
        const title =
            name
                ?.split('-')
                .map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join(' ') ?? '';
        const dirAndFileName = name || template;

        execSync(`mkdir -p resources/scripts/editor/blocks/${dirAndFileName}`);

        const cliRoot = findCliRoot(__dirname);
        const templateContent = fs.readFileSync(
            path.join(cliRoot, 'templates/blocks/', `${template}.txt`),
            'utf8'
        );

        fs.writeFileSync(
            path.join(
                process.cwd(),
                `resources/scripts/editor/blocks/${dirAndFileName}/${dirAndFileName}.tsx`
            ),
            templateContent
                .replace(/{{name}}/g, name ?? '')
                .replace(/{{title}}/g, title)
        );
    }
}
