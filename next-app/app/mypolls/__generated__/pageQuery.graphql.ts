/**
 * @generated SignedSource<<e8f0605013be564092a4d95d191000a4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PermissionType = "EDIT" | "VIEW" | "VOTE" | "%future added value";
export type pageQuery$variables = {
  permission?: PermissionType | null | undefined;
  userId: string;
};
export type pageQuery$data = {
  readonly user: {
    readonly polls: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
    }>;
  } | null | undefined;
};
export type pageQuery = {
  response: pageQuery$data;
  variables: pageQuery$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageQuery",
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
            "selections": [
              (v4/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PollCard_poll"
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
    "name": "pageQuery",
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
            "selections": [
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
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
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
    "cacheID": "ccf7bafa49737f7ef2d016efcf75de62",
    "id": null,
    "metadata": {},
    "name": "pageQuery",
    "operationKind": "query",
    "text": "query pageQuery(\n  $userId: ID!\n  $permission: PermissionType\n) {\n  user(id: $userId) {\n    polls(permission: $permission) {\n      id\n      ...PollCard_poll\n    }\n    id\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options {\n    id\n    optionText\n  }\n  permissions {\n    permission_type\n    target_id\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7367af2596c41d95858b9a06a6b2a9b8";

export default node;
