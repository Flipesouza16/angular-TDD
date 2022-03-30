import { mockBodyLogin, mockBodyRegister } from "src/domain/test/mock-account";
import { environment } from "src/environments/environment";
import { HttpPostParams } from "../protocols/http/http-post-client";

export const mockPostRegisterRequest = (): HttpPostParams<any> => ({
  url: environment.BASE_URL + '/users',
  body: mockBodyRegister,
});

export const mockPostLoginRequest = (): HttpPostParams<any> => ({
  url: environment.BASE_URL + '/login',
  body: mockBodyLogin,
});
