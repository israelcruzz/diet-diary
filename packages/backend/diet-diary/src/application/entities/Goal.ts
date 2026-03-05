export class Goal {
  public readonly accountId: string
  public callories: number
  public proteins: number
  public carbohydrates: number
  public fats: number
  public goal: Goal.GOAL
  public readonly createdAt?: Date

  constructor(attr: Goal.Attributes) {
    this.accountId = attr.accountId
    this.callories = attr.callories
    this.proteins = attr.proteins
    this.carbohydrates = attr.carbohydrates
    this.fats = attr.fats
    this.goal = attr.goal
    this.createdAt = attr.createdAt ? attr.createdAt : new Date()
  }
}

export namespace Goal {
  export type Attributes = {
    accountId: string
    callories: number
    proteins: number
    carbohydrates: number
    fats: number
    goal: GOAL
    createdAt?: Date
  }

  export enum GOAL {
    MAINTAIN = "MAINTAIN",
    GAIN = "GAIN",
    LOSE = "LOSE"
  }
}
