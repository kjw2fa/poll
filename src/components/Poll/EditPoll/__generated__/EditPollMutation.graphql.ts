/**
 * @generated SignedSource<<6c89b98a74f840ea1c1d1a058a7f6339>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PollOptionInput = {
  id?: string | null | undefined;
  optionText: string;
};
export type EditPollMutation$variables = {
  options: ReadonlyArray<PollOptionInput>;
  pollId: string;
  title: string;
  userId: string;
};
export type EditPollMutation$data = {
  readonly editPoll: {
    readonly id: string;
    readonly options: ReadonlyArray<{
      readonly id: string;
      readonly optionText: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly results: {
      readonly " $fragmentSpreads": FragmentRefs<"PollResults_results">;
    } | null | undefined;
    readonly title: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"Vote_poll">;
  } | null | undefined;
};
export type EditPollMutation = {
  response: EditPollMutation$data;
  variables: EditPollMutation$variables;
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
  "name": "pollId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v4 = {
  "kind": "Variable",
  "name": "userId",
  "variableName": "userId"
},
v5 = [
  {
    "kind": "Variable",
    "name": "options",
    "variableName": "options"
  },
  {
    "kind": "Variable",
    "name": "pollId",
    "variableName": "pollId"
  },
  {
    "kind": "Variable",
    "name": "title",
    "variableName": "title"
  },
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "PollOption",
  "kind": "LinkedField",
  "name": "options",
  "plural": true,
  "selections": [
    (v6/*: any*/),
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
v9 = [
  (v4/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "option",
  "storageKey": null
},
v11 = [
  (v10/*: any*/),
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "EditPollMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "editPoll",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "args": (v9/*: any*/),
            "kind": "FragmentSpread",
            "name": "Vote_poll"
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
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "EditPollMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "editPoll",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "Vote",
            "kind": "LinkedField",
            "name": "votes",
            "plural": true,
            "selections": [
              (v10/*: any*/),
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
                "selections": (v11/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "WinningOption",
                "kind": "LinkedField",
                "name": "allAverageRatings",
                "plural": true,
                "selections": (v11/*: any*/),
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
    "cacheID": "583ea782872c03426716de3b9d8fb5c0",
    "id": null,
    "metadata": {},
    "name": "EditPollMutation",
    "operationKind": "mutation",
    "text": "mutation EditPollMutation(\n  $pollId: ID!\n  $userId: ID!\n  $title: String!\n  $options: [PollOptionInput!]!\n) {\n  editPoll(pollId: $pollId, userId: $userId, title: $title, options: $options) {\n    id\n    title\n    options {\n      id\n      optionText\n    }\n    ...Vote_poll_1xxw8p\n    results {\n      ...PollResults_results\n    }\n  }\n}\n\nfragment PollResults_results on PollResult {\n  pollTitle\n  totalVotes\n  voters\n  results {\n    option\n    averageRating\n  }\n  allAverageRatings {\n    option\n    averageRating\n  }\n}\n\nfragment Vote_poll_1xxw8p on Poll {\n  id\n  options {\n    id\n    optionText\n  }\n  votes(userId: $userId) {\n    option\n    rating\n  }\n}\n"
  }
};
})();

(node as any).hash = "3c3252842db5f410eab4b98ab846eb2f";

export default node;
