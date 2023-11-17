import path from 'path';
import { fileURLToPath } from 'url';

export abstract class StrategyFactory<T> {
  protected directory: string = 'strategies';
  protected abstract pattern: string;

  protected getStrategyFileName(type: string): string {
    const pascalCaseType = type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return `${pascalCaseType}${this.pattern}.strategy.js`;
  }

  public async getStrategy(type: string): Promise<T | null> {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const strategyFileName = this.getStrategyFileName(type);
    const strategyFilePath = path.join(__dirname, this.directory, 'strategies', strategyFileName);


    try {
      const strategyModule = await import(`${strategyFilePath}`);
      return new strategyModule.default() as T;
    } catch (error) {
      console.error(`Failed to import strategy '${type}':`, error);
      return null;
    }
  }
}
