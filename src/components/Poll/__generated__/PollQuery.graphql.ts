/**
 * @generated SignedSource<<162b6c63213ef83b00955d691f7b9fd1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PollQuery$variables = {
  id: string;
  userId: string;
};
export type PollQuery$data = {
  readonly poll: {
    readonly creator: {
      readonly username: string | null | undefined;
    } | null | undefined;
    readonly id: string | null | undefined;
    readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
    readonly permissions: {
      readonly canEdit: boolean | null | undefined;
    } | null | undefined;
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
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "options",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v6 = [
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
  }
],
v7 = {
  "alias": null,
  "args": (v6/*: any*/),
  "concreteType": "Permissions",
  "kind": "LinkedField",
  "name": "permissions",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "canEdit",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": (v6/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PollQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "poll",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "creator",
            "plural": false,
            "selections": [
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PollQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "poll",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "creator",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "00bea32ee9d3a7eb233c3a0f78f99cab",
    "id": null,
    "metadata": {},
    "name": "PollQuery",
    "operationKind": "query",
    "text": "query PollQuery(\n  $id: ID!\n  $userId: ID!\n) {\n  poll(id: $id) {\n    id\n    title\n    options\n    creator {\n      username\n      id\n    }\n    permissions(userId: $userId) {\n      canEdit\n    }\n    votes(userId: $userId) {\n      option\n      rating\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7e5612a339304c887b0e521d25bbac96";

export default node;
