/**
 * @generated SignedSource<<6d580987de6aeb9155605201c1642185>>
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
v4 = [
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
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v7 = {
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
v8 = [
  (v5/*: any*/)
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
        "args": (v4/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "editPoll",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Vote_poll"
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
        "args": (v4/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "editPoll",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
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
                "selections": (v8/*: any*/),
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
                    "selections": (v8/*: any*/),
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
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b4a67da54fe56bd8fddbd6e4d79ade1d",
    "id": null,
    "metadata": {},
    "name": "EditPollMutation",
    "operationKind": "mutation",
    "text": "mutation EditPollMutation(\n  $pollId: ID!\n  $userId: ID!\n  $title: String!\n  $options: [PollOptionInput!]!\n) {\n  editPoll(pollId: $pollId, userId: $userId, title: $title, options: $options) {\n    id\n    title\n    options {\n      id\n      optionText\n    }\n    ...Vote_poll\n  }\n}\n\nfragment Vote_poll on Poll {\n  id\n  options {\n    id\n    optionText\n  }\n  votes {\n    user {\n      id\n    }\n    ratings {\n      option {\n        id\n      }\n      rating\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "55e7c91c86c6d4420fccee7fe5fb1ae4";

export default node;
