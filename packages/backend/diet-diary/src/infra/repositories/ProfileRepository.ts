import { Profile } from "@application/entities/Profile"
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { dynamoDbClient } from "@infra/clients/dynamoClient"
import { ProfileItem } from "@infra/database/dynamodb/items/ProfileItem"

class ProfileRepository {
  public async create(profile: Profile) {
    const profileItem = ProfileItem.fromEntity(profile)

    const createProfile = new PutCommand({
      TableName: process.env.MAIN_TABLE_NAME,
      Item: {
        ...profileItem.toItem()
      }
    })

    await dynamoDbClient.send(createProfile)
  }

  public getPutCommandInput (profile: Profile): PutCommandInput {
      const accountItem = ProfileItem.fromEntity(profile);

      return {
        TableName: process.env.MAIN_TABLE_NAME,
        Item: {
          ...accountItem.toItem()
        }
      }
    }
}

export default new ProfileRepository();
