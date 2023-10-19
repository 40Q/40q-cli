import { ArgumentsCamelCase, Argv } from 'yargs';

export abstract class Command {
    static builder(yargs: Argv<{}>): void {}
    static handler(argv: ArgumentsCamelCase<{}>): void {}
}
