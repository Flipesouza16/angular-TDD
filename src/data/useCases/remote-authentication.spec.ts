import { InvalidCredentialsError } from "src/domain/error/invalid-credentials-error";
import { UnexpectedError } from "src/domain/error/unexpected-error";
import { AccountModel } from "src/domain/models/account-model";
import { httpResult, mockBodyLogin, mockBodyRegister } from "src/domain/test/mock-account";
import { AuthenticationParams } from "src/domain/useCases/authentication";
import { HttpStatusCode } from "../protocols/http/http-response";
import { HttpPostClientSpy } from "../test/mock-http-client";
import { RemoteAuthentication } from "./remote-authentication";

export type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
};

const makeSut = (url: string = 'url-fake/users'): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);
  return {
    sut,
    httpPostClientSpy,
  };
};

describe(`#${RemoteAuthentication.name}`, () => {
  it('Should call HttpPostClient with correct url', async () => {
    const url = 'url/users';
    const { httpPostClientSpy, sut } = makeSut(url);
    await sut.auth(mockBodyRegister);
    expect(httpPostClientSpy.url).toBe(url);
  })

  it('Should call HttpPostClient with correct body', async () => {
    const { httpPostClientSpy, sut } = makeSut();
    await sut.auth(mockBodyRegister);
    expect(httpPostClientSpy.body).toBe(mockBodyRegister);
  })

  it('Should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }

    const promise = sut.auth(mockBodyLogin);
    await expectAsync(promise).toBeRejectedWith(new InvalidCredentialsError());
  })

  it('Should throw UnexpectedWError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.auth(mockBodyLogin);
    await expectAsync(promise).toBeRejectedWith(new UnexpectedError());
  })

  it("Should throw UnexpectedError if HttpPostClient returns 500", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };
    const promise = sut.auth(mockBodyLogin);
    await expectAsync(promise).toBeRejectedWith(new UnexpectedError());
  });

  it("Should throw UnexpectedError if HttpPostClient returns 404", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    const promise = sut.auth(mockBodyLogin);
    await expectAsync(promise).toBeRejectedWith(new UnexpectedError());
  });

  it('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    }
    const account: AccountModel = await sut.auth(mockBodyLogin);
    expect(account).toBe(httpResult);
  });

  it('Should return the same user used to login', async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    };

    const account: AccountModel = await sut.auth(mockBodyLogin);
    const accountUserFormatted: AuthenticationParams = {
      email: account.user.email,
      password: account.user.password
    }
    expect(accountUserFormatted).toEqual(mockBodyLogin);
  })

  it('Should return an AccountModel if HttpPostClient returns 201', async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.registerd,
      body: httpResult,
    }
    const account: AccountModel = await sut.auth(mockBodyRegister);
    const accountUserFormatted: AuthenticationParams = {
      firstname: account.user.firstname,
      email: account.user.email,
      password: account.user.password
    }
    expect(account).toBe(httpResult);
    expect(accountUserFormatted).toEqual(mockBodyRegister);
  });

  it('Should return the same user used for registration', async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    };

    const account: AccountModel = await sut.auth(mockBodyRegister);
    const accountUserFormatted: AuthenticationParams = {
      firstname: account.user.firstname,
      email: account.user.email,
      password: account.user.password
    }
    expect(accountUserFormatted).toEqual(mockBodyRegister);
  });
})
