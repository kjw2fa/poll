/**
 * @generated SignedSource<<114eb7f2087b57330c75765da186c851>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EditPoll_poll$data = {
  readonly id: string;
  readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "EditPoll_poll";
};
export type EditPoll_poll$key = {
  readonly " $data"?: EditPoll_poll$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditPoll_poll">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditPoll_poll",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
    }
  ],
  "type": "Poll",
  "abstractKey": null
};

(node as any).hash = "98c1377419a86c9c19f3d06121be8aa6";

export default node;
