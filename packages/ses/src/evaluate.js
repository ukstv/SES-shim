// Portions adapted from V8 - Copyright 2016 the V8 project authors.
// https://github.com/v8/v8/blob/master/src/builtins/builtins-function.cc

import { assert, details as d } from '@agoric/assert';
import { apply, immutableObject, proxyRevocable } from './commons.js';
import { getScopeConstants } from './scope-constants.js';
import { createScopeHandler } from './scope-handler.js';
import { applyTransforms, mandatoryTransforms } from './transforms.js';
import { makeEvaluateFactory } from './make-evaluate-factory.js';

/**
 * performEval()
 * The low-level operation used by all evaluators:
 * eval(), Function(), Evalutator.prototype.evaluate().
 */
export function performEval(
  source,
  globalObject,
  localObject = {},
  {
    localTransforms = [],
    globalTransforms = [],
    sloppyGlobalsMode = false,
  } = {},
) {
  // Execute the mandatory transforms last to ensure that any rewritten code
  // meets those mandatory requirements.
  source = applyTransforms(source, [
    ...localTransforms,
    ...globalTransforms,
    mandatoryTransforms,
  ]);

  const scopeHandler = createScopeHandler(globalObject, localObject, {
    sloppyGlobalsMode,
  });
  const scopeProxyRevocable = proxyRevocable(immutableObject, scopeHandler);
  // Ensure that "this" resolves to the scope proxy.

  const constants = getScopeConstants(globalObject, localObject);
  const evaluateFactory = makeEvaluateFactory(constants);
  const evaluate = apply(evaluateFactory, scopeProxyRevocable.proxy, []);

  scopeHandler.useUnsafeEvaluator = true;
  let err;
  try {
    // Ensure that "this" resolves to the safe global.
    return apply(evaluate, globalObject, [source]);
  } catch (e) {
    // stash the child-code error in hopes of debugging the internal failure
    err = e;
    throw e;
  } finally {
    if (scopeHandler.useUnsafeEvaluator === true) {
      // The proxy switches off useUnsafeEvaluator immediately after
      // the first access, but if that's not the case we should abort.
      // This condition is one where this vat is now hopelessly confused,
      // and the vat as a whole should be aborted. All immediately reachable
      // state should be abandoned. However, that is not yet possible,
      // so we at least prevent further variable resolution via the
      // scopeHandler, and throw an error with diagnostic info including
      // the thrown error if any from evaluating the source code.
      scopeProxyRevocable.revoke();
      // TODO A GOOD PLACE TO PANIC(), i.e., kill the vat incarnation.
      assert.fail(d`handler did not revoke useUnsafeEvaluator ${err}`);
    }
  }
}
