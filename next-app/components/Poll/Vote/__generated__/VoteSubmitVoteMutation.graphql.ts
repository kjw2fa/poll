/**
 * @generated SignedSource<<544543883cd155921d3bfff825fecd16>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type VoteRatingInput = {
  optionId: string;
  rating: number;
};
export type VoteSubmitVoteMutation$variables = {
  pollId: string;
  ratings: ReadonlyArray<VoteRatingInput>;
  userId: string;
};
export type VoteSubmitVoteMutation$data = {
  readonly submitVote: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"PollResults_results">;
  } | null | undefined;
};
export type VoteSubmitVoteMutation = {
  response: VoteSubmitVoteMutation$data;
  variables: VoteSubmitVoteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pollId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "ratings"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "pollId",
    "variableName": "pollId"
  },
  {
    "kind": "Variable",
    "name": "ratings",
    "variableName": "ratings"
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
    "name": "VoteSubmitVoteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "submitVote",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PollResults_results"
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "VoteSubmitVoteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "submitVote",
        "plural": false,
        "selections": [
          (v4/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "username",
                    "storageKey": null
                  },
                  (v4/*: any*/)
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
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "optionText",
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
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
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4463c6829410657d9e1c986e17bba511",
    "id": null,
    "metadata": {},
    "name": "VoteSubmitVoteMutation",
    "operationKind": "mutation",
    "text": "mutation VoteSubmitVoteMutation(\n  $pollId: ID!\n  $userId: ID!\n  $ratings: [VoteRatingInput!]!\n) {\n  submitVote(pollId: $pollId, userId: $userId, ratings: $ratings) {\n    id\n    ...PollResults_results\n  }\n}\n\nfragment PollResults_results on Poll {\n  votes {\n    user {\n      username\n      id\n    }\n    ratings {\n      option {\n        optionText\n        id\n      }\n      rating\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "036958bf2dc07c26f4252d65db98a0e3";

export default node;
