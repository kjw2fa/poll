/**
 * @generated SignedSource<<a9db04b9dd0dbd0c710e041b7ea0ebbb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PermissionType = "EDIT" | "VIEW" | "VOTE" | "%future added value";
export type PollPageQuery$variables = {
  id: string;
};
export type PollPageQuery$data = {
  readonly poll: {
    readonly id: string;
    readonly permissions: ReadonlyArray<{
      readonly permission_type: PermissionType;
      readonly target_id: string | null | undefined;
    }>;
    readonly title: string;
    readonly " $fragmentSpreads": FragmentRefs<"EditPoll_poll" | "PollResults_results" | "Vote_poll">;
  } | null | undefined;
};
export type PollPageQuery = {
  response: PollPageQuery$data;
  variables: PollPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
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
  "name": "permission_type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "target_id",
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "optionText",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PollPageQuery",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "PollPermissions",
            "kind": "LinkedField",
            "name": "permissions",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Vote_poll"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EditPoll_poll"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PollResults_results"
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
    "name": "PollPageQuery",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "PollPermissions",
            "kind": "LinkedField",
            "name": "permissions",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PollOption",
            "kind": "LinkedField",
            "name": "options",
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
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "username",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "VoteRating",
                "kind": "LinkedField",
                "name": "ratings",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PollOption",
                    "kind": "LinkedField",
                    "name": "option",
                    "plural": false,
                    "selections": (v6/*: any*/),
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
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "532c9357f97c55b5a8383080acc146fa",
    "id": null,
    "metadata": {},
    "name": "PollPageQuery",
    "operationKind": "query",
    "text": "query PollPageQuery(\n  $id: ID!\n) {\n  poll(id: $id) {\n    id\n    title\n    permissions {\n      permission_type\n      target_id\n      id\n    }\n    ...Vote_poll\n    ...EditPoll_poll\n    ...PollResults_results\n  }\n}\n\nfragment EditPoll_poll on Poll {\n  id\n  title\n  options {\n    id\n    optionText\n  }\n}\n\nfragment PollResults_results on Poll {\n  votes {\n    user {\n      username\n      id\n    }\n    ratings {\n      option {\n        optionText\n        id\n      }\n      rating\n    }\n    id\n  }\n}\n\nfragment Vote_poll on Poll {\n  id\n  options {\n    id\n    optionText\n  }\n  votes {\n    user {\n      id\n    }\n    ratings {\n      option {\n        id\n      }\n      rating\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "ecb1ef3f4bb654a9f49bf436a39fc985";

export default node;
