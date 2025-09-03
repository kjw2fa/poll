/**
 * @generated SignedSource<<17a96c1a1513ff8ca81085902b22f4e4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EditPollMutation$variables = {
  options: ReadonlyArray<string | null | undefined>;
  pollId: string;
  title: string;
  userId: string;
};
export type EditPollMutation$data = {
  readonly editPoll: {
    readonly id: string | null | undefined;
    readonly options: ReadonlyArray<string | null | undefined> | null | undefined;
    readonly title: string | null | undefined;
  } | null | undefined;
};
export type EditPollMutation = {
  response: EditPollMutation$data;
  variables: EditPollMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "options"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pollId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "options",
        "variableName": "options"
      },
      {
        "kind": "Variable",
        "name": "pollId",
        "variableName": "pollId"
      },
      {
        "kind": "Variable",
        "name": "title",
        "variableName": "title"
      },
      {
        "kind": "Variable",
        "name": "userId",
        "variableName": "userId"
      }
    ],
    "concreteType": "Poll",
    "kind": "LinkedField",
    "name": "editPoll",
    "plural": false,
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "EditPollMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "EditPollMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "e6ce1f7d524944757eb0f1ce548d9d33",
    "id": null,
    "metadata": {},
    "name": "EditPollMutation",
    "operationKind": "mutation",
    "text": "mutation EditPollMutation(\n  $pollId: ID!\n  $userId: ID!\n  $title: String!\n  $options: [String]!\n) {\n  editPoll(pollId: $pollId, userId: $userId, title: $title, options: $options) {\n    id\n    title\n    options\n  }\n}\n"
  }
};
})();

(node as any).hash = "83ae677de8db5ab754ae417758090e41";

export default node;
