export interface BaseGeneratorOptions {
  name: string;
}

export interface GeneratorStrategy {
  generate(options: BaseGeneratorOptions): void;
}