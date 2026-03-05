export class Profile {
  public readonly accountId: string
  public birthDate: Date
  public gender: Profile.GENDER
  public weight: number
  public height: number
  public goal: Profile.GOAL
  public activityLevel: Profile.ActivityLevel
  public readonly createdAt?: Date

  constructor(attr: Profile.Attributes) {
    this.accountId = attr.accountId
    this.birthDate = attr.birthDate
    this.gender = attr.gender
    this.weight = attr.weight
    this.height = attr.height
    this.goal = attr.goal
    this.activityLevel = attr.activityLevel
    this.createdAt = attr.createdAt ? attr.createdAt : new Date()
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string
    birthDate: Date
    gender: GENDER
    weight: number
    height: number
    goal: GOAL
    activityLevel: ActivityLevel
    createdAt?: Date
  }

  export enum GENDER {
    MALE = "MALE",
    FEMALE = "FEMALE"
  }

  export enum GOAL {
    MAINTAIN = "MAINTAIN",
    GAIN = "GAIN",
    LOSE = "LOSE"
  }

  export enum ActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',
    MODERATE = 'MODERATE',
    HEAVY = 'HEAVY',
    ATHLETE = 'ATHLETE'
  }
}
