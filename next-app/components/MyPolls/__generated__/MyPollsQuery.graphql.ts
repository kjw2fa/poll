/**
 * @generated SignedSource<<22e11f01ee663a20957b0cbd8c89363d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PermissionType = "EDIT" | "VIEW" | "VOTE" | "%future added value";
export type MyPollsQuery$variables = {
  permission?: PermissionType | null | undefined;
  userId: string;
};
export type MyPollsQuery$data = {
  readonly user: {
    readonly polls: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
    } | null | undefined> | null | undefined;
    readonly votes: ReadonlyArray<{
      readonly poll: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
      };
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type MyPollsQuery = {
  response: MyPollsQuery$data;
  variables: MyPollsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "permission"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "userId"
  }
],
v3 = [
  {
    "kind": "Variable",
    "name": "permission",
    "variableName": "permission"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  (v4/*: any*/),
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "PollCard_poll"
  }
],
v6 = [
  (v4/*: any*/),
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
    "concreteType": "PollOption",
    "kind": "LinkedField",
    "name": "options",
    "plural": true,
    "selections": [
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "optionText",
        "storageKey": null
      }
    ],
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyPollsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "Poll",
            "kind": "LinkedField",
            "name": "polls",
            "plural": true,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Vote",
            "kind": "LinkedField",
            "name": "votes",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Poll",
                "kind": "LinkedField",
                "name": "poll",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              }
            ],
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "MyPollsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "Poll",
            "kind": "LinkedField",
            "name": "polls",
            "plural": true,
            "selections": (v6/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Vote",
            "kind": "LinkedField",
            "name": "votes",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Poll",
                "kind": "LinkedField",
                "name": "poll",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b7930877d0b68983c95c9767fbd6e6ea",
    "id": null,
    "metadata": {},
    "name": "MyPollsQuery",
    "operationKind": "query",
    "text": "query MyPollsQuery(\n  $userId: ID!\n  $permission: PermissionType\n) {\n  user(id: $userId) {\n    polls(permission: $permission) {\n      id\n      ...PollCard_poll\n    }\n    votes {\n      poll {\n        id\n        ...PollCard_poll\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options {\n    id\n    optionText\n  }\n  permissions {\n    permission_type\n    target_id\n  }\n}\n"
  }
};
})();

(node as any).hash = "4bb4fea4aa450a434ed19252b3464174";

export default node;
