import { PutCommandInput, TransactWriteCommand, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient } from "@infra/clients/dynamoClient";

export abstract class UnitOfWork {
  private transactItems: NonNullable<TransactWriteCommandInput['TransactItems']> = [];

  protected addPut (item: PutCommandInput) {
    this.transactItems.push({ Put: item });
  }

  protected async commit () {
    const command = new TransactWriteCommand({
      TransactItems: this.transactItems
    });

    await dynamoDbClient.send(command);
  }
}
