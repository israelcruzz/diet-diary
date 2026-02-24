import { ulid } from "ulid";

export class Account {
  public id: string;
  public email: string;
  public externalId: string;

  constructor (attr: Account.Attributes) {
    this.id = attr.id ? attr.id : ulid()
    this.email = attr.email;
    this.externalId = attr.externalId;
  }
};

export namespace Account {
  export type Attributes = {
    id?: string;
    email: string;
    externalId: string;
  };
};
