import { Goal } from "@application/entities/Goal";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient } from "@infra/clients/dynamoClient";
import { GoalItem } from "@infra/database/dynamodb/items/GoalItem";

class GoalRepository {
  public async create(goal: Goal) {
    const goalItem = GoalItem.fromEntity(goal)

    const createGoal = new PutCommand({
      TableName: process.env.MAIN_TABLE_NAME,
      Item: {
        ...goalItem.toItem()
      }
    })

    await dynamoDbClient.send(createGoal)
  }

  public getPutCommandInput (goal: Goal): PutCommandInput {
      const accountItem = GoalItem.fromEntity(goal);

      return {
        TableName: process.env.MAIN_TABLE_NAME,
        Item: {
          ...accountItem.toItem()
        }
      }
    }
}

export default new GoalRepository();
