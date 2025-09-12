/**
 * @generated SignedSource<<3f900932ad6ef335615941a4f4dac887>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type PermissionType = "EDIT" | "VIEW" | "VOTE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type PollCard_poll$data = {
  readonly id: string;
  readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly permissions: ReadonlyArray<{
    readonly permission_type: PermissionType | null | undefined;
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
