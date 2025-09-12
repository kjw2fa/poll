/**
 * @generated SignedSource<<07e71d7ad3c64098656f28ce31700cfc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RatingInput = {
  option: string;
  rating: number;
};
export type VoteSubmitVoteMutation$variables = {
  pollId: string;
  ratings: ReadonlyArray<RatingInput>;
  userId: string;
};
export type VoteSubmitVoteMutation$data = {
  readonly submitVote: {
    readonly pollEdge: {
      readonly cursor: string;
      readonly node: {
        readonly id: string;
        readonly votes: ReadonlyArray<{
          readonly option: string | null | undefined;
          readonly rating: number | null | undefined;
        } | null | undefined> | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
      } | null | undefined;
    } | null | undefined;
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
v3 = {
  "kind": "Variable",
  "name": "userId",
  "variableName": "userId"
},
v4 = [
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
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": [
    (v3/*: any*/)
  ],
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
        "args": (v4/*: any*/),
        "concreteType": "SubmitVotePayload",
        "kind": "LinkedField",
        "name": "submitVote",
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
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Poll",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PollCard_poll"
                  },
                  (v7/*: any*/)
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "VoteSubmitVoteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "SubmitVotePayload",
        "kind": "LinkedField",
        "name": "submitVote",
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
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Poll",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
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
                  },
                  (v7/*: any*/)
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
    "cacheID": "7969b289cfa37d12dd71b30b57e5a0b3",
    "id": null,
    "metadata": {},
    "name": "VoteSubmitVoteMutation",
    "operationKind": "mutation",
    "text": "mutation VoteSubmitVoteMutation(\n  $pollId: ID!\n  $userId: ID!\n  $ratings: [RatingInput!]!\n) {\n  submitVote(pollId: $pollId, userId: $userId, ratings: $ratings) {\n    pollEdge {\n      cursor\n      node {\n        id\n        ...PollCard_poll\n        votes(userId: $userId) {\n          option\n          rating\n        }\n      }\n    }\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options\n  permissions {\n    permission_type\n    target_id\n  }\n}\n"
  }
};
})();

(node as any).hash = "94b356422a215fd702e0d147b99d2be1";

export default node;
