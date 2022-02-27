import { AccountModel } from "../models/account-model";
import { AuthenticationParams } from "../useCases/authentication";

export const mockBodyRegister: AuthenticationParams = {
  firstname: 'nameFake',
  email: 'emailFake@example.com',
  password: '123456'
};

export const mockBodyLogin: AuthenticationParams = {
  email: 'emailFake@example.com',
  password: '123456'
};

export const httpResult: AccountModel = {
  accessToken: '12213asdasd13311233',
  user: {
    firstname: 'nameFake',
    email: 'emailFake@example.com',
    password: '123456',
    id: '1'
  }
}
