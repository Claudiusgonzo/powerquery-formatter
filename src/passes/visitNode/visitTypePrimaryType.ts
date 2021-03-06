// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as PQP from "@microsoft/powerquery-parser";
import { expectGetIsMultiline } from "../isMultiline/common";
import { SerializeParameter, SerializeParameterState, SerializeWriteKind } from "../types";
import { propagateWriteKind, setWorkspace, skipPrimaryTypeIndentation } from "./visitNodeUtils";

export function visitTypePrimaryType(state: SerializeParameterState, node: PQP.Language.Ast.TypePrimaryType): void {
    propagateWriteKind(state, node, node.constant);

    const paired: PQP.Language.Ast.TPrimaryType = node.paired;
    const pairedIsMultiline: boolean = expectGetIsMultiline(state.isMultilineMap, paired);
    let pairedWorkspace: SerializeParameter;
    if (skipPrimaryTypeIndentation(paired)) {
        pairedWorkspace = {
            maybeWriteKind: SerializeWriteKind.PaddedLeft,
        };
    } else if (pairedIsMultiline) {
        pairedWorkspace = {
            maybeIndentationChange: 1,
            maybeWriteKind: SerializeWriteKind.Indented,
        };
    } else {
        pairedWorkspace = { maybeWriteKind: SerializeWriteKind.PaddedLeft };
    }
    setWorkspace(state, paired, pairedWorkspace);
}
