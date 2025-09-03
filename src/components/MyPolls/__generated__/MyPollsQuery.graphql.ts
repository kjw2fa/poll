/**
 * @generated SignedSource<<98cd9712524b56c20b2b1a83c028132a>>
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
        readonly name: string | null | undefined;
      } | null | undefined;
      readonly id: string | null | undefined;
      readonly title: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly votedPolls: ReadonlyArray<{
      readonly creator: {
        readonly name: string | null | undefined;
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
  "name": "name",
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
    "cacheID": "b767327eeaed98ab48be0b97057dc8b2",
    "id": null,
    "metadata": {},
    "name": "MyPollsQuery",
    "operationKind": "query",
    "text": "query MyPollsQuery(\n  $userId: ID!\n) {\n  myPolls(userId: $userId) {\n    createdPolls {\n      id\n      title\n      creator {\n        name\n        id\n      }\n    }\n    votedPolls {\n      id\n      title\n      creator {\n        name\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "11fbee9e1f2445de547081bcd840c919";

export default node;
