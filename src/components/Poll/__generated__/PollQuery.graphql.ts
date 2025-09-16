/**
 * @generated SignedSource<<49b1682d28aad59336b471b2809b8f7c>>
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
    readonly results: {
      readonly " $fragmentSpreads": FragmentRefs<"PollResults_results">;
    } | null | undefined;
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
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "option",
  "storageKey": null
},
v7 = [
  (v6/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "averageRating",
    "storageKey": null
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
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PollResult",
            "kind": "LinkedField",
            "name": "results",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PollResults_results"
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
            "concreteType": "PollOption",
            "kind": "LinkedField",
            "name": "options",
            "plural": true,
            "selections": [
              (v2/*: any*/),
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
            "args": (v5/*: any*/),
            "concreteType": "Vote",
            "kind": "LinkedField",
            "name": "votes",
            "plural": true,
            "selections": [
              (v6/*: any*/),
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
          {
            "alias": null,
            "args": null,
            "concreteType": "PollResult",
            "kind": "LinkedField",
            "name": "results",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "pollTitle",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "totalVotes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "voters",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "WinningOption",
                "kind": "LinkedField",
                "name": "results",
                "plural": true,
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "WinningOption",
                "kind": "LinkedField",
                "name": "allAverageRatings",
                "plural": true,
                "selections": (v7/*: any*/),
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
    "cacheID": "dde14e91980b593ed37072fc9080dc45",
    "id": null,
    "metadata": {},
    "name": "PollQuery",
    "operationKind": "query",
    "text": "query PollQuery(\n  $id: ID!\n  $userId: ID!\n) {\n  poll(id: $id) {\n    id\n    title\n    permissions {\n      permission_type\n      target_id\n    }\n    ...Vote_poll_1xxw8p\n    ...EditPoll_poll\n    results {\n      ...PollResults_results\n    }\n  }\n}\n\nfragment EditPoll_poll on Poll {\n  id\n  title\n  options {\n    id\n    optionText\n  }\n}\n\nfragment PollResults_results on PollResult {\n  pollTitle\n  totalVotes\n  voters\n  results {\n    option\n    averageRating\n  }\n  allAverageRatings {\n    option\n    averageRating\n  }\n}\n\nfragment Vote_poll_1xxw8p on Poll {\n  id\n  options {\n    id\n    optionText\n  }\n  votes(userId: $userId) {\n    option\n    rating\n  }\n}\n"
  }
};
})();

(node as any).hash = "77c4f9a71e449a11837d81b0e7fcdb22";

export default node;
