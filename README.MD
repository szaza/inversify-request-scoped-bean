# Request scoped data using Express and Inversify

This repository provides a pattern for **authentication** and **authorization** implemented in NodeJs using Inversify and solves the problem of passing user information between service components by creating request scoped objects.

## Definition of the problem

Previously, I was coding mostly in Java and I used very well **Spring Framework** that provided a couple of fancy solutions for **authentication** and **authorization**, just consider the **@PreAuthorize()** annotation with the possibility to check wether the user has the required role and authority. Spring Framework provides very comfortable ways to check user premissions through the **isAuthenticated()**, **hasAuthority()** and **hasRole()** methods. Spring Framework is able to easily separate user information by creating request scoped beans. In the background it start a new thread for each requests and binds the user information to it.

Unfortunately, it is not recommended to use threads in NodeJS, because it brakes the event-driven pattern of the NodeJs. <br>
NodeJS is an **event-driven nonblocking runtime environment** for JavaScript, that uses events and event handlers instead of threads. Of course, it is possible to use threads in NodeJS, however it increases the resource consumption, it is difficult to use and it is getting more difficult if you are using TypeScript. Then, how to create global objects per requests which are destroyed as the request ended?

## Solution

The solution is provided by using Inversify and Express together in form of **InversifyExpressServer**, that makes possible to create objects which are binded to requests. In this example we created an authentication provider that extracts JWT token from the request header then it binds to a symbol that will be injectable in services.

The main part of the solution are the followings:

```ts
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
```

```ts
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
      ...
      res.status(200).json(this.principal);
    }
  }

  ...
}
```

```ts
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
```

For more details please check the repository.

## Run and execute

```sh
$ yarn install
$ yarn build
$ yarn start
```

## Test

There is a postman collection file in the test directory that makes easy to test requests.

#### Main idea of the solution

The main idea of the solution comes here: https://github.com/inversify/InversifyJS/issues/754; Thanks Remo H. Jansen!
