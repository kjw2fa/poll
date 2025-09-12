/**
 * @generated SignedSource<<beb322dc8908f7bfa54cf3fb79680796>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PermissionType = "EDIT" | "VIEW" | "VOTE" | "%future added value";
export type PollQuery$variables = {
  id: string;
  userId: string;
};
export type PollQuery$data = {
  readonly poll: {
    readonly id: string;
    readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
    readonly permissions: ReadonlyArray<{
      readonly permission_type: PermissionType | null | undefined;
      readonly target_id: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly title: string | null | undefined;
    readonly votes: ReadonlyArray<{
      readonly option: string | null | undefined;
      readonly rating: number | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type PollQuery = {
  response: PollQuery$data;
  variables: PollQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Poll",
    "kind": "LinkedField",
    "name": "poll",
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
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "options",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "PollPermissions",
        "kind": "LinkedField",
        "name": "permissions",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "permission_type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "target_id",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "userId",
            "variableName": "userId"
          }
        ],
        "concreteType": "Vote",
        "kind": "LinkedField",
        "name": "votes",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "option",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "rating",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PollQuery",
    "selections": (v1/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PollQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1a3aaea8635bc22610a5e9dc0279e9ba",
    "id": null,
    "metadata": {},
    "name": "PollQuery",
    "operationKind": "query",
    "text": "query PollQuery(\n  $id: ID!\n  $userId: ID!\n) {\n  poll(id: $id) {\n    id\n    title\n    options\n    permissions {\n      permission_type\n      target_id\n    }\n    votes(userId: $userId) {\n      option\n      rating\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9bbd014283e993203e8155058e58989a";

export default node;
