/**
 * @generated SignedSource<<248b510fa34e5dd0ebb90f196c5dccc6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MyPollsQuery$variables = {
  userId: string;
};
export type MyPollsQuery$data = {
  readonly myPolls: {
    readonly createdPolls: ReadonlyArray<{
      readonly id: string | null | undefined;
      readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
      readonly permissions: {
        readonly canEdit: boolean | null | undefined;
      } | null | undefined;
      readonly title: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly votedPolls: ReadonlyArray<{
      readonly id: string | null | undefined;
      readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
      readonly permissions: {
        readonly canEdit: boolean | null | undefined;
      } | null | undefined;
      readonly title: string | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type MyPollsQuery = {
  response: MyPollsQuery$data;
  variables: MyPollsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
  }
],
v2 = [
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
    "args": (v1/*: any*/),
    "concreteType": "Permissions",
    "kind": "LinkedField",
    "name": "permissions",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "canEdit",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": (v1/*: any*/),
    "concreteType": "MyPolls",
    "kind": "LinkedField",
    "name": "myPolls",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "createdPolls",
        "plural": true,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "votedPolls",
        "plural": true,
        "selections": (v2/*: any*/),
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
    "name": "MyPollsQuery",
    "selections": (v3/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyPollsQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "eaa83a3be0dfea3f22f56afa24599c13",
    "id": null,
    "metadata": {},
    "name": "MyPollsQuery",
    "operationKind": "query",
    "text": "query MyPollsQuery(\n  $userId: ID!\n) {\n  myPolls(userId: $userId) {\n    createdPolls {\n      id\n      title\n      options\n      permissions(userId: $userId) {\n        canEdit\n      }\n    }\n    votedPolls {\n      id\n      title\n      options\n      permissions(userId: $userId) {\n        canEdit\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1aadc92dcdfdbc0fcc19670108c3a9d1";

export default node;
