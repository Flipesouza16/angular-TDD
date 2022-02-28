import { Injectable } from '@angular/core';
import { AuthenticationParams } from 'src/domain/useCases/authentication';
import { CheckedFieldsType } from '../interfaces/authentication-validation';
import { HttpClientService } from 'src/infra/http-client-service';
import { Observable } from 'rxjs';

enum AuthenticationFields {
  firstName = 'firstname',
  email = 'email',
  password = 'password',
  id = 'id'
}
@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  authentication: AuthenticationParams = {
    email: '',
    password: '',
  };
  endPoint = 'http://localhost:3000/users'

  checkedFields = false;

  constructor(private httpClientService: HttpClientService) {}

  login() {}

  register(params: AuthenticationParams): Observable<any> {
    const { fieldInvalid, isAllFieldsFilledAndValidated } = this.verifyAllField(params);
    if(isAllFieldsFilledAndValidated) {
      return this.httpClientService.post({ url: this.endPoint, body: params });
    } else {
      throw Error(fieldInvalid)
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
}
