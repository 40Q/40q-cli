import { ArgumentsCamelCase, Argv } from 'yargs';
import { execSync } from 'child_process';
import { Command } from '../Command';

const eslintrc = `
{
    "extends": ["@40q/eslint-config"]
}
`;

const huskyrc = `
{
    "hooks": {
        "pre-commit": "lint-staged"
    }
} 
`;

const lintstagedrc = `
{
    "*.{js,jsx,ts,tsx}": ["eslint --fix"] 
}
`;

export class SetupCommand implements Command {
    static builder(yargs: Argv<{}>) {
        yargs.positional('tool', {
            describe: 'Name of the tool to setup',
            type: 'string',
        });
    }

    static handler(argv: ArgumentsCamelCase<{}>) {
        SetupCommand.setupTool(argv.tool as string);
    }

    static setupTool(tool: string) {
        switch (tool) {
            case 'eslint':
                this.setupEslint();
                break;

            default:
                console.error(
                    `Unknown tool: ${tool}. Please specify a supported tool.`
                );
        }
    }

    static setupEslint() {
        console.log('Installing dependencies...');
        execSync('yarn add --dev eslint @40q/eslint-config husky lint-staged');

        console.log('Creating .eslintrc.json...');
        execSync(`echo '${eslintrc}' > .eslintrc.json`);

        console.log('Creating .huskyrc.json...');
        execSync(`echo '${huskyrc}' > .huskyrc.json`);

        console.log('Creating .lintstagedrc.json...');
        execSync(`echo '${lintstagedrc}' > .lintstagedrc.json`);

        console.log('Done!');
    }
}
