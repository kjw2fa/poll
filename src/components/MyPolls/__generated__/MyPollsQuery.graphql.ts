/**
 * @generated SignedSource<<a2c52b94e2b0dadf140591c54d53e529>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MyPollsQuery$variables = {
  userId: string;
};
export type MyPollsQuery$data = {
  readonly myPolls: {
    readonly createdPolls: ReadonlyArray<{
      readonly creator: {
        readonly username: string | null | undefined;
      } | null | undefined;
      readonly id: string | null | undefined;
      readonly title: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly votedPolls: ReadonlyArray<{
      readonly creator: {
        readonly username: string | null | undefined;
      } | null | undefined;
      readonly id: string | null | undefined;
      readonly title: string | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type MyPollsQuery = {
  response: MyPollsQuery$data;
  variables: MyPollsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
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
  "name": "username",
  "storageKey": null
},
v5 = [
  (v2/*: any*/),
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "creator",
    "plural": false,
    "selections": [
      (v4/*: any*/)
    ],
    "storageKey": null
  }
],
v6 = [
  (v2/*: any*/),
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "creator",
    "plural": false,
    "selections": [
      (v4/*: any*/),
      (v2/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyPollsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyPolls",
        "kind": "LinkedField",
        "name": "myPolls",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Poll",
            "kind": "LinkedField",
            "name": "createdPolls",
            "plural": true,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Poll",
            "kind": "LinkedField",
            "name": "votedPolls",
            "plural": true,
            "selections": (v5/*: any*/),
            "storageKey": null
          }
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
    "name": "MyPollsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyPolls",
        "kind": "LinkedField",
        "name": "myPolls",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Poll",
            "kind": "LinkedField",
            "name": "createdPolls",
            "plural": true,
            "selections": (v6/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Poll",
            "kind": "LinkedField",
            "name": "votedPolls",
            "plural": true,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4c74e5165399312d5352eaefb3141f9c",
    "id": null,
    "metadata": {},
    "name": "MyPollsQuery",
    "operationKind": "query",
    "text": "query MyPollsQuery(\n  $userId: ID!\n) {\n  myPolls(userId: $userId) {\n    createdPolls {\n      id\n      title\n      creator {\n        username\n        id\n      }\n    }\n    votedPolls {\n      id\n      title\n      creator {\n        username\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c0e670664ef3fff7b3b45afee92157ac";

export default node;
