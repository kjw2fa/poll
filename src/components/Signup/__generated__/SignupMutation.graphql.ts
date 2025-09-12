/**
 * @generated SignedSource<<5af911af1a05f38e614124abdde3c0d2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SignupMutation$variables = {
  email: string;
  password: string;
  username: string;
};
export type SignupMutation$data = {
  readonly signup: {
    readonly id: string;
    readonly username: string | null | undefined;
  } | null | undefined;
};
export type SignupMutation = {
  response: SignupMutation$data;
  variables: SignupMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "username"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "password",
        "variableName": "password"
      },
      {
        "kind": "Variable",
        "name": "username",
        "variableName": "username"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "signup",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "username",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SignupMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "SignupMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "e6e7612fda144db851c13146202102bc",
    "id": null,
    "metadata": {},
    "name": "SignupMutation",
    "operationKind": "mutation",
    "text": "mutation SignupMutation(\n  $username: String!\n  $email: String!\n  $password: String!\n) {\n  signup(username: $username, email: $email, password: $password) {\n    id\n    username\n  }\n}\n"
  }
};
})();

(node as any).hash = "834ea386638e18a8d03fcce6fc278328";

export default node;
