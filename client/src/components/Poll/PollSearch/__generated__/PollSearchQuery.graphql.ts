/**
 * @generated SignedSource<<4fcad79cd62975a219baa9ef42eac6b5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PollSearchQuery$variables = {
  searchTerm: string;
};
export type PollSearchQuery$data = {
  readonly searchPolls: ReadonlyArray<{
    readonly id: string | null | undefined;
    readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
    readonly title: string | null | undefined;
  } | null | undefined> | null | undefined;
};
export type PollSearchQuery = {
  response: PollSearchQuery$data;
  variables: PollSearchQuery$variables;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "searchTerm",
        "variableName": "searchTerm"
      }
    ],
    "concreteType": "Poll",
    "kind": "LinkedField",
    "name": "searchPolls",
    "plural": true,
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PollSearchQuery",
    "selections": (v1/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PollSearchQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8d4d07ac490430f7e4e8d91dbbc577fd",
    "id": null,
    "metadata": {},
    "name": "PollSearchQuery",
    "operationKind": "query",
    "text": "query PollSearchQuery(\n  $searchTerm: String!\n) {\n  searchPolls(searchTerm: $searchTerm) {\n    id\n    title\n    options\n  }\n}\n"
  }
};
})();

(node as any).hash = "c50431b45a731e6d90f3d2da5bbc0b57";

export default node;
