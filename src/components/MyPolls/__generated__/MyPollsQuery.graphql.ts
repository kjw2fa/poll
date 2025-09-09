/**
 * @generated SignedSource<<6996f3be1bf9c1039d5f053f9c6552b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyPollsQuery$variables = {
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  userId: string;
};
export type MyPollsQuery$data = {
  readonly myPolls: {
    readonly createdPolls: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string | null | undefined;
          readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly votedPolls: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string | null | undefined;
          readonly " $fragmentSpreads": FragmentRefs<"PollCard_poll">;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type MyPollsQuery = {
  response: MyPollsQuery$data;
  variables: MyPollsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": 10,
  "kind": "LocalArgument",
  "name": "count"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "PollEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PollCard_poll"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      (v6/*: any*/)
    ],
    "storageKey": null
  },
  (v7/*: any*/)
],
v9 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v10 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "PollEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/),
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
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      (v6/*: any*/)
    ],
    "storageKey": null
  },
  (v7/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyPollsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "MyPolls",
        "kind": "LinkedField",
        "name": "myPolls",
        "plural": false,
        "selections": [
          {
            "alias": "createdPolls",
            "args": null,
            "concreteType": "PollConnection",
            "kind": "LinkedField",
            "name": "__MyPolls_createdPolls_connection",
            "plural": false,
            "selections": (v8/*: any*/),
            "storageKey": null
          },
          {
            "alias": "votedPolls",
            "args": null,
            "concreteType": "PollConnection",
            "kind": "LinkedField",
            "name": "__MyPolls_votedPolls_connection",
            "plural": false,
            "selections": (v8/*: any*/),
            "storageKey": null
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
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "MyPollsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "MyPolls",
        "kind": "LinkedField",
        "name": "myPolls",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "PollConnection",
            "kind": "LinkedField",
            "name": "createdPolls",
            "plural": false,
            "selections": (v10/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyPolls_createdPolls",
            "kind": "LinkedHandle",
            "name": "createdPolls"
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "PollConnection",
            "kind": "LinkedField",
            "name": "votedPolls",
            "plural": false,
            "selections": (v10/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyPolls_votedPolls",
            "kind": "LinkedHandle",
            "name": "votedPolls"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ccff9d0bb6e9f50a9292ca2c40df42e4",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": "count",
          "cursor": "cursor",
          "direction": "forward",
          "path": [
            "myPolls",
            "createdPolls"
          ]
        },
        {
          "count": "count",
          "cursor": "cursor",
          "direction": "forward",
          "path": [
            "myPolls",
            "votedPolls"
          ]
        }
      ]
    },
    "name": "MyPollsQuery",
    "operationKind": "query",
    "text": "query MyPollsQuery(\n  $userId: ID!\n  $count: Int = 10\n  $cursor: String\n) {\n  myPolls(userId: $userId) {\n    createdPolls(first: $count, after: $cursor) {\n      edges {\n        node {\n          id\n          ...PollCard_poll\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n    votedPolls(first: $count, after: $cursor) {\n      edges {\n        node {\n          id\n          ...PollCard_poll\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n\nfragment PollCard_poll on Poll {\n  id\n  title\n  options\n  permissions {\n    permission_type\n    target_id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9b94054e1c70266d59185b0a4a67c0d3";

export default node;
