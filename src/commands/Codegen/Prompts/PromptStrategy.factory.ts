import { PromptStrategy } from "./PromptStrategy";
import { StrategyFactory } from '../StrategyFactory';

export class PromptStrategyFactory extends StrategyFactory<PromptStrategy> {
  protected pattern = 'Prompt';
  protected directory = 'Prompts'
}
