/**
 * @generated SignedSource<<85e5c7cceb337f35d228193d4588a863>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PollResults_results$data = {
  readonly votes: ReadonlyArray<{
    readonly ratings: ReadonlyArray<{
      readonly option: {
        readonly optionText: string;
      };
      readonly rating: number;
    }>;
    readonly user: {
      readonly username: string;
    };
  }>;
  readonly " $fragmentType": "PollResults_results";
};
export type PollResults_results$key = {
  readonly " $data"?: PollResults_results$data;
  readonly " $fragmentSpreads": FragmentRefs<"PollResults_results">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PollResults_results",
  "selections": [
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
              "selections": [
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

(node as any).hash = "7c0c6b2b1625b6a64492caabed22c2bf";

export default node;
