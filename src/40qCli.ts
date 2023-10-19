import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SetupCommand } from './commands/Setup/Setup.command';
import { CodegenCommand } from './commands/Codegen/Codegen.command';

export class q40Cli {
    static init() {
        yargs(hideBin(process.argv))
            .command(
                'setup [tool]',
                'Setup a tool',
                SetupCommand.builder,
                SetupCommand.handler
            )
            .command(
                'codegen [type] [template]',
                'Generate code from a template',
                CodegenCommand.builder,
                CodegenCommand.handler
            )
            .help().argv;
    }
}
