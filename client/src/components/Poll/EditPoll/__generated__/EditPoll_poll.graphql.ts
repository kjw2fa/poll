/**
 * @generated SignedSource<<c4a2b14e87f510eeee49ee02edbcbb30>>
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
  readonly options: ReadonlyArray<{
    readonly id: string;
    readonly optionText: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "EditPoll_poll";
};
export type EditPoll_poll$key = {
  readonly " $data"?: EditPoll_poll$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditPoll_poll">;
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
  "name": "EditPoll_poll",
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
    }
  ],
  "type": "Poll",
  "abstractKey": null
};
})();

(node as any).hash = "75ed20feba37038264386f01f4b2cda3";

export default node;
