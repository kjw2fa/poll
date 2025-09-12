/**
 * @generated SignedSource<<5d8efd3bcaa1c3d45ed9f870b616c836>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PermissionType = "EDIT" | "VIEW" | "VOTE" | "%future added value";
export type PollQuery$variables = {
  id: string;
  userId: string;
};
export type PollQuery$data = {
  readonly poll: {
    readonly id: string;
    readonly permissions: ReadonlyArray<{
      readonly permission_type: PermissionType | null | undefined;
      readonly target_id: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly title: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"EditPoll_poll" | "Vote_poll">;
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
v5 = [
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
  }
];
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
            "args": (v5/*: any*/),
            "kind": "FragmentSpread",
            "name": "Vote_poll"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EditPoll_poll"
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
            "kind": "ScalarField",
            "name": "options",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "cadf0be9a7a65d25309b4fbaed84f95b",
    "id": null,
    "metadata": {},
    "name": "PollQuery",
    "operationKind": "query",
    "text": "query PollQuery(\n  $id: ID!\n  $userId: ID!\n) {\n  poll(id: $id) {\n    id\n    title\n    permissions {\n      permission_type\n      target_id\n    }\n    ...Vote_poll_1xxw8p\n    ...EditPoll_poll\n  }\n}\n\nfragment EditPoll_poll on Poll {\n  id\n  title\n  options\n}\n\nfragment Vote_poll_1xxw8p on Poll {\n  options\n  votes(userId: $userId) {\n    option\n    rating\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d0f00be91aac2fe5f21b619844dafc0";

export default node;
