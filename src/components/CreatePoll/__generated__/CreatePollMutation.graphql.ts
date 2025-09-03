/**
 * @generated SignedSource<<97f224a0c7b88404453b5f2d7c33a715>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreatePollMutation$variables = {
  options: ReadonlyArray<string | null | undefined>;
  title: string;
  userId: string;
};
export type CreatePollMutation$data = {
  readonly createPoll: {
    readonly id: string | null | undefined;
  } | null | undefined;
};
export type CreatePollMutation = {
  response: CreatePollMutation$data;
  variables: CreatePollMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "options"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "options",
        "variableName": "options"
      },
      {
        "kind": "Variable",
        "name": "title",
        "variableName": "title"
      },
      {
        "kind": "Variable",
        "name": "userId",
        "variableName": "userId"
      }
    ],
    "concreteType": "Poll",
    "kind": "LinkedField",
    "name": "createPoll",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "CreatePollMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreatePollMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "84c9d7145487eb2599c8219f88bd5d35",
    "id": null,
    "metadata": {},
    "name": "CreatePollMutation",
    "operationKind": "mutation",
    "text": "mutation CreatePollMutation(\n  $title: String!\n  $options: [String]!\n  $userId: ID!\n) {\n  createPoll(title: $title, options: $options, userId: $userId) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "343352b26fc2b5fc8fcc097d69bdd2ea";

export default node;
