/**
 * @generated SignedSource<<38d7bbde51f311380fc5a141ed7197d9>>
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
    readonly id: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
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
            "name": "PollCard_poll"
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
    ]
  },
  "params": {
    "cacheID": "b34f940595e0a0c9714d487968cba988",
    "id": null,
    "metadata": {},
    "name": "VoteSubmitVoteMutation",
    "operationKind": "mutation",
    "text": "mutation VoteSubmitVoteMutation(\n  $pollId: ID!\n  $userId: ID!\n  $ratings: [RatingInput!]!\n) {\n  submitVote(pollId: $pollId, userId: $userId, ratings: $ratings) {\n    id\n    ...PollCard_poll\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options\n  permissions {\n    permission_type\n    target_id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e339321153a4e05fd65d9ad187f79398";

export default node;
