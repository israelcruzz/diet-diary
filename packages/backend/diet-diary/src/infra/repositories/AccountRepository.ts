import { Account } from "@application/entities/Account";
import { PutCommand, PutCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient } from "@infra/clients/dynamoClient";
import { AccountItem } from "@infra/database/dynamodb/items/AccountItem";

class AccountRepository {
  public async create (account: Account) {
    const accountItem = AccountItem.fromEntity(account)

    const createAccount = new PutCommand({
      TableName: process.env.MAIN_TABLE_NAME,
      Item: {
        ...accountItem.toItem()
      }
    })

    await dynamoDbClient.send(createAccount)
  }

  public async findByEmail (email: string) {
    const command = new QueryCommand({
      TableName: process.env.MAIN_TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "#g = :g",
      ExpressionAttributeNames: {
        "#g": "GSI1PK"
      },
      ExpressionAttributeValues: {
        ":g": email
      }
    })

    const { Items } = await dynamoDbClient.send(command)

    return {
      Items
    }
  }

  public getPutCommandInput (account: Account): PutCommandInput {
    const accountItem = AccountItem.fromEntity(account);

    return {
      TableName: process.env.MAIN_TABLE_NAME,
      Item: {
        ...accountItem.toItem()
      }
    }
  }
}

export default new AccountRepository();
