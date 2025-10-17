/**
 * @generated SignedSource<<29ac80922d9cd5a04e7c5289725d93c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageSearchQuery$variables = {
  searchTerm: string;
};
export type pageSearchQuery$data = {
  readonly searchPolls: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"PollList_polls">;
  }>;
};
export type pageSearchQuery = {
  response: pageSearchQuery$data;
  variables: pageSearchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchTerm"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "searchTerm",
    "variableName": "searchTerm"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSearchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "searchPolls",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PollList_polls"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageSearchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "searchPolls",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
              (v2/*: any*/),
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
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b6a249151281cdd2e2ff214f65123891",
    "id": null,
    "metadata": {},
    "name": "pageSearchQuery",
    "operationKind": "query",
    "text": "query pageSearchQuery(\n  $searchTerm: String!\n) {\n  searchPolls(searchTerm: $searchTerm) {\n    ...PollList_polls\n    id\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options {\n    id\n    optionText\n  }\n  permissions {\n    permission_type\n    target_id\n    id\n  }\n}\n\nfragment PollList_polls on Poll {\n  id\n  ...PollCard_poll\n}\n"
  }
};
})();

(node as any).hash = "c8d836ca3b47cb6720a8e4f7961d5aa0";

export default node;
