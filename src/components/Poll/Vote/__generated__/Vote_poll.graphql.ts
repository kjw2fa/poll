/**
 * @generated SignedSource<<d2a9f2ee6b49f1be64a09aa055342632>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Vote_poll$data = {
  readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly votes: ReadonlyArray<{
    readonly option: string | null | undefined;
    readonly rating: number | null | undefined;
  } | null | undefined> | null | undefined;
  readonly " $fragmentType": "Vote_poll";
};
export type Vote_poll$key = {
  readonly " $data"?: Vote_poll$data;
  readonly " $fragmentSpreads": FragmentRefs<"Vote_poll">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "userId"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Vote_poll",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "options",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "userId",
          "variableName": "userId"
        }
      ],
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
  "type": "Poll",
  "abstractKey": null
};

(node as any).hash = "b026ffc45c92ded373ace6cb6388c0e7";

export default node;
