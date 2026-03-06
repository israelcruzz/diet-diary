import { Profile } from "@application/entities/Profile";
import { AccountItem } from "@infra/database/dynamodb/items/AccountItem";

export class ProfileItem {
  public readonly type = "profile"

  constructor(public readonly attr: ProfileItem.Attributes, public readonly keys: ProfileItem.Keys) {
    this.attr = attr;
    this.keys = keys;
  }

  public toItem(): ProfileItem.ItemType {
    return {
      type: "profile",
      ...this.attr,
      ...this.keys
    }
  }

  public static fromEntity (profile: Profile): ProfileItem {
    const attr: ProfileItem.Attributes = {
      ...profile,
      birthDate: profile.birthDate?.toISOString() || new Date(profile.birthDate).toDateString(),
      createdAt: profile.createdAt?.toISOString() || new Date().toDateString()
    }

    const keys: ProfileItem.Keys = {
      PK: this.getPK(profile.accountId),
      SK: this.getSK(profile.accountId)
    }

    const profileItem = new ProfileItem(attr, keys)

    return profileItem
  }

   public static toEntity(profileItem: ProfileItem): Profile {
      return new Profile({
        accountId: profileItem.attr.accountId,
        activityLevel: profileItem.attr.activityLevel,
        birthDate: new Date(profileItem.attr.birthDate),
        gender: profileItem.attr.gender,
        goal: profileItem.attr.goal,
        height: profileItem.attr.height,
        weight: profileItem.attr.weight,
        createdAt: new Date(profileItem.attr.accountId)
      })
    }

  public static getPK(accountId: string): ProfileItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`
  }

  public static getSK(accountId: string): ProfileItem.Keys["SK"] {
    return `ACCOUNT#${accountId}#PROFILE`
  }
}

export namespace ProfileItem {
  export type Attributes = {
    accountId: string
    birthDate: string
    gender: Profile.GENDER
    weight: number
    height: number
    goal: Profile.GOAL
    activityLevel: Profile.ActivityLevel
    createdAt: string
  }

  export type Keys = {
    PK: AccountItem.Keys["PK"],
    SK: `${AccountItem.Keys["PK"]}#PROFILE`
  }

  export type ItemType = Keys & Attributes & {
    type: "profile"
  }
}
