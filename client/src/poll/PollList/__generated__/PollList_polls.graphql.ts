/**
 * @generated SignedSource<<6b94d1c10d8b47d531f380ab446f8069>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PollList_polls$data = ReadonlyArray<{
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
  readonly " $fragmentType": "PollList_polls";
}>;
export type PollList_polls$key = ReadonlyArray<{
  readonly " $data"?: PollList_polls$data;
  readonly " $fragmentSpreads": FragmentRefs<"PollList_polls">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "PollList_polls",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PollCard_poll"
    }
  ],
  "type": "Poll",
  "abstractKey": null
};

(node as any).hash = "47b76c5b7aec0111b39ebd5f20fec876";

export default node;
