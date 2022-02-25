import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

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

  it(`#${AuthenticationService.prototype.validatePassowrdStrength} Should return true if password strentgh is good`, () => {
    const listOfPasswords = [
      'senha123',
      'A123456',
      '/*123456a',
    ];
    listOfPasswords.forEach(password => {
      const isPassordStrengthGood = service.validatePassowrdStrength(password);
      expect(isPassordStrengthGood)
        .withContext(`Password strentgh ${password} is week`)
        .toBeTrue();
    })
  });

  it(`#${AuthenticationService.prototype.validatePassowrdStrength} Should return false if password strentgh is week`, () => {
    const listOfPasswords = [
      'senhaasdasd',
      '123456',
      '/*123',
    ];
    listOfPasswords.forEach(password => {
      const isPassordStrengthGood = service.validatePassowrdStrength(password);
      expect(isPassordStrengthGood)
        .withContext(`Password strentgh ${password} is good`)
        .toBeFalse();
    })
  });

});
