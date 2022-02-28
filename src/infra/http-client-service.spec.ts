import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AccountModel } from "src/domain/models/account-model";
import { mockBodyRegister } from "src/domain/test/mock-account";
import { HttpClientService } from "./http-client-service";

type SutTypes = {
  sut: HttpClientService,
  mockedApi: AccountModel
}

const makeSut = (): SutTypes => {
  const sut = TestBed.inject(HttpClientService);
  const mockedApi: AccountModel = {
    accessToken: 'as1d3a1sa3s2d1',
    user: {
      email: 'email@example.com',
      password: '123456',
      firstname: 'fakeName',
      id: '1'
    }
  }
  return {
    mockedApi,
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

  it('Should return the accessToken and body', done => {
    const url = 'http://localhost:3000/users';
    const { mockedApi, sut } = makeSut();
    sut.post({ url, body: mockBodyRegister }).subscribe(data => {
      expect(data).toBe(mockedApi);
      done();
    })

    httpController
      .expectOne(url)
      .flush(mockedApi)
  })
})
