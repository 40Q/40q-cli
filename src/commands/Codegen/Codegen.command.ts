import { ArgumentsCamelCase, Argv } from 'yargs';
import { Command } from '../Command';
import { PromptStrategyFactory } from './Prompts/PromptStrategy.factory';
import { GeneratorStrategyFactory } from './Generators/GeneratorStrategy.factory';
import { config } from '@/config';

export class CodegenCommand implements Command {
    static builder(yargs: Argv<{}>) {
        yargs.positional('type', {
            describe: 'Type of code piece to generate',
            choices: config.typeChoices,
            demandOption: true,
            type: 'string',
        });
    }

    static async handler(argv: ArgumentsCamelCase<{}>) {
        const type = argv.type as string;

        try {
            const promptStrategyFactory = new PromptStrategyFactory();
            const promptStrategy = await promptStrategyFactory.getStrategy(type);
            if (!promptStrategy) {
                throw new Error(`Prompt strategy for type '${type}' not recognized.`);
            }

            const options = await promptStrategy.prompt();
            const generatorStrategyFactory = new GeneratorStrategyFactory();
            const generator = await generatorStrategyFactory.getStrategy(type);
            if (!generator) {
                throw new Error(`Generator for type '${type}' could not be created.`);
            }
            
            generator.generate(options)
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error during code generation: ${error.message}`);
                return;
            }

            console.error(error);
        }
    }
}
