import { BaseGeneratorOptions} from '@/commands/Codegen/Generators/GeneratorStrategy';

export interface PromptStrategy {
  prompt(): Promise<BaseGeneratorOptions>;
}
