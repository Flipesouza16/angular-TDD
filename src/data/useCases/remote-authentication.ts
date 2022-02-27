import { InvalidCredentialsError } from "src/domain/error/invalid-credentials-error";
import { UnexpectedError } from "src/domain/error/unexpected-error";
import { AccountModel } from "src/domain/models/account-model";
import { Authentication, AuthenticationParams } from "src/domain/useCases/authentication";
import { HttpPostClient } from "../protocols/http/http-post-client";
import { HttpStatusCode } from "../protocols/http/http-response";

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) {}

  async auth(params: AuthenticationParams): Promise<any> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.registerd:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }

}
