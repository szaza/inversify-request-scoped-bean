import { Container } from "inversify";
import { Principal } from "./model";
import { TYPES } from "./types";
import { TYPE, interfaces } from "inversify-express-utils";
import { CustomService, CustomServiceImpl } from "./custom-service";

const diContainer = new Container();

diContainer
  .bind<Principal>(TYPES.Principal)
  .toDynamicValue(ctx => {
    const httpContext = ctx.container.get<interfaces.HttpContext>(
      TYPE.HttpContext
    );
    return httpContext.user ? httpContext.user : null;
  })
  .inRequestScope();

diContainer
  .bind<CustomService>(TYPES.CustomService)
  .to(CustomServiceImpl)
  .inRequestScope();

export default diContainer;
