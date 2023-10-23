import * as fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Templates } from '../Codegen.types';
import { findCliRoot } from '../../../lib/cliRoot';

export class GenerateBlock {
    private template: Templates = 'default';
    private name: string = '';
    private title: string = '';
    private camelCaseName: string = '';

    constructor(template: Templates, name: string | null) {
        this.template = template;
        this.name = name ?? '';
        this.camelCaseName = this.toCamelCase(this.name);
        this.title = this.parseName(this.name);
    }

    public run() {
        this.createBlockFolder();
        this.createBlockFiles();
    }

    private createBlockFolder() {
        execSync(`mkdir -p resources/scripts/editor/blocks/${this.name}`);
    }

    private createBlockFiles() {
        fs.writeFileSync(
            path.join(
                process.cwd(),
                `resources/scripts/editor/blocks/${this.name}/${this.name}.tsx`
            ),
            this.getTemplate('tsx')
                .replace(/{{name}}/g, this.name ?? '')
                .replace(/{{title}}/g, this.title)
        );

        fs.writeFileSync(
            path.join(
                process.cwd(),
                `resources/views/blocks/${this.name}.blade.php`
            ),
            this.getTemplate('blade')
        );

        fs.writeFileSync(
            path.join(process.cwd(), `app/Blocks/${this.camelCaseName}.php`),
            this.getTemplate('php')
                .replace(/{{name}}/g, this.name ?? '')
                .replace(/{{camelCaseName}}/g, this.camelCaseName)
        );
    }

    private parseName(name: string) {
        return name
            .split('-')
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }

    private toCamelCase(name: string) {
        return (
            name.split('-').reduce((acc, word) => {
                return acc + word.charAt(0).toUpperCase() + word.slice(1);
            }, '') ?? ''
        );
    }

    private getTemplate(name: string) {
        try {
            const cliRoot = findCliRoot(__dirname);
            const templateFolder = `templates/blocks/${this.template}`;
            return fs.readFileSync(
                path.join(cliRoot, `${templateFolder}/${name}.txt`),
                'utf8'
            );
        } catch (e) {
            return '';
        }
    }
}
