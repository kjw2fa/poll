/**
 * @generated SignedSource<<ad18549c18d2f49cbcdc10e0d188d58d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreatePollMutation$variables = {
  options: ReadonlyArray<string | null | undefined>;
  title: string;
  userId: string;
};
export type CreatePollMutation$data = {
  readonly createPoll: {
    readonly pollEdge: {
      readonly cursor: string;
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
      } | null | undefined;
    } | null | undefined;
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v5 = {
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreatePollMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreatePollPayload",
        "kind": "LinkedField",
        "name": "createPoll",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PollEdge",
            "kind": "LinkedField",
            "name": "pollEdge",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Poll",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
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
        "storageKey": null
      }
    ],
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
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreatePollPayload",
        "kind": "LinkedField",
        "name": "createPoll",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PollEdge",
            "kind": "LinkedField",
            "name": "pollEdge",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Poll",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
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
                  }
                ],
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
    "cacheID": "58b5ab24402aa9f1a3e7e3710e51942d",
    "id": null,
    "metadata": {},
    "name": "CreatePollMutation",
    "operationKind": "mutation",
    "text": "mutation CreatePollMutation(\n  $title: String!\n  $options: [String]!\n  $userId: ID!\n) {\n  createPoll(title: $title, options: $options, userId: $userId) {\n    pollEdge {\n      cursor\n      node {\n        id\n        ...PollCard_poll\n      }\n    }\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options\n  permissions {\n    permission_type\n    target_id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6c240da5869747b550fd471d382c5b90";

export default node;
