/**
 * @generated SignedSource<<e5ca4e1d19999ab63c61e08c5826434d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PollResultsQuery$variables = {
  pollId: string;
};
export type PollResultsQuery$data = {
  readonly pollResults: {
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
  } | null | undefined;
};
export type PollResultsQuery = {
  response: PollResultsQuery$data;
  variables: PollResultsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "pollId"
  }
],
v1 = [
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
],
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "pollId",
        "variableName": "pollId"
      }
    ],
    "concreteType": "PollResult",
    "kind": "LinkedField",
    "name": "pollResults",
    "plural": false,
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
        "selections": (v1/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "WinningOption",
        "kind": "LinkedField",
        "name": "allAverageRatings",
        "plural": true,
        "selections": (v1/*: any*/),
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
    "name": "PollResultsQuery",
    "selections": (v2/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PollResultsQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "98232a2ff96ac3874a0a66f4e19afc86",
    "id": null,
    "metadata": {},
    "name": "PollResultsQuery",
    "operationKind": "query",
    "text": "query PollResultsQuery(\n  $pollId: ID!\n) {\n  pollResults(pollId: $pollId) {\n    pollTitle\n    totalVotes\n    voters\n    results {\n      option\n      averageRating\n    }\n    allAverageRatings {\n      option\n      averageRating\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "46cab31df142b02558191835667d3b34";

export default node;
