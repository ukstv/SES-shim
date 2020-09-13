/**
 * @typedef {Object} VirtualConsole
 * @property {Console['debug']} debug
 * @property {Console['error']} error
 * @property {Console['info']} info
 * @property {Console['log']} log
 * @property {Console['warn']} warn
 * @property {Console['assert']} assert
 * @property {Console['clear']} clear
 * @property {Console['table']} table
 * @property {Console['trace']} trace
 * @property {Console['dir']} dir
 * @property {Console['dirxml']} dirxml
 * @property {Console['count']} count
 * @property {Console['countReset']} countReset
 * @property {Console['group']} group
 * @property {Console['groupCollapsed']} groupCollapsed
 * @property {Console['groupEnd']} groupEnd
 * @property {Console['time']} time
 * @property {Console['timeLog']} timeLog
 * @property {Console['timeEnd']} timeEnd
 * @property {Console['profile']} profile
 * @property {Console['profileEnd']} profileEnd
 * @property {Console['timeStamp']} timeStamp
 */

/**
 * @typedef {readonly [string, ...any[]]} LogRecord
 */

/**
 * @typedef {Object} LoggingConsoleKit
 * @property {VirtualConsole} loggingConsole
 * @property {() => readonly LogRecord[]} takeLog
 */

/**
 * @callback MakeLoggingConsoleKit
 *
 * A mock console that just accumulates the contents of all whitelisted calls,
 * making them available to callers of `takeLog()`. Calling `takeLog()`
 * consumes these, so later calls to `takeLog()` will only provide a log of
 * calls that have happened since then.
 *
 * A logging console also implements the custom `rememberErrorInfo` method,
 * which the `@agoric/assert` module feature tests for, so it captures and
 * reports error annotations as well. Unlike the causalConsole below, the
 * logging console does not delay reporting these annotations. It just
 * immediately adds to the log what it was asked to remember.
 *
 * @returns {LoggingConsoleKit}
 */

/**
 * @callback GetStackString
 * @param {Error} error
 * @returns {string}
 */

/**
 * @typedef {Object} CausalConsoleOptions
 * @property {GetStackString=} getStackString
 */

/**
 * @callback MakeCausalConsole
 *
 * Makes a causal console wrapper of a base console, where the causal wrappper
 * uses `decodeConsole` to recognize
 *
 * @param {Console} baseConsole
 * @param {CausalConsoleOptions=} options
 * @returns {VirtualConsole}
 */
