import { Injectable } from '@angular/core';
import { Authentication } from '../interfaces/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authentication: Authentication = {
    email: '',
    password: ''
  }

  constructor() { }

  login() {}

  register() {}

  validateEmail(email: string): boolean {
    var regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }
}
