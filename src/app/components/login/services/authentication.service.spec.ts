import { TestBed } from '@angular/core/testing';
import { mockBodyRegister, mockBodyLogin } from 'src/domain/test/mock-account';
import { AuthenticationService } from './authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountModel } from 'src/domain/models/account-model';

const mockedApi: AccountModel = {
  accessToken: 'as1d3a1sa3s2d1',
  user: {
    email: 'email@example.com',
    password: '123456',
    firstname: 'fakeName',
    id: '1'
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

  it(`# Should call the verifyAllField function before the HttpPostClient`, done => {
    const url = 'http://localhost:3000/users'

    service.register(mockBodyRegister).subscribe(response => {
      done();
    })

    expect(service.checkedFields).toBeTrue();

    httpController
      .expectOne(url)
      .flush(mockedApi)
  })

  it(`#${AuthenticationService.prototype.register} Should return the user and accessToken if the registration is successful`, done => {
    const url = 'http://localhost:3000/users'
    service.register(mockBodyRegister).subscribe(response => {
      expect(response).toBe(mockedApi)
      done();
    })

    httpController
      .expectOne(url)
      .flush(mockedApi)
  })
});
