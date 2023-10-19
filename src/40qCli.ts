import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SetupCommand } from './commands/Setup.command';

export class q40Cli {
    static init() {
        yargs(hideBin(process.argv))
            .command(
                'setup [tool]',
                'Setup a tool',
                SetupCommand.builder,
                SetupCommand.handler
            )
            .help().argv;
    }
}
