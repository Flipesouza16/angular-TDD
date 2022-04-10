import { TestBed } from '@angular/core/testing';
import { mockBodyRegister, mockBodyLogin } from 'src/domain/test/mock-account';
import { AuthenticationService } from './authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountModel } from 'src/domain/models/account-model';
import { HttpResponse } from 'src/data/protocols/http/http-response';
import { mockPostLoginRequest, mockPostRegisterRequest } from 'src/data/test/mock-http-post';

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

describe(`#${AuthenticationService.name}`, () => {
  let service: AuthenticationService;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    }).compileComponents();

    service = TestBed.inject(AuthenticationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it(`#${AuthenticationService.name} should be created`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${AuthenticationService.prototype.validateEmail} Should return true if email is valid`, () => {
    const email = 'zezim@example.com';
    const isValidEmail = service.validateEmail(email);
    expect(isValidEmail)
      .withContext('Email is not valid')
      .toBeTrue();
  });

  it(`#${AuthenticationService.prototype.validateEmail} Should return false if email is not valid`, () => {
    const listEmail = [
      'zezimexample.com',
      'zezi@example',
      'zezim@example.'
    ];
    for(const email of listEmail) {
      const isValidEmail = service.validateEmail(email);
      expect(isValidEmail)
        .withContext(`Email ${email} is valid`)
        .toBeFalse();
    }
  });

  it(`#${AuthenticationService.prototype.validatePassowrdStrength} Should return true if password strength is good`, () => {
    const listOfPasswords = [
      'senha123',
      'A123456',
      '/*123456a',
    ];
    listOfPasswords.forEach(password => {
      const isPasswordStrengthGood = service.validatePassowrdStrength(password);
      expect(isPasswordStrengthGood)
        .withContext(`Password strength ${password} is week`)
        .toBeTrue();
    })
  });

  it(`#${AuthenticationService.prototype.validatePassowrdStrength} Should return false if password strength is week`, () => {
    const listOfPasswords = [
      'senhaasdasd',
      '123456',
      '/*123',
    ];
    listOfPasswords.forEach(password => {
      const isPassordStrengthGood = service.validatePassowrdStrength(password);
      expect(isPassordStrengthGood)
        .withContext(`Password strength ${password} is good`)
        .toBeFalse();
    })
  });

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return true if the password contain at least 1 lowercase character`, () => {
    const mockPassword = 'asd'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1Lowercase();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} contain at least 1 lowercase`)
      .toBe(true);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return false if the password does not contain at least 1 lowercase character`, () => {
    const mockPassword = 'ASDA'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1Lowercase();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} does not contain at least 1 lowercase`)
      .toBe(false);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return true if the password contain at least 1 uppercase character`, () => {
    const mockPassword = 'ASDA'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1Uppercase();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} contain at least 1 uppercase`)
      .toBe(true);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return false if the password does not contain at least 1 uppercase character`, () => {
    const mockPassword = 'qwe'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1Uppercase();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} does not contain at least 1 uppercase`)
      .toBe(false);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return true if the password contain at least 1 numeric character`, () => {
    const mockPassword = 'asd1'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1numeric();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} contain at least 1 numeric`)
      .toBe(true);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return false if the password does not contain at least 1 numeric character`, () => {
    const mockPassword = 'qwe'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1numeric();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} does not contain at least 1 numeric`)
      .toBe(false);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return true if the password contain at least 1 special character`, () => {
    const mockPassword = 'asd1*'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1Special();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} contain at least 1 special`)
      .toBe(true);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return false if the password does not contain at least 1 special character`, () => {
    const mockPassword = 'qwe'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).atLeast1Special();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} does not contain at least 1 special character`)
      .toBe(false);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return true if the password contain at least 8 characteres`, () => {
    const mockPassword = 'asd123as'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).mustBe8CharactersOrLonger();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} contain at least 8 characteres`)
      .toBe(true);
  })

  it(`#${AuthenticationService.prototype.fullValidationRequirements} Should return false if the password does not contain at least 8 characteres`, () => {
    const mockPassword = 'qwe'
    const isAtLeast1Lowercase = service.fullValidationRequirements(mockPassword).mustBe8CharactersOrLonger();
    expect(isAtLeast1Lowercase)
      .withContext(`Password ${mockPassword} does not contain at least 8 characteres`)
      .toBe(false);
  })

  it(`#${AuthenticationService.prototype.verifyAllField} Should return true if all field of register are filled and validated`, () => {
    const { fieldInvalid, isAllFieldsFilledAndValidated } = service.verifyAllField(mockBodyRegister);
    expect(isAllFieldsFilledAndValidated)
      .withContext(`The value ${fieldInvalid} is invalid`)
      .toBeTrue();
  })

  it(`#${AuthenticationService.prototype.verifyAllField} Should return true if all field of login are filled and validated`, () => {
    const { fieldInvalid, isAllFieldsFilledAndValidated } = service.verifyAllField(mockBodyLogin);
    expect(isAllFieldsFilledAndValidated)
      .withContext(`The value ${fieldInvalid} is invalid`)
      .toBeTrue();
  })

  it(`# Should call the verifyAllField function before the HttpPostClient Register function`, done => {
    service.register(mockBodyRegister);
    expect(service.checkedFields).toBeTrue()
    done();
  })

  it(`#${AuthenticationService.prototype.register} Should return the user and accessToken if the registration is successful`, done => {
    const requestRegister = mockPostRegisterRequest();

    service.register(mockBodyRegister).then(data => {
      expect(data).toBe(mockedApiResult)
      done();
    })

    httpController
      .expectOne(requestRegister.url)
      .flush(mockedApiResult)
  })

  it(`# Should call the verifyAllField function before the HttpPostClient Login function`, done => {
    service.login(mockBodyLogin);
    expect(service.checkedFields).toBeTrue()
    done();
  })

  it(`#${AuthenticationService.prototype.login} Should return the user and accessToken if the login is successful`, done => {
    const requestLogin = mockPostLoginRequest();

    service.login(mockBodyLogin).then(data => {
      expect(data).toBe(mockedApiResult)
      done();
    })

    httpController
      .expectOne(requestLogin.url)
      .flush(mockedApiResult)
  })
});
