import { execSync } from 'child_process';
import * as fs from 'fs';
import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { ArgumentsCamelCase, Argv } from 'yargs';
import { getBlockPath, tempPaths } from '../../utils/paths';
import { TempDirs } from '../../utils/types';
import { Command } from '../Command';
import { Templates, Types, templateChoices, typeChoices } from './Codegen.types';
import { downloadAndSaveItems, fetchRepoBlocks, fetchRepoComponents } from './Generators/FetchComponents';
import { GenerateBlock } from './Generators/GenerateBlock';

const REPO_URL = 'git@github.com:40q/block-library.git';

export class CodegenCommand implements Command {
    static builder(yargs: Argv<{}>) {
        yargs.positional('type', {
            describe: 'Type of code piece to generate',
            choices: [...typeChoices],
            demandOption: true,
            type: 'string',
        });

        yargs.positional('template', {
            describe: 'Template to use for code generation',
            choices: templateChoices,
            demandOption: false,
            type: 'string',
        });
    }

    static async handler(argv: ArgumentsCamelCase<{}>) {
        const type = argv.type as Types;
        const template = (argv.template ?? 'default') as Templates;

        switch (type) {
            case 'block':
                await handleBlock(template);
                break;
            case 'get':
                await handleGet();
                break;
            default:
                console.error(`Unknown type: ${type}`);
        }
    }
}

async function handleBlock(template: Templates) {
    const tempDirs: TempDirs = tempPaths(`temp-block-library-${uuidv4()}`);

    if (fs.existsSync(tempDirs.tempDir)) execSync(`rm -rf ${tempDirs.tempDir}`);
    execSync(`git clone ${REPO_URL} ${tempDirs.tempDir}`);

    try {
        const repoComponents = fetchRepoComponents(tempDirs.tempComponentsDir);
        const componentChoices = repoComponents.map(component => ({
            name: component.name.replace('.tsx', ''),
            value: component
        }));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Please enter a name for the block:',
                default: template || 'section-header',
            },
            {
                type: 'input',
                name: 'category',
                message: 'Please enter the block category:',
                default: '40q',
            },
            {
                type: 'input',
                name: 'icon',
                message: 'Please enter the icon name (dashicons):',
                default: 'block-default',
            },
            {
                type: 'checkbox',
                name: 'components',
                message: 'Select inner components to include:',
                choices: componentChoices
            }
        ]);

        const { name, category, icon, components } = answers;
        downloadAndSaveItems(components, 'component', tempDirs);
        const componentNames = components.map((component: {name: string, category: string, icon: string}) => component.name);
        const blockGenerator = new GenerateBlock(template, name, category, icon, componentNames);
        return blockGenerator.run();
    } finally {
        execSync(`rm -rf ${tempDirs.tempDir}`);
    }
}

async function handleGet() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'What do you want to get?',
            choices: ['block', 'component']
        }
    ]);

    const type = answers.type as 'block' | 'component';
    const tempDirs: TempDirs = tempPaths(`temp-block-library-${uuidv4()}`);

    if (fs.existsSync(tempDirs.tempDir)) execSync(`rm -rf ${tempDirs.tempDir}`);
    execSync(`git clone ${REPO_URL} ${tempDirs.tempDir}`);

    try {
        if (type === 'block') {
            const repoBlocks = fetchRepoBlocks(tempDirs.tempBlocksDir);
            const blockChoices = repoBlocks.map(block => ({
                name: block.name.replace('.block.tsx', ''),
                value: block
            }));

            const answers = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'blocks',
                    message: 'Select blocks to add:',
                    choices: blockChoices
                }
            ]);

            const { blocks } = answers;
            downloadAndSaveItems(blocks, 'block', tempDirs);
            const innerComponents = getInnerComponents(blocks, tempDirs.tempComponentsDir);
            downloadAndSaveItems(innerComponents, 'component', tempDirs);
        } else if (type === 'component') {
            const repoComponents = fetchRepoComponents(tempDirs.tempComponentsDir);
            const componentChoices = repoComponents.map(component => ({
                name: component.name.replace('.tsx', ''),
                value: component
            }));

            const answers = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'components',
                    message: 'Select components to add:',
                    choices: componentChoices
                }
            ]);

            const { components } = answers;
            downloadAndSaveItems(components, 'component', tempDirs);
        }

        console.log(`Selected ${type}s have been added to your project.`);
    } finally {
        execSync(`rm -rf ${tempDirs.tempDir}`);
    }
}

function getInnerComponents(blocks: { name: string }[], tempComponentsDir: string): { name: string }[] {
    const innerComponents: { name: string }[] = [];

    blocks.forEach(block => {
        const blockPath = getBlockPath(block.name, tempComponentsDir);
        const fileContent = fs.readFileSync(blockPath, 'utf-8');

        const componentImports = fileContent.match(/from "scripts\/editor\/components\/(.*?)\/(.*?)"/g) || [];
        componentImports.forEach(importLine => {
            const matches = /from "scripts\/editor\/components\/(.*?)\/(.*?)"/.exec(importLine);
            if (matches && matches[1]) {
                innerComponents.push({ name: matches[1] });
            }
        });
    });

    return innerComponents;
}
