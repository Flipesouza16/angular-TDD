import { TestBed } from '@angular/core/testing';
import { HttpPostClientSpy } from 'src/data/test/mock-http-client';
import { RemoteAuthentication } from 'src/data/useCases/remote-authentication';
import { AccountModel } from 'src/domain/models/account-model';
import { mockBodyRegister, mockBodyLogin } from 'src/domain/test/mock-account';
import { AuthenticationParams } from 'src/domain/useCases/authentication';
import { AuthenticationService } from './authentication.service';

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

type CheckedFieldsType = {
  isAllFieldsFilledAndValidated: boolean
  fieldInvalid: string
}

const makeSut = (url: string): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);
  return {
    sut,
    httpPostClientSpy
  }
}

const verifyAllFields = (service: AuthenticationService, mockBody: typeof mockBodyLogin | typeof mockBodyRegister, isLogin = false): CheckedFieldsType => {
  let fieldInvalid: any;
  let isNameFilled
  let isValidEmail
  let isPasswordStrengthGood
  let name: string | undefined;
  let { email, password } = mockBody;

  if(!isLogin) {
    const { firstname } = mockBody;
    name = firstname;
  }

  !isLogin && name?.length ? isNameFilled = true : isNameFilled = name;
  service.validateEmail(email) ? isValidEmail = true : fieldInvalid = email;
  service.validatePassowrdStrength(password) ? isPasswordStrengthGood = true : fieldInvalid = password;

  const listOfFields = [
    isNameFilled, isValidEmail, isPasswordStrengthGood
  ]
  if(isLogin) {
    listOfFields.shift();
  }

  let isAllFieldsFilledAndValidated = true;
  listOfFields.forEach(field => { if(!field) isAllFieldsFilledAndValidated = false } );

  return {
    isAllFieldsFilledAndValidated,
    fieldInvalid
  }
}

describe(`#${AuthenticationService.name}`, () => {
  let service: AuthenticationService;

  beforeEach(() => {
    service = TestBed.inject(AuthenticationService);
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

  it(`#${AuthenticationService.prototype.register} Should return true if all field are filled and validated`, () => {
    const { fieldInvalid, isAllFieldsFilledAndValidated } = verifyAllFields(service, mockBodyRegister);
    expect(isAllFieldsFilledAndValidated)
      .withContext(`The value ${fieldInvalid} is invalid`)
      .toBeTrue();
  })

  it(`#${AuthenticationService.prototype.login} Should return true if all field are filled and validated`, () => {
    const { fieldInvalid, isAllFieldsFilledAndValidated } = verifyAllFields(service, mockBodyLogin, true);
    expect(isAllFieldsFilledAndValidated)
      .withContext(`The value ${fieldInvalid} is invalid`)
      .toBeTrue();
  })
});
