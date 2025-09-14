/**
 * @generated SignedSource<<f13c126d61cd1b0c1231262af31aad40>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PollResults_results$data = {
  readonly allAverageRatings: ReadonlyArray<{
    readonly averageRating: number | null | undefined;
    readonly option: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly pollTitle: string | null | undefined;
  readonly results: ReadonlyArray<{
    readonly averageRating: number | null | undefined;
    readonly option: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly totalVotes: number | null | undefined;
  readonly voters: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly " $fragmentType": "PollResults_results";
};
export type PollResults_results$key = {
  readonly " $data"?: PollResults_results$data;
  readonly " $fragmentSpreads": FragmentRefs<"PollResults_results">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
    "name": "averageRating",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PollResults_results",
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
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "WinningOption",
      "kind": "LinkedField",
      "name": "allAverageRatings",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "PollResult",
  "abstractKey": null
};
})();

(node as any).hash = "4e5d8545bb8b43dc3fb9a67c129ea354";

export default node;
