import { injectable, inject } from "inversify";
import { Principal } from "./model";
import { TYPES } from "./types";

export interface CustomService {
  printUserDetails(): void;
}

@injectable()
export class CustomServiceImpl implements CustomService {
  @inject(TYPES.Principal) private readonly principal: Principal;
  public async printUserDetails() {
    console.log(`Custom service - token: ${this.principal.details.token}`);
  }
}
