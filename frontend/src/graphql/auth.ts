import { gql, type TypedDocumentNode } from "@apollo/client";
import type { AuthPayload, User } from "./types";

const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    createdAt
  }
`;

export const ME: TypedDocumentNode<{ me: User }> = gql`
  query Me {
    me {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const SIGN_IN: TypedDocumentNode<
  { signIn: AuthPayload },
  { input: { email: string; password: string } }
> = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const SIGN_UP: TypedDocumentNode<
  { signUp: AuthPayload },
  { input: { name: string; email: string; password: string } }
> = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const UPDATE_PROFILE: TypedDocumentNode<{ updateProfile: User }, { input: { name: string } }> = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

/** Operações em que UNAUTHENTICATED significa "credenciais erradas", não "sessão expirada". */
export const PUBLIC_OPERATIONS = new Set(["SignIn", "SignUp"]);
