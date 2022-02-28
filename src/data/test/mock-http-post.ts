import { mockBodyRegister } from "src/domain/test/mock-account";
import { HttpPostParams } from "../protocols/http/http-post-client";

export const mockPostRequest = (): HttpPostParams<any> => ({
  url: 'urlfake/users',
  body: mockBodyRegister,
});
