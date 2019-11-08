import "reflect-metadata";
import { injectable, inject } from "inversify";
import {
  controller,
  httpGet,
  BaseHttpController,
  interfaces,
  InversifyExpressServer
} from "inversify-express-utils";
import * as express from "express";
import * as bodyParser from "body-parser";
import { TYPES } from "./types";
import { Principal } from "./model";
import { CustomService } from "./custom-service";
import diContainer from "./di-container";

@injectable()
class CustomAuthProvider implements interfaces.AuthProvider {
  public async getUser(
    req: express.Request,
    __res: express.Response,
    __next: express.NextFunction
  ): Promise<Principal> {
    return new Principal({
      token: req.headers["x-auth-token"]
    });
  }
}

@controller("/some-controller")
class SomeController extends BaseHttpController {
  @inject(TYPES.Principal) private readonly principal: Principal;
  @inject(TYPES.CustomService)
  private readonly customService: CustomService;

  @httpGet("/")
  public async get(
    __req: express.Request,
    res: express.Response,
    __next: express.NextFunction
  ) {
    if (this.principal) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      this.customService.printUserDetails();
      res.status(200).json(this.principal);
    }
  }

  @httpGet("/another-user")
  public getAnotherUser() {
    this.customService.printUserDetails();
    if (this.principal) {
      return this.principal;
    }
  }
}

const server = new InversifyExpressServer(
  diContainer,
  null,
  null,
  null,
  CustomAuthProvider
);

server.setConfig(app => {
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
});

server.build().listen(3000);
