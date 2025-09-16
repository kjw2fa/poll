/**
 * @generated SignedSource<<d58b925bab3c4c4688c3e1270d0633db>>
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
  readonly options: ReadonlyArray<{
    readonly id: string;
    readonly optionText: string | null | undefined;
  } | null | undefined> | null | undefined;
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

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PollCard_poll",
  "selections": [
    (v0/*: any*/),
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
})();

(node as any).hash = "5857926392bf3158da25774a88a9d2a2";

export default node;
