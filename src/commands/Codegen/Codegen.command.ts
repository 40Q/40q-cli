import { ArgumentsCamelCase, Argv } from 'yargs';
import { Command } from '../Command';
import inquirer, { QuestionCollection } from 'inquirer';
import { GenerateBlock } from './Generators/GenerateBlock';
import { Templates, Types, templateChoices, typeChoices } from './Codegen.types';

export class CodegenCommand implements Command {
    static builder(yargs: Argv<{}>) {
        yargs.positional('type', {
            describe: 'Type of code piece to generate',
            choices: typeChoices,
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

        if (type === 'block') {
            const answers = await CodegenCommand.prompt(
                [
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Please enter a name for the block:',
                        default: 'section-header',
                    },
                ],
                template === 'default'
            );

            const name = (answers?.name as string) || null;

            return GenerateBlock.run(template, name);
        }
    }

    static async prompt(prompts: QuestionCollection, condition: boolean) {
        if (!condition) return null;

        return await inquirer.prompt(prompts);
    }
}
