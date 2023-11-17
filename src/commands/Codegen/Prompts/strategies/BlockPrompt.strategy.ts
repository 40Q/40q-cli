import inquirer from 'inquirer';
import { PromptStrategy } from "../PromptStrategy";
import { BlockGeneratorOptions } from '@/commands/Codegen/Generators/strategies/BlockGenerator.strategy';
import { config } from '@/config';

export class BlockPromptStrategy implements PromptStrategy {
  async prompt(): Promise<BlockGeneratorOptions> {
    
                const templateAnswer = await inquirer.prompt(
                [
                   {
                    type: 'list',
                    name: 'template',
                    message: 'Please select a template:',
                    choices: config.templateChoices.block,
                    default: '',
                   }
                ],
            );

            const template = (templateAnswer?.template as string) || '';

                const answers = await inquirer.prompt(
                [
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Please enter a name for the block:',
                        default: template || 'block-name',
                    },
                ],
            );

            const name = (answers?.name as string) || '';
            return { name, template };
  }
}