import * as fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Templates } from '../Codegen.types';
import { findCliRoot } from '../../../lib/cliRoot';
import { toCamelCase, toPascalCase, writeFile } from '../../../utils/utils';

export class GenerateBlock {
    private template: Templates = 'default';
    private name: string = '';
    private icon: string = '';
    private category: string = '';
    private components: string[] = [];
    private title: string = '';
    private pascalCaseName: string = '';

    constructor(template: Templates, name: string | null, category: string | null, icon: string | null, components: string[]) {
        this.template = template;
        this.name = name ?? '';
        this.category = category ?? '';
        this.icon = icon ?? '';
        this.pascalCaseName = toPascalCase(this.name);
        this.title = this.parseName(this.name);
        this.components = components;
    }

    public run() {
        this.createBlockFolder();
        this.createBlockFiles();
    }

    private createBlockFolder() {
        execSync(`mkdir -p resources/scripts/editor/blocks/${this.name}`);
    }

    private createBlockFiles() {
        let imports = '';
        let attributes = '';
        let viewAttributes = '';
        let panelBody = '';
        let editComponents = '';
        let attributeNames = ['title'];

        this.components.forEach(component => {
            const componentNamePascal = toPascalCase(component);
            const componentNameCamel = toCamelCase(component);
            const basePath = `scripts/editor/components/${component}/${component}`;
            const componentPath = path.join(process.cwd(), `resources/scripts/editor/components/${component}/${component}.tsx`);

            let importStatements = [];
            let sidebarComponent = '';
            let editComponent = '';
            let editProps = '{ attributes }';

            const fileContent = fs.readFileSync(componentPath, 'utf-8');

            const editRegex = /export const Edit = \(\s*{([\s\S]*?)}\s*\)/;
            const sidebarRegex = /export const Sidebar = \(\s*{([\s\S]*?)}\s*\)/;

            const editMatch = editRegex.exec(fileContent);
            const sidebarMatch = sidebarRegex.exec(fileContent);

            if (editMatch) {
                importStatements.push(`Edit as ${componentNamePascal}Edit`);
                if (editMatch[1].includes('setAttributes')) {
                    editComponent = `<${componentNamePascal}Edit attributes={${componentNameCamel} as ${componentNamePascal}Type} setAttributes={(${componentNameCamel}) => setAttributes({${componentNameCamel}})} />\n`;
                    editProps = '{ attributes, setAttributes }';
                } else {
                    editComponent = `<${componentNamePascal}Edit attributes={${componentNameCamel} as ${componentNamePascal}Type} />\n`;
                }
            }

            if (sidebarMatch) {
                importStatements.push(`Sidebar as ${componentNamePascal}Sidebar`);
                if (sidebarMatch[1].includes('setAttributes')) {
                    sidebarComponent = `<${componentNamePascal}Sidebar attributes={${componentNameCamel} as ${componentNamePascal}Type} setAttributes={(${componentNameCamel}) => setAttributes({${componentNameCamel}})} />\n`;
                } else {
                    sidebarComponent = `<${componentNamePascal}Sidebar attributes={${componentNameCamel} as ${componentNamePascal}Type} />\n`;
                }
            }

            importStatements.push(
                `defaultAttributes as default${componentNamePascal}Attributes`,
                `BlockAttributeValues as ${componentNamePascal}Type`
            );

            imports += `import { ${importStatements.join(', ')} } from "${basePath}";\n`;

            attributes += `${componentNameCamel}: {
              type: "object",
              default: default${componentNamePascal}Attributes,
            },\n`;

            viewAttributes += `'${componentNameCamel}' => $block['attrs']['${componentNameCamel}'] ?? [],\n`;

            if (sidebarComponent) {
                panelBody += sidebarComponent;
            }

            if (editComponent) {
                editComponents += editComponent;
            }

            attributeNames.push(componentNameCamel);
        });

        const destructuring = attributeNames.join(', ');

        writeFile(
            path.join(process.cwd(), `resources/scripts/editor/blocks/${this.name}/${this.name}.block.tsx`),
            this.getTemplate('tsx')
                .replace(/{{name}}/g, this.name ?? '')
                .replace(/{{category}}/g, this.category ?? '')
                .replace(/{{icon}}/g, this.icon ?? '')
                .replace(/{{title}}/g, this.title)
                .replace(/{{imports}}/g, imports)
                .replace(/{{attributes}}/g, attributes)
                .replace(/{{panelBody}}/g, panelBody)
                .replace(/{{destructure_attributes}}/g, destructuring)
                .replace(/{{editComponents}}/g, editComponents)
        );

        writeFile(
            path.join(process.cwd(), `resources/views/blocks/${this.name}.blade.php`),
            this.getTemplate('blade')
        );

        writeFile(
            path.join(process.cwd(), `app/Blocks/${this.pascalCaseName}.php`),
            this.getTemplate('php')
                .replace(/{{name}}/g, this.name ?? '')
                .replace(/{{pascalCaseName}}/g, this.pascalCaseName)
                .replace(/{{viewAttributes}}/g, viewAttributes)
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
