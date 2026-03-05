import { Account } from "@application/entities/Account";
import { UnitOfWork } from "./UnitOfWork";
import { Profile } from "@application/entities/Profile";
import { Goal } from "@application/entities/Goal";
import AccountRepository from "@infra/repositories/AccountRepository";
import ProfileRepository from "@infra/repositories/ProfileRepository";
import GoalRepository from "@infra/repositories/GoalRepository";

export class SignUpUow extends UnitOfWork {
  constructor (private readonly items: SignUpUow.SignUpUowConstructor) {
    super();
  }

  public async run() {
    this.addPut(AccountRepository.getPutCommandInput(this.items.account));
    this.addPut(ProfileRepository.getPutCommandInput(this.items.profile));
    this.addPut(GoalRepository.getPutCommandInput(this.items.goal));

    await this.commit();
  }
}

export namespace SignUpUow {
  export type SignUpUowConstructor = {
    account: Account;
    profile: Profile;
    goal: Goal;
  }
}
