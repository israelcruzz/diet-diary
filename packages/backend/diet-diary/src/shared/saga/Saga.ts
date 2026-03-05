type Compensate = (() => Promise<void>)

export class Saga {
  private compensates: Compensate[] = [];

  public addCompensate (compensate: () => Promise<void>) {
    this.compensates.unshift(compensate)
  }

  private async runCompensates () {
    for (const compensate of this.compensates) {
      await compensate()
    }
  }

  public async run <TResponse = any> (fn: () => Promise<TResponse>) {
    try {
      return await fn();
    } catch (error) {
      await this.runCompensates();
      throw error;
    }
  }
}
