/**
 * @generated SignedSource<<a49d9c852e098f6f4567a364c3c79293>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Vote_poll$data = {
  readonly id: string;
  readonly options: ReadonlyArray<{
    readonly id: string;
    readonly optionText: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly votes: ReadonlyArray<{
    readonly ratings: ReadonlyArray<{
      readonly option: {
        readonly id: string;
      };
      readonly rating: number;
    }> | null | undefined;
    readonly user: {
      readonly id: string;
    };
  } | null | undefined> | null | undefined;
  readonly " $fragmentType": "Vote_poll";
};
export type Vote_poll$key = {
  readonly " $data"?: Vote_poll$data;
  readonly " $fragmentSpreads": FragmentRefs<"Vote_poll">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Vote_poll",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "PollOption",
      "kind": "LinkedField",
      "name": "options",
      "plural": true,
      "selections": [
        (v0/*: any*/),
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
          "selections": (v1/*: any*/),
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
              "selections": (v1/*: any*/),
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
  "type": "Poll",
  "abstractKey": null
};
})();

(node as any).hash = "1dfa4e6bcc67bf3f8f903d131b7c424b";

export default node;
