import { Injectable } from '@angular/core';
import { AuthenticationParams } from 'src/domain/useCases/authentication';
import { CheckedFieldsType } from '../interfaces/authentication-validation';
import { HttpClientService } from 'src/infra/http-client-service';

enum AuthenticationFields {
  firstName = 'firstname',
  email = 'email',
  password = 'password',
  id = 'id'
}

type FullValidationRequirements = {
  [key: string]: Function
}

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  public authentication: AuthenticationParams = {
    email: '',
    password: '',
  };
  public endPoint = {
    login: '/login',
    register: '/users'
  };
  public checkedFields = false;

  constructor(private httpClientService: HttpClientService) {}

  async login(params: AuthenticationParams): Promise<any> {
    const { fieldInvalid, isAllFieldsFilledAndValidated } = this.verifyAllField(params);
    if(isAllFieldsFilledAndValidated) {
      const { body } = await this.httpClientService.post({ url: this.endPoint.login, body: params });
      return body;
    } else {
      throw Error(fieldInvalid);
    }
  }

  async register(params: AuthenticationParams): Promise<any> {
    const { fieldInvalid, isAllFieldsFilledAndValidated } = this.verifyAllField(params);
    if(isAllFieldsFilledAndValidated) {
      const { body } = await this.httpClientService.post({ url: this.endPoint.register, body: params });
      return body;
    } else {
      throw Error(fieldInvalid);
    }
  }

  verifyAllField(params: AuthenticationParams): CheckedFieldsType {
    let fieldInvalid: any;
    let isAllFieldsFilledAndValidated = true;

    for(const typeField of Object.keys(params)) {
      if(typeField === AuthenticationFields.firstName && !params.firstname?.length) {
        fieldInvalid = AuthenticationFields.firstName;
      } else if(typeField === AuthenticationFields.email && !this.validateEmail(params.email)) {
        fieldInvalid = AuthenticationFields.email;
      } else if(typeField === AuthenticationFields.password && !this.validatePassowrdStrength(params.password)) {
        fieldInvalid = AuthenticationFields.password;
      }
      if(fieldInvalid) isAllFieldsFilledAndValidated = false;
    }

    this.checkedFields = true;

    return {
      isAllFieldsFilledAndValidated,
      fieldInvalid
    }
  }

  validateEmail(email: string): boolean {
    var regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }

  validatePassowrdStrength(password: string): boolean {
    var mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    return mediumRegex.test(password);
  }

  fullValidationRequirements(password: string) {
    return {
      atLeast1Lowercase: () => {
        const regex = /(?=.*[a-z])/;
        return regex.test(password);
      },
      atLeast1Uppercase: () => {
        const regex = /(?=.*[A-Z])/;
        return regex.test(password);
      },
      atLeast1numeric: () => {
        const regex = /(?=.*[0-9])/;
        return regex.test(password);
      },
      atLeast1Special: () => {
        const regex = /(?=.*[!@#$%^&*])/;
        return regex.test(password);
      },
      mustBe8CharactersOrLonger: () => {
        const regex = /(?=.{8,})/;
        return regex.test(password);
      },
    } as FullValidationRequirements;
  }
}
