import { Account } from "@application/entities/Account";

export class AccountItem {
  public readonly type = "account"

  constructor(public readonly attr: AccountItem.Attributes, public readonly keys: AccountItem.Keys) {
    this.attr = attr;
    this.keys = keys;
  }

  public toItem(): AccountItem.ItemType {
    return {
      type: this.type,
      ...this.keys,
      ...this.attr
    }
  }

  public static fromEntity(account: Account) {
    return new AccountItem(
      {
        id: account.id,
        email: account.email,
        externalId: account.externalId
      },
      {
        PK: this.getPK(account.id),
        SK: this.getSK(account.id),
        GSI1PK: this.getGSI1PK(account.email),
        GSI1SK: this.getGSI1SK(account.id)
      }
    )
  }

  public toEntity(): Account {
    return new Account({
      id: this.attr.id,
      email: this.attr.email,
      externalId: this.attr.externalId
    })
  }

  public static getPK(accountId: string): AccountItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`
  }

  public static getSK(accountId: string): AccountItem.Keys["SK"] {
    return `ACCOUNT#${accountId}`
  }

  public static getGSI1PK(email: string): AccountItem.Keys["GSI1PK"] {
    return `ACCOUNT#${email}`
  }

  public static getGSI1SK(accountId: string): AccountItem.Keys["GSI1SK"] {
    return `ACCOUNT#${accountId}`
  }
}

export namespace AccountItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  }

  export type Attributes = Account.Attributes

  export type ItemType = Account.Attributes & Keys & {
    type: "account"
  }
}
