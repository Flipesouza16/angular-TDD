import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { HttpResponse } from "src/data/protocols/http/http-response";
import { mockPostRequest } from "src/data/test/mock-http-post";
import { AccountModel } from "src/domain/models/account-model";
import { HttpClientService } from "./http-client-service";

type SutTypes = {
  sut: HttpClientService,
  mockedApiResult: HttpResponse<AccountModel>
}

const makeSut = (): SutTypes => {
  const sut = TestBed.inject(HttpClientService);
  const mockedApiResult: HttpResponse<AccountModel> = {
    body: {
      accessToken: 'as1d3a1sa3s2d1',
      user: {
        email: 'email@example.com',
        password: '123456',
        firstname: 'fakeName',
        id: '1'
      }
    }
  }

  return {
    mockedApiResult,
    sut
  }
}

describe(`#${HttpClientService.name}`, () => {
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  })

  it('Should return the accessToken and body', async done => {
    const request = mockPostRequest();
    const { mockedApiResult, sut } = makeSut();

    spyOn(sut, 'post').and.returnValue(Promise.resolve(mockedApiResult));

    sut.post(request).then(data => {
      expect(data).toBe(mockedApiResult);
      done();
    });

    httpController
      .expectOne(request.url)
      .flush(mockedApiResult)
    });
})
