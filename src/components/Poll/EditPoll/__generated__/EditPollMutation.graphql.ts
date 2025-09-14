/**
 * @generated SignedSource<<2cf24ab00187c62351fc5f81a444ad43>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EditPollInput = {
  options: ReadonlyArray<string>;
  pollId: string;
  title: string;
  userId: string;
};
export type EditPollMutation$variables = {
  input: EditPollInput;
  userId: string;
};
export type EditPollMutation$data = {
  readonly editPoll: {
    readonly poll: {
      readonly id: string;
      readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
      readonly title: string | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"Vote_poll">;
    } | null | undefined;
  } | null | undefined;
};
export type EditPollMutation = {
  response: EditPollMutation$data;
  variables: EditPollMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
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
    "name": "input",
    "variableName": "input"
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
  "name": "options",
  "storageKey": null
},
v5 = [
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditPollMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditPollPayload",
        "kind": "LinkedField",
        "name": "editPoll",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditPollMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditPollPayload",
        "kind": "LinkedField",
        "name": "editPoll",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
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
                "args": (v5/*: any*/),
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
    "cacheID": "48fc429b7b520727cc5c9c1d65ca582f",
    "id": null,
    "metadata": {},
    "name": "EditPollMutation",
    "operationKind": "mutation",
    "text": "mutation EditPollMutation(\n  $input: EditPollInput!\n  $userId: ID!\n) {\n  editPoll(input: $input) {\n    poll {\n      id\n      title\n      options\n      ...Vote_poll_1xxw8p\n    }\n  }\n}\n\nfragment Vote_poll_1xxw8p on Poll {\n  options\n  votes(userId: $userId) {\n    option\n    rating\n  }\n}\n"
  }
};
})();

(node as any).hash = "e2d3bcf9a269c106fb37d247145cf0f5";

export default node;
