import { GeneratorStrategy } from './GeneratorStrategy';
import { StrategyFactory } from '../StrategyFactory';

export class GeneratorStrategyFactory extends StrategyFactory<GeneratorStrategy> {
  protected pattern = 'Generator';
  protected directory = 'Generators'
}