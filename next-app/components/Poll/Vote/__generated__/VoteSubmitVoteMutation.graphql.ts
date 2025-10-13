/**
 * @generated SignedSource<<e5b134241ab185937adb0bcd776e9615>>
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
    readonly pollEdge: {
      readonly cursor: string;
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
      };
    };
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
    "name": "VoteSubmitVoteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
                    "concreteType": "PollOption",
                    "kind": "LinkedField",
                    "name": "options",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
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
                      (v5/*: any*/)
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
    "cacheID": "6c6991670aa5ff2b3bc2a0e817dd8f41",
    "id": null,
    "metadata": {},
    "name": "VoteSubmitVoteMutation",
    "operationKind": "mutation",
    "text": "mutation VoteSubmitVoteMutation(\n  $pollId: ID!\n  $userId: ID!\n  $ratings: [VoteRatingInput!]!\n) {\n  submitVote(pollId: $pollId, userId: $userId, ratings: $ratings) {\n    pollEdge {\n      cursor\n      node {\n        id\n        ...PollCard_poll\n      }\n    }\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options {\n    id\n    optionText\n  }\n  permissions {\n    permission_type\n    target_id\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "24419b27055ea7e6d75a701b91e39e2b";

export default node;
