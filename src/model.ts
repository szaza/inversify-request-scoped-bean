import { interfaces } from "inversify-express-utils/dts/interfaces";
import { injectable } from "inversify";

export interface UserDetails {
  token: string;
}

@injectable()
export class Principal implements interfaces.Principal {
  public details: UserDetails;
  public constructor(details: any) {
    this.details = details;
  }
  public isAuthenticated(): Promise<boolean> {
    return Promise.resolve(!!this.details.token);
  }
  public isResourceOwner(resourceId: any): Promise<boolean> {
    throw new Error("Not implemented!");
  }
  public isInRole(role: string): Promise<boolean> {
    throw new Error("Not implemented!");
  }
}
