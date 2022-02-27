import { InvalidCredentialsError } from "src/domain/error/invalid-credentials-error";
import { UnexpectedError } from "src/domain/error/unexpected-error";
import { AccountModel } from "src/domain/models/account-model";
import { AuthenticationParams } from "src/domain/useCases/authentication";
import { HttpStatusCode } from "../protocols/http/http-response";
import { HttpPostClientSpy } from "../test/mock-http-client";
import { RemoteAuthentication } from "./remote-authentication";

type SutTypes = {
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

const mockBodyRegister: AuthenticationParams = {
  name: 'nameFake',
  email: 'nameFake@example.com',
  password: '123456'
};

const mockBodyLogin: AuthenticationParams = {
  email: 'emailFake@example.com',
  password: '123456'
};

const httpResult: AccountModel = {
  accessToken: '12213asdasd13311233'
}

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
    const account = await sut.auth(mockBodyLogin);
    expect(account).toBe(httpResult)
  });

  it('Should return an AccountModel if HttpPostClient returns 201', async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.registerd,
      body: httpResult,
    }
    const account = await sut.auth(mockBodyRegister);
    expect(account).toBe(httpResult)
  });
})
