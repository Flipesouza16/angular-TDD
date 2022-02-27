import { AccountModel } from "../models/account-model";
import { AuthenticationParams } from "../useCases/authentication";

export const mockBodyLogin: AuthenticationParams = {
  email: 'emailFake@example.com',
  password: '123456asd1s'
};

export const mockBodyRegister: AuthenticationParams = {
  ...mockBodyLogin,
  firstname: 'fakeName',
};

export const httpResult: AccountModel = {
  accessToken: '12213asdasd13311233',
  user: {
    ...mockBodyRegister,
    id: '1'
  }
}
