import { Goal } from "@application/entities/Goal";
import { AccountItem } from "@infra/database/dynamodb/items/AccountItem";

export class GoalItem {
  public readonly type = "goal"

  constructor(public readonly attr: GoalItem.Attributes, public readonly keys: GoalItem.Keys) {
    this.attr = attr;
    this.keys = keys;
  }

  public toItem(): GoalItem.ItemType {
    return {
      type: "goal",
      ...this.attr,
      ...this.keys
    }
  }

  public static fromEntity (goal: Goal): GoalItem {
    const attr: GoalItem.Attributes = {
      ...goal,
      createdAt: goal.createdAt?.toISOString() || new Date().toDateString()
    }

    const keys: GoalItem.Keys = {
      PK: this.getPK(goal.accountId),
      SK: this.getSK(goal.accountId)
    }

    const goalItem = new GoalItem(attr, keys)

    return goalItem
  }

  public static getPK(accountId: string): GoalItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`
  }

  public static getSK(accountId: string): GoalItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#GOAL`
  }
}

export namespace GoalItem {
  export type Attributes = {
    accountId: string
    callories: number
    proteins: number
    carbohydrates: number
    fats: number
    goal: Goal.GOAL
    createdAt: string
  }

  export type Keys = {
    PK: AccountItem.Keys["PK"],
    SK: `${AccountItem.Keys["PK"]}#GOAL`
  }

  export type ItemType = Keys & Attributes & {
    type: "goal"
  }
}
