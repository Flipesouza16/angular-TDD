import { AuthenticationParams } from "../useCases/authentication";

export type AccountModel = {
  accessToken: string
  user: AuthenticationParams
};
