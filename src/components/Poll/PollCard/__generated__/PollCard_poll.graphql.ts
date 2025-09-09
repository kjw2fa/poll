/**
 * @generated SignedSource<<9ea49b33907df8b30af2dae999004719>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PollCard_poll$data = {
  readonly id: string | null | undefined;
  readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly permissions: ReadonlyArray<{
    readonly permission_type: string | null | undefined;
    readonly target_id: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "PollCard_poll";
};
export type PollCard_poll$key = {
  readonly " $data"?: PollCard_poll$data;
  readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PollCard_poll",
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
  "type": "Poll",
  "abstractKey": null
};

(node as any).hash = "7365f76609717046e5cbbc238ca25737";

export default node;
