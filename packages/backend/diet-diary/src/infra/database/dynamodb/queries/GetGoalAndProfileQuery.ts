import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient } from "@infra/clients/dynamoClient";
import { ProfileItem } from "../items/ProfileItem";
import { Profile } from "@application/entities/Profile";
import { Goal } from "@application/entities/Goal";
import { GoalItem } from "../items/GoalItem";

class GetGoalAndProfileQuery {
  public async execute (accountId: string) {
    const command = new QueryCommand({
      TableName: process.env.MAIN_TABLE_NAME,
      KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK"
      },
      ExpressionAttributeValues: {
        ":PK": `ACCOUNT#${accountId}`,
        ":SK": `ACCOUNT#${accountId}#`
      }
    })

    const { Items } = await dynamoDbClient.send(command);

    if (Items && !(Items?.length > 0)) {
      return null;
    }

    const profile = Items?.find((item) => item.type === "profile") as ProfileItem.ItemType;
    const goal = Items?.find((item) => item.type === "goal") as GoalItem.ItemType;

    const profileFormatted: Profile = {
      accountId: profile.accountId,
      activityLevel: profile.activityLevel,
      birthDate: new Date(profile.birthDate),
      gender: profile.gender,
      goal: profile.goal,
      height: profile.height,
      weight: profile.weight,
      createdAt: new Date(profile.createdAt)
    }

    const goalFormatted: Goal = {
      accountId: profile.accountId,
      callories: goal.callories,
      carbohydrates: goal.carbohydrates,
      fats: goal.fats,
      goal: goal.goal,
      proteins: goal.proteins,
      createdAt: new Date(goal.createdAt)
    }

    return {
      profile: profileFormatted,
      goal: goalFormatted
    };
  }
}

export default new GetGoalAndProfileQuery();
