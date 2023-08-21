import { config } from 'dotenv';
import * as crypto$4 from 'crypto';
import * as http from 'http';
import * as url from 'url';
import * as bson$1 from 'bson';
import * as timers from 'timers';
import * as util from 'util';
import * as stream from 'stream';
import * as events$1 from 'events';
import * as dns$1 from 'dns';
import * as fs$1 from 'fs';
import * as mongodbConnectionStringUrl from 'mongodb-connection-string-url';
import * as os$1 from 'os';
import * as process$2 from 'process';
import * as zlib from 'zlib';
import * as net from 'net';
import * as socks from 'socks';
import * as tls from 'tls';
import mongoose, { model, Schema } from 'mongoose';

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

var lib = {};

var admin = {};

var add_user = {};

const require$$0$9 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(crypto$4);

var error = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isResumableError = exports.isNetworkTimeoutError = exports.isSDAMUnrecoverableError = exports.isNodeShuttingDownError = exports.isRetryableReadError = exports.isRetryableWriteError = exports.needsRetryableWriteLabel = exports.MongoWriteConcernError = exports.MongoServerSelectionError = exports.MongoSystemError = exports.MongoMissingDependencyError = exports.MongoMissingCredentialsError = exports.MongoCompatibilityError = exports.MongoInvalidArgumentError = exports.MongoParseError = exports.MongoNetworkTimeoutError = exports.MongoNetworkError = exports.isNetworkErrorBeforeHandshake = exports.MongoTopologyClosedError = exports.MongoCursorExhaustedError = exports.MongoServerClosedError = exports.MongoCursorInUseError = exports.MongoUnexpectedServerResponseError = exports.MongoGridFSChunkError = exports.MongoGridFSStreamError = exports.MongoTailableCursorError = exports.MongoChangeStreamError = exports.MongoAzureError = exports.MongoAWSError = exports.MongoKerberosError = exports.MongoExpiredSessionError = exports.MongoTransactionError = exports.MongoNotConnectedError = exports.MongoDecompressionError = exports.MongoBatchReExecutionError = exports.MongoRuntimeError = exports.MongoAPIError = exports.MongoDriverError = exports.MongoServerError = exports.MongoError = exports.MongoErrorLabel = exports.GET_MORE_RESUMABLE_CODES = exports.MONGODB_ERROR_CODES = exports.NODE_IS_RECOVERING_ERROR_MESSAGE = exports.LEGACY_NOT_PRIMARY_OR_SECONDARY_ERROR_MESSAGE = exports.LEGACY_NOT_WRITABLE_PRIMARY_ERROR_MESSAGE = void 0;
	/** @internal */
	const kErrorLabels = Symbol('errorLabels');
	/**
	 * @internal
	 * The legacy error message from the server that indicates the node is not a writable primary
	 * https://github.com/mongodb/specifications/blob/b07c26dc40d04ac20349f989db531c9845fdd755/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#not-writable-primary-and-node-is-recovering
	 */
	exports.LEGACY_NOT_WRITABLE_PRIMARY_ERROR_MESSAGE = new RegExp('not master', 'i');
	/**
	 * @internal
	 * The legacy error message from the server that indicates the node is not a primary or secondary
	 * https://github.com/mongodb/specifications/blob/b07c26dc40d04ac20349f989db531c9845fdd755/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#not-writable-primary-and-node-is-recovering
	 */
	exports.LEGACY_NOT_PRIMARY_OR_SECONDARY_ERROR_MESSAGE = new RegExp('not master or secondary', 'i');
	/**
	 * @internal
	 * The error message from the server that indicates the node is recovering
	 * https://github.com/mongodb/specifications/blob/b07c26dc40d04ac20349f989db531c9845fdd755/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#not-writable-primary-and-node-is-recovering
	 */
	exports.NODE_IS_RECOVERING_ERROR_MESSAGE = new RegExp('node is recovering', 'i');
	/** @internal MongoDB Error Codes */
	exports.MONGODB_ERROR_CODES = Object.freeze({
	    HostUnreachable: 6,
	    HostNotFound: 7,
	    NetworkTimeout: 89,
	    ShutdownInProgress: 91,
	    PrimarySteppedDown: 189,
	    ExceededTimeLimit: 262,
	    SocketException: 9001,
	    NotWritablePrimary: 10107,
	    InterruptedAtShutdown: 11600,
	    InterruptedDueToReplStateChange: 11602,
	    NotPrimaryNoSecondaryOk: 13435,
	    NotPrimaryOrSecondary: 13436,
	    StaleShardVersion: 63,
	    StaleEpoch: 150,
	    StaleConfig: 13388,
	    RetryChangeStream: 234,
	    FailedToSatisfyReadPreference: 133,
	    CursorNotFound: 43,
	    LegacyNotPrimary: 10058,
	    WriteConcernFailed: 64,
	    NamespaceNotFound: 26,
	    IllegalOperation: 20,
	    MaxTimeMSExpired: 50,
	    UnknownReplWriteConcern: 79,
	    UnsatisfiableWriteConcern: 100,
	    Reauthenticate: 391
	});
	// From spec@https://github.com/mongodb/specifications/blob/f93d78191f3db2898a59013a7ed5650352ef6da8/source/change-streams/change-streams.rst#resumable-error
	exports.GET_MORE_RESUMABLE_CODES = new Set([
	    exports.MONGODB_ERROR_CODES.HostUnreachable,
	    exports.MONGODB_ERROR_CODES.HostNotFound,
	    exports.MONGODB_ERROR_CODES.NetworkTimeout,
	    exports.MONGODB_ERROR_CODES.ShutdownInProgress,
	    exports.MONGODB_ERROR_CODES.PrimarySteppedDown,
	    exports.MONGODB_ERROR_CODES.ExceededTimeLimit,
	    exports.MONGODB_ERROR_CODES.SocketException,
	    exports.MONGODB_ERROR_CODES.NotWritablePrimary,
	    exports.MONGODB_ERROR_CODES.InterruptedAtShutdown,
	    exports.MONGODB_ERROR_CODES.InterruptedDueToReplStateChange,
	    exports.MONGODB_ERROR_CODES.NotPrimaryNoSecondaryOk,
	    exports.MONGODB_ERROR_CODES.NotPrimaryOrSecondary,
	    exports.MONGODB_ERROR_CODES.StaleShardVersion,
	    exports.MONGODB_ERROR_CODES.StaleEpoch,
	    exports.MONGODB_ERROR_CODES.StaleConfig,
	    exports.MONGODB_ERROR_CODES.RetryChangeStream,
	    exports.MONGODB_ERROR_CODES.FailedToSatisfyReadPreference,
	    exports.MONGODB_ERROR_CODES.CursorNotFound
	]);
	/** @public */
	exports.MongoErrorLabel = Object.freeze({
	    RetryableWriteError: 'RetryableWriteError',
	    TransientTransactionError: 'TransientTransactionError',
	    UnknownTransactionCommitResult: 'UnknownTransactionCommitResult',
	    ResumableChangeStreamError: 'ResumableChangeStreamError',
	    HandshakeError: 'HandshakeError',
	    ResetPool: 'ResetPool',
	    InterruptInUseConnections: 'InterruptInUseConnections',
	    NoWritesPerformed: 'NoWritesPerformed'
	});
	function isAggregateError(e) {
	    return 'errors' in e && Array.isArray(e.errors);
	}
	/**
	 * @public
	 * @category Error
	 *
	 * @privateRemarks
	 * mongodb-client-encryption has a dependency on this error, it uses the constructor with a string argument
	 */
	class MongoError extends Error {
	    constructor(message) {
	        super(MongoError.buildErrorMessage(message));
	        if (message instanceof Error) {
	            this.cause = message;
	        }
	        this[kErrorLabels] = new Set();
	    }
	    /** @internal */
	    static buildErrorMessage(e) {
	        if (typeof e === 'string') {
	            return e;
	        }
	        if (isAggregateError(e) && e.message.length === 0) {
	            return e.errors.length === 0
	                ? 'AggregateError has an empty errors array. Please check the `cause` property for more information.'
	                : e.errors.map(({ message }) => message).join(', ');
	        }
	        return e.message;
	    }
	    get name() {
	        return 'MongoError';
	    }
	    /** Legacy name for server error responses */
	    get errmsg() {
	        return this.message;
	    }
	    /**
	     * Checks the error to see if it has an error label
	     *
	     * @param label - The error label to check for
	     * @returns returns true if the error has the provided error label
	     */
	    hasErrorLabel(label) {
	        return this[kErrorLabels].has(label);
	    }
	    addErrorLabel(label) {
	        this[kErrorLabels].add(label);
	    }
	    get errorLabels() {
	        return Array.from(this[kErrorLabels]);
	    }
	}
	exports.MongoError = MongoError;
	/**
	 * An error coming from the mongo server
	 *
	 * @public
	 * @category Error
	 */
	class MongoServerError extends MongoError {
	    constructor(message) {
	        super(message.message || message.errmsg || message.$err || 'n/a');
	        if (message.errorLabels) {
	            this[kErrorLabels] = new Set(message.errorLabels);
	        }
	        for (const name in message) {
	            if (name !== 'errorLabels' && name !== 'errmsg' && name !== 'message')
	                this[name] = message[name];
	        }
	    }
	    get name() {
	        return 'MongoServerError';
	    }
	}
	exports.MongoServerError = MongoServerError;
	/**
	 * An error generated by the driver
	 *
	 * @public
	 * @category Error
	 */
	class MongoDriverError extends MongoError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoDriverError';
	    }
	}
	exports.MongoDriverError = MongoDriverError;
	/**
	 * An error generated when the driver API is used incorrectly
	 *
	 * @privateRemarks
	 * Should **never** be directly instantiated
	 *
	 * @public
	 * @category Error
	 */
	class MongoAPIError extends MongoDriverError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoAPIError';
	    }
	}
	exports.MongoAPIError = MongoAPIError;
	/**
	 * An error generated when the driver encounters unexpected input
	 * or reaches an unexpected/invalid internal state
	 *
	 * @privateRemarks
	 * Should **never** be directly instantiated.
	 *
	 * @public
	 * @category Error
	 */
	class MongoRuntimeError extends MongoDriverError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoRuntimeError';
	    }
	}
	exports.MongoRuntimeError = MongoRuntimeError;
	/**
	 * An error generated when a batch command is re-executed after one of the commands in the batch
	 * has failed
	 *
	 * @public
	 * @category Error
	 */
	class MongoBatchReExecutionError extends MongoAPIError {
	    constructor(message = 'This batch has already been executed, create new batch to execute') {
	        super(message);
	    }
	    get name() {
	        return 'MongoBatchReExecutionError';
	    }
	}
	exports.MongoBatchReExecutionError = MongoBatchReExecutionError;
	/**
	 * An error generated when the driver fails to decompress
	 * data received from the server.
	 *
	 * @public
	 * @category Error
	 */
	class MongoDecompressionError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoDecompressionError';
	    }
	}
	exports.MongoDecompressionError = MongoDecompressionError;
	/**
	 * An error thrown when the user attempts to operate on a database or collection through a MongoClient
	 * that has not yet successfully called the "connect" method
	 *
	 * @public
	 * @category Error
	 */
	class MongoNotConnectedError extends MongoAPIError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoNotConnectedError';
	    }
	}
	exports.MongoNotConnectedError = MongoNotConnectedError;
	/**
	 * An error generated when the user makes a mistake in the usage of transactions.
	 * (e.g. attempting to commit a transaction with a readPreference other than primary)
	 *
	 * @public
	 * @category Error
	 */
	class MongoTransactionError extends MongoAPIError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoTransactionError';
	    }
	}
	exports.MongoTransactionError = MongoTransactionError;
	/**
	 * An error generated when the user attempts to operate
	 * on a session that has expired or has been closed.
	 *
	 * @public
	 * @category Error
	 */
	class MongoExpiredSessionError extends MongoAPIError {
	    constructor(message = 'Cannot use a session that has ended') {
	        super(message);
	    }
	    get name() {
	        return 'MongoExpiredSessionError';
	    }
	}
	exports.MongoExpiredSessionError = MongoExpiredSessionError;
	/**
	 * A error generated when the user attempts to authenticate
	 * via Kerberos, but fails to connect to the Kerberos client.
	 *
	 * @public
	 * @category Error
	 */
	class MongoKerberosError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoKerberosError';
	    }
	}
	exports.MongoKerberosError = MongoKerberosError;
	/**
	 * A error generated when the user attempts to authenticate
	 * via AWS, but fails
	 *
	 * @public
	 * @category Error
	 */
	class MongoAWSError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoAWSError';
	    }
	}
	exports.MongoAWSError = MongoAWSError;
	/**
	 * A error generated when the user attempts to authenticate
	 * via Azure, but fails.
	 *
	 * @public
	 * @category Error
	 */
	class MongoAzureError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoAzureError';
	    }
	}
	exports.MongoAzureError = MongoAzureError;
	/**
	 * An error generated when a ChangeStream operation fails to execute.
	 *
	 * @public
	 * @category Error
	 */
	class MongoChangeStreamError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoChangeStreamError';
	    }
	}
	exports.MongoChangeStreamError = MongoChangeStreamError;
	/**
	 * An error thrown when the user calls a function or method not supported on a tailable cursor
	 *
	 * @public
	 * @category Error
	 */
	class MongoTailableCursorError extends MongoAPIError {
	    constructor(message = 'Tailable cursor does not support this operation') {
	        super(message);
	    }
	    get name() {
	        return 'MongoTailableCursorError';
	    }
	}
	exports.MongoTailableCursorError = MongoTailableCursorError;
	/** An error generated when a GridFSStream operation fails to execute.
	 *
	 * @public
	 * @category Error
	 */
	class MongoGridFSStreamError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoGridFSStreamError';
	    }
	}
	exports.MongoGridFSStreamError = MongoGridFSStreamError;
	/**
	 * An error generated when a malformed or invalid chunk is
	 * encountered when reading from a GridFSStream.
	 *
	 * @public
	 * @category Error
	 */
	class MongoGridFSChunkError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoGridFSChunkError';
	    }
	}
	exports.MongoGridFSChunkError = MongoGridFSChunkError;
	/**
	 * An error generated when a **parsable** unexpected response comes from the server.
	 * This is generally an error where the driver in a state expecting a certain behavior to occur in
	 * the next message from MongoDB but it receives something else.
	 * This error **does not** represent an issue with wire message formatting.
	 *
	 * #### Example
	 * When an operation fails, it is the driver's job to retry it. It must perform serverSelection
	 * again to make sure that it attempts the operation against a server in a good state. If server
	 * selection returns a server that does not support retryable operations, this error is used.
	 * This scenario is unlikely as retryable support would also have been determined on the first attempt
	 * but it is possible the state change could report a selectable server that does not support retries.
	 *
	 * @public
	 * @category Error
	 */
	class MongoUnexpectedServerResponseError extends MongoRuntimeError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoUnexpectedServerResponseError';
	    }
	}
	exports.MongoUnexpectedServerResponseError = MongoUnexpectedServerResponseError;
	/**
	 * An error thrown when the user attempts to add options to a cursor that has already been
	 * initialized
	 *
	 * @public
	 * @category Error
	 */
	class MongoCursorInUseError extends MongoAPIError {
	    constructor(message = 'Cursor is already initialized') {
	        super(message);
	    }
	    get name() {
	        return 'MongoCursorInUseError';
	    }
	}
	exports.MongoCursorInUseError = MongoCursorInUseError;
	/**
	 * An error generated when an attempt is made to operate
	 * on a closed/closing server.
	 *
	 * @public
	 * @category Error
	 */
	class MongoServerClosedError extends MongoAPIError {
	    constructor(message = 'Server is closed') {
	        super(message);
	    }
	    get name() {
	        return 'MongoServerClosedError';
	    }
	}
	exports.MongoServerClosedError = MongoServerClosedError;
	/**
	 * An error thrown when an attempt is made to read from a cursor that has been exhausted
	 *
	 * @public
	 * @category Error
	 */
	class MongoCursorExhaustedError extends MongoAPIError {
	    constructor(message) {
	        super(message || 'Cursor is exhausted');
	    }
	    get name() {
	        return 'MongoCursorExhaustedError';
	    }
	}
	exports.MongoCursorExhaustedError = MongoCursorExhaustedError;
	/**
	 * An error generated when an attempt is made to operate on a
	 * dropped, or otherwise unavailable, database.
	 *
	 * @public
	 * @category Error
	 */
	class MongoTopologyClosedError extends MongoAPIError {
	    constructor(message = 'Topology is closed') {
	        super(message);
	    }
	    get name() {
	        return 'MongoTopologyClosedError';
	    }
	}
	exports.MongoTopologyClosedError = MongoTopologyClosedError;
	/** @internal */
	const kBeforeHandshake = Symbol('beforeHandshake');
	function isNetworkErrorBeforeHandshake(err) {
	    return err[kBeforeHandshake] === true;
	}
	exports.isNetworkErrorBeforeHandshake = isNetworkErrorBeforeHandshake;
	/**
	 * An error indicating an issue with the network, including TCP errors and timeouts.
	 * @public
	 * @category Error
	 */
	class MongoNetworkError extends MongoError {
	    constructor(message, options) {
	        super(message);
	        if (options && typeof options.beforeHandshake === 'boolean') {
	            this[kBeforeHandshake] = options.beforeHandshake;
	        }
	    }
	    get name() {
	        return 'MongoNetworkError';
	    }
	}
	exports.MongoNetworkError = MongoNetworkError;
	/**
	 * An error indicating a network timeout occurred
	 * @public
	 * @category Error
	 *
	 * @privateRemarks
	 * mongodb-client-encryption has a dependency on this error with an instanceof check
	 */
	class MongoNetworkTimeoutError extends MongoNetworkError {
	    constructor(message, options) {
	        super(message, options);
	    }
	    get name() {
	        return 'MongoNetworkTimeoutError';
	    }
	}
	exports.MongoNetworkTimeoutError = MongoNetworkTimeoutError;
	/**
	 * An error used when attempting to parse a value (like a connection string)
	 * @public
	 * @category Error
	 */
	class MongoParseError extends MongoDriverError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoParseError';
	    }
	}
	exports.MongoParseError = MongoParseError;
	/**
	 * An error generated when the user supplies malformed or unexpected arguments
	 * or when a required argument or field is not provided.
	 *
	 *
	 * @public
	 * @category Error
	 */
	class MongoInvalidArgumentError extends MongoAPIError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoInvalidArgumentError';
	    }
	}
	exports.MongoInvalidArgumentError = MongoInvalidArgumentError;
	/**
	 * An error generated when a feature that is not enabled or allowed for the current server
	 * configuration is used
	 *
	 *
	 * @public
	 * @category Error
	 */
	class MongoCompatibilityError extends MongoAPIError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoCompatibilityError';
	    }
	}
	exports.MongoCompatibilityError = MongoCompatibilityError;
	/**
	 * An error generated when the user fails to provide authentication credentials before attempting
	 * to connect to a mongo server instance.
	 *
	 *
	 * @public
	 * @category Error
	 */
	class MongoMissingCredentialsError extends MongoAPIError {
	    constructor(message) {
	        super(message);
	    }
	    get name() {
	        return 'MongoMissingCredentialsError';
	    }
	}
	exports.MongoMissingCredentialsError = MongoMissingCredentialsError;
	/**
	 * An error generated when a required module or dependency is not present in the local environment
	 *
	 * @public
	 * @category Error
	 */
	class MongoMissingDependencyError extends MongoAPIError {
	    constructor(message, { cause } = {}) {
	        super(message);
	        if (cause)
	            this.cause = cause;
	    }
	    get name() {
	        return 'MongoMissingDependencyError';
	    }
	}
	exports.MongoMissingDependencyError = MongoMissingDependencyError;
	/**
	 * An error signifying a general system issue
	 * @public
	 * @category Error
	 */
	class MongoSystemError extends MongoError {
	    constructor(message, reason) {
	        if (reason && reason.error) {
	            super(reason.error.message || reason.error);
	        }
	        else {
	            super(message);
	        }
	        if (reason) {
	            this.reason = reason;
	        }
	        this.code = reason.error?.code;
	    }
	    get name() {
	        return 'MongoSystemError';
	    }
	}
	exports.MongoSystemError = MongoSystemError;
	/**
	 * An error signifying a client-side server selection error
	 * @public
	 * @category Error
	 */
	class MongoServerSelectionError extends MongoSystemError {
	    constructor(message, reason) {
	        super(message, reason);
	    }
	    get name() {
	        return 'MongoServerSelectionError';
	    }
	}
	exports.MongoServerSelectionError = MongoServerSelectionError;
	function makeWriteConcernResultObject(input) {
	    const output = Object.assign({}, input);
	    if (output.ok === 0) {
	        output.ok = 1;
	        delete output.errmsg;
	        delete output.code;
	        delete output.codeName;
	    }
	    return output;
	}
	/**
	 * An error thrown when the server reports a writeConcernError
	 * @public
	 * @category Error
	 */
	class MongoWriteConcernError extends MongoServerError {
	    constructor(message, result) {
	        if (result && Array.isArray(result.errorLabels)) {
	            message.errorLabels = result.errorLabels;
	        }
	        super(message);
	        this.errInfo = message.errInfo;
	        if (result != null) {
	            this.result = makeWriteConcernResultObject(result);
	        }
	    }
	    get name() {
	        return 'MongoWriteConcernError';
	    }
	}
	exports.MongoWriteConcernError = MongoWriteConcernError;
	// https://github.com/mongodb/specifications/blob/master/source/retryable-reads/retryable-reads.rst#retryable-error
	const RETRYABLE_READ_ERROR_CODES = new Set([
	    exports.MONGODB_ERROR_CODES.HostUnreachable,
	    exports.MONGODB_ERROR_CODES.HostNotFound,
	    exports.MONGODB_ERROR_CODES.NetworkTimeout,
	    exports.MONGODB_ERROR_CODES.ShutdownInProgress,
	    exports.MONGODB_ERROR_CODES.PrimarySteppedDown,
	    exports.MONGODB_ERROR_CODES.SocketException,
	    exports.MONGODB_ERROR_CODES.NotWritablePrimary,
	    exports.MONGODB_ERROR_CODES.InterruptedAtShutdown,
	    exports.MONGODB_ERROR_CODES.InterruptedDueToReplStateChange,
	    exports.MONGODB_ERROR_CODES.NotPrimaryNoSecondaryOk,
	    exports.MONGODB_ERROR_CODES.NotPrimaryOrSecondary
	]);
	// see: https://github.com/mongodb/specifications/blob/master/source/retryable-writes/retryable-writes.rst#terms
	const RETRYABLE_WRITE_ERROR_CODES = new Set([
	    ...RETRYABLE_READ_ERROR_CODES,
	    exports.MONGODB_ERROR_CODES.ExceededTimeLimit
	]);
	function needsRetryableWriteLabel(error, maxWireVersion) {
	    // pre-4.4 server, then the driver adds an error label for every valid case
	    // execute operation will only inspect the label, code/message logic is handled here
	    if (error instanceof MongoNetworkError) {
	        return true;
	    }
	    if (error instanceof MongoError) {
	        if ((maxWireVersion >= 9 || error.hasErrorLabel(exports.MongoErrorLabel.RetryableWriteError)) &&
	            !error.hasErrorLabel(exports.MongoErrorLabel.HandshakeError)) {
	            // If we already have the error label no need to add it again. 4.4+ servers add the label.
	            // In the case where we have a handshake error, need to fall down to the logic checking
	            // the codes.
	            return false;
	        }
	    }
	    if (error instanceof MongoWriteConcernError) {
	        return RETRYABLE_WRITE_ERROR_CODES.has(error.result?.code ?? error.code ?? 0);
	    }
	    if (error instanceof MongoError && typeof error.code === 'number') {
	        return RETRYABLE_WRITE_ERROR_CODES.has(error.code);
	    }
	    const isNotWritablePrimaryError = exports.LEGACY_NOT_WRITABLE_PRIMARY_ERROR_MESSAGE.test(error.message);
	    if (isNotWritablePrimaryError) {
	        return true;
	    }
	    const isNodeIsRecoveringError = exports.NODE_IS_RECOVERING_ERROR_MESSAGE.test(error.message);
	    if (isNodeIsRecoveringError) {
	        return true;
	    }
	    return false;
	}
	exports.needsRetryableWriteLabel = needsRetryableWriteLabel;
	function isRetryableWriteError(error) {
	    return error.hasErrorLabel(exports.MongoErrorLabel.RetryableWriteError);
	}
	exports.isRetryableWriteError = isRetryableWriteError;
	/** Determines whether an error is something the driver should attempt to retry */
	function isRetryableReadError(error) {
	    const hasRetryableErrorCode = typeof error.code === 'number' ? RETRYABLE_READ_ERROR_CODES.has(error.code) : false;
	    if (hasRetryableErrorCode) {
	        return true;
	    }
	    if (error instanceof MongoNetworkError) {
	        return true;
	    }
	    const isNotWritablePrimaryError = exports.LEGACY_NOT_WRITABLE_PRIMARY_ERROR_MESSAGE.test(error.message);
	    if (isNotWritablePrimaryError) {
	        return true;
	    }
	    const isNodeIsRecoveringError = exports.NODE_IS_RECOVERING_ERROR_MESSAGE.test(error.message);
	    if (isNodeIsRecoveringError) {
	        return true;
	    }
	    return false;
	}
	exports.isRetryableReadError = isRetryableReadError;
	const SDAM_RECOVERING_CODES = new Set([
	    exports.MONGODB_ERROR_CODES.ShutdownInProgress,
	    exports.MONGODB_ERROR_CODES.PrimarySteppedDown,
	    exports.MONGODB_ERROR_CODES.InterruptedAtShutdown,
	    exports.MONGODB_ERROR_CODES.InterruptedDueToReplStateChange,
	    exports.MONGODB_ERROR_CODES.NotPrimaryOrSecondary
	]);
	const SDAM_NOT_PRIMARY_CODES = new Set([
	    exports.MONGODB_ERROR_CODES.NotWritablePrimary,
	    exports.MONGODB_ERROR_CODES.NotPrimaryNoSecondaryOk,
	    exports.MONGODB_ERROR_CODES.LegacyNotPrimary
	]);
	const SDAM_NODE_SHUTTING_DOWN_ERROR_CODES = new Set([
	    exports.MONGODB_ERROR_CODES.InterruptedAtShutdown,
	    exports.MONGODB_ERROR_CODES.ShutdownInProgress
	]);
	function isRecoveringError(err) {
	    if (typeof err.code === 'number') {
	        // If any error code exists, we ignore the error.message
	        return SDAM_RECOVERING_CODES.has(err.code);
	    }
	    return (exports.LEGACY_NOT_PRIMARY_OR_SECONDARY_ERROR_MESSAGE.test(err.message) ||
	        exports.NODE_IS_RECOVERING_ERROR_MESSAGE.test(err.message));
	}
	function isNotWritablePrimaryError(err) {
	    if (typeof err.code === 'number') {
	        // If any error code exists, we ignore the error.message
	        return SDAM_NOT_PRIMARY_CODES.has(err.code);
	    }
	    if (isRecoveringError(err)) {
	        return false;
	    }
	    return exports.LEGACY_NOT_WRITABLE_PRIMARY_ERROR_MESSAGE.test(err.message);
	}
	function isNodeShuttingDownError(err) {
	    return !!(typeof err.code === 'number' && SDAM_NODE_SHUTTING_DOWN_ERROR_CODES.has(err.code));
	}
	exports.isNodeShuttingDownError = isNodeShuttingDownError;
	/**
	 * Determines whether SDAM can recover from a given error. If it cannot
	 * then the pool will be cleared, and server state will completely reset
	 * locally.
	 *
	 * @see https://github.com/mongodb/specifications/blob/master/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#not-master-and-node-is-recovering
	 */
	function isSDAMUnrecoverableError(error) {
	    // NOTE: null check is here for a strictly pre-CMAP world, a timeout or
	    //       close event are considered unrecoverable
	    if (error instanceof MongoParseError || error == null) {
	        return true;
	    }
	    return isRecoveringError(error) || isNotWritablePrimaryError(error);
	}
	exports.isSDAMUnrecoverableError = isSDAMUnrecoverableError;
	function isNetworkTimeoutError(err) {
	    return !!(err instanceof MongoNetworkError && err.message.match(/timed out/));
	}
	exports.isNetworkTimeoutError = isNetworkTimeoutError;
	function isResumableError(error, wireVersion) {
	    if (error == null || !(error instanceof MongoError)) {
	        return false;
	    }
	    if (error instanceof MongoNetworkError) {
	        return true;
	    }
	    if (wireVersion != null && wireVersion >= 9) {
	        // DRIVERS-1308: For 4.4 drivers running against 4.4 servers, drivers will add a special case to treat the CursorNotFound error code as resumable
	        if (error.code === exports.MONGODB_ERROR_CODES.CursorNotFound) {
	            return true;
	        }
	        return error.hasErrorLabel(exports.MongoErrorLabel.ResumableChangeStreamError);
	    }
	    if (typeof error.code === 'number') {
	        return exports.GET_MORE_RESUMABLE_CODES.has(error.code);
	    }
	    return false;
	}
	exports.isResumableError = isResumableError;
	
} (error));

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var utils = {};

const require$$1$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(http);

const require$$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(url);

var bson = {};

const require$$0$8 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(bson$1);

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveBSONOptions = exports.pluckBSONSerializeOptions = exports.Timestamp = exports.serialize = exports.ObjectId = exports.MinKey = exports.MaxKey = exports.Long = exports.Int32 = exports.Double = exports.deserialize = exports.Decimal128 = exports.DBRef = exports.Code = exports.calculateObjectSize = exports.BSONType = exports.BSONSymbol = exports.BSONRegExp = exports.BSON = exports.Binary = void 0;
	var bson_1 = require$$0$8;
	Object.defineProperty(exports, "Binary", { enumerable: true, get: function () { return bson_1.Binary; } });
	Object.defineProperty(exports, "BSON", { enumerable: true, get: function () { return bson_1.BSON; } });
	Object.defineProperty(exports, "BSONRegExp", { enumerable: true, get: function () { return bson_1.BSONRegExp; } });
	Object.defineProperty(exports, "BSONSymbol", { enumerable: true, get: function () { return bson_1.BSONSymbol; } });
	Object.defineProperty(exports, "BSONType", { enumerable: true, get: function () { return bson_1.BSONType; } });
	Object.defineProperty(exports, "calculateObjectSize", { enumerable: true, get: function () { return bson_1.calculateObjectSize; } });
	Object.defineProperty(exports, "Code", { enumerable: true, get: function () { return bson_1.Code; } });
	Object.defineProperty(exports, "DBRef", { enumerable: true, get: function () { return bson_1.DBRef; } });
	Object.defineProperty(exports, "Decimal128", { enumerable: true, get: function () { return bson_1.Decimal128; } });
	Object.defineProperty(exports, "deserialize", { enumerable: true, get: function () { return bson_1.deserialize; } });
	Object.defineProperty(exports, "Double", { enumerable: true, get: function () { return bson_1.Double; } });
	Object.defineProperty(exports, "Int32", { enumerable: true, get: function () { return bson_1.Int32; } });
	Object.defineProperty(exports, "Long", { enumerable: true, get: function () { return bson_1.Long; } });
	Object.defineProperty(exports, "MaxKey", { enumerable: true, get: function () { return bson_1.MaxKey; } });
	Object.defineProperty(exports, "MinKey", { enumerable: true, get: function () { return bson_1.MinKey; } });
	Object.defineProperty(exports, "ObjectId", { enumerable: true, get: function () { return bson_1.ObjectId; } });
	Object.defineProperty(exports, "serialize", { enumerable: true, get: function () { return bson_1.serialize; } });
	Object.defineProperty(exports, "Timestamp", { enumerable: true, get: function () { return bson_1.Timestamp; } });
	function pluckBSONSerializeOptions(options) {
	    const { fieldsAsRaw, useBigInt64, promoteValues, promoteBuffers, promoteLongs, serializeFunctions, ignoreUndefined, bsonRegExp, raw, enableUtf8Validation } = options;
	    return {
	        fieldsAsRaw,
	        useBigInt64,
	        promoteValues,
	        promoteBuffers,
	        promoteLongs,
	        serializeFunctions,
	        ignoreUndefined,
	        bsonRegExp,
	        raw,
	        enableUtf8Validation
	    };
	}
	exports.pluckBSONSerializeOptions = pluckBSONSerializeOptions;
	/**
	 * Merge the given BSONSerializeOptions, preferring options over the parent's options, and
	 * substituting defaults for values not set.
	 *
	 * @internal
	 */
	function resolveBSONOptions(options, parent) {
	    const parentOptions = parent?.bsonOptions;
	    return {
	        raw: options?.raw ?? parentOptions?.raw ?? false,
	        useBigInt64: options?.useBigInt64 ?? parentOptions?.useBigInt64 ?? false,
	        promoteLongs: options?.promoteLongs ?? parentOptions?.promoteLongs ?? true,
	        promoteValues: options?.promoteValues ?? parentOptions?.promoteValues ?? true,
	        promoteBuffers: options?.promoteBuffers ?? parentOptions?.promoteBuffers ?? false,
	        ignoreUndefined: options?.ignoreUndefined ?? parentOptions?.ignoreUndefined ?? false,
	        bsonRegExp: options?.bsonRegExp ?? parentOptions?.bsonRegExp ?? false,
	        serializeFunctions: options?.serializeFunctions ?? parentOptions?.serializeFunctions ?? false,
	        fieldsAsRaw: options?.fieldsAsRaw ?? parentOptions?.fieldsAsRaw ?? {},
	        enableUtf8Validation: options?.enableUtf8Validation ?? parentOptions?.enableUtf8Validation ?? true
	    };
	}
	exports.resolveBSONOptions = resolveBSONOptions;
	
} (bson));

var constants$1 = {};

Object.defineProperty(constants$1, "__esModule", { value: true });
constants$1.OP_MSG = constants$1.OP_COMPRESSED = constants$1.OP_DELETE = constants$1.OP_QUERY = constants$1.OP_INSERT = constants$1.OP_UPDATE = constants$1.OP_REPLY = constants$1.MIN_SUPPORTED_QE_SERVER_VERSION = constants$1.MIN_SUPPORTED_QE_WIRE_VERSION = constants$1.MAX_SUPPORTED_WIRE_VERSION = constants$1.MIN_SUPPORTED_WIRE_VERSION = constants$1.MAX_SUPPORTED_SERVER_VERSION = constants$1.MIN_SUPPORTED_SERVER_VERSION = void 0;
constants$1.MIN_SUPPORTED_SERVER_VERSION = '3.6';
constants$1.MAX_SUPPORTED_SERVER_VERSION = '7.0';
constants$1.MIN_SUPPORTED_WIRE_VERSION = 6;
constants$1.MAX_SUPPORTED_WIRE_VERSION = 21;
constants$1.MIN_SUPPORTED_QE_WIRE_VERSION = 21;
constants$1.MIN_SUPPORTED_QE_SERVER_VERSION = '7.0';
constants$1.OP_REPLY = 1;
constants$1.OP_UPDATE = 2001;
constants$1.OP_INSERT = 2002;
constants$1.OP_QUERY = 2004;
constants$1.OP_DELETE = 2006;
constants$1.OP_COMPRESSED = 2012;
constants$1.OP_MSG = 2013;

var constants = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TOPOLOGY_EVENTS = exports.CMAP_EVENTS = exports.HEARTBEAT_EVENTS = exports.RESUME_TOKEN_CHANGED = exports.END = exports.CHANGE = exports.INIT = exports.MORE = exports.RESPONSE = exports.SERVER_HEARTBEAT_FAILED = exports.SERVER_HEARTBEAT_SUCCEEDED = exports.SERVER_HEARTBEAT_STARTED = exports.COMMAND_FAILED = exports.COMMAND_SUCCEEDED = exports.COMMAND_STARTED = exports.CLUSTER_TIME_RECEIVED = exports.CONNECTION_CHECKED_IN = exports.CONNECTION_CHECKED_OUT = exports.CONNECTION_CHECK_OUT_FAILED = exports.CONNECTION_CHECK_OUT_STARTED = exports.CONNECTION_CLOSED = exports.CONNECTION_READY = exports.CONNECTION_CREATED = exports.CONNECTION_POOL_READY = exports.CONNECTION_POOL_CLEARED = exports.CONNECTION_POOL_CLOSED = exports.CONNECTION_POOL_CREATED = exports.TOPOLOGY_DESCRIPTION_CHANGED = exports.TOPOLOGY_CLOSED = exports.TOPOLOGY_OPENING = exports.SERVER_DESCRIPTION_CHANGED = exports.SERVER_CLOSED = exports.SERVER_OPENING = exports.DESCRIPTION_RECEIVED = exports.UNPINNED = exports.PINNED = exports.MESSAGE = exports.ENDED = exports.CLOSED = exports.CONNECT = exports.OPEN = exports.CLOSE = exports.TIMEOUT = exports.ERROR = exports.SYSTEM_JS_COLLECTION = exports.SYSTEM_COMMAND_COLLECTION = exports.SYSTEM_USER_COLLECTION = exports.SYSTEM_PROFILE_COLLECTION = exports.SYSTEM_INDEX_COLLECTION = exports.SYSTEM_NAMESPACE_COLLECTION = void 0;
	exports.LEGACY_HELLO_COMMAND_CAMEL_CASE = exports.LEGACY_HELLO_COMMAND = exports.MONGO_CLIENT_EVENTS = exports.LOCAL_SERVER_EVENTS = exports.SERVER_RELAY_EVENTS = exports.APM_EVENTS = void 0;
	exports.SYSTEM_NAMESPACE_COLLECTION = 'system.namespaces';
	exports.SYSTEM_INDEX_COLLECTION = 'system.indexes';
	exports.SYSTEM_PROFILE_COLLECTION = 'system.profile';
	exports.SYSTEM_USER_COLLECTION = 'system.users';
	exports.SYSTEM_COMMAND_COLLECTION = '$cmd';
	exports.SYSTEM_JS_COLLECTION = 'system.js';
	// events
	exports.ERROR = 'error';
	exports.TIMEOUT = 'timeout';
	exports.CLOSE = 'close';
	exports.OPEN = 'open';
	exports.CONNECT = 'connect';
	exports.CLOSED = 'closed';
	exports.ENDED = 'ended';
	exports.MESSAGE = 'message';
	exports.PINNED = 'pinned';
	exports.UNPINNED = 'unpinned';
	exports.DESCRIPTION_RECEIVED = 'descriptionReceived';
	exports.SERVER_OPENING = 'serverOpening';
	exports.SERVER_CLOSED = 'serverClosed';
	exports.SERVER_DESCRIPTION_CHANGED = 'serverDescriptionChanged';
	exports.TOPOLOGY_OPENING = 'topologyOpening';
	exports.TOPOLOGY_CLOSED = 'topologyClosed';
	exports.TOPOLOGY_DESCRIPTION_CHANGED = 'topologyDescriptionChanged';
	/** @internal */
	exports.CONNECTION_POOL_CREATED = 'connectionPoolCreated';
	/** @internal */
	exports.CONNECTION_POOL_CLOSED = 'connectionPoolClosed';
	/** @internal */
	exports.CONNECTION_POOL_CLEARED = 'connectionPoolCleared';
	/** @internal */
	exports.CONNECTION_POOL_READY = 'connectionPoolReady';
	/** @internal */
	exports.CONNECTION_CREATED = 'connectionCreated';
	/** @internal */
	exports.CONNECTION_READY = 'connectionReady';
	/** @internal */
	exports.CONNECTION_CLOSED = 'connectionClosed';
	/** @internal */
	exports.CONNECTION_CHECK_OUT_STARTED = 'connectionCheckOutStarted';
	/** @internal */
	exports.CONNECTION_CHECK_OUT_FAILED = 'connectionCheckOutFailed';
	/** @internal */
	exports.CONNECTION_CHECKED_OUT = 'connectionCheckedOut';
	/** @internal */
	exports.CONNECTION_CHECKED_IN = 'connectionCheckedIn';
	exports.CLUSTER_TIME_RECEIVED = 'clusterTimeReceived';
	exports.COMMAND_STARTED = 'commandStarted';
	exports.COMMAND_SUCCEEDED = 'commandSucceeded';
	exports.COMMAND_FAILED = 'commandFailed';
	exports.SERVER_HEARTBEAT_STARTED = 'serverHeartbeatStarted';
	exports.SERVER_HEARTBEAT_SUCCEEDED = 'serverHeartbeatSucceeded';
	exports.SERVER_HEARTBEAT_FAILED = 'serverHeartbeatFailed';
	exports.RESPONSE = 'response';
	exports.MORE = 'more';
	exports.INIT = 'init';
	exports.CHANGE = 'change';
	exports.END = 'end';
	exports.RESUME_TOKEN_CHANGED = 'resumeTokenChanged';
	/** @public */
	exports.HEARTBEAT_EVENTS = Object.freeze([
	    exports.SERVER_HEARTBEAT_STARTED,
	    exports.SERVER_HEARTBEAT_SUCCEEDED,
	    exports.SERVER_HEARTBEAT_FAILED
	]);
	/** @public */
	exports.CMAP_EVENTS = Object.freeze([
	    exports.CONNECTION_POOL_CREATED,
	    exports.CONNECTION_POOL_READY,
	    exports.CONNECTION_POOL_CLEARED,
	    exports.CONNECTION_POOL_CLOSED,
	    exports.CONNECTION_CREATED,
	    exports.CONNECTION_READY,
	    exports.CONNECTION_CLOSED,
	    exports.CONNECTION_CHECK_OUT_STARTED,
	    exports.CONNECTION_CHECK_OUT_FAILED,
	    exports.CONNECTION_CHECKED_OUT,
	    exports.CONNECTION_CHECKED_IN
	]);
	/** @public */
	exports.TOPOLOGY_EVENTS = Object.freeze([
	    exports.SERVER_OPENING,
	    exports.SERVER_CLOSED,
	    exports.SERVER_DESCRIPTION_CHANGED,
	    exports.TOPOLOGY_OPENING,
	    exports.TOPOLOGY_CLOSED,
	    exports.TOPOLOGY_DESCRIPTION_CHANGED,
	    exports.ERROR,
	    exports.TIMEOUT,
	    exports.CLOSE
	]);
	/** @public */
	exports.APM_EVENTS = Object.freeze([
	    exports.COMMAND_STARTED,
	    exports.COMMAND_SUCCEEDED,
	    exports.COMMAND_FAILED
	]);
	/**
	 * All events that we relay to the `Topology`
	 * @internal
	 */
	exports.SERVER_RELAY_EVENTS = Object.freeze([
	    exports.SERVER_HEARTBEAT_STARTED,
	    exports.SERVER_HEARTBEAT_SUCCEEDED,
	    exports.SERVER_HEARTBEAT_FAILED,
	    exports.COMMAND_STARTED,
	    exports.COMMAND_SUCCEEDED,
	    exports.COMMAND_FAILED,
	    ...exports.CMAP_EVENTS
	]);
	/**
	 * All events we listen to from `Server` instances, but do not forward to the client
	 * @internal
	 */
	exports.LOCAL_SERVER_EVENTS = Object.freeze([
	    exports.CONNECT,
	    exports.DESCRIPTION_RECEIVED,
	    exports.CLOSED,
	    exports.ENDED
	]);
	/** @public */
	exports.MONGO_CLIENT_EVENTS = Object.freeze([
	    ...exports.CMAP_EVENTS,
	    ...exports.APM_EVENTS,
	    ...exports.TOPOLOGY_EVENTS,
	    ...exports.HEARTBEAT_EVENTS
	]);
	/**
	 * @internal
	 * The legacy hello command that was deprecated in MongoDB 5.0.
	 */
	exports.LEGACY_HELLO_COMMAND = 'ismaster';
	/**
	 * @internal
	 * The legacy hello command that was deprecated in MongoDB 5.0.
	 */
	exports.LEGACY_HELLO_COMMAND_CAMEL_CASE = 'isMaster';
	
} (constants));

var read_concern = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadConcern = exports.ReadConcernLevel = void 0;
	/** @public */
	exports.ReadConcernLevel = Object.freeze({
	    local: 'local',
	    majority: 'majority',
	    linearizable: 'linearizable',
	    available: 'available',
	    snapshot: 'snapshot'
	});
	/**
	 * The MongoDB ReadConcern, which allows for control of the consistency and isolation properties
	 * of the data read from replica sets and replica set shards.
	 * @public
	 *
	 * @see https://www.mongodb.com/docs/manual/reference/read-concern/index.html
	 */
	class ReadConcern {
	    /** Constructs a ReadConcern from the read concern level.*/
	    constructor(level) {
	        /**
	         * A spec test exists that allows level to be any string.
	         * "invalid readConcern with out stage"
	         * @see ./test/spec/crud/v2/aggregate-out-readConcern.json
	         * @see https://github.com/mongodb/specifications/blob/master/source/read-write-concern/read-write-concern.rst#unknown-levels-and-additional-options-for-string-based-readconcerns
	         */
	        this.level = exports.ReadConcernLevel[level] ?? level;
	    }
	    /**
	     * Construct a ReadConcern given an options object.
	     *
	     * @param options - The options object from which to extract the write concern.
	     */
	    static fromOptions(options) {
	        if (options == null) {
	            return;
	        }
	        if (options.readConcern) {
	            const { readConcern } = options;
	            if (readConcern instanceof ReadConcern) {
	                return readConcern;
	            }
	            else if (typeof readConcern === 'string') {
	                return new ReadConcern(readConcern);
	            }
	            else if ('level' in readConcern && readConcern.level) {
	                return new ReadConcern(readConcern.level);
	            }
	        }
	        if (options.level) {
	            return new ReadConcern(options.level);
	        }
	        return;
	    }
	    static get MAJORITY() {
	        return exports.ReadConcernLevel.majority;
	    }
	    static get AVAILABLE() {
	        return exports.ReadConcernLevel.available;
	    }
	    static get LINEARIZABLE() {
	        return exports.ReadConcernLevel.linearizable;
	    }
	    static get SNAPSHOT() {
	        return exports.ReadConcernLevel.snapshot;
	    }
	    toJSON() {
	        return { level: this.level };
	    }
	}
	exports.ReadConcern = ReadConcern;
	
} (read_concern));

var read_preference = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadPreference = exports.ReadPreferenceMode = void 0;
	const error_1 = error;
	/** @public */
	exports.ReadPreferenceMode = Object.freeze({
	    primary: 'primary',
	    primaryPreferred: 'primaryPreferred',
	    secondary: 'secondary',
	    secondaryPreferred: 'secondaryPreferred',
	    nearest: 'nearest'
	});
	/**
	 * The **ReadPreference** class is a class that represents a MongoDB ReadPreference and is
	 * used to construct connections.
	 * @public
	 *
	 * @see https://www.mongodb.com/docs/manual/core/read-preference/
	 */
	class ReadPreference {
	    /**
	     * @param mode - A string describing the read preference mode (primary|primaryPreferred|secondary|secondaryPreferred|nearest)
	     * @param tags - A tag set used to target reads to members with the specified tag(s). tagSet is not available if using read preference mode primary.
	     * @param options - Additional read preference options
	     */
	    constructor(mode, tags, options) {
	        if (!ReadPreference.isValid(mode)) {
	            throw new error_1.MongoInvalidArgumentError(`Invalid read preference mode ${JSON.stringify(mode)}`);
	        }
	        if (options == null && typeof tags === 'object' && !Array.isArray(tags)) {
	            options = tags;
	            tags = undefined;
	        }
	        else if (tags && !Array.isArray(tags)) {
	            throw new error_1.MongoInvalidArgumentError('ReadPreference tags must be an array');
	        }
	        this.mode = mode;
	        this.tags = tags;
	        this.hedge = options?.hedge;
	        this.maxStalenessSeconds = undefined;
	        this.minWireVersion = undefined;
	        options = options ?? {};
	        if (options.maxStalenessSeconds != null) {
	            if (options.maxStalenessSeconds <= 0) {
	                throw new error_1.MongoInvalidArgumentError('maxStalenessSeconds must be a positive integer');
	            }
	            this.maxStalenessSeconds = options.maxStalenessSeconds;
	            // NOTE: The minimum required wire version is 5 for this read preference. If the existing
	            //       topology has a lower value then a MongoError will be thrown during server selection.
	            this.minWireVersion = 5;
	        }
	        if (this.mode === ReadPreference.PRIMARY) {
	            if (this.tags && Array.isArray(this.tags) && this.tags.length > 0) {
	                throw new error_1.MongoInvalidArgumentError('Primary read preference cannot be combined with tags');
	            }
	            if (this.maxStalenessSeconds) {
	                throw new error_1.MongoInvalidArgumentError('Primary read preference cannot be combined with maxStalenessSeconds');
	            }
	            if (this.hedge) {
	                throw new error_1.MongoInvalidArgumentError('Primary read preference cannot be combined with hedge');
	            }
	        }
	    }
	    // Support the deprecated `preference` property introduced in the porcelain layer
	    get preference() {
	        return this.mode;
	    }
	    static fromString(mode) {
	        return new ReadPreference(mode);
	    }
	    /**
	     * Construct a ReadPreference given an options object.
	     *
	     * @param options - The options object from which to extract the read preference.
	     */
	    static fromOptions(options) {
	        if (!options)
	            return;
	        const readPreference = options.readPreference ?? options.session?.transaction.options.readPreference;
	        const readPreferenceTags = options.readPreferenceTags;
	        if (readPreference == null) {
	            return;
	        }
	        if (typeof readPreference === 'string') {
	            return new ReadPreference(readPreference, readPreferenceTags, {
	                maxStalenessSeconds: options.maxStalenessSeconds,
	                hedge: options.hedge
	            });
	        }
	        else if (!(readPreference instanceof ReadPreference) && typeof readPreference === 'object') {
	            const mode = readPreference.mode || readPreference.preference;
	            if (mode && typeof mode === 'string') {
	                return new ReadPreference(mode, readPreference.tags ?? readPreferenceTags, {
	                    maxStalenessSeconds: readPreference.maxStalenessSeconds,
	                    hedge: options.hedge
	                });
	            }
	        }
	        if (readPreferenceTags) {
	            readPreference.tags = readPreferenceTags;
	        }
	        return readPreference;
	    }
	    /**
	     * Replaces options.readPreference with a ReadPreference instance
	     */
	    static translate(options) {
	        if (options.readPreference == null)
	            return options;
	        const r = options.readPreference;
	        if (typeof r === 'string') {
	            options.readPreference = new ReadPreference(r);
	        }
	        else if (r && !(r instanceof ReadPreference) && typeof r === 'object') {
	            const mode = r.mode || r.preference;
	            if (mode && typeof mode === 'string') {
	                options.readPreference = new ReadPreference(mode, r.tags, {
	                    maxStalenessSeconds: r.maxStalenessSeconds
	                });
	            }
	        }
	        else if (!(r instanceof ReadPreference)) {
	            throw new error_1.MongoInvalidArgumentError(`Invalid read preference: ${r}`);
	        }
	        return options;
	    }
	    /**
	     * Validate if a mode is legal
	     *
	     * @param mode - The string representing the read preference mode.
	     */
	    static isValid(mode) {
	        const VALID_MODES = new Set([
	            ReadPreference.PRIMARY,
	            ReadPreference.PRIMARY_PREFERRED,
	            ReadPreference.SECONDARY,
	            ReadPreference.SECONDARY_PREFERRED,
	            ReadPreference.NEAREST,
	            null
	        ]);
	        return VALID_MODES.has(mode);
	    }
	    /**
	     * Validate if a mode is legal
	     *
	     * @param mode - The string representing the read preference mode.
	     */
	    isValid(mode) {
	        return ReadPreference.isValid(typeof mode === 'string' ? mode : this.mode);
	    }
	    /**
	     * Indicates that this readPreference needs the "SecondaryOk" bit when sent over the wire
	     * @see https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/#op-query
	     */
	    secondaryOk() {
	        const NEEDS_SECONDARYOK = new Set([
	            ReadPreference.PRIMARY_PREFERRED,
	            ReadPreference.SECONDARY,
	            ReadPreference.SECONDARY_PREFERRED,
	            ReadPreference.NEAREST
	        ]);
	        return NEEDS_SECONDARYOK.has(this.mode);
	    }
	    /**
	     * Check if the two ReadPreferences are equivalent
	     *
	     * @param readPreference - The read preference with which to check equality
	     */
	    equals(readPreference) {
	        return readPreference.mode === this.mode;
	    }
	    /** Return JSON representation */
	    toJSON() {
	        const readPreference = { mode: this.mode };
	        if (Array.isArray(this.tags))
	            readPreference.tags = this.tags;
	        if (this.maxStalenessSeconds)
	            readPreference.maxStalenessSeconds = this.maxStalenessSeconds;
	        if (this.hedge)
	            readPreference.hedge = this.hedge;
	        return readPreference;
	    }
	}
	ReadPreference.PRIMARY = exports.ReadPreferenceMode.primary;
	ReadPreference.PRIMARY_PREFERRED = exports.ReadPreferenceMode.primaryPreferred;
	ReadPreference.SECONDARY = exports.ReadPreferenceMode.secondary;
	ReadPreference.SECONDARY_PREFERRED = exports.ReadPreferenceMode.secondaryPreferred;
	ReadPreference.NEAREST = exports.ReadPreferenceMode.nearest;
	ReadPreference.primary = new ReadPreference(exports.ReadPreferenceMode.primary);
	ReadPreference.primaryPreferred = new ReadPreference(exports.ReadPreferenceMode.primaryPreferred);
	ReadPreference.secondary = new ReadPreference(exports.ReadPreferenceMode.secondary);
	ReadPreference.secondaryPreferred = new ReadPreference(exports.ReadPreferenceMode.secondaryPreferred);
	ReadPreference.nearest = new ReadPreference(exports.ReadPreferenceMode.nearest);
	exports.ReadPreference = ReadPreference;
	
} (read_preference));

var common$1 = {};

const require$$0$7 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(timers);

Object.defineProperty(common$1, "__esModule", { value: true });
common$1._advanceClusterTime = common$1.drainTimerQueue = common$1.ServerType = common$1.TopologyType = common$1.STATE_CONNECTED = common$1.STATE_CONNECTING = common$1.STATE_CLOSED = common$1.STATE_CLOSING = void 0;
const timers_1$2 = require$$0$7;
// shared state names
common$1.STATE_CLOSING = 'closing';
common$1.STATE_CLOSED = 'closed';
common$1.STATE_CONNECTING = 'connecting';
common$1.STATE_CONNECTED = 'connected';
/**
 * An enumeration of topology types we know about
 * @public
 */
common$1.TopologyType = Object.freeze({
    Single: 'Single',
    ReplicaSetNoPrimary: 'ReplicaSetNoPrimary',
    ReplicaSetWithPrimary: 'ReplicaSetWithPrimary',
    Sharded: 'Sharded',
    Unknown: 'Unknown',
    LoadBalanced: 'LoadBalanced'
});
/**
 * An enumeration of server types we know about
 * @public
 */
common$1.ServerType = Object.freeze({
    Standalone: 'Standalone',
    Mongos: 'Mongos',
    PossiblePrimary: 'PossiblePrimary',
    RSPrimary: 'RSPrimary',
    RSSecondary: 'RSSecondary',
    RSArbiter: 'RSArbiter',
    RSOther: 'RSOther',
    RSGhost: 'RSGhost',
    Unknown: 'Unknown',
    LoadBalancer: 'LoadBalancer'
});
/** @internal */
function drainTimerQueue(queue) {
    queue.forEach(timers_1$2.clearTimeout);
    queue.clear();
}
common$1.drainTimerQueue = drainTimerQueue;
/** Shared function to determine clusterTime for a given topology or session */
function _advanceClusterTime(entity, $clusterTime) {
    if (entity.clusterTime == null) {
        entity.clusterTime = $clusterTime;
    }
    else {
        if ($clusterTime.clusterTime.greaterThan(entity.clusterTime.clusterTime)) {
            entity.clusterTime = $clusterTime;
        }
    }
}
common$1._advanceClusterTime = _advanceClusterTime;

var write_concern = {};

Object.defineProperty(write_concern, "__esModule", { value: true });
write_concern.WriteConcern = write_concern.WRITE_CONCERN_KEYS = void 0;
write_concern.WRITE_CONCERN_KEYS = ['w', 'wtimeout', 'j', 'journal', 'fsync'];
/**
 * A MongoDB WriteConcern, which describes the level of acknowledgement
 * requested from MongoDB for write operations.
 * @public
 *
 * @see https://www.mongodb.com/docs/manual/reference/write-concern/
 */
class WriteConcern {
    /**
     * Constructs a WriteConcern from the write concern properties.
     * @param w - request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags.
     * @param wtimeoutMS - specify a time limit to prevent write operations from blocking indefinitely
     * @param journal - request acknowledgment that the write operation has been written to the on-disk journal
     * @param fsync - equivalent to the j option. Is deprecated and will be removed in the next major version.
     */
    constructor(w, wtimeoutMS, journal, fsync) {
        if (w != null) {
            if (!Number.isNaN(Number(w))) {
                this.w = Number(w);
            }
            else {
                this.w = w;
            }
        }
        if (wtimeoutMS != null) {
            this.wtimeoutMS = this.wtimeout = wtimeoutMS;
        }
        if (journal != null) {
            this.journal = this.j = journal;
        }
        if (fsync != null) {
            this.journal = this.j = fsync ? true : false;
        }
    }
    /**
     * Apply a write concern to a command document. Will modify and return the command.
     */
    static apply(command, writeConcern) {
        const wc = {};
        // The write concern document sent to the server has w/wtimeout/j fields.
        if (writeConcern.w != null)
            wc.w = writeConcern.w;
        if (writeConcern.wtimeoutMS != null)
            wc.wtimeout = writeConcern.wtimeoutMS;
        if (writeConcern.journal != null)
            wc.j = writeConcern.j;
        command.writeConcern = wc;
        return command;
    }
    /** Construct a WriteConcern given an options object. */
    static fromOptions(options, inherit) {
        if (options == null)
            return undefined;
        inherit = inherit ?? {};
        let opts;
        if (typeof options === 'string' || typeof options === 'number') {
            opts = { w: options };
        }
        else if (options instanceof WriteConcern) {
            opts = options;
        }
        else {
            opts = options.writeConcern;
        }
        const parentOpts = inherit instanceof WriteConcern ? inherit : inherit.writeConcern;
        const { w = undefined, wtimeout = undefined, j = undefined, fsync = undefined, journal = undefined, wtimeoutMS = undefined } = {
            ...parentOpts,
            ...opts
        };
        if (w != null ||
            wtimeout != null ||
            wtimeoutMS != null ||
            j != null ||
            journal != null ||
            fsync != null) {
            return new WriteConcern(w, wtimeout ?? wtimeoutMS, j ?? journal, fsync);
        }
        return undefined;
    }
}
write_concern.WriteConcern = WriteConcern;

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.matchesParentDomain = exports.parseUnsignedInteger = exports.parseInteger = exports.compareObjectId = exports.getMongoDBClientEncryption = exports.commandSupportsReadConcern = exports.shuffle = exports.supportsRetryableWrites = exports.enumToString = exports.emitWarningOnce = exports.emitWarning = exports.MONGODB_WARNING_CODE = exports.DEFAULT_PK_FACTORY = exports.HostAddress = exports.BufferPool = exports.List = exports.deepCopy = exports.isRecord = exports.setDifference = exports.isHello = exports.isSuperset = exports.resolveOptions = exports.hasAtomicOperators = exports.calculateDurationInMs = exports.now = exports.makeStateMachine = exports.errorStrictEqual = exports.arrayStrictEqual = exports.eachAsync = exports.maxWireVersion = exports.uuidV4 = exports.databaseNamespace = exports.maybeCallback = exports.makeCounter = exports.MongoDBCollectionNamespace = exports.MongoDBNamespace = exports.ns = exports.getTopology = exports.decorateWithExplain = exports.decorateWithReadConcern = exports.decorateWithCollation = exports.isPromiseLike = exports.applyRetryableWrites = exports.filterOptions = exports.mergeOptions = exports.isObject = exports.normalizeHintField = exports.checkCollectionName = exports.hostMatchesWildcards = exports.ByteUtils = void 0;
	exports.request = void 0;
	const crypto = require$$0$9;
	const http = require$$1$3;
	const url = require$$3;
	const url_1 = require$$3;
	const bson_1 = bson;
	const constants_1 = constants$1;
	const constants_2 = constants;
	const error_1 = error;
	const read_concern_1 = read_concern;
	const read_preference_1 = read_preference;
	const common_1 = common$1;
	const write_concern_1 = write_concern;
	exports.ByteUtils = {
	    toLocalBufferType(buffer) {
	        return Buffer.isBuffer(buffer)
	            ? buffer
	            : Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	    },
	    equals(seqA, seqB) {
	        return exports.ByteUtils.toLocalBufferType(seqA).equals(seqB);
	    },
	    compare(seqA, seqB) {
	        return exports.ByteUtils.toLocalBufferType(seqA).compare(seqB);
	    },
	    toBase64(uint8array) {
	        return exports.ByteUtils.toLocalBufferType(uint8array).toString('base64');
	    }
	};
	/**
	 * Determines if a connection's address matches a user provided list
	 * of domain wildcards.
	 */
	function hostMatchesWildcards(host, wildcards) {
	    for (const wildcard of wildcards) {
	        if (host === wildcard ||
	            (wildcard.startsWith('*.') && host?.endsWith(wildcard.substring(2, wildcard.length))) ||
	            (wildcard.startsWith('*/') && host?.endsWith(wildcard.substring(2, wildcard.length)))) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.hostMatchesWildcards = hostMatchesWildcards;
	/**
	 * Throws if collectionName is not a valid mongodb collection namespace.
	 * @internal
	 */
	function checkCollectionName(collectionName) {
	    if ('string' !== typeof collectionName) {
	        throw new error_1.MongoInvalidArgumentError('Collection name must be a String');
	    }
	    if (!collectionName || collectionName.indexOf('..') !== -1) {
	        throw new error_1.MongoInvalidArgumentError('Collection names cannot be empty');
	    }
	    if (collectionName.indexOf('$') !== -1 &&
	        collectionName.match(/((^\$cmd)|(oplog\.\$main))/) == null) {
	        // TODO(NODE-3483): Use MongoNamespace static method
	        throw new error_1.MongoInvalidArgumentError("Collection names must not contain '$'");
	    }
	    if (collectionName.match(/^\.|\.$/) != null) {
	        // TODO(NODE-3483): Use MongoNamespace static method
	        throw new error_1.MongoInvalidArgumentError("Collection names must not start or end with '.'");
	    }
	    // Validate that we are not passing 0x00 in the collection name
	    if (collectionName.indexOf('\x00') !== -1) {
	        // TODO(NODE-3483): Use MongoNamespace static method
	        throw new error_1.MongoInvalidArgumentError('Collection names cannot contain a null character');
	    }
	}
	exports.checkCollectionName = checkCollectionName;
	/**
	 * Ensure Hint field is in a shape we expect:
	 * - object of index names mapping to 1 or -1
	 * - just an index name
	 * @internal
	 */
	function normalizeHintField(hint) {
	    let finalHint = undefined;
	    if (typeof hint === 'string') {
	        finalHint = hint;
	    }
	    else if (Array.isArray(hint)) {
	        finalHint = {};
	        hint.forEach(param => {
	            finalHint[param] = 1;
	        });
	    }
	    else if (hint != null && typeof hint === 'object') {
	        finalHint = {};
	        for (const name in hint) {
	            finalHint[name] = hint[name];
	        }
	    }
	    return finalHint;
	}
	exports.normalizeHintField = normalizeHintField;
	const TO_STRING = (object) => Object.prototype.toString.call(object);
	/**
	 * Checks if arg is an Object:
	 * - **NOTE**: the check is based on the `[Symbol.toStringTag]() === 'Object'`
	 * @internal
	 */
	function isObject(arg) {
	    return '[object Object]' === TO_STRING(arg);
	}
	exports.isObject = isObject;
	/** @internal */
	function mergeOptions(target, source) {
	    return { ...target, ...source };
	}
	exports.mergeOptions = mergeOptions;
	/** @internal */
	function filterOptions(options, names) {
	    const filterOptions = {};
	    for (const name in options) {
	        if (names.includes(name)) {
	            filterOptions[name] = options[name];
	        }
	    }
	    // Filtered options
	    return filterOptions;
	}
	exports.filterOptions = filterOptions;
	/**
	 * Applies retryWrites: true to a command if retryWrites is set on the command's database.
	 * @internal
	 *
	 * @param target - The target command to which we will apply retryWrites.
	 * @param db - The database from which we can inherit a retryWrites value.
	 */
	function applyRetryableWrites(target, db) {
	    if (db && db.s.options?.retryWrites) {
	        target.retryWrites = true;
	    }
	    return target;
	}
	exports.applyRetryableWrites = applyRetryableWrites;
	/**
	 * Applies a write concern to a command based on well defined inheritance rules, optionally
	 * detecting support for the write concern in the first place.
	 * @internal
	 *
	 * @param target - the target command we will be applying the write concern to
	 * @param sources - sources where we can inherit default write concerns from
	 * @param options - optional settings passed into a command for write concern overrides
	 */
	/**
	 * Checks if a given value is a Promise
	 *
	 * @typeParam T - The resolution type of the possible promise
	 * @param value - An object that could be a promise
	 * @returns true if the provided value is a Promise
	 */
	function isPromiseLike(value) {
	    return !!value && typeof value.then === 'function';
	}
	exports.isPromiseLike = isPromiseLike;
	/**
	 * Applies collation to a given command.
	 * @internal
	 *
	 * @param command - the command on which to apply collation
	 * @param target - target of command
	 * @param options - options containing collation settings
	 */
	function decorateWithCollation(command, target, options) {
	    const capabilities = getTopology(target).capabilities;
	    if (options.collation && typeof options.collation === 'object') {
	        if (capabilities && capabilities.commandsTakeCollation) {
	            command.collation = options.collation;
	        }
	        else {
	            throw new error_1.MongoCompatibilityError(`Current topology does not support collation`);
	        }
	    }
	}
	exports.decorateWithCollation = decorateWithCollation;
	/**
	 * Applies a read concern to a given command.
	 * @internal
	 *
	 * @param command - the command on which to apply the read concern
	 * @param coll - the parent collection of the operation calling this method
	 */
	function decorateWithReadConcern(command, coll, options) {
	    if (options && options.session && options.session.inTransaction()) {
	        return;
	    }
	    const readConcern = Object.assign({}, command.readConcern || {});
	    if (coll.s.readConcern) {
	        Object.assign(readConcern, coll.s.readConcern);
	    }
	    if (Object.keys(readConcern).length > 0) {
	        Object.assign(command, { readConcern: readConcern });
	    }
	}
	exports.decorateWithReadConcern = decorateWithReadConcern;
	/**
	 * Applies an explain to a given command.
	 * @internal
	 *
	 * @param command - the command on which to apply the explain
	 * @param options - the options containing the explain verbosity
	 */
	function decorateWithExplain(command, explain) {
	    if (command.explain) {
	        return command;
	    }
	    return { explain: command, verbosity: explain.verbosity };
	}
	exports.decorateWithExplain = decorateWithExplain;
	/**
	 * A helper function to get the topology from a given provider. Throws
	 * if the topology cannot be found.
	 * @throws MongoNotConnectedError
	 * @internal
	 */
	function getTopology(provider) {
	    // MongoClient or ClientSession or AbstractCursor
	    if ('topology' in provider && provider.topology) {
	        return provider.topology;
	    }
	    else if ('client' in provider && provider.client.topology) {
	        return provider.client.topology;
	    }
	    throw new error_1.MongoNotConnectedError('MongoClient must be connected to perform this operation');
	}
	exports.getTopology = getTopology;
	/** @internal */
	function ns(ns) {
	    return MongoDBNamespace.fromString(ns);
	}
	exports.ns = ns;
	/** @public */
	class MongoDBNamespace {
	    /**
	     * Create a namespace object
	     *
	     * @param db - database name
	     * @param collection - collection name
	     */
	    constructor(db, collection) {
	        this.db = db;
	        this.collection = collection;
	        this.collection = collection === '' ? undefined : collection;
	    }
	    toString() {
	        return this.collection ? `${this.db}.${this.collection}` : this.db;
	    }
	    withCollection(collection) {
	        return new MongoDBCollectionNamespace(this.db, collection);
	    }
	    static fromString(namespace) {
	        if (typeof namespace !== 'string' || namespace === '') {
	            // TODO(NODE-3483): Replace with MongoNamespaceError
	            throw new error_1.MongoRuntimeError(`Cannot parse namespace from "${namespace}"`);
	        }
	        const [db, ...collectionParts] = namespace.split('.');
	        const collection = collectionParts.join('.');
	        return new MongoDBNamespace(db, collection === '' ? undefined : collection);
	    }
	}
	exports.MongoDBNamespace = MongoDBNamespace;
	/**
	 * @public
	 *
	 * A class representing a collection's namespace.  This class enforces (through Typescript) that
	 * the `collection` portion of the namespace is defined and should only be
	 * used in scenarios where this can be guaranteed.
	 */
	class MongoDBCollectionNamespace extends MongoDBNamespace {
	    constructor(db, collection) {
	        super(db, collection);
	        this.collection = collection;
	    }
	}
	exports.MongoDBCollectionNamespace = MongoDBCollectionNamespace;
	/** @internal */
	function* makeCounter(seed = 0) {
	    let count = seed;
	    while (true) {
	        const newCount = count;
	        count += 1;
	        yield newCount;
	    }
	}
	exports.makeCounter = makeCounter;
	function maybeCallback(promiseFn, callback) {
	    const promise = promiseFn();
	    if (callback == null) {
	        return promise;
	    }
	    promise.then(result => callback(undefined, result), error => callback(error));
	    return;
	}
	exports.maybeCallback = maybeCallback;
	/** @internal */
	function databaseNamespace(ns) {
	    return ns.split('.')[0];
	}
	exports.databaseNamespace = databaseNamespace;
	/**
	 * Synchronously Generate a UUIDv4
	 * @internal
	 */
	function uuidV4() {
	    const result = crypto.randomBytes(16);
	    result[6] = (result[6] & 0x0f) | 0x40;
	    result[8] = (result[8] & 0x3f) | 0x80;
	    return result;
	}
	exports.uuidV4 = uuidV4;
	/**
	 * A helper function for determining `maxWireVersion` between legacy and new topology instances
	 * @internal
	 */
	function maxWireVersion(topologyOrServer) {
	    if (topologyOrServer) {
	        if (topologyOrServer.loadBalanced) {
	            // Since we do not have a monitor, we assume the load balanced server is always
	            // pointed at the latest mongodb version. There is a risk that for on-prem
	            // deployments that don't upgrade immediately that this could alert to the
	            // application that a feature is available that is actually not.
	            return constants_1.MAX_SUPPORTED_WIRE_VERSION;
	        }
	        if (topologyOrServer.hello) {
	            return topologyOrServer.hello.maxWireVersion;
	        }
	        if ('lastHello' in topologyOrServer && typeof topologyOrServer.lastHello === 'function') {
	            const lastHello = topologyOrServer.lastHello();
	            if (lastHello) {
	                return lastHello.maxWireVersion;
	            }
	        }
	        if (topologyOrServer.description &&
	            'maxWireVersion' in topologyOrServer.description &&
	            topologyOrServer.description.maxWireVersion != null) {
	            return topologyOrServer.description.maxWireVersion;
	        }
	    }
	    return 0;
	}
	exports.maxWireVersion = maxWireVersion;
	/**
	 * Applies the function `eachFn` to each item in `arr`, in parallel.
	 * @internal
	 *
	 * @param arr - An array of items to asynchronously iterate over
	 * @param eachFn - A function to call on each item of the array. The callback signature is `(item, callback)`, where the callback indicates iteration is complete.
	 * @param callback - The callback called after every item has been iterated
	 */
	function eachAsync(arr, eachFn, callback) {
	    arr = arr || [];
	    let idx = 0;
	    let awaiting = 0;
	    for (idx = 0; idx < arr.length; ++idx) {
	        awaiting++;
	        eachFn(arr[idx], eachCallback);
	    }
	    if (awaiting === 0) {
	        callback();
	        return;
	    }
	    function eachCallback(err) {
	        awaiting--;
	        if (err) {
	            callback(err);
	            return;
	        }
	        if (idx === arr.length && awaiting <= 0) {
	            callback();
	        }
	    }
	}
	exports.eachAsync = eachAsync;
	/** @internal */
	function arrayStrictEqual(arr, arr2) {
	    if (!Array.isArray(arr) || !Array.isArray(arr2)) {
	        return false;
	    }
	    return arr.length === arr2.length && arr.every((elt, idx) => elt === arr2[idx]);
	}
	exports.arrayStrictEqual = arrayStrictEqual;
	/** @internal */
	function errorStrictEqual(lhs, rhs) {
	    if (lhs === rhs) {
	        return true;
	    }
	    if (!lhs || !rhs) {
	        return lhs === rhs;
	    }
	    if ((lhs == null && rhs != null) || (lhs != null && rhs == null)) {
	        return false;
	    }
	    if (lhs.constructor.name !== rhs.constructor.name) {
	        return false;
	    }
	    if (lhs.message !== rhs.message) {
	        return false;
	    }
	    return true;
	}
	exports.errorStrictEqual = errorStrictEqual;
	/** @internal */
	function makeStateMachine(stateTable) {
	    return function stateTransition(target, newState) {
	        const legalStates = stateTable[target.s.state];
	        if (legalStates && legalStates.indexOf(newState) < 0) {
	            throw new error_1.MongoRuntimeError(`illegal state transition from [${target.s.state}] => [${newState}], allowed: [${legalStates}]`);
	        }
	        target.emit('stateChanged', target.s.state, newState);
	        target.s.state = newState;
	    };
	}
	exports.makeStateMachine = makeStateMachine;
	/** @internal */
	function now() {
	    const hrtime = process.hrtime();
	    return Math.floor(hrtime[0] * 1000 + hrtime[1] / 1000000);
	}
	exports.now = now;
	/** @internal */
	function calculateDurationInMs(started) {
	    if (typeof started !== 'number') {
	        throw new error_1.MongoInvalidArgumentError('Numeric value required to calculate duration');
	    }
	    const elapsed = now() - started;
	    return elapsed < 0 ? 0 : elapsed;
	}
	exports.calculateDurationInMs = calculateDurationInMs;
	/** @internal */
	function hasAtomicOperators(doc) {
	    if (Array.isArray(doc)) {
	        for (const document of doc) {
	            if (hasAtomicOperators(document)) {
	                return true;
	            }
	        }
	        return false;
	    }
	    const keys = Object.keys(doc);
	    return keys.length > 0 && keys[0][0] === '$';
	}
	exports.hasAtomicOperators = hasAtomicOperators;
	/**
	 * Merge inherited properties from parent into options, prioritizing values from options,
	 * then values from parent.
	 * @internal
	 */
	function resolveOptions(parent, options) {
	    const result = Object.assign({}, options, (0, bson_1.resolveBSONOptions)(options, parent));
	    // Users cannot pass a readConcern/writeConcern to operations in a transaction
	    const session = options?.session;
	    if (!session?.inTransaction()) {
	        const readConcern = read_concern_1.ReadConcern.fromOptions(options) ?? parent?.readConcern;
	        if (readConcern) {
	            result.readConcern = readConcern;
	        }
	        const writeConcern = write_concern_1.WriteConcern.fromOptions(options) ?? parent?.writeConcern;
	        if (writeConcern) {
	            result.writeConcern = writeConcern;
	        }
	    }
	    const readPreference = read_preference_1.ReadPreference.fromOptions(options) ?? parent?.readPreference;
	    if (readPreference) {
	        result.readPreference = readPreference;
	    }
	    return result;
	}
	exports.resolveOptions = resolveOptions;
	function isSuperset(set, subset) {
	    set = Array.isArray(set) ? new Set(set) : set;
	    subset = Array.isArray(subset) ? new Set(subset) : subset;
	    for (const elem of subset) {
	        if (!set.has(elem)) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.isSuperset = isSuperset;
	/**
	 * Checks if the document is a Hello request
	 * @internal
	 */
	function isHello(doc) {
	    return doc[constants_2.LEGACY_HELLO_COMMAND] || doc.hello ? true : false;
	}
	exports.isHello = isHello;
	/** Returns the items that are uniquely in setA */
	function setDifference(setA, setB) {
	    const difference = new Set(setA);
	    for (const elem of setB) {
	        difference.delete(elem);
	    }
	    return difference;
	}
	exports.setDifference = setDifference;
	const HAS_OWN = (object, prop) => Object.prototype.hasOwnProperty.call(object, prop);
	function isRecord(value, requiredKeys = undefined) {
	    if (!isObject(value)) {
	        return false;
	    }
	    const ctor = value.constructor;
	    if (ctor && ctor.prototype) {
	        if (!isObject(ctor.prototype)) {
	            return false;
	        }
	        // Check to see if some method exists from the Object exists
	        if (!HAS_OWN(ctor.prototype, 'isPrototypeOf')) {
	            return false;
	        }
	    }
	    if (requiredKeys) {
	        const keys = Object.keys(value);
	        return isSuperset(keys, requiredKeys);
	    }
	    return true;
	}
	exports.isRecord = isRecord;
	/**
	 * Make a deep copy of an object
	 *
	 * NOTE: This is not meant to be the perfect implementation of a deep copy,
	 * but instead something that is good enough for the purposes of
	 * command monitoring.
	 */
	function deepCopy(value) {
	    if (value == null) {
	        return value;
	    }
	    else if (Array.isArray(value)) {
	        return value.map(item => deepCopy(item));
	    }
	    else if (isRecord(value)) {
	        const res = {};
	        for (const key in value) {
	            res[key] = deepCopy(value[key]);
	        }
	        return res;
	    }
	    const ctor = value.constructor;
	    if (ctor) {
	        switch (ctor.name.toLowerCase()) {
	            case 'date':
	                return new ctor(Number(value));
	            case 'map':
	                return new Map(value);
	            case 'set':
	                return new Set(value);
	            case 'buffer':
	                return Buffer.from(value);
	        }
	    }
	    return value;
	}
	exports.deepCopy = deepCopy;
	/**
	 * A sequential list of items in a circularly linked list
	 * @remarks
	 * The head node is special, it is always defined and has a value of null.
	 * It is never "included" in the list, in that, it is not returned by pop/shift or yielded by the iterator.
	 * The circular linkage and always defined head node are to reduce checks for null next/prev references to zero.
	 * New nodes are declared as object literals with keys always in the same order: next, prev, value.
	 * @internal
	 */
	class List {
	    get length() {
	        return this.count;
	    }
	    get [Symbol.toStringTag]() {
	        return 'List';
	    }
	    constructor() {
	        this.count = 0;
	        // this is carefully crafted:
	        // declaring a complete and consistently key ordered
	        // object is beneficial to the runtime optimizations
	        this.head = {
	            next: null,
	            prev: null,
	            value: null
	        };
	        this.head.next = this.head;
	        this.head.prev = this.head;
	    }
	    toArray() {
	        return Array.from(this);
	    }
	    toString() {
	        return `head <=> ${this.toArray().join(' <=> ')} <=> head`;
	    }
	    *[Symbol.iterator]() {
	        for (const node of this.nodes()) {
	            yield node.value;
	        }
	    }
	    *nodes() {
	        let ptr = this.head.next;
	        while (ptr !== this.head) {
	            // Save next before yielding so that we make removing within iteration safe
	            const { next } = ptr;
	            yield ptr;
	            ptr = next;
	        }
	    }
	    /** Insert at end of list */
	    push(value) {
	        this.count += 1;
	        const newNode = {
	            next: this.head,
	            prev: this.head.prev,
	            value
	        };
	        this.head.prev.next = newNode;
	        this.head.prev = newNode;
	    }
	    /** Inserts every item inside an iterable instead of the iterable itself */
	    pushMany(iterable) {
	        for (const value of iterable) {
	            this.push(value);
	        }
	    }
	    /** Insert at front of list */
	    unshift(value) {
	        this.count += 1;
	        const newNode = {
	            next: this.head.next,
	            prev: this.head,
	            value
	        };
	        this.head.next.prev = newNode;
	        this.head.next = newNode;
	    }
	    remove(node) {
	        if (node === this.head || this.length === 0) {
	            return null;
	        }
	        this.count -= 1;
	        const prevNode = node.prev;
	        const nextNode = node.next;
	        prevNode.next = nextNode;
	        nextNode.prev = prevNode;
	        return node.value;
	    }
	    /** Removes the first node at the front of the list */
	    shift() {
	        return this.remove(this.head.next);
	    }
	    /** Removes the last node at the end of the list */
	    pop() {
	        return this.remove(this.head.prev);
	    }
	    /** Iterates through the list and removes nodes where filter returns true */
	    prune(filter) {
	        for (const node of this.nodes()) {
	            if (filter(node.value)) {
	                this.remove(node);
	            }
	        }
	    }
	    clear() {
	        this.count = 0;
	        this.head.next = this.head;
	        this.head.prev = this.head;
	    }
	    /** Returns the first item in the list, does not remove */
	    first() {
	        // If the list is empty, value will be the head's null
	        return this.head.next.value;
	    }
	    /** Returns the last item in the list, does not remove */
	    last() {
	        // If the list is empty, value will be the head's null
	        return this.head.prev.value;
	    }
	}
	exports.List = List;
	/**
	 * A pool of Buffers which allow you to read them as if they were one
	 * @internal
	 */
	class BufferPool {
	    constructor() {
	        this.buffers = new List();
	        this.totalByteLength = 0;
	    }
	    get length() {
	        return this.totalByteLength;
	    }
	    /** Adds a buffer to the internal buffer pool list */
	    append(buffer) {
	        this.buffers.push(buffer);
	        this.totalByteLength += buffer.length;
	    }
	    /**
	     * If BufferPool contains 4 bytes or more construct an int32 from the leading bytes,
	     * otherwise return null. Size can be negative, caller should error check.
	     */
	    getInt32() {
	        if (this.totalByteLength < 4) {
	            return null;
	        }
	        const firstBuffer = this.buffers.first();
	        if (firstBuffer != null && firstBuffer.byteLength >= 4) {
	            return firstBuffer.readInt32LE(0);
	        }
	        // Unlikely case: an int32 is split across buffers.
	        // Use read and put the returned buffer back on top
	        const top4Bytes = this.read(4);
	        const value = top4Bytes.readInt32LE(0);
	        // Put it back.
	        this.totalByteLength += 4;
	        this.buffers.unshift(top4Bytes);
	        return value;
	    }
	    /** Reads the requested number of bytes, optionally consuming them */
	    read(size) {
	        if (typeof size !== 'number' || size < 0) {
	            throw new error_1.MongoInvalidArgumentError('Argument "size" must be a non-negative number');
	        }
	        // oversized request returns empty buffer
	        if (size > this.totalByteLength) {
	            return Buffer.alloc(0);
	        }
	        // We know we have enough, we just don't know how it is spread across chunks
	        // TODO(NODE-4732): alloc API should change based on raw option
	        const result = Buffer.allocUnsafe(size);
	        for (let bytesRead = 0; bytesRead < size;) {
	            const buffer = this.buffers.shift();
	            if (buffer == null) {
	                break;
	            }
	            const bytesRemaining = size - bytesRead;
	            const bytesReadable = Math.min(bytesRemaining, buffer.byteLength);
	            const bytes = buffer.subarray(0, bytesReadable);
	            result.set(bytes, bytesRead);
	            bytesRead += bytesReadable;
	            this.totalByteLength -= bytesReadable;
	            if (bytesReadable < buffer.byteLength) {
	                this.buffers.unshift(buffer.subarray(bytesReadable));
	            }
	        }
	        return result;
	    }
	}
	exports.BufferPool = BufferPool;
	/** @public */
	class HostAddress {
	    constructor(hostString) {
	        this.host = undefined;
	        this.port = undefined;
	        this.socketPath = undefined;
	        this.isIPv6 = false;
	        const escapedHost = hostString.split(' ').join('%20'); // escape spaces, for socket path hosts
	        if (escapedHost.endsWith('.sock')) {
	            // heuristically determine if we're working with a domain socket
	            this.socketPath = decodeURIComponent(escapedHost);
	            return;
	        }
	        const urlString = `iLoveJS://${escapedHost}`;
	        let url;
	        try {
	            url = new url_1.URL(urlString);
	        }
	        catch (urlError) {
	            const runtimeError = new error_1.MongoRuntimeError(`Unable to parse ${escapedHost} with URL`);
	            runtimeError.cause = urlError;
	            throw runtimeError;
	        }
	        const hostname = url.hostname;
	        const port = url.port;
	        let normalized = decodeURIComponent(hostname).toLowerCase();
	        if (normalized.startsWith('[') && normalized.endsWith(']')) {
	            this.isIPv6 = true;
	            normalized = normalized.substring(1, hostname.length - 1);
	        }
	        this.host = normalized.toLowerCase();
	        if (typeof port === 'number') {
	            this.port = port;
	        }
	        else if (typeof port === 'string' && port !== '') {
	            this.port = Number.parseInt(port, 10);
	        }
	        else {
	            this.port = 27017;
	        }
	        if (this.port === 0) {
	            throw new error_1.MongoParseError('Invalid port (zero) with hostname');
	        }
	        Object.freeze(this);
	    }
	    [Symbol.for('nodejs.util.inspect.custom')]() {
	        return this.inspect();
	    }
	    inspect() {
	        return `new HostAddress('${this.toString()}')`;
	    }
	    toString() {
	        if (typeof this.host === 'string') {
	            if (this.isIPv6) {
	                return `[${this.host}]:${this.port}`;
	            }
	            return `${this.host}:${this.port}`;
	        }
	        return `${this.socketPath}`;
	    }
	    static fromString(s) {
	        return new HostAddress(s);
	    }
	    static fromHostPort(host, port) {
	        if (host.includes(':')) {
	            host = `[${host}]`; // IPv6 address
	        }
	        return HostAddress.fromString(`${host}:${port}`);
	    }
	    static fromSrvRecord({ name, port }) {
	        return HostAddress.fromHostPort(name, port);
	    }
	    toHostPort() {
	        if (this.socketPath) {
	            return { host: this.socketPath, port: 0 };
	        }
	        const host = this.host ?? '';
	        const port = this.port ?? 0;
	        return { host, port };
	    }
	}
	exports.HostAddress = HostAddress;
	exports.DEFAULT_PK_FACTORY = {
	    // We prefer not to rely on ObjectId having a createPk method
	    createPk() {
	        return new bson_1.ObjectId();
	    }
	};
	/**
	 * When the driver used emitWarning the code will be equal to this.
	 * @public
	 *
	 * @example
	 * ```ts
	 * process.on('warning', (warning) => {
	 *  if (warning.code === MONGODB_WARNING_CODE) console.error('Ah an important warning! :)')
	 * })
	 * ```
	 */
	exports.MONGODB_WARNING_CODE = 'MONGODB DRIVER';
	/** @internal */
	function emitWarning(message) {
	    return process.emitWarning(message, { code: exports.MONGODB_WARNING_CODE });
	}
	exports.emitWarning = emitWarning;
	const emittedWarnings = new Set();
	/**
	 * Will emit a warning once for the duration of the application.
	 * Uses the message to identify if it has already been emitted
	 * so using string interpolation can cause multiple emits
	 * @internal
	 */
	function emitWarningOnce(message) {
	    if (!emittedWarnings.has(message)) {
	        emittedWarnings.add(message);
	        return emitWarning(message);
	    }
	}
	exports.emitWarningOnce = emitWarningOnce;
	/**
	 * Takes a JS object and joins the values into a string separated by ', '
	 */
	function enumToString(en) {
	    return Object.values(en).join(', ');
	}
	exports.enumToString = enumToString;
	/**
	 * Determine if a server supports retryable writes.
	 *
	 * @internal
	 */
	function supportsRetryableWrites(server) {
	    if (!server) {
	        return false;
	    }
	    if (server.loadBalanced) {
	        // Loadbalanced topologies will always support retry writes
	        return true;
	    }
	    if (server.description.logicalSessionTimeoutMinutes != null) {
	        // that supports sessions
	        if (server.description.type !== common_1.ServerType.Standalone) {
	            // and that is not a standalone
	            return true;
	        }
	    }
	    return false;
	}
	exports.supportsRetryableWrites = supportsRetryableWrites;
	/**
	 * Fisher–Yates Shuffle
	 *
	 * Reference: https://bost.ocks.org/mike/shuffle/
	 * @param sequence - items to be shuffled
	 * @param limit - Defaults to `0`. If nonzero shuffle will slice the randomized array e.g, `.slice(0, limit)` otherwise will return the entire randomized array.
	 */
	function shuffle(sequence, limit = 0) {
	    const items = Array.from(sequence); // shallow copy in order to never shuffle the input
	    if (limit > items.length) {
	        throw new error_1.MongoRuntimeError('Limit must be less than the number of items');
	    }
	    let remainingItemsToShuffle = items.length;
	    const lowerBound = limit % items.length === 0 ? 1 : items.length - limit;
	    while (remainingItemsToShuffle > lowerBound) {
	        // Pick a remaining element
	        const randomIndex = Math.floor(Math.random() * remainingItemsToShuffle);
	        remainingItemsToShuffle -= 1;
	        // And swap it with the current element
	        const swapHold = items[remainingItemsToShuffle];
	        items[remainingItemsToShuffle] = items[randomIndex];
	        items[randomIndex] = swapHold;
	    }
	    return limit % items.length === 0 ? items : items.slice(lowerBound);
	}
	exports.shuffle = shuffle;
	// TODO(NODE-4936): read concern eligibility for commands should be codified in command construction
	// @see https://github.com/mongodb/specifications/blob/master/source/read-write-concern/read-write-concern.rst#read-concern
	function commandSupportsReadConcern(command, options) {
	    if (command.aggregate || command.count || command.distinct || command.find || command.geoNear) {
	        return true;
	    }
	    if (command.mapReduce &&
	        options &&
	        options.out &&
	        (options.out.inline === 1 || options.out === 'inline')) {
	        return true;
	    }
	    return false;
	}
	exports.commandSupportsReadConcern = commandSupportsReadConcern;
	/** A utility function to get the instance of mongodb-client-encryption, if it exists. */
	function getMongoDBClientEncryption() {
	    let mongodbClientEncryption = null;
	    // NOTE(NODE-4254): This is to get around the circular dependency between
	    // mongodb-client-encryption and the driver in the test scenarios.
	    if (typeof process.env.MONGODB_CLIENT_ENCRYPTION_OVERRIDE === 'string' &&
	        process.env.MONGODB_CLIENT_ENCRYPTION_OVERRIDE.length > 0) {
	        try {
	            // NOTE(NODE-3199): Ensure you always wrap an optional require literally in the try block
	            // Cannot be moved to helper utility function, bundlers search and replace the actual require call
	            // in a way that makes this line throw at bundle time, not runtime, catching here will make bundling succeed
	            mongodbClientEncryption = commonjsRequire(process.env.MONGODB_CLIENT_ENCRYPTION_OVERRIDE);
	        }
	        catch {
	            // ignore
	        }
	    }
	    else {
	        try {
	            // NOTE(NODE-3199): Ensure you always wrap an optional require literally in the try block
	            // Cannot be moved to helper utility function, bundlers search and replace the actual require call
	            // in a way that makes this line throw at bundle time, not runtime, catching here will make bundling succeed
	            mongodbClientEncryption = require('mongodb-client-encryption');
	        }
	        catch {
	            // ignore
	        }
	    }
	    return mongodbClientEncryption;
	}
	exports.getMongoDBClientEncryption = getMongoDBClientEncryption;
	/**
	 * Compare objectIds. `null` is always less
	 * - `+1 = oid1 is greater than oid2`
	 * - `-1 = oid1 is less than oid2`
	 * - `+0 = oid1 is equal oid2`
	 */
	function compareObjectId(oid1, oid2) {
	    if (oid1 == null && oid2 == null) {
	        return 0;
	    }
	    if (oid1 == null) {
	        return -1;
	    }
	    if (oid2 == null) {
	        return 1;
	    }
	    return exports.ByteUtils.compare(oid1.id, oid2.id);
	}
	exports.compareObjectId = compareObjectId;
	function parseInteger(value) {
	    if (typeof value === 'number')
	        return Math.trunc(value);
	    const parsedValue = Number.parseInt(String(value), 10);
	    return Number.isNaN(parsedValue) ? null : parsedValue;
	}
	exports.parseInteger = parseInteger;
	function parseUnsignedInteger(value) {
	    const parsedInt = parseInteger(value);
	    return parsedInt != null && parsedInt >= 0 ? parsedInt : null;
	}
	exports.parseUnsignedInteger = parseUnsignedInteger;
	/**
	 * Determines whether a provided address matches the provided parent domain.
	 *
	 * If a DNS server were to become compromised SRV records would still need to
	 * advertise addresses that are under the same domain as the srvHost.
	 *
	 * @param address - The address to check against a domain
	 * @param srvHost - The domain to check the provided address against
	 * @returns Whether the provided address matches the parent domain
	 */
	function matchesParentDomain(address, srvHost) {
	    // Remove trailing dot if exists on either the resolved address or the srv hostname
	    const normalizedAddress = address.endsWith('.') ? address.slice(0, address.length - 1) : address;
	    const normalizedSrvHost = srvHost.endsWith('.') ? srvHost.slice(0, srvHost.length - 1) : srvHost;
	    const allCharacterBeforeFirstDot = /^.*?\./;
	    // Remove all characters before first dot
	    // Add leading dot back to string so
	    //   an srvHostDomain = '.trusted.site'
	    //   will not satisfy an addressDomain that endsWith '.fake-trusted.site'
	    const addressDomain = `.${normalizedAddress.replace(allCharacterBeforeFirstDot, '')}`;
	    const srvHostDomain = `.${normalizedSrvHost.replace(allCharacterBeforeFirstDot, '')}`;
	    return addressDomain.endsWith(srvHostDomain);
	}
	exports.matchesParentDomain = matchesParentDomain;
	async function request(uri, options = {}) {
	    return new Promise((resolve, reject) => {
	        const requestOptions = {
	            method: 'GET',
	            timeout: 10000,
	            json: true,
	            ...url.parse(uri),
	            ...options
	        };
	        const req = http.request(requestOptions, res => {
	            res.setEncoding('utf8');
	            let data = '';
	            res.on('data', d => {
	                data += d;
	            });
	            res.once('end', () => {
	                if (options.json === false) {
	                    resolve(data);
	                    return;
	                }
	                try {
	                    const parsed = JSON.parse(data);
	                    resolve(parsed);
	                }
	                catch {
	                    // TODO(NODE-3483)
	                    reject(new error_1.MongoRuntimeError(`Invalid JSON response: "${data}"`));
	                }
	            });
	        });
	        req.once('timeout', () => req.destroy(new error_1.MongoNetworkTimeoutError(`Network request to ${uri} timed out after ${options.timeout} ms`)));
	        req.once('error', error => reject(error));
	        req.end();
	    });
	}
	exports.request = request;
	
} (utils));

var command = {};

var explain = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Explain = exports.ExplainVerbosity = void 0;
	const error_1 = error;
	/** @public */
	exports.ExplainVerbosity = Object.freeze({
	    queryPlanner: 'queryPlanner',
	    queryPlannerExtended: 'queryPlannerExtended',
	    executionStats: 'executionStats',
	    allPlansExecution: 'allPlansExecution'
	});
	/** @internal */
	class Explain {
	    constructor(verbosity) {
	        if (typeof verbosity === 'boolean') {
	            this.verbosity = verbosity
	                ? exports.ExplainVerbosity.allPlansExecution
	                : exports.ExplainVerbosity.queryPlanner;
	        }
	        else {
	            this.verbosity = verbosity;
	        }
	    }
	    static fromOptions(options) {
	        if (options?.explain == null)
	            return;
	        const explain = options.explain;
	        if (typeof explain === 'boolean' || typeof explain === 'string') {
	            return new Explain(explain);
	        }
	        throw new error_1.MongoInvalidArgumentError('Field "explain" must be a string or a boolean');
	    }
	}
	exports.Explain = Explain;
	
} (explain));

var server_selection = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readPreferenceServerSelector = exports.secondaryWritableServerSelector = exports.sameServerSelector = exports.writableServerSelector = exports.MIN_SECONDARY_WRITE_WIRE_VERSION = void 0;
	const error_1 = error;
	const read_preference_1 = read_preference;
	const common_1 = common$1;
	// max staleness constants
	const IDLE_WRITE_PERIOD = 10000;
	const SMALLEST_MAX_STALENESS_SECONDS = 90;
	//  Minimum version to try writes on secondaries.
	exports.MIN_SECONDARY_WRITE_WIRE_VERSION = 13;
	/**
	 * Returns a server selector that selects for writable servers
	 */
	function writableServerSelector() {
	    return (topologyDescription, servers) => latencyWindowReducer(topologyDescription, servers.filter((s) => s.isWritable));
	}
	exports.writableServerSelector = writableServerSelector;
	/**
	 * The purpose of this selector is to select the same server, only
	 * if it is in a state that it can have commands sent to it.
	 */
	function sameServerSelector(description) {
	    return (topologyDescription, servers) => {
	        if (!description)
	            return [];
	        // Filter the servers to match the provided description only if
	        // the type is not unknown.
	        return servers.filter(sd => {
	            return sd.address === description.address && sd.type !== common_1.ServerType.Unknown;
	        });
	    };
	}
	exports.sameServerSelector = sameServerSelector;
	/**
	 * Returns a server selector that uses a read preference to select a
	 * server potentially for a write on a secondary.
	 */
	function secondaryWritableServerSelector(wireVersion, readPreference) {
	    // If server version < 5.0, read preference always primary.
	    // If server version >= 5.0...
	    // - If read preference is supplied, use that.
	    // - If no read preference is supplied, use primary.
	    if (!readPreference ||
	        !wireVersion ||
	        (wireVersion && wireVersion < exports.MIN_SECONDARY_WRITE_WIRE_VERSION)) {
	        return readPreferenceServerSelector(read_preference_1.ReadPreference.primary);
	    }
	    return readPreferenceServerSelector(readPreference);
	}
	exports.secondaryWritableServerSelector = secondaryWritableServerSelector;
	/**
	 * Reduces the passed in array of servers by the rules of the "Max Staleness" specification
	 * found here: https://github.com/mongodb/specifications/blob/master/source/max-staleness/max-staleness.rst
	 *
	 * @param readPreference - The read preference providing max staleness guidance
	 * @param topologyDescription - The topology description
	 * @param servers - The list of server descriptions to be reduced
	 * @returns The list of servers that satisfy the requirements of max staleness
	 */
	function maxStalenessReducer(readPreference, topologyDescription, servers) {
	    if (readPreference.maxStalenessSeconds == null || readPreference.maxStalenessSeconds < 0) {
	        return servers;
	    }
	    const maxStaleness = readPreference.maxStalenessSeconds;
	    const maxStalenessVariance = (topologyDescription.heartbeatFrequencyMS + IDLE_WRITE_PERIOD) / 1000;
	    if (maxStaleness < maxStalenessVariance) {
	        throw new error_1.MongoInvalidArgumentError(`Option "maxStalenessSeconds" must be at least ${maxStalenessVariance} seconds`);
	    }
	    if (maxStaleness < SMALLEST_MAX_STALENESS_SECONDS) {
	        throw new error_1.MongoInvalidArgumentError(`Option "maxStalenessSeconds" must be at least ${SMALLEST_MAX_STALENESS_SECONDS} seconds`);
	    }
	    if (topologyDescription.type === common_1.TopologyType.ReplicaSetWithPrimary) {
	        const primary = Array.from(topologyDescription.servers.values()).filter(primaryFilter)[0];
	        return servers.reduce((result, server) => {
	            const stalenessMS = server.lastUpdateTime -
	                server.lastWriteDate -
	                (primary.lastUpdateTime - primary.lastWriteDate) +
	                topologyDescription.heartbeatFrequencyMS;
	            const staleness = stalenessMS / 1000;
	            const maxStalenessSeconds = readPreference.maxStalenessSeconds ?? 0;
	            if (staleness <= maxStalenessSeconds) {
	                result.push(server);
	            }
	            return result;
	        }, []);
	    }
	    if (topologyDescription.type === common_1.TopologyType.ReplicaSetNoPrimary) {
	        if (servers.length === 0) {
	            return servers;
	        }
	        const sMax = servers.reduce((max, s) => s.lastWriteDate > max.lastWriteDate ? s : max);
	        return servers.reduce((result, server) => {
	            const stalenessMS = sMax.lastWriteDate - server.lastWriteDate + topologyDescription.heartbeatFrequencyMS;
	            const staleness = stalenessMS / 1000;
	            const maxStalenessSeconds = readPreference.maxStalenessSeconds ?? 0;
	            if (staleness <= maxStalenessSeconds) {
	                result.push(server);
	            }
	            return result;
	        }, []);
	    }
	    return servers;
	}
	/**
	 * Determines whether a server's tags match a given set of tags
	 *
	 * @param tagSet - The requested tag set to match
	 * @param serverTags - The server's tags
	 */
	function tagSetMatch(tagSet, serverTags) {
	    const keys = Object.keys(tagSet);
	    const serverTagKeys = Object.keys(serverTags);
	    for (let i = 0; i < keys.length; ++i) {
	        const key = keys[i];
	        if (serverTagKeys.indexOf(key) === -1 || serverTags[key] !== tagSet[key]) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Reduces a set of server descriptions based on tags requested by the read preference
	 *
	 * @param readPreference - The read preference providing the requested tags
	 * @param servers - The list of server descriptions to reduce
	 * @returns The list of servers matching the requested tags
	 */
	function tagSetReducer(readPreference, servers) {
	    if (readPreference.tags == null ||
	        (Array.isArray(readPreference.tags) && readPreference.tags.length === 0)) {
	        return servers;
	    }
	    for (let i = 0; i < readPreference.tags.length; ++i) {
	        const tagSet = readPreference.tags[i];
	        const serversMatchingTagset = servers.reduce((matched, server) => {
	            if (tagSetMatch(tagSet, server.tags))
	                matched.push(server);
	            return matched;
	        }, []);
	        if (serversMatchingTagset.length) {
	            return serversMatchingTagset;
	        }
	    }
	    return [];
	}
	/**
	 * Reduces a list of servers to ensure they fall within an acceptable latency window. This is
	 * further specified in the "Server Selection" specification, found here:
	 * https://github.com/mongodb/specifications/blob/master/source/server-selection/server-selection.rst
	 *
	 * @param topologyDescription - The topology description
	 * @param servers - The list of servers to reduce
	 * @returns The servers which fall within an acceptable latency window
	 */
	function latencyWindowReducer(topologyDescription, servers) {
	    const low = servers.reduce((min, server) => min === -1 ? server.roundTripTime : Math.min(server.roundTripTime, min), -1);
	    const high = low + topologyDescription.localThresholdMS;
	    return servers.reduce((result, server) => {
	        if (server.roundTripTime <= high && server.roundTripTime >= low)
	            result.push(server);
	        return result;
	    }, []);
	}
	// filters
	function primaryFilter(server) {
	    return server.type === common_1.ServerType.RSPrimary;
	}
	function secondaryFilter(server) {
	    return server.type === common_1.ServerType.RSSecondary;
	}
	function nearestFilter(server) {
	    return server.type === common_1.ServerType.RSSecondary || server.type === common_1.ServerType.RSPrimary;
	}
	function knownFilter(server) {
	    return server.type !== common_1.ServerType.Unknown;
	}
	function loadBalancerFilter(server) {
	    return server.type === common_1.ServerType.LoadBalancer;
	}
	/**
	 * Returns a function which selects servers based on a provided read preference
	 *
	 * @param readPreference - The read preference to select with
	 */
	function readPreferenceServerSelector(readPreference) {
	    if (!readPreference.isValid()) {
	        throw new error_1.MongoInvalidArgumentError('Invalid read preference specified');
	    }
	    return (topologyDescription, servers) => {
	        const commonWireVersion = topologyDescription.commonWireVersion;
	        if (commonWireVersion &&
	            readPreference.minWireVersion &&
	            readPreference.minWireVersion > commonWireVersion) {
	            throw new error_1.MongoCompatibilityError(`Minimum wire version '${readPreference.minWireVersion}' required, but found '${commonWireVersion}'`);
	        }
	        if (topologyDescription.type === common_1.TopologyType.LoadBalanced) {
	            return servers.filter(loadBalancerFilter);
	        }
	        if (topologyDescription.type === common_1.TopologyType.Unknown) {
	            return [];
	        }
	        if (topologyDescription.type === common_1.TopologyType.Single ||
	            topologyDescription.type === common_1.TopologyType.Sharded) {
	            return latencyWindowReducer(topologyDescription, servers.filter(knownFilter));
	        }
	        const mode = readPreference.mode;
	        if (mode === read_preference_1.ReadPreference.PRIMARY) {
	            return servers.filter(primaryFilter);
	        }
	        if (mode === read_preference_1.ReadPreference.PRIMARY_PREFERRED) {
	            const result = servers.filter(primaryFilter);
	            if (result.length) {
	                return result;
	            }
	        }
	        const filter = mode === read_preference_1.ReadPreference.NEAREST ? nearestFilter : secondaryFilter;
	        const selectedServers = latencyWindowReducer(topologyDescription, tagSetReducer(readPreference, maxStalenessReducer(readPreference, topologyDescription, servers.filter(filter))));
	        if (mode === read_preference_1.ReadPreference.SECONDARY_PREFERRED && selectedServers.length === 0) {
	            return servers.filter(primaryFilter);
	        }
	        return selectedServers;
	    };
	}
	exports.readPreferenceServerSelector = readPreferenceServerSelector;
	
} (server_selection));

var operation = {};

const require$$0$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(util);

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defineAspects = exports.AbstractCallbackOperation = exports.AbstractOperation = exports.Aspect = void 0;
	const util_1 = require$$0$6;
	const bson_1 = bson;
	const read_preference_1 = read_preference;
	exports.Aspect = {
	    READ_OPERATION: Symbol('READ_OPERATION'),
	    WRITE_OPERATION: Symbol('WRITE_OPERATION'),
	    RETRYABLE: Symbol('RETRYABLE'),
	    EXPLAINABLE: Symbol('EXPLAINABLE'),
	    SKIP_COLLATION: Symbol('SKIP_COLLATION'),
	    CURSOR_CREATING: Symbol('CURSOR_CREATING'),
	    MUST_SELECT_SAME_SERVER: Symbol('MUST_SELECT_SAME_SERVER')
	};
	/** @internal */
	const kSession = Symbol('session');
	/**
	 * This class acts as a parent class for any operation and is responsible for setting this.options,
	 * as well as setting and getting a session.
	 * Additionally, this class implements `hasAspect`, which determines whether an operation has
	 * a specific aspect.
	 * @internal
	 */
	class AbstractOperation {
	    constructor(options = {}) {
	        this.readPreference = this.hasAspect(exports.Aspect.WRITE_OPERATION)
	            ? read_preference_1.ReadPreference.primary
	            : read_preference_1.ReadPreference.fromOptions(options) ?? read_preference_1.ReadPreference.primary;
	        // Pull the BSON serialize options from the already-resolved options
	        this.bsonOptions = (0, bson_1.resolveBSONOptions)(options);
	        this[kSession] = options.session != null ? options.session : undefined;
	        this.options = options;
	        this.bypassPinningCheck = !!options.bypassPinningCheck;
	        this.trySecondaryWrite = false;
	    }
	    hasAspect(aspect) {
	        const ctor = this.constructor;
	        if (ctor.aspects == null) {
	            return false;
	        }
	        return ctor.aspects.has(aspect);
	    }
	    get session() {
	        return this[kSession];
	    }
	    clearSession() {
	        this[kSession] = undefined;
	    }
	    get canRetryRead() {
	        return true;
	    }
	    get canRetryWrite() {
	        return true;
	    }
	}
	exports.AbstractOperation = AbstractOperation;
	/** @internal */
	class AbstractCallbackOperation extends AbstractOperation {
	    constructor(options = {}) {
	        super(options);
	    }
	    execute(server, session) {
	        return (0, util_1.promisify)((callback) => {
	            this.executeCallback(server, session, callback);
	        })();
	    }
	}
	exports.AbstractCallbackOperation = AbstractCallbackOperation;
	function defineAspects(operation, aspects) {
	    if (!Array.isArray(aspects) && !(aspects instanceof Set)) {
	        aspects = [aspects];
	    }
	    aspects = new Set(aspects);
	    Object.defineProperty(operation, 'aspects', {
	        value: aspects,
	        writable: false
	    });
	    return aspects;
	}
	exports.defineAspects = defineAspects;
	
} (operation));

Object.defineProperty(command, "__esModule", { value: true });
command.CommandOperation = void 0;
const error_1$H = error;
const explain_1 = explain;
const read_concern_1$2 = read_concern;
const server_selection_1$1 = server_selection;
const utils_1$t = utils;
const write_concern_1$4 = write_concern;
const operation_1$n = operation;
/** @internal */
class CommandOperation extends operation_1$n.AbstractCallbackOperation {
    constructor(parent, options) {
        super(options);
        this.options = options ?? {};
        // NOTE: this was explicitly added for the add/remove user operations, it's likely
        //       something we'd want to reconsider. Perhaps those commands can use `Admin`
        //       as a parent?
        const dbNameOverride = options?.dbName || options?.authdb;
        if (dbNameOverride) {
            this.ns = new utils_1$t.MongoDBNamespace(dbNameOverride, '$cmd');
        }
        else {
            this.ns = parent
                ? parent.s.namespace.withCollection('$cmd')
                : new utils_1$t.MongoDBNamespace('admin', '$cmd');
        }
        this.readConcern = read_concern_1$2.ReadConcern.fromOptions(options);
        this.writeConcern = write_concern_1$4.WriteConcern.fromOptions(options);
        if (this.hasAspect(operation_1$n.Aspect.EXPLAINABLE)) {
            this.explain = explain_1.Explain.fromOptions(options);
        }
        else if (options?.explain != null) {
            throw new error_1$H.MongoInvalidArgumentError(`Option "explain" is not supported on this command`);
        }
    }
    get canRetryWrite() {
        if (this.hasAspect(operation_1$n.Aspect.EXPLAINABLE)) {
            return this.explain == null;
        }
        return true;
    }
    executeCommand(server, session, cmd, callback) {
        // TODO: consider making this a non-enumerable property
        this.server = server;
        const options = {
            ...this.options,
            ...this.bsonOptions,
            readPreference: this.readPreference,
            session
        };
        const serverWireVersion = (0, utils_1$t.maxWireVersion)(server);
        const inTransaction = this.session && this.session.inTransaction();
        if (this.readConcern && (0, utils_1$t.commandSupportsReadConcern)(cmd) && !inTransaction) {
            Object.assign(cmd, { readConcern: this.readConcern });
        }
        if (this.trySecondaryWrite && serverWireVersion < server_selection_1$1.MIN_SECONDARY_WRITE_WIRE_VERSION) {
            options.omitReadPreference = true;
        }
        if (this.writeConcern && this.hasAspect(operation_1$n.Aspect.WRITE_OPERATION) && !inTransaction) {
            write_concern_1$4.WriteConcern.apply(cmd, this.writeConcern);
        }
        if (options.collation &&
            typeof options.collation === 'object' &&
            !this.hasAspect(operation_1$n.Aspect.SKIP_COLLATION)) {
            Object.assign(cmd, { collation: options.collation });
        }
        if (typeof options.maxTimeMS === 'number') {
            cmd.maxTimeMS = options.maxTimeMS;
        }
        if (this.hasAspect(operation_1$n.Aspect.EXPLAINABLE) && this.explain) {
            cmd = (0, utils_1$t.decorateWithExplain)(cmd, this.explain);
        }
        server.command(this.ns, cmd, options, callback);
    }
}
command.CommandOperation = CommandOperation;

Object.defineProperty(add_user, "__esModule", { value: true });
add_user.AddUserOperation = void 0;
const crypto$3 = require$$0$9;
const error_1$G = error;
const utils_1$s = utils;
const command_1$g = command;
const operation_1$m = operation;
/** @internal */
class AddUserOperation extends command_1$g.CommandOperation {
    constructor(db, username, password, options) {
        super(db, options);
        this.db = db;
        this.username = username;
        this.password = password;
        this.options = options ?? {};
    }
    executeCallback(server, session, callback) {
        const db = this.db;
        const username = this.username;
        const password = this.password;
        const options = this.options;
        // Error out if digestPassword set
        // v5 removed the digestPassword option from AddUserOptions but we still want to throw
        // an error when digestPassword is provided.
        if ('digestPassword' in options && options.digestPassword != null) {
            return callback(new error_1$G.MongoInvalidArgumentError('Option "digestPassword" not supported via addUser, use db.command(...) instead'));
        }
        let roles;
        if (!options.roles || (Array.isArray(options.roles) && options.roles.length === 0)) {
            (0, utils_1$s.emitWarningOnce)('Creating a user without roles is deprecated. Defaults to "root" if db is "admin" or "dbOwner" otherwise');
            if (db.databaseName.toLowerCase() === 'admin') {
                roles = ['root'];
            }
            else {
                roles = ['dbOwner'];
            }
        }
        else {
            roles = Array.isArray(options.roles) ? options.roles : [options.roles];
        }
        let topology;
        try {
            topology = (0, utils_1$s.getTopology)(db);
        }
        catch (error) {
            return callback(error);
        }
        const digestPassword = topology.lastHello().maxWireVersion >= 7;
        let userPassword = password;
        if (!digestPassword) {
            // Use node md5 generator
            const md5 = crypto$3.createHash('md5');
            // Generate keys used for authentication
            md5.update(`${username}:mongo:${password}`);
            userPassword = md5.digest('hex');
        }
        // Build the command to execute
        const command = {
            createUser: username,
            customData: options.customData || {},
            roles: roles,
            digestPassword
        };
        // No password
        if (typeof password === 'string') {
            command.pwd = userPassword;
        }
        super.executeCommand(server, session, command, callback);
    }
}
add_user.AddUserOperation = AddUserOperation;
(0, operation_1$m.defineAspects)(AddUserOperation, [operation_1$m.Aspect.WRITE_OPERATION]);

var execute_operation = {};

Object.defineProperty(execute_operation, "__esModule", { value: true });
execute_operation.executeOperation = void 0;
const error_1$F = error;
const read_preference_1$4 = read_preference;
const server_selection_1 = server_selection;
const utils_1$r = utils;
const operation_1$l = operation;
const MMAPv1_RETRY_WRITES_ERROR_CODE = error_1$F.MONGODB_ERROR_CODES.IllegalOperation;
const MMAPv1_RETRY_WRITES_ERROR_MESSAGE = 'This MongoDB deployment does not support retryable writes. Please add retryWrites=false to your connection string.';
function executeOperation(client, operation, callback) {
    return (0, utils_1$r.maybeCallback)(() => executeOperationAsync(client, operation), callback);
}
execute_operation.executeOperation = executeOperation;
async function executeOperationAsync(client, operation) {
    if (!(operation instanceof operation_1$l.AbstractCallbackOperation)) {
        // TODO(NODE-3483): Extend MongoRuntimeError
        throw new error_1$F.MongoRuntimeError('This method requires a valid operation instance');
    }
    if (client.topology == null) {
        // Auto connect on operation
        if (client.s.hasBeenClosed) {
            throw new error_1$F.MongoNotConnectedError('Client must be connected before running operations');
        }
        client.s.options[Symbol.for('@@mdb.skipPingOnConnect')] = true;
        try {
            await client.connect();
        }
        finally {
            delete client.s.options[Symbol.for('@@mdb.skipPingOnConnect')];
        }
    }
    const { topology } = client;
    if (topology == null) {
        throw new error_1$F.MongoRuntimeError('client.connect did not create a topology but also did not throw');
    }
    // The driver sessions spec mandates that we implicitly create sessions for operations
    // that are not explicitly provided with a session.
    let session = operation.session;
    let owner;
    if (session == null) {
        owner = Symbol();
        session = client.startSession({ owner, explicit: false });
    }
    else if (session.hasEnded) {
        throw new error_1$F.MongoExpiredSessionError('Use of expired sessions is not permitted');
    }
    else if (session.snapshotEnabled && !topology.capabilities.supportsSnapshotReads) {
        throw new error_1$F.MongoCompatibilityError('Snapshot reads require MongoDB 5.0 or later');
    }
    const readPreference = operation.readPreference ?? read_preference_1$4.ReadPreference.primary;
    const inTransaction = !!session?.inTransaction();
    if (inTransaction && !readPreference.equals(read_preference_1$4.ReadPreference.primary)) {
        throw new error_1$F.MongoTransactionError(`Read preference in a transaction must be primary, not: ${readPreference.mode}`);
    }
    if (session?.isPinned && session.transaction.isCommitted && !operation.bypassPinningCheck) {
        session.unpin();
    }
    let selector;
    if (operation.hasAspect(operation_1$l.Aspect.MUST_SELECT_SAME_SERVER)) {
        // GetMore and KillCursor operations must always select the same server, but run through
        // server selection to potentially force monitor checks if the server is
        // in an unknown state.
        selector = (0, server_selection_1.sameServerSelector)(operation.server?.description);
    }
    else if (operation.trySecondaryWrite) {
        // If operation should try to write to secondary use the custom server selector
        // otherwise provide the read preference.
        selector = (0, server_selection_1.secondaryWritableServerSelector)(topology.commonWireVersion, readPreference);
    }
    else {
        selector = readPreference;
    }
    const server = await topology.selectServerAsync(selector, { session });
    if (session == null) {
        // No session also means it is not retryable, early exit
        return operation.execute(server, undefined);
    }
    if (!operation.hasAspect(operation_1$l.Aspect.RETRYABLE)) {
        // non-retryable operation, early exit
        try {
            return await operation.execute(server, session);
        }
        finally {
            if (session?.owner != null && session.owner === owner) {
                await session.endSession().catch(() => null);
            }
        }
    }
    const willRetryRead = topology.s.options.retryReads && !inTransaction && operation.canRetryRead;
    const willRetryWrite = topology.s.options.retryWrites &&
        !inTransaction &&
        (0, utils_1$r.supportsRetryableWrites)(server) &&
        operation.canRetryWrite;
    const hasReadAspect = operation.hasAspect(operation_1$l.Aspect.READ_OPERATION);
    const hasWriteAspect = operation.hasAspect(operation_1$l.Aspect.WRITE_OPERATION);
    const willRetry = (hasReadAspect && willRetryRead) || (hasWriteAspect && willRetryWrite);
    if (hasWriteAspect && willRetryWrite) {
        operation.options.willRetryWrite = true;
        session.incrementTransactionNumber();
    }
    try {
        return await operation.execute(server, session);
    }
    catch (operationError) {
        if (willRetry && operationError instanceof error_1$F.MongoError) {
            return await retryOperation(operation, operationError, {
                session,
                topology,
                selector
            });
        }
        throw operationError;
    }
    finally {
        if (session?.owner != null && session.owner === owner) {
            await session.endSession().catch(() => null);
        }
    }
}
async function retryOperation(operation, originalError, { session, topology, selector }) {
    const isWriteOperation = operation.hasAspect(operation_1$l.Aspect.WRITE_OPERATION);
    const isReadOperation = operation.hasAspect(operation_1$l.Aspect.READ_OPERATION);
    if (isWriteOperation && originalError.code === MMAPv1_RETRY_WRITES_ERROR_CODE) {
        throw new error_1$F.MongoServerError({
            message: MMAPv1_RETRY_WRITES_ERROR_MESSAGE,
            errmsg: MMAPv1_RETRY_WRITES_ERROR_MESSAGE,
            originalError
        });
    }
    if (isWriteOperation && !(0, error_1$F.isRetryableWriteError)(originalError)) {
        throw originalError;
    }
    if (isReadOperation && !(0, error_1$F.isRetryableReadError)(originalError)) {
        throw originalError;
    }
    if (originalError instanceof error_1$F.MongoNetworkError &&
        session.isPinned &&
        !session.inTransaction() &&
        operation.hasAspect(operation_1$l.Aspect.CURSOR_CREATING)) {
        // If we have a cursor and the initial command fails with a network error,
        // we can retry it on another connection. So we need to check it back in, clear the
        // pool for the service id, and retry again.
        session.unpin({ force: true, forceClear: true });
    }
    // select a new server, and attempt to retry the operation
    const server = await topology.selectServerAsync(selector, { session });
    if (isWriteOperation && !(0, utils_1$r.supportsRetryableWrites)(server)) {
        throw new error_1$F.MongoUnexpectedServerResponseError('Selected server does not support retryable writes');
    }
    try {
        return await operation.execute(server, session);
    }
    catch (retryError) {
        if (retryError instanceof error_1$F.MongoError &&
            retryError.hasErrorLabel(error_1$F.MongoErrorLabel.NoWritesPerformed)) {
            throw originalError;
        }
        throw retryError;
    }
}

var list_databases = {};

Object.defineProperty(list_databases, "__esModule", { value: true });
list_databases.ListDatabasesOperation = void 0;
const utils_1$q = utils;
const command_1$f = command;
const operation_1$k = operation;
/** @internal */
class ListDatabasesOperation extends command_1$f.CommandOperation {
    constructor(db, options) {
        super(db, options);
        this.options = options ?? {};
        this.ns = new utils_1$q.MongoDBNamespace('admin', '$cmd');
    }
    executeCallback(server, session, callback) {
        const cmd = { listDatabases: 1 };
        if (typeof this.options.nameOnly === 'boolean') {
            cmd.nameOnly = this.options.nameOnly;
        }
        if (this.options.filter) {
            cmd.filter = this.options.filter;
        }
        if (typeof this.options.authorizedDatabases === 'boolean') {
            cmd.authorizedDatabases = this.options.authorizedDatabases;
        }
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if ((0, utils_1$q.maxWireVersion)(server) >= 9 && this.options.comment !== undefined) {
            cmd.comment = this.options.comment;
        }
        super.executeCommand(server, session, cmd, callback);
    }
}
list_databases.ListDatabasesOperation = ListDatabasesOperation;
(0, operation_1$k.defineAspects)(ListDatabasesOperation, [operation_1$k.Aspect.READ_OPERATION, operation_1$k.Aspect.RETRYABLE]);

var remove_user = {};

Object.defineProperty(remove_user, "__esModule", { value: true });
remove_user.RemoveUserOperation = void 0;
const command_1$e = command;
const operation_1$j = operation;
/** @internal */
class RemoveUserOperation extends command_1$e.CommandOperation {
    constructor(db, username, options) {
        super(db, options);
        this.options = options;
        this.username = username;
    }
    executeCallback(server, session, callback) {
        super.executeCommand(server, session, { dropUser: this.username }, err => {
            callback(err, err ? false : true);
        });
    }
}
remove_user.RemoveUserOperation = RemoveUserOperation;
(0, operation_1$j.defineAspects)(RemoveUserOperation, [operation_1$j.Aspect.WRITE_OPERATION]);

var run_command = {};

Object.defineProperty(run_command, "__esModule", { value: true });
run_command.RunAdminCommandOperation = run_command.RunCommandOperation = void 0;
const utils_1$p = utils;
const command_1$d = command;
/** @internal */
class RunCommandOperation extends command_1$d.CommandOperation {
    constructor(parent, command, options) {
        super(parent, options);
        this.options = options ?? {};
        this.command = command;
    }
    executeCallback(server, session, callback) {
        const command = this.command;
        this.executeCommand(server, session, command, callback);
    }
}
run_command.RunCommandOperation = RunCommandOperation;
class RunAdminCommandOperation extends RunCommandOperation {
    constructor(parent, command, options) {
        super(parent, command, options);
        this.ns = new utils_1$p.MongoDBNamespace('admin');
    }
}
run_command.RunAdminCommandOperation = RunAdminCommandOperation;

var validate_collection = {};

Object.defineProperty(validate_collection, "__esModule", { value: true });
validate_collection.ValidateCollectionOperation = void 0;
const error_1$E = error;
const command_1$c = command;
/** @internal */
class ValidateCollectionOperation extends command_1$c.CommandOperation {
    constructor(admin, collectionName, options) {
        // Decorate command with extra options
        const command = { validate: collectionName };
        const keys = Object.keys(options);
        for (let i = 0; i < keys.length; i++) {
            if (Object.prototype.hasOwnProperty.call(options, keys[i]) && keys[i] !== 'session') {
                command[keys[i]] = options[keys[i]];
            }
        }
        super(admin.s.db, options);
        this.options = options;
        this.command = command;
        this.collectionName = collectionName;
    }
    executeCallback(server, session, callback) {
        const collectionName = this.collectionName;
        super.executeCommand(server, session, this.command, (err, doc) => {
            if (err != null)
                return callback(err);
            // TODO(NODE-3483): Replace these with MongoUnexpectedServerResponseError
            if (doc.ok === 0)
                return callback(new error_1$E.MongoRuntimeError('Error with validate command'));
            if (doc.result != null && typeof doc.result !== 'string')
                return callback(new error_1$E.MongoRuntimeError('Error with validation data'));
            if (doc.result != null && doc.result.match(/exception|corrupt/) != null)
                return callback(new error_1$E.MongoRuntimeError(`Invalid collection ${collectionName}`));
            if (doc.valid != null && !doc.valid)
                return callback(new error_1$E.MongoRuntimeError(`Invalid collection ${collectionName}`));
            return callback(undefined, doc);
        });
    }
}
validate_collection.ValidateCollectionOperation = ValidateCollectionOperation;

Object.defineProperty(admin, "__esModule", { value: true });
admin.Admin = void 0;
const add_user_1 = add_user;
const execute_operation_1$6 = execute_operation;
const list_databases_1 = list_databases;
const remove_user_1 = remove_user;
const run_command_1$2 = run_command;
const validate_collection_1 = validate_collection;
/**
 * The **Admin** class is an internal class that allows convenient access to
 * the admin functionality and commands for MongoDB.
 *
 * **ADMIN Cannot directly be instantiated**
 * @public
 *
 * @example
 * ```ts
 * import { MongoClient } from 'mongodb';
 *
 * const client = new MongoClient('mongodb://localhost:27017');
 * const admin = client.db().admin();
 * const dbInfo = await admin.listDatabases();
 * for (const db of dbInfo.databases) {
 *   console.log(db.name);
 * }
 * ```
 */
class Admin {
    /**
     * Create a new Admin instance
     * @internal
     */
    constructor(db) {
        this.s = { db };
    }
    /**
     * Execute a command
     *
     * The driver will ensure the following fields are attached to the command sent to the server:
     * - `lsid` - sourced from an implicit session or options.session
     * - `$readPreference` - defaults to primary or can be configured by options.readPreference
     * - `$db` - sourced from the name of this database
     *
     * If the client has a serverApi setting:
     * - `apiVersion`
     * - `apiStrict`
     * - `apiDeprecationErrors`
     *
     * When in a transaction:
     * - `readConcern` - sourced from readConcern set on the TransactionOptions
     * - `writeConcern` - sourced from writeConcern set on the TransactionOptions
     *
     * Attaching any of the above fields to the command will have no effect as the driver will overwrite the value.
     *
     * @param command - The command to execute
     * @param options - Optional settings for the command
     */
    async command(command, options) {
        return (0, execute_operation_1$6.executeOperation)(this.s.db.client, new run_command_1$2.RunCommandOperation(this.s.db, command, { dbName: 'admin', ...options }));
    }
    /**
     * Retrieve the server build information
     *
     * @param options - Optional settings for the command
     */
    async buildInfo(options) {
        return this.command({ buildinfo: 1 }, options);
    }
    /**
     * Retrieve the server build information
     *
     * @param options - Optional settings for the command
     */
    async serverInfo(options) {
        return this.command({ buildinfo: 1 }, options);
    }
    /**
     * Retrieve this db's server status.
     *
     * @param options - Optional settings for the command
     */
    async serverStatus(options) {
        return this.command({ serverStatus: 1 }, options);
    }
    /**
     * Ping the MongoDB server and retrieve results
     *
     * @param options - Optional settings for the command
     */
    async ping(options) {
        return this.command({ ping: 1 }, options);
    }
    /**
     * Add a user to the database
     *
     * @param username - The username for the new user
     * @param passwordOrOptions - An optional password for the new user, or the options for the command
     * @param options - Optional settings for the command
     * @deprecated Use the createUser command in `db.command()` instead.
     * @see https://www.mongodb.com/docs/manual/reference/command/createUser/
     */
    async addUser(username, passwordOrOptions, options) {
        options =
            options != null && typeof options === 'object'
                ? options
                : passwordOrOptions != null && typeof passwordOrOptions === 'object'
                    ? passwordOrOptions
                    : undefined;
        const password = typeof passwordOrOptions === 'string' ? passwordOrOptions : undefined;
        return (0, execute_operation_1$6.executeOperation)(this.s.db.client, new add_user_1.AddUserOperation(this.s.db, username, password, { dbName: 'admin', ...options }));
    }
    /**
     * Remove a user from a database
     *
     * @param username - The username to remove
     * @param options - Optional settings for the command
     */
    async removeUser(username, options) {
        return (0, execute_operation_1$6.executeOperation)(this.s.db.client, new remove_user_1.RemoveUserOperation(this.s.db, username, { dbName: 'admin', ...options }));
    }
    /**
     * Validate an existing collection
     *
     * @param collectionName - The name of the collection to validate.
     * @param options - Optional settings for the command
     */
    async validateCollection(collectionName, options = {}) {
        return (0, execute_operation_1$6.executeOperation)(this.s.db.client, new validate_collection_1.ValidateCollectionOperation(this, collectionName, options));
    }
    /**
     * List the available databases
     *
     * @param options - Optional settings for the command
     */
    async listDatabases(options) {
        return (0, execute_operation_1$6.executeOperation)(this.s.db.client, new list_databases_1.ListDatabasesOperation(this.s.db, options));
    }
    /**
     * Get ReplicaSet status
     *
     * @param options - Optional settings for the command
     */
    async replSetGetStatus(options) {
        return this.command({ replSetGetStatus: 1 }, options);
    }
}
admin.Admin = Admin;

var ordered = {};

var common = {};

var _delete = {};

Object.defineProperty(_delete, "__esModule", { value: true });
_delete.makeDeleteStatement = _delete.DeleteManyOperation = _delete.DeleteOneOperation = _delete.DeleteOperation = void 0;
const error_1$D = error;
const command_1$b = command;
const operation_1$i = operation;
/** @internal */
class DeleteOperation extends command_1$b.CommandOperation {
    constructor(ns, statements, options) {
        super(undefined, options);
        this.options = options;
        this.ns = ns;
        this.statements = statements;
    }
    get canRetryWrite() {
        if (super.canRetryWrite === false) {
            return false;
        }
        return this.statements.every(op => (op.limit != null ? op.limit > 0 : true));
    }
    executeCallback(server, session, callback) {
        const options = this.options ?? {};
        const ordered = typeof options.ordered === 'boolean' ? options.ordered : true;
        const command = {
            delete: this.ns.collection,
            deletes: this.statements,
            ordered
        };
        if (options.let) {
            command.let = options.let;
        }
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (options.comment !== undefined) {
            command.comment = options.comment;
        }
        const unacknowledgedWrite = this.writeConcern && this.writeConcern.w === 0;
        if (unacknowledgedWrite) {
            if (this.statements.find((o) => o.hint)) {
                // TODO(NODE-3541): fix error for hint with unacknowledged writes
                callback(new error_1$D.MongoCompatibilityError(`hint is not supported with unacknowledged writes`));
                return;
            }
        }
        super.executeCommand(server, session, command, callback);
    }
}
_delete.DeleteOperation = DeleteOperation;
class DeleteOneOperation extends DeleteOperation {
    constructor(collection, filter, options) {
        super(collection.s.namespace, [makeDeleteStatement(filter, { ...options, limit: 1 })], options);
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, res) => {
            if (err || res == null)
                return callback(err);
            if (res.code)
                return callback(new error_1$D.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1$D.MongoServerError(res.writeErrors[0]));
            if (this.explain)
                return callback(undefined, res);
            callback(undefined, {
                acknowledged: this.writeConcern?.w !== 0 ?? true,
                deletedCount: res.n
            });
        });
    }
}
_delete.DeleteOneOperation = DeleteOneOperation;
class DeleteManyOperation extends DeleteOperation {
    constructor(collection, filter, options) {
        super(collection.s.namespace, [makeDeleteStatement(filter, options)], options);
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, res) => {
            if (err || res == null)
                return callback(err);
            if (res.code)
                return callback(new error_1$D.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1$D.MongoServerError(res.writeErrors[0]));
            if (this.explain)
                return callback(undefined, res);
            callback(undefined, {
                acknowledged: this.writeConcern?.w !== 0 ?? true,
                deletedCount: res.n
            });
        });
    }
}
_delete.DeleteManyOperation = DeleteManyOperation;
function makeDeleteStatement(filter, options) {
    const op = {
        q: filter,
        limit: typeof options.limit === 'number' ? options.limit : 0
    };
    if (options.collation) {
        op.collation = options.collation;
    }
    if (options.hint) {
        op.hint = options.hint;
    }
    return op;
}
_delete.makeDeleteStatement = makeDeleteStatement;
(0, operation_1$i.defineAspects)(DeleteOperation, [operation_1$i.Aspect.RETRYABLE, operation_1$i.Aspect.WRITE_OPERATION]);
(0, operation_1$i.defineAspects)(DeleteOneOperation, [
    operation_1$i.Aspect.RETRYABLE,
    operation_1$i.Aspect.WRITE_OPERATION,
    operation_1$i.Aspect.EXPLAINABLE,
    operation_1$i.Aspect.SKIP_COLLATION
]);
(0, operation_1$i.defineAspects)(DeleteManyOperation, [
    operation_1$i.Aspect.WRITE_OPERATION,
    operation_1$i.Aspect.EXPLAINABLE,
    operation_1$i.Aspect.SKIP_COLLATION
]);

var insert = {};

var bulk_write = {};

Object.defineProperty(bulk_write, "__esModule", { value: true });
bulk_write.BulkWriteOperation = void 0;
const operation_1$h = operation;
/** @internal */
class BulkWriteOperation extends operation_1$h.AbstractCallbackOperation {
    constructor(collection, operations, options) {
        super(options);
        this.options = options;
        this.collection = collection;
        this.operations = operations;
    }
    executeCallback(server, session, callback) {
        const coll = this.collection;
        const operations = this.operations;
        const options = { ...this.options, ...this.bsonOptions, readPreference: this.readPreference };
        // Create the bulk operation
        const bulk = options.ordered === false
            ? coll.initializeUnorderedBulkOp(options)
            : coll.initializeOrderedBulkOp(options);
        // for each op go through and add to the bulk
        try {
            for (let i = 0; i < operations.length; i++) {
                bulk.raw(operations[i]);
            }
        }
        catch (err) {
            return callback(err);
        }
        // Execute the bulk
        bulk.execute({ ...options, session }).then(result => callback(undefined, result), error => callback(error));
    }
}
bulk_write.BulkWriteOperation = BulkWriteOperation;
(0, operation_1$h.defineAspects)(BulkWriteOperation, [operation_1$h.Aspect.WRITE_OPERATION]);

var common_functions = {};

Object.defineProperty(common_functions, "__esModule", { value: true });
common_functions.prepareDocs = common_functions.indexInformation = void 0;
const error_1$C = error;
const utils_1$o = utils;
function indexInformation(db, name, _optionsOrCallback, _callback) {
    let options = _optionsOrCallback;
    let callback = _callback;
    if ('function' === typeof _optionsOrCallback) {
        callback = _optionsOrCallback;
        options = {};
    }
    // If we specified full information
    const full = options.full == null ? false : options.full;
    let topology;
    try {
        topology = (0, utils_1$o.getTopology)(db);
    }
    catch (error) {
        return callback(error);
    }
    // Did the user destroy the topology
    if (topology.isDestroyed())
        return callback(new error_1$C.MongoTopologyClosedError());
    // Process all the results from the index command and collection
    function processResults(indexes) {
        // Contains all the information
        const info = {};
        // Process all the indexes
        for (let i = 0; i < indexes.length; i++) {
            const index = indexes[i];
            // Let's unpack the object
            info[index.name] = [];
            for (const name in index.key) {
                info[index.name].push([name, index.key[name]]);
            }
        }
        return info;
    }
    // Get the list of indexes of the specified collection
    db.collection(name)
        .listIndexes(options)
        .toArray()
        .then(indexes => {
        if (!Array.isArray(indexes))
            return callback(undefined, []);
        if (full)
            return callback(undefined, indexes);
        callback(undefined, processResults(indexes));
    }, error => callback(error));
}
common_functions.indexInformation = indexInformation;
function prepareDocs(coll, docs, options) {
    const forceServerObjectId = typeof options.forceServerObjectId === 'boolean'
        ? options.forceServerObjectId
        : coll.s.db.options?.forceServerObjectId;
    // no need to modify the docs if server sets the ObjectId
    if (forceServerObjectId === true) {
        return docs;
    }
    return docs.map(doc => {
        if (doc._id == null) {
            doc._id = coll.s.pkFactory.createPk();
        }
        return doc;
    });
}
common_functions.prepareDocs = prepareDocs;

Object.defineProperty(insert, "__esModule", { value: true });
insert.InsertManyOperation = insert.InsertOneOperation = insert.InsertOperation = void 0;
const error_1$B = error;
const write_concern_1$3 = write_concern;
const bulk_write_1 = bulk_write;
const command_1$a = command;
const common_functions_1$1 = common_functions;
const operation_1$g = operation;
/** @internal */
class InsertOperation extends command_1$a.CommandOperation {
    constructor(ns, documents, options) {
        super(undefined, options);
        this.options = { ...options, checkKeys: options.checkKeys ?? false };
        this.ns = ns;
        this.documents = documents;
    }
    executeCallback(server, session, callback) {
        const options = this.options ?? {};
        const ordered = typeof options.ordered === 'boolean' ? options.ordered : true;
        const command = {
            insert: this.ns.collection,
            documents: this.documents,
            ordered
        };
        if (typeof options.bypassDocumentValidation === 'boolean') {
            command.bypassDocumentValidation = options.bypassDocumentValidation;
        }
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (options.comment !== undefined) {
            command.comment = options.comment;
        }
        super.executeCommand(server, session, command, callback);
    }
}
insert.InsertOperation = InsertOperation;
class InsertOneOperation extends InsertOperation {
    constructor(collection, doc, options) {
        super(collection.s.namespace, (0, common_functions_1$1.prepareDocs)(collection, [doc], options), options);
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, res) => {
            if (err || res == null)
                return callback(err);
            if (res.code)
                return callback(new error_1$B.MongoServerError(res));
            if (res.writeErrors) {
                // This should be a WriteError but we can't change it now because of error hierarchy
                return callback(new error_1$B.MongoServerError(res.writeErrors[0]));
            }
            callback(undefined, {
                acknowledged: this.writeConcern?.w !== 0 ?? true,
                insertedId: this.documents[0]._id
            });
        });
    }
}
insert.InsertOneOperation = InsertOneOperation;
/** @internal */
class InsertManyOperation extends operation_1$g.AbstractCallbackOperation {
    constructor(collection, docs, options) {
        super(options);
        if (!Array.isArray(docs)) {
            throw new error_1$B.MongoInvalidArgumentError('Argument "docs" must be an array of documents');
        }
        this.options = options;
        this.collection = collection;
        this.docs = docs;
    }
    executeCallback(server, session, callback) {
        const coll = this.collection;
        const options = { ...this.options, ...this.bsonOptions, readPreference: this.readPreference };
        const writeConcern = write_concern_1$3.WriteConcern.fromOptions(options);
        const bulkWriteOperation = new bulk_write_1.BulkWriteOperation(coll, (0, common_functions_1$1.prepareDocs)(coll, this.docs, options).map(document => ({ insertOne: { document } })), options);
        bulkWriteOperation.executeCallback(server, session, (err, res) => {
            if (err || res == null) {
                if (err && err.message === 'Operation must be an object with an operation key') {
                    err = new error_1$B.MongoInvalidArgumentError('Collection.insertMany() cannot be called with an array that has null/undefined values');
                }
                return callback(err);
            }
            callback(undefined, {
                acknowledged: writeConcern?.w !== 0 ?? true,
                insertedCount: res.insertedCount,
                insertedIds: res.insertedIds
            });
        });
    }
}
insert.InsertManyOperation = InsertManyOperation;
(0, operation_1$g.defineAspects)(InsertOperation, [operation_1$g.Aspect.RETRYABLE, operation_1$g.Aspect.WRITE_OPERATION]);
(0, operation_1$g.defineAspects)(InsertOneOperation, [operation_1$g.Aspect.RETRYABLE, operation_1$g.Aspect.WRITE_OPERATION]);
(0, operation_1$g.defineAspects)(InsertManyOperation, [operation_1$g.Aspect.WRITE_OPERATION]);

var update$1 = {};

Object.defineProperty(update$1, "__esModule", { value: true });
update$1.makeUpdateStatement = update$1.ReplaceOneOperation = update$1.UpdateManyOperation = update$1.UpdateOneOperation = update$1.UpdateOperation = void 0;
const error_1$A = error;
const utils_1$n = utils;
const command_1$9 = command;
const operation_1$f = operation;
/** @internal */
class UpdateOperation extends command_1$9.CommandOperation {
    constructor(ns, statements, options) {
        super(undefined, options);
        this.options = options;
        this.ns = ns;
        this.statements = statements;
    }
    get canRetryWrite() {
        if (super.canRetryWrite === false) {
            return false;
        }
        return this.statements.every(op => op.multi == null || op.multi === false);
    }
    executeCallback(server, session, callback) {
        const options = this.options ?? {};
        const ordered = typeof options.ordered === 'boolean' ? options.ordered : true;
        const command = {
            update: this.ns.collection,
            updates: this.statements,
            ordered
        };
        if (typeof options.bypassDocumentValidation === 'boolean') {
            command.bypassDocumentValidation = options.bypassDocumentValidation;
        }
        if (options.let) {
            command.let = options.let;
        }
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (options.comment !== undefined) {
            command.comment = options.comment;
        }
        const unacknowledgedWrite = this.writeConcern && this.writeConcern.w === 0;
        if (unacknowledgedWrite) {
            if (this.statements.find((o) => o.hint)) {
                // TODO(NODE-3541): fix error for hint with unacknowledged writes
                callback(new error_1$A.MongoCompatibilityError(`hint is not supported with unacknowledged writes`));
                return;
            }
        }
        super.executeCommand(server, session, command, callback);
    }
}
update$1.UpdateOperation = UpdateOperation;
/** @internal */
class UpdateOneOperation extends UpdateOperation {
    constructor(collection, filter, update, options) {
        super(collection.s.namespace, [makeUpdateStatement(filter, update, { ...options, multi: false })], options);
        if (!(0, utils_1$n.hasAtomicOperators)(update)) {
            throw new error_1$A.MongoInvalidArgumentError('Update document requires atomic operators');
        }
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, res) => {
            if (err || !res)
                return callback(err);
            if (this.explain != null)
                return callback(undefined, res);
            if (res.code)
                return callback(new error_1$A.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1$A.MongoServerError(res.writeErrors[0]));
            callback(undefined, {
                acknowledged: this.writeConcern?.w !== 0 ?? true,
                modifiedCount: res.nModified != null ? res.nModified : res.n,
                upsertedId: Array.isArray(res.upserted) && res.upserted.length > 0 ? res.upserted[0]._id : null,
                upsertedCount: Array.isArray(res.upserted) && res.upserted.length ? res.upserted.length : 0,
                matchedCount: Array.isArray(res.upserted) && res.upserted.length > 0 ? 0 : res.n
            });
        });
    }
}
update$1.UpdateOneOperation = UpdateOneOperation;
/** @internal */
class UpdateManyOperation extends UpdateOperation {
    constructor(collection, filter, update, options) {
        super(collection.s.namespace, [makeUpdateStatement(filter, update, { ...options, multi: true })], options);
        if (!(0, utils_1$n.hasAtomicOperators)(update)) {
            throw new error_1$A.MongoInvalidArgumentError('Update document requires atomic operators');
        }
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, res) => {
            if (err || !res)
                return callback(err);
            if (this.explain != null)
                return callback(undefined, res);
            if (res.code)
                return callback(new error_1$A.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1$A.MongoServerError(res.writeErrors[0]));
            callback(undefined, {
                acknowledged: this.writeConcern?.w !== 0 ?? true,
                modifiedCount: res.nModified != null ? res.nModified : res.n,
                upsertedId: Array.isArray(res.upserted) && res.upserted.length > 0 ? res.upserted[0]._id : null,
                upsertedCount: Array.isArray(res.upserted) && res.upserted.length ? res.upserted.length : 0,
                matchedCount: Array.isArray(res.upserted) && res.upserted.length > 0 ? 0 : res.n
            });
        });
    }
}
update$1.UpdateManyOperation = UpdateManyOperation;
/** @internal */
class ReplaceOneOperation extends UpdateOperation {
    constructor(collection, filter, replacement, options) {
        super(collection.s.namespace, [makeUpdateStatement(filter, replacement, { ...options, multi: false })], options);
        if ((0, utils_1$n.hasAtomicOperators)(replacement)) {
            throw new error_1$A.MongoInvalidArgumentError('Replacement document must not contain atomic operators');
        }
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, res) => {
            if (err || !res)
                return callback(err);
            if (this.explain != null)
                return callback(undefined, res);
            if (res.code)
                return callback(new error_1$A.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1$A.MongoServerError(res.writeErrors[0]));
            callback(undefined, {
                acknowledged: this.writeConcern?.w !== 0 ?? true,
                modifiedCount: res.nModified != null ? res.nModified : res.n,
                upsertedId: Array.isArray(res.upserted) && res.upserted.length > 0 ? res.upserted[0]._id : null,
                upsertedCount: Array.isArray(res.upserted) && res.upserted.length ? res.upserted.length : 0,
                matchedCount: Array.isArray(res.upserted) && res.upserted.length > 0 ? 0 : res.n
            });
        });
    }
}
update$1.ReplaceOneOperation = ReplaceOneOperation;
function makeUpdateStatement(filter, update, options) {
    if (filter == null || typeof filter !== 'object') {
        throw new error_1$A.MongoInvalidArgumentError('Selector must be a valid JavaScript object');
    }
    if (update == null || typeof update !== 'object') {
        throw new error_1$A.MongoInvalidArgumentError('Document must be a valid JavaScript object');
    }
    const op = { q: filter, u: update };
    if (typeof options.upsert === 'boolean') {
        op.upsert = options.upsert;
    }
    if (options.multi) {
        op.multi = options.multi;
    }
    if (options.hint) {
        op.hint = options.hint;
    }
    if (options.arrayFilters) {
        op.arrayFilters = options.arrayFilters;
    }
    if (options.collation) {
        op.collation = options.collation;
    }
    return op;
}
update$1.makeUpdateStatement = makeUpdateStatement;
(0, operation_1$f.defineAspects)(UpdateOperation, [operation_1$f.Aspect.RETRYABLE, operation_1$f.Aspect.WRITE_OPERATION, operation_1$f.Aspect.SKIP_COLLATION]);
(0, operation_1$f.defineAspects)(UpdateOneOperation, [
    operation_1$f.Aspect.RETRYABLE,
    operation_1$f.Aspect.WRITE_OPERATION,
    operation_1$f.Aspect.EXPLAINABLE,
    operation_1$f.Aspect.SKIP_COLLATION
]);
(0, operation_1$f.defineAspects)(UpdateManyOperation, [
    operation_1$f.Aspect.WRITE_OPERATION,
    operation_1$f.Aspect.EXPLAINABLE,
    operation_1$f.Aspect.SKIP_COLLATION
]);
(0, operation_1$f.defineAspects)(ReplaceOneOperation, [
    operation_1$f.Aspect.RETRYABLE,
    operation_1$f.Aspect.WRITE_OPERATION,
    operation_1$f.Aspect.SKIP_COLLATION
]);

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BulkOperationBase = exports.FindOperators = exports.MongoBulkWriteError = exports.mergeBatchResults = exports.WriteError = exports.WriteConcernError = exports.BulkWriteResult = exports.Batch = exports.BatchType = void 0;
	const bson_1 = bson;
	const error_1 = error;
	const delete_1 = _delete;
	const execute_operation_1 = execute_operation;
	const insert_1 = insert;
	const operation_1 = operation;
	const update_1 = update$1;
	const utils_1 = utils;
	const write_concern_1 = write_concern;
	/** @internal */
	const kServerError = Symbol('serverError');
	/** @public */
	exports.BatchType = Object.freeze({
	    INSERT: 1,
	    UPDATE: 2,
	    DELETE: 3
	});
	/**
	 * Keeps the state of a unordered batch so we can rewrite the results
	 * correctly after command execution
	 *
	 * @public
	 */
	class Batch {
	    constructor(batchType, originalZeroIndex) {
	        this.originalZeroIndex = originalZeroIndex;
	        this.currentIndex = 0;
	        this.originalIndexes = [];
	        this.batchType = batchType;
	        this.operations = [];
	        this.size = 0;
	        this.sizeBytes = 0;
	    }
	}
	exports.Batch = Batch;
	/**
	 * @public
	 * The result of a bulk write.
	 */
	class BulkWriteResult {
	    static generateIdMap(ids) {
	        const idMap = {};
	        for (const doc of ids) {
	            idMap[doc.index] = doc._id;
	        }
	        return idMap;
	    }
	    /**
	     * Create a new BulkWriteResult instance
	     * @internal
	     */
	    constructor(bulkResult) {
	        this.result = bulkResult;
	        this.insertedCount = this.result.nInserted ?? 0;
	        this.matchedCount = this.result.nMatched ?? 0;
	        this.modifiedCount = this.result.nModified ?? 0;
	        this.deletedCount = this.result.nRemoved ?? 0;
	        this.upsertedCount = this.result.upserted.length ?? 0;
	        this.upsertedIds = BulkWriteResult.generateIdMap(this.result.upserted);
	        this.insertedIds = BulkWriteResult.generateIdMap(this.result.insertedIds);
	        Object.defineProperty(this, 'result', { value: this.result, enumerable: false });
	    }
	    /** Evaluates to true if the bulk operation correctly executes */
	    get ok() {
	        return this.result.ok;
	    }
	    /**
	     * The number of inserted documents
	     * @deprecated Use insertedCount instead.
	     */
	    get nInserted() {
	        return this.result.nInserted;
	    }
	    /**
	     * Number of upserted documents
	     * @deprecated User upsertedCount instead.
	     */
	    get nUpserted() {
	        return this.result.nUpserted;
	    }
	    /**
	     * Number of matched documents
	     * @deprecated Use matchedCount instead.
	     */
	    get nMatched() {
	        return this.result.nMatched;
	    }
	    /**
	     * Number of documents updated physically on disk
	     * @deprecated Use modifiedCount instead.
	     */
	    get nModified() {
	        return this.result.nModified;
	    }
	    /**
	     * Number of removed documents
	     * @deprecated Use deletedCount instead.
	     */
	    get nRemoved() {
	        return this.result.nRemoved;
	    }
	    /**
	     * Returns an array of all inserted ids
	     * @deprecated Use insertedIds instead.
	     */
	    getInsertedIds() {
	        return this.result.insertedIds;
	    }
	    /**
	     * Returns an array of all upserted ids
	     * @deprecated Use upsertedIds instead.
	     */
	    getUpsertedIds() {
	        return this.result.upserted;
	    }
	    /** Returns the upserted id at the given index */
	    getUpsertedIdAt(index) {
	        return this.result.upserted[index];
	    }
	    /** Returns raw internal result */
	    getRawResponse() {
	        return this.result;
	    }
	    /** Returns true if the bulk operation contains a write error */
	    hasWriteErrors() {
	        return this.result.writeErrors.length > 0;
	    }
	    /** Returns the number of write errors off the bulk operation */
	    getWriteErrorCount() {
	        return this.result.writeErrors.length;
	    }
	    /** Returns a specific write error object */
	    getWriteErrorAt(index) {
	        return index < this.result.writeErrors.length ? this.result.writeErrors[index] : undefined;
	    }
	    /** Retrieve all write errors */
	    getWriteErrors() {
	        return this.result.writeErrors;
	    }
	    /** Retrieve the write concern error if one exists */
	    getWriteConcernError() {
	        if (this.result.writeConcernErrors.length === 0) {
	            return;
	        }
	        else if (this.result.writeConcernErrors.length === 1) {
	            // Return the error
	            return this.result.writeConcernErrors[0];
	        }
	        else {
	            // Combine the errors
	            let errmsg = '';
	            for (let i = 0; i < this.result.writeConcernErrors.length; i++) {
	                const err = this.result.writeConcernErrors[i];
	                errmsg = errmsg + err.errmsg;
	                // TODO: Something better
	                if (i === 0)
	                    errmsg = errmsg + ' and ';
	            }
	            return new WriteConcernError({ errmsg, code: error_1.MONGODB_ERROR_CODES.WriteConcernFailed });
	        }
	    }
	    toString() {
	        return `BulkWriteResult(${this.result})`;
	    }
	    isOk() {
	        return this.result.ok === 1;
	    }
	}
	exports.BulkWriteResult = BulkWriteResult;
	/**
	 * An error representing a failure by the server to apply the requested write concern to the bulk operation.
	 * @public
	 * @category Error
	 */
	class WriteConcernError {
	    constructor(error) {
	        this[kServerError] = error;
	    }
	    /** Write concern error code. */
	    get code() {
	        return this[kServerError].code;
	    }
	    /** Write concern error message. */
	    get errmsg() {
	        return this[kServerError].errmsg;
	    }
	    /** Write concern error info. */
	    get errInfo() {
	        return this[kServerError].errInfo;
	    }
	    toJSON() {
	        return this[kServerError];
	    }
	    toString() {
	        return `WriteConcernError(${this.errmsg})`;
	    }
	}
	exports.WriteConcernError = WriteConcernError;
	/**
	 * An error that occurred during a BulkWrite on the server.
	 * @public
	 * @category Error
	 */
	class WriteError {
	    constructor(err) {
	        this.err = err;
	    }
	    /** WriteError code. */
	    get code() {
	        return this.err.code;
	    }
	    /** WriteError original bulk operation index. */
	    get index() {
	        return this.err.index;
	    }
	    /** WriteError message. */
	    get errmsg() {
	        return this.err.errmsg;
	    }
	    /** WriteError details. */
	    get errInfo() {
	        return this.err.errInfo;
	    }
	    /** Returns the underlying operation that caused the error */
	    getOperation() {
	        return this.err.op;
	    }
	    toJSON() {
	        return { code: this.err.code, index: this.err.index, errmsg: this.err.errmsg, op: this.err.op };
	    }
	    toString() {
	        return `WriteError(${JSON.stringify(this.toJSON())})`;
	    }
	}
	exports.WriteError = WriteError;
	/** Merges results into shared data structure */
	function mergeBatchResults(batch, bulkResult, err, result) {
	    // If we have an error set the result to be the err object
	    if (err) {
	        result = err;
	    }
	    else if (result && result.result) {
	        result = result.result;
	    }
	    if (result == null) {
	        return;
	    }
	    // Do we have a top level error stop processing and return
	    if (result.ok === 0 && bulkResult.ok === 1) {
	        bulkResult.ok = 0;
	        const writeError = {
	            index: 0,
	            code: result.code || 0,
	            errmsg: result.message,
	            errInfo: result.errInfo,
	            op: batch.operations[0]
	        };
	        bulkResult.writeErrors.push(new WriteError(writeError));
	        return;
	    }
	    else if (result.ok === 0 && bulkResult.ok === 0) {
	        return;
	    }
	    // If we have an insert Batch type
	    if (isInsertBatch(batch) && result.n) {
	        bulkResult.nInserted = bulkResult.nInserted + result.n;
	    }
	    // If we have an insert Batch type
	    if (isDeleteBatch(batch) && result.n) {
	        bulkResult.nRemoved = bulkResult.nRemoved + result.n;
	    }
	    let nUpserted = 0;
	    // We have an array of upserted values, we need to rewrite the indexes
	    if (Array.isArray(result.upserted)) {
	        nUpserted = result.upserted.length;
	        for (let i = 0; i < result.upserted.length; i++) {
	            bulkResult.upserted.push({
	                index: result.upserted[i].index + batch.originalZeroIndex,
	                _id: result.upserted[i]._id
	            });
	        }
	    }
	    else if (result.upserted) {
	        nUpserted = 1;
	        bulkResult.upserted.push({
	            index: batch.originalZeroIndex,
	            _id: result.upserted
	        });
	    }
	    // If we have an update Batch type
	    if (isUpdateBatch(batch) && result.n) {
	        const nModified = result.nModified;
	        bulkResult.nUpserted = bulkResult.nUpserted + nUpserted;
	        bulkResult.nMatched = bulkResult.nMatched + (result.n - nUpserted);
	        if (typeof nModified === 'number') {
	            bulkResult.nModified = bulkResult.nModified + nModified;
	        }
	        else {
	            bulkResult.nModified = 0;
	        }
	    }
	    if (Array.isArray(result.writeErrors)) {
	        for (let i = 0; i < result.writeErrors.length; i++) {
	            const writeError = {
	                index: batch.originalIndexes[result.writeErrors[i].index],
	                code: result.writeErrors[i].code,
	                errmsg: result.writeErrors[i].errmsg,
	                errInfo: result.writeErrors[i].errInfo,
	                op: batch.operations[result.writeErrors[i].index]
	            };
	            bulkResult.writeErrors.push(new WriteError(writeError));
	        }
	    }
	    if (result.writeConcernError) {
	        bulkResult.writeConcernErrors.push(new WriteConcernError(result.writeConcernError));
	    }
	}
	exports.mergeBatchResults = mergeBatchResults;
	function executeCommands(bulkOperation, options, callback) {
	    if (bulkOperation.s.batches.length === 0) {
	        return callback(undefined, new BulkWriteResult(bulkOperation.s.bulkResult));
	    }
	    const batch = bulkOperation.s.batches.shift();
	    function resultHandler(err, result) {
	        // Error is a driver related error not a bulk op error, return early
	        if (err && 'message' in err && !(err instanceof error_1.MongoWriteConcernError)) {
	            return callback(new MongoBulkWriteError(err, new BulkWriteResult(bulkOperation.s.bulkResult)));
	        }
	        if (err instanceof error_1.MongoWriteConcernError) {
	            return handleMongoWriteConcernError(batch, bulkOperation.s.bulkResult, err, callback);
	        }
	        // Merge the results together
	        mergeBatchResults(batch, bulkOperation.s.bulkResult, err, result);
	        const writeResult = new BulkWriteResult(bulkOperation.s.bulkResult);
	        if (bulkOperation.handleWriteError(callback, writeResult))
	            return;
	        // Execute the next command in line
	        executeCommands(bulkOperation, options, callback);
	    }
	    const finalOptions = (0, utils_1.resolveOptions)(bulkOperation, {
	        ...options,
	        ordered: bulkOperation.isOrdered
	    });
	    if (finalOptions.bypassDocumentValidation !== true) {
	        delete finalOptions.bypassDocumentValidation;
	    }
	    // Set an operationIf if provided
	    if (bulkOperation.operationId) {
	        resultHandler.operationId = bulkOperation.operationId;
	    }
	    // Is the bypassDocumentValidation options specific
	    if (bulkOperation.s.bypassDocumentValidation === true) {
	        finalOptions.bypassDocumentValidation = true;
	    }
	    // Is the checkKeys option disabled
	    if (bulkOperation.s.checkKeys === false) {
	        finalOptions.checkKeys = false;
	    }
	    if (finalOptions.retryWrites) {
	        if (isUpdateBatch(batch)) {
	            finalOptions.retryWrites = finalOptions.retryWrites && !batch.operations.some(op => op.multi);
	        }
	        if (isDeleteBatch(batch)) {
	            finalOptions.retryWrites =
	                finalOptions.retryWrites && !batch.operations.some(op => op.limit === 0);
	        }
	    }
	    try {
	        if (isInsertBatch(batch)) {
	            (0, execute_operation_1.executeOperation)(bulkOperation.s.collection.client, new insert_1.InsertOperation(bulkOperation.s.namespace, batch.operations, finalOptions), resultHandler);
	        }
	        else if (isUpdateBatch(batch)) {
	            (0, execute_operation_1.executeOperation)(bulkOperation.s.collection.client, new update_1.UpdateOperation(bulkOperation.s.namespace, batch.operations, finalOptions), resultHandler);
	        }
	        else if (isDeleteBatch(batch)) {
	            (0, execute_operation_1.executeOperation)(bulkOperation.s.collection.client, new delete_1.DeleteOperation(bulkOperation.s.namespace, batch.operations, finalOptions), resultHandler);
	        }
	    }
	    catch (err) {
	        // Force top level error
	        err.ok = 0;
	        // Merge top level error and return
	        mergeBatchResults(batch, bulkOperation.s.bulkResult, err, undefined);
	        callback();
	    }
	}
	function handleMongoWriteConcernError(batch, bulkResult, err, callback) {
	    mergeBatchResults(batch, bulkResult, undefined, err.result);
	    callback(new MongoBulkWriteError({
	        message: err.result?.writeConcernError.errmsg,
	        code: err.result?.writeConcernError.result
	    }, new BulkWriteResult(bulkResult)));
	}
	/**
	 * An error indicating an unsuccessful Bulk Write
	 * @public
	 * @category Error
	 */
	class MongoBulkWriteError extends error_1.MongoServerError {
	    /** Creates a new MongoBulkWriteError */
	    constructor(error, result) {
	        super(error);
	        this.writeErrors = [];
	        if (error instanceof WriteConcernError)
	            this.err = error;
	        else if (!(error instanceof Error)) {
	            this.message = error.message;
	            this.code = error.code;
	            this.writeErrors = error.writeErrors ?? [];
	        }
	        this.result = result;
	        Object.assign(this, error);
	    }
	    get name() {
	        return 'MongoBulkWriteError';
	    }
	    /** Number of documents inserted. */
	    get insertedCount() {
	        return this.result.insertedCount;
	    }
	    /** Number of documents matched for update. */
	    get matchedCount() {
	        return this.result.matchedCount;
	    }
	    /** Number of documents modified. */
	    get modifiedCount() {
	        return this.result.modifiedCount;
	    }
	    /** Number of documents deleted. */
	    get deletedCount() {
	        return this.result.deletedCount;
	    }
	    /** Number of documents upserted. */
	    get upsertedCount() {
	        return this.result.upsertedCount;
	    }
	    /** Inserted document generated Id's, hash key is the index of the originating operation */
	    get insertedIds() {
	        return this.result.insertedIds;
	    }
	    /** Upserted document generated Id's, hash key is the index of the originating operation */
	    get upsertedIds() {
	        return this.result.upsertedIds;
	    }
	}
	exports.MongoBulkWriteError = MongoBulkWriteError;
	/**
	 * A builder object that is returned from {@link BulkOperationBase#find}.
	 * Is used to build a write operation that involves a query filter.
	 *
	 * @public
	 */
	class FindOperators {
	    /**
	     * Creates a new FindOperators object.
	     * @internal
	     */
	    constructor(bulkOperation) {
	        this.bulkOperation = bulkOperation;
	    }
	    /** Add a multiple update operation to the bulk operation */
	    update(updateDocument) {
	        const currentOp = buildCurrentOp(this.bulkOperation);
	        return this.bulkOperation.addToOperationsList(exports.BatchType.UPDATE, (0, update_1.makeUpdateStatement)(currentOp.selector, updateDocument, {
	            ...currentOp,
	            multi: true
	        }));
	    }
	    /** Add a single update operation to the bulk operation */
	    updateOne(updateDocument) {
	        if (!(0, utils_1.hasAtomicOperators)(updateDocument)) {
	            throw new error_1.MongoInvalidArgumentError('Update document requires atomic operators');
	        }
	        const currentOp = buildCurrentOp(this.bulkOperation);
	        return this.bulkOperation.addToOperationsList(exports.BatchType.UPDATE, (0, update_1.makeUpdateStatement)(currentOp.selector, updateDocument, { ...currentOp, multi: false }));
	    }
	    /** Add a replace one operation to the bulk operation */
	    replaceOne(replacement) {
	        if ((0, utils_1.hasAtomicOperators)(replacement)) {
	            throw new error_1.MongoInvalidArgumentError('Replacement document must not use atomic operators');
	        }
	        const currentOp = buildCurrentOp(this.bulkOperation);
	        return this.bulkOperation.addToOperationsList(exports.BatchType.UPDATE, (0, update_1.makeUpdateStatement)(currentOp.selector, replacement, { ...currentOp, multi: false }));
	    }
	    /** Add a delete one operation to the bulk operation */
	    deleteOne() {
	        const currentOp = buildCurrentOp(this.bulkOperation);
	        return this.bulkOperation.addToOperationsList(exports.BatchType.DELETE, (0, delete_1.makeDeleteStatement)(currentOp.selector, { ...currentOp, limit: 1 }));
	    }
	    /** Add a delete many operation to the bulk operation */
	    delete() {
	        const currentOp = buildCurrentOp(this.bulkOperation);
	        return this.bulkOperation.addToOperationsList(exports.BatchType.DELETE, (0, delete_1.makeDeleteStatement)(currentOp.selector, { ...currentOp, limit: 0 }));
	    }
	    /** Upsert modifier for update bulk operation, noting that this operation is an upsert. */
	    upsert() {
	        if (!this.bulkOperation.s.currentOp) {
	            this.bulkOperation.s.currentOp = {};
	        }
	        this.bulkOperation.s.currentOp.upsert = true;
	        return this;
	    }
	    /** Specifies the collation for the query condition. */
	    collation(collation) {
	        if (!this.bulkOperation.s.currentOp) {
	            this.bulkOperation.s.currentOp = {};
	        }
	        this.bulkOperation.s.currentOp.collation = collation;
	        return this;
	    }
	    /** Specifies arrayFilters for UpdateOne or UpdateMany bulk operations. */
	    arrayFilters(arrayFilters) {
	        if (!this.bulkOperation.s.currentOp) {
	            this.bulkOperation.s.currentOp = {};
	        }
	        this.bulkOperation.s.currentOp.arrayFilters = arrayFilters;
	        return this;
	    }
	    /** Specifies hint for the bulk operation. */
	    hint(hint) {
	        if (!this.bulkOperation.s.currentOp) {
	            this.bulkOperation.s.currentOp = {};
	        }
	        this.bulkOperation.s.currentOp.hint = hint;
	        return this;
	    }
	}
	exports.FindOperators = FindOperators;
	/**
	 * TODO(NODE-4063)
	 * BulkWrites merge complexity is implemented in executeCommands
	 * This provides a vehicle to treat bulkOperations like any other operation (hence "shim")
	 * We would like this logic to simply live inside the BulkWriteOperation class
	 * @internal
	 */
	class BulkWriteShimOperation extends operation_1.AbstractCallbackOperation {
	    constructor(bulkOperation, options) {
	        super(options);
	        this.bulkOperation = bulkOperation;
	    }
	    executeCallback(server, session, callback) {
	        if (this.options.session == null) {
	            // An implicit session could have been created by 'executeOperation'
	            // So if we stick it on finalOptions here, each bulk operation
	            // will use this same session, it'll be passed in the same way
	            // an explicit session would be
	            this.options.session = session;
	        }
	        return executeCommands(this.bulkOperation, this.options, callback);
	    }
	}
	/** @public */
	class BulkOperationBase {
	    /**
	     * Create a new OrderedBulkOperation or UnorderedBulkOperation instance
	     * @internal
	     */
	    constructor(collection, options, isOrdered) {
	        // determine whether bulkOperation is ordered or unordered
	        this.isOrdered = isOrdered;
	        const topology = (0, utils_1.getTopology)(collection);
	        options = options == null ? {} : options;
	        // TODO Bring from driver information in hello
	        // Get the namespace for the write operations
	        const namespace = collection.s.namespace;
	        // Used to mark operation as executed
	        const executed = false;
	        // Current item
	        const currentOp = undefined;
	        // Set max byte size
	        const hello = topology.lastHello();
	        // If we have autoEncryption on, batch-splitting must be done on 2mb chunks, but single documents
	        // over 2mb are still allowed
	        const usingAutoEncryption = !!(topology.s.options && topology.s.options.autoEncrypter);
	        const maxBsonObjectSize = hello && hello.maxBsonObjectSize ? hello.maxBsonObjectSize : 1024 * 1024 * 16;
	        const maxBatchSizeBytes = usingAutoEncryption ? 1024 * 1024 * 2 : maxBsonObjectSize;
	        const maxWriteBatchSize = hello && hello.maxWriteBatchSize ? hello.maxWriteBatchSize : 1000;
	        // Calculates the largest possible size of an Array key, represented as a BSON string
	        // element. This calculation:
	        //     1 byte for BSON type
	        //     # of bytes = length of (string representation of (maxWriteBatchSize - 1))
	        //   + 1 bytes for null terminator
	        const maxKeySize = (maxWriteBatchSize - 1).toString(10).length + 2;
	        // Final options for retryable writes
	        let finalOptions = Object.assign({}, options);
	        finalOptions = (0, utils_1.applyRetryableWrites)(finalOptions, collection.s.db);
	        // Final results
	        const bulkResult = {
	            ok: 1,
	            writeErrors: [],
	            writeConcernErrors: [],
	            insertedIds: [],
	            nInserted: 0,
	            nUpserted: 0,
	            nMatched: 0,
	            nModified: 0,
	            nRemoved: 0,
	            upserted: []
	        };
	        // Internal state
	        this.s = {
	            // Final result
	            bulkResult,
	            // Current batch state
	            currentBatch: undefined,
	            currentIndex: 0,
	            // ordered specific
	            currentBatchSize: 0,
	            currentBatchSizeBytes: 0,
	            // unordered specific
	            currentInsertBatch: undefined,
	            currentUpdateBatch: undefined,
	            currentRemoveBatch: undefined,
	            batches: [],
	            // Write concern
	            writeConcern: write_concern_1.WriteConcern.fromOptions(options),
	            // Max batch size options
	            maxBsonObjectSize,
	            maxBatchSizeBytes,
	            maxWriteBatchSize,
	            maxKeySize,
	            // Namespace
	            namespace,
	            // Topology
	            topology,
	            // Options
	            options: finalOptions,
	            // BSON options
	            bsonOptions: (0, bson_1.resolveBSONOptions)(options),
	            // Current operation
	            currentOp,
	            // Executed
	            executed,
	            // Collection
	            collection,
	            // Fundamental error
	            err: undefined,
	            // check keys
	            checkKeys: typeof options.checkKeys === 'boolean' ? options.checkKeys : false
	        };
	        // bypass Validation
	        if (options.bypassDocumentValidation === true) {
	            this.s.bypassDocumentValidation = true;
	        }
	    }
	    /**
	     * Add a single insert document to the bulk operation
	     *
	     * @example
	     * ```ts
	     * const bulkOp = collection.initializeOrderedBulkOp();
	     *
	     * // Adds three inserts to the bulkOp.
	     * bulkOp
	     *   .insert({ a: 1 })
	     *   .insert({ b: 2 })
	     *   .insert({ c: 3 });
	     * await bulkOp.execute();
	     * ```
	     */
	    insert(document) {
	        if (document._id == null && !shouldForceServerObjectId(this)) {
	            document._id = new bson_1.ObjectId();
	        }
	        return this.addToOperationsList(exports.BatchType.INSERT, document);
	    }
	    /**
	     * Builds a find operation for an update/updateOne/delete/deleteOne/replaceOne.
	     * Returns a builder object used to complete the definition of the operation.
	     *
	     * @example
	     * ```ts
	     * const bulkOp = collection.initializeOrderedBulkOp();
	     *
	     * // Add an updateOne to the bulkOp
	     * bulkOp.find({ a: 1 }).updateOne({ $set: { b: 2 } });
	     *
	     * // Add an updateMany to the bulkOp
	     * bulkOp.find({ c: 3 }).update({ $set: { d: 4 } });
	     *
	     * // Add an upsert
	     * bulkOp.find({ e: 5 }).upsert().updateOne({ $set: { f: 6 } });
	     *
	     * // Add a deletion
	     * bulkOp.find({ g: 7 }).deleteOne();
	     *
	     * // Add a multi deletion
	     * bulkOp.find({ h: 8 }).delete();
	     *
	     * // Add a replaceOne
	     * bulkOp.find({ i: 9 }).replaceOne({writeConcern: { j: 10 }});
	     *
	     * // Update using a pipeline (requires Mongodb 4.2 or higher)
	     * bulk.find({ k: 11, y: { $exists: true }, z: { $exists: true } }).updateOne([
	     *   { $set: { total: { $sum: [ '$y', '$z' ] } } }
	     * ]);
	     *
	     * // All of the ops will now be executed
	     * await bulkOp.execute();
	     * ```
	     */
	    find(selector) {
	        if (!selector) {
	            throw new error_1.MongoInvalidArgumentError('Bulk find operation must specify a selector');
	        }
	        // Save a current selector
	        this.s.currentOp = {
	            selector: selector
	        };
	        return new FindOperators(this);
	    }
	    /** Specifies a raw operation to perform in the bulk write. */
	    raw(op) {
	        if (op == null || typeof op !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Operation must be an object with an operation key');
	        }
	        if ('insertOne' in op) {
	            const forceServerObjectId = shouldForceServerObjectId(this);
	            if (op.insertOne && op.insertOne.document == null) {
	                // NOTE: provided for legacy support, but this is a malformed operation
	                if (forceServerObjectId !== true && op.insertOne._id == null) {
	                    op.insertOne._id = new bson_1.ObjectId();
	                }
	                return this.addToOperationsList(exports.BatchType.INSERT, op.insertOne);
	            }
	            if (forceServerObjectId !== true && op.insertOne.document._id == null) {
	                op.insertOne.document._id = new bson_1.ObjectId();
	            }
	            return this.addToOperationsList(exports.BatchType.INSERT, op.insertOne.document);
	        }
	        if ('replaceOne' in op || 'updateOne' in op || 'updateMany' in op) {
	            if ('replaceOne' in op) {
	                if ('q' in op.replaceOne) {
	                    throw new error_1.MongoInvalidArgumentError('Raw operations are not allowed');
	                }
	                const updateStatement = (0, update_1.makeUpdateStatement)(op.replaceOne.filter, op.replaceOne.replacement, { ...op.replaceOne, multi: false });
	                if ((0, utils_1.hasAtomicOperators)(updateStatement.u)) {
	                    throw new error_1.MongoInvalidArgumentError('Replacement document must not use atomic operators');
	                }
	                return this.addToOperationsList(exports.BatchType.UPDATE, updateStatement);
	            }
	            if ('updateOne' in op) {
	                if ('q' in op.updateOne) {
	                    throw new error_1.MongoInvalidArgumentError('Raw operations are not allowed');
	                }
	                const updateStatement = (0, update_1.makeUpdateStatement)(op.updateOne.filter, op.updateOne.update, {
	                    ...op.updateOne,
	                    multi: false
	                });
	                if (!(0, utils_1.hasAtomicOperators)(updateStatement.u)) {
	                    throw new error_1.MongoInvalidArgumentError('Update document requires atomic operators');
	                }
	                return this.addToOperationsList(exports.BatchType.UPDATE, updateStatement);
	            }
	            if ('updateMany' in op) {
	                if ('q' in op.updateMany) {
	                    throw new error_1.MongoInvalidArgumentError('Raw operations are not allowed');
	                }
	                const updateStatement = (0, update_1.makeUpdateStatement)(op.updateMany.filter, op.updateMany.update, {
	                    ...op.updateMany,
	                    multi: true
	                });
	                if (!(0, utils_1.hasAtomicOperators)(updateStatement.u)) {
	                    throw new error_1.MongoInvalidArgumentError('Update document requires atomic operators');
	                }
	                return this.addToOperationsList(exports.BatchType.UPDATE, updateStatement);
	            }
	        }
	        if ('deleteOne' in op) {
	            if ('q' in op.deleteOne) {
	                throw new error_1.MongoInvalidArgumentError('Raw operations are not allowed');
	            }
	            return this.addToOperationsList(exports.BatchType.DELETE, (0, delete_1.makeDeleteStatement)(op.deleteOne.filter, { ...op.deleteOne, limit: 1 }));
	        }
	        if ('deleteMany' in op) {
	            if ('q' in op.deleteMany) {
	                throw new error_1.MongoInvalidArgumentError('Raw operations are not allowed');
	            }
	            return this.addToOperationsList(exports.BatchType.DELETE, (0, delete_1.makeDeleteStatement)(op.deleteMany.filter, { ...op.deleteMany, limit: 0 }));
	        }
	        // otherwise an unknown operation was provided
	        throw new error_1.MongoInvalidArgumentError('bulkWrite only supports insertOne, updateOne, updateMany, deleteOne, deleteMany');
	    }
	    get bsonOptions() {
	        return this.s.bsonOptions;
	    }
	    get writeConcern() {
	        return this.s.writeConcern;
	    }
	    get batches() {
	        const batches = [...this.s.batches];
	        if (this.isOrdered) {
	            if (this.s.currentBatch)
	                batches.push(this.s.currentBatch);
	        }
	        else {
	            if (this.s.currentInsertBatch)
	                batches.push(this.s.currentInsertBatch);
	            if (this.s.currentUpdateBatch)
	                batches.push(this.s.currentUpdateBatch);
	            if (this.s.currentRemoveBatch)
	                batches.push(this.s.currentRemoveBatch);
	        }
	        return batches;
	    }
	    async execute(options = {}) {
	        if (this.s.executed) {
	            throw new error_1.MongoBatchReExecutionError();
	        }
	        const writeConcern = write_concern_1.WriteConcern.fromOptions(options);
	        if (writeConcern) {
	            this.s.writeConcern = writeConcern;
	        }
	        // If we have current batch
	        if (this.isOrdered) {
	            if (this.s.currentBatch)
	                this.s.batches.push(this.s.currentBatch);
	        }
	        else {
	            if (this.s.currentInsertBatch)
	                this.s.batches.push(this.s.currentInsertBatch);
	            if (this.s.currentUpdateBatch)
	                this.s.batches.push(this.s.currentUpdateBatch);
	            if (this.s.currentRemoveBatch)
	                this.s.batches.push(this.s.currentRemoveBatch);
	        }
	        // If we have no operations in the bulk raise an error
	        if (this.s.batches.length === 0) {
	            throw new error_1.MongoInvalidArgumentError('Invalid BulkOperation, Batch cannot be empty');
	        }
	        this.s.executed = true;
	        const finalOptions = { ...this.s.options, ...options };
	        const operation = new BulkWriteShimOperation(this, finalOptions);
	        return (0, execute_operation_1.executeOperation)(this.s.collection.client, operation);
	    }
	    /**
	     * Handles the write error before executing commands
	     * @internal
	     */
	    handleWriteError(callback, writeResult) {
	        if (this.s.bulkResult.writeErrors.length > 0) {
	            const msg = this.s.bulkResult.writeErrors[0].errmsg
	                ? this.s.bulkResult.writeErrors[0].errmsg
	                : 'write operation failed';
	            callback(new MongoBulkWriteError({
	                message: msg,
	                code: this.s.bulkResult.writeErrors[0].code,
	                writeErrors: this.s.bulkResult.writeErrors
	            }, writeResult));
	            return true;
	        }
	        const writeConcernError = writeResult.getWriteConcernError();
	        if (writeConcernError) {
	            callback(new MongoBulkWriteError(writeConcernError, writeResult));
	            return true;
	        }
	        return false;
	    }
	}
	exports.BulkOperationBase = BulkOperationBase;
	Object.defineProperty(BulkOperationBase.prototype, 'length', {
	    enumerable: true,
	    get() {
	        return this.s.currentIndex;
	    }
	});
	function shouldForceServerObjectId(bulkOperation) {
	    if (typeof bulkOperation.s.options.forceServerObjectId === 'boolean') {
	        return bulkOperation.s.options.forceServerObjectId;
	    }
	    if (typeof bulkOperation.s.collection.s.db.options?.forceServerObjectId === 'boolean') {
	        return bulkOperation.s.collection.s.db.options?.forceServerObjectId;
	    }
	    return false;
	}
	function isInsertBatch(batch) {
	    return batch.batchType === exports.BatchType.INSERT;
	}
	function isUpdateBatch(batch) {
	    return batch.batchType === exports.BatchType.UPDATE;
	}
	function isDeleteBatch(batch) {
	    return batch.batchType === exports.BatchType.DELETE;
	}
	function buildCurrentOp(bulkOp) {
	    let { currentOp } = bulkOp.s;
	    bulkOp.s.currentOp = undefined;
	    if (!currentOp)
	        currentOp = {};
	    return currentOp;
	}
	
} (common));

Object.defineProperty(ordered, "__esModule", { value: true });
ordered.OrderedBulkOperation = void 0;
const BSON$3 = bson;
const error_1$z = error;
const common_1$6 = common;
/** @public */
class OrderedBulkOperation extends common_1$6.BulkOperationBase {
    /** @internal */
    constructor(collection, options) {
        super(collection, options, true);
    }
    addToOperationsList(batchType, document) {
        // Get the bsonSize
        const bsonSize = BSON$3.calculateObjectSize(document, {
            checkKeys: false,
            // Since we don't know what the user selected for BSON options here,
            // err on the safe side, and check the size with ignoreUndefined: false.
            ignoreUndefined: false
        });
        // Throw error if the doc is bigger than the max BSON size
        if (bsonSize >= this.s.maxBsonObjectSize)
            // TODO(NODE-3483): Change this to MongoBSONError
            throw new error_1$z.MongoInvalidArgumentError(`Document is larger than the maximum size ${this.s.maxBsonObjectSize}`);
        // Create a new batch object if we don't have a current one
        if (this.s.currentBatch == null) {
            this.s.currentBatch = new common_1$6.Batch(batchType, this.s.currentIndex);
        }
        const maxKeySize = this.s.maxKeySize;
        // Check if we need to create a new batch
        if (
        // New batch if we exceed the max batch op size
        this.s.currentBatchSize + 1 >= this.s.maxWriteBatchSize ||
            // New batch if we exceed the maxBatchSizeBytes. Only matters if batch already has a doc,
            // since we can't sent an empty batch
            (this.s.currentBatchSize > 0 &&
                this.s.currentBatchSizeBytes + maxKeySize + bsonSize >= this.s.maxBatchSizeBytes) ||
            // New batch if the new op does not have the same op type as the current batch
            this.s.currentBatch.batchType !== batchType) {
            // Save the batch to the execution stack
            this.s.batches.push(this.s.currentBatch);
            // Create a new batch
            this.s.currentBatch = new common_1$6.Batch(batchType, this.s.currentIndex);
            // Reset the current size trackers
            this.s.currentBatchSize = 0;
            this.s.currentBatchSizeBytes = 0;
        }
        if (batchType === common_1$6.BatchType.INSERT) {
            this.s.bulkResult.insertedIds.push({
                index: this.s.currentIndex,
                _id: document._id
            });
        }
        // We have an array of documents
        if (Array.isArray(document)) {
            throw new error_1$z.MongoInvalidArgumentError('Operation passed in cannot be an Array');
        }
        this.s.currentBatch.originalIndexes.push(this.s.currentIndex);
        this.s.currentBatch.operations.push(document);
        this.s.currentBatchSize += 1;
        this.s.currentBatchSizeBytes += maxKeySize + bsonSize;
        this.s.currentIndex += 1;
        return this;
    }
}
ordered.OrderedBulkOperation = OrderedBulkOperation;

var unordered = {};

Object.defineProperty(unordered, "__esModule", { value: true });
unordered.UnorderedBulkOperation = void 0;
const BSON$2 = bson;
const error_1$y = error;
const common_1$5 = common;
/** @public */
class UnorderedBulkOperation extends common_1$5.BulkOperationBase {
    /** @internal */
    constructor(collection, options) {
        super(collection, options, false);
    }
    handleWriteError(callback, writeResult) {
        if (this.s.batches.length) {
            return false;
        }
        return super.handleWriteError(callback, writeResult);
    }
    addToOperationsList(batchType, document) {
        // Get the bsonSize
        const bsonSize = BSON$2.calculateObjectSize(document, {
            checkKeys: false,
            // Since we don't know what the user selected for BSON options here,
            // err on the safe side, and check the size with ignoreUndefined: false.
            ignoreUndefined: false
        });
        // Throw error if the doc is bigger than the max BSON size
        if (bsonSize >= this.s.maxBsonObjectSize) {
            // TODO(NODE-3483): Change this to MongoBSONError
            throw new error_1$y.MongoInvalidArgumentError(`Document is larger than the maximum size ${this.s.maxBsonObjectSize}`);
        }
        // Holds the current batch
        this.s.currentBatch = undefined;
        // Get the right type of batch
        if (batchType === common_1$5.BatchType.INSERT) {
            this.s.currentBatch = this.s.currentInsertBatch;
        }
        else if (batchType === common_1$5.BatchType.UPDATE) {
            this.s.currentBatch = this.s.currentUpdateBatch;
        }
        else if (batchType === common_1$5.BatchType.DELETE) {
            this.s.currentBatch = this.s.currentRemoveBatch;
        }
        const maxKeySize = this.s.maxKeySize;
        // Create a new batch object if we don't have a current one
        if (this.s.currentBatch == null) {
            this.s.currentBatch = new common_1$5.Batch(batchType, this.s.currentIndex);
        }
        // Check if we need to create a new batch
        if (
        // New batch if we exceed the max batch op size
        this.s.currentBatch.size + 1 >= this.s.maxWriteBatchSize ||
            // New batch if we exceed the maxBatchSizeBytes. Only matters if batch already has a doc,
            // since we can't sent an empty batch
            (this.s.currentBatch.size > 0 &&
                this.s.currentBatch.sizeBytes + maxKeySize + bsonSize >= this.s.maxBatchSizeBytes) ||
            // New batch if the new op does not have the same op type as the current batch
            this.s.currentBatch.batchType !== batchType) {
            // Save the batch to the execution stack
            this.s.batches.push(this.s.currentBatch);
            // Create a new batch
            this.s.currentBatch = new common_1$5.Batch(batchType, this.s.currentIndex);
        }
        // We have an array of documents
        if (Array.isArray(document)) {
            throw new error_1$y.MongoInvalidArgumentError('Operation passed in cannot be an Array');
        }
        this.s.currentBatch.operations.push(document);
        this.s.currentBatch.originalIndexes.push(this.s.currentIndex);
        this.s.currentIndex = this.s.currentIndex + 1;
        // Save back the current Batch to the right type
        if (batchType === common_1$5.BatchType.INSERT) {
            this.s.currentInsertBatch = this.s.currentBatch;
            this.s.bulkResult.insertedIds.push({
                index: this.s.bulkResult.insertedIds.length,
                _id: document._id
            });
        }
        else if (batchType === common_1$5.BatchType.UPDATE) {
            this.s.currentUpdateBatch = this.s.currentBatch;
        }
        else if (batchType === common_1$5.BatchType.DELETE) {
            this.s.currentRemoveBatch = this.s.currentBatch;
        }
        // Update current batch size
        this.s.currentBatch.size += 1;
        this.s.currentBatch.sizeBytes += maxKeySize + bsonSize;
        return this;
    }
}
unordered.UnorderedBulkOperation = UnorderedBulkOperation;

var change_stream = {};

var collection = {};

var aggregation_cursor = {};

var aggregate = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AggregateOperation = exports.DB_AGGREGATE_COLLECTION = void 0;
	const error_1 = error;
	const utils_1 = utils;
	const write_concern_1 = write_concern;
	const command_1 = command;
	const operation_1 = operation;
	/** @internal */
	exports.DB_AGGREGATE_COLLECTION = 1;
	const MIN_WIRE_VERSION_$OUT_READ_CONCERN_SUPPORT = 8;
	/** @internal */
	class AggregateOperation extends command_1.CommandOperation {
	    constructor(ns, pipeline, options) {
	        super(undefined, { ...options, dbName: ns.db });
	        this.options = { ...options };
	        // Covers when ns.collection is null, undefined or the empty string, use DB_AGGREGATE_COLLECTION
	        this.target = ns.collection || exports.DB_AGGREGATE_COLLECTION;
	        this.pipeline = pipeline;
	        // determine if we have a write stage, override read preference if so
	        this.hasWriteStage = false;
	        if (typeof options?.out === 'string') {
	            this.pipeline = this.pipeline.concat({ $out: options.out });
	            this.hasWriteStage = true;
	        }
	        else if (pipeline.length > 0) {
	            const finalStage = pipeline[pipeline.length - 1];
	            if (finalStage.$out || finalStage.$merge) {
	                this.hasWriteStage = true;
	            }
	        }
	        if (this.hasWriteStage) {
	            this.trySecondaryWrite = true;
	        }
	        else {
	            delete this.options.writeConcern;
	        }
	        if (this.explain && this.writeConcern) {
	            throw new error_1.MongoInvalidArgumentError('Option "explain" cannot be used on an aggregate call with writeConcern');
	        }
	        if (options?.cursor != null && typeof options.cursor !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Cursor options must be an object');
	        }
	    }
	    get canRetryRead() {
	        return !this.hasWriteStage;
	    }
	    addToPipeline(stage) {
	        this.pipeline.push(stage);
	    }
	    executeCallback(server, session, callback) {
	        const options = this.options;
	        const serverWireVersion = (0, utils_1.maxWireVersion)(server);
	        const command = { aggregate: this.target, pipeline: this.pipeline };
	        if (this.hasWriteStage && serverWireVersion < MIN_WIRE_VERSION_$OUT_READ_CONCERN_SUPPORT) {
	            this.readConcern = undefined;
	        }
	        if (this.hasWriteStage && this.writeConcern) {
	            write_concern_1.WriteConcern.apply(command, this.writeConcern);
	        }
	        if (options.bypassDocumentValidation === true) {
	            command.bypassDocumentValidation = options.bypassDocumentValidation;
	        }
	        if (typeof options.allowDiskUse === 'boolean') {
	            command.allowDiskUse = options.allowDiskUse;
	        }
	        if (options.hint) {
	            command.hint = options.hint;
	        }
	        if (options.let) {
	            command.let = options.let;
	        }
	        // we check for undefined specifically here to allow falsy values
	        // eslint-disable-next-line no-restricted-syntax
	        if (options.comment !== undefined) {
	            command.comment = options.comment;
	        }
	        command.cursor = options.cursor || {};
	        if (options.batchSize && !this.hasWriteStage) {
	            command.cursor.batchSize = options.batchSize;
	        }
	        super.executeCommand(server, session, command, callback);
	    }
	}
	exports.AggregateOperation = AggregateOperation;
	(0, operation_1.defineAspects)(AggregateOperation, [
	    operation_1.Aspect.READ_OPERATION,
	    operation_1.Aspect.RETRYABLE,
	    operation_1.Aspect.EXPLAINABLE,
	    operation_1.Aspect.CURSOR_CREATING
	]);
	
} (aggregate));

var abstract_cursor = {};

const require$$0$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(stream);

var mongo_types = {};

const require$$0$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(events$1);

Object.defineProperty(mongo_types, "__esModule", { value: true });
mongo_types.CancellationToken = mongo_types.TypedEventEmitter = void 0;
const events_1 = require$$0$4;
/**
 * Typescript type safe event emitter
 * @public
 */
class TypedEventEmitter extends events_1.EventEmitter {
    /** @internal */
    emitAndLog(event, ...args) {
        this.emit(event, ...args);
        if (this.component)
            this.mongoLogger?.debug(this.component, args[0]);
    }
}
mongo_types.TypedEventEmitter = TypedEventEmitter;
/** @public */
class CancellationToken extends TypedEventEmitter {
}
mongo_types.CancellationToken = CancellationToken;

var get_more = {};

Object.defineProperty(get_more, "__esModule", { value: true });
get_more.GetMoreOperation = void 0;
const error_1$x = error;
const utils_1$m = utils;
const operation_1$e = operation;
/** @internal */
class GetMoreOperation extends operation_1$e.AbstractCallbackOperation {
    constructor(ns, cursorId, server, options) {
        super(options);
        this.options = options;
        this.ns = ns;
        this.cursorId = cursorId;
        this.server = server;
    }
    /**
     * Although there is a server already associated with the get more operation, the signature
     * for execute passes a server so we will just use that one.
     */
    executeCallback(server, session, callback) {
        if (server !== this.server) {
            return callback(new error_1$x.MongoRuntimeError('Getmore must run on the same server operation began on'));
        }
        if (this.cursorId == null || this.cursorId.isZero()) {
            return callback(new error_1$x.MongoRuntimeError('Unable to iterate cursor with no id'));
        }
        const collection = this.ns.collection;
        if (collection == null) {
            // Cursors should have adopted the namespace returned by MongoDB
            // which should always defined a collection name (even a pseudo one, ex. db.aggregate())
            return callback(new error_1$x.MongoRuntimeError('A collection name must be determined before getMore'));
        }
        const getMoreCmd = {
            getMore: this.cursorId,
            collection
        };
        if (typeof this.options.batchSize === 'number') {
            getMoreCmd.batchSize = Math.abs(this.options.batchSize);
        }
        if (typeof this.options.maxAwaitTimeMS === 'number') {
            getMoreCmd.maxTimeMS = this.options.maxAwaitTimeMS;
        }
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (this.options.comment !== undefined && (0, utils_1$m.maxWireVersion)(server) >= 9) {
            getMoreCmd.comment = this.options.comment;
        }
        const commandOptions = {
            returnFieldSelector: null,
            documentsReturnedIn: 'nextBatch',
            ...this.options
        };
        server.command(this.ns, getMoreCmd, commandOptions, callback);
    }
}
get_more.GetMoreOperation = GetMoreOperation;
(0, operation_1$e.defineAspects)(GetMoreOperation, [operation_1$e.Aspect.READ_OPERATION, operation_1$e.Aspect.MUST_SELECT_SAME_SERVER]);

var kill_cursors = {};

Object.defineProperty(kill_cursors, "__esModule", { value: true });
kill_cursors.KillCursorsOperation = void 0;
const error_1$w = error;
const operation_1$d = operation;
class KillCursorsOperation extends operation_1$d.AbstractCallbackOperation {
    constructor(cursorId, ns, server, options) {
        super(options);
        this.ns = ns;
        this.cursorId = cursorId;
        this.server = server;
    }
    executeCallback(server, session, callback) {
        if (server !== this.server) {
            return callback(new error_1$w.MongoRuntimeError('Killcursor must run on the same server operation began on'));
        }
        const killCursors = this.ns.collection;
        if (killCursors == null) {
            // Cursors should have adopted the namespace returned by MongoDB
            // which should always defined a collection name (even a pseudo one, ex. db.aggregate())
            return callback(new error_1$w.MongoRuntimeError('A collection name must be determined before killCursors'));
        }
        const killCursorsCommand = {
            killCursors,
            cursors: [this.cursorId]
        };
        server.command(this.ns, killCursorsCommand, { session }, () => callback());
    }
}
kill_cursors.KillCursorsOperation = KillCursorsOperation;
(0, operation_1$d.defineAspects)(KillCursorsOperation, [operation_1$d.Aspect.MUST_SELECT_SAME_SERVER]);

var sessions = {};

var metrics = {};

Object.defineProperty(metrics, "__esModule", { value: true });
metrics.ConnectionPoolMetrics = void 0;
/** @internal */
class ConnectionPoolMetrics {
    constructor() {
        this.txnConnections = 0;
        this.cursorConnections = 0;
        this.otherConnections = 0;
    }
    /**
     * Mark a connection as pinned for a specific operation.
     */
    markPinned(pinType) {
        if (pinType === ConnectionPoolMetrics.TXN) {
            this.txnConnections += 1;
        }
        else if (pinType === ConnectionPoolMetrics.CURSOR) {
            this.cursorConnections += 1;
        }
        else {
            this.otherConnections += 1;
        }
    }
    /**
     * Unmark a connection as pinned for an operation.
     */
    markUnpinned(pinType) {
        if (pinType === ConnectionPoolMetrics.TXN) {
            this.txnConnections -= 1;
        }
        else if (pinType === ConnectionPoolMetrics.CURSOR) {
            this.cursorConnections -= 1;
        }
        else {
            this.otherConnections -= 1;
        }
    }
    /**
     * Return information about the cmap metrics as a string.
     */
    info(maxPoolSize) {
        return ('Timed out while checking out a connection from connection pool: ' +
            `maxPoolSize: ${maxPoolSize}, ` +
            `connections in use by cursors: ${this.cursorConnections}, ` +
            `connections in use by transactions: ${this.txnConnections}, ` +
            `connections in use by other operations: ${this.otherConnections}`);
    }
    /**
     * Reset the metrics to the initial values.
     */
    reset() {
        this.txnConnections = 0;
        this.cursorConnections = 0;
        this.otherConnections = 0;
    }
}
ConnectionPoolMetrics.TXN = 'txn';
ConnectionPoolMetrics.CURSOR = 'cursor';
ConnectionPoolMetrics.OTHER = 'other';
metrics.ConnectionPoolMetrics = ConnectionPoolMetrics;

var shared = {};

var topology_description = {};

var server_description = {};

Object.defineProperty(server_description, "__esModule", { value: true });
server_description.compareTopologyVersion = server_description.parseServerType = server_description.ServerDescription = void 0;
const bson_1$7 = bson;
const error_1$v = error;
const utils_1$l = utils;
const common_1$4 = common$1;
const WRITABLE_SERVER_TYPES = new Set([
    common_1$4.ServerType.RSPrimary,
    common_1$4.ServerType.Standalone,
    common_1$4.ServerType.Mongos,
    common_1$4.ServerType.LoadBalancer
]);
const DATA_BEARING_SERVER_TYPES = new Set([
    common_1$4.ServerType.RSPrimary,
    common_1$4.ServerType.RSSecondary,
    common_1$4.ServerType.Mongos,
    common_1$4.ServerType.Standalone,
    common_1$4.ServerType.LoadBalancer
]);
/**
 * The client's view of a single server, based on the most recent hello outcome.
 *
 * Internal type, not meant to be directly instantiated
 * @public
 */
class ServerDescription {
    /**
     * Create a ServerDescription
     * @internal
     *
     * @param address - The address of the server
     * @param hello - An optional hello response for this server
     */
    constructor(address, hello, options = {}) {
        if (address == null || address === '') {
            throw new error_1$v.MongoRuntimeError('ServerDescription must be provided with a non-empty address');
        }
        this.address =
            typeof address === 'string'
                ? utils_1$l.HostAddress.fromString(address).toString() // Use HostAddress to normalize
                : address.toString();
        this.type = parseServerType(hello, options);
        this.hosts = hello?.hosts?.map((host) => host.toLowerCase()) ?? [];
        this.passives = hello?.passives?.map((host) => host.toLowerCase()) ?? [];
        this.arbiters = hello?.arbiters?.map((host) => host.toLowerCase()) ?? [];
        this.tags = hello?.tags ?? {};
        this.minWireVersion = hello?.minWireVersion ?? 0;
        this.maxWireVersion = hello?.maxWireVersion ?? 0;
        this.roundTripTime = options?.roundTripTime ?? -1;
        this.lastUpdateTime = (0, utils_1$l.now)();
        this.lastWriteDate = hello?.lastWrite?.lastWriteDate ?? 0;
        this.error = options.error ?? null;
        // TODO(NODE-2674): Preserve int64 sent from MongoDB
        this.topologyVersion = this.error?.topologyVersion ?? hello?.topologyVersion ?? null;
        this.setName = hello?.setName ?? null;
        this.setVersion = hello?.setVersion ?? null;
        this.electionId = hello?.electionId ?? null;
        this.logicalSessionTimeoutMinutes = hello?.logicalSessionTimeoutMinutes ?? null;
        this.primary = hello?.primary ?? null;
        this.me = hello?.me?.toLowerCase() ?? null;
        this.$clusterTime = hello?.$clusterTime ?? null;
    }
    get hostAddress() {
        return utils_1$l.HostAddress.fromString(this.address);
    }
    get allHosts() {
        return this.hosts.concat(this.arbiters).concat(this.passives);
    }
    /** Is this server available for reads*/
    get isReadable() {
        return this.type === common_1$4.ServerType.RSSecondary || this.isWritable;
    }
    /** Is this server data bearing */
    get isDataBearing() {
        return DATA_BEARING_SERVER_TYPES.has(this.type);
    }
    /** Is this server available for writes */
    get isWritable() {
        return WRITABLE_SERVER_TYPES.has(this.type);
    }
    get host() {
        const chopLength = `:${this.port}`.length;
        return this.address.slice(0, -chopLength);
    }
    get port() {
        const port = this.address.split(':').pop();
        return port ? Number.parseInt(port, 10) : 27017;
    }
    /**
     * Determines if another `ServerDescription` is equal to this one per the rules defined
     * in the {@link https://github.com/mongodb/specifications/blob/master/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#serverdescription|SDAM spec}
     */
    equals(other) {
        // Despite using the comparator that would determine a nullish topologyVersion as greater than
        // for equality we should only always perform direct equality comparison
        const topologyVersionsEqual = this.topologyVersion === other?.topologyVersion ||
            compareTopologyVersion(this.topologyVersion, other?.topologyVersion) === 0;
        const electionIdsEqual = this.electionId != null && other?.electionId != null
            ? (0, utils_1$l.compareObjectId)(this.electionId, other.electionId) === 0
            : this.electionId === other?.electionId;
        return (other != null &&
            (0, utils_1$l.errorStrictEqual)(this.error, other.error) &&
            this.type === other.type &&
            this.minWireVersion === other.minWireVersion &&
            (0, utils_1$l.arrayStrictEqual)(this.hosts, other.hosts) &&
            tagsStrictEqual(this.tags, other.tags) &&
            this.setName === other.setName &&
            this.setVersion === other.setVersion &&
            electionIdsEqual &&
            this.primary === other.primary &&
            this.logicalSessionTimeoutMinutes === other.logicalSessionTimeoutMinutes &&
            topologyVersionsEqual);
    }
}
server_description.ServerDescription = ServerDescription;
// Parses a `hello` message and determines the server type
function parseServerType(hello, options) {
    if (options?.loadBalanced) {
        return common_1$4.ServerType.LoadBalancer;
    }
    if (!hello || !hello.ok) {
        return common_1$4.ServerType.Unknown;
    }
    if (hello.isreplicaset) {
        return common_1$4.ServerType.RSGhost;
    }
    if (hello.msg && hello.msg === 'isdbgrid') {
        return common_1$4.ServerType.Mongos;
    }
    if (hello.setName) {
        if (hello.hidden) {
            return common_1$4.ServerType.RSOther;
        }
        else if (hello.isWritablePrimary) {
            return common_1$4.ServerType.RSPrimary;
        }
        else if (hello.secondary) {
            return common_1$4.ServerType.RSSecondary;
        }
        else if (hello.arbiterOnly) {
            return common_1$4.ServerType.RSArbiter;
        }
        else {
            return common_1$4.ServerType.RSOther;
        }
    }
    return common_1$4.ServerType.Standalone;
}
server_description.parseServerType = parseServerType;
function tagsStrictEqual(tags, tags2) {
    const tagsKeys = Object.keys(tags);
    const tags2Keys = Object.keys(tags2);
    return (tagsKeys.length === tags2Keys.length &&
        tagsKeys.every((key) => tags2[key] === tags[key]));
}
/**
 * Compares two topology versions.
 *
 * 1. If the response topologyVersion is unset or the ServerDescription's
 *    topologyVersion is null, the client MUST assume the response is more recent.
 * 1. If the response's topologyVersion.processId is not equal to the
 *    ServerDescription's, the client MUST assume the response is more recent.
 * 1. If the response's topologyVersion.processId is equal to the
 *    ServerDescription's, the client MUST use the counter field to determine
 *    which topologyVersion is more recent.
 *
 * ```ts
 * currentTv <   newTv === -1
 * currentTv === newTv === 0
 * currentTv >   newTv === 1
 * ```
 */
function compareTopologyVersion(currentTv, newTv) {
    if (currentTv == null || newTv == null) {
        return -1;
    }
    if (!currentTv.processId.equals(newTv.processId)) {
        return -1;
    }
    // TODO(NODE-2674): Preserve int64 sent from MongoDB
    const currentCounter = bson_1$7.Long.isLong(currentTv.counter)
        ? currentTv.counter
        : bson_1$7.Long.fromNumber(currentTv.counter);
    const newCounter = bson_1$7.Long.isLong(newTv.counter) ? newTv.counter : bson_1$7.Long.fromNumber(newTv.counter);
    return currentCounter.compare(newCounter);
}
server_description.compareTopologyVersion = compareTopologyVersion;

Object.defineProperty(topology_description, "__esModule", { value: true });
topology_description.TopologyDescription = void 0;
const WIRE_CONSTANTS = constants$1;
const error_1$u = error;
const utils_1$k = utils;
const common_1$3 = common$1;
const server_description_1$1 = server_description;
// constants related to compatibility checks
const MIN_SUPPORTED_SERVER_VERSION = WIRE_CONSTANTS.MIN_SUPPORTED_SERVER_VERSION;
const MAX_SUPPORTED_SERVER_VERSION = WIRE_CONSTANTS.MAX_SUPPORTED_SERVER_VERSION;
const MIN_SUPPORTED_WIRE_VERSION = WIRE_CONSTANTS.MIN_SUPPORTED_WIRE_VERSION;
const MAX_SUPPORTED_WIRE_VERSION = WIRE_CONSTANTS.MAX_SUPPORTED_WIRE_VERSION;
const MONGOS_OR_UNKNOWN = new Set([common_1$3.ServerType.Mongos, common_1$3.ServerType.Unknown]);
const MONGOS_OR_STANDALONE = new Set([common_1$3.ServerType.Mongos, common_1$3.ServerType.Standalone]);
const NON_PRIMARY_RS_MEMBERS = new Set([
    common_1$3.ServerType.RSSecondary,
    common_1$3.ServerType.RSArbiter,
    common_1$3.ServerType.RSOther
]);
/**
 * Representation of a deployment of servers
 * @public
 */
class TopologyDescription {
    /**
     * Create a TopologyDescription
     */
    constructor(topologyType, serverDescriptions = null, setName = null, maxSetVersion = null, maxElectionId = null, commonWireVersion = null, options = null) {
        options = options ?? {};
        this.type = topologyType ?? common_1$3.TopologyType.Unknown;
        this.servers = serverDescriptions ?? new Map();
        this.stale = false;
        this.compatible = true;
        this.heartbeatFrequencyMS = options.heartbeatFrequencyMS ?? 0;
        this.localThresholdMS = options.localThresholdMS ?? 15;
        this.setName = setName ?? null;
        this.maxElectionId = maxElectionId ?? null;
        this.maxSetVersion = maxSetVersion ?? null;
        this.commonWireVersion = commonWireVersion ?? 0;
        // determine server compatibility
        for (const serverDescription of this.servers.values()) {
            // Load balancer mode is always compatible.
            if (serverDescription.type === common_1$3.ServerType.Unknown ||
                serverDescription.type === common_1$3.ServerType.LoadBalancer) {
                continue;
            }
            if (serverDescription.minWireVersion > MAX_SUPPORTED_WIRE_VERSION) {
                this.compatible = false;
                this.compatibilityError = `Server at ${serverDescription.address} requires wire version ${serverDescription.minWireVersion}, but this version of the driver only supports up to ${MAX_SUPPORTED_WIRE_VERSION} (MongoDB ${MAX_SUPPORTED_SERVER_VERSION})`;
            }
            if (serverDescription.maxWireVersion < MIN_SUPPORTED_WIRE_VERSION) {
                this.compatible = false;
                this.compatibilityError = `Server at ${serverDescription.address} reports wire version ${serverDescription.maxWireVersion}, but this version of the driver requires at least ${MIN_SUPPORTED_WIRE_VERSION} (MongoDB ${MIN_SUPPORTED_SERVER_VERSION}).`;
                break;
            }
        }
        // Whenever a client updates the TopologyDescription from a hello response, it MUST set
        // TopologyDescription.logicalSessionTimeoutMinutes to the smallest logicalSessionTimeoutMinutes
        // value among ServerDescriptions of all data-bearing server types. If any have a null
        // logicalSessionTimeoutMinutes, then TopologyDescription.logicalSessionTimeoutMinutes MUST be
        // set to null.
        this.logicalSessionTimeoutMinutes = null;
        for (const [, server] of this.servers) {
            if (server.isReadable) {
                if (server.logicalSessionTimeoutMinutes == null) {
                    // If any of the servers have a null logicalSessionsTimeout, then the whole topology does
                    this.logicalSessionTimeoutMinutes = null;
                    break;
                }
                if (this.logicalSessionTimeoutMinutes == null) {
                    // First server with a non null logicalSessionsTimeout
                    this.logicalSessionTimeoutMinutes = server.logicalSessionTimeoutMinutes;
                    continue;
                }
                // Always select the smaller of the:
                // current server logicalSessionsTimeout and the topologies logicalSessionsTimeout
                this.logicalSessionTimeoutMinutes = Math.min(this.logicalSessionTimeoutMinutes, server.logicalSessionTimeoutMinutes);
            }
        }
    }
    /**
     * Returns a new TopologyDescription based on the SrvPollingEvent
     * @internal
     */
    updateFromSrvPollingEvent(ev, srvMaxHosts = 0) {
        /** The SRV addresses defines the set of addresses we should be using */
        const incomingHostnames = ev.hostnames();
        const currentHostnames = new Set(this.servers.keys());
        const hostnamesToAdd = new Set(incomingHostnames);
        const hostnamesToRemove = new Set();
        for (const hostname of currentHostnames) {
            // filter hostnamesToAdd (made from incomingHostnames) down to what is *not* present in currentHostnames
            hostnamesToAdd.delete(hostname);
            if (!incomingHostnames.has(hostname)) {
                // If the SRV Records no longer include this hostname
                // we have to stop using it
                hostnamesToRemove.add(hostname);
            }
        }
        if (hostnamesToAdd.size === 0 && hostnamesToRemove.size === 0) {
            // No new hosts to add and none to remove
            return this;
        }
        const serverDescriptions = new Map(this.servers);
        for (const removedHost of hostnamesToRemove) {
            serverDescriptions.delete(removedHost);
        }
        if (hostnamesToAdd.size > 0) {
            if (srvMaxHosts === 0) {
                // Add all!
                for (const hostToAdd of hostnamesToAdd) {
                    serverDescriptions.set(hostToAdd, new server_description_1$1.ServerDescription(hostToAdd));
                }
            }
            else if (serverDescriptions.size < srvMaxHosts) {
                // Add only the amount needed to get us back to srvMaxHosts
                const selectedHosts = (0, utils_1$k.shuffle)(hostnamesToAdd, srvMaxHosts - serverDescriptions.size);
                for (const selectedHostToAdd of selectedHosts) {
                    serverDescriptions.set(selectedHostToAdd, new server_description_1$1.ServerDescription(selectedHostToAdd));
                }
            }
        }
        return new TopologyDescription(this.type, serverDescriptions, this.setName, this.maxSetVersion, this.maxElectionId, this.commonWireVersion, { heartbeatFrequencyMS: this.heartbeatFrequencyMS, localThresholdMS: this.localThresholdMS });
    }
    /**
     * Returns a copy of this description updated with a given ServerDescription
     * @internal
     */
    update(serverDescription) {
        const address = serverDescription.address;
        // potentially mutated values
        let { type: topologyType, setName, maxSetVersion, maxElectionId, commonWireVersion } = this;
        const serverType = serverDescription.type;
        const serverDescriptions = new Map(this.servers);
        // update common wire version
        if (serverDescription.maxWireVersion !== 0) {
            if (commonWireVersion == null) {
                commonWireVersion = serverDescription.maxWireVersion;
            }
            else {
                commonWireVersion = Math.min(commonWireVersion, serverDescription.maxWireVersion);
            }
        }
        if (typeof serverDescription.setName === 'string' &&
            typeof setName === 'string' &&
            serverDescription.setName !== setName) {
            if (topologyType === common_1$3.TopologyType.Single) {
                // "Single" Topology with setName mismatch is direct connection usage, mark unknown do not remove
                serverDescription = new server_description_1$1.ServerDescription(address);
            }
            else {
                serverDescriptions.delete(address);
            }
        }
        // update the actual server description
        serverDescriptions.set(address, serverDescription);
        if (topologyType === common_1$3.TopologyType.Single) {
            // once we are defined as single, that never changes
            return new TopologyDescription(common_1$3.TopologyType.Single, serverDescriptions, setName, maxSetVersion, maxElectionId, commonWireVersion, { heartbeatFrequencyMS: this.heartbeatFrequencyMS, localThresholdMS: this.localThresholdMS });
        }
        if (topologyType === common_1$3.TopologyType.Unknown) {
            if (serverType === common_1$3.ServerType.Standalone && this.servers.size !== 1) {
                serverDescriptions.delete(address);
            }
            else {
                topologyType = topologyTypeForServerType(serverType);
            }
        }
        if (topologyType === common_1$3.TopologyType.Sharded) {
            if (!MONGOS_OR_UNKNOWN.has(serverType)) {
                serverDescriptions.delete(address);
            }
        }
        if (topologyType === common_1$3.TopologyType.ReplicaSetNoPrimary) {
            if (MONGOS_OR_STANDALONE.has(serverType)) {
                serverDescriptions.delete(address);
            }
            if (serverType === common_1$3.ServerType.RSPrimary) {
                const result = updateRsFromPrimary(serverDescriptions, serverDescription, setName, maxSetVersion, maxElectionId);
                topologyType = result[0];
                setName = result[1];
                maxSetVersion = result[2];
                maxElectionId = result[3];
            }
            else if (NON_PRIMARY_RS_MEMBERS.has(serverType)) {
                const result = updateRsNoPrimaryFromMember(serverDescriptions, serverDescription, setName);
                topologyType = result[0];
                setName = result[1];
            }
        }
        if (topologyType === common_1$3.TopologyType.ReplicaSetWithPrimary) {
            if (MONGOS_OR_STANDALONE.has(serverType)) {
                serverDescriptions.delete(address);
                topologyType = checkHasPrimary(serverDescriptions);
            }
            else if (serverType === common_1$3.ServerType.RSPrimary) {
                const result = updateRsFromPrimary(serverDescriptions, serverDescription, setName, maxSetVersion, maxElectionId);
                topologyType = result[0];
                setName = result[1];
                maxSetVersion = result[2];
                maxElectionId = result[3];
            }
            else if (NON_PRIMARY_RS_MEMBERS.has(serverType)) {
                topologyType = updateRsWithPrimaryFromMember(serverDescriptions, serverDescription, setName);
            }
            else {
                topologyType = checkHasPrimary(serverDescriptions);
            }
        }
        return new TopologyDescription(topologyType, serverDescriptions, setName, maxSetVersion, maxElectionId, commonWireVersion, { heartbeatFrequencyMS: this.heartbeatFrequencyMS, localThresholdMS: this.localThresholdMS });
    }
    get error() {
        const descriptionsWithError = Array.from(this.servers.values()).filter((sd) => sd.error);
        if (descriptionsWithError.length > 0) {
            return descriptionsWithError[0].error;
        }
        return null;
    }
    /**
     * Determines if the topology description has any known servers
     */
    get hasKnownServers() {
        return Array.from(this.servers.values()).some((sd) => sd.type !== common_1$3.ServerType.Unknown);
    }
    /**
     * Determines if this topology description has a data-bearing server available.
     */
    get hasDataBearingServers() {
        return Array.from(this.servers.values()).some((sd) => sd.isDataBearing);
    }
    /**
     * Determines if the topology has a definition for the provided address
     * @internal
     */
    hasServer(address) {
        return this.servers.has(address);
    }
}
topology_description.TopologyDescription = TopologyDescription;
function topologyTypeForServerType(serverType) {
    switch (serverType) {
        case common_1$3.ServerType.Standalone:
            return common_1$3.TopologyType.Single;
        case common_1$3.ServerType.Mongos:
            return common_1$3.TopologyType.Sharded;
        case common_1$3.ServerType.RSPrimary:
            return common_1$3.TopologyType.ReplicaSetWithPrimary;
        case common_1$3.ServerType.RSOther:
        case common_1$3.ServerType.RSSecondary:
            return common_1$3.TopologyType.ReplicaSetNoPrimary;
        default:
            return common_1$3.TopologyType.Unknown;
    }
}
function updateRsFromPrimary(serverDescriptions, serverDescription, setName = null, maxSetVersion = null, maxElectionId = null) {
    setName = setName || serverDescription.setName;
    if (setName !== serverDescription.setName) {
        serverDescriptions.delete(serverDescription.address);
        return [checkHasPrimary(serverDescriptions), setName, maxSetVersion, maxElectionId];
    }
    if (serverDescription.maxWireVersion >= 17) {
        const electionIdComparison = (0, utils_1$k.compareObjectId)(maxElectionId, serverDescription.electionId);
        const maxElectionIdIsEqual = electionIdComparison === 0;
        const maxElectionIdIsLess = electionIdComparison === -1;
        const maxSetVersionIsLessOrEqual = (maxSetVersion ?? -1) <= (serverDescription.setVersion ?? -1);
        if (maxElectionIdIsLess || (maxElectionIdIsEqual && maxSetVersionIsLessOrEqual)) {
            // The reported electionId was greater
            // or the electionId was equal and reported setVersion was greater
            // Always update both values, they are a tuple
            maxElectionId = serverDescription.electionId;
            maxSetVersion = serverDescription.setVersion;
        }
        else {
            // Stale primary
            // replace serverDescription with a default ServerDescription of type "Unknown"
            serverDescriptions.set(serverDescription.address, new server_description_1$1.ServerDescription(serverDescription.address));
            return [checkHasPrimary(serverDescriptions), setName, maxSetVersion, maxElectionId];
        }
    }
    else {
        const electionId = serverDescription.electionId ? serverDescription.electionId : null;
        if (serverDescription.setVersion && electionId) {
            if (maxSetVersion && maxElectionId) {
                if (maxSetVersion > serverDescription.setVersion ||
                    (0, utils_1$k.compareObjectId)(maxElectionId, electionId) > 0) {
                    // this primary is stale, we must remove it
                    serverDescriptions.set(serverDescription.address, new server_description_1$1.ServerDescription(serverDescription.address));
                    return [checkHasPrimary(serverDescriptions), setName, maxSetVersion, maxElectionId];
                }
            }
            maxElectionId = serverDescription.electionId;
        }
        if (serverDescription.setVersion != null &&
            (maxSetVersion == null || serverDescription.setVersion > maxSetVersion)) {
            maxSetVersion = serverDescription.setVersion;
        }
    }
    // We've heard from the primary. Is it the same primary as before?
    for (const [address, server] of serverDescriptions) {
        if (server.type === common_1$3.ServerType.RSPrimary && server.address !== serverDescription.address) {
            // Reset old primary's type to Unknown.
            serverDescriptions.set(address, new server_description_1$1.ServerDescription(server.address));
            // There can only be one primary
            break;
        }
    }
    // Discover new hosts from this primary's response.
    serverDescription.allHosts.forEach((address) => {
        if (!serverDescriptions.has(address)) {
            serverDescriptions.set(address, new server_description_1$1.ServerDescription(address));
        }
    });
    // Remove hosts not in the response.
    const currentAddresses = Array.from(serverDescriptions.keys());
    const responseAddresses = serverDescription.allHosts;
    currentAddresses
        .filter((addr) => responseAddresses.indexOf(addr) === -1)
        .forEach((address) => {
        serverDescriptions.delete(address);
    });
    return [checkHasPrimary(serverDescriptions), setName, maxSetVersion, maxElectionId];
}
function updateRsWithPrimaryFromMember(serverDescriptions, serverDescription, setName = null) {
    if (setName == null) {
        // TODO(NODE-3483): should be an appropriate runtime error
        throw new error_1$u.MongoRuntimeError('Argument "setName" is required if connected to a replica set');
    }
    if (setName !== serverDescription.setName ||
        (serverDescription.me && serverDescription.address !== serverDescription.me)) {
        serverDescriptions.delete(serverDescription.address);
    }
    return checkHasPrimary(serverDescriptions);
}
function updateRsNoPrimaryFromMember(serverDescriptions, serverDescription, setName = null) {
    const topologyType = common_1$3.TopologyType.ReplicaSetNoPrimary;
    setName = setName ?? serverDescription.setName;
    if (setName !== serverDescription.setName) {
        serverDescriptions.delete(serverDescription.address);
        return [topologyType, setName];
    }
    serverDescription.allHosts.forEach((address) => {
        if (!serverDescriptions.has(address)) {
            serverDescriptions.set(address, new server_description_1$1.ServerDescription(address));
        }
    });
    if (serverDescription.me && serverDescription.address !== serverDescription.me) {
        serverDescriptions.delete(serverDescription.address);
    }
    return [topologyType, setName];
}
function checkHasPrimary(serverDescriptions) {
    for (const serverDescription of serverDescriptions.values()) {
        if (serverDescription.type === common_1$3.ServerType.RSPrimary) {
            return common_1$3.TopologyType.ReplicaSetWithPrimary;
        }
    }
    return common_1$3.TopologyType.ReplicaSetNoPrimary;
}

Object.defineProperty(shared, "__esModule", { value: true });
shared.isSharded = shared.getReadPreference = void 0;
const error_1$t = error;
const read_preference_1$3 = read_preference;
const common_1$2 = common$1;
const topology_description_1 = topology_description;
function getReadPreference(options) {
    // Default to command version of the readPreference
    let readPreference = options?.readPreference ?? read_preference_1$3.ReadPreference.primary;
    // If we have an option readPreference override the command one
    if (options?.readPreference) {
        readPreference = options.readPreference;
    }
    if (typeof readPreference === 'string') {
        readPreference = read_preference_1$3.ReadPreference.fromString(readPreference);
    }
    if (!(readPreference instanceof read_preference_1$3.ReadPreference)) {
        throw new error_1$t.MongoInvalidArgumentError('Option "readPreference" must be a ReadPreference instance');
    }
    return readPreference;
}
shared.getReadPreference = getReadPreference;
function isSharded(topologyOrServer) {
    if (topologyOrServer == null) {
        return false;
    }
    if (topologyOrServer.description && topologyOrServer.description.type === common_1$2.ServerType.Mongos) {
        return true;
    }
    // NOTE: This is incredibly inefficient, and should be removed once command construction
    //       happens based on `Server` not `Topology`.
    if (topologyOrServer.description && topologyOrServer.description instanceof topology_description_1.TopologyDescription) {
        const servers = Array.from(topologyOrServer.description.servers.values());
        return servers.some((server) => server.type === common_1$2.ServerType.Mongos);
    }
    return false;
}
shared.isSharded = isSharded;

var transactions = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isTransactionCommand = exports.Transaction = exports.TxnState = void 0;
	const error_1 = error;
	const read_concern_1 = read_concern;
	const read_preference_1 = read_preference;
	const write_concern_1 = write_concern;
	/** @internal */
	exports.TxnState = Object.freeze({
	    NO_TRANSACTION: 'NO_TRANSACTION',
	    STARTING_TRANSACTION: 'STARTING_TRANSACTION',
	    TRANSACTION_IN_PROGRESS: 'TRANSACTION_IN_PROGRESS',
	    TRANSACTION_COMMITTED: 'TRANSACTION_COMMITTED',
	    TRANSACTION_COMMITTED_EMPTY: 'TRANSACTION_COMMITTED_EMPTY',
	    TRANSACTION_ABORTED: 'TRANSACTION_ABORTED'
	});
	const stateMachine = {
	    [exports.TxnState.NO_TRANSACTION]: [exports.TxnState.NO_TRANSACTION, exports.TxnState.STARTING_TRANSACTION],
	    [exports.TxnState.STARTING_TRANSACTION]: [
	        exports.TxnState.TRANSACTION_IN_PROGRESS,
	        exports.TxnState.TRANSACTION_COMMITTED,
	        exports.TxnState.TRANSACTION_COMMITTED_EMPTY,
	        exports.TxnState.TRANSACTION_ABORTED
	    ],
	    [exports.TxnState.TRANSACTION_IN_PROGRESS]: [
	        exports.TxnState.TRANSACTION_IN_PROGRESS,
	        exports.TxnState.TRANSACTION_COMMITTED,
	        exports.TxnState.TRANSACTION_ABORTED
	    ],
	    [exports.TxnState.TRANSACTION_COMMITTED]: [
	        exports.TxnState.TRANSACTION_COMMITTED,
	        exports.TxnState.TRANSACTION_COMMITTED_EMPTY,
	        exports.TxnState.STARTING_TRANSACTION,
	        exports.TxnState.NO_TRANSACTION
	    ],
	    [exports.TxnState.TRANSACTION_ABORTED]: [exports.TxnState.STARTING_TRANSACTION, exports.TxnState.NO_TRANSACTION],
	    [exports.TxnState.TRANSACTION_COMMITTED_EMPTY]: [
	        exports.TxnState.TRANSACTION_COMMITTED_EMPTY,
	        exports.TxnState.NO_TRANSACTION
	    ]
	};
	const ACTIVE_STATES = new Set([
	    exports.TxnState.STARTING_TRANSACTION,
	    exports.TxnState.TRANSACTION_IN_PROGRESS
	]);
	const COMMITTED_STATES = new Set([
	    exports.TxnState.TRANSACTION_COMMITTED,
	    exports.TxnState.TRANSACTION_COMMITTED_EMPTY,
	    exports.TxnState.TRANSACTION_ABORTED
	]);
	/**
	 * @public
	 * A class maintaining state related to a server transaction. Internal Only
	 */
	class Transaction {
	    /** Create a transaction @internal */
	    constructor(options) {
	        options = options ?? {};
	        this.state = exports.TxnState.NO_TRANSACTION;
	        this.options = {};
	        const writeConcern = write_concern_1.WriteConcern.fromOptions(options);
	        if (writeConcern) {
	            if (writeConcern.w === 0) {
	                throw new error_1.MongoTransactionError('Transactions do not support unacknowledged write concern');
	            }
	            this.options.writeConcern = writeConcern;
	        }
	        if (options.readConcern) {
	            this.options.readConcern = read_concern_1.ReadConcern.fromOptions(options);
	        }
	        if (options.readPreference) {
	            this.options.readPreference = read_preference_1.ReadPreference.fromOptions(options);
	        }
	        if (options.maxCommitTimeMS) {
	            this.options.maxTimeMS = options.maxCommitTimeMS;
	        }
	        // TODO: This isn't technically necessary
	        this._pinnedServer = undefined;
	        this._recoveryToken = undefined;
	    }
	    /** @internal */
	    get server() {
	        return this._pinnedServer;
	    }
	    get recoveryToken() {
	        return this._recoveryToken;
	    }
	    get isPinned() {
	        return !!this.server;
	    }
	    /** @returns Whether the transaction has started */
	    get isStarting() {
	        return this.state === exports.TxnState.STARTING_TRANSACTION;
	    }
	    /**
	     * @returns Whether this session is presently in a transaction
	     */
	    get isActive() {
	        return ACTIVE_STATES.has(this.state);
	    }
	    get isCommitted() {
	        return COMMITTED_STATES.has(this.state);
	    }
	    /**
	     * Transition the transaction in the state machine
	     * @internal
	     * @param nextState - The new state to transition to
	     */
	    transition(nextState) {
	        const nextStates = stateMachine[this.state];
	        if (nextStates && nextStates.includes(nextState)) {
	            this.state = nextState;
	            if (this.state === exports.TxnState.NO_TRANSACTION ||
	                this.state === exports.TxnState.STARTING_TRANSACTION ||
	                this.state === exports.TxnState.TRANSACTION_ABORTED) {
	                this.unpinServer();
	            }
	            return;
	        }
	        throw new error_1.MongoRuntimeError(`Attempted illegal state transition from [${this.state}] to [${nextState}]`);
	    }
	    /** @internal */
	    pinServer(server) {
	        if (this.isActive) {
	            this._pinnedServer = server;
	        }
	    }
	    /** @internal */
	    unpinServer() {
	        this._pinnedServer = undefined;
	    }
	}
	exports.Transaction = Transaction;
	function isTransactionCommand(command) {
	    return !!(command.commitTransaction || command.abortTransaction);
	}
	exports.isTransactionCommand = isTransactionCommand;
	
} (transactions));

var _a$1;
Object.defineProperty(sessions, "__esModule", { value: true });
sessions.updateSessionFromResponse = sessions.applySession = sessions.ServerSessionPool = sessions.ServerSession = sessions.maybeClearPinnedConnection = sessions.ClientSession = void 0;
const util_1$3 = require$$0$6;
const bson_1$6 = bson;
const metrics_1 = metrics;
const shared_1$1 = shared;
const constants_1$4 = constants;
const error_1$s = error;
const mongo_types_1$3 = mongo_types;
const execute_operation_1$5 = execute_operation;
const run_command_1$1 = run_command;
const read_concern_1$1 = read_concern;
const read_preference_1$2 = read_preference;
const common_1$1 = common$1;
const transactions_1 = transactions;
const utils_1$j = utils;
const write_concern_1$2 = write_concern;
const minWireVersionForShardedTransactions = 8;
/** @internal */
const kServerSession = Symbol('serverSession');
/** @internal */
const kSnapshotTime = Symbol('snapshotTime');
/** @internal */
const kSnapshotEnabled = Symbol('snapshotEnabled');
/** @internal */
const kPinnedConnection = Symbol('pinnedConnection');
/** @internal Accumulates total number of increments to add to txnNumber when applying session to command */
const kTxnNumberIncrement = Symbol('txnNumberIncrement');
/**
 * A class representing a client session on the server
 *
 * NOTE: not meant to be instantiated directly.
 * @public
 */
class ClientSession extends mongo_types_1$3.TypedEventEmitter {
    /**
     * Create a client session.
     * @internal
     * @param client - The current client
     * @param sessionPool - The server session pool (Internal Class)
     * @param options - Optional settings
     * @param clientOptions - Optional settings provided when creating a MongoClient
     */
    constructor(client, sessionPool, options, clientOptions) {
        super();
        /** @internal */
        this[_a$1] = false;
        if (client == null) {
            // TODO(NODE-3483)
            throw new error_1$s.MongoRuntimeError('ClientSession requires a MongoClient');
        }
        if (sessionPool == null || !(sessionPool instanceof ServerSessionPool)) {
            // TODO(NODE-3483)
            throw new error_1$s.MongoRuntimeError('ClientSession requires a ServerSessionPool');
        }
        options = options ?? {};
        if (options.snapshot === true) {
            this[kSnapshotEnabled] = true;
            if (options.causalConsistency === true) {
                throw new error_1$s.MongoInvalidArgumentError('Properties "causalConsistency" and "snapshot" are mutually exclusive');
            }
        }
        this.client = client;
        this.sessionPool = sessionPool;
        this.hasEnded = false;
        this.clientOptions = clientOptions;
        this.explicit = !!options.explicit;
        this[kServerSession] = this.explicit ? this.sessionPool.acquire() : null;
        this[kTxnNumberIncrement] = 0;
        const defaultCausalConsistencyValue = this.explicit && options.snapshot !== true;
        this.supports = {
            // if we can enable causal consistency, do so by default
            causalConsistency: options.causalConsistency ?? defaultCausalConsistencyValue
        };
        this.clusterTime = options.initialClusterTime;
        this.operationTime = undefined;
        this.owner = options.owner;
        this.defaultTransactionOptions = Object.assign({}, options.defaultTransactionOptions);
        this.transaction = new transactions_1.Transaction();
    }
    /** The server id associated with this session */
    get id() {
        return this[kServerSession]?.id;
    }
    get serverSession() {
        let serverSession = this[kServerSession];
        if (serverSession == null) {
            if (this.explicit) {
                throw new error_1$s.MongoRuntimeError('Unexpected null serverSession for an explicit session');
            }
            if (this.hasEnded) {
                throw new error_1$s.MongoRuntimeError('Unexpected null serverSession for an ended implicit session');
            }
            serverSession = this.sessionPool.acquire();
            this[kServerSession] = serverSession;
        }
        return serverSession;
    }
    /** Whether or not this session is configured for snapshot reads */
    get snapshotEnabled() {
        return this[kSnapshotEnabled];
    }
    get loadBalanced() {
        return this.client.topology?.description.type === common_1$1.TopologyType.LoadBalanced;
    }
    /** @internal */
    get pinnedConnection() {
        return this[kPinnedConnection];
    }
    /** @internal */
    pin(conn) {
        if (this[kPinnedConnection]) {
            throw TypeError('Cannot pin multiple connections to the same session');
        }
        this[kPinnedConnection] = conn;
        conn.emit(constants_1$4.PINNED, this.inTransaction() ? metrics_1.ConnectionPoolMetrics.TXN : metrics_1.ConnectionPoolMetrics.CURSOR);
    }
    /** @internal */
    unpin(options) {
        if (this.loadBalanced) {
            return maybeClearPinnedConnection(this, options);
        }
        this.transaction.unpinServer();
    }
    get isPinned() {
        return this.loadBalanced ? !!this[kPinnedConnection] : this.transaction.isPinned;
    }
    /**
     * Ends this session on the server
     *
     * @param options - Optional settings. Currently reserved for future use
     */
    async endSession(options) {
        try {
            if (this.inTransaction()) {
                await this.abortTransaction();
            }
            if (!this.hasEnded) {
                const serverSession = this[kServerSession];
                if (serverSession != null) {
                    // release the server session back to the pool
                    this.sessionPool.release(serverSession);
                    // Make sure a new serverSession never makes it onto this ClientSession
                    Object.defineProperty(this, kServerSession, {
                        value: ServerSession.clone(serverSession),
                        writable: false
                    });
                }
                // mark the session as ended, and emit a signal
                this.hasEnded = true;
                this.emit('ended', this);
            }
        }
        catch {
            // spec indicates that we should ignore all errors for `endSessions`
        }
        finally {
            maybeClearPinnedConnection(this, { force: true, ...options });
        }
    }
    /**
     * Advances the operationTime for a ClientSession.
     *
     * @param operationTime - the `BSON.Timestamp` of the operation type it is desired to advance to
     */
    advanceOperationTime(operationTime) {
        if (this.operationTime == null) {
            this.operationTime = operationTime;
            return;
        }
        if (operationTime.greaterThan(this.operationTime)) {
            this.operationTime = operationTime;
        }
    }
    /**
     * Advances the clusterTime for a ClientSession to the provided clusterTime of another ClientSession
     *
     * @param clusterTime - the $clusterTime returned by the server from another session in the form of a document containing the `BSON.Timestamp` clusterTime and signature
     */
    advanceClusterTime(clusterTime) {
        if (!clusterTime || typeof clusterTime !== 'object') {
            throw new error_1$s.MongoInvalidArgumentError('input cluster time must be an object');
        }
        if (!clusterTime.clusterTime || clusterTime.clusterTime._bsontype !== 'Timestamp') {
            throw new error_1$s.MongoInvalidArgumentError('input cluster time "clusterTime" property must be a valid BSON Timestamp');
        }
        if (!clusterTime.signature ||
            clusterTime.signature.hash?._bsontype !== 'Binary' ||
            (typeof clusterTime.signature.keyId !== 'bigint' &&
                typeof clusterTime.signature.keyId !== 'number' &&
                clusterTime.signature.keyId?._bsontype !== 'Long') // apparently we decode the key to number?
        ) {
            throw new error_1$s.MongoInvalidArgumentError('input cluster time must have a valid "signature" property with BSON Binary hash and BSON Long keyId');
        }
        (0, common_1$1._advanceClusterTime)(this, clusterTime);
    }
    /**
     * Used to determine if this session equals another
     *
     * @param session - The session to compare to
     */
    equals(session) {
        if (!(session instanceof ClientSession)) {
            return false;
        }
        if (this.id == null || session.id == null) {
            return false;
        }
        return utils_1$j.ByteUtils.equals(this.id.id.buffer, session.id.id.buffer);
    }
    /**
     * Increment the transaction number on the internal ServerSession
     *
     * @privateRemarks
     * This helper increments a value stored on the client session that will be
     * added to the serverSession's txnNumber upon applying it to a command.
     * This is because the serverSession is lazily acquired after a connection is obtained
     */
    incrementTransactionNumber() {
        this[kTxnNumberIncrement] += 1;
    }
    /** @returns whether this session is currently in a transaction or not */
    inTransaction() {
        return this.transaction.isActive;
    }
    /**
     * Starts a new transaction with the given options.
     *
     * @param options - Options for the transaction
     */
    startTransaction(options) {
        if (this[kSnapshotEnabled]) {
            throw new error_1$s.MongoCompatibilityError('Transactions are not supported in snapshot sessions');
        }
        if (this.inTransaction()) {
            throw new error_1$s.MongoTransactionError('Transaction already in progress');
        }
        if (this.isPinned && this.transaction.isCommitted) {
            this.unpin();
        }
        const topologyMaxWireVersion = (0, utils_1$j.maxWireVersion)(this.client.topology);
        if ((0, shared_1$1.isSharded)(this.client.topology) &&
            topologyMaxWireVersion != null &&
            topologyMaxWireVersion < minWireVersionForShardedTransactions) {
            throw new error_1$s.MongoCompatibilityError('Transactions are not supported on sharded clusters in MongoDB < 4.2.');
        }
        // increment txnNumber
        this.incrementTransactionNumber();
        // create transaction state
        this.transaction = new transactions_1.Transaction({
            readConcern: options?.readConcern ??
                this.defaultTransactionOptions.readConcern ??
                this.clientOptions?.readConcern,
            writeConcern: options?.writeConcern ??
                this.defaultTransactionOptions.writeConcern ??
                this.clientOptions?.writeConcern,
            readPreference: options?.readPreference ??
                this.defaultTransactionOptions.readPreference ??
                this.clientOptions?.readPreference,
            maxCommitTimeMS: options?.maxCommitTimeMS ?? this.defaultTransactionOptions.maxCommitTimeMS
        });
        this.transaction.transition(transactions_1.TxnState.STARTING_TRANSACTION);
    }
    /**
     * Commits the currently active transaction in this session.
     */
    async commitTransaction() {
        return endTransactionAsync(this, 'commitTransaction');
    }
    /**
     * Aborts the currently active transaction in this session.
     */
    async abortTransaction() {
        return endTransactionAsync(this, 'abortTransaction');
    }
    /**
     * This is here to ensure that ClientSession is never serialized to BSON.
     */
    toBSON() {
        throw new error_1$s.MongoRuntimeError('ClientSession cannot be serialized to BSON.');
    }
    /**
     * Runs a provided callback within a transaction, retrying either the commitTransaction operation
     * or entire transaction as needed (and when the error permits) to better ensure that
     * the transaction can complete successfully.
     *
     * **IMPORTANT:** This method requires the user to return a Promise, and `await` all operations.
     * Any callbacks that do not return a Promise will result in undefined behavior.
     *
     * @remarks
     * This function:
     * - Will return the command response from the final commitTransaction if every operation is successful (can be used as a truthy object)
     * - Will return `undefined` if the transaction is explicitly aborted with `await session.abortTransaction()`
     * - Will throw if one of the operations throws or `throw` statement is used inside the `withTransaction` callback
     *
     * Checkout a descriptive example here:
     * @see https://www.mongodb.com/developer/quickstart/node-transactions/
     *
     * @param fn - callback to run within a transaction
     * @param options - optional settings for the transaction
     * @returns A raw command response or undefined
     */
    async withTransaction(fn, options) {
        const startTime = (0, utils_1$j.now)();
        return attemptTransaction(this, startTime, fn, options);
    }
}
sessions.ClientSession = ClientSession;
_a$1 = kSnapshotEnabled;
const MAX_WITH_TRANSACTION_TIMEOUT = 120000;
const NON_DETERMINISTIC_WRITE_CONCERN_ERRORS = new Set([
    'CannotSatisfyWriteConcern',
    'UnknownReplWriteConcern',
    'UnsatisfiableWriteConcern'
]);
function hasNotTimedOut(startTime, max) {
    return (0, utils_1$j.calculateDurationInMs)(startTime) < max;
}
function isUnknownTransactionCommitResult(err) {
    const isNonDeterministicWriteConcernError = err instanceof error_1$s.MongoServerError &&
        err.codeName &&
        NON_DETERMINISTIC_WRITE_CONCERN_ERRORS.has(err.codeName);
    return (isMaxTimeMSExpiredError(err) ||
        (!isNonDeterministicWriteConcernError &&
            err.code !== error_1$s.MONGODB_ERROR_CODES.UnsatisfiableWriteConcern &&
            err.code !== error_1$s.MONGODB_ERROR_CODES.UnknownReplWriteConcern));
}
function maybeClearPinnedConnection(session, options) {
    // unpin a connection if it has been pinned
    const conn = session[kPinnedConnection];
    const error = options?.error;
    if (session.inTransaction() &&
        error &&
        error instanceof error_1$s.MongoError &&
        error.hasErrorLabel(error_1$s.MongoErrorLabel.TransientTransactionError)) {
        return;
    }
    const topology = session.client.topology;
    // NOTE: the spec talks about what to do on a network error only, but the tests seem to
    //       to validate that we don't unpin on _all_ errors?
    if (conn && topology != null) {
        const servers = Array.from(topology.s.servers.values());
        const loadBalancer = servers[0];
        if (options?.error == null || options?.force) {
            loadBalancer.pool.checkIn(conn);
            conn.emit(constants_1$4.UNPINNED, session.transaction.state !== transactions_1.TxnState.NO_TRANSACTION
                ? metrics_1.ConnectionPoolMetrics.TXN
                : metrics_1.ConnectionPoolMetrics.CURSOR);
            if (options?.forceClear) {
                loadBalancer.pool.clear({ serviceId: conn.serviceId });
            }
        }
        session[kPinnedConnection] = undefined;
    }
}
sessions.maybeClearPinnedConnection = maybeClearPinnedConnection;
function isMaxTimeMSExpiredError(err) {
    if (err == null || !(err instanceof error_1$s.MongoServerError)) {
        return false;
    }
    return (err.code === error_1$s.MONGODB_ERROR_CODES.MaxTimeMSExpired ||
        (err.writeConcernError && err.writeConcernError.code === error_1$s.MONGODB_ERROR_CODES.MaxTimeMSExpired));
}
function attemptTransactionCommit(session, startTime, fn, options) {
    return session.commitTransaction().catch((err) => {
        if (err instanceof error_1$s.MongoError &&
            hasNotTimedOut(startTime, MAX_WITH_TRANSACTION_TIMEOUT) &&
            !isMaxTimeMSExpiredError(err)) {
            if (err.hasErrorLabel(error_1$s.MongoErrorLabel.UnknownTransactionCommitResult)) {
                return attemptTransactionCommit(session, startTime, fn, options);
            }
            if (err.hasErrorLabel(error_1$s.MongoErrorLabel.TransientTransactionError)) {
                return attemptTransaction(session, startTime, fn, options);
            }
        }
        throw err;
    });
}
const USER_EXPLICIT_TXN_END_STATES = new Set([
    transactions_1.TxnState.NO_TRANSACTION,
    transactions_1.TxnState.TRANSACTION_COMMITTED,
    transactions_1.TxnState.TRANSACTION_ABORTED
]);
function userExplicitlyEndedTransaction(session) {
    return USER_EXPLICIT_TXN_END_STATES.has(session.transaction.state);
}
function attemptTransaction(session, startTime, fn, options) {
    session.startTransaction(options);
    let promise;
    try {
        promise = fn(session);
    }
    catch (err) {
        promise = Promise.reject(err);
    }
    if (!(0, utils_1$j.isPromiseLike)(promise)) {
        session.abortTransaction().catch(() => null);
        throw new error_1$s.MongoInvalidArgumentError('Function provided to `withTransaction` must return a Promise');
    }
    return promise.then(() => {
        if (userExplicitlyEndedTransaction(session)) {
            return;
        }
        return attemptTransactionCommit(session, startTime, fn, options);
    }, err => {
        function maybeRetryOrThrow(err) {
            if (err instanceof error_1$s.MongoError &&
                err.hasErrorLabel(error_1$s.MongoErrorLabel.TransientTransactionError) &&
                hasNotTimedOut(startTime, MAX_WITH_TRANSACTION_TIMEOUT)) {
                return attemptTransaction(session, startTime, fn, options);
            }
            if (isMaxTimeMSExpiredError(err)) {
                err.addErrorLabel(error_1$s.MongoErrorLabel.UnknownTransactionCommitResult);
            }
            throw err;
        }
        if (session.inTransaction()) {
            return session.abortTransaction().then(() => maybeRetryOrThrow(err));
        }
        return maybeRetryOrThrow(err);
    });
}
const endTransactionAsync = (0, util_1$3.promisify)(endTransaction);
function endTransaction(session, commandName, callback) {
    // handle any initial problematic cases
    const txnState = session.transaction.state;
    if (txnState === transactions_1.TxnState.NO_TRANSACTION) {
        callback(new error_1$s.MongoTransactionError('No transaction started'));
        return;
    }
    if (commandName === 'commitTransaction') {
        if (txnState === transactions_1.TxnState.STARTING_TRANSACTION ||
            txnState === transactions_1.TxnState.TRANSACTION_COMMITTED_EMPTY) {
            // the transaction was never started, we can safely exit here
            session.transaction.transition(transactions_1.TxnState.TRANSACTION_COMMITTED_EMPTY);
            callback();
            return;
        }
        if (txnState === transactions_1.TxnState.TRANSACTION_ABORTED) {
            callback(new error_1$s.MongoTransactionError('Cannot call commitTransaction after calling abortTransaction'));
            return;
        }
    }
    else {
        if (txnState === transactions_1.TxnState.STARTING_TRANSACTION) {
            // the transaction was never started, we can safely exit here
            session.transaction.transition(transactions_1.TxnState.TRANSACTION_ABORTED);
            callback();
            return;
        }
        if (txnState === transactions_1.TxnState.TRANSACTION_ABORTED) {
            callback(new error_1$s.MongoTransactionError('Cannot call abortTransaction twice'));
            return;
        }
        if (txnState === transactions_1.TxnState.TRANSACTION_COMMITTED ||
            txnState === transactions_1.TxnState.TRANSACTION_COMMITTED_EMPTY) {
            callback(new error_1$s.MongoTransactionError('Cannot call abortTransaction after calling commitTransaction'));
            return;
        }
    }
    // construct and send the command
    const command = { [commandName]: 1 };
    // apply a writeConcern if specified
    let writeConcern;
    if (session.transaction.options.writeConcern) {
        writeConcern = Object.assign({}, session.transaction.options.writeConcern);
    }
    else if (session.clientOptions && session.clientOptions.writeConcern) {
        writeConcern = { w: session.clientOptions.writeConcern.w };
    }
    if (txnState === transactions_1.TxnState.TRANSACTION_COMMITTED) {
        writeConcern = Object.assign({ wtimeoutMS: 10000 }, writeConcern, { w: 'majority' });
    }
    if (writeConcern) {
        write_concern_1$2.WriteConcern.apply(command, writeConcern);
    }
    if (commandName === 'commitTransaction' && session.transaction.options.maxTimeMS) {
        Object.assign(command, { maxTimeMS: session.transaction.options.maxTimeMS });
    }
    function commandHandler(error, result) {
        if (commandName !== 'commitTransaction') {
            session.transaction.transition(transactions_1.TxnState.TRANSACTION_ABORTED);
            if (session.loadBalanced) {
                maybeClearPinnedConnection(session, { force: false });
            }
            // The spec indicates that we should ignore all errors on `abortTransaction`
            return callback();
        }
        session.transaction.transition(transactions_1.TxnState.TRANSACTION_COMMITTED);
        if (error instanceof error_1$s.MongoError) {
            if (error.hasErrorLabel(error_1$s.MongoErrorLabel.RetryableWriteError) ||
                error instanceof error_1$s.MongoWriteConcernError ||
                isMaxTimeMSExpiredError(error)) {
                if (isUnknownTransactionCommitResult(error)) {
                    error.addErrorLabel(error_1$s.MongoErrorLabel.UnknownTransactionCommitResult);
                    // per txns spec, must unpin session in this case
                    session.unpin({ error });
                }
            }
            else if (error.hasErrorLabel(error_1$s.MongoErrorLabel.TransientTransactionError)) {
                session.unpin({ error });
            }
        }
        callback(error, result);
    }
    if (session.transaction.recoveryToken) {
        command.recoveryToken = session.transaction.recoveryToken;
    }
    // send the command
    (0, execute_operation_1$5.executeOperation)(session.client, new run_command_1$1.RunAdminCommandOperation(undefined, command, {
        session,
        readPreference: read_preference_1$2.ReadPreference.primary,
        bypassPinningCheck: true
    }), (error, result) => {
        if (command.abortTransaction) {
            // always unpin on abort regardless of command outcome
            session.unpin();
        }
        if (error instanceof error_1$s.MongoError && error.hasErrorLabel(error_1$s.MongoErrorLabel.RetryableWriteError)) {
            // SPEC-1185: apply majority write concern when retrying commitTransaction
            if (command.commitTransaction) {
                // per txns spec, must unpin session in this case
                session.unpin({ force: true });
                command.writeConcern = Object.assign({ wtimeout: 10000 }, command.writeConcern, {
                    w: 'majority'
                });
            }
            return (0, execute_operation_1$5.executeOperation)(session.client, new run_command_1$1.RunAdminCommandOperation(undefined, command, {
                session,
                readPreference: read_preference_1$2.ReadPreference.primary,
                bypassPinningCheck: true
            }), commandHandler);
        }
        commandHandler(error, result);
    });
}
/**
 * Reflects the existence of a session on the server. Can be reused by the session pool.
 * WARNING: not meant to be instantiated directly. For internal use only.
 * @public
 */
class ServerSession {
    /** @internal */
    constructor() {
        this.id = { id: new bson_1$6.Binary((0, utils_1$j.uuidV4)(), bson_1$6.Binary.SUBTYPE_UUID) };
        this.lastUse = (0, utils_1$j.now)();
        this.txnNumber = 0;
        this.isDirty = false;
    }
    /**
     * Determines if the server session has timed out.
     *
     * @param sessionTimeoutMinutes - The server's "logicalSessionTimeoutMinutes"
     */
    hasTimedOut(sessionTimeoutMinutes) {
        // Take the difference of the lastUse timestamp and now, which will result in a value in
        // milliseconds, and then convert milliseconds to minutes to compare to `sessionTimeoutMinutes`
        const idleTimeMinutes = Math.round((((0, utils_1$j.calculateDurationInMs)(this.lastUse) % 86400000) % 3600000) / 60000);
        return idleTimeMinutes > sessionTimeoutMinutes - 1;
    }
    /**
     * @internal
     * Cloning meant to keep a readable reference to the server session data
     * after ClientSession has ended
     */
    static clone(serverSession) {
        const arrayBuffer = new ArrayBuffer(16);
        const idBytes = Buffer.from(arrayBuffer);
        idBytes.set(serverSession.id.id.buffer);
        const id = new bson_1$6.Binary(idBytes, serverSession.id.id.sub_type);
        // Manual prototype construction to avoid modifying the constructor of this class
        return Object.setPrototypeOf({
            id: { id },
            lastUse: serverSession.lastUse,
            txnNumber: serverSession.txnNumber,
            isDirty: serverSession.isDirty
        }, ServerSession.prototype);
    }
}
sessions.ServerSession = ServerSession;
/**
 * Maintains a pool of Server Sessions.
 * For internal use only
 * @internal
 */
class ServerSessionPool {
    constructor(client) {
        if (client == null) {
            throw new error_1$s.MongoRuntimeError('ServerSessionPool requires a MongoClient');
        }
        this.client = client;
        this.sessions = new utils_1$j.List();
    }
    /**
     * Acquire a Server Session from the pool.
     * Iterates through each session in the pool, removing any stale sessions
     * along the way. The first non-stale session found is removed from the
     * pool and returned. If no non-stale session is found, a new ServerSession is created.
     */
    acquire() {
        const sessionTimeoutMinutes = this.client.topology?.logicalSessionTimeoutMinutes ?? 10;
        let session = null;
        // Try to obtain from session pool
        while (this.sessions.length > 0) {
            const potentialSession = this.sessions.shift();
            if (potentialSession != null &&
                (!!this.client.topology?.loadBalanced ||
                    !potentialSession.hasTimedOut(sessionTimeoutMinutes))) {
                session = potentialSession;
                break;
            }
        }
        // If nothing valid came from the pool make a new one
        if (session == null) {
            session = new ServerSession();
        }
        return session;
    }
    /**
     * Release a session to the session pool
     * Adds the session back to the session pool if the session has not timed out yet.
     * This method also removes any stale sessions from the pool.
     *
     * @param session - The session to release to the pool
     */
    release(session) {
        const sessionTimeoutMinutes = this.client.topology?.logicalSessionTimeoutMinutes ?? 10;
        if (this.client.topology?.loadBalanced && !sessionTimeoutMinutes) {
            this.sessions.unshift(session);
        }
        if (!sessionTimeoutMinutes) {
            return;
        }
        this.sessions.prune(session => session.hasTimedOut(sessionTimeoutMinutes));
        if (!session.hasTimedOut(sessionTimeoutMinutes)) {
            if (session.isDirty) {
                return;
            }
            // otherwise, readd this session to the session pool
            this.sessions.unshift(session);
        }
    }
}
sessions.ServerSessionPool = ServerSessionPool;
/**
 * Optionally decorate a command with sessions specific keys
 *
 * @param session - the session tracking transaction state
 * @param command - the command to decorate
 * @param options - Optional settings passed to calling operation
 *
 * @internal
 */
function applySession(session, command, options) {
    if (session.hasEnded) {
        return new error_1$s.MongoExpiredSessionError();
    }
    // May acquire serverSession here
    const serverSession = session.serverSession;
    if (serverSession == null) {
        return new error_1$s.MongoRuntimeError('Unable to acquire server session');
    }
    if (options.writeConcern?.w === 0) {
        if (session && session.explicit) {
            // Error if user provided an explicit session to an unacknowledged write (SPEC-1019)
            return new error_1$s.MongoAPIError('Cannot have explicit session with unacknowledged writes');
        }
        return;
    }
    // mark the last use of this session, and apply the `lsid`
    serverSession.lastUse = (0, utils_1$j.now)();
    command.lsid = serverSession.id;
    const inTxnOrTxnCommand = session.inTransaction() || (0, transactions_1.isTransactionCommand)(command);
    const isRetryableWrite = !!options.willRetryWrite;
    if (isRetryableWrite || inTxnOrTxnCommand) {
        serverSession.txnNumber += session[kTxnNumberIncrement];
        session[kTxnNumberIncrement] = 0;
        // TODO(NODE-2674): Preserve int64 sent from MongoDB
        command.txnNumber = bson_1$6.Long.fromNumber(serverSession.txnNumber);
    }
    if (!inTxnOrTxnCommand) {
        if (session.transaction.state !== transactions_1.TxnState.NO_TRANSACTION) {
            session.transaction.transition(transactions_1.TxnState.NO_TRANSACTION);
        }
        if (session.supports.causalConsistency &&
            session.operationTime &&
            (0, utils_1$j.commandSupportsReadConcern)(command, options)) {
            command.readConcern = command.readConcern || {};
            Object.assign(command.readConcern, { afterClusterTime: session.operationTime });
        }
        else if (session[kSnapshotEnabled]) {
            command.readConcern = command.readConcern || { level: read_concern_1$1.ReadConcernLevel.snapshot };
            if (session[kSnapshotTime] != null) {
                Object.assign(command.readConcern, { atClusterTime: session[kSnapshotTime] });
            }
        }
        return;
    }
    // now attempt to apply transaction-specific sessions data
    // `autocommit` must always be false to differentiate from retryable writes
    command.autocommit = false;
    if (session.transaction.state === transactions_1.TxnState.STARTING_TRANSACTION) {
        session.transaction.transition(transactions_1.TxnState.TRANSACTION_IN_PROGRESS);
        command.startTransaction = true;
        const readConcern = session.transaction.options.readConcern || session?.clientOptions?.readConcern;
        if (readConcern) {
            command.readConcern = readConcern;
        }
        if (session.supports.causalConsistency && session.operationTime) {
            command.readConcern = command.readConcern || {};
            Object.assign(command.readConcern, { afterClusterTime: session.operationTime });
        }
    }
    return;
}
sessions.applySession = applySession;
function updateSessionFromResponse(session, document) {
    if (document.$clusterTime) {
        (0, common_1$1._advanceClusterTime)(session, document.$clusterTime);
    }
    if (document.operationTime && session && session.supports.causalConsistency) {
        session.advanceOperationTime(document.operationTime);
    }
    if (document.recoveryToken && session && session.inTransaction()) {
        session.transaction._recoveryToken = document.recoveryToken;
    }
    if (session?.[kSnapshotEnabled] && session[kSnapshotTime] == null) {
        // find and aggregate commands return atClusterTime on the cursor
        // distinct includes it in the response body
        const atClusterTime = document.cursor?.atClusterTime || document.atClusterTime;
        if (atClusterTime) {
            session[kSnapshotTime] = atClusterTime;
        }
    }
}
sessions.updateSessionFromResponse = updateSessionFromResponse;

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assertUninitialized = exports.AbstractCursor = exports.CURSOR_FLAGS = void 0;
	const stream_1 = require$$0$5;
	const util_1 = require$$0$6;
	const bson_1 = bson;
	const error_1 = error;
	const mongo_types_1 = mongo_types;
	const execute_operation_1 = execute_operation;
	const get_more_1 = get_more;
	const kill_cursors_1 = kill_cursors;
	const read_concern_1 = read_concern;
	const read_preference_1 = read_preference;
	const sessions_1 = sessions;
	const utils_1 = utils;
	/** @internal */
	const kId = Symbol('id');
	/** @internal */
	const kDocuments = Symbol('documents');
	/** @internal */
	const kServer = Symbol('server');
	/** @internal */
	const kNamespace = Symbol('namespace');
	/** @internal */
	const kClient = Symbol('client');
	/** @internal */
	const kSession = Symbol('session');
	/** @internal */
	const kOptions = Symbol('options');
	/** @internal */
	const kTransform = Symbol('transform');
	/** @internal */
	const kInitialized = Symbol('initialized');
	/** @internal */
	const kClosed = Symbol('closed');
	/** @internal */
	const kKilled = Symbol('killed');
	/** @internal */
	const kInit = Symbol('kInit');
	/** @public */
	exports.CURSOR_FLAGS = [
	    'tailable',
	    'oplogReplay',
	    'noCursorTimeout',
	    'awaitData',
	    'exhaust',
	    'partial'
	];
	/** @public */
	class AbstractCursor extends mongo_types_1.TypedEventEmitter {
	    /** @internal */
	    constructor(client, namespace, options = {}) {
	        super();
	        if (!client.s.isMongoClient) {
	            throw new error_1.MongoRuntimeError('Cursor must be constructed with MongoClient');
	        }
	        this[kClient] = client;
	        this[kNamespace] = namespace;
	        this[kId] = null;
	        this[kDocuments] = new utils_1.List();
	        this[kInitialized] = false;
	        this[kClosed] = false;
	        this[kKilled] = false;
	        this[kOptions] = {
	            readPreference: options.readPreference && options.readPreference instanceof read_preference_1.ReadPreference
	                ? options.readPreference
	                : read_preference_1.ReadPreference.primary,
	            ...(0, bson_1.pluckBSONSerializeOptions)(options)
	        };
	        const readConcern = read_concern_1.ReadConcern.fromOptions(options);
	        if (readConcern) {
	            this[kOptions].readConcern = readConcern;
	        }
	        if (typeof options.batchSize === 'number') {
	            this[kOptions].batchSize = options.batchSize;
	        }
	        // we check for undefined specifically here to allow falsy values
	        // eslint-disable-next-line no-restricted-syntax
	        if (options.comment !== undefined) {
	            this[kOptions].comment = options.comment;
	        }
	        if (typeof options.maxTimeMS === 'number') {
	            this[kOptions].maxTimeMS = options.maxTimeMS;
	        }
	        if (typeof options.maxAwaitTimeMS === 'number') {
	            this[kOptions].maxAwaitTimeMS = options.maxAwaitTimeMS;
	        }
	        if (options.session instanceof sessions_1.ClientSession) {
	            this[kSession] = options.session;
	        }
	        else {
	            this[kSession] = this[kClient].startSession({ owner: this, explicit: false });
	        }
	    }
	    get id() {
	        return this[kId] ?? undefined;
	    }
	    /** @internal */
	    get client() {
	        return this[kClient];
	    }
	    /** @internal */
	    get server() {
	        return this[kServer];
	    }
	    get namespace() {
	        return this[kNamespace];
	    }
	    get readPreference() {
	        return this[kOptions].readPreference;
	    }
	    get readConcern() {
	        return this[kOptions].readConcern;
	    }
	    /** @internal */
	    get session() {
	        return this[kSession];
	    }
	    set session(clientSession) {
	        this[kSession] = clientSession;
	    }
	    /** @internal */
	    get cursorOptions() {
	        return this[kOptions];
	    }
	    get closed() {
	        return this[kClosed];
	    }
	    get killed() {
	        return this[kKilled];
	    }
	    get loadBalanced() {
	        return !!this[kClient].topology?.loadBalanced;
	    }
	    /** Returns current buffered documents length */
	    bufferedCount() {
	        return this[kDocuments].length;
	    }
	    /** Returns current buffered documents */
	    readBufferedDocuments(number) {
	        const bufferedDocs = [];
	        const documentsToRead = Math.min(number ?? this[kDocuments].length, this[kDocuments].length);
	        for (let count = 0; count < documentsToRead; count++) {
	            const document = this[kDocuments].shift();
	            if (document != null) {
	                bufferedDocs.push(document);
	            }
	        }
	        return bufferedDocs;
	    }
	    async *[Symbol.asyncIterator]() {
	        if (this.closed) {
	            return;
	        }
	        try {
	            while (true) {
	                const document = await this.next();
	                // Intentional strict null check, because users can map cursors to falsey values.
	                // We allow mapping to all values except for null.
	                // eslint-disable-next-line no-restricted-syntax
	                if (document === null) {
	                    if (!this.closed) {
	                        const message = 'Cursor returned a `null` document, but the cursor is not exhausted.  Mapping documents to `null` is not supported in the cursor transform.';
	                        await cleanupCursorAsync(this, { needsToEmitClosed: true }).catch(() => null);
	                        throw new error_1.MongoAPIError(message);
	                    }
	                    break;
	                }
	                yield document;
	                if (this[kId] === bson_1.Long.ZERO) {
	                    // Cursor exhausted
	                    break;
	                }
	            }
	        }
	        finally {
	            // Only close the cursor if it has not already been closed. This finally clause handles
	            // the case when a user would break out of a for await of loop early.
	            if (!this.closed) {
	                await this.close().catch(() => null);
	            }
	        }
	    }
	    stream(options) {
	        if (options?.transform) {
	            const transform = options.transform;
	            const readable = new ReadableCursorStream(this);
	            return readable.pipe(new stream_1.Transform({
	                objectMode: true,
	                highWaterMark: 1,
	                transform(chunk, _, callback) {
	                    try {
	                        const transformed = transform(chunk);
	                        callback(undefined, transformed);
	                    }
	                    catch (err) {
	                        callback(err);
	                    }
	                }
	            }));
	        }
	        return new ReadableCursorStream(this);
	    }
	    async hasNext() {
	        if (this[kId] === bson_1.Long.ZERO) {
	            return false;
	        }
	        if (this[kDocuments].length !== 0) {
	            return true;
	        }
	        const doc = await next(this, { blocking: true, transform: false });
	        if (doc) {
	            this[kDocuments].unshift(doc);
	            return true;
	        }
	        return false;
	    }
	    /** Get the next available document from the cursor, returns null if no more documents are available. */
	    async next() {
	        if (this[kId] === bson_1.Long.ZERO) {
	            throw new error_1.MongoCursorExhaustedError();
	        }
	        return next(this, { blocking: true, transform: true });
	    }
	    /**
	     * Try to get the next available document from the cursor or `null` if an empty batch is returned
	     */
	    async tryNext() {
	        if (this[kId] === bson_1.Long.ZERO) {
	            throw new error_1.MongoCursorExhaustedError();
	        }
	        return next(this, { blocking: false, transform: true });
	    }
	    /**
	     * Iterates over all the documents for this cursor using the iterator, callback pattern.
	     *
	     * If the iterator returns `false`, iteration will stop.
	     *
	     * @param iterator - The iteration callback.
	     * @deprecated - Will be removed in a future release. Use for await...of instead.
	     */
	    async forEach(iterator) {
	        if (typeof iterator !== 'function') {
	            throw new error_1.MongoInvalidArgumentError('Argument "iterator" must be a function');
	        }
	        for await (const document of this) {
	            const result = iterator(document);
	            if (result === false) {
	                break;
	            }
	        }
	    }
	    async close() {
	        const needsToEmitClosed = !this[kClosed];
	        this[kClosed] = true;
	        await cleanupCursorAsync(this, { needsToEmitClosed });
	    }
	    /**
	     * Returns an array of documents. The caller is responsible for making sure that there
	     * is enough memory to store the results. Note that the array only contains partial
	     * results when this cursor had been previously accessed. In that case,
	     * cursor.rewind() can be used to reset the cursor.
	     */
	    async toArray() {
	        const array = [];
	        for await (const document of this) {
	            array.push(document);
	        }
	        return array;
	    }
	    /**
	     * Add a cursor flag to the cursor
	     *
	     * @param flag - The flag to set, must be one of following ['tailable', 'oplogReplay', 'noCursorTimeout', 'awaitData', 'partial' -.
	     * @param value - The flag boolean value.
	     */
	    addCursorFlag(flag, value) {
	        assertUninitialized(this);
	        if (!exports.CURSOR_FLAGS.includes(flag)) {
	            throw new error_1.MongoInvalidArgumentError(`Flag ${flag} is not one of ${exports.CURSOR_FLAGS}`);
	        }
	        if (typeof value !== 'boolean') {
	            throw new error_1.MongoInvalidArgumentError(`Flag ${flag} must be a boolean value`);
	        }
	        this[kOptions][flag] = value;
	        return this;
	    }
	    /**
	     * Map all documents using the provided function
	     * If there is a transform set on the cursor, that will be called first and the result passed to
	     * this function's transform.
	     *
	     * @remarks
	     *
	     * **Note** Cursors use `null` internally to indicate that there are no more documents in the cursor. Providing a mapping
	     * function that maps values to `null` will result in the cursor closing itself before it has finished iterating
	     * all documents.  This will **not** result in a memory leak, just surprising behavior.  For example:
	     *
	     * ```typescript
	     * const cursor = collection.find({});
	     * cursor.map(() => null);
	     *
	     * const documents = await cursor.toArray();
	     * // documents is always [], regardless of how many documents are in the collection.
	     * ```
	     *
	     * Other falsey values are allowed:
	     *
	     * ```typescript
	     * const cursor = collection.find({});
	     * cursor.map(() => '');
	     *
	     * const documents = await cursor.toArray();
	     * // documents is now an array of empty strings
	     * ```
	     *
	     * **Note for Typescript Users:** adding a transform changes the return type of the iteration of this cursor,
	     * it **does not** return a new instance of a cursor. This means when calling map,
	     * you should always assign the result to a new variable in order to get a correctly typed cursor variable.
	     * Take note of the following example:
	     *
	     * @example
	     * ```typescript
	     * const cursor: FindCursor<Document> = coll.find();
	     * const mappedCursor: FindCursor<number> = cursor.map(doc => Object.keys(doc).length);
	     * const keyCounts: number[] = await mappedCursor.toArray(); // cursor.toArray() still returns Document[]
	     * ```
	     * @param transform - The mapping transformation method.
	     */
	    map(transform) {
	        assertUninitialized(this);
	        const oldTransform = this[kTransform]; // TODO(NODE-3283): Improve transform typing
	        if (oldTransform) {
	            this[kTransform] = doc => {
	                return transform(oldTransform(doc));
	            };
	        }
	        else {
	            this[kTransform] = transform;
	        }
	        return this;
	    }
	    /**
	     * Set the ReadPreference for the cursor.
	     *
	     * @param readPreference - The new read preference for the cursor.
	     */
	    withReadPreference(readPreference) {
	        assertUninitialized(this);
	        if (readPreference instanceof read_preference_1.ReadPreference) {
	            this[kOptions].readPreference = readPreference;
	        }
	        else if (typeof readPreference === 'string') {
	            this[kOptions].readPreference = read_preference_1.ReadPreference.fromString(readPreference);
	        }
	        else {
	            throw new error_1.MongoInvalidArgumentError(`Invalid read preference: ${readPreference}`);
	        }
	        return this;
	    }
	    /**
	     * Set the ReadPreference for the cursor.
	     *
	     * @param readPreference - The new read preference for the cursor.
	     */
	    withReadConcern(readConcern) {
	        assertUninitialized(this);
	        const resolvedReadConcern = read_concern_1.ReadConcern.fromOptions({ readConcern });
	        if (resolvedReadConcern) {
	            this[kOptions].readConcern = resolvedReadConcern;
	        }
	        return this;
	    }
	    /**
	     * Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)
	     *
	     * @param value - Number of milliseconds to wait before aborting the query.
	     */
	    maxTimeMS(value) {
	        assertUninitialized(this);
	        if (typeof value !== 'number') {
	            throw new error_1.MongoInvalidArgumentError('Argument for maxTimeMS must be a number');
	        }
	        this[kOptions].maxTimeMS = value;
	        return this;
	    }
	    /**
	     * Set the batch size for the cursor.
	     *
	     * @param value - The number of documents to return per batch. See {@link https://www.mongodb.com/docs/manual/reference/command/find/|find command documentation}.
	     */
	    batchSize(value) {
	        assertUninitialized(this);
	        if (this[kOptions].tailable) {
	            throw new error_1.MongoTailableCursorError('Tailable cursor does not support batchSize');
	        }
	        if (typeof value !== 'number') {
	            throw new error_1.MongoInvalidArgumentError('Operation "batchSize" requires an integer');
	        }
	        this[kOptions].batchSize = value;
	        return this;
	    }
	    /**
	     * Rewind this cursor to its uninitialized state. Any options that are present on the cursor will
	     * remain in effect. Iterating this cursor will cause new queries to be sent to the server, even
	     * if the resultant data has already been retrieved by this cursor.
	     */
	    rewind() {
	        if (!this[kInitialized]) {
	            return;
	        }
	        this[kId] = null;
	        this[kDocuments].clear();
	        this[kClosed] = false;
	        this[kKilled] = false;
	        this[kInitialized] = false;
	        const session = this[kSession];
	        if (session) {
	            // We only want to end this session if we created it, and it hasn't ended yet
	            if (session.explicit === false) {
	                if (!session.hasEnded) {
	                    session.endSession().catch(() => null);
	                }
	                this[kSession] = this.client.startSession({ owner: this, explicit: false });
	            }
	        }
	    }
	    /** @internal */
	    _getMore(batchSize, callback) {
	        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	        const getMoreOperation = new get_more_1.GetMoreOperation(this[kNamespace], this[kId], this[kServer], {
	            ...this[kOptions],
	            session: this[kSession],
	            batchSize
	        });
	        (0, execute_operation_1.executeOperation)(this[kClient], getMoreOperation, callback);
	    }
	    /**
	     * @internal
	     *
	     * This function is exposed for the unified test runner's createChangeStream
	     * operation.  We cannot refactor to use the abstract _initialize method without
	     * a significant refactor.
	     */
	    [kInit](callback) {
	        this._initialize(this[kSession], (error, state) => {
	            if (state) {
	                const response = state.response;
	                this[kServer] = state.server;
	                if (response.cursor) {
	                    // TODO(NODE-2674): Preserve int64 sent from MongoDB
	                    this[kId] =
	                        typeof response.cursor.id === 'number'
	                            ? bson_1.Long.fromNumber(response.cursor.id)
	                            : typeof response.cursor.id === 'bigint'
	                                ? bson_1.Long.fromBigInt(response.cursor.id)
	                                : response.cursor.id;
	                    if (response.cursor.ns) {
	                        this[kNamespace] = (0, utils_1.ns)(response.cursor.ns);
	                    }
	                    this[kDocuments].pushMany(response.cursor.firstBatch);
	                }
	                // When server responses return without a cursor document, we close this cursor
	                // and return the raw server response. This is often the case for explain commands
	                // for example
	                if (this[kId] == null) {
	                    this[kId] = bson_1.Long.ZERO;
	                    // TODO(NODE-3286): ExecutionResult needs to accept a generic parameter
	                    this[kDocuments].push(state.response);
	                }
	            }
	            // the cursor is now initialized, even if an error occurred or it is dead
	            this[kInitialized] = true;
	            if (error) {
	                return cleanupCursor(this, { error }, () => callback(error, undefined));
	            }
	            if (cursorIsDead(this)) {
	                return cleanupCursor(this, undefined, () => callback());
	            }
	            callback();
	        });
	    }
	}
	/** @event */
	AbstractCursor.CLOSE = 'close';
	exports.AbstractCursor = AbstractCursor;
	/**
	 * @param cursor - the cursor on which to call `next`
	 * @param blocking - a boolean indicating whether or not the cursor should `block` until data
	 *     is available.  Generally, this flag is set to `false` because if the getMore returns no documents,
	 *     the cursor has been exhausted.  In certain scenarios (ChangeStreams, tailable await cursors and
	 *     `tryNext`, for example) blocking is necessary because a getMore returning no documents does
	 *     not indicate the end of the cursor.
	 * @param transform - if true, the cursor's transform function is applied to the result document (if the transform exists)
	 * @returns the next document in the cursor, or `null`.  When `blocking` is `true`, a `null` document means
	 * the cursor has been exhausted.  Otherwise, it means that there is no document available in the cursor's buffer.
	 */
	async function next(cursor, { blocking, transform }) {
	    const cursorId = cursor[kId];
	    if (cursor.closed) {
	        return null;
	    }
	    if (cursor[kDocuments].length !== 0) {
	        const doc = cursor[kDocuments].shift();
	        if (doc != null && transform && cursor[kTransform]) {
	            try {
	                return cursor[kTransform](doc);
	            }
	            catch (error) {
	                await cleanupCursorAsync(cursor, { error, needsToEmitClosed: true }).catch(() => {
	                    // `cleanupCursorAsync` should never throw, but if it does we want to throw the original
	                    // error instead.
	                });
	                throw error;
	            }
	        }
	        return doc;
	    }
	    if (cursorId == null) {
	        // All cursors must operate within a session, one must be made implicitly if not explicitly provided
	        const init = (0, util_1.promisify)(cb => cursor[kInit](cb));
	        await init();
	        return next(cursor, { blocking, transform });
	    }
	    if (cursorIsDead(cursor)) {
	        // if the cursor is dead, we clean it up
	        // cleanupCursorAsync should never throw, but if it does it indicates a bug in the driver
	        // and we should surface the error
	        await cleanupCursorAsync(cursor, {});
	        return null;
	    }
	    // otherwise need to call getMore
	    const batchSize = cursor[kOptions].batchSize || 1000;
	    const getMore = (0, util_1.promisify)((batchSize, cb) => cursor._getMore(batchSize, cb));
	    let response;
	    try {
	        response = await getMore(batchSize);
	    }
	    catch (error) {
	        if (error) {
	            await cleanupCursorAsync(cursor, { error }).catch(() => {
	                // `cleanupCursorAsync` should never throw, but if it does we want to throw the original
	                // error instead.
	            });
	            throw error;
	        }
	    }
	    if (response) {
	        const cursorId = typeof response.cursor.id === 'number'
	            ? bson_1.Long.fromNumber(response.cursor.id)
	            : typeof response.cursor.id === 'bigint'
	                ? bson_1.Long.fromBigInt(response.cursor.id)
	                : response.cursor.id;
	        cursor[kDocuments].pushMany(response.cursor.nextBatch);
	        cursor[kId] = cursorId;
	    }
	    if (cursorIsDead(cursor)) {
	        // If we successfully received a response from a cursor BUT the cursor indicates that it is exhausted,
	        // we intentionally clean up the cursor to release its session back into the pool before the cursor
	        // is iterated.  This prevents a cursor that is exhausted on the server from holding
	        // onto a session indefinitely until the AbstractCursor is iterated.
	        //
	        // cleanupCursorAsync should never throw, but if it does it indicates a bug in the driver
	        // and we should surface the error
	        await cleanupCursorAsync(cursor, {});
	    }
	    if (cursor[kDocuments].length === 0 && blocking === false) {
	        return null;
	    }
	    return next(cursor, { blocking, transform });
	}
	function cursorIsDead(cursor) {
	    const cursorId = cursor[kId];
	    return !!cursorId && cursorId.isZero();
	}
	const cleanupCursorAsync = (0, util_1.promisify)(cleanupCursor);
	function cleanupCursor(cursor, options, callback) {
	    const cursorId = cursor[kId];
	    const cursorNs = cursor[kNamespace];
	    const server = cursor[kServer];
	    const session = cursor[kSession];
	    const error = options?.error;
	    // Cursors only emit closed events once the client-side cursor has been exhausted fully or there
	    // was an error.  Notably, when the server returns a cursor id of 0 and a non-empty batch, we
	    // cleanup the cursor but don't emit a `close` event.
	    const needsToEmitClosed = options?.needsToEmitClosed ?? cursor[kDocuments].length === 0;
	    if (error) {
	        if (cursor.loadBalanced && error instanceof error_1.MongoNetworkError) {
	            return completeCleanup();
	        }
	    }
	    if (cursorId == null || server == null || cursorId.isZero() || cursorNs == null) {
	        if (needsToEmitClosed) {
	            cursor[kClosed] = true;
	            cursor[kId] = bson_1.Long.ZERO;
	            cursor.emit(AbstractCursor.CLOSE);
	        }
	        if (session) {
	            if (session.owner === cursor) {
	                session.endSession({ error }).finally(() => {
	                    callback();
	                });
	                return;
	            }
	            if (!session.inTransaction()) {
	                (0, sessions_1.maybeClearPinnedConnection)(session, { error });
	            }
	        }
	        return callback();
	    }
	    function completeCleanup() {
	        if (session) {
	            if (session.owner === cursor) {
	                session.endSession({ error }).finally(() => {
	                    cursor.emit(AbstractCursor.CLOSE);
	                    callback();
	                });
	                return;
	            }
	            if (!session.inTransaction()) {
	                (0, sessions_1.maybeClearPinnedConnection)(session, { error });
	            }
	        }
	        cursor.emit(AbstractCursor.CLOSE);
	        return callback();
	    }
	    cursor[kKilled] = true;
	    if (session.hasEnded) {
	        return completeCleanup();
	    }
	    (0, execute_operation_1.executeOperation)(cursor[kClient], new kill_cursors_1.KillCursorsOperation(cursorId, cursorNs, server, { session }))
	        .catch(() => null)
	        .finally(completeCleanup);
	}
	/** @internal */
	function assertUninitialized(cursor) {
	    if (cursor[kInitialized]) {
	        throw new error_1.MongoCursorInUseError();
	    }
	}
	exports.assertUninitialized = assertUninitialized;
	class ReadableCursorStream extends stream_1.Readable {
	    constructor(cursor) {
	        super({
	            objectMode: true,
	            autoDestroy: false,
	            highWaterMark: 1
	        });
	        this._readInProgress = false;
	        this._cursor = cursor;
	    }
	    // eslint-disable-next-line @typescript-eslint/no-unused-vars
	    _read(size) {
	        if (!this._readInProgress) {
	            this._readInProgress = true;
	            this._readNext();
	        }
	    }
	    _destroy(error, callback) {
	        this._cursor.close().then(() => callback(error), closeError => callback(closeError));
	    }
	    _readNext() {
	        next(this._cursor, { blocking: true, transform: true }).then(result => {
	            if (result == null) {
	                this.push(null);
	            }
	            else if (this.destroyed) {
	                this._cursor.close().catch(() => null);
	            }
	            else {
	                if (this.push(result)) {
	                    return this._readNext();
	                }
	                this._readInProgress = false;
	            }
	        }, err => {
	            // NOTE: This is questionable, but we have a test backing the behavior. It seems the
	            //       desired behavior is that a stream ends cleanly when a user explicitly closes
	            //       a client during iteration. Alternatively, we could do the "right" thing and
	            //       propagate the error message by removing this special case.
	            if (err.message.match(/server is closed/)) {
	                this._cursor.close().catch(() => null);
	                return this.push(null);
	            }
	            // NOTE: This is also perhaps questionable. The rationale here is that these errors tend
	            //       to be "operation was interrupted", where a cursor has been closed but there is an
	            //       active getMore in-flight. This used to check if the cursor was killed but once
	            //       that changed to happen in cleanup legitimate errors would not destroy the
	            //       stream. There are change streams test specifically test these cases.
	            if (err.message.match(/operation was interrupted/)) {
	                return this.push(null);
	            }
	            // NOTE: The two above checks on the message of the error will cause a null to be pushed
	            //       to the stream, thus closing the stream before the destroy call happens. This means
	            //       that either of those error messages on a change stream will not get a proper
	            //       'error' event to be emitted (the error passed to destroy). Change stream resumability
	            //       relies on that error event to be emitted to create its new cursor and thus was not
	            //       working on 4.4 servers because the error emitted on failover was "interrupted at
	            //       shutdown" while on 5.0+ it is "The server is in quiesce mode and will shut down".
	            //       See NODE-4475.
	            return this.destroy(err);
	        });
	    }
	}
	
} (abstract_cursor));

Object.defineProperty(aggregation_cursor, "__esModule", { value: true });
aggregation_cursor.AggregationCursor = void 0;
const aggregate_1$1 = aggregate;
const execute_operation_1$4 = execute_operation;
const utils_1$i = utils;
const abstract_cursor_1$4 = abstract_cursor;
/** @internal */
const kPipeline = Symbol('pipeline');
/** @internal */
const kOptions = Symbol('options');
/**
 * The **AggregationCursor** class is an internal class that embodies an aggregation cursor on MongoDB
 * allowing for iteration over the results returned from the underlying query. It supports
 * one by one document iteration, conversion to an array or can be iterated as a Node 4.X
 * or higher stream
 * @public
 */
class AggregationCursor extends abstract_cursor_1$4.AbstractCursor {
    /** @internal */
    constructor(client, namespace, pipeline = [], options = {}) {
        super(client, namespace, options);
        this[kPipeline] = pipeline;
        this[kOptions] = options;
    }
    get pipeline() {
        return this[kPipeline];
    }
    clone() {
        const clonedOptions = (0, utils_1$i.mergeOptions)({}, this[kOptions]);
        delete clonedOptions.session;
        return new AggregationCursor(this.client, this.namespace, this[kPipeline], {
            ...clonedOptions
        });
    }
    map(transform) {
        return super.map(transform);
    }
    /** @internal */
    _initialize(session, callback) {
        const aggregateOperation = new aggregate_1$1.AggregateOperation(this.namespace, this[kPipeline], {
            ...this[kOptions],
            ...this.cursorOptions,
            session
        });
        (0, execute_operation_1$4.executeOperation)(this.client, aggregateOperation, (err, response) => {
            if (err || response == null)
                return callback(err);
            // TODO: NODE-2882
            callback(undefined, { server: aggregateOperation.server, session, response });
        });
    }
    /** Execute the explain for the cursor */
    async explain(verbosity) {
        return (0, execute_operation_1$4.executeOperation)(this.client, new aggregate_1$1.AggregateOperation(this.namespace, this[kPipeline], {
            ...this[kOptions],
            ...this.cursorOptions,
            explain: verbosity ?? true
        }));
    }
    group($group) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $group });
        return this;
    }
    /** Add a limit stage to the aggregation pipeline */
    limit($limit) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $limit });
        return this;
    }
    /** Add a match stage to the aggregation pipeline */
    match($match) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $match });
        return this;
    }
    /** Add an out stage to the aggregation pipeline */
    out($out) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $out });
        return this;
    }
    /**
     * Add a project stage to the aggregation pipeline
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * By default chaining a projection to your cursor changes the returned type to the generic {@link Document} type.
     * You should specify a parameterized type to have assertions on your final results.
     *
     * @example
     * ```typescript
     * // Best way
     * const docs: AggregationCursor<{ a: number }> = cursor.project<{ a: number }>({ _id: 0, a: true });
     * // Flexible way
     * const docs: AggregationCursor<Document> = cursor.project({ _id: 0, a: true });
     * ```
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * **Note for Typescript Users:** adding a transform changes the return type of the iteration of this cursor,
     * it **does not** return a new instance of a cursor. This means when calling project,
     * you should always assign the result to a new variable in order to get a correctly typed cursor variable.
     * Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: AggregationCursor<{ a: number; b: string }> = coll.aggregate([]);
     * const projectCursor = cursor.project<{ a: number }>({ _id: 0, a: true });
     * const aPropOnlyArray: {a: number}[] = await projectCursor.toArray();
     *
     * // or always use chaining and save the final cursor
     *
     * const cursor = coll.aggregate().project<{ a: string }>({
     *   _id: 0,
     *   a: { $convert: { input: '$a', to: 'string' }
     * }});
     * ```
     */
    project($project) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $project });
        return this;
    }
    /** Add a lookup stage to the aggregation pipeline */
    lookup($lookup) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $lookup });
        return this;
    }
    /** Add a redact stage to the aggregation pipeline */
    redact($redact) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $redact });
        return this;
    }
    /** Add a skip stage to the aggregation pipeline */
    skip($skip) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $skip });
        return this;
    }
    /** Add a sort stage to the aggregation pipeline */
    sort($sort) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $sort });
        return this;
    }
    /** Add a unwind stage to the aggregation pipeline */
    unwind($unwind) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $unwind });
        return this;
    }
    /** Add a geoNear stage to the aggregation pipeline */
    geoNear($geoNear) {
        (0, abstract_cursor_1$4.assertUninitialized)(this);
        this[kPipeline].push({ $geoNear });
        return this;
    }
}
aggregation_cursor.AggregationCursor = AggregationCursor;

var find_cursor = {};

var count = {};

Object.defineProperty(count, "__esModule", { value: true });
count.CountOperation = void 0;
const command_1$8 = command;
const operation_1$c = operation;
/** @internal */
class CountOperation extends command_1$8.CommandOperation {
    constructor(namespace, filter, options) {
        super({ s: { namespace: namespace } }, options);
        this.options = options;
        this.collectionName = namespace.collection;
        this.query = filter;
    }
    executeCallback(server, session, callback) {
        const options = this.options;
        const cmd = {
            count: this.collectionName,
            query: this.query
        };
        if (typeof options.limit === 'number') {
            cmd.limit = options.limit;
        }
        if (typeof options.skip === 'number') {
            cmd.skip = options.skip;
        }
        if (options.hint != null) {
            cmd.hint = options.hint;
        }
        if (typeof options.maxTimeMS === 'number') {
            cmd.maxTimeMS = options.maxTimeMS;
        }
        super.executeCommand(server, session, cmd, (err, result) => {
            callback(err, result ? result.n : 0);
        });
    }
}
count.CountOperation = CountOperation;
(0, operation_1$c.defineAspects)(CountOperation, [operation_1$c.Aspect.READ_OPERATION, operation_1$c.Aspect.RETRYABLE]);

var find = {};

var sort = {};

Object.defineProperty(sort, "__esModule", { value: true });
sort.formatSort = void 0;
const error_1$r = error;
/** @internal */
function prepareDirection(direction = 1) {
    const value = `${direction}`.toLowerCase();
    if (isMeta(direction))
        return direction;
    switch (value) {
        case 'ascending':
        case 'asc':
        case '1':
            return 1;
        case 'descending':
        case 'desc':
        case '-1':
            return -1;
        default:
            throw new error_1$r.MongoInvalidArgumentError(`Invalid sort direction: ${JSON.stringify(direction)}`);
    }
}
/** @internal */
function isMeta(t) {
    return typeof t === 'object' && t != null && '$meta' in t && typeof t.$meta === 'string';
}
/** @internal */
function isPair(t) {
    if (Array.isArray(t) && t.length === 2) {
        try {
            prepareDirection(t[1]);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    return false;
}
function isDeep(t) {
    return Array.isArray(t) && Array.isArray(t[0]);
}
function isMap(t) {
    return t instanceof Map && t.size > 0;
}
/** @internal */
function pairToMap(v) {
    return new Map([[`${v[0]}`, prepareDirection([v[1]])]]);
}
/** @internal */
function deepToMap(t) {
    const sortEntries = t.map(([k, v]) => [`${k}`, prepareDirection(v)]);
    return new Map(sortEntries);
}
/** @internal */
function stringsToMap(t) {
    const sortEntries = t.map(key => [`${key}`, 1]);
    return new Map(sortEntries);
}
/** @internal */
function objectToMap(t) {
    const sortEntries = Object.entries(t).map(([k, v]) => [
        `${k}`,
        prepareDirection(v)
    ]);
    return new Map(sortEntries);
}
/** @internal */
function mapToMap(t) {
    const sortEntries = Array.from(t).map(([k, v]) => [
        `${k}`,
        prepareDirection(v)
    ]);
    return new Map(sortEntries);
}
/** converts a Sort type into a type that is valid for the server (SortForCmd) */
function formatSort(sort, direction) {
    if (sort == null)
        return undefined;
    if (typeof sort === 'string')
        return new Map([[sort, prepareDirection(direction)]]);
    if (typeof sort !== 'object') {
        throw new error_1$r.MongoInvalidArgumentError(`Invalid sort format: ${JSON.stringify(sort)} Sort must be a valid object`);
    }
    if (!Array.isArray(sort)) {
        return isMap(sort) ? mapToMap(sort) : Object.keys(sort).length ? objectToMap(sort) : undefined;
    }
    if (!sort.length)
        return undefined;
    if (isDeep(sort))
        return deepToMap(sort);
    if (isPair(sort))
        return pairToMap(sort);
    return stringsToMap(sort);
}
sort.formatSort = formatSort;

Object.defineProperty(find, "__esModule", { value: true });
find.FindOperation = void 0;
const error_1$q = error;
const read_concern_1 = read_concern;
const sort_1$1 = sort;
const utils_1$h = utils;
const command_1$7 = command;
const operation_1$b = operation;
/** @internal */
class FindOperation extends command_1$7.CommandOperation {
    constructor(collection, ns, filter = {}, options = {}) {
        super(collection, options);
        this.options = { ...options };
        delete this.options.writeConcern;
        this.ns = ns;
        if (typeof filter !== 'object' || Array.isArray(filter)) {
            throw new error_1$q.MongoInvalidArgumentError('Query filter must be a plain object or ObjectId');
        }
        // special case passing in an ObjectId as a filter
        this.filter = filter != null && filter._bsontype === 'ObjectId' ? { _id: filter } : filter;
    }
    executeCallback(server, session, callback) {
        this.server = server;
        const options = this.options;
        let findCommand = makeFindCommand(this.ns, this.filter, options);
        if (this.explain) {
            findCommand = (0, utils_1$h.decorateWithExplain)(findCommand, this.explain);
        }
        server.command(this.ns, findCommand, {
            ...this.options,
            ...this.bsonOptions,
            documentsReturnedIn: 'firstBatch',
            session
        }, callback);
    }
}
find.FindOperation = FindOperation;
function makeFindCommand(ns, filter, options) {
    const findCommand = {
        find: ns.collection,
        filter
    };
    if (options.sort) {
        findCommand.sort = (0, sort_1$1.formatSort)(options.sort);
    }
    if (options.projection) {
        let projection = options.projection;
        if (projection && Array.isArray(projection)) {
            projection = projection.length
                ? projection.reduce((result, field) => {
                    result[field] = 1;
                    return result;
                }, {})
                : { _id: 1 };
        }
        findCommand.projection = projection;
    }
    if (options.hint) {
        findCommand.hint = (0, utils_1$h.normalizeHintField)(options.hint);
    }
    if (typeof options.skip === 'number') {
        findCommand.skip = options.skip;
    }
    if (typeof options.limit === 'number') {
        if (options.limit < 0) {
            findCommand.limit = -options.limit;
            findCommand.singleBatch = true;
        }
        else {
            findCommand.limit = options.limit;
        }
    }
    if (typeof options.batchSize === 'number') {
        if (options.batchSize < 0) {
            if (options.limit &&
                options.limit !== 0 &&
                Math.abs(options.batchSize) < Math.abs(options.limit)) {
                findCommand.limit = -options.batchSize;
            }
            findCommand.singleBatch = true;
        }
        else {
            findCommand.batchSize = options.batchSize;
        }
    }
    if (typeof options.singleBatch === 'boolean') {
        findCommand.singleBatch = options.singleBatch;
    }
    // we check for undefined specifically here to allow falsy values
    // eslint-disable-next-line no-restricted-syntax
    if (options.comment !== undefined) {
        findCommand.comment = options.comment;
    }
    if (typeof options.maxTimeMS === 'number') {
        findCommand.maxTimeMS = options.maxTimeMS;
    }
    const readConcern = read_concern_1.ReadConcern.fromOptions(options);
    if (readConcern) {
        findCommand.readConcern = readConcern.toJSON();
    }
    if (options.max) {
        findCommand.max = options.max;
    }
    if (options.min) {
        findCommand.min = options.min;
    }
    if (typeof options.returnKey === 'boolean') {
        findCommand.returnKey = options.returnKey;
    }
    if (typeof options.showRecordId === 'boolean') {
        findCommand.showRecordId = options.showRecordId;
    }
    if (typeof options.tailable === 'boolean') {
        findCommand.tailable = options.tailable;
    }
    if (typeof options.oplogReplay === 'boolean') {
        findCommand.oplogReplay = options.oplogReplay;
    }
    if (typeof options.timeout === 'boolean') {
        findCommand.noCursorTimeout = !options.timeout;
    }
    else if (typeof options.noCursorTimeout === 'boolean') {
        findCommand.noCursorTimeout = options.noCursorTimeout;
    }
    if (typeof options.awaitData === 'boolean') {
        findCommand.awaitData = options.awaitData;
    }
    if (typeof options.allowPartialResults === 'boolean') {
        findCommand.allowPartialResults = options.allowPartialResults;
    }
    if (options.collation) {
        findCommand.collation = options.collation;
    }
    if (typeof options.allowDiskUse === 'boolean') {
        findCommand.allowDiskUse = options.allowDiskUse;
    }
    if (options.let) {
        findCommand.let = options.let;
    }
    return findCommand;
}
(0, operation_1$b.defineAspects)(FindOperation, [
    operation_1$b.Aspect.READ_OPERATION,
    operation_1$b.Aspect.RETRYABLE,
    operation_1$b.Aspect.EXPLAINABLE,
    operation_1$b.Aspect.CURSOR_CREATING
]);

Object.defineProperty(find_cursor, "__esModule", { value: true });
find_cursor.FindCursor = find_cursor.FLAGS = void 0;
const error_1$p = error;
const count_1 = count;
const execute_operation_1$3 = execute_operation;
const find_1 = find;
const sort_1 = sort;
const utils_1$g = utils;
const abstract_cursor_1$3 = abstract_cursor;
/** @internal */
const kFilter = Symbol('filter');
/** @internal */
const kNumReturned = Symbol('numReturned');
/** @internal */
const kBuiltOptions = Symbol('builtOptions');
/** @public Flags allowed for cursor */
find_cursor.FLAGS = [
    'tailable',
    'oplogReplay',
    'noCursorTimeout',
    'awaitData',
    'exhaust',
    'partial'
];
/** @public */
class FindCursor extends abstract_cursor_1$3.AbstractCursor {
    /** @internal */
    constructor(client, namespace, filter = {}, options = {}) {
        super(client, namespace, options);
        this[kFilter] = filter;
        this[kBuiltOptions] = options;
        if (options.sort != null) {
            this[kBuiltOptions].sort = (0, sort_1.formatSort)(options.sort);
        }
    }
    clone() {
        const clonedOptions = (0, utils_1$g.mergeOptions)({}, this[kBuiltOptions]);
        delete clonedOptions.session;
        return new FindCursor(this.client, this.namespace, this[kFilter], {
            ...clonedOptions
        });
    }
    map(transform) {
        return super.map(transform);
    }
    /** @internal */
    _initialize(session, callback) {
        const findOperation = new find_1.FindOperation(undefined, this.namespace, this[kFilter], {
            ...this[kBuiltOptions],
            ...this.cursorOptions,
            session
        });
        (0, execute_operation_1$3.executeOperation)(this.client, findOperation, (err, response) => {
            if (err || response == null)
                return callback(err);
            // TODO: We only need this for legacy queries that do not support `limit`, maybe
            //       the value should only be saved in those cases.
            if (response.cursor) {
                this[kNumReturned] = response.cursor.firstBatch.length;
            }
            else {
                this[kNumReturned] = response.documents ? response.documents.length : 0;
            }
            // TODO: NODE-2882
            callback(undefined, { server: findOperation.server, session, response });
        });
    }
    /** @internal */
    _getMore(batchSize, callback) {
        // NOTE: this is to support client provided limits in pre-command servers
        const numReturned = this[kNumReturned];
        if (numReturned) {
            const limit = this[kBuiltOptions].limit;
            batchSize =
                limit && limit > 0 && numReturned + batchSize > limit ? limit - numReturned : batchSize;
            if (batchSize <= 0) {
                this.close().finally(() => callback());
                return;
            }
        }
        super._getMore(batchSize, (err, response) => {
            if (err)
                return callback(err);
            // TODO: wrap this in some logic to prevent it from happening if we don't need this support
            if (response) {
                this[kNumReturned] = this[kNumReturned] + response.cursor.nextBatch.length;
            }
            callback(undefined, response);
        });
    }
    /**
     * Get the count of documents for this cursor
     * @deprecated Use `collection.estimatedDocumentCount` or `collection.countDocuments` instead
     */
    async count(options) {
        (0, utils_1$g.emitWarningOnce)('cursor.count is deprecated and will be removed in the next major version, please use `collection.estimatedDocumentCount` or `collection.countDocuments` instead ');
        if (typeof options === 'boolean') {
            throw new error_1$p.MongoInvalidArgumentError('Invalid first parameter to count');
        }
        return (0, execute_operation_1$3.executeOperation)(this.client, new count_1.CountOperation(this.namespace, this[kFilter], {
            ...this[kBuiltOptions],
            ...this.cursorOptions,
            ...options
        }));
    }
    /** Execute the explain for the cursor */
    async explain(verbosity) {
        return (0, execute_operation_1$3.executeOperation)(this.client, new find_1.FindOperation(undefined, this.namespace, this[kFilter], {
            ...this[kBuiltOptions],
            ...this.cursorOptions,
            explain: verbosity ?? true
        }));
    }
    /** Set the cursor query */
    filter(filter) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kFilter] = filter;
        return this;
    }
    /**
     * Set the cursor hint
     *
     * @param hint - If specified, then the query system will only consider plans using the hinted index.
     */
    hint(hint) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].hint = hint;
        return this;
    }
    /**
     * Set the cursor min
     *
     * @param min - Specify a $min value to specify the inclusive lower bound for a specific index in order to constrain the results of find(). The $min specifies the lower bound for all keys of a specific index in order.
     */
    min(min) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].min = min;
        return this;
    }
    /**
     * Set the cursor max
     *
     * @param max - Specify a $max value to specify the exclusive upper bound for a specific index in order to constrain the results of find(). The $max specifies the upper bound for all keys of a specific index in order.
     */
    max(max) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].max = max;
        return this;
    }
    /**
     * Set the cursor returnKey.
     * If set to true, modifies the cursor to only return the index field or fields for the results of the query, rather than documents.
     * If set to true and the query does not use an index to perform the read operation, the returned documents will not contain any fields.
     *
     * @param value - the returnKey value.
     */
    returnKey(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].returnKey = value;
        return this;
    }
    /**
     * Modifies the output of a query by adding a field $recordId to matching documents. $recordId is the internal key which uniquely identifies a document in a collection.
     *
     * @param value - The $showDiskLoc option has now been deprecated and replaced with the showRecordId field. $showDiskLoc will still be accepted for OP_QUERY stye find.
     */
    showRecordId(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].showRecordId = value;
        return this;
    }
    /**
     * Add a query modifier to the cursor query
     *
     * @param name - The query modifier (must start with $, such as $orderby etc)
     * @param value - The modifier value.
     */
    addQueryModifier(name, value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        if (name[0] !== '$') {
            throw new error_1$p.MongoInvalidArgumentError(`${name} is not a valid query modifier`);
        }
        // Strip of the $
        const field = name.substr(1);
        // NOTE: consider some TS magic for this
        switch (field) {
            case 'comment':
                this[kBuiltOptions].comment = value;
                break;
            case 'explain':
                this[kBuiltOptions].explain = value;
                break;
            case 'hint':
                this[kBuiltOptions].hint = value;
                break;
            case 'max':
                this[kBuiltOptions].max = value;
                break;
            case 'maxTimeMS':
                this[kBuiltOptions].maxTimeMS = value;
                break;
            case 'min':
                this[kBuiltOptions].min = value;
                break;
            case 'orderby':
                this[kBuiltOptions].sort = (0, sort_1.formatSort)(value);
                break;
            case 'query':
                this[kFilter] = value;
                break;
            case 'returnKey':
                this[kBuiltOptions].returnKey = value;
                break;
            case 'showDiskLoc':
                this[kBuiltOptions].showRecordId = value;
                break;
            default:
                throw new error_1$p.MongoInvalidArgumentError(`Invalid query modifier: ${name}`);
        }
        return this;
    }
    /**
     * Add a comment to the cursor query allowing for tracking the comment in the log.
     *
     * @param value - The comment attached to this query.
     */
    comment(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].comment = value;
        return this;
    }
    /**
     * Set a maxAwaitTimeMS on a tailing cursor query to allow to customize the timeout value for the option awaitData (Only supported on MongoDB 3.2 or higher, ignored otherwise)
     *
     * @param value - Number of milliseconds to wait before aborting the tailed query.
     */
    maxAwaitTimeMS(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        if (typeof value !== 'number') {
            throw new error_1$p.MongoInvalidArgumentError('Argument for maxAwaitTimeMS must be a number');
        }
        this[kBuiltOptions].maxAwaitTimeMS = value;
        return this;
    }
    /**
     * Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)
     *
     * @param value - Number of milliseconds to wait before aborting the query.
     */
    maxTimeMS(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        if (typeof value !== 'number') {
            throw new error_1$p.MongoInvalidArgumentError('Argument for maxTimeMS must be a number');
        }
        this[kBuiltOptions].maxTimeMS = value;
        return this;
    }
    /**
     * Add a project stage to the aggregation pipeline
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * By default chaining a projection to your cursor changes the returned type to the generic
     * {@link Document} type.
     * You should specify a parameterized type to have assertions on your final results.
     *
     * @example
     * ```typescript
     * // Best way
     * const docs: FindCursor<{ a: number }> = cursor.project<{ a: number }>({ _id: 0, a: true });
     * // Flexible way
     * const docs: FindCursor<Document> = cursor.project({ _id: 0, a: true });
     * ```
     *
     * @remarks
     *
     * **Note for Typescript Users:** adding a transform changes the return type of the iteration of this cursor,
     * it **does not** return a new instance of a cursor. This means when calling project,
     * you should always assign the result to a new variable in order to get a correctly typed cursor variable.
     * Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: FindCursor<{ a: number; b: string }> = coll.find();
     * const projectCursor = cursor.project<{ a: number }>({ _id: 0, a: true });
     * const aPropOnlyArray: {a: number}[] = await projectCursor.toArray();
     *
     * // or always use chaining and save the final cursor
     *
     * const cursor = coll.find().project<{ a: string }>({
     *   _id: 0,
     *   a: { $convert: { input: '$a', to: 'string' }
     * }});
     * ```
     */
    project(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].projection = value;
        return this;
    }
    /**
     * Sets the sort order of the cursor query.
     *
     * @param sort - The key or keys set for the sort.
     * @param direction - The direction of the sorting (1 or -1).
     */
    sort(sort, direction) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        if (this[kBuiltOptions].tailable) {
            throw new error_1$p.MongoTailableCursorError('Tailable cursor does not support sorting');
        }
        this[kBuiltOptions].sort = (0, sort_1.formatSort)(sort, direction);
        return this;
    }
    /**
     * Allows disk use for blocking sort operations exceeding 100MB memory. (MongoDB 3.2 or higher)
     *
     * @remarks
     * {@link https://www.mongodb.com/docs/manual/reference/command/find/#find-cmd-allowdiskuse | find command allowDiskUse documentation}
     */
    allowDiskUse(allow = true) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        if (!this[kBuiltOptions].sort) {
            throw new error_1$p.MongoInvalidArgumentError('Option "allowDiskUse" requires a sort specification');
        }
        // As of 6.0 the default is true. This allows users to get back to the old behavior.
        if (!allow) {
            this[kBuiltOptions].allowDiskUse = false;
            return this;
        }
        this[kBuiltOptions].allowDiskUse = true;
        return this;
    }
    /**
     * Set the collation options for the cursor.
     *
     * @param value - The cursor collation options (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     */
    collation(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        this[kBuiltOptions].collation = value;
        return this;
    }
    /**
     * Set the limit for the cursor.
     *
     * @param value - The limit for the cursor query.
     */
    limit(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        if (this[kBuiltOptions].tailable) {
            throw new error_1$p.MongoTailableCursorError('Tailable cursor does not support limit');
        }
        if (typeof value !== 'number') {
            throw new error_1$p.MongoInvalidArgumentError('Operation "limit" requires an integer');
        }
        this[kBuiltOptions].limit = value;
        return this;
    }
    /**
     * Set the skip for the cursor.
     *
     * @param value - The skip for the cursor query.
     */
    skip(value) {
        (0, abstract_cursor_1$3.assertUninitialized)(this);
        if (this[kBuiltOptions].tailable) {
            throw new error_1$p.MongoTailableCursorError('Tailable cursor does not support skip');
        }
        if (typeof value !== 'number') {
            throw new error_1$p.MongoInvalidArgumentError('Operation "skip" requires an integer');
        }
        this[kBuiltOptions].skip = value;
        return this;
    }
}
find_cursor.FindCursor = FindCursor;

var list_indexes_cursor = {};

var indexes = {};

Object.defineProperty(indexes, "__esModule", { value: true });
indexes.IndexInformationOperation = indexes.IndexExistsOperation = indexes.ListIndexesOperation = indexes.DropIndexesOperation = indexes.DropIndexOperation = indexes.EnsureIndexOperation = indexes.CreateIndexOperation = indexes.CreateIndexesOperation = indexes.IndexesOperation = void 0;
const error_1$o = error;
const read_preference_1$1 = read_preference;
const utils_1$f = utils;
const command_1$6 = command;
const common_functions_1 = common_functions;
const operation_1$a = operation;
const VALID_INDEX_OPTIONS = new Set([
    'background',
    'unique',
    'name',
    'partialFilterExpression',
    'sparse',
    'hidden',
    'expireAfterSeconds',
    'storageEngine',
    'collation',
    'version',
    // text indexes
    'weights',
    'default_language',
    'language_override',
    'textIndexVersion',
    // 2d-sphere indexes
    '2dsphereIndexVersion',
    // 2d indexes
    'bits',
    'min',
    'max',
    // geoHaystack Indexes
    'bucketSize',
    // wildcard indexes
    'wildcardProjection'
]);
function isIndexDirection(x) {
    return (typeof x === 'number' || x === '2d' || x === '2dsphere' || x === 'text' || x === 'geoHaystack');
}
function isSingleIndexTuple(t) {
    return Array.isArray(t) && t.length === 2 && isIndexDirection(t[1]);
}
function makeIndexSpec(indexSpec, options) {
    const key = new Map();
    const indexSpecs = !Array.isArray(indexSpec) || isSingleIndexTuple(indexSpec) ? [indexSpec] : indexSpec;
    // Iterate through array and handle different types
    for (const spec of indexSpecs) {
        if (typeof spec === 'string') {
            key.set(spec, 1);
        }
        else if (Array.isArray(spec)) {
            key.set(spec[0], spec[1] ?? 1);
        }
        else if (spec instanceof Map) {
            for (const [property, value] of spec) {
                key.set(property, value);
            }
        }
        else if ((0, utils_1$f.isObject)(spec)) {
            for (const [property, value] of Object.entries(spec)) {
                key.set(property, value);
            }
        }
    }
    return { ...options, key };
}
/** @internal */
class IndexesOperation extends operation_1$a.AbstractCallbackOperation {
    constructor(collection, options) {
        super(options);
        this.options = options;
        this.collection = collection;
    }
    executeCallback(server, session, callback) {
        const coll = this.collection;
        const options = this.options;
        (0, common_functions_1.indexInformation)(coll.s.db, coll.collectionName, { full: true, ...options, readPreference: this.readPreference, session }, callback);
    }
}
indexes.IndexesOperation = IndexesOperation;
/** @internal */
class CreateIndexesOperation extends command_1$6.CommandOperation {
    constructor(parent, collectionName, indexes, options) {
        super(parent, options);
        this.options = options ?? {};
        this.collectionName = collectionName;
        this.indexes = indexes.map(userIndex => {
            // Ensure the key is a Map to preserve index key ordering
            const key = userIndex.key instanceof Map ? userIndex.key : new Map(Object.entries(userIndex.key));
            const name = userIndex.name != null ? userIndex.name : Array.from(key).flat().join('_');
            const validIndexOptions = Object.fromEntries(Object.entries({ ...userIndex }).filter(([optionName]) => VALID_INDEX_OPTIONS.has(optionName)));
            return {
                ...validIndexOptions,
                name,
                key
            };
        });
    }
    executeCallback(server, session, callback) {
        const options = this.options;
        const indexes = this.indexes;
        const serverWireVersion = (0, utils_1$f.maxWireVersion)(server);
        const cmd = { createIndexes: this.collectionName, indexes };
        if (options.commitQuorum != null) {
            if (serverWireVersion < 9) {
                callback(new error_1$o.MongoCompatibilityError('Option `commitQuorum` for `createIndexes` not supported on servers < 4.4'));
                return;
            }
            cmd.commitQuorum = options.commitQuorum;
        }
        // collation is set on each index, it should not be defined at the root
        this.options.collation = undefined;
        super.executeCommand(server, session, cmd, err => {
            if (err) {
                callback(err);
                return;
            }
            const indexNames = indexes.map(index => index.name || '');
            callback(undefined, indexNames);
        });
    }
}
indexes.CreateIndexesOperation = CreateIndexesOperation;
/** @internal */
class CreateIndexOperation extends CreateIndexesOperation {
    constructor(parent, collectionName, indexSpec, options) {
        super(parent, collectionName, [makeIndexSpec(indexSpec, options)], options);
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, indexNames) => {
            if (err || !indexNames)
                return callback(err);
            return callback(undefined, indexNames[0]);
        });
    }
}
indexes.CreateIndexOperation = CreateIndexOperation;
/** @internal */
class EnsureIndexOperation extends CreateIndexOperation {
    constructor(db, collectionName, indexSpec, options) {
        super(db, collectionName, indexSpec, options);
        this.readPreference = read_preference_1$1.ReadPreference.primary;
        this.db = db;
        this.collectionName = collectionName;
    }
    executeCallback(server, session, callback) {
        const indexName = this.indexes[0].name;
        const cursor = this.db.collection(this.collectionName).listIndexes({ session });
        cursor.toArray().then(indexes => {
            indexes = Array.isArray(indexes) ? indexes : [indexes];
            if (indexes.some(index => index.name === indexName)) {
                callback(undefined, indexName);
                return;
            }
            super.executeCallback(server, session, callback);
        }, error => {
            if (error instanceof error_1$o.MongoError && error.code === error_1$o.MONGODB_ERROR_CODES.NamespaceNotFound) {
                // ignore "NamespaceNotFound" errors
                return super.executeCallback(server, session, callback);
            }
            return callback(error);
        });
    }
}
indexes.EnsureIndexOperation = EnsureIndexOperation;
/** @internal */
class DropIndexOperation extends command_1$6.CommandOperation {
    constructor(collection, indexName, options) {
        super(collection, options);
        this.options = options ?? {};
        this.collection = collection;
        this.indexName = indexName;
    }
    executeCallback(server, session, callback) {
        const cmd = { dropIndexes: this.collection.collectionName, index: this.indexName };
        super.executeCommand(server, session, cmd, callback);
    }
}
indexes.DropIndexOperation = DropIndexOperation;
/** @internal */
class DropIndexesOperation extends DropIndexOperation {
    constructor(collection, options) {
        super(collection, '*', options);
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, err => {
            if (err)
                return callback(err, false);
            callback(undefined, true);
        });
    }
}
indexes.DropIndexesOperation = DropIndexesOperation;
/** @internal */
class ListIndexesOperation extends command_1$6.CommandOperation {
    constructor(collection, options) {
        super(collection, options);
        this.options = { ...options };
        delete this.options.writeConcern;
        this.collectionNamespace = collection.s.namespace;
    }
    executeCallback(server, session, callback) {
        const serverWireVersion = (0, utils_1$f.maxWireVersion)(server);
        const cursor = this.options.batchSize ? { batchSize: this.options.batchSize } : {};
        const command = { listIndexes: this.collectionNamespace.collection, cursor };
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (serverWireVersion >= 9 && this.options.comment !== undefined) {
            command.comment = this.options.comment;
        }
        super.executeCommand(server, session, command, callback);
    }
}
indexes.ListIndexesOperation = ListIndexesOperation;
/** @internal */
class IndexExistsOperation extends operation_1$a.AbstractCallbackOperation {
    constructor(collection, indexes, options) {
        super(options);
        this.options = options;
        this.collection = collection;
        this.indexes = indexes;
    }
    executeCallback(server, session, callback) {
        const coll = this.collection;
        const indexes = this.indexes;
        (0, common_functions_1.indexInformation)(coll.s.db, coll.collectionName, { ...this.options, readPreference: this.readPreference, session }, (err, indexInformation) => {
            // If we have an error return
            if (err != null)
                return callback(err);
            // Let's check for the index names
            if (!Array.isArray(indexes))
                return callback(undefined, indexInformation[indexes] != null);
            // Check in list of indexes
            for (let i = 0; i < indexes.length; i++) {
                if (indexInformation[indexes[i]] == null) {
                    return callback(undefined, false);
                }
            }
            // All keys found return true
            return callback(undefined, true);
        });
    }
}
indexes.IndexExistsOperation = IndexExistsOperation;
/** @internal */
class IndexInformationOperation extends operation_1$a.AbstractCallbackOperation {
    constructor(db, name, options) {
        super(options);
        this.options = options ?? {};
        this.db = db;
        this.name = name;
    }
    executeCallback(server, session, callback) {
        const db = this.db;
        const name = this.name;
        (0, common_functions_1.indexInformation)(db, name, { ...this.options, readPreference: this.readPreference, session }, callback);
    }
}
indexes.IndexInformationOperation = IndexInformationOperation;
(0, operation_1$a.defineAspects)(ListIndexesOperation, [
    operation_1$a.Aspect.READ_OPERATION,
    operation_1$a.Aspect.RETRYABLE,
    operation_1$a.Aspect.CURSOR_CREATING
]);
(0, operation_1$a.defineAspects)(CreateIndexesOperation, [operation_1$a.Aspect.WRITE_OPERATION]);
(0, operation_1$a.defineAspects)(CreateIndexOperation, [operation_1$a.Aspect.WRITE_OPERATION]);
(0, operation_1$a.defineAspects)(EnsureIndexOperation, [operation_1$a.Aspect.WRITE_OPERATION]);
(0, operation_1$a.defineAspects)(DropIndexOperation, [operation_1$a.Aspect.WRITE_OPERATION]);
(0, operation_1$a.defineAspects)(DropIndexesOperation, [operation_1$a.Aspect.WRITE_OPERATION]);

Object.defineProperty(list_indexes_cursor, "__esModule", { value: true });
list_indexes_cursor.ListIndexesCursor = void 0;
const execute_operation_1$2 = execute_operation;
const indexes_1 = indexes;
const abstract_cursor_1$2 = abstract_cursor;
/** @public */
class ListIndexesCursor extends abstract_cursor_1$2.AbstractCursor {
    constructor(collection, options) {
        super(collection.client, collection.s.namespace, options);
        this.parent = collection;
        this.options = options;
    }
    clone() {
        return new ListIndexesCursor(this.parent, {
            ...this.options,
            ...this.cursorOptions
        });
    }
    /** @internal */
    _initialize(session, callback) {
        const operation = new indexes_1.ListIndexesOperation(this.parent, {
            ...this.cursorOptions,
            ...this.options,
            session
        });
        (0, execute_operation_1$2.executeOperation)(this.parent.client, operation, (err, response) => {
            if (err || response == null)
                return callback(err);
            // TODO: NODE-2882
            callback(undefined, { server: operation.server, session, response });
        });
    }
}
list_indexes_cursor.ListIndexesCursor = ListIndexesCursor;

var list_search_indexes_cursor = {};

Object.defineProperty(list_search_indexes_cursor, "__esModule", { value: true });
list_search_indexes_cursor.ListSearchIndexesCursor = void 0;
const aggregation_cursor_1 = aggregation_cursor;
/** @public */
class ListSearchIndexesCursor extends aggregation_cursor_1.AggregationCursor {
    /** @internal */
    constructor({ fullNamespace: ns, client }, name, options = {}) {
        const pipeline = name == null ? [{ $listSearchIndexes: {} }] : [{ $listSearchIndexes: { name } }];
        super(client, ns, pipeline, options);
    }
}
list_search_indexes_cursor.ListSearchIndexesCursor = ListSearchIndexesCursor;

var count_documents = {};

Object.defineProperty(count_documents, "__esModule", { value: true });
count_documents.CountDocumentsOperation = void 0;
const aggregate_1 = aggregate;
/** @internal */
class CountDocumentsOperation extends aggregate_1.AggregateOperation {
    constructor(collection, query, options) {
        const pipeline = [];
        pipeline.push({ $match: query });
        if (typeof options.skip === 'number') {
            pipeline.push({ $skip: options.skip });
        }
        if (typeof options.limit === 'number') {
            pipeline.push({ $limit: options.limit });
        }
        pipeline.push({ $group: { _id: 1, n: { $sum: 1 } } });
        super(collection.s.namespace, pipeline, options);
    }
    executeCallback(server, session, callback) {
        super.executeCallback(server, session, (err, result) => {
            if (err || !result) {
                callback(err);
                return;
            }
            // NOTE: We're avoiding creating a cursor here to reduce the callstack.
            const response = result;
            if (response.cursor == null || response.cursor.firstBatch == null) {
                callback(undefined, 0);
                return;
            }
            const docs = response.cursor.firstBatch;
            callback(undefined, docs.length ? docs[0].n : 0);
        });
    }
}
count_documents.CountDocumentsOperation = CountDocumentsOperation;

var distinct = {};

Object.defineProperty(distinct, "__esModule", { value: true });
distinct.DistinctOperation = void 0;
const utils_1$e = utils;
const command_1$5 = command;
const operation_1$9 = operation;
/**
 * Return a list of distinct values for the given key across a collection.
 * @internal
 */
class DistinctOperation extends command_1$5.CommandOperation {
    /**
     * Construct a Distinct operation.
     *
     * @param collection - Collection instance.
     * @param key - Field of the document to find distinct values for.
     * @param query - The query for filtering the set of documents to which we apply the distinct filter.
     * @param options - Optional settings. See Collection.prototype.distinct for a list of options.
     */
    constructor(collection, key, query, options) {
        super(collection, options);
        this.options = options ?? {};
        this.collection = collection;
        this.key = key;
        this.query = query;
    }
    executeCallback(server, session, callback) {
        const coll = this.collection;
        const key = this.key;
        const query = this.query;
        const options = this.options;
        // Distinct command
        const cmd = {
            distinct: coll.collectionName,
            key: key,
            query: query
        };
        // Add maxTimeMS if defined
        if (typeof options.maxTimeMS === 'number') {
            cmd.maxTimeMS = options.maxTimeMS;
        }
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (typeof options.comment !== 'undefined') {
            cmd.comment = options.comment;
        }
        // Do we have a readConcern specified
        (0, utils_1$e.decorateWithReadConcern)(cmd, coll, options);
        // Have we specified collation
        try {
            (0, utils_1$e.decorateWithCollation)(cmd, coll, options);
        }
        catch (err) {
            return callback(err);
        }
        super.executeCommand(server, session, cmd, (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            callback(undefined, this.explain ? result : result.values);
        });
    }
}
distinct.DistinctOperation = DistinctOperation;
(0, operation_1$9.defineAspects)(DistinctOperation, [operation_1$9.Aspect.READ_OPERATION, operation_1$9.Aspect.RETRYABLE, operation_1$9.Aspect.EXPLAINABLE]);

var drop$1 = {};

Object.defineProperty(drop$1, "__esModule", { value: true });
drop$1.DropDatabaseOperation = drop$1.DropCollectionOperation = void 0;
const error_1$n = error;
const command_1$4 = command;
const operation_1$8 = operation;
/** @internal */
class DropCollectionOperation extends command_1$4.CommandOperation {
    constructor(db, name, options = {}) {
        super(db, options);
        this.db = db;
        this.options = options;
        this.name = name;
    }
    executeCallback(server, session, callback) {
        (async () => {
            const db = this.db;
            const options = this.options;
            const name = this.name;
            const encryptedFieldsMap = db.client.options.autoEncryption?.encryptedFieldsMap;
            let encryptedFields = options.encryptedFields ?? encryptedFieldsMap?.[`${db.databaseName}.${name}`];
            if (!encryptedFields && encryptedFieldsMap) {
                // If the MongoClient was configured with an encryptedFieldsMap,
                // and no encryptedFields config was available in it or explicitly
                // passed as an argument, the spec tells us to look one up using
                // listCollections().
                const listCollectionsResult = await db
                    .listCollections({ name }, { nameOnly: false })
                    .toArray();
                encryptedFields = listCollectionsResult?.[0]?.options?.encryptedFields;
            }
            if (encryptedFields) {
                const escCollection = encryptedFields.escCollection || `enxcol_.${name}.esc`;
                const ecocCollection = encryptedFields.ecocCollection || `enxcol_.${name}.ecoc`;
                for (const collectionName of [escCollection, ecocCollection]) {
                    // Drop auxilliary collections, ignoring potential NamespaceNotFound errors.
                    const dropOp = new DropCollectionOperation(db, collectionName);
                    try {
                        await dropOp.executeWithoutEncryptedFieldsCheck(server, session);
                    }
                    catch (err) {
                        if (!(err instanceof error_1$n.MongoServerError) ||
                            err.code !== error_1$n.MONGODB_ERROR_CODES.NamespaceNotFound) {
                            throw err;
                        }
                    }
                }
            }
            return this.executeWithoutEncryptedFieldsCheck(server, session);
        })().then(result => callback(undefined, result), err => callback(err));
    }
    executeWithoutEncryptedFieldsCheck(server, session) {
        return new Promise((resolve, reject) => {
            super.executeCommand(server, session, { drop: this.name }, (err, result) => {
                if (err)
                    return reject(err);
                resolve(!!result.ok);
            });
        });
    }
}
drop$1.DropCollectionOperation = DropCollectionOperation;
/** @internal */
class DropDatabaseOperation extends command_1$4.CommandOperation {
    constructor(db, options) {
        super(db, options);
        this.options = options;
    }
    executeCallback(server, session, callback) {
        super.executeCommand(server, session, { dropDatabase: 1 }, (err, result) => {
            if (err)
                return callback(err);
            if (result.ok)
                return callback(undefined, true);
            callback(undefined, false);
        });
    }
}
drop$1.DropDatabaseOperation = DropDatabaseOperation;
(0, operation_1$8.defineAspects)(DropCollectionOperation, [operation_1$8.Aspect.WRITE_OPERATION]);
(0, operation_1$8.defineAspects)(DropDatabaseOperation, [operation_1$8.Aspect.WRITE_OPERATION]);

var estimated_document_count = {};

Object.defineProperty(estimated_document_count, "__esModule", { value: true });
estimated_document_count.EstimatedDocumentCountOperation = void 0;
const command_1$3 = command;
const operation_1$7 = operation;
/** @internal */
class EstimatedDocumentCountOperation extends command_1$3.CommandOperation {
    constructor(collection, options = {}) {
        super(collection, options);
        this.options = options;
        this.collectionName = collection.collectionName;
    }
    executeCallback(server, session, callback) {
        const cmd = { count: this.collectionName };
        if (typeof this.options.maxTimeMS === 'number') {
            cmd.maxTimeMS = this.options.maxTimeMS;
        }
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (this.options.comment !== undefined) {
            cmd.comment = this.options.comment;
        }
        super.executeCommand(server, session, cmd, (err, response) => {
            if (err) {
                callback(err);
                return;
            }
            callback(undefined, response?.n || 0);
        });
    }
}
estimated_document_count.EstimatedDocumentCountOperation = EstimatedDocumentCountOperation;
(0, operation_1$7.defineAspects)(EstimatedDocumentCountOperation, [
    operation_1$7.Aspect.READ_OPERATION,
    operation_1$7.Aspect.RETRYABLE,
    operation_1$7.Aspect.CURSOR_CREATING
]);

var find_and_modify = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FindOneAndUpdateOperation = exports.FindOneAndReplaceOperation = exports.FindOneAndDeleteOperation = exports.ReturnDocument = void 0;
	const error_1 = error;
	const read_preference_1 = read_preference;
	const sort_1 = sort;
	const utils_1 = utils;
	const command_1 = command;
	const operation_1 = operation;
	/** @public */
	exports.ReturnDocument = Object.freeze({
	    BEFORE: 'before',
	    AFTER: 'after'
	});
	function configureFindAndModifyCmdBaseUpdateOpts(cmdBase, options) {
	    cmdBase.new = options.returnDocument === exports.ReturnDocument.AFTER;
	    cmdBase.upsert = options.upsert === true;
	    if (options.bypassDocumentValidation === true) {
	        cmdBase.bypassDocumentValidation = options.bypassDocumentValidation;
	    }
	    return cmdBase;
	}
	/** @internal */
	class FindAndModifyOperation extends command_1.CommandOperation {
	    constructor(collection, query, options) {
	        super(collection, options);
	        this.options = options ?? {};
	        this.cmdBase = {
	            remove: false,
	            new: false,
	            upsert: false
	        };
	        options.includeResultMetadata ?? (options.includeResultMetadata = true);
	        const sort = (0, sort_1.formatSort)(options.sort);
	        if (sort) {
	            this.cmdBase.sort = sort;
	        }
	        if (options.projection) {
	            this.cmdBase.fields = options.projection;
	        }
	        if (options.maxTimeMS) {
	            this.cmdBase.maxTimeMS = options.maxTimeMS;
	        }
	        // Decorate the findAndModify command with the write Concern
	        if (options.writeConcern) {
	            this.cmdBase.writeConcern = options.writeConcern;
	        }
	        if (options.let) {
	            this.cmdBase.let = options.let;
	        }
	        // we check for undefined specifically here to allow falsy values
	        // eslint-disable-next-line no-restricted-syntax
	        if (options.comment !== undefined) {
	            this.cmdBase.comment = options.comment;
	        }
	        // force primary read preference
	        this.readPreference = read_preference_1.ReadPreference.primary;
	        this.collection = collection;
	        this.query = query;
	    }
	    executeCallback(server, session, callback) {
	        const coll = this.collection;
	        const query = this.query;
	        const options = { ...this.options, ...this.bsonOptions };
	        // Create findAndModify command object
	        const cmd = {
	            findAndModify: coll.collectionName,
	            query: query,
	            ...this.cmdBase
	        };
	        // Have we specified collation
	        try {
	            (0, utils_1.decorateWithCollation)(cmd, coll, options);
	        }
	        catch (err) {
	            return callback(err);
	        }
	        if (options.hint) {
	            // TODO: once this method becomes a CommandOperation we will have the server
	            // in place to check.
	            const unacknowledgedWrite = this.writeConcern?.w === 0;
	            if (unacknowledgedWrite || (0, utils_1.maxWireVersion)(server) < 8) {
	                callback(new error_1.MongoCompatibilityError('The current topology does not support a hint on findAndModify commands'));
	                return;
	            }
	            cmd.hint = options.hint;
	        }
	        // Execute the command
	        super.executeCommand(server, session, cmd, (err, result) => {
	            if (err)
	                return callback(err);
	            return callback(undefined, options.includeResultMetadata ? result : result.value ?? null);
	        });
	    }
	}
	/** @internal */
	class FindOneAndDeleteOperation extends FindAndModifyOperation {
	    constructor(collection, filter, options) {
	        // Basic validation
	        if (filter == null || typeof filter !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Argument "filter" must be an object');
	        }
	        super(collection, filter, options);
	        this.cmdBase.remove = true;
	    }
	}
	exports.FindOneAndDeleteOperation = FindOneAndDeleteOperation;
	/** @internal */
	class FindOneAndReplaceOperation extends FindAndModifyOperation {
	    constructor(collection, filter, replacement, options) {
	        if (filter == null || typeof filter !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Argument "filter" must be an object');
	        }
	        if (replacement == null || typeof replacement !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Argument "replacement" must be an object');
	        }
	        if ((0, utils_1.hasAtomicOperators)(replacement)) {
	            throw new error_1.MongoInvalidArgumentError('Replacement document must not contain atomic operators');
	        }
	        super(collection, filter, options);
	        this.cmdBase.update = replacement;
	        configureFindAndModifyCmdBaseUpdateOpts(this.cmdBase, options);
	    }
	}
	exports.FindOneAndReplaceOperation = FindOneAndReplaceOperation;
	/** @internal */
	class FindOneAndUpdateOperation extends FindAndModifyOperation {
	    constructor(collection, filter, update, options) {
	        if (filter == null || typeof filter !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Argument "filter" must be an object');
	        }
	        if (update == null || typeof update !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Argument "update" must be an object');
	        }
	        if (!(0, utils_1.hasAtomicOperators)(update)) {
	            throw new error_1.MongoInvalidArgumentError('Update document requires atomic operators');
	        }
	        super(collection, filter, options);
	        this.cmdBase.update = update;
	        configureFindAndModifyCmdBaseUpdateOpts(this.cmdBase, options);
	        if (options.arrayFilters) {
	            this.cmdBase.arrayFilters = options.arrayFilters;
	        }
	    }
	}
	exports.FindOneAndUpdateOperation = FindOneAndUpdateOperation;
	(0, operation_1.defineAspects)(FindAndModifyOperation, [
	    operation_1.Aspect.WRITE_OPERATION,
	    operation_1.Aspect.RETRYABLE,
	    operation_1.Aspect.EXPLAINABLE
	]);
	
} (find_and_modify));

var is_capped = {};

Object.defineProperty(is_capped, "__esModule", { value: true });
is_capped.IsCappedOperation = void 0;
const error_1$m = error;
const operation_1$6 = operation;
/** @internal */
class IsCappedOperation extends operation_1$6.AbstractCallbackOperation {
    constructor(collection, options) {
        super(options);
        this.options = options;
        this.collection = collection;
    }
    executeCallback(server, session, callback) {
        const coll = this.collection;
        coll.s.db
            .listCollections({ name: coll.collectionName }, { ...this.options, nameOnly: false, readPreference: this.readPreference, session })
            .toArray()
            .then(collections => {
            if (collections.length === 0) {
                // TODO(NODE-3485)
                return callback(new error_1$m.MongoAPIError(`collection ${coll.namespace} not found`));
            }
            callback(undefined, !!collections[0].options?.capped);
        }, error => callback(error));
    }
}
is_capped.IsCappedOperation = IsCappedOperation;

var options_operation = {};

Object.defineProperty(options_operation, "__esModule", { value: true });
options_operation.OptionsOperation = void 0;
const error_1$l = error;
const operation_1$5 = operation;
/** @internal */
class OptionsOperation extends operation_1$5.AbstractCallbackOperation {
    constructor(collection, options) {
        super(options);
        this.options = options;
        this.collection = collection;
    }
    executeCallback(server, session, callback) {
        const coll = this.collection;
        coll.s.db
            .listCollections({ name: coll.collectionName }, { ...this.options, nameOnly: false, readPreference: this.readPreference, session })
            .toArray()
            .then(collections => {
            if (collections.length === 0) {
                // TODO(NODE-3485)
                return callback(new error_1$l.MongoAPIError(`collection ${coll.namespace} not found`));
            }
            callback(undefined, collections[0].options);
        }, error => callback(error));
    }
}
options_operation.OptionsOperation = OptionsOperation;

var rename = {};

var hasRequiredRename;

function requireRename () {
	if (hasRequiredRename) return rename;
	hasRequiredRename = 1;
	Object.defineProperty(rename, "__esModule", { value: true });
	rename.RenameOperation = void 0;
	const collection_1 = requireCollection();
	const error_1 = error;
	const utils_1 = utils;
	const operation_1 = operation;
	const run_command_1 = run_command;
	/** @internal */
	class RenameOperation extends run_command_1.RunAdminCommandOperation {
	    constructor(collection, newName, options) {
	        // Check the collection name
	        (0, utils_1.checkCollectionName)(newName);
	        // Build the command
	        const renameCollection = collection.namespace;
	        const toCollection = collection.s.namespace.withCollection(newName).toString();
	        const dropTarget = typeof options.dropTarget === 'boolean' ? options.dropTarget : false;
	        const cmd = { renameCollection: renameCollection, to: toCollection, dropTarget: dropTarget };
	        super(collection, cmd, options);
	        this.options = options;
	        this.collection = collection;
	        this.newName = newName;
	    }
	    executeCallback(server, session, callback) {
	        const coll = this.collection;
	        super.executeCallback(server, session, (err, doc) => {
	            if (err)
	                return callback(err);
	            // We have an error
	            if (doc?.errmsg) {
	                return callback(new error_1.MongoServerError(doc));
	            }
	            let newColl;
	            try {
	                newColl = new collection_1.Collection(coll.s.db, this.newName, coll.s.options);
	            }
	            catch (err) {
	                return callback(err);
	            }
	            return callback(undefined, newColl);
	        });
	    }
	}
	rename.RenameOperation = RenameOperation;
	(0, operation_1.defineAspects)(RenameOperation, [operation_1.Aspect.WRITE_OPERATION]);
	
	return rename;
}

var create = {};

Object.defineProperty(create, "__esModule", { value: true });
create.CreateSearchIndexesOperation = void 0;
const operation_1$4 = operation;
/** @internal */
class CreateSearchIndexesOperation extends operation_1$4.AbstractCallbackOperation {
    constructor(collection, descriptions) {
        super();
        this.collection = collection;
        this.descriptions = descriptions;
    }
    executeCallback(server, session, callback) {
        const namespace = this.collection.fullNamespace;
        const command = {
            createSearchIndexes: namespace.collection,
            indexes: this.descriptions
        };
        server.command(namespace, command, { session }, (err, res) => {
            if (err || !res) {
                callback(err);
                return;
            }
            const indexesCreated = res?.indexesCreated ?? [];
            callback(undefined, indexesCreated.map(({ name }) => name));
        });
    }
}
create.CreateSearchIndexesOperation = CreateSearchIndexesOperation;

var drop = {};

Object.defineProperty(drop, "__esModule", { value: true });
drop.DropSearchIndexOperation = void 0;
const operation_1$3 = operation;
/** @internal */
class DropSearchIndexOperation extends operation_1$3.AbstractCallbackOperation {
    constructor(collection, name) {
        super();
        this.collection = collection;
        this.name = name;
    }
    executeCallback(server, session, callback) {
        const namespace = this.collection.fullNamespace;
        const command = {
            dropSearchIndex: namespace.collection
        };
        if (typeof this.name === 'string') {
            command.name = this.name;
        }
        server.command(namespace, command, { session }, err => {
            if (err) {
                callback(err);
                return;
            }
            callback();
        });
    }
}
drop.DropSearchIndexOperation = DropSearchIndexOperation;

var update = {};

Object.defineProperty(update, "__esModule", { value: true });
update.UpdateSearchIndexOperation = void 0;
const operation_1$2 = operation;
/** @internal */
class UpdateSearchIndexOperation extends operation_1$2.AbstractCallbackOperation {
    constructor(collection, name, definition) {
        super();
        this.collection = collection;
        this.name = name;
        this.definition = definition;
    }
    executeCallback(server, session, callback) {
        const namespace = this.collection.fullNamespace;
        const command = {
            updateSearchIndex: namespace.collection,
            name: this.name,
            definition: this.definition
        };
        server.command(namespace, command, { session }, err => {
            if (err) {
                callback(err);
                return;
            }
            callback();
        });
    }
}
update.UpdateSearchIndexOperation = UpdateSearchIndexOperation;

var stats = {};

Object.defineProperty(stats, "__esModule", { value: true });
stats.DbStatsOperation = stats.CollStatsOperation = void 0;
const command_1$2 = command;
const operation_1$1 = operation;
/**
 * Get all the collection statistics.
 * @internal
 */
class CollStatsOperation extends command_1$2.CommandOperation {
    /**
     * Construct a Stats operation.
     *
     * @param collection - Collection instance
     * @param options - Optional settings. See Collection.prototype.stats for a list of options.
     */
    constructor(collection, options) {
        super(collection, options);
        this.options = options ?? {};
        this.collectionName = collection.collectionName;
    }
    executeCallback(server, session, callback) {
        const command = { collStats: this.collectionName };
        if (this.options.scale != null) {
            command.scale = this.options.scale;
        }
        super.executeCommand(server, session, command, callback);
    }
}
stats.CollStatsOperation = CollStatsOperation;
/** @internal */
class DbStatsOperation extends command_1$2.CommandOperation {
    constructor(db, options) {
        super(db, options);
        this.options = options;
    }
    executeCallback(server, session, callback) {
        const command = { dbStats: true };
        if (this.options.scale != null) {
            command.scale = this.options.scale;
        }
        super.executeCommand(server, session, command, callback);
    }
}
stats.DbStatsOperation = DbStatsOperation;
(0, operation_1$1.defineAspects)(CollStatsOperation, [operation_1$1.Aspect.READ_OPERATION]);
(0, operation_1$1.defineAspects)(DbStatsOperation, [operation_1$1.Aspect.READ_OPERATION]);

var hasRequiredCollection;

function requireCollection () {
	if (hasRequiredCollection) return collection;
	hasRequiredCollection = 1;
	Object.defineProperty(collection, "__esModule", { value: true });
	collection.Collection = void 0;
	const bson_1 = bson;
	const ordered_1 = ordered;
	const unordered_1 = unordered;
	const change_stream_1 = requireChange_stream();
	const aggregation_cursor_1 = aggregation_cursor;
	const find_cursor_1 = find_cursor;
	const list_indexes_cursor_1 = list_indexes_cursor;
	const list_search_indexes_cursor_1 = list_search_indexes_cursor;
	const error_1 = error;
	const bulk_write_1 = bulk_write;
	const count_1 = count;
	const count_documents_1 = count_documents;
	const delete_1 = _delete;
	const distinct_1 = distinct;
	const drop_1 = drop$1;
	const estimated_document_count_1 = estimated_document_count;
	const execute_operation_1 = execute_operation;
	const find_and_modify_1 = find_and_modify;
	const indexes_1 = indexes;
	const insert_1 = insert;
	const is_capped_1 = is_capped;
	const options_operation_1 = options_operation;
	const rename_1 = requireRename();
	const create_1 = create;
	const drop_2 = drop;
	const update_1 = update;
	const stats_1 = stats;
	const update_2 = update$1;
	const read_concern_1 = read_concern;
	const read_preference_1 = read_preference;
	const utils_1 = utils;
	const write_concern_1 = write_concern;
	/**
	 * The **Collection** class is an internal class that embodies a MongoDB collection
	 * allowing for insert/find/update/delete and other command operation on that MongoDB collection.
	 *
	 * **COLLECTION Cannot directly be instantiated**
	 * @public
	 *
	 * @example
	 * ```ts
	 * import { MongoClient } from 'mongodb';
	 *
	 * interface Pet {
	 *   name: string;
	 *   kind: 'dog' | 'cat' | 'fish';
	 * }
	 *
	 * const client = new MongoClient('mongodb://localhost:27017');
	 * const pets = client.db().collection<Pet>('pets');
	 *
	 * const petCursor = pets.find();
	 *
	 * for await (const pet of petCursor) {
	 *   console.log(`${pet.name} is a ${pet.kind}!`);
	 * }
	 * ```
	 */
	class Collection {
	    /**
	     * Create a new Collection instance
	     * @internal
	     */
	    constructor(db, name, options) {
	        (0, utils_1.checkCollectionName)(name);
	        // Internal state
	        this.s = {
	            db,
	            options,
	            namespace: new utils_1.MongoDBCollectionNamespace(db.databaseName, name),
	            pkFactory: db.options?.pkFactory ?? utils_1.DEFAULT_PK_FACTORY,
	            readPreference: read_preference_1.ReadPreference.fromOptions(options),
	            bsonOptions: (0, bson_1.resolveBSONOptions)(options, db),
	            readConcern: read_concern_1.ReadConcern.fromOptions(options),
	            writeConcern: write_concern_1.WriteConcern.fromOptions(options)
	        };
	        this.client = db.client;
	    }
	    /**
	     * The name of the database this collection belongs to
	     */
	    get dbName() {
	        return this.s.namespace.db;
	    }
	    /**
	     * The name of this collection
	     */
	    get collectionName() {
	        return this.s.namespace.collection;
	    }
	    /**
	     * The namespace of this collection, in the format `${this.dbName}.${this.collectionName}`
	     */
	    get namespace() {
	        return this.fullNamespace.toString();
	    }
	    /**
	     *  @internal
	     *
	     * The `MongoDBNamespace` for the collection.
	     */
	    get fullNamespace() {
	        return this.s.namespace;
	    }
	    /**
	     * The current readConcern of the collection. If not explicitly defined for
	     * this collection, will be inherited from the parent DB
	     */
	    get readConcern() {
	        if (this.s.readConcern == null) {
	            return this.s.db.readConcern;
	        }
	        return this.s.readConcern;
	    }
	    /**
	     * The current readPreference of the collection. If not explicitly defined for
	     * this collection, will be inherited from the parent DB
	     */
	    get readPreference() {
	        if (this.s.readPreference == null) {
	            return this.s.db.readPreference;
	        }
	        return this.s.readPreference;
	    }
	    get bsonOptions() {
	        return this.s.bsonOptions;
	    }
	    /**
	     * The current writeConcern of the collection. If not explicitly defined for
	     * this collection, will be inherited from the parent DB
	     */
	    get writeConcern() {
	        if (this.s.writeConcern == null) {
	            return this.s.db.writeConcern;
	        }
	        return this.s.writeConcern;
	    }
	    /** The current index hint for the collection */
	    get hint() {
	        return this.s.collectionHint;
	    }
	    set hint(v) {
	        this.s.collectionHint = (0, utils_1.normalizeHintField)(v);
	    }
	    /**
	     * Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
	     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
	     * can be overridden by setting the **forceServerObjectId** flag.
	     *
	     * @param doc - The document to insert
	     * @param options - Optional settings for the command
	     */
	    async insertOne(doc, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new insert_1.InsertOneOperation(this, doc, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
	     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
	     * can be overridden by setting the **forceServerObjectId** flag.
	     *
	     * @param docs - The documents to insert
	     * @param options - Optional settings for the command
	     */
	    async insertMany(docs, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new insert_1.InsertManyOperation(this, docs, (0, utils_1.resolveOptions)(this, options ?? { ordered: true })));
	    }
	    /**
	     * Perform a bulkWrite operation without a fluent API
	     *
	     * Legal operation types are
	     * - `insertOne`
	     * - `replaceOne`
	     * - `updateOne`
	     * - `updateMany`
	     * - `deleteOne`
	     * - `deleteMany`
	     *
	     * If documents passed in do not contain the **_id** field,
	     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
	     * can be overridden by setting the **forceServerObjectId** flag.
	     *
	     * @param operations - Bulk operations to perform
	     * @param options - Optional settings for the command
	     * @throws MongoDriverError if operations is not an array
	     */
	    async bulkWrite(operations, options) {
	        if (!Array.isArray(operations)) {
	            throw new error_1.MongoInvalidArgumentError('Argument "operations" must be an array of documents');
	        }
	        return (0, execute_operation_1.executeOperation)(this.client, new bulk_write_1.BulkWriteOperation(this, operations, (0, utils_1.resolveOptions)(this, options ?? { ordered: true })));
	    }
	    /**
	     * Update a single document in a collection
	     *
	     * @param filter - The filter used to select the document to update
	     * @param update - The update operations to be applied to the document
	     * @param options - Optional settings for the command
	     */
	    async updateOne(filter, update, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new update_2.UpdateOneOperation(this, filter, update, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Replace a document in a collection with another document
	     *
	     * @param filter - The filter used to select the document to replace
	     * @param replacement - The Document that replaces the matching document
	     * @param options - Optional settings for the command
	     */
	    async replaceOne(filter, replacement, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new update_2.ReplaceOneOperation(this, filter, replacement, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Update multiple documents in a collection
	     *
	     * @param filter - The filter used to select the documents to update
	     * @param update - The update operations to be applied to the documents
	     * @param options - Optional settings for the command
	     */
	    async updateMany(filter, update, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new update_2.UpdateManyOperation(this, filter, update, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Delete a document from a collection
	     *
	     * @param filter - The filter used to select the document to remove
	     * @param options - Optional settings for the command
	     */
	    async deleteOne(filter = {}, options = {}) {
	        return (0, execute_operation_1.executeOperation)(this.client, new delete_1.DeleteOneOperation(this, filter, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Delete multiple documents from a collection
	     *
	     * @param filter - The filter used to select the documents to remove
	     * @param options - Optional settings for the command
	     */
	    async deleteMany(filter = {}, options = {}) {
	        return (0, execute_operation_1.executeOperation)(this.client, new delete_1.DeleteManyOperation(this, filter, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Rename the collection.
	     *
	     * @remarks
	     * This operation does not inherit options from the Db or MongoClient.
	     *
	     * @param newName - New name of of the collection.
	     * @param options - Optional settings for the command
	     */
	    async rename(newName, options) {
	        // Intentionally, we do not inherit options from parent for this operation.
	        return (0, execute_operation_1.executeOperation)(this.client, new rename_1.RenameOperation(this, newName, {
	            ...options,
	            readPreference: read_preference_1.ReadPreference.PRIMARY
	        }));
	    }
	    /**
	     * Drop the collection from the database, removing it permanently. New accesses will create a new collection.
	     *
	     * @param options - Optional settings for the command
	     */
	    async drop(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new drop_1.DropCollectionOperation(this.s.db, this.collectionName, options));
	    }
	    async findOne(filter = {}, options = {}) {
	        return this.find(filter, options).limit(-1).batchSize(1).next();
	    }
	    find(filter = {}, options = {}) {
	        return new find_cursor_1.FindCursor(this.client, this.s.namespace, filter, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * Returns the options of the collection.
	     *
	     * @param options - Optional settings for the command
	     */
	    async options(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new options_operation_1.OptionsOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Returns if the collection is a capped collection
	     *
	     * @param options - Optional settings for the command
	     */
	    async isCapped(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new is_capped_1.IsCappedOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Creates an index on the db and collection collection.
	     *
	     * @param indexSpec - The field name or index specification to create an index for
	     * @param options - Optional settings for the command
	     *
	     * @example
	     * ```ts
	     * const collection = client.db('foo').collection('bar');
	     *
	     * await collection.createIndex({ a: 1, b: -1 });
	     *
	     * // Alternate syntax for { c: 1, d: -1 } that ensures order of indexes
	     * await collection.createIndex([ [c, 1], [d, -1] ]);
	     *
	     * // Equivalent to { e: 1 }
	     * await collection.createIndex('e');
	     *
	     * // Equivalent to { f: 1, g: 1 }
	     * await collection.createIndex(['f', 'g'])
	     *
	     * // Equivalent to { h: 1, i: -1 }
	     * await collection.createIndex([ { h: 1 }, { i: -1 } ]);
	     *
	     * // Equivalent to { j: 1, k: -1, l: 2d }
	     * await collection.createIndex(['j', ['k', -1], { l: '2d' }])
	     * ```
	     */
	    async createIndex(indexSpec, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.CreateIndexOperation(this, this.collectionName, indexSpec, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Creates multiple indexes in the collection, this method is only supported for
	     * MongoDB 2.6 or higher. Earlier version of MongoDB will throw a command not supported
	     * error.
	     *
	     * **Note**: Unlike {@link Collection#createIndex| createIndex}, this function takes in raw index specifications.
	     * Index specifications are defined {@link https://www.mongodb.com/docs/manual/reference/command/createIndexes/| here}.
	     *
	     * @param indexSpecs - An array of index specifications to be created
	     * @param options - Optional settings for the command
	     *
	     * @example
	     * ```ts
	     * const collection = client.db('foo').collection('bar');
	     * await collection.createIndexes([
	     *   // Simple index on field fizz
	     *   {
	     *     key: { fizz: 1 },
	     *   }
	     *   // wildcard index
	     *   {
	     *     key: { '$**': 1 }
	     *   },
	     *   // named index on darmok and jalad
	     *   {
	     *     key: { darmok: 1, jalad: -1 }
	     *     name: 'tanagra'
	     *   }
	     * ]);
	     * ```
	     */
	    async createIndexes(indexSpecs, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.CreateIndexesOperation(this, this.collectionName, indexSpecs, (0, utils_1.resolveOptions)(this, { ...options, maxTimeMS: undefined })));
	    }
	    /**
	     * Drops an index from this collection.
	     *
	     * @param indexName - Name of the index to drop.
	     * @param options - Optional settings for the command
	     */
	    async dropIndex(indexName, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.DropIndexOperation(this, indexName, {
	            ...(0, utils_1.resolveOptions)(this, options),
	            readPreference: read_preference_1.ReadPreference.primary
	        }));
	    }
	    /**
	     * Drops all indexes from this collection.
	     *
	     * @param options - Optional settings for the command
	     */
	    async dropIndexes(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.DropIndexesOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Get the list of all indexes information for the collection.
	     *
	     * @param options - Optional settings for the command
	     */
	    listIndexes(options) {
	        return new list_indexes_cursor_1.ListIndexesCursor(this, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * Checks if one or more indexes exist on the collection, fails on first non-existing index
	     *
	     * @param indexes - One or more index names to check.
	     * @param options - Optional settings for the command
	     */
	    async indexExists(indexes, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.IndexExistsOperation(this, indexes, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Retrieves this collections index info.
	     *
	     * @param options - Optional settings for the command
	     */
	    async indexInformation(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.IndexInformationOperation(this.s.db, this.collectionName, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Gets an estimate of the count of documents in a collection using collection metadata.
	     * This will always run a count command on all server versions.
	     *
	     * due to an oversight in versions 5.0.0-5.0.8 of MongoDB, the count command,
	     * which estimatedDocumentCount uses in its implementation, was not included in v1 of
	     * the Stable API, and so users of the Stable API with estimatedDocumentCount are
	     * recommended to upgrade their server version to 5.0.9+ or set apiStrict: false to avoid
	     * encountering errors.
	     *
	     * @see {@link https://www.mongodb.com/docs/manual/reference/command/count/#behavior|Count: Behavior}
	     * @param options - Optional settings for the command
	     */
	    async estimatedDocumentCount(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new estimated_document_count_1.EstimatedDocumentCountOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Gets the number of documents matching the filter.
	     * For a fast count of the total documents in a collection see {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
	     * **Note**: When migrating from {@link Collection#count| count} to {@link Collection#countDocuments| countDocuments}
	     * the following query operators must be replaced:
	     *
	     * | Operator | Replacement |
	     * | -------- | ----------- |
	     * | `$where`   | [`$expr`][1] |
	     * | `$near`    | [`$geoWithin`][2] with [`$center`][3] |
	     * | `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |
	     *
	     * [1]: https://www.mongodb.com/docs/manual/reference/operator/query/expr/
	     * [2]: https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
	     * [3]: https://www.mongodb.com/docs/manual/reference/operator/query/center/#op._S_center
	     * [4]: https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#op._S_centerSphere
	     *
	     * @param filter - The filter for the count
	     * @param options - Optional settings for the command
	     *
	     * @see https://www.mongodb.com/docs/manual/reference/operator/query/expr/
	     * @see https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
	     * @see https://www.mongodb.com/docs/manual/reference/operator/query/center/#op._S_center
	     * @see https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#op._S_centerSphere
	     */
	    async countDocuments(filter = {}, options = {}) {
	        return (0, execute_operation_1.executeOperation)(this.client, new count_documents_1.CountDocumentsOperation(this, filter, (0, utils_1.resolveOptions)(this, options)));
	    }
	    async distinct(key, filter = {}, options = {}) {
	        return (0, execute_operation_1.executeOperation)(this.client, new distinct_1.DistinctOperation(this, key, filter, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Retrieve all the indexes on the collection.
	     *
	     * @param options - Optional settings for the command
	     */
	    async indexes(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.IndexesOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Get all the collection statistics.
	     *
	     * @deprecated the `collStats` operation will be removed in the next major release.  Please
	     * use an aggregation pipeline with the [`$collStats`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/collStats/) stage instead
	     *
	     * @param options - Optional settings for the command
	     */
	    async stats(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new stats_1.CollStatsOperation(this, options));
	    }
	    async findOneAndDelete(filter, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new find_and_modify_1.FindOneAndDeleteOperation(this, filter, (0, utils_1.resolveOptions)(this, options)));
	    }
	    async findOneAndReplace(filter, replacement, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new find_and_modify_1.FindOneAndReplaceOperation(this, filter, replacement, (0, utils_1.resolveOptions)(this, options)));
	    }
	    async findOneAndUpdate(filter, update, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new find_and_modify_1.FindOneAndUpdateOperation(this, filter, update, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Execute an aggregation framework pipeline against the collection, needs MongoDB \>= 2.2
	     *
	     * @param pipeline - An array of aggregation pipelines to execute
	     * @param options - Optional settings for the command
	     */
	    aggregate(pipeline = [], options) {
	        if (!Array.isArray(pipeline)) {
	            throw new error_1.MongoInvalidArgumentError('Argument "pipeline" must be an array of aggregation stages');
	        }
	        return new aggregation_cursor_1.AggregationCursor(this.client, this.s.namespace, pipeline, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.
	     *
	     * @remarks
	     * watch() accepts two generic arguments for distinct use cases:
	     * - The first is to override the schema that may be defined for this specific collection
	     * - The second is to override the shape of the change stream document entirely, if it is not provided the type will default to ChangeStreamDocument of the first argument
	     * @example
	     * By just providing the first argument I can type the change to be `ChangeStreamDocument<{ _id: number }>`
	     * ```ts
	     * collection.watch<{ _id: number }>()
	     *   .on('change', change => console.log(change._id.toFixed(4)));
	     * ```
	     *
	     * @example
	     * Passing a second argument provides a way to reflect the type changes caused by an advanced pipeline.
	     * Here, we are using a pipeline to have MongoDB filter for insert changes only and add a comment.
	     * No need start from scratch on the ChangeStreamInsertDocument type!
	     * By using an intersection we can save time and ensure defaults remain the same type!
	     * ```ts
	     * collection
	     *   .watch<Schema, ChangeStreamInsertDocument<Schema> & { comment: string }>([
	     *     { $addFields: { comment: 'big changes' } },
	     *     { $match: { operationType: 'insert' } }
	     *   ])
	     *   .on('change', change => {
	     *     change.comment.startsWith('big');
	     *     change.operationType === 'insert';
	     *     // No need to narrow in code because the generics did that for us!
	     *     expectType<Schema>(change.fullDocument);
	     *   });
	     * ```
	     *
	     * @param pipeline - An array of {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
	     * @param options - Optional settings for the command
	     * @typeParam TLocal - Type of the data being detected by the change stream
	     * @typeParam TChange - Type of the whole change stream document emitted
	     */
	    watch(pipeline = [], options = {}) {
	        // Allow optionally not specifying a pipeline
	        if (!Array.isArray(pipeline)) {
	            options = pipeline;
	            pipeline = [];
	        }
	        return new change_stream_1.ChangeStream(this, pipeline, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * Initiate an Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
	     *
	     * @throws MongoNotConnectedError
	     * @remarks
	     * **NOTE:** MongoClient must be connected prior to calling this method due to a known limitation in this legacy implementation.
	     * However, `collection.bulkWrite()` provides an equivalent API that does not require prior connecting.
	     */
	    initializeUnorderedBulkOp(options) {
	        return new unordered_1.UnorderedBulkOperation(this, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * Initiate an In order bulk write operation. Operations will be serially executed in the order they are added, creating a new operation for each switch in types.
	     *
	     * @throws MongoNotConnectedError
	     * @remarks
	     * **NOTE:** MongoClient must be connected prior to calling this method due to a known limitation in this legacy implementation.
	     * However, `collection.bulkWrite()` provides an equivalent API that does not require prior connecting.
	     */
	    initializeOrderedBulkOp(options) {
	        return new ordered_1.OrderedBulkOperation(this, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * An estimated count of matching documents in the db to a filter.
	     *
	     * **NOTE:** This method has been deprecated, since it does not provide an accurate count of the documents
	     * in a collection. To obtain an accurate count of documents in the collection, use {@link Collection#countDocuments| countDocuments}.
	     * To obtain an estimated count of all documents in the collection, use {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
	     *
	     * @deprecated use {@link Collection#countDocuments| countDocuments} or {@link Collection#estimatedDocumentCount| estimatedDocumentCount} instead
	     *
	     * @param filter - The filter for the count.
	     * @param options - Optional settings for the command
	     */
	    async count(filter = {}, options = {}) {
	        return (0, execute_operation_1.executeOperation)(this.client, new count_1.CountOperation(this.fullNamespace, filter, (0, utils_1.resolveOptions)(this, options)));
	    }
	    listSearchIndexes(indexNameOrOptions, options) {
	        options =
	            typeof indexNameOrOptions === 'object' ? indexNameOrOptions : options == null ? {} : options;
	        const indexName = indexNameOrOptions == null
	            ? null
	            : typeof indexNameOrOptions === 'object'
	                ? null
	                : indexNameOrOptions;
	        return new list_search_indexes_cursor_1.ListSearchIndexesCursor(this, indexName, options);
	    }
	    /**
	     * Creates a single search index for the collection.
	     *
	     * @param description - The index description for the new search index.
	     * @returns A promise that resolves to the name of the new search index.
	     *
	     * @remarks Only available when used against a 7.0+ Atlas cluster.
	     */
	    async createSearchIndex(description) {
	        const [index] = await this.createSearchIndexes([description]);
	        return index;
	    }
	    /**
	     * Creates multiple search indexes for the current collection.
	     *
	     * @param descriptions - An array of `SearchIndexDescription`s for the new search indexes.
	     * @returns A promise that resolves to an array of the newly created search index names.
	     *
	     * @remarks Only available when used against a 7.0+ Atlas cluster.
	     * @returns
	     */
	    async createSearchIndexes(descriptions) {
	        return (0, execute_operation_1.executeOperation)(this.client, new create_1.CreateSearchIndexesOperation(this, descriptions));
	    }
	    /**
	     * Deletes a search index by index name.
	     *
	     * @param name - The name of the search index to be deleted.
	     *
	     * @remarks Only available when used against a 7.0+ Atlas cluster.
	     */
	    async dropSearchIndex(name) {
	        return (0, execute_operation_1.executeOperation)(this.client, new drop_2.DropSearchIndexOperation(this, name));
	    }
	    /**
	     * Updates a search index by replacing the existing index definition with the provided definition.
	     *
	     * @param name - The name of the search index to update.
	     * @param definition - The new search index definition.
	     *
	     * @remarks Only available when used against a 7.0+ Atlas cluster.
	     */
	    async updateSearchIndex(name, definition) {
	        return (0, execute_operation_1.executeOperation)(this.client, new update_1.UpdateSearchIndexOperation(this, name, definition));
	    }
	}
	collection.Collection = Collection;
	
	return collection;
}

var change_stream_cursor = {};

var hasRequiredChange_stream_cursor;

function requireChange_stream_cursor () {
	if (hasRequiredChange_stream_cursor) return change_stream_cursor;
	hasRequiredChange_stream_cursor = 1;
	Object.defineProperty(change_stream_cursor, "__esModule", { value: true });
	change_stream_cursor.ChangeStreamCursor = void 0;
	const change_stream_1 = requireChange_stream();
	const constants_1 = constants;
	const aggregate_1 = aggregate;
	const execute_operation_1 = execute_operation;
	const utils_1 = utils;
	const abstract_cursor_1 = abstract_cursor;
	/** @internal */
	class ChangeStreamCursor extends abstract_cursor_1.AbstractCursor {
	    constructor(client, namespace, pipeline = [], options = {}) {
	        super(client, namespace, options);
	        this.pipeline = pipeline;
	        this.options = options;
	        this._resumeToken = null;
	        this.startAtOperationTime = options.startAtOperationTime;
	        if (options.startAfter) {
	            this.resumeToken = options.startAfter;
	        }
	        else if (options.resumeAfter) {
	            this.resumeToken = options.resumeAfter;
	        }
	    }
	    set resumeToken(token) {
	        this._resumeToken = token;
	        this.emit(change_stream_1.ChangeStream.RESUME_TOKEN_CHANGED, token);
	    }
	    get resumeToken() {
	        return this._resumeToken;
	    }
	    get resumeOptions() {
	        const options = {
	            ...this.options
	        };
	        for (const key of ['resumeAfter', 'startAfter', 'startAtOperationTime']) {
	            delete options[key];
	        }
	        if (this.resumeToken != null) {
	            if (this.options.startAfter && !this.hasReceived) {
	                options.startAfter = this.resumeToken;
	            }
	            else {
	                options.resumeAfter = this.resumeToken;
	            }
	        }
	        else if (this.startAtOperationTime != null && (0, utils_1.maxWireVersion)(this.server) >= 7) {
	            options.startAtOperationTime = this.startAtOperationTime;
	        }
	        return options;
	    }
	    cacheResumeToken(resumeToken) {
	        if (this.bufferedCount() === 0 && this.postBatchResumeToken) {
	            this.resumeToken = this.postBatchResumeToken;
	        }
	        else {
	            this.resumeToken = resumeToken;
	        }
	        this.hasReceived = true;
	    }
	    _processBatch(response) {
	        const cursor = response.cursor;
	        if (cursor.postBatchResumeToken) {
	            this.postBatchResumeToken = response.cursor.postBatchResumeToken;
	            const batch = 'firstBatch' in response.cursor ? response.cursor.firstBatch : response.cursor.nextBatch;
	            if (batch.length === 0) {
	                this.resumeToken = cursor.postBatchResumeToken;
	            }
	        }
	    }
	    clone() {
	        return new ChangeStreamCursor(this.client, this.namespace, this.pipeline, {
	            ...this.cursorOptions
	        });
	    }
	    _initialize(session, callback) {
	        const aggregateOperation = new aggregate_1.AggregateOperation(this.namespace, this.pipeline, {
	            ...this.cursorOptions,
	            ...this.options,
	            session
	        });
	        (0, execute_operation_1.executeOperation)(session.client, aggregateOperation, (err, response) => {
	            if (err || response == null) {
	                return callback(err);
	            }
	            const server = aggregateOperation.server;
	            this.maxWireVersion = (0, utils_1.maxWireVersion)(server);
	            if (this.startAtOperationTime == null &&
	                this.resumeAfter == null &&
	                this.startAfter == null &&
	                this.maxWireVersion >= 7) {
	                this.startAtOperationTime = response.operationTime;
	            }
	            this._processBatch(response);
	            this.emit(constants_1.INIT, response);
	            this.emit(constants_1.RESPONSE);
	            // TODO: NODE-2882
	            callback(undefined, { server, session, response });
	        });
	    }
	    _getMore(batchSize, callback) {
	        super._getMore(batchSize, (err, response) => {
	            if (err) {
	                return callback(err);
	            }
	            this.maxWireVersion = (0, utils_1.maxWireVersion)(this.server);
	            this._processBatch(response);
	            this.emit(change_stream_1.ChangeStream.MORE, response);
	            this.emit(change_stream_1.ChangeStream.RESPONSE);
	            callback(err, response);
	        });
	    }
	}
	change_stream_cursor.ChangeStreamCursor = ChangeStreamCursor;
	
	return change_stream_cursor;
}

var db = {};

var list_collections_cursor = {};

var list_collections = {};

Object.defineProperty(list_collections, "__esModule", { value: true });
list_collections.ListCollectionsOperation = void 0;
const utils_1$d = utils;
const command_1$1 = command;
const operation_1 = operation;
/** @internal */
class ListCollectionsOperation extends command_1$1.CommandOperation {
    constructor(db, filter, options) {
        super(db, options);
        this.options = { ...options };
        delete this.options.writeConcern;
        this.db = db;
        this.filter = filter;
        this.nameOnly = !!this.options.nameOnly;
        this.authorizedCollections = !!this.options.authorizedCollections;
        if (typeof this.options.batchSize === 'number') {
            this.batchSize = this.options.batchSize;
        }
    }
    executeCallback(server, session, callback) {
        return super.executeCommand(server, session, this.generateCommand((0, utils_1$d.maxWireVersion)(server)), callback);
    }
    /* This is here for the purpose of unit testing the final command that gets sent. */
    generateCommand(wireVersion) {
        const command = {
            listCollections: 1,
            filter: this.filter,
            cursor: this.batchSize ? { batchSize: this.batchSize } : {},
            nameOnly: this.nameOnly,
            authorizedCollections: this.authorizedCollections
        };
        // we check for undefined specifically here to allow falsy values
        // eslint-disable-next-line no-restricted-syntax
        if (wireVersion >= 9 && this.options.comment !== undefined) {
            command.comment = this.options.comment;
        }
        return command;
    }
}
list_collections.ListCollectionsOperation = ListCollectionsOperation;
(0, operation_1.defineAspects)(ListCollectionsOperation, [
    operation_1.Aspect.READ_OPERATION,
    operation_1.Aspect.RETRYABLE,
    operation_1.Aspect.CURSOR_CREATING
]);

Object.defineProperty(list_collections_cursor, "__esModule", { value: true });
list_collections_cursor.ListCollectionsCursor = void 0;
const execute_operation_1$1 = execute_operation;
const list_collections_1 = list_collections;
const abstract_cursor_1$1 = abstract_cursor;
/** @public */
class ListCollectionsCursor extends abstract_cursor_1$1.AbstractCursor {
    constructor(db, filter, options) {
        super(db.client, db.s.namespace, options);
        this.parent = db;
        this.filter = filter;
        this.options = options;
    }
    clone() {
        return new ListCollectionsCursor(this.parent, this.filter, {
            ...this.options,
            ...this.cursorOptions
        });
    }
    /** @internal */
    _initialize(session, callback) {
        const operation = new list_collections_1.ListCollectionsOperation(this.parent, this.filter, {
            ...this.cursorOptions,
            ...this.options,
            session
        });
        (0, execute_operation_1$1.executeOperation)(this.parent.client, operation, (err, response) => {
            if (err || response == null)
                return callback(err);
            // TODO: NODE-2882
            callback(undefined, { server: operation.server, session, response });
        });
    }
}
list_collections_cursor.ListCollectionsCursor = ListCollectionsCursor;

var run_command_cursor = {};

Object.defineProperty(run_command_cursor, "__esModule", { value: true });
run_command_cursor.RunCommandCursor = void 0;
const error_1$k = error;
const execute_operation_1 = execute_operation;
const get_more_1 = get_more;
const run_command_1 = run_command;
const utils_1$c = utils;
const abstract_cursor_1 = abstract_cursor;
/** @public */
class RunCommandCursor extends abstract_cursor_1.AbstractCursor {
    /**
     * Controls the `getMore.comment` field
     * @param comment - any BSON value
     */
    setComment(comment) {
        this.getMoreOptions.comment = comment;
        return this;
    }
    /**
     * Controls the `getMore.maxTimeMS` field. Only valid when cursor is tailable await
     * @param maxTimeMS - the number of milliseconds to wait for new data
     */
    setMaxTimeMS(maxTimeMS) {
        this.getMoreOptions.maxAwaitTimeMS = maxTimeMS;
        return this;
    }
    /**
     * Controls the `getMore.batchSize` field
     * @param maxTimeMS - the number documents to return in the `nextBatch`
     */
    setBatchSize(batchSize) {
        this.getMoreOptions.batchSize = batchSize;
        return this;
    }
    /** Unsupported for RunCommandCursor */
    clone() {
        throw new error_1$k.MongoAPIError('Clone not supported, create a new cursor with db.runCursorCommand');
    }
    /** Unsupported for RunCommandCursor: readConcern must be configured directly on command document */
    withReadConcern(_) {
        throw new error_1$k.MongoAPIError('RunCommandCursor does not support readConcern it must be attached to the command being run');
    }
    /** Unsupported for RunCommandCursor: various cursor flags must be configured directly on command document */
    addCursorFlag(_, __) {
        throw new error_1$k.MongoAPIError('RunCommandCursor does not support cursor flags, they must be attached to the command being run');
    }
    /** Unsupported for RunCommandCursor: maxTimeMS must be configured directly on command document */
    maxTimeMS(_) {
        throw new error_1$k.MongoAPIError('maxTimeMS must be configured on the command document directly, to configure getMore.maxTimeMS use cursor.setMaxTimeMS()');
    }
    /** Unsupported for RunCommandCursor: batchSize must be configured directly on command document */
    batchSize(_) {
        throw new error_1$k.MongoAPIError('batchSize must be configured on the command document directly, to configure getMore.batchSize use cursor.setBatchSize()');
    }
    /** @internal */
    constructor(db, command, options = {}) {
        super(db.client, (0, utils_1$c.ns)(db.namespace), options);
        this.getMoreOptions = {};
        this.db = db;
        this.command = Object.freeze({ ...command });
    }
    /** @internal */
    _initialize(session, callback) {
        const operation = new run_command_1.RunCommandOperation(this.db, this.command, {
            ...this.cursorOptions,
            session: session,
            readPreference: this.cursorOptions.readPreference
        });
        (0, execute_operation_1.executeOperation)(this.client, operation).then(response => {
            if (response.cursor == null) {
                callback(new error_1$k.MongoUnexpectedServerResponseError('Expected server to respond with cursor'));
                return;
            }
            callback(undefined, {
                server: operation.server,
                session,
                response
            });
        }, err => callback(err));
    }
    /** @internal */
    _getMore(_batchSize, callback) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const getMoreOperation = new get_more_1.GetMoreOperation(this.namespace, this.id, this.server, {
            ...this.cursorOptions,
            session: this.session,
            ...this.getMoreOptions
        });
        (0, execute_operation_1.executeOperation)(this.client, getMoreOperation, callback);
    }
}
run_command_cursor.RunCommandCursor = RunCommandCursor;

var collections = {};

var hasRequiredCollections;

function requireCollections () {
	if (hasRequiredCollections) return collections;
	hasRequiredCollections = 1;
	Object.defineProperty(collections, "__esModule", { value: true });
	collections.CollectionsOperation = void 0;
	const collection_1 = requireCollection();
	const operation_1 = operation;
	/** @internal */
	class CollectionsOperation extends operation_1.AbstractCallbackOperation {
	    constructor(db, options) {
	        super(options);
	        this.options = options;
	        this.db = db;
	    }
	    executeCallback(server, session, callback) {
	        // Let's get the collection names
	        this.db
	            .listCollections({}, { ...this.options, nameOnly: true, readPreference: this.readPreference, session })
	            .toArray()
	            .then(documents => {
	            const collections = [];
	            for (const { name } of documents) {
	                if (!name.includes('$')) {
	                    // Filter collections removing any illegal ones
	                    collections.push(new collection_1.Collection(this.db, name, this.db.s.options));
	                }
	            }
	            // Return the collection objects
	            callback(undefined, collections);
	        }, error => callback(error));
	    }
	}
	collections.CollectionsOperation = CollectionsOperation;
	
	return collections;
}

var create_collection = {};

var hasRequiredCreate_collection;

function requireCreate_collection () {
	if (hasRequiredCreate_collection) return create_collection;
	hasRequiredCreate_collection = 1;
	Object.defineProperty(create_collection, "__esModule", { value: true });
	create_collection.CreateCollectionOperation = void 0;
	const constants_1 = constants$1;
	const collection_1 = requireCollection();
	const error_1 = error;
	const command_1 = command;
	const indexes_1 = indexes;
	const operation_1 = operation;
	const ILLEGAL_COMMAND_FIELDS = new Set([
	    'w',
	    'wtimeout',
	    'j',
	    'fsync',
	    'autoIndexId',
	    'pkFactory',
	    'raw',
	    'readPreference',
	    'session',
	    'readConcern',
	    'writeConcern',
	    'raw',
	    'fieldsAsRaw',
	    'useBigInt64',
	    'promoteLongs',
	    'promoteValues',
	    'promoteBuffers',
	    'bsonRegExp',
	    'serializeFunctions',
	    'ignoreUndefined',
	    'enableUtf8Validation'
	]);
	/* @internal */
	const INVALID_QE_VERSION = 'Driver support of Queryable Encryption is incompatible with server. Upgrade server to use Queryable Encryption.';
	/** @internal */
	class CreateCollectionOperation extends command_1.CommandOperation {
	    constructor(db, name, options = {}) {
	        super(db, options);
	        this.options = options;
	        this.db = db;
	        this.name = name;
	    }
	    executeCallback(server, session, callback) {
	        (async () => {
	            const db = this.db;
	            const name = this.name;
	            const options = this.options;
	            const encryptedFields = options.encryptedFields ??
	                db.client.options.autoEncryption?.encryptedFieldsMap?.[`${db.databaseName}.${name}`];
	            if (encryptedFields) {
	                // Creating a QE collection required min server of 7.0.0
	                // TODO(NODE-5353): Get wire version information from connection.
	                if (!server.loadBalanced &&
	                    server.description.maxWireVersion < constants_1.MIN_SUPPORTED_QE_WIRE_VERSION) {
	                    throw new error_1.MongoCompatibilityError(`${INVALID_QE_VERSION} The minimum server version required is ${constants_1.MIN_SUPPORTED_QE_SERVER_VERSION}`);
	                }
	                // Create auxilliary collections for queryable encryption support.
	                const escCollection = encryptedFields.escCollection ?? `enxcol_.${name}.esc`;
	                const ecocCollection = encryptedFields.ecocCollection ?? `enxcol_.${name}.ecoc`;
	                for (const collectionName of [escCollection, ecocCollection]) {
	                    const createOp = new CreateCollectionOperation(db, collectionName, {
	                        clusteredIndex: {
	                            key: { _id: 1 },
	                            unique: true
	                        }
	                    });
	                    await createOp.executeWithoutEncryptedFieldsCheck(server, session);
	                }
	                if (!options.encryptedFields) {
	                    this.options = { ...this.options, encryptedFields };
	                }
	            }
	            const coll = await this.executeWithoutEncryptedFieldsCheck(server, session);
	            if (encryptedFields) {
	                // Create the required index for queryable encryption support.
	                const createIndexOp = new indexes_1.CreateIndexOperation(db, name, { __safeContent__: 1 }, {});
	                await createIndexOp.execute(server, session);
	            }
	            return coll;
	        })().then(coll => callback(undefined, coll), err => callback(err));
	    }
	    executeWithoutEncryptedFieldsCheck(server, session) {
	        return new Promise((resolve, reject) => {
	            const db = this.db;
	            const name = this.name;
	            const options = this.options;
	            const done = err => {
	                if (err) {
	                    return reject(err);
	                }
	                resolve(new collection_1.Collection(db, name, options));
	            };
	            const cmd = { create: name };
	            for (const n in options) {
	                if (options[n] != null &&
	                    typeof options[n] !== 'function' &&
	                    !ILLEGAL_COMMAND_FIELDS.has(n)) {
	                    cmd[n] = options[n];
	                }
	            }
	            // otherwise just execute the command
	            super.executeCommand(server, session, cmd, done);
	        });
	    }
	}
	create_collection.CreateCollectionOperation = CreateCollectionOperation;
	(0, operation_1.defineAspects)(CreateCollectionOperation, [operation_1.Aspect.WRITE_OPERATION]);
	
	return create_collection;
}

var profiling_level = {};

Object.defineProperty(profiling_level, "__esModule", { value: true });
profiling_level.ProfilingLevelOperation = void 0;
const error_1$j = error;
const command_1 = command;
/** @internal */
class ProfilingLevelOperation extends command_1.CommandOperation {
    constructor(db, options) {
        super(db, options);
        this.options = options;
    }
    executeCallback(server, session, callback) {
        super.executeCommand(server, session, { profile: -1 }, (err, doc) => {
            if (err == null && doc.ok === 1) {
                const was = doc.was;
                if (was === 0)
                    return callback(undefined, 'off');
                if (was === 1)
                    return callback(undefined, 'slow_only');
                if (was === 2)
                    return callback(undefined, 'all');
                // TODO(NODE-3483)
                return callback(new error_1$j.MongoRuntimeError(`Illegal profiling level value ${was}`));
            }
            else {
                // TODO(NODE-3483): Consider MongoUnexpectedServerResponseError
                err != null ? callback(err) : callback(new error_1$j.MongoRuntimeError('Error with profile command'));
            }
        });
    }
}
profiling_level.ProfilingLevelOperation = ProfilingLevelOperation;

var set_profiling_level = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SetProfilingLevelOperation = exports.ProfilingLevel = void 0;
	const error_1 = error;
	const utils_1 = utils;
	const command_1 = command;
	const levelValues = new Set(['off', 'slow_only', 'all']);
	/** @public */
	exports.ProfilingLevel = Object.freeze({
	    off: 'off',
	    slowOnly: 'slow_only',
	    all: 'all'
	});
	/** @internal */
	class SetProfilingLevelOperation extends command_1.CommandOperation {
	    constructor(db, level, options) {
	        super(db, options);
	        this.options = options;
	        switch (level) {
	            case exports.ProfilingLevel.off:
	                this.profile = 0;
	                break;
	            case exports.ProfilingLevel.slowOnly:
	                this.profile = 1;
	                break;
	            case exports.ProfilingLevel.all:
	                this.profile = 2;
	                break;
	            default:
	                this.profile = 0;
	                break;
	        }
	        this.level = level;
	    }
	    executeCallback(server, session, callback) {
	        const level = this.level;
	        if (!levelValues.has(level)) {
	            return callback(new error_1.MongoInvalidArgumentError(`Profiling level must be one of "${(0, utils_1.enumToString)(exports.ProfilingLevel)}"`));
	        }
	        // TODO(NODE-3483): Determine error to put here
	        super.executeCommand(server, session, { profile: this.profile }, (err, doc) => {
	            if (err == null && doc.ok === 1)
	                return callback(undefined, level);
	            return err != null
	                ? callback(err)
	                : callback(new error_1.MongoRuntimeError('Error with profile command'));
	        });
	    }
	}
	exports.SetProfilingLevelOperation = SetProfilingLevelOperation;
	
} (set_profiling_level));

var hasRequiredDb;

function requireDb () {
	if (hasRequiredDb) return db;
	hasRequiredDb = 1;
	Object.defineProperty(db, "__esModule", { value: true });
	db.Db = void 0;
	const admin_1 = admin;
	const bson_1 = bson;
	const change_stream_1 = requireChange_stream();
	const collection_1 = requireCollection();
	const CONSTANTS = constants;
	const aggregation_cursor_1 = aggregation_cursor;
	const list_collections_cursor_1 = list_collections_cursor;
	const run_command_cursor_1 = run_command_cursor;
	const error_1 = error;
	const add_user_1 = add_user;
	const collections_1 = requireCollections();
	const create_collection_1 = requireCreate_collection();
	const drop_1 = drop$1;
	const execute_operation_1 = execute_operation;
	const indexes_1 = indexes;
	const profiling_level_1 = profiling_level;
	const remove_user_1 = remove_user;
	const rename_1 = requireRename();
	const run_command_1 = run_command;
	const set_profiling_level_1 = set_profiling_level;
	const stats_1 = stats;
	const read_concern_1 = read_concern;
	const read_preference_1 = read_preference;
	const utils_1 = utils;
	const write_concern_1 = write_concern;
	// Allowed parameters
	const DB_OPTIONS_ALLOW_LIST = [
	    'writeConcern',
	    'readPreference',
	    'readPreferenceTags',
	    'native_parser',
	    'forceServerObjectId',
	    'pkFactory',
	    'serializeFunctions',
	    'raw',
	    'authSource',
	    'ignoreUndefined',
	    'readConcern',
	    'retryMiliSeconds',
	    'numberOfRetries',
	    'useBigInt64',
	    'promoteBuffers',
	    'promoteLongs',
	    'bsonRegExp',
	    'enableUtf8Validation',
	    'promoteValues',
	    'compression',
	    'retryWrites'
	];
	/**
	 * The **Db** class is a class that represents a MongoDB Database.
	 * @public
	 *
	 * @example
	 * ```ts
	 * import { MongoClient } from 'mongodb';
	 *
	 * interface Pet {
	 *   name: string;
	 *   kind: 'dog' | 'cat' | 'fish';
	 * }
	 *
	 * const client = new MongoClient('mongodb://localhost:27017');
	 * const db = client.db();
	 *
	 * // Create a collection that validates our union
	 * await db.createCollection<Pet>('pets', {
	 *   validator: { $expr: { $in: ['$kind', ['dog', 'cat', 'fish']] } }
	 * })
	 * ```
	 */
	class Db {
	    /**
	     * Creates a new Db instance
	     *
	     * @param client - The MongoClient for the database.
	     * @param databaseName - The name of the database this instance represents.
	     * @param options - Optional settings for Db construction
	     */
	    constructor(client, databaseName, options) {
	        options = options ?? {};
	        // Filter the options
	        options = (0, utils_1.filterOptions)(options, DB_OPTIONS_ALLOW_LIST);
	        // Ensure we have a valid db name
	        validateDatabaseName(databaseName);
	        // Internal state of the db object
	        this.s = {
	            // Options
	            options,
	            // Unpack read preference
	            readPreference: read_preference_1.ReadPreference.fromOptions(options),
	            // Merge bson options
	            bsonOptions: (0, bson_1.resolveBSONOptions)(options, client),
	            // Set up the primary key factory or fallback to ObjectId
	            pkFactory: options?.pkFactory ?? utils_1.DEFAULT_PK_FACTORY,
	            // ReadConcern
	            readConcern: read_concern_1.ReadConcern.fromOptions(options),
	            writeConcern: write_concern_1.WriteConcern.fromOptions(options),
	            // Namespace
	            namespace: new utils_1.MongoDBNamespace(databaseName)
	        };
	        this.client = client;
	    }
	    get databaseName() {
	        return this.s.namespace.db;
	    }
	    // Options
	    get options() {
	        return this.s.options;
	    }
	    /**
	     * Check if a secondary can be used (because the read preference is *not* set to primary)
	     */
	    get secondaryOk() {
	        return this.s.readPreference?.preference !== 'primary' || false;
	    }
	    get readConcern() {
	        return this.s.readConcern;
	    }
	    /**
	     * The current readPreference of the Db. If not explicitly defined for
	     * this Db, will be inherited from the parent MongoClient
	     */
	    get readPreference() {
	        if (this.s.readPreference == null) {
	            return this.client.readPreference;
	        }
	        return this.s.readPreference;
	    }
	    get bsonOptions() {
	        return this.s.bsonOptions;
	    }
	    // get the write Concern
	    get writeConcern() {
	        return this.s.writeConcern;
	    }
	    get namespace() {
	        return this.s.namespace.toString();
	    }
	    /**
	     * Create a new collection on a server with the specified options. Use this to create capped collections.
	     * More information about command options available at https://www.mongodb.com/docs/manual/reference/command/create/
	     *
	     * @param name - The name of the collection to create
	     * @param options - Optional settings for the command
	     */
	    async createCollection(name, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new create_collection_1.CreateCollectionOperation(this, name, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Execute a command
	     *
	     * @remarks
	     * This command does not inherit options from the MongoClient.
	     *
	     * The driver will ensure the following fields are attached to the command sent to the server:
	     * - `lsid` - sourced from an implicit session or options.session
	     * - `$readPreference` - defaults to primary or can be configured by options.readPreference
	     * - `$db` - sourced from the name of this database
	     *
	     * If the client has a serverApi setting:
	     * - `apiVersion`
	     * - `apiStrict`
	     * - `apiDeprecationErrors`
	     *
	     * When in a transaction:
	     * - `readConcern` - sourced from readConcern set on the TransactionOptions
	     * - `writeConcern` - sourced from writeConcern set on the TransactionOptions
	     *
	     * Attaching any of the above fields to the command will have no effect as the driver will overwrite the value.
	     *
	     * @param command - The command to run
	     * @param options - Optional settings for the command
	     */
	    async command(command, options) {
	        // Intentionally, we do not inherit options from parent for this operation.
	        return (0, execute_operation_1.executeOperation)(this.client, new run_command_1.RunCommandOperation(this, command, options));
	    }
	    /**
	     * Execute an aggregation framework pipeline against the database, needs MongoDB \>= 3.6
	     *
	     * @param pipeline - An array of aggregation stages to be executed
	     * @param options - Optional settings for the command
	     */
	    aggregate(pipeline = [], options) {
	        return new aggregation_cursor_1.AggregationCursor(this.client, this.s.namespace, pipeline, (0, utils_1.resolveOptions)(this, options));
	    }
	    /** Return the Admin db instance */
	    admin() {
	        return new admin_1.Admin(this);
	    }
	    /**
	     * Returns a reference to a MongoDB Collection. If it does not exist it will be created implicitly.
	     *
	     * @param name - the collection name we wish to access.
	     * @returns return the new Collection instance
	     */
	    collection(name, options = {}) {
	        if (typeof options === 'function') {
	            throw new error_1.MongoInvalidArgumentError('The callback form of this helper has been removed.');
	        }
	        return new collection_1.Collection(this, name, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * Get all the db statistics.
	     *
	     * @param options - Optional settings for the command
	     */
	    async stats(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new stats_1.DbStatsOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    listCollections(filter = {}, options = {}) {
	        return new list_collections_cursor_1.ListCollectionsCursor(this, filter, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * Rename a collection.
	     *
	     * @remarks
	     * This operation does not inherit options from the MongoClient.
	     *
	     * @param fromCollection - Name of current collection to rename
	     * @param toCollection - New name of of the collection
	     * @param options - Optional settings for the command
	     */
	    async renameCollection(fromCollection, toCollection, options) {
	        // Intentionally, we do not inherit options from parent for this operation.
	        return (0, execute_operation_1.executeOperation)(this.client, new rename_1.RenameOperation(this.collection(fromCollection), toCollection, { ...options, new_collection: true, readPreference: read_preference_1.ReadPreference.primary }));
	    }
	    /**
	     * Drop a collection from the database, removing it permanently. New accesses will create a new collection.
	     *
	     * @param name - Name of collection to drop
	     * @param options - Optional settings for the command
	     */
	    async dropCollection(name, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new drop_1.DropCollectionOperation(this, name, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Drop a database, removing it permanently from the server.
	     *
	     * @param options - Optional settings for the command
	     */
	    async dropDatabase(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new drop_1.DropDatabaseOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Fetch all collections for the current db.
	     *
	     * @param options - Optional settings for the command
	     */
	    async collections(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new collections_1.CollectionsOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Creates an index on the db and collection.
	     *
	     * @param name - Name of the collection to create the index on.
	     * @param indexSpec - Specify the field to index, or an index specification
	     * @param options - Optional settings for the command
	     */
	    async createIndex(name, indexSpec, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.CreateIndexOperation(this, name, indexSpec, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Add a user to the database
	     *
	     * @param username - The username for the new user
	     * @param passwordOrOptions - An optional password for the new user, or the options for the command
	     * @param options - Optional settings for the command
	     * @deprecated Use the createUser command in `db.command()` instead.
	     * @see https://www.mongodb.com/docs/manual/reference/command/createUser/
	     */
	    async addUser(username, passwordOrOptions, options) {
	        options =
	            options != null && typeof options === 'object'
	                ? options
	                : passwordOrOptions != null && typeof passwordOrOptions === 'object'
	                    ? passwordOrOptions
	                    : undefined;
	        const password = typeof passwordOrOptions === 'string' ? passwordOrOptions : undefined;
	        return (0, execute_operation_1.executeOperation)(this.client, new add_user_1.AddUserOperation(this, username, password, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Remove a user from a database
	     *
	     * @param username - The username to remove
	     * @param options - Optional settings for the command
	     */
	    async removeUser(username, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new remove_user_1.RemoveUserOperation(this, username, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Set the current profiling level of MongoDB
	     *
	     * @param level - The new profiling level (off, slow_only, all).
	     * @param options - Optional settings for the command
	     */
	    async setProfilingLevel(level, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new set_profiling_level_1.SetProfilingLevelOperation(this, level, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Retrieve the current profiling Level for MongoDB
	     *
	     * @param options - Optional settings for the command
	     */
	    async profilingLevel(options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new profiling_level_1.ProfilingLevelOperation(this, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Retrieves this collections index info.
	     *
	     * @param name - The name of the collection.
	     * @param options - Optional settings for the command
	     */
	    async indexInformation(name, options) {
	        return (0, execute_operation_1.executeOperation)(this.client, new indexes_1.IndexInformationOperation(this, name, (0, utils_1.resolveOptions)(this, options)));
	    }
	    /**
	     * Create a new Change Stream, watching for new changes (insertions, updates,
	     * replacements, deletions, and invalidations) in this database. Will ignore all
	     * changes to system collections.
	     *
	     * @remarks
	     * watch() accepts two generic arguments for distinct use cases:
	     * - The first is to provide the schema that may be defined for all the collections within this database
	     * - The second is to override the shape of the change stream document entirely, if it is not provided the type will default to ChangeStreamDocument of the first argument
	     *
	     * @param pipeline - An array of {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
	     * @param options - Optional settings for the command
	     * @typeParam TSchema - Type of the data being detected by the change stream
	     * @typeParam TChange - Type of the whole change stream document emitted
	     */
	    watch(pipeline = [], options = {}) {
	        // Allow optionally not specifying a pipeline
	        if (!Array.isArray(pipeline)) {
	            options = pipeline;
	            pipeline = [];
	        }
	        return new change_stream_1.ChangeStream(this, pipeline, (0, utils_1.resolveOptions)(this, options));
	    }
	    /**
	     * A low level cursor API providing basic driver functionality:
	     * - ClientSession management
	     * - ReadPreference for server selection
	     * - Running getMores automatically when a local batch is exhausted
	     *
	     * @param command - The command that will start a cursor on the server.
	     * @param options - Configurations for running the command, bson options will apply to getMores
	     */
	    runCursorCommand(command, options) {
	        return new run_command_cursor_1.RunCommandCursor(this, command, options);
	    }
	}
	Db.SYSTEM_NAMESPACE_COLLECTION = CONSTANTS.SYSTEM_NAMESPACE_COLLECTION;
	Db.SYSTEM_INDEX_COLLECTION = CONSTANTS.SYSTEM_INDEX_COLLECTION;
	Db.SYSTEM_PROFILE_COLLECTION = CONSTANTS.SYSTEM_PROFILE_COLLECTION;
	Db.SYSTEM_USER_COLLECTION = CONSTANTS.SYSTEM_USER_COLLECTION;
	Db.SYSTEM_COMMAND_COLLECTION = CONSTANTS.SYSTEM_COMMAND_COLLECTION;
	Db.SYSTEM_JS_COLLECTION = CONSTANTS.SYSTEM_JS_COLLECTION;
	db.Db = Db;
	// TODO(NODE-3484): Refactor into MongoDBNamespace
	// Validate the database name
	function validateDatabaseName(databaseName) {
	    if (typeof databaseName !== 'string')
	        throw new error_1.MongoInvalidArgumentError('Database name must be a string');
	    if (databaseName.length === 0)
	        throw new error_1.MongoInvalidArgumentError('Database name cannot be the empty string');
	    if (databaseName === '$external')
	        return;
	    const invalidChars = [' ', '.', '$', '/', '\\'];
	    for (let i = 0; i < invalidChars.length; i++) {
	        if (databaseName.indexOf(invalidChars[i]) !== -1)
	            throw new error_1.MongoAPIError(`database names cannot contain the character '${invalidChars[i]}'`);
	    }
	}
	
	return db;
}

var mongo_client = {};

var mongo_credentials = {};

var gssapi = {};

const require$$0$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(dns$1);

var deps = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AutoEncryptionLoggerLevel = exports.aws4 = exports.saslprep = exports.getSnappy = exports.getAwsCredentialProvider = exports.getZstdLibrary = exports.ZStandard = exports.getKerberos = exports.Kerberos = void 0;
	const error_1 = error;
	function makeErrorModule(error) {
	    const props = error ? { kModuleError: error } : {};
	    return new Proxy(props, {
	        get: (_, key) => {
	            if (key === 'kModuleError') {
	                return error;
	            }
	            throw error;
	        },
	        set: () => {
	            throw error;
	        }
	    });
	}
	exports.Kerberos = makeErrorModule(new error_1.MongoMissingDependencyError('Optional module `kerberos` not found. Please install it to enable kerberos authentication'));
	function getKerberos() {
	    try {
	        // Ensure you always wrap an optional require in the try block NODE-3199
	        exports.Kerberos = require('kerberos');
	        return exports.Kerberos;
	    }
	    catch {
	        return exports.Kerberos;
	    }
	}
	exports.getKerberos = getKerberos;
	exports.ZStandard = makeErrorModule(new error_1.MongoMissingDependencyError('Optional module `@mongodb-js/zstd` not found. Please install it to enable zstd compression'));
	function getZstdLibrary() {
	    try {
	        exports.ZStandard = require('@mongodb-js/zstd');
	        return exports.ZStandard;
	    }
	    catch {
	        return exports.ZStandard;
	    }
	}
	exports.getZstdLibrary = getZstdLibrary;
	function getAwsCredentialProvider() {
	    try {
	        // Ensure you always wrap an optional require in the try block NODE-3199
	        const credentialProvider = require('@aws-sdk/credential-providers');
	        return credentialProvider;
	    }
	    catch {
	        return makeErrorModule(new error_1.MongoMissingDependencyError('Optional module `@aws-sdk/credential-providers` not found.' +
	            ' Please install it to enable getting aws credentials via the official sdk.'));
	    }
	}
	exports.getAwsCredentialProvider = getAwsCredentialProvider;
	function getSnappy() {
	    try {
	        // Ensure you always wrap an optional require in the try block NODE-3199
	        const value = require('snappy');
	        return value;
	    }
	    catch (cause) {
	        const kModuleError = new error_1.MongoMissingDependencyError('Optional module `snappy` not found. Please install it to enable snappy compression', { cause });
	        return { kModuleError };
	    }
	}
	exports.getSnappy = getSnappy;
	exports.saslprep = makeErrorModule(new error_1.MongoMissingDependencyError('Optional module `saslprep` not found.' +
	    ' Please install it to enable Stringprep Profile for User Names and Passwords'));
	try {
	    // Ensure you always wrap an optional require in the try block NODE-3199
	    exports.saslprep = require('saslprep');
	}
	catch { } // eslint-disable-line
	exports.aws4 = makeErrorModule(new error_1.MongoMissingDependencyError('Optional module `aws4` not found. Please install it to enable AWS authentication'));
	try {
	    // Ensure you always wrap an optional require in the try block NODE-3199
	    exports.aws4 = require('aws4');
	}
	catch { } // eslint-disable-line
	/** @public */
	exports.AutoEncryptionLoggerLevel = Object.freeze({
	    FatalError: 0,
	    Error: 1,
	    Warning: 2,
	    Info: 3,
	    Trace: 4
	});
	
} (deps));

var auth_provider = {};

Object.defineProperty(auth_provider, "__esModule", { value: true });
auth_provider.AuthProvider = auth_provider.AuthContext = void 0;
const error_1$i = error;
/**
 * Context used during authentication
 * @internal
 */
class AuthContext {
    constructor(connection, credentials, options) {
        /** If the context is for reauthentication. */
        this.reauthenticating = false;
        this.connection = connection;
        this.credentials = credentials;
        this.options = options;
    }
}
auth_provider.AuthContext = AuthContext;
class AuthProvider {
    /**
     * Prepare the handshake document before the initial handshake.
     *
     * @param handshakeDoc - The document used for the initial handshake on a connection
     * @param authContext - Context for authentication flow
     */
    async prepare(handshakeDoc, _authContext) {
        return handshakeDoc;
    }
    /**
     * Reauthenticate.
     * @param context - The shared auth context.
     */
    async reauth(context) {
        if (context.reauthenticating) {
            throw new error_1$i.MongoRuntimeError('Reauthentication already in progress.');
        }
        try {
            context.reauthenticating = true;
            await this.auth(context);
        }
        finally {
            context.reauthenticating = false;
        }
    }
}
auth_provider.AuthProvider = AuthProvider;

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveCname = exports.performGSSAPICanonicalizeHostName = exports.GSSAPI = exports.GSSAPICanonicalizationValue = void 0;
	const dns = require$$0$3;
	const deps_1 = deps;
	const error_1 = error;
	const utils_1 = utils;
	const auth_provider_1 = auth_provider;
	/** @public */
	exports.GSSAPICanonicalizationValue = Object.freeze({
	    on: true,
	    off: false,
	    none: 'none',
	    forward: 'forward',
	    forwardAndReverse: 'forwardAndReverse'
	});
	async function externalCommand(connection, command) {
	    return connection.commandAsync((0, utils_1.ns)('$external.$cmd'), command, undefined);
	}
	let krb;
	class GSSAPI extends auth_provider_1.AuthProvider {
	    async auth(authContext) {
	        const { connection, credentials } = authContext;
	        if (credentials == null) {
	            throw new error_1.MongoMissingCredentialsError('Credentials required for GSSAPI authentication');
	        }
	        const { username } = credentials;
	        const client = await makeKerberosClient(authContext);
	        const payload = await client.step('');
	        const saslStartResponse = await externalCommand(connection, saslStart(payload));
	        const negotiatedPayload = await negotiate(client, 10, saslStartResponse.payload);
	        const saslContinueResponse = await externalCommand(connection, saslContinue(negotiatedPayload, saslStartResponse.conversationId));
	        const finalizePayload = await finalize(client, username, saslContinueResponse.payload);
	        await externalCommand(connection, {
	            saslContinue: 1,
	            conversationId: saslContinueResponse.conversationId,
	            payload: finalizePayload
	        });
	    }
	}
	exports.GSSAPI = GSSAPI;
	async function makeKerberosClient(authContext) {
	    const { hostAddress } = authContext.options;
	    const { credentials } = authContext;
	    if (!hostAddress || typeof hostAddress.host !== 'string' || !credentials) {
	        throw new error_1.MongoInvalidArgumentError('Connection must have host and port and credentials defined.');
	    }
	    loadKrb();
	    if ('kModuleError' in krb) {
	        throw krb['kModuleError'];
	    }
	    const { initializeClient } = krb;
	    const { username, password } = credentials;
	    const mechanismProperties = credentials.mechanismProperties;
	    const serviceName = mechanismProperties.SERVICE_NAME ?? 'mongodb';
	    const host = await performGSSAPICanonicalizeHostName(hostAddress.host, mechanismProperties);
	    const initOptions = {};
	    if (password != null) {
	        // TODO(NODE-5139): These do not match the typescript options in initializeClient
	        Object.assign(initOptions, { user: username, password: password });
	    }
	    const spnHost = mechanismProperties.SERVICE_HOST ?? host;
	    let spn = `${serviceName}${process.platform === 'win32' ? '/' : '@'}${spnHost}`;
	    if ('SERVICE_REALM' in mechanismProperties) {
	        spn = `${spn}@${mechanismProperties.SERVICE_REALM}`;
	    }
	    return initializeClient(spn, initOptions);
	}
	function saslStart(payload) {
	    return {
	        saslStart: 1,
	        mechanism: 'GSSAPI',
	        payload,
	        autoAuthorize: 1
	    };
	}
	function saslContinue(payload, conversationId) {
	    return {
	        saslContinue: 1,
	        conversationId,
	        payload
	    };
	}
	async function negotiate(client, retries, payload) {
	    try {
	        const response = await client.step(payload);
	        return response || '';
	    }
	    catch (error) {
	        if (retries === 0) {
	            // Retries exhausted, raise error
	            throw error;
	        }
	        // Adjust number of retries and call step again
	        return negotiate(client, retries - 1, payload);
	    }
	}
	async function finalize(client, user, payload) {
	    // GSS Client Unwrap
	    const response = await client.unwrap(payload);
	    return client.wrap(response || '', { user });
	}
	async function performGSSAPICanonicalizeHostName(host, mechanismProperties) {
	    const mode = mechanismProperties.CANONICALIZE_HOST_NAME;
	    if (!mode || mode === exports.GSSAPICanonicalizationValue.none) {
	        return host;
	    }
	    // If forward and reverse or true
	    if (mode === exports.GSSAPICanonicalizationValue.on ||
	        mode === exports.GSSAPICanonicalizationValue.forwardAndReverse) {
	        // Perform the lookup of the ip address.
	        const { address } = await dns.promises.lookup(host);
	        try {
	            // Perform a reverse ptr lookup on the ip address.
	            const results = await dns.promises.resolvePtr(address);
	            // If the ptr did not error but had no results, return the host.
	            return results.length > 0 ? results[0] : host;
	        }
	        catch (error) {
	            // This can error as ptr records may not exist for all ips. In this case
	            // fallback to a cname lookup as dns.lookup() does not return the
	            // cname.
	            return resolveCname(host);
	        }
	    }
	    else {
	        // The case for forward is just to resolve the cname as dns.lookup()
	        // will not return it.
	        return resolveCname(host);
	    }
	}
	exports.performGSSAPICanonicalizeHostName = performGSSAPICanonicalizeHostName;
	async function resolveCname(host) {
	    // Attempt to resolve the host name
	    try {
	        const results = await dns.promises.resolveCname(host);
	        // Get the first resolved host id
	        return results.length > 0 ? results[0] : host;
	    }
	    catch {
	        return host;
	    }
	}
	exports.resolveCname = resolveCname;
	/**
	 * Load the Kerberos library.
	 */
	function loadKrb() {
	    if (!krb) {
	        krb = (0, deps_1.getKerberos)();
	    }
	}
	
} (gssapi));

var providers = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AUTH_MECHS_AUTH_SRC_EXTERNAL = exports.AuthMechanism = void 0;
	/** @public */
	exports.AuthMechanism = Object.freeze({
	    MONGODB_AWS: 'MONGODB-AWS',
	    MONGODB_CR: 'MONGODB-CR',
	    MONGODB_DEFAULT: 'DEFAULT',
	    MONGODB_GSSAPI: 'GSSAPI',
	    MONGODB_PLAIN: 'PLAIN',
	    MONGODB_SCRAM_SHA1: 'SCRAM-SHA-1',
	    MONGODB_SCRAM_SHA256: 'SCRAM-SHA-256',
	    MONGODB_X509: 'MONGODB-X509',
	    /** @experimental */
	    MONGODB_OIDC: 'MONGODB-OIDC'
	});
	/** @internal */
	exports.AUTH_MECHS_AUTH_SRC_EXTERNAL = new Set([
	    exports.AuthMechanism.MONGODB_GSSAPI,
	    exports.AuthMechanism.MONGODB_AWS,
	    exports.AuthMechanism.MONGODB_OIDC,
	    exports.AuthMechanism.MONGODB_X509
	]);
	
} (providers));

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MongoCredentials = exports.DEFAULT_ALLOWED_HOSTS = void 0;
	const error_1 = error;
	const gssapi_1 = gssapi;
	const providers_1 = providers;
	// https://github.com/mongodb/specifications/blob/master/source/auth/auth.rst
	function getDefaultAuthMechanism(hello) {
	    if (hello) {
	        // If hello contains saslSupportedMechs, use scram-sha-256
	        // if it is available, else scram-sha-1
	        if (Array.isArray(hello.saslSupportedMechs)) {
	            return hello.saslSupportedMechs.includes(providers_1.AuthMechanism.MONGODB_SCRAM_SHA256)
	                ? providers_1.AuthMechanism.MONGODB_SCRAM_SHA256
	                : providers_1.AuthMechanism.MONGODB_SCRAM_SHA1;
	        }
	        // Fallback to legacy selection method. If wire version >= 3, use scram-sha-1
	        if (hello.maxWireVersion >= 3) {
	            return providers_1.AuthMechanism.MONGODB_SCRAM_SHA1;
	        }
	    }
	    // Default for wireprotocol < 3
	    return providers_1.AuthMechanism.MONGODB_CR;
	}
	const ALLOWED_PROVIDER_NAMES = ['aws', 'azure'];
	const ALLOWED_HOSTS_ERROR = 'Auth mechanism property ALLOWED_HOSTS must be an array of strings.';
	/** @internal */
	exports.DEFAULT_ALLOWED_HOSTS = [
	    '*.mongodb.net',
	    '*.mongodb-dev.net',
	    '*.mongodbgov.net',
	    'localhost',
	    '127.0.0.1',
	    '::1'
	];
	/** Error for when the token audience is missing in the environment. */
	const TOKEN_AUDIENCE_MISSING_ERROR = 'TOKEN_AUDIENCE must be set in the auth mechanism properties when PROVIDER_NAME is azure.';
	/**
	 * A representation of the credentials used by MongoDB
	 * @public
	 */
	class MongoCredentials {
	    constructor(options) {
	        this.username = options.username ?? '';
	        this.password = options.password;
	        this.source = options.source;
	        if (!this.source && options.db) {
	            this.source = options.db;
	        }
	        this.mechanism = options.mechanism || providers_1.AuthMechanism.MONGODB_DEFAULT;
	        this.mechanismProperties = options.mechanismProperties || {};
	        if (this.mechanism.match(/MONGODB-AWS/i)) {
	            if (!this.username && process.env.AWS_ACCESS_KEY_ID) {
	                this.username = process.env.AWS_ACCESS_KEY_ID;
	            }
	            if (!this.password && process.env.AWS_SECRET_ACCESS_KEY) {
	                this.password = process.env.AWS_SECRET_ACCESS_KEY;
	            }
	            if (this.mechanismProperties.AWS_SESSION_TOKEN == null &&
	                process.env.AWS_SESSION_TOKEN != null) {
	                this.mechanismProperties = {
	                    ...this.mechanismProperties,
	                    AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN
	                };
	            }
	        }
	        if (this.mechanism === providers_1.AuthMechanism.MONGODB_OIDC && !this.mechanismProperties.ALLOWED_HOSTS) {
	            this.mechanismProperties = {
	                ...this.mechanismProperties,
	                ALLOWED_HOSTS: exports.DEFAULT_ALLOWED_HOSTS
	            };
	        }
	        Object.freeze(this.mechanismProperties);
	        Object.freeze(this);
	    }
	    /** Determines if two MongoCredentials objects are equivalent */
	    equals(other) {
	        return (this.mechanism === other.mechanism &&
	            this.username === other.username &&
	            this.password === other.password &&
	            this.source === other.source);
	    }
	    /**
	     * If the authentication mechanism is set to "default", resolves the authMechanism
	     * based on the server version and server supported sasl mechanisms.
	     *
	     * @param hello - A hello response from the server
	     */
	    resolveAuthMechanism(hello) {
	        // If the mechanism is not "default", then it does not need to be resolved
	        if (this.mechanism.match(/DEFAULT/i)) {
	            return new MongoCredentials({
	                username: this.username,
	                password: this.password,
	                source: this.source,
	                mechanism: getDefaultAuthMechanism(hello),
	                mechanismProperties: this.mechanismProperties
	            });
	        }
	        return this;
	    }
	    validate() {
	        if ((this.mechanism === providers_1.AuthMechanism.MONGODB_GSSAPI ||
	            this.mechanism === providers_1.AuthMechanism.MONGODB_CR ||
	            this.mechanism === providers_1.AuthMechanism.MONGODB_PLAIN ||
	            this.mechanism === providers_1.AuthMechanism.MONGODB_SCRAM_SHA1 ||
	            this.mechanism === providers_1.AuthMechanism.MONGODB_SCRAM_SHA256) &&
	            !this.username) {
	            throw new error_1.MongoMissingCredentialsError(`Username required for mechanism '${this.mechanism}'`);
	        }
	        if (this.mechanism === providers_1.AuthMechanism.MONGODB_OIDC) {
	            if (this.username && this.mechanismProperties.PROVIDER_NAME) {
	                throw new error_1.MongoInvalidArgumentError(`username and PROVIDER_NAME may not be used together for mechanism '${this.mechanism}'.`);
	            }
	            if (this.mechanismProperties.PROVIDER_NAME === 'azure' &&
	                !this.mechanismProperties.TOKEN_AUDIENCE) {
	                throw new error_1.MongoAzureError(TOKEN_AUDIENCE_MISSING_ERROR);
	            }
	            if (this.mechanismProperties.PROVIDER_NAME &&
	                !ALLOWED_PROVIDER_NAMES.includes(this.mechanismProperties.PROVIDER_NAME)) {
	                throw new error_1.MongoInvalidArgumentError(`Currently only a PROVIDER_NAME in ${ALLOWED_PROVIDER_NAMES.join(',')} is supported for mechanism '${this.mechanism}'.`);
	            }
	            if (this.mechanismProperties.REFRESH_TOKEN_CALLBACK &&
	                !this.mechanismProperties.REQUEST_TOKEN_CALLBACK) {
	                throw new error_1.MongoInvalidArgumentError(`A REQUEST_TOKEN_CALLBACK must be provided when using a REFRESH_TOKEN_CALLBACK for mechanism '${this.mechanism}'`);
	            }
	            if (!this.mechanismProperties.PROVIDER_NAME &&
	                !this.mechanismProperties.REQUEST_TOKEN_CALLBACK) {
	                throw new error_1.MongoInvalidArgumentError(`Either a PROVIDER_NAME or a REQUEST_TOKEN_CALLBACK must be specified for mechanism '${this.mechanism}'.`);
	            }
	            if (this.mechanismProperties.ALLOWED_HOSTS) {
	                const hosts = this.mechanismProperties.ALLOWED_HOSTS;
	                if (!Array.isArray(hosts)) {
	                    throw new error_1.MongoInvalidArgumentError(ALLOWED_HOSTS_ERROR);
	                }
	                for (const host of hosts) {
	                    if (typeof host !== 'string') {
	                        throw new error_1.MongoInvalidArgumentError(ALLOWED_HOSTS_ERROR);
	                    }
	                }
	            }
	        }
	        if (providers_1.AUTH_MECHS_AUTH_SRC_EXTERNAL.has(this.mechanism)) {
	            if (this.source != null && this.source !== '$external') {
	                // TODO(NODE-3485): Replace this with a MongoAuthValidationError
	                throw new error_1.MongoAPIError(`Invalid source '${this.source}' for mechanism '${this.mechanism}' specified.`);
	            }
	        }
	        if (this.mechanism === providers_1.AuthMechanism.MONGODB_PLAIN && this.source == null) {
	            // TODO(NODE-3485): Replace this with a MongoAuthValidationError
	            throw new error_1.MongoAPIError('PLAIN Authentication Mechanism needs an auth source');
	        }
	        if (this.mechanism === providers_1.AuthMechanism.MONGODB_X509 && this.password != null) {
	            if (this.password === '') {
	                Reflect.set(this, 'password', undefined);
	                return;
	            }
	            // TODO(NODE-3485): Replace this with a MongoAuthValidationError
	            throw new error_1.MongoAPIError(`Password not allowed for mechanism MONGODB-X509`);
	        }
	        const canonicalization = this.mechanismProperties.CANONICALIZE_HOST_NAME ?? false;
	        if (!Object.values(gssapi_1.GSSAPICanonicalizationValue).includes(canonicalization)) {
	            throw new error_1.MongoAPIError(`Invalid CANONICALIZE_HOST_NAME value: ${canonicalization}`);
	        }
	    }
	    static merge(creds, options) {
	        return new MongoCredentials({
	            username: options.username ?? creds?.username ?? '',
	            password: options.password ?? creds?.password ?? '',
	            mechanism: options.mechanism ?? creds?.mechanism ?? providers_1.AuthMechanism.MONGODB_DEFAULT,
	            mechanismProperties: options.mechanismProperties ?? creds?.mechanismProperties ?? {},
	            source: options.source ?? options.db ?? creds?.source ?? 'admin'
	        });
	    }
	}
	exports.MongoCredentials = MongoCredentials;
	
} (mongo_credentials));

var connection_string = {};

const require$$0$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(fs$1);

const require$$2$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(mongodbConnectionStringUrl);

var client_metadata = {};

const require$$0$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(os$1);

const require$$1$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(process$2);

var name = "mongodb";
var version = "5.7.0";
var description = "The official MongoDB driver for Node.js";
var main = "lib/index.js";
var files = [
	"lib",
	"src",
	"etc/prepare.js",
	"mongodb.d.ts",
	"tsconfig.json"
];
var types = "mongodb.d.ts";
var repository = {
	type: "git",
	url: "git@github.com:mongodb/node-mongodb-native.git"
};
var keywords = [
	"mongodb",
	"driver",
	"official"
];
var author = {
	name: "The MongoDB NodeJS Team",
	email: "dbx-node@mongodb.com"
};
var dependencies = {
	bson: "^5.4.0",
	"mongodb-connection-string-url": "^2.6.0",
	socks: "^2.7.1"
};
var optionalDependencies = {
	saslprep: "^1.0.3"
};
var peerDependencies = {
	"@aws-sdk/credential-providers": "^3.201.0",
	"@mongodb-js/zstd": "^1.1.0",
	kerberos: "^2.0.1",
	"mongodb-client-encryption": ">=2.3.0 <3",
	snappy: "^7.2.2"
};
var peerDependenciesMeta = {
	"@aws-sdk/credential-providers": {
		optional: true
	},
	"@mongodb-js/zstd": {
		optional: true
	},
	kerberos: {
		optional: true
	},
	snappy: {
		optional: true
	},
	"mongodb-client-encryption": {
		optional: true
	}
};
var devDependencies = {
	"@iarna/toml": "^2.2.5",
	"@istanbuljs/nyc-config-typescript": "^1.0.2",
	"@microsoft/api-extractor": "^7.35.1",
	"@microsoft/tsdoc-config": "^0.16.2",
	"@mongodb-js/zstd": "^1.1.0",
	"@octokit/core": "^4.2.1",
	"@types/chai": "^4.3.5",
	"@types/chai-subset": "^1.3.3",
	"@types/express": "^4.17.17",
	"@types/kerberos": "^1.1.2",
	"@types/mocha": "^10.0.1",
	"@types/node": "^20.1.0",
	"@types/saslprep": "^1.0.1",
	"@types/semver": "^7.5.0",
	"@types/sinon": "^10.0.14",
	"@types/sinon-chai": "^3.2.9",
	"@types/whatwg-url": "^11.0.0",
	"@typescript-eslint/eslint-plugin": "^5.59.5",
	"@typescript-eslint/parser": "^5.59.5",
	chai: "^4.3.7",
	"chai-subset": "^1.6.0",
	chalk: "^4.1.2",
	eslint: "^8.40.0",
	"eslint-config-prettier": "^8.8.0",
	"eslint-plugin-import": "^2.27.5",
	"eslint-plugin-prettier": "^4.2.1",
	"eslint-plugin-simple-import-sort": "^10.0.0",
	"eslint-plugin-tsdoc": "^0.2.17",
	express: "^4.18.2",
	"js-yaml": "^4.1.0",
	mocha: "^10.2.0",
	"mocha-sinon": "^2.1.2",
	"mongodb-legacy": "^5.0.0",
	nyc: "^15.1.0",
	prettier: "^2.8.8",
	semver: "^7.5.0",
	sinon: "^15.0.4",
	"sinon-chai": "^3.7.0",
	snappy: "^7.2.2",
	"source-map-support": "^0.5.21",
	"ts-node": "^10.9.1",
	tsd: "^0.28.1",
	typescript: "^5.0.4",
	"typescript-cached-transpile": "^0.0.6",
	"v8-heapsnapshot": "^1.2.0",
	yargs: "^17.7.2"
};
var license = "Apache-2.0";
var engines = {
	node: ">=14.20.1"
};
var bugs = {
	url: "https://jira.mongodb.org/projects/NODE/issues/"
};
var homepage = "https://github.com/mongodb/node-mongodb-native";
var scripts = {
	"build:evergreen": "node .evergreen/generate_evergreen_tasks.js",
	"build:ts": "node ./node_modules/typescript/bin/tsc",
	"build:dts": "npm run build:ts && api-extractor run && node etc/clean_definition_files.cjs",
	"build:docs": "./etc/docs/build.ts",
	"build:typedoc": "typedoc",
	"build:nightly": "node ./.github/scripts/nightly.mjs",
	"check:bench": "node test/benchmarks/driverBench",
	"check:coverage": "nyc npm run test:all",
	"check:integration-coverage": "nyc npm run check:test",
	"check:lambda": "mocha --config test/mocha_lambda.json test/integration/node-specific/examples/handler.test.js",
	"check:lambda:aws": "mocha --config test/mocha_lambda.json test/integration/node-specific/examples/aws_handler.test.js",
	"check:lint": "npm run build:dts && npm run check:dts && npm run check:eslint && npm run check:tsd",
	"check:eslint": "eslint -v && eslint --max-warnings=0 --ext '.js,.ts' src test",
	"check:tsd": "tsd --version && tsd",
	"check:dependencies": "mocha test/action/dependency.test.ts",
	"check:dts": "node ./node_modules/typescript/bin/tsc --noEmit mongodb.d.ts && tsd",
	"check:search-indexes": "nyc mocha --config test/mocha_mongodb.json test/manual/search-index-management.spec.test.ts",
	"check:test": "mocha --config test/mocha_mongodb.json test/integration",
	"check:unit": "mocha test/unit",
	"check:ts": "node ./node_modules/typescript/bin/tsc -v && node ./node_modules/typescript/bin/tsc --noEmit",
	"check:atlas": "mocha --config test/manual/mocharc.json test/manual/atlas_connectivity.test.js",
	"check:adl": "mocha --config test/mocha_mongodb.json test/manual/atlas-data-lake-testing",
	"check:aws": "nyc mocha --config test/mocha_mongodb.json test/integration/auth/mongodb_aws.test.ts",
	"check:oidc": "mocha --config test/mocha_mongodb.json test/manual/mongodb_oidc.prose.test.ts",
	"check:oidc-azure": "mocha --config test/mocha_mongodb.json test/integration/auth/mongodb_oidc_azure.prose.test.ts",
	"check:ocsp": "mocha --config test/manual/mocharc.json test/manual/ocsp_support.test.js",
	"check:kerberos": "nyc mocha --config test/manual/mocharc.json test/manual/kerberos.test.ts",
	"check:tls": "mocha --config test/manual/mocharc.json test/manual/tls_support.test.js",
	"check:ldap": "nyc mocha --config test/manual/mocharc.json test/manual/ldap.test.js",
	"check:socks5": "mocha --config test/manual/mocharc.json test/manual/socks5.test.ts",
	"check:csfle": "mocha --config test/mocha_mongodb.json test/integration/client-side-encryption",
	"check:snappy": "mocha test/unit/assorted/snappy.test.js",
	"fix:eslint": "npm run check:eslint -- --fix",
	prepare: "node etc/prepare.js",
	"preview:docs": "ts-node etc/docs/preview.ts",
	test: "npm run check:lint && npm run test:all",
	"test:all": "npm run check:unit && npm run check:test",
	"update:docs": "npm run build:docs -- --yes"
};
var tsd = {
	directory: "test/types",
	compilerOptions: {
		strict: true,
		target: "esnext",
		module: "commonjs",
		moduleResolution: "node"
	}
};
const require$$4 = {
	name: name,
	version: version,
	description: description,
	main: main,
	files: files,
	types: types,
	repository: repository,
	keywords: keywords,
	author: author,
	dependencies: dependencies,
	optionalDependencies: optionalDependencies,
	peerDependencies: peerDependencies,
	peerDependenciesMeta: peerDependenciesMeta,
	devDependencies: devDependencies,
	license: license,
	engines: engines,
	bugs: bugs,
	homepage: homepage,
	scripts: scripts,
	tsd: tsd
};

Object.defineProperty(client_metadata, "__esModule", { value: true });
client_metadata.getFAASEnv = client_metadata.makeClientMetadata = client_metadata.LimitedSizeDocument = void 0;
const os = require$$0$1;
const process$1 = require$$1$2;
const bson_1$5 = bson;
const error_1$h = error;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NODE_DRIVER_VERSION = require$$4.version;
/** @internal */
class LimitedSizeDocument {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.document = new Map();
        /** BSON overhead: Int32 + Null byte */
        this.documentSize = 5;
    }
    /** Only adds key/value if the bsonByteLength is less than MAX_SIZE */
    ifItFitsItSits(key, value) {
        // The BSON byteLength of the new element is the same as serializing it to its own document
        // subtracting the document size int32 and the null terminator.
        const newElementSize = bson_1$5.BSON.serialize(new Map().set(key, value)).byteLength - 5;
        if (newElementSize + this.documentSize > this.maxSize) {
            return false;
        }
        this.documentSize += newElementSize;
        this.document.set(key, value);
        return true;
    }
    toObject() {
        return bson_1$5.BSON.deserialize(bson_1$5.BSON.serialize(this.document), {
            promoteLongs: false,
            promoteBuffers: false,
            promoteValues: false,
            useBigInt64: false
        });
    }
}
client_metadata.LimitedSizeDocument = LimitedSizeDocument;
/**
 * From the specs:
 * Implementors SHOULD cumulatively update fields in the following order until the document is under the size limit:
 * 1. Omit fields from `env` except `env.name`.
 * 2. Omit fields from `os` except `os.type`.
 * 3. Omit the `env` document entirely.
 * 4. Truncate `platform`. -- special we do not truncate this field
 */
function makeClientMetadata(options) {
    const metadataDocument = new LimitedSizeDocument(512);
    const { appName = '' } = options;
    // Add app name first, it must be sent
    if (appName.length > 0) {
        const name = Buffer.byteLength(appName, 'utf8') <= 128
            ? options.appName
            : Buffer.from(appName, 'utf8').subarray(0, 128).toString('utf8');
        metadataDocument.ifItFitsItSits('application', { name });
    }
    const { name = '', version = '', platform = '' } = options.driverInfo;
    const driverInfo = {
        name: name.length > 0 ? `nodejs|${name}` : 'nodejs',
        version: version.length > 0 ? `${NODE_DRIVER_VERSION}|${version}` : NODE_DRIVER_VERSION
    };
    if (!metadataDocument.ifItFitsItSits('driver', driverInfo)) {
        throw new error_1$h.MongoInvalidArgumentError('Unable to include driverInfo name and version, metadata cannot exceed 512 bytes');
    }
    let runtimeInfo = getRuntimeInfo();
    if (platform.length > 0) {
        runtimeInfo = `${runtimeInfo}|${platform}`;
    }
    if (!metadataDocument.ifItFitsItSits('platform', runtimeInfo)) {
        throw new error_1$h.MongoInvalidArgumentError('Unable to include driverInfo platform, metadata cannot exceed 512 bytes');
    }
    // Note: order matters, os.type is last so it will be removed last if we're at maxSize
    const osInfo = new Map()
        .set('name', process$1.platform)
        .set('architecture', process$1.arch)
        .set('version', os.release())
        .set('type', os.type());
    if (!metadataDocument.ifItFitsItSits('os', osInfo)) {
        for (const key of osInfo.keys()) {
            osInfo.delete(key);
            if (osInfo.size === 0)
                break;
            if (metadataDocument.ifItFitsItSits('os', osInfo))
                break;
        }
    }
    const faasEnv = getFAASEnv();
    if (faasEnv != null) {
        if (!metadataDocument.ifItFitsItSits('env', faasEnv)) {
            for (const key of faasEnv.keys()) {
                faasEnv.delete(key);
                if (faasEnv.size === 0)
                    break;
                if (metadataDocument.ifItFitsItSits('env', faasEnv))
                    break;
            }
        }
    }
    return metadataDocument.toObject();
}
client_metadata.makeClientMetadata = makeClientMetadata;
/**
 * Collects FaaS metadata.
 * - `name` MUST be the last key in the Map returned.
 */
function getFAASEnv() {
    const { AWS_EXECUTION_ENV = '', AWS_LAMBDA_RUNTIME_API = '', FUNCTIONS_WORKER_RUNTIME = '', K_SERVICE = '', FUNCTION_NAME = '', VERCEL = '', AWS_LAMBDA_FUNCTION_MEMORY_SIZE = '', AWS_REGION = '', FUNCTION_MEMORY_MB = '', FUNCTION_REGION = '', FUNCTION_TIMEOUT_SEC = '', VERCEL_REGION = '' } = process$1.env;
    const isAWSFaaS = AWS_EXECUTION_ENV.startsWith('AWS_Lambda_') || AWS_LAMBDA_RUNTIME_API.length > 0;
    const isAzureFaaS = FUNCTIONS_WORKER_RUNTIME.length > 0;
    const isGCPFaaS = K_SERVICE.length > 0 || FUNCTION_NAME.length > 0;
    const isVercelFaaS = VERCEL.length > 0;
    // Note: order matters, name must always be the last key
    const faasEnv = new Map();
    // When isVercelFaaS is true so is isAWSFaaS; Vercel inherits the AWS env
    if (isVercelFaaS && !(isAzureFaaS || isGCPFaaS)) {
        if (VERCEL_REGION.length > 0) {
            faasEnv.set('region', VERCEL_REGION);
        }
        faasEnv.set('name', 'vercel');
        return faasEnv;
    }
    if (isAWSFaaS && !(isAzureFaaS || isGCPFaaS || isVercelFaaS)) {
        if (AWS_REGION.length > 0) {
            faasEnv.set('region', AWS_REGION);
        }
        if (AWS_LAMBDA_FUNCTION_MEMORY_SIZE.length > 0 &&
            Number.isInteger(+AWS_LAMBDA_FUNCTION_MEMORY_SIZE)) {
            faasEnv.set('memory_mb', new bson_1$5.Int32(AWS_LAMBDA_FUNCTION_MEMORY_SIZE));
        }
        faasEnv.set('name', 'aws.lambda');
        return faasEnv;
    }
    if (isAzureFaaS && !(isGCPFaaS || isAWSFaaS || isVercelFaaS)) {
        faasEnv.set('name', 'azure.func');
        return faasEnv;
    }
    if (isGCPFaaS && !(isAzureFaaS || isAWSFaaS || isVercelFaaS)) {
        if (FUNCTION_REGION.length > 0) {
            faasEnv.set('region', FUNCTION_REGION);
        }
        if (FUNCTION_MEMORY_MB.length > 0 && Number.isInteger(+FUNCTION_MEMORY_MB)) {
            faasEnv.set('memory_mb', new bson_1$5.Int32(FUNCTION_MEMORY_MB));
        }
        if (FUNCTION_TIMEOUT_SEC.length > 0 && Number.isInteger(+FUNCTION_TIMEOUT_SEC)) {
            faasEnv.set('timeout_sec', new bson_1$5.Int32(FUNCTION_TIMEOUT_SEC));
        }
        faasEnv.set('name', 'gcp.func');
        return faasEnv;
    }
    return null;
}
client_metadata.getFAASEnv = getFAASEnv;
/**
 * @internal
 * Get current JavaScript runtime platform
 *
 * NOTE: The version information fetching is intentionally written defensively
 * to avoid having a released driver version that becomes incompatible
 * with a future change to these global objects.
 */
function getRuntimeInfo() {
    if ('Deno' in globalThis) {
        const version = typeof Deno?.version?.deno === 'string' ? Deno?.version?.deno : '0.0.0-unknown';
        return `Deno v${version}, ${os.endianness()}`;
    }
    if ('Bun' in globalThis) {
        const version = typeof Bun?.version === 'string' ? Bun?.version : '0.0.0-unknown';
        return `Bun v${version}, ${os.endianness()}`;
    }
    return `Node.js ${process$1.version}, ${os.endianness()}`;
}

var compression = {};

const require$$1$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(zlib);

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decompress = exports.compress = exports.uncompressibleCommands = exports.Compressor = void 0;
	const util_1 = require$$0$6;
	const zlib = require$$1$1;
	const constants_1 = constants;
	const deps_1 = deps;
	const error_1 = error;
	/** @public */
	exports.Compressor = Object.freeze({
	    none: 0,
	    snappy: 1,
	    zlib: 2,
	    zstd: 3
	});
	exports.uncompressibleCommands = new Set([
	    constants_1.LEGACY_HELLO_COMMAND,
	    'saslStart',
	    'saslContinue',
	    'getnonce',
	    'authenticate',
	    'createUser',
	    'updateUser',
	    'copydbSaslStart',
	    'copydbgetnonce',
	    'copydb'
	]);
	const ZSTD_COMPRESSION_LEVEL = 3;
	const zlibInflate = (0, util_1.promisify)(zlib.inflate.bind(zlib));
	const zlibDeflate = (0, util_1.promisify)(zlib.deflate.bind(zlib));
	let zstd;
	let Snappy = null;
	function loadSnappy() {
	    if (Snappy == null) {
	        const snappyImport = (0, deps_1.getSnappy)();
	        if ('kModuleError' in snappyImport) {
	            throw snappyImport.kModuleError;
	        }
	        Snappy = snappyImport;
	    }
	    return Snappy;
	}
	// Facilitate compressing a message using an agreed compressor
	async function compress(options, dataToBeCompressed) {
	    const zlibOptions = {};
	    switch (options.agreedCompressor) {
	        case 'snappy': {
	            Snappy ?? (Snappy = loadSnappy());
	            return Snappy.compress(dataToBeCompressed);
	        }
	        case 'zstd': {
	            loadZstd();
	            if ('kModuleError' in zstd) {
	                throw zstd['kModuleError'];
	            }
	            return zstd.compress(dataToBeCompressed, ZSTD_COMPRESSION_LEVEL);
	        }
	        case 'zlib': {
	            if (options.zlibCompressionLevel) {
	                zlibOptions.level = options.zlibCompressionLevel;
	            }
	            return zlibDeflate(dataToBeCompressed, zlibOptions);
	        }
	        default: {
	            throw new error_1.MongoInvalidArgumentError(`Unknown compressor ${options.agreedCompressor} failed to compress`);
	        }
	    }
	}
	exports.compress = compress;
	// Decompress a message using the given compressor
	async function decompress(compressorID, compressedData) {
	    if (compressorID !== exports.Compressor.snappy &&
	        compressorID !== exports.Compressor.zstd &&
	        compressorID !== exports.Compressor.zlib &&
	        compressorID !== exports.Compressor.none) {
	        throw new error_1.MongoDecompressionError(`Server sent message compressed using an unsupported compressor. (Received compressor ID ${compressorID})`);
	    }
	    switch (compressorID) {
	        case exports.Compressor.snappy: {
	            Snappy ?? (Snappy = loadSnappy());
	            return Snappy.uncompress(compressedData, { asBuffer: true });
	        }
	        case exports.Compressor.zstd: {
	            loadZstd();
	            if ('kModuleError' in zstd) {
	                throw zstd['kModuleError'];
	            }
	            return zstd.decompress(compressedData);
	        }
	        case exports.Compressor.zlib: {
	            return zlibInflate(compressedData);
	        }
	        default: {
	            return compressedData;
	        }
	    }
	}
	exports.decompress = decompress;
	/**
	 * Load ZStandard if it is not already set.
	 */
	function loadZstd() {
	    if (!zstd) {
	        zstd = (0, deps_1.getZstdLibrary)();
	    }
	}
	
} (compression));

var encrypter = {};

var hasRequiredEncrypter;

function requireEncrypter () {
	if (hasRequiredEncrypter) return encrypter;
	hasRequiredEncrypter = 1;
	/* eslint-disable @typescript-eslint/no-var-requires */
	Object.defineProperty(encrypter, "__esModule", { value: true });
	encrypter.Encrypter = void 0;
	const constants_1 = constants;
	const error_1 = error;
	const mongo_client_1 = requireMongo_client();
	const utils_1 = utils;
	let AutoEncrypterClass;
	/** @internal */
	const kInternalClient = Symbol('internalClient');
	/** @internal */
	class Encrypter {
	    constructor(client, uri, options) {
	        if (typeof options.autoEncryption !== 'object') {
	            throw new error_1.MongoInvalidArgumentError('Option "autoEncryption" must be specified');
	        }
	        // initialize to null, if we call getInternalClient, we may set this it is important to not overwrite those function calls.
	        this[kInternalClient] = null;
	        this.bypassAutoEncryption = !!options.autoEncryption.bypassAutoEncryption;
	        this.needsConnecting = false;
	        if (options.maxPoolSize === 0 && options.autoEncryption.keyVaultClient == null) {
	            options.autoEncryption.keyVaultClient = client;
	        }
	        else if (options.autoEncryption.keyVaultClient == null) {
	            options.autoEncryption.keyVaultClient = this.getInternalClient(client, uri, options);
	        }
	        if (this.bypassAutoEncryption) {
	            options.autoEncryption.metadataClient = undefined;
	        }
	        else if (options.maxPoolSize === 0) {
	            options.autoEncryption.metadataClient = client;
	        }
	        else {
	            options.autoEncryption.metadataClient = this.getInternalClient(client, uri, options);
	        }
	        if (options.proxyHost) {
	            options.autoEncryption.proxyOptions = {
	                proxyHost: options.proxyHost,
	                proxyPort: options.proxyPort,
	                proxyUsername: options.proxyUsername,
	                proxyPassword: options.proxyPassword
	            };
	        }
	        this.autoEncrypter = new AutoEncrypterClass(client, options.autoEncryption);
	    }
	    getInternalClient(client, uri, options) {
	        // TODO(NODE-4144): Remove new variable for type narrowing
	        let internalClient = this[kInternalClient];
	        if (internalClient == null) {
	            const clonedOptions = {};
	            for (const key of [
	                ...Object.getOwnPropertyNames(options),
	                ...Object.getOwnPropertySymbols(options)
	            ]) {
	                if (['autoEncryption', 'minPoolSize', 'servers', 'caseTranslate', 'dbName'].includes(key))
	                    continue;
	                Reflect.set(clonedOptions, key, Reflect.get(options, key));
	            }
	            clonedOptions.minPoolSize = 0;
	            internalClient = new mongo_client_1.MongoClient(uri, clonedOptions);
	            this[kInternalClient] = internalClient;
	            for (const eventName of constants_1.MONGO_CLIENT_EVENTS) {
	                for (const listener of client.listeners(eventName)) {
	                    internalClient.on(eventName, listener);
	                }
	            }
	            client.on('newListener', (eventName, listener) => {
	                internalClient?.on(eventName, listener);
	            });
	            this.needsConnecting = true;
	        }
	        return internalClient;
	    }
	    async connectInternalClient() {
	        // TODO(NODE-4144): Remove new variable for type narrowing
	        const internalClient = this[kInternalClient];
	        if (this.needsConnecting && internalClient != null) {
	            this.needsConnecting = false;
	            await internalClient.connect();
	        }
	    }
	    close(client, force, callback) {
	        this.autoEncrypter.teardown(!!force, e => {
	            const internalClient = this[kInternalClient];
	            if (internalClient != null && client !== internalClient) {
	                internalClient.close(force).then(() => callback(), error => callback(error));
	                return;
	            }
	            callback(e);
	        });
	    }
	    static checkForMongoCrypt() {
	        const mongodbClientEncryption = (0, utils_1.getMongoDBClientEncryption)();
	        if (mongodbClientEncryption == null) {
	            throw new error_1.MongoMissingDependencyError('Auto-encryption requested, but the module is not installed. ' +
	                'Please add `mongodb-client-encryption` as a dependency of your project');
	        }
	        AutoEncrypterClass = mongodbClientEncryption.extension(requireLib()).AutoEncrypter;
	    }
	}
	encrypter.Encrypter = Encrypter;
	
	return encrypter;
}

var mongo_logger = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MongoLogger = exports.stringifyWithMaxLen = exports.createStdioLogger = exports.MongoLoggableComponent = exports.SEVERITY_LEVEL_MAP = exports.DEFAULT_MAX_DOCUMENT_LENGTH = exports.SeverityLevel = void 0;
	const bson_1 = require$$0$8;
	const util_1 = require$$0$6;
	const constants_1 = constants;
	const utils_1 = utils;
	/** @internal */
	exports.SeverityLevel = Object.freeze({
	    EMERGENCY: 'emergency',
	    ALERT: 'alert',
	    CRITICAL: 'critical',
	    ERROR: 'error',
	    WARNING: 'warn',
	    NOTICE: 'notice',
	    INFORMATIONAL: 'info',
	    DEBUG: 'debug',
	    TRACE: 'trace',
	    OFF: 'off'
	});
	/** @internal */
	exports.DEFAULT_MAX_DOCUMENT_LENGTH = 1000;
	/** @internal */
	class SeverityLevelMap extends Map {
	    constructor(entries) {
	        const newEntries = [];
	        for (const [level, value] of entries) {
	            newEntries.push([value, level]);
	        }
	        newEntries.push(...entries);
	        super(newEntries);
	    }
	    getNumericSeverityLevel(severity) {
	        return this.get(severity);
	    }
	    getSeverityLevelName(level) {
	        return this.get(level);
	    }
	}
	/** @internal */
	exports.SEVERITY_LEVEL_MAP = new SeverityLevelMap([
	    [exports.SeverityLevel.OFF, -Infinity],
	    [exports.SeverityLevel.EMERGENCY, 0],
	    [exports.SeverityLevel.ALERT, 1],
	    [exports.SeverityLevel.CRITICAL, 2],
	    [exports.SeverityLevel.ERROR, 3],
	    [exports.SeverityLevel.WARNING, 4],
	    [exports.SeverityLevel.NOTICE, 5],
	    [exports.SeverityLevel.INFORMATIONAL, 6],
	    [exports.SeverityLevel.DEBUG, 7],
	    [exports.SeverityLevel.TRACE, 8]
	]);
	/** @internal */
	exports.MongoLoggableComponent = Object.freeze({
	    COMMAND: 'command',
	    TOPOLOGY: 'topology',
	    SERVER_SELECTION: 'serverSelection',
	    CONNECTION: 'connection'
	});
	/**
	 * Parses a string as one of SeverityLevel
	 *
	 * @param s - the value to be parsed
	 * @returns one of SeverityLevel if value can be parsed as such, otherwise null
	 */
	function parseSeverityFromString(s) {
	    const validSeverities = Object.values(exports.SeverityLevel);
	    const lowerSeverity = s?.toLowerCase();
	    if (lowerSeverity != null && validSeverities.includes(lowerSeverity)) {
	        return lowerSeverity;
	    }
	    return null;
	}
	/** @internal */
	function createStdioLogger(stream) {
	    return {
	        write: (log) => {
	            stream.write((0, util_1.inspect)(log, { compact: true, breakLength: Infinity }), 'utf-8');
	            return;
	        }
	    };
	}
	exports.createStdioLogger = createStdioLogger;
	/**
	 * resolves the MONGODB_LOG_PATH and mongodbLogPath options from the environment and the
	 * mongo client options respectively. The mongodbLogPath can be either 'stdout', 'stderr', a NodeJS
	 * Writable or an object which has a `write` method with the signature:
	 * ```ts
	 * write(log: Log): void
	 * ```
	 *
	 * @returns the MongoDBLogWritable object to write logs to
	 */
	function resolveLogPath({ MONGODB_LOG_PATH }, { mongodbLogPath }) {
	    if (typeof mongodbLogPath === 'string' && /^stderr$/i.test(mongodbLogPath)) {
	        return createStdioLogger(process.stderr);
	    }
	    if (typeof mongodbLogPath === 'string' && /^stdout$/i.test(mongodbLogPath)) {
	        return createStdioLogger(process.stdout);
	    }
	    if (typeof mongodbLogPath === 'object' && typeof mongodbLogPath?.write === 'function') {
	        return mongodbLogPath;
	    }
	    if (MONGODB_LOG_PATH && /^stderr$/i.test(MONGODB_LOG_PATH)) {
	        return createStdioLogger(process.stderr);
	    }
	    if (MONGODB_LOG_PATH && /^stdout$/i.test(MONGODB_LOG_PATH)) {
	        return createStdioLogger(process.stdout);
	    }
	    return createStdioLogger(process.stderr);
	}
	function compareSeverity(s0, s1) {
	    const s0Num = exports.SEVERITY_LEVEL_MAP.getNumericSeverityLevel(s0);
	    const s1Num = exports.SEVERITY_LEVEL_MAP.getNumericSeverityLevel(s1);
	    return s0Num < s1Num ? -1 : s0Num > s1Num ? 1 : 0;
	}
	/** @internal */
	function stringifyWithMaxLen(value, maxDocumentLength) {
	    const ejson = bson_1.EJSON.stringify(value);
	    return maxDocumentLength !== 0 && ejson.length > maxDocumentLength
	        ? `${ejson.slice(0, maxDocumentLength)}...`
	        : ejson;
	}
	exports.stringifyWithMaxLen = stringifyWithMaxLen;
	function isLogConvertible(obj) {
	    const objAsLogConvertible = obj;
	    // eslint-disable-next-line no-restricted-syntax
	    return objAsLogConvertible.toLog !== undefined && typeof objAsLogConvertible.toLog === 'function';
	}
	function attachCommandFields(log, commandEvent) {
	    log.commandName = commandEvent.commandName;
	    log.requestId = commandEvent.requestId;
	    log.driverConnectionId = commandEvent?.connectionId;
	    const { host, port } = utils_1.HostAddress.fromString(commandEvent.address).toHostPort();
	    log.serverHost = host;
	    log.serverPort = port;
	    if (commandEvent?.serviceId) {
	        log.serviceId = commandEvent.serviceId.toHexString();
	    }
	    return log;
	}
	function attachConnectionFields(log, connectionPoolEvent) {
	    const { host, port } = utils_1.HostAddress.fromString(connectionPoolEvent.address).toHostPort();
	    log.serverHost = host;
	    log.serverPort = port;
	    return log;
	}
	function defaultLogTransform(logObject, maxDocumentLength = exports.DEFAULT_MAX_DOCUMENT_LENGTH) {
	    let log = Object.create(null);
	    switch (logObject.name) {
	        case constants_1.COMMAND_STARTED:
	            log = attachCommandFields(log, logObject);
	            log.message = 'Command started';
	            log.command = stringifyWithMaxLen(logObject.command, maxDocumentLength);
	            log.databaseName = logObject.databaseName;
	            return log;
	        case constants_1.COMMAND_SUCCEEDED:
	            log = attachCommandFields(log, logObject);
	            log.message = 'Command succeeded';
	            log.durationMS = logObject.duration;
	            log.reply = stringifyWithMaxLen(logObject.reply, maxDocumentLength);
	            return log;
	        case constants_1.COMMAND_FAILED:
	            log = attachCommandFields(log, logObject);
	            log.message = 'Command failed';
	            log.durationMS = logObject.duration;
	            log.failure = logObject.failure;
	            return log;
	        case constants_1.CONNECTION_POOL_CREATED:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection pool created';
	            if (logObject.options) {
	                const { maxIdleTimeMS, minPoolSize, maxPoolSize, maxConnecting, waitQueueTimeoutMS } = logObject.options;
	                log = {
	                    ...log,
	                    maxIdleTimeMS,
	                    minPoolSize,
	                    maxPoolSize,
	                    maxConnecting,
	                    waitQueueTimeoutMS
	                };
	            }
	            return log;
	        case constants_1.CONNECTION_POOL_READY:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection pool ready';
	            return log;
	        case constants_1.CONNECTION_POOL_CLEARED:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection pool cleared';
	            if (logObject.serviceId?._bsontype === 'ObjectId') {
	                log.serviceId = logObject.serviceId.toHexString();
	            }
	            return log;
	        case constants_1.CONNECTION_POOL_CLOSED:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection pool closed';
	            return log;
	        case constants_1.CONNECTION_CREATED:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection created';
	            log.driverConnectionId = logObject.connectionId;
	            return log;
	        case constants_1.CONNECTION_READY:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection ready';
	            log.driverConnectionId = logObject.connectionId;
	            return log;
	        case constants_1.CONNECTION_CLOSED:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection closed';
	            log.driverConnectionId = logObject.connectionId;
	            switch (logObject.reason) {
	                case 'stale':
	                    log.reason = 'Connection became stale because the pool was cleared';
	                    break;
	                case 'idle':
	                    log.reason =
	                        'Connection has been available but unused for longer than the configured max idle time';
	                    break;
	                case 'error':
	                    log.reason = 'An error occurred while using the connection';
	                    if (logObject.error) {
	                        log.error = logObject.error;
	                    }
	                    break;
	                case 'poolClosed':
	                    log.reason = 'Connection pool was closed';
	                    break;
	                default:
	                    log.reason = `Unknown close reason: ${logObject.reason}`;
	            }
	            return log;
	        case constants_1.CONNECTION_CHECK_OUT_STARTED:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection checkout started';
	            return log;
	        case constants_1.CONNECTION_CHECK_OUT_FAILED:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection checkout failed';
	            switch (logObject.reason) {
	                case 'poolClosed':
	                    log.reason = 'Connection pool was closed';
	                    break;
	                case 'timeout':
	                    log.reason = 'Wait queue timeout elapsed without a connection becoming available';
	                    break;
	                case 'connectionError':
	                    log.reason = 'An error occurred while trying to establish a new connection';
	                    if (logObject.error) {
	                        log.error = logObject.error;
	                    }
	                    break;
	                default:
	                    log.reason = `Unknown close reason: ${logObject.reason}`;
	            }
	            return log;
	        case constants_1.CONNECTION_CHECKED_OUT:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection checked out';
	            log.driverConnectionId = logObject.connectionId;
	            return log;
	        case constants_1.CONNECTION_CHECKED_IN:
	            log = attachConnectionFields(log, logObject);
	            log.message = 'Connection checked in';
	            log.driverConnectionId = logObject.connectionId;
	            return log;
	        default:
	            for (const [key, value] of Object.entries(logObject)) {
	                if (value != null)
	                    log[key] = value;
	            }
	    }
	    return log;
	}
	/** @internal */
	class MongoLogger {
	    constructor(options) {
	        /**
	         * This method should be used when logging errors that do not have a public driver API for
	         * reporting errors.
	         */
	        this.error = this.log.bind(this, 'error');
	        /**
	         * This method should be used to log situations where undesirable application behaviour might
	         * occur. For example, failing to end sessions on `MongoClient.close`.
	         */
	        this.warn = this.log.bind(this, 'warn');
	        /**
	         * This method should be used to report high-level information about normal driver behaviour.
	         * For example, the creation of a `MongoClient`.
	         */
	        this.info = this.log.bind(this, 'info');
	        /**
	         * This method should be used to report information that would be helpful when debugging an
	         * application. For example, a command starting, succeeding or failing.
	         */
	        this.debug = this.log.bind(this, 'debug');
	        /**
	         * This method should be used to report fine-grained details related to logic flow. For example,
	         * entering and exiting a function body.
	         */
	        this.trace = this.log.bind(this, 'trace');
	        this.componentSeverities = options.componentSeverities;
	        this.maxDocumentLength = options.maxDocumentLength;
	        this.logDestination = options.logDestination;
	    }
	    log(severity, component, message) {
	        if (compareSeverity(severity, this.componentSeverities[component]) > 0)
	            return;
	        let logMessage = { t: new Date(), c: component, s: severity };
	        if (typeof message === 'string') {
	            logMessage.message = message;
	        }
	        else if (typeof message === 'object') {
	            if (isLogConvertible(message)) {
	                logMessage = { ...logMessage, ...message.toLog() };
	            }
	            else {
	                logMessage = { ...logMessage, ...defaultLogTransform(message, this.maxDocumentLength) };
	            }
	        }
	        this.logDestination.write(logMessage);
	    }
	    /**
	     * Merges options set through environment variables and the MongoClient, preferring environment
	     * variables when both are set, and substituting defaults for values not set. Options set in
	     * constructor take precedence over both environment variables and MongoClient options.
	     *
	     * @remarks
	     * When parsing component severity levels, invalid values are treated as unset and replaced with
	     * the default severity.
	     *
	     * @param envOptions - options set for the logger from the environment
	     * @param clientOptions - options set for the logger in the MongoClient options
	     * @returns a MongoLoggerOptions object to be used when instantiating a new MongoLogger
	     */
	    static resolveOptions(envOptions, clientOptions) {
	        // client options take precedence over env options
	        const combinedOptions = {
	            ...envOptions,
	            ...clientOptions,
	            mongodbLogPath: resolveLogPath(envOptions, clientOptions)
	        };
	        const defaultSeverity = parseSeverityFromString(combinedOptions.MONGODB_LOG_ALL) ?? exports.SeverityLevel.OFF;
	        return {
	            componentSeverities: {
	                command: parseSeverityFromString(combinedOptions.MONGODB_LOG_COMMAND) ?? defaultSeverity,
	                topology: parseSeverityFromString(combinedOptions.MONGODB_LOG_TOPOLOGY) ?? defaultSeverity,
	                serverSelection: parseSeverityFromString(combinedOptions.MONGODB_LOG_SERVER_SELECTION) ?? defaultSeverity,
	                connection: parseSeverityFromString(combinedOptions.MONGODB_LOG_CONNECTION) ?? defaultSeverity,
	                default: defaultSeverity
	            },
	            maxDocumentLength: (0, utils_1.parseUnsignedInteger)(combinedOptions.MONGODB_LOG_MAX_DOCUMENT_LENGTH) ?? 1000,
	            logDestination: combinedOptions.mongodbLogPath
	        };
	    }
	}
	exports.MongoLogger = MongoLogger;
	
} (mongo_logger));

var hasRequiredConnection_string;

function requireConnection_string () {
	if (hasRequiredConnection_string) return connection_string;
	hasRequiredConnection_string = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.FEATURE_FLAGS = exports.DEFAULT_OPTIONS = exports.OPTIONS = exports.parseOptions = exports.resolveSRVRecord = void 0;
		const dns = require$$0$3;
		const fs = require$$0$2;
		const mongodb_connection_string_url_1 = require$$2$1;
		const url_1 = require$$3;
		const mongo_credentials_1 = mongo_credentials;
		const providers_1 = providers;
		const client_metadata_1 = client_metadata;
		const compression_1 = compression;
		const encrypter_1 = requireEncrypter();
		const error_1 = error;
		const mongo_client_1 = requireMongo_client();
		const mongo_logger_1 = mongo_logger;
		const read_concern_1 = read_concern;
		const read_preference_1 = read_preference;
		const utils_1 = utils;
		const write_concern_1 = write_concern;
		const VALID_TXT_RECORDS = ['authSource', 'replicaSet', 'loadBalanced'];
		const LB_SINGLE_HOST_ERROR = 'loadBalanced option only supported with a single host in the URI';
		const LB_REPLICA_SET_ERROR = 'loadBalanced option not supported with a replicaSet option';
		const LB_DIRECT_CONNECTION_ERROR = 'loadBalanced option not supported when directConnection is provided';
		/**
		 * Lookup a `mongodb+srv` connection string, combine the parts and reparse it as a normal
		 * connection string.
		 *
		 * @param uri - The connection string to parse
		 * @param options - Optional user provided connection string options
		 */
		async function resolveSRVRecord(options) {
		    if (typeof options.srvHost !== 'string') {
		        throw new error_1.MongoAPIError('Option "srvHost" must not be empty');
		    }
		    if (options.srvHost.split('.').length < 3) {
		        // TODO(NODE-3484): Replace with MongoConnectionStringError
		        throw new error_1.MongoAPIError('URI must include hostname, domain name, and tld');
		    }
		    // Resolve the SRV record and use the result as the list of hosts to connect to.
		    const lookupAddress = options.srvHost;
		    const addresses = await dns.promises.resolveSrv(`_${options.srvServiceName}._tcp.${lookupAddress}`);
		    if (addresses.length === 0) {
		        throw new error_1.MongoAPIError('No addresses found at host');
		    }
		    for (const { name } of addresses) {
		        if (!(0, utils_1.matchesParentDomain)(name, lookupAddress)) {
		            throw new error_1.MongoAPIError('Server record does not share hostname with parent URI');
		        }
		    }
		    const hostAddresses = addresses.map(r => utils_1.HostAddress.fromString(`${r.name}:${r.port ?? 27017}`));
		    validateLoadBalancedOptions(hostAddresses, options, true);
		    // Resolve TXT record and add options from there if they exist.
		    let record;
		    try {
		        record = await dns.promises.resolveTxt(lookupAddress);
		    }
		    catch (error) {
		        if (error.code !== 'ENODATA' && error.code !== 'ENOTFOUND') {
		            throw error;
		        }
		        return hostAddresses;
		    }
		    if (record.length > 1) {
		        throw new error_1.MongoParseError('Multiple text records not allowed');
		    }
		    const txtRecordOptions = new url_1.URLSearchParams(record[0].join(''));
		    const txtRecordOptionKeys = [...txtRecordOptions.keys()];
		    if (txtRecordOptionKeys.some(key => !VALID_TXT_RECORDS.includes(key))) {
		        throw new error_1.MongoParseError(`Text record may only set any of: ${VALID_TXT_RECORDS.join(', ')}`);
		    }
		    if (VALID_TXT_RECORDS.some(option => txtRecordOptions.get(option) === '')) {
		        throw new error_1.MongoParseError('Cannot have empty URI params in DNS TXT Record');
		    }
		    const source = txtRecordOptions.get('authSource') ?? undefined;
		    const replicaSet = txtRecordOptions.get('replicaSet') ?? undefined;
		    const loadBalanced = txtRecordOptions.get('loadBalanced') ?? undefined;
		    if (!options.userSpecifiedAuthSource &&
		        source &&
		        options.credentials &&
		        !providers_1.AUTH_MECHS_AUTH_SRC_EXTERNAL.has(options.credentials.mechanism)) {
		        options.credentials = mongo_credentials_1.MongoCredentials.merge(options.credentials, { source });
		    }
		    if (!options.userSpecifiedReplicaSet && replicaSet) {
		        options.replicaSet = replicaSet;
		    }
		    if (loadBalanced === 'true') {
		        options.loadBalanced = true;
		    }
		    if (options.replicaSet && options.srvMaxHosts > 0) {
		        throw new error_1.MongoParseError('Cannot combine replicaSet option with srvMaxHosts');
		    }
		    validateLoadBalancedOptions(hostAddresses, options, true);
		    return hostAddresses;
		}
		exports.resolveSRVRecord = resolveSRVRecord;
		/**
		 * Checks if TLS options are valid
		 *
		 * @param allOptions - All options provided by user or included in default options map
		 * @throws MongoAPIError if TLS options are invalid
		 */
		function checkTLSOptions(allOptions) {
		    if (!allOptions)
		        return;
		    const check = (a, b) => {
		        if (allOptions.has(a) && allOptions.has(b)) {
		            throw new error_1.MongoAPIError(`The '${a}' option cannot be used with the '${b}' option`);
		        }
		    };
		    check('tlsInsecure', 'tlsAllowInvalidCertificates');
		    check('tlsInsecure', 'tlsAllowInvalidHostnames');
		    check('tlsInsecure', 'tlsDisableCertificateRevocationCheck');
		    check('tlsInsecure', 'tlsDisableOCSPEndpointCheck');
		    check('tlsAllowInvalidCertificates', 'tlsDisableCertificateRevocationCheck');
		    check('tlsAllowInvalidCertificates', 'tlsDisableOCSPEndpointCheck');
		    check('tlsDisableCertificateRevocationCheck', 'tlsDisableOCSPEndpointCheck');
		}
		const TRUTHS = new Set(['true', 't', '1', 'y', 'yes']);
		const FALSEHOODS = new Set(['false', 'f', '0', 'n', 'no', '-1']);
		function getBoolean(name, value) {
		    if (typeof value === 'boolean')
		        return value;
		    const valueString = String(value).toLowerCase();
		    if (TRUTHS.has(valueString)) {
		        if (valueString !== 'true') {
		            (0, utils_1.emitWarningOnce)(`deprecated value for ${name} : ${valueString} - please update to ${name} : true instead`);
		        }
		        return true;
		    }
		    if (FALSEHOODS.has(valueString)) {
		        if (valueString !== 'false') {
		            (0, utils_1.emitWarningOnce)(`deprecated value for ${name} : ${valueString} - please update to ${name} : false instead`);
		        }
		        return false;
		    }
		    throw new error_1.MongoParseError(`Expected ${name} to be stringified boolean value, got: ${value}`);
		}
		function getIntFromOptions(name, value) {
		    const parsedInt = (0, utils_1.parseInteger)(value);
		    if (parsedInt != null) {
		        return parsedInt;
		    }
		    throw new error_1.MongoParseError(`Expected ${name} to be stringified int value, got: ${value}`);
		}
		function getUIntFromOptions(name, value) {
		    const parsedValue = getIntFromOptions(name, value);
		    if (parsedValue < 0) {
		        throw new error_1.MongoParseError(`${name} can only be a positive int value, got: ${value}`);
		    }
		    return parsedValue;
		}
		function* entriesFromString(value) {
		    const keyValuePairs = value.split(',');
		    for (const keyValue of keyValuePairs) {
		        const [key, value] = keyValue.split(/:(.*)/);
		        if (value == null) {
		            throw new error_1.MongoParseError('Cannot have undefined values in key value pairs');
		        }
		        yield [key, value];
		    }
		}
		class CaseInsensitiveMap extends Map {
		    constructor(entries = []) {
		        super(entries.map(([k, v]) => [k.toLowerCase(), v]));
		    }
		    has(k) {
		        return super.has(k.toLowerCase());
		    }
		    get(k) {
		        return super.get(k.toLowerCase());
		    }
		    set(k, v) {
		        return super.set(k.toLowerCase(), v);
		    }
		    delete(k) {
		        return super.delete(k.toLowerCase());
		    }
		}
		function parseOptions(uri, mongoClient = undefined, options = {}) {
		    if (mongoClient != null && !(mongoClient instanceof mongo_client_1.MongoClient)) {
		        options = mongoClient;
		        mongoClient = undefined;
		    }
		    // validate BSONOptions
		    if (options.useBigInt64 && typeof options.promoteLongs === 'boolean' && !options.promoteLongs) {
		        throw new error_1.MongoAPIError('Must request either bigint or Long for int64 deserialization');
		    }
		    if (options.useBigInt64 && typeof options.promoteValues === 'boolean' && !options.promoteValues) {
		        throw new error_1.MongoAPIError('Must request either bigint or Long for int64 deserialization');
		    }
		    const url = new mongodb_connection_string_url_1.default(uri);
		    const { hosts, isSRV } = url;
		    const mongoOptions = Object.create(null);
		    // Feature flags
		    for (const flag of Object.getOwnPropertySymbols(options)) {
		        if (exports.FEATURE_FLAGS.has(flag)) {
		            mongoOptions[flag] = options[flag];
		        }
		    }
		    mongoOptions.hosts = isSRV ? [] : hosts.map(utils_1.HostAddress.fromString);
		    const urlOptions = new CaseInsensitiveMap();
		    if (url.pathname !== '/' && url.pathname !== '') {
		        const dbName = decodeURIComponent(url.pathname[0] === '/' ? url.pathname.slice(1) : url.pathname);
		        if (dbName) {
		            urlOptions.set('dbName', [dbName]);
		        }
		    }
		    if (url.username !== '') {
		        const auth = {
		            username: decodeURIComponent(url.username)
		        };
		        if (typeof url.password === 'string') {
		            auth.password = decodeURIComponent(url.password);
		        }
		        urlOptions.set('auth', [auth]);
		    }
		    for (const key of url.searchParams.keys()) {
		        const values = [...url.searchParams.getAll(key)];
		        if (values.includes('')) {
		            throw new error_1.MongoAPIError('URI cannot contain options with no value');
		        }
		        if (!urlOptions.has(key)) {
		            urlOptions.set(key, values);
		        }
		    }
		    const objectOptions = new CaseInsensitiveMap(Object.entries(options).filter(([, v]) => v != null));
		    // Validate options that can only be provided by one of uri or object
		    if (urlOptions.has('serverApi')) {
		        throw new error_1.MongoParseError('URI cannot contain `serverApi`, it can only be passed to the client');
		    }
		    const uriMechanismProperties = urlOptions.get('authMechanismProperties');
		    if (uriMechanismProperties) {
		        for (const property of uriMechanismProperties) {
		            if (/(^|,)ALLOWED_HOSTS:/.test(property)) {
		                throw new error_1.MongoParseError('Auth mechanism property ALLOWED_HOSTS is not allowed in the connection string.');
		            }
		        }
		    }
		    if (objectOptions.has('loadBalanced')) {
		        throw new error_1.MongoParseError('loadBalanced is only a valid option in the URI');
		    }
		    // All option collection
		    const allProvidedOptions = new CaseInsensitiveMap();
		    const allProvidedKeys = new Set([...urlOptions.keys(), ...objectOptions.keys()]);
		    for (const key of allProvidedKeys) {
		        const values = [];
		        const objectOptionValue = objectOptions.get(key);
		        if (objectOptionValue != null) {
		            values.push(objectOptionValue);
		        }
		        const urlValues = urlOptions.get(key) ?? [];
		        values.push(...urlValues);
		        allProvidedOptions.set(key, values);
		    }
		    if (allProvidedOptions.has('tlsCertificateKeyFile') &&
		        !allProvidedOptions.has('tlsCertificateFile')) {
		        allProvidedOptions.set('tlsCertificateFile', allProvidedOptions.get('tlsCertificateKeyFile'));
		    }
		    if (allProvidedOptions.has('tls') || allProvidedOptions.has('ssl')) {
		        const tlsAndSslOpts = (allProvidedOptions.get('tls') || [])
		            .concat(allProvidedOptions.get('ssl') || [])
		            .map(getBoolean.bind(null, 'tls/ssl'));
		        if (new Set(tlsAndSslOpts).size !== 1) {
		            throw new error_1.MongoParseError('All values of tls/ssl must be the same.');
		        }
		    }
		    checkTLSOptions(allProvidedOptions);
		    const unsupportedOptions = (0, utils_1.setDifference)(allProvidedKeys, Array.from(Object.keys(exports.OPTIONS)).map(s => s.toLowerCase()));
		    if (unsupportedOptions.size !== 0) {
		        const optionWord = unsupportedOptions.size > 1 ? 'options' : 'option';
		        const isOrAre = unsupportedOptions.size > 1 ? 'are' : 'is';
		        throw new error_1.MongoParseError(`${optionWord} ${Array.from(unsupportedOptions).join(', ')} ${isOrAre} not supported`);
		    }
		    // Option parsing and setting
		    for (const [key, descriptor] of Object.entries(exports.OPTIONS)) {
		        const values = allProvidedOptions.get(key);
		        if (!values || values.length === 0) {
		            if (exports.DEFAULT_OPTIONS.has(key)) {
		                setOption(mongoOptions, key, descriptor, [exports.DEFAULT_OPTIONS.get(key)]);
		            }
		        }
		        else {
		            const { deprecated } = descriptor;
		            if (deprecated) {
		                const deprecatedMsg = typeof deprecated === 'string' ? `: ${deprecated}` : '';
		                (0, utils_1.emitWarning)(`${key} is a deprecated option${deprecatedMsg}`);
		            }
		            setOption(mongoOptions, key, descriptor, values);
		        }
		    }
		    if (mongoOptions.credentials) {
		        const isGssapi = mongoOptions.credentials.mechanism === providers_1.AuthMechanism.MONGODB_GSSAPI;
		        const isX509 = mongoOptions.credentials.mechanism === providers_1.AuthMechanism.MONGODB_X509;
		        const isAws = mongoOptions.credentials.mechanism === providers_1.AuthMechanism.MONGODB_AWS;
		        const isOidc = mongoOptions.credentials.mechanism === providers_1.AuthMechanism.MONGODB_OIDC;
		        if ((isGssapi || isX509) &&
		            allProvidedOptions.has('authSource') &&
		            mongoOptions.credentials.source !== '$external') {
		            // If authSource was explicitly given and its incorrect, we error
		            throw new error_1.MongoParseError(`authMechanism ${mongoOptions.credentials.mechanism} requires an authSource of '$external'`);
		        }
		        if (!(isGssapi || isX509 || isAws || isOidc) &&
		            mongoOptions.dbName &&
		            !allProvidedOptions.has('authSource')) {
		            // inherit the dbName unless GSSAPI or X509, then silently ignore dbName
		            // and there was no specific authSource given
		            mongoOptions.credentials = mongo_credentials_1.MongoCredentials.merge(mongoOptions.credentials, {
		                source: mongoOptions.dbName
		            });
		        }
		        if (isAws && mongoOptions.credentials.username && !mongoOptions.credentials.password) {
		            throw new error_1.MongoMissingCredentialsError(`When using ${mongoOptions.credentials.mechanism} password must be set when a username is specified`);
		        }
		        mongoOptions.credentials.validate();
		        // Check if the only auth related option provided was authSource, if so we can remove credentials
		        if (mongoOptions.credentials.password === '' &&
		            mongoOptions.credentials.username === '' &&
		            mongoOptions.credentials.mechanism === providers_1.AuthMechanism.MONGODB_DEFAULT &&
		            Object.keys(mongoOptions.credentials.mechanismProperties).length === 0) {
		            delete mongoOptions.credentials;
		        }
		    }
		    if (!mongoOptions.dbName) {
		        // dbName default is applied here because of the credential validation above
		        mongoOptions.dbName = 'test';
		    }
		    validateLoadBalancedOptions(hosts, mongoOptions, isSRV);
		    if (mongoClient && mongoOptions.autoEncryption) {
		        encrypter_1.Encrypter.checkForMongoCrypt();
		        mongoOptions.encrypter = new encrypter_1.Encrypter(mongoClient, uri, options);
		        mongoOptions.autoEncrypter = mongoOptions.encrypter.autoEncrypter;
		    }
		    // Potential SRV Overrides and SRV connection string validations
		    mongoOptions.userSpecifiedAuthSource =
		        objectOptions.has('authSource') || urlOptions.has('authSource');
		    mongoOptions.userSpecifiedReplicaSet =
		        objectOptions.has('replicaSet') || urlOptions.has('replicaSet');
		    if (isSRV) {
		        // SRV Record is resolved upon connecting
		        mongoOptions.srvHost = hosts[0];
		        if (mongoOptions.directConnection) {
		            throw new error_1.MongoAPIError('SRV URI does not support directConnection');
		        }
		        if (mongoOptions.srvMaxHosts > 0 && typeof mongoOptions.replicaSet === 'string') {
		            throw new error_1.MongoParseError('Cannot use srvMaxHosts option with replicaSet');
		        }
		        // SRV turns on TLS by default, but users can override and turn it off
		        const noUserSpecifiedTLS = !objectOptions.has('tls') && !urlOptions.has('tls');
		        const noUserSpecifiedSSL = !objectOptions.has('ssl') && !urlOptions.has('ssl');
		        if (noUserSpecifiedTLS && noUserSpecifiedSSL) {
		            mongoOptions.tls = true;
		        }
		    }
		    else {
		        const userSpecifiedSrvOptions = urlOptions.has('srvMaxHosts') ||
		            objectOptions.has('srvMaxHosts') ||
		            urlOptions.has('srvServiceName') ||
		            objectOptions.has('srvServiceName');
		        if (userSpecifiedSrvOptions) {
		            throw new error_1.MongoParseError('Cannot use srvMaxHosts or srvServiceName with a non-srv connection string');
		        }
		    }
		    if (mongoOptions.directConnection && mongoOptions.hosts.length !== 1) {
		        throw new error_1.MongoParseError('directConnection option requires exactly one host');
		    }
		    if (!mongoOptions.proxyHost &&
		        (mongoOptions.proxyPort || mongoOptions.proxyUsername || mongoOptions.proxyPassword)) {
		        throw new error_1.MongoParseError('Must specify proxyHost if other proxy options are passed');
		    }
		    if ((mongoOptions.proxyUsername && !mongoOptions.proxyPassword) ||
		        (!mongoOptions.proxyUsername && mongoOptions.proxyPassword)) {
		        throw new error_1.MongoParseError('Can only specify both of proxy username/password or neither');
		    }
		    const proxyOptions = ['proxyHost', 'proxyPort', 'proxyUsername', 'proxyPassword'].map(key => urlOptions.get(key) ?? []);
		    if (proxyOptions.some(options => options.length > 1)) {
		        throw new error_1.MongoParseError('Proxy options cannot be specified multiple times in the connection string');
		    }
		    const loggerFeatureFlag = Symbol.for('@@mdb.enableMongoLogger');
		    mongoOptions[loggerFeatureFlag] = mongoOptions[loggerFeatureFlag] ?? false;
		    let loggerEnvOptions = {};
		    let loggerClientOptions = {};
		    if (mongoOptions[loggerFeatureFlag]) {
		        loggerEnvOptions = {
		            MONGODB_LOG_COMMAND: process.env.MONGODB_LOG_COMMAND,
		            MONGODB_LOG_TOPOLOGY: process.env.MONGODB_LOG_TOPOLOGY,
		            MONGODB_LOG_SERVER_SELECTION: process.env.MONGODB_LOG_SERVER_SELECTION,
		            MONGODB_LOG_CONNECTION: process.env.MONGODB_LOG_CONNECTION,
		            MONGODB_LOG_ALL: process.env.MONGODB_LOG_ALL,
		            MONGODB_LOG_MAX_DOCUMENT_LENGTH: process.env.MONGODB_LOG_MAX_DOCUMENT_LENGTH,
		            MONGODB_LOG_PATH: process.env.MONGODB_LOG_PATH,
		            ...mongoOptions[Symbol.for('@@mdb.internalLoggerConfig')]
		        };
		        loggerClientOptions = {
		            mongodbLogPath: mongoOptions.mongodbLogPath
		        };
		    }
		    mongoOptions.mongoLoggerOptions = mongo_logger_1.MongoLogger.resolveOptions(loggerEnvOptions, loggerClientOptions);
		    mongoOptions.metadata = (0, client_metadata_1.makeClientMetadata)(mongoOptions);
		    return mongoOptions;
		}
		exports.parseOptions = parseOptions;
		/**
		 * #### Throws if LB mode is true:
		 * - hosts contains more than one host
		 * - there is a replicaSet name set
		 * - directConnection is set
		 * - if srvMaxHosts is used when an srv connection string is passed in
		 *
		 * @throws MongoParseError
		 */
		function validateLoadBalancedOptions(hosts, mongoOptions, isSrv) {
		    if (mongoOptions.loadBalanced) {
		        if (hosts.length > 1) {
		            throw new error_1.MongoParseError(LB_SINGLE_HOST_ERROR);
		        }
		        if (mongoOptions.replicaSet) {
		            throw new error_1.MongoParseError(LB_REPLICA_SET_ERROR);
		        }
		        if (mongoOptions.directConnection) {
		            throw new error_1.MongoParseError(LB_DIRECT_CONNECTION_ERROR);
		        }
		        if (isSrv && mongoOptions.srvMaxHosts > 0) {
		            throw new error_1.MongoParseError('Cannot limit srv hosts with loadBalanced enabled');
		        }
		    }
		    return;
		}
		function setOption(mongoOptions, key, descriptor, values) {
		    const { target, type, transform } = descriptor;
		    const name = target ?? key;
		    switch (type) {
		        case 'boolean':
		            mongoOptions[name] = getBoolean(name, values[0]);
		            break;
		        case 'int':
		            mongoOptions[name] = getIntFromOptions(name, values[0]);
		            break;
		        case 'uint':
		            mongoOptions[name] = getUIntFromOptions(name, values[0]);
		            break;
		        case 'string':
		            if (values[0] == null) {
		                break;
		            }
		            mongoOptions[name] = String(values[0]);
		            break;
		        case 'record':
		            if (!(0, utils_1.isRecord)(values[0])) {
		                throw new error_1.MongoParseError(`${name} must be an object`);
		            }
		            mongoOptions[name] = values[0];
		            break;
		        case 'any':
		            mongoOptions[name] = values[0];
		            break;
		        default: {
		            if (!transform) {
		                throw new error_1.MongoParseError('Descriptors missing a type must define a transform');
		            }
		            const transformValue = transform({ name, options: mongoOptions, values });
		            mongoOptions[name] = transformValue;
		            break;
		        }
		    }
		}
		exports.OPTIONS = {
		    appName: {
		        type: 'string'
		    },
		    auth: {
		        target: 'credentials',
		        transform({ name, options, values: [value] }) {
		            if (!(0, utils_1.isRecord)(value, ['username', 'password'])) {
		                throw new error_1.MongoParseError(`${name} must be an object with 'username' and 'password' properties`);
		            }
		            return mongo_credentials_1.MongoCredentials.merge(options.credentials, {
		                username: value.username,
		                password: value.password
		            });
		        }
		    },
		    authMechanism: {
		        target: 'credentials',
		        transform({ options, values: [value] }) {
		            const mechanisms = Object.values(providers_1.AuthMechanism);
		            const [mechanism] = mechanisms.filter(m => m.match(RegExp(String.raw `\b${value}\b`, 'i')));
		            if (!mechanism) {
		                throw new error_1.MongoParseError(`authMechanism one of ${mechanisms}, got ${value}`);
		            }
		            let source = options.credentials?.source;
		            if (mechanism === providers_1.AuthMechanism.MONGODB_PLAIN ||
		                providers_1.AUTH_MECHS_AUTH_SRC_EXTERNAL.has(mechanism)) {
		                // some mechanisms have '$external' as the Auth Source
		                source = '$external';
		            }
		            let password = options.credentials?.password;
		            if (mechanism === providers_1.AuthMechanism.MONGODB_X509 && password === '') {
		                password = undefined;
		            }
		            return mongo_credentials_1.MongoCredentials.merge(options.credentials, {
		                mechanism,
		                source,
		                password
		            });
		        }
		    },
		    authMechanismProperties: {
		        target: 'credentials',
		        transform({ options, values }) {
		            // We can have a combination of options passed in the URI and options passed
		            // as an object to the MongoClient. So we must transform the string options
		            // as well as merge them together with a potentially provided object.
		            let mechanismProperties = Object.create(null);
		            for (const optionValue of values) {
		                if (typeof optionValue === 'string') {
		                    for (const [key, value] of entriesFromString(optionValue)) {
		                        try {
		                            mechanismProperties[key] = getBoolean(key, value);
		                        }
		                        catch {
		                            mechanismProperties[key] = value;
		                        }
		                    }
		                }
		                else {
		                    if (!(0, utils_1.isRecord)(optionValue)) {
		                        throw new error_1.MongoParseError('AuthMechanismProperties must be an object');
		                    }
		                    mechanismProperties = { ...optionValue };
		                }
		            }
		            return mongo_credentials_1.MongoCredentials.merge(options.credentials, {
		                mechanismProperties
		            });
		        }
		    },
		    authSource: {
		        target: 'credentials',
		        transform({ options, values: [value] }) {
		            const source = String(value);
		            return mongo_credentials_1.MongoCredentials.merge(options.credentials, { source });
		        }
		    },
		    autoEncryption: {
		        type: 'record'
		    },
		    bsonRegExp: {
		        type: 'boolean'
		    },
		    serverApi: {
		        target: 'serverApi',
		        transform({ values: [version] }) {
		            const serverApiToValidate = typeof version === 'string' ? { version } : version;
		            const versionToValidate = serverApiToValidate && serverApiToValidate.version;
		            if (!versionToValidate) {
		                throw new error_1.MongoParseError(`Invalid \`serverApi\` property; must specify a version from the following enum: ["${Object.values(mongo_client_1.ServerApiVersion).join('", "')}"]`);
		            }
		            if (!Object.values(mongo_client_1.ServerApiVersion).some(v => v === versionToValidate)) {
		                throw new error_1.MongoParseError(`Invalid server API version=${versionToValidate}; must be in the following enum: ["${Object.values(mongo_client_1.ServerApiVersion).join('", "')}"]`);
		            }
		            return serverApiToValidate;
		        }
		    },
		    checkKeys: {
		        type: 'boolean'
		    },
		    compressors: {
		        default: 'none',
		        target: 'compressors',
		        transform({ values }) {
		            const compressionList = new Set();
		            for (const compVal of values) {
		                const compValArray = typeof compVal === 'string' ? compVal.split(',') : compVal;
		                if (!Array.isArray(compValArray)) {
		                    throw new error_1.MongoInvalidArgumentError('compressors must be an array or a comma-delimited list of strings');
		                }
		                for (const c of compValArray) {
		                    if (Object.keys(compression_1.Compressor).includes(String(c))) {
		                        compressionList.add(String(c));
		                    }
		                    else {
		                        throw new error_1.MongoInvalidArgumentError(`${c} is not a valid compression mechanism. Must be one of: ${Object.keys(compression_1.Compressor)}.`);
		                    }
		                }
		            }
		            return [...compressionList];
		        }
		    },
		    connectTimeoutMS: {
		        default: 30000,
		        type: 'uint'
		    },
		    dbName: {
		        type: 'string'
		    },
		    directConnection: {
		        default: false,
		        type: 'boolean'
		    },
		    driverInfo: {
		        default: {},
		        type: 'record'
		    },
		    enableUtf8Validation: { type: 'boolean', default: true },
		    family: {
		        transform({ name, values: [value] }) {
		            const transformValue = getIntFromOptions(name, value);
		            if (transformValue === 4 || transformValue === 6) {
		                return transformValue;
		            }
		            throw new error_1.MongoParseError(`Option 'family' must be 4 or 6 got ${transformValue}.`);
		        }
		    },
		    fieldsAsRaw: {
		        type: 'record'
		    },
		    forceServerObjectId: {
		        default: false,
		        type: 'boolean'
		    },
		    fsync: {
		        deprecated: 'Please use journal instead',
		        target: 'writeConcern',
		        transform({ name, options, values: [value] }) {
		            const wc = write_concern_1.WriteConcern.fromOptions({
		                writeConcern: {
		                    ...options.writeConcern,
		                    fsync: getBoolean(name, value)
		                }
		            });
		            if (!wc)
		                throw new error_1.MongoParseError(`Unable to make a writeConcern from fsync=${value}`);
		            return wc;
		        }
		    },
		    heartbeatFrequencyMS: {
		        default: 10000,
		        type: 'uint'
		    },
		    ignoreUndefined: {
		        type: 'boolean'
		    },
		    j: {
		        deprecated: 'Please use journal instead',
		        target: 'writeConcern',
		        transform({ name, options, values: [value] }) {
		            const wc = write_concern_1.WriteConcern.fromOptions({
		                writeConcern: {
		                    ...options.writeConcern,
		                    journal: getBoolean(name, value)
		                }
		            });
		            if (!wc)
		                throw new error_1.MongoParseError(`Unable to make a writeConcern from journal=${value}`);
		            return wc;
		        }
		    },
		    journal: {
		        target: 'writeConcern',
		        transform({ name, options, values: [value] }) {
		            const wc = write_concern_1.WriteConcern.fromOptions({
		                writeConcern: {
		                    ...options.writeConcern,
		                    journal: getBoolean(name, value)
		                }
		            });
		            if (!wc)
		                throw new error_1.MongoParseError(`Unable to make a writeConcern from journal=${value}`);
		            return wc;
		        }
		    },
		    keepAlive: {
		        default: true,
		        type: 'boolean',
		        deprecated: 'Will not be able to turn off in the future.'
		    },
		    keepAliveInitialDelay: {
		        default: 120000,
		        type: 'uint',
		        deprecated: 'Will not be configurable in the future.'
		    },
		    loadBalanced: {
		        default: false,
		        type: 'boolean'
		    },
		    localThresholdMS: {
		        default: 15,
		        type: 'uint'
		    },
		    maxConnecting: {
		        default: 2,
		        transform({ name, values: [value] }) {
		            const maxConnecting = getUIntFromOptions(name, value);
		            if (maxConnecting === 0) {
		                throw new error_1.MongoInvalidArgumentError('maxConnecting must be > 0 if specified');
		            }
		            return maxConnecting;
		        }
		    },
		    maxIdleTimeMS: {
		        default: 0,
		        type: 'uint'
		    },
		    maxPoolSize: {
		        default: 100,
		        type: 'uint'
		    },
		    maxStalenessSeconds: {
		        target: 'readPreference',
		        transform({ name, options, values: [value] }) {
		            const maxStalenessSeconds = getUIntFromOptions(name, value);
		            if (options.readPreference) {
		                return read_preference_1.ReadPreference.fromOptions({
		                    readPreference: { ...options.readPreference, maxStalenessSeconds }
		                });
		            }
		            else {
		                return new read_preference_1.ReadPreference('secondary', undefined, { maxStalenessSeconds });
		            }
		        }
		    },
		    minInternalBufferSize: {
		        type: 'uint'
		    },
		    minPoolSize: {
		        default: 0,
		        type: 'uint'
		    },
		    minHeartbeatFrequencyMS: {
		        default: 500,
		        type: 'uint'
		    },
		    monitorCommands: {
		        default: false,
		        type: 'boolean'
		    },
		    name: {
		        target: 'driverInfo',
		        transform({ values: [value], options }) {
		            return { ...options.driverInfo, name: String(value) };
		        }
		    },
		    noDelay: {
		        default: true,
		        type: 'boolean'
		    },
		    pkFactory: {
		        default: utils_1.DEFAULT_PK_FACTORY,
		        transform({ values: [value] }) {
		            if ((0, utils_1.isRecord)(value, ['createPk']) && typeof value.createPk === 'function') {
		                return value;
		            }
		            throw new error_1.MongoParseError(`Option pkFactory must be an object with a createPk function, got ${value}`);
		        }
		    },
		    promoteBuffers: {
		        type: 'boolean'
		    },
		    promoteLongs: {
		        type: 'boolean'
		    },
		    promoteValues: {
		        type: 'boolean'
		    },
		    useBigInt64: {
		        type: 'boolean'
		    },
		    proxyHost: {
		        type: 'string'
		    },
		    proxyPassword: {
		        type: 'string'
		    },
		    proxyPort: {
		        type: 'uint'
		    },
		    proxyUsername: {
		        type: 'string'
		    },
		    raw: {
		        default: false,
		        type: 'boolean'
		    },
		    readConcern: {
		        transform({ values: [value], options }) {
		            if (value instanceof read_concern_1.ReadConcern || (0, utils_1.isRecord)(value, ['level'])) {
		                return read_concern_1.ReadConcern.fromOptions({ ...options.readConcern, ...value });
		            }
		            throw new error_1.MongoParseError(`ReadConcern must be an object, got ${JSON.stringify(value)}`);
		        }
		    },
		    readConcernLevel: {
		        target: 'readConcern',
		        transform({ values: [level], options }) {
		            return read_concern_1.ReadConcern.fromOptions({
		                ...options.readConcern,
		                level: level
		            });
		        }
		    },
		    readPreference: {
		        default: read_preference_1.ReadPreference.primary,
		        transform({ values: [value], options }) {
		            if (value instanceof read_preference_1.ReadPreference) {
		                return read_preference_1.ReadPreference.fromOptions({
		                    readPreference: { ...options.readPreference, ...value },
		                    ...value
		                });
		            }
		            if ((0, utils_1.isRecord)(value, ['mode'])) {
		                const rp = read_preference_1.ReadPreference.fromOptions({
		                    readPreference: { ...options.readPreference, ...value },
		                    ...value
		                });
		                if (rp)
		                    return rp;
		                else
		                    throw new error_1.MongoParseError(`Cannot make read preference from ${JSON.stringify(value)}`);
		            }
		            if (typeof value === 'string') {
		                const rpOpts = {
		                    hedge: options.readPreference?.hedge,
		                    maxStalenessSeconds: options.readPreference?.maxStalenessSeconds
		                };
		                return new read_preference_1.ReadPreference(value, options.readPreference?.tags, rpOpts);
		            }
		            throw new error_1.MongoParseError(`Unknown ReadPreference value: ${value}`);
		        }
		    },
		    readPreferenceTags: {
		        target: 'readPreference',
		        transform({ values, options }) {
		            const tags = Array.isArray(values[0])
		                ? values[0]
		                : values;
		            const readPreferenceTags = [];
		            for (const tag of tags) {
		                const readPreferenceTag = Object.create(null);
		                if (typeof tag === 'string') {
		                    for (const [k, v] of entriesFromString(tag)) {
		                        readPreferenceTag[k] = v;
		                    }
		                }
		                if ((0, utils_1.isRecord)(tag)) {
		                    for (const [k, v] of Object.entries(tag)) {
		                        readPreferenceTag[k] = v;
		                    }
		                }
		                readPreferenceTags.push(readPreferenceTag);
		            }
		            return read_preference_1.ReadPreference.fromOptions({
		                readPreference: options.readPreference,
		                readPreferenceTags
		            });
		        }
		    },
		    replicaSet: {
		        type: 'string'
		    },
		    retryReads: {
		        default: true,
		        type: 'boolean'
		    },
		    retryWrites: {
		        default: true,
		        type: 'boolean'
		    },
		    serializeFunctions: {
		        type: 'boolean'
		    },
		    serverSelectionTimeoutMS: {
		        default: 30000,
		        type: 'uint'
		    },
		    servername: {
		        type: 'string'
		    },
		    socketTimeoutMS: {
		        default: 0,
		        type: 'uint'
		    },
		    srvMaxHosts: {
		        type: 'uint',
		        default: 0
		    },
		    srvServiceName: {
		        type: 'string',
		        default: 'mongodb'
		    },
		    ssl: {
		        target: 'tls',
		        type: 'boolean'
		    },
		    sslCA: {
		        deprecated: 'sslCA is deprecated and will be removed in the next major version. Please use tlsCAFile instead.',
		        target: 'ca',
		        transform({ values: [value] }) {
		            return fs.readFileSync(String(value), { encoding: 'ascii' });
		        }
		    },
		    sslCRL: {
		        deprecated: 'sslCRL is deprecated and will be removed in the next major version. Please use tlsCertificateKeyFile instead.',
		        target: 'crl',
		        transform({ values: [value] }) {
		            return fs.readFileSync(String(value), { encoding: 'ascii' });
		        }
		    },
		    sslCert: {
		        deprecated: 'sslCert is deprecated and will be removed in the next major version. Please use tlsCertificateKeyFile instead.',
		        target: 'cert',
		        transform({ values: [value] }) {
		            return fs.readFileSync(String(value), { encoding: 'ascii' });
		        }
		    },
		    sslKey: {
		        deprecated: 'sslKey is deprecated and will be removed in the next major version. Please use tlsCertificateKeyFile instead.',
		        target: 'key',
		        transform({ values: [value] }) {
		            return fs.readFileSync(String(value), { encoding: 'ascii' });
		        }
		    },
		    sslPass: {
		        deprecated: 'sslPass is deprecated and will be removed in the next major version. Please use tlsCertificateKeyFilePassword instead.',
		        target: 'passphrase',
		        type: 'string'
		    },
		    sslValidate: {
		        deprecated: 'sslValidate is deprecated and will be removed in the next major version. Please use tlsAllowInvalidCertificates instead.',
		        target: 'rejectUnauthorized',
		        type: 'boolean'
		    },
		    tls: {
		        type: 'boolean'
		    },
		    tlsAllowInvalidCertificates: {
		        target: 'rejectUnauthorized',
		        transform({ name, values: [value] }) {
		            // allowInvalidCertificates is the inverse of rejectUnauthorized
		            return !getBoolean(name, value);
		        }
		    },
		    tlsAllowInvalidHostnames: {
		        target: 'checkServerIdentity',
		        transform({ name, values: [value] }) {
		            // tlsAllowInvalidHostnames means setting the checkServerIdentity function to a noop
		            return getBoolean(name, value) ? () => undefined : undefined;
		        }
		    },
		    tlsCAFile: {
		        target: 'ca',
		        transform({ values: [value] }) {
		            return fs.readFileSync(String(value), { encoding: 'ascii' });
		        }
		    },
		    tlsCertificateFile: {
		        deprecated: 'tlsCertificateFile is deprecated and will be removed in the next major version. Please use tlsCertificateKeyFile instead.',
		        target: 'cert',
		        transform({ values: [value] }) {
		            return fs.readFileSync(String(value), { encoding: 'ascii' });
		        }
		    },
		    tlsCertificateKeyFile: {
		        target: 'key',
		        transform({ values: [value] }) {
		            return fs.readFileSync(String(value), { encoding: 'ascii' });
		        }
		    },
		    tlsCertificateKeyFilePassword: {
		        target: 'passphrase',
		        type: 'any'
		    },
		    tlsInsecure: {
		        transform({ name, options, values: [value] }) {
		            const tlsInsecure = getBoolean(name, value);
		            if (tlsInsecure) {
		                options.checkServerIdentity = () => undefined;
		                options.rejectUnauthorized = false;
		            }
		            else {
		                options.checkServerIdentity = options.tlsAllowInvalidHostnames
		                    ? () => undefined
		                    : undefined;
		                options.rejectUnauthorized = options.tlsAllowInvalidCertificates ? false : true;
		            }
		            return tlsInsecure;
		        }
		    },
		    w: {
		        target: 'writeConcern',
		        transform({ values: [value], options }) {
		            return write_concern_1.WriteConcern.fromOptions({ writeConcern: { ...options.writeConcern, w: value } });
		        }
		    },
		    waitQueueTimeoutMS: {
		        default: 0,
		        type: 'uint'
		    },
		    writeConcern: {
		        target: 'writeConcern',
		        transform({ values: [value], options }) {
		            if ((0, utils_1.isRecord)(value) || value instanceof write_concern_1.WriteConcern) {
		                return write_concern_1.WriteConcern.fromOptions({
		                    writeConcern: {
		                        ...options.writeConcern,
		                        ...value
		                    }
		                });
		            }
		            else if (value === 'majority' || typeof value === 'number') {
		                return write_concern_1.WriteConcern.fromOptions({
		                    writeConcern: {
		                        ...options.writeConcern,
		                        w: value
		                    }
		                });
		            }
		            throw new error_1.MongoParseError(`Invalid WriteConcern cannot parse: ${JSON.stringify(value)}`);
		        }
		    },
		    wtimeout: {
		        deprecated: 'Please use wtimeoutMS instead',
		        target: 'writeConcern',
		        transform({ values: [value], options }) {
		            const wc = write_concern_1.WriteConcern.fromOptions({
		                writeConcern: {
		                    ...options.writeConcern,
		                    wtimeout: getUIntFromOptions('wtimeout', value)
		                }
		            });
		            if (wc)
		                return wc;
		            throw new error_1.MongoParseError(`Cannot make WriteConcern from wtimeout`);
		        }
		    },
		    wtimeoutMS: {
		        target: 'writeConcern',
		        transform({ values: [value], options }) {
		            const wc = write_concern_1.WriteConcern.fromOptions({
		                writeConcern: {
		                    ...options.writeConcern,
		                    wtimeoutMS: getUIntFromOptions('wtimeoutMS', value)
		                }
		            });
		            if (wc)
		                return wc;
		            throw new error_1.MongoParseError(`Cannot make WriteConcern from wtimeout`);
		        }
		    },
		    zlibCompressionLevel: {
		        default: 0,
		        type: 'int'
		    },
		    // Custom types for modifying core behavior
		    connectionType: { type: 'any' },
		    srvPoller: { type: 'any' },
		    // Accepted NodeJS Options
		    minDHSize: { type: 'any' },
		    pskCallback: { type: 'any' },
		    secureContext: { type: 'any' },
		    enableTrace: { type: 'any' },
		    requestCert: { type: 'any' },
		    rejectUnauthorized: { type: 'any' },
		    checkServerIdentity: { type: 'any' },
		    ALPNProtocols: { type: 'any' },
		    SNICallback: { type: 'any' },
		    session: { type: 'any' },
		    requestOCSP: { type: 'any' },
		    localAddress: { type: 'any' },
		    localPort: { type: 'any' },
		    hints: { type: 'any' },
		    lookup: { type: 'any' },
		    ca: { type: 'any' },
		    cert: { type: 'any' },
		    ciphers: { type: 'any' },
		    crl: { type: 'any' },
		    ecdhCurve: { type: 'any' },
		    key: { type: 'any' },
		    passphrase: { type: 'any' },
		    pfx: { type: 'any' },
		    secureProtocol: { type: 'any' },
		    index: { type: 'any' },
		    // Legacy Options, these are unused but left here to avoid errors with CSFLE lib
		    useNewUrlParser: { type: 'boolean' },
		    useUnifiedTopology: { type: 'boolean' },
		    // MongoLogger
		    // TODO(NODE-4849): Tighten the type of mongodbLogPath
		    mongodbLogPath: { type: 'any' }
		};
		exports.DEFAULT_OPTIONS = new CaseInsensitiveMap(Object.entries(exports.OPTIONS)
		    .filter(([, descriptor]) => descriptor.default != null)
		    .map(([k, d]) => [k, d.default]));
		/**
		 * Set of permitted feature flags
		 * @internal
		 */
		exports.FEATURE_FLAGS = new Set([
		    Symbol.for('@@mdb.skipPingOnConnect'),
		    Symbol.for('@@mdb.enableMongoLogger'),
		    Symbol.for('@@mdb.internalLoggerConfig')
		]);
		
	} (connection_string));
	return connection_string;
}

var topology = {};

var events = {};

Object.defineProperty(events, "__esModule", { value: true });
events.ServerHeartbeatFailedEvent = events.ServerHeartbeatSucceededEvent = events.ServerHeartbeatStartedEvent = events.TopologyClosedEvent = events.TopologyOpeningEvent = events.TopologyDescriptionChangedEvent = events.ServerClosedEvent = events.ServerOpeningEvent = events.ServerDescriptionChangedEvent = void 0;
/**
 * Emitted when server description changes, but does NOT include changes to the RTT.
 * @public
 * @category Event
 */
class ServerDescriptionChangedEvent {
    /** @internal */
    constructor(topologyId, address, previousDescription, newDescription) {
        this.topologyId = topologyId;
        this.address = address;
        this.previousDescription = previousDescription;
        this.newDescription = newDescription;
    }
}
events.ServerDescriptionChangedEvent = ServerDescriptionChangedEvent;
/**
 * Emitted when server is initialized.
 * @public
 * @category Event
 */
class ServerOpeningEvent {
    /** @internal */
    constructor(topologyId, address) {
        this.topologyId = topologyId;
        this.address = address;
    }
}
events.ServerOpeningEvent = ServerOpeningEvent;
/**
 * Emitted when server is closed.
 * @public
 * @category Event
 */
class ServerClosedEvent {
    /** @internal */
    constructor(topologyId, address) {
        this.topologyId = topologyId;
        this.address = address;
    }
}
events.ServerClosedEvent = ServerClosedEvent;
/**
 * Emitted when topology description changes.
 * @public
 * @category Event
 */
class TopologyDescriptionChangedEvent {
    /** @internal */
    constructor(topologyId, previousDescription, newDescription) {
        this.topologyId = topologyId;
        this.previousDescription = previousDescription;
        this.newDescription = newDescription;
    }
}
events.TopologyDescriptionChangedEvent = TopologyDescriptionChangedEvent;
/**
 * Emitted when topology is initialized.
 * @public
 * @category Event
 */
class TopologyOpeningEvent {
    /** @internal */
    constructor(topologyId) {
        this.topologyId = topologyId;
    }
}
events.TopologyOpeningEvent = TopologyOpeningEvent;
/**
 * Emitted when topology is closed.
 * @public
 * @category Event
 */
class TopologyClosedEvent {
    /** @internal */
    constructor(topologyId) {
        this.topologyId = topologyId;
    }
}
events.TopologyClosedEvent = TopologyClosedEvent;
/**
 * Emitted when the server monitor’s hello command is started - immediately before
 * the hello command is serialized into raw BSON and written to the socket.
 *
 * @public
 * @category Event
 */
class ServerHeartbeatStartedEvent {
    /** @internal */
    constructor(connectionId) {
        this.connectionId = connectionId;
    }
}
events.ServerHeartbeatStartedEvent = ServerHeartbeatStartedEvent;
/**
 * Emitted when the server monitor’s hello succeeds.
 * @public
 * @category Event
 */
class ServerHeartbeatSucceededEvent {
    /** @internal */
    constructor(connectionId, duration, reply) {
        this.connectionId = connectionId;
        this.duration = duration;
        this.reply = reply ?? {};
    }
}
events.ServerHeartbeatSucceededEvent = ServerHeartbeatSucceededEvent;
/**
 * Emitted when the server monitor’s hello fails, either with an “ok: 0” or a socket exception.
 * @public
 * @category Event
 */
class ServerHeartbeatFailedEvent {
    /** @internal */
    constructor(connectionId, duration, failure) {
        this.connectionId = connectionId;
        this.duration = duration;
        this.failure = failure;
    }
}
events.ServerHeartbeatFailedEvent = ServerHeartbeatFailedEvent;

var server = {};

var connection = {};

var command_monitoring_events = {};

var commands = {};

Object.defineProperty(commands, "__esModule", { value: true });
commands.BinMsg = commands.Msg = commands.Response = commands.Query = void 0;
const BSON$1 = bson;
const error_1$g = error;
const read_preference_1 = read_preference;
const utils_1$b = utils;
const constants_1$3 = constants$1;
// Incrementing request id
let _requestId = 0;
// Query flags
const OPTS_TAILABLE_CURSOR = 2;
const OPTS_SECONDARY = 4;
const OPTS_OPLOG_REPLAY = 8;
const OPTS_NO_CURSOR_TIMEOUT = 16;
const OPTS_AWAIT_DATA = 32;
const OPTS_EXHAUST = 64;
const OPTS_PARTIAL = 128;
// Response flags
const CURSOR_NOT_FOUND = 1;
const QUERY_FAILURE = 2;
const SHARD_CONFIG_STALE = 4;
const AWAIT_CAPABLE = 8;
/**************************************************************
 * QUERY
 **************************************************************/
/** @internal */
class Query {
    constructor(ns, query, options) {
        // Basic options needed to be passed in
        // TODO(NODE-3483): Replace with MongoCommandError
        if (ns == null)
            throw new error_1$g.MongoRuntimeError('Namespace must be specified for query');
        // TODO(NODE-3483): Replace with MongoCommandError
        if (query == null)
            throw new error_1$g.MongoRuntimeError('A query document must be specified for query');
        // Validate that we are not passing 0x00 in the collection name
        if (ns.indexOf('\x00') !== -1) {
            // TODO(NODE-3483): Use MongoNamespace static method
            throw new error_1$g.MongoRuntimeError('Namespace cannot contain a null character');
        }
        // Basic options
        this.ns = ns;
        this.query = query;
        // Additional options
        this.numberToSkip = options.numberToSkip || 0;
        this.numberToReturn = options.numberToReturn || 0;
        this.returnFieldSelector = options.returnFieldSelector || undefined;
        this.requestId = Query.getRequestId();
        // special case for pre-3.2 find commands, delete ASAP
        this.pre32Limit = options.pre32Limit;
        // Serialization option
        this.serializeFunctions =
            typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
        this.ignoreUndefined =
            typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : false;
        this.maxBsonSize = options.maxBsonSize || 1024 * 1024 * 16;
        this.checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
        this.batchSize = this.numberToReturn;
        // Flags
        this.tailable = false;
        this.secondaryOk = typeof options.secondaryOk === 'boolean' ? options.secondaryOk : false;
        this.oplogReplay = false;
        this.noCursorTimeout = false;
        this.awaitData = false;
        this.exhaust = false;
        this.partial = false;
    }
    /** Assign next request Id. */
    incRequestId() {
        this.requestId = _requestId++;
    }
    /** Peek next request Id. */
    nextRequestId() {
        return _requestId + 1;
    }
    /** Increment then return next request Id. */
    static getRequestId() {
        return ++_requestId;
    }
    // Uses a single allocated buffer for the process, avoiding multiple memory allocations
    toBin() {
        const buffers = [];
        let projection = null;
        // Set up the flags
        let flags = 0;
        if (this.tailable) {
            flags |= OPTS_TAILABLE_CURSOR;
        }
        if (this.secondaryOk) {
            flags |= OPTS_SECONDARY;
        }
        if (this.oplogReplay) {
            flags |= OPTS_OPLOG_REPLAY;
        }
        if (this.noCursorTimeout) {
            flags |= OPTS_NO_CURSOR_TIMEOUT;
        }
        if (this.awaitData) {
            flags |= OPTS_AWAIT_DATA;
        }
        if (this.exhaust) {
            flags |= OPTS_EXHAUST;
        }
        if (this.partial) {
            flags |= OPTS_PARTIAL;
        }
        // If batchSize is different to this.numberToReturn
        if (this.batchSize !== this.numberToReturn)
            this.numberToReturn = this.batchSize;
        // Allocate write protocol header buffer
        const header = Buffer.alloc(4 * 4 + // Header
            4 + // Flags
            Buffer.byteLength(this.ns) +
            1 + // namespace
            4 + // numberToSkip
            4 // numberToReturn
        );
        // Add header to buffers
        buffers.push(header);
        // Serialize the query
        const query = BSON$1.serialize(this.query, {
            checkKeys: this.checkKeys,
            serializeFunctions: this.serializeFunctions,
            ignoreUndefined: this.ignoreUndefined
        });
        // Add query document
        buffers.push(query);
        if (this.returnFieldSelector && Object.keys(this.returnFieldSelector).length > 0) {
            // Serialize the projection document
            projection = BSON$1.serialize(this.returnFieldSelector, {
                checkKeys: this.checkKeys,
                serializeFunctions: this.serializeFunctions,
                ignoreUndefined: this.ignoreUndefined
            });
            // Add projection document
            buffers.push(projection);
        }
        // Total message size
        const totalLength = header.length + query.length + (projection ? projection.length : 0);
        // Set up the index
        let index = 4;
        // Write total document length
        header[3] = (totalLength >> 24) & 0xff;
        header[2] = (totalLength >> 16) & 0xff;
        header[1] = (totalLength >> 8) & 0xff;
        header[0] = totalLength & 0xff;
        // Write header information requestId
        header[index + 3] = (this.requestId >> 24) & 0xff;
        header[index + 2] = (this.requestId >> 16) & 0xff;
        header[index + 1] = (this.requestId >> 8) & 0xff;
        header[index] = this.requestId & 0xff;
        index = index + 4;
        // Write header information responseTo
        header[index + 3] = (0 >> 24) & 0xff;
        header[index + 2] = (0 >> 16) & 0xff;
        header[index + 1] = (0 >> 8) & 0xff;
        header[index] = 0 & 0xff;
        index = index + 4;
        // Write header information OP_QUERY
        header[index + 3] = (constants_1$3.OP_QUERY >> 24) & 0xff;
        header[index + 2] = (constants_1$3.OP_QUERY >> 16) & 0xff;
        header[index + 1] = (constants_1$3.OP_QUERY >> 8) & 0xff;
        header[index] = constants_1$3.OP_QUERY & 0xff;
        index = index + 4;
        // Write header information flags
        header[index + 3] = (flags >> 24) & 0xff;
        header[index + 2] = (flags >> 16) & 0xff;
        header[index + 1] = (flags >> 8) & 0xff;
        header[index] = flags & 0xff;
        index = index + 4;
        // Write collection name
        index = index + header.write(this.ns, index, 'utf8') + 1;
        header[index - 1] = 0;
        // Write header information flags numberToSkip
        header[index + 3] = (this.numberToSkip >> 24) & 0xff;
        header[index + 2] = (this.numberToSkip >> 16) & 0xff;
        header[index + 1] = (this.numberToSkip >> 8) & 0xff;
        header[index] = this.numberToSkip & 0xff;
        index = index + 4;
        // Write header information flags numberToReturn
        header[index + 3] = (this.numberToReturn >> 24) & 0xff;
        header[index + 2] = (this.numberToReturn >> 16) & 0xff;
        header[index + 1] = (this.numberToReturn >> 8) & 0xff;
        header[index] = this.numberToReturn & 0xff;
        index = index + 4;
        // Return the buffers
        return buffers;
    }
}
commands.Query = Query;
/** @internal */
class Response {
    constructor(message, msgHeader, msgBody, opts) {
        this.documents = new Array(0);
        this.parsed = false;
        this.raw = message;
        this.data = msgBody;
        this.opts = opts ?? {
            useBigInt64: false,
            promoteLongs: true,
            promoteValues: true,
            promoteBuffers: false,
            bsonRegExp: false
        };
        // Read the message header
        this.length = msgHeader.length;
        this.requestId = msgHeader.requestId;
        this.responseTo = msgHeader.responseTo;
        this.opCode = msgHeader.opCode;
        this.fromCompressed = msgHeader.fromCompressed;
        // Flag values
        this.useBigInt64 = typeof this.opts.useBigInt64 === 'boolean' ? this.opts.useBigInt64 : false;
        this.promoteLongs = typeof this.opts.promoteLongs === 'boolean' ? this.opts.promoteLongs : true;
        this.promoteValues =
            typeof this.opts.promoteValues === 'boolean' ? this.opts.promoteValues : true;
        this.promoteBuffers =
            typeof this.opts.promoteBuffers === 'boolean' ? this.opts.promoteBuffers : false;
        this.bsonRegExp = typeof this.opts.bsonRegExp === 'boolean' ? this.opts.bsonRegExp : false;
    }
    isParsed() {
        return this.parsed;
    }
    parse(options) {
        // Don't parse again if not needed
        if (this.parsed)
            return;
        options = options ?? {};
        // Allow the return of raw documents instead of parsing
        const raw = options.raw || false;
        const documentsReturnedIn = options.documentsReturnedIn || null;
        const useBigInt64 = options.useBigInt64 ?? this.opts.useBigInt64;
        const promoteLongs = options.promoteLongs ?? this.opts.promoteLongs;
        const promoteValues = options.promoteValues ?? this.opts.promoteValues;
        const promoteBuffers = options.promoteBuffers ?? this.opts.promoteBuffers;
        const bsonRegExp = options.bsonRegExp ?? this.opts.bsonRegExp;
        let bsonSize;
        // Set up the options
        const _options = {
            useBigInt64,
            promoteLongs,
            promoteValues,
            promoteBuffers,
            bsonRegExp
        };
        // Position within OP_REPLY at which documents start
        // (See https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/#wire-op-reply)
        this.index = 20;
        // Read the message body
        this.responseFlags = this.data.readInt32LE(0);
        this.cursorId = new BSON$1.Long(this.data.readInt32LE(4), this.data.readInt32LE(8));
        this.startingFrom = this.data.readInt32LE(12);
        this.numberReturned = this.data.readInt32LE(16);
        // Preallocate document array
        this.documents = new Array(this.numberReturned);
        this.cursorNotFound = (this.responseFlags & CURSOR_NOT_FOUND) !== 0;
        this.queryFailure = (this.responseFlags & QUERY_FAILURE) !== 0;
        this.shardConfigStale = (this.responseFlags & SHARD_CONFIG_STALE) !== 0;
        this.awaitCapable = (this.responseFlags & AWAIT_CAPABLE) !== 0;
        // Parse Body
        for (let i = 0; i < this.numberReturned; i++) {
            bsonSize =
                this.data[this.index] |
                    (this.data[this.index + 1] << 8) |
                    (this.data[this.index + 2] << 16) |
                    (this.data[this.index + 3] << 24);
            // If we have raw results specified slice the return document
            if (raw) {
                this.documents[i] = this.data.slice(this.index, this.index + bsonSize);
            }
            else {
                this.documents[i] = BSON$1.deserialize(this.data.slice(this.index, this.index + bsonSize), _options);
            }
            // Adjust the index
            this.index = this.index + bsonSize;
        }
        if (this.documents.length === 1 && documentsReturnedIn != null && raw) {
            const fieldsAsRaw = {};
            fieldsAsRaw[documentsReturnedIn] = true;
            _options.fieldsAsRaw = fieldsAsRaw;
            const doc = BSON$1.deserialize(this.documents[0], _options);
            this.documents = [doc];
        }
        // Set parsed
        this.parsed = true;
    }
}
commands.Response = Response;
// Implementation of OP_MSG spec:
// https://github.com/mongodb/specifications/blob/master/source/message/OP_MSG.rst
//
// struct Section {
//   uint8 payloadType;
//   union payload {
//       document  document; // payloadType == 0
//       struct sequence { // payloadType == 1
//           int32      size;
//           cstring    identifier;
//           document*  documents;
//       };
//   };
// };
// struct OP_MSG {
//   struct MsgHeader {
//       int32  messageLength;
//       int32  requestID;
//       int32  responseTo;
//       int32  opCode = 2013;
//   };
//   uint32      flagBits;
//   Section+    sections;
//   [uint32     checksum;]
// };
// Msg Flags
const OPTS_CHECKSUM_PRESENT = 1;
const OPTS_MORE_TO_COME = 2;
const OPTS_EXHAUST_ALLOWED = 1 << 16;
/** @internal */
class Msg {
    constructor(ns, command, options) {
        // Basic options needed to be passed in
        if (command == null)
            throw new error_1$g.MongoInvalidArgumentError('Query document must be specified for query');
        // Basic options
        this.ns = ns;
        this.command = command;
        this.command.$db = (0, utils_1$b.databaseNamespace)(ns);
        if (options.readPreference && options.readPreference.mode !== read_preference_1.ReadPreference.PRIMARY) {
            this.command.$readPreference = options.readPreference.toJSON();
        }
        // Ensure empty options
        this.options = options ?? {};
        // Additional options
        this.requestId = options.requestId ? options.requestId : Msg.getRequestId();
        // Serialization option
        this.serializeFunctions =
            typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
        this.ignoreUndefined =
            typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : false;
        this.checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
        this.maxBsonSize = options.maxBsonSize || 1024 * 1024 * 16;
        // flags
        this.checksumPresent = false;
        this.moreToCome = options.moreToCome || false;
        this.exhaustAllowed =
            typeof options.exhaustAllowed === 'boolean' ? options.exhaustAllowed : false;
    }
    toBin() {
        const buffers = [];
        let flags = 0;
        if (this.checksumPresent) {
            flags |= OPTS_CHECKSUM_PRESENT;
        }
        if (this.moreToCome) {
            flags |= OPTS_MORE_TO_COME;
        }
        if (this.exhaustAllowed) {
            flags |= OPTS_EXHAUST_ALLOWED;
        }
        const header = Buffer.alloc(4 * 4 + // Header
            4 // Flags
        );
        buffers.push(header);
        let totalLength = header.length;
        const command = this.command;
        totalLength += this.makeDocumentSegment(buffers, command);
        header.writeInt32LE(totalLength, 0); // messageLength
        header.writeInt32LE(this.requestId, 4); // requestID
        header.writeInt32LE(0, 8); // responseTo
        header.writeInt32LE(constants_1$3.OP_MSG, 12); // opCode
        header.writeUInt32LE(flags, 16); // flags
        return buffers;
    }
    makeDocumentSegment(buffers, document) {
        const payloadTypeBuffer = Buffer.alloc(1);
        payloadTypeBuffer[0] = 0;
        const documentBuffer = this.serializeBson(document);
        buffers.push(payloadTypeBuffer);
        buffers.push(documentBuffer);
        return payloadTypeBuffer.length + documentBuffer.length;
    }
    serializeBson(document) {
        return BSON$1.serialize(document, {
            checkKeys: this.checkKeys,
            serializeFunctions: this.serializeFunctions,
            ignoreUndefined: this.ignoreUndefined
        });
    }
    static getRequestId() {
        _requestId = (_requestId + 1) & 0x7fffffff;
        return _requestId;
    }
}
commands.Msg = Msg;
/** @internal */
class BinMsg {
    constructor(message, msgHeader, msgBody, opts) {
        this.parsed = false;
        this.raw = message;
        this.data = msgBody;
        this.opts = opts ?? {
            useBigInt64: false,
            promoteLongs: true,
            promoteValues: true,
            promoteBuffers: false,
            bsonRegExp: false
        };
        // Read the message header
        this.length = msgHeader.length;
        this.requestId = msgHeader.requestId;
        this.responseTo = msgHeader.responseTo;
        this.opCode = msgHeader.opCode;
        this.fromCompressed = msgHeader.fromCompressed;
        // Read response flags
        this.responseFlags = msgBody.readInt32LE(0);
        this.checksumPresent = (this.responseFlags & OPTS_CHECKSUM_PRESENT) !== 0;
        this.moreToCome = (this.responseFlags & OPTS_MORE_TO_COME) !== 0;
        this.exhaustAllowed = (this.responseFlags & OPTS_EXHAUST_ALLOWED) !== 0;
        this.useBigInt64 = typeof this.opts.useBigInt64 === 'boolean' ? this.opts.useBigInt64 : false;
        this.promoteLongs = typeof this.opts.promoteLongs === 'boolean' ? this.opts.promoteLongs : true;
        this.promoteValues =
            typeof this.opts.promoteValues === 'boolean' ? this.opts.promoteValues : true;
        this.promoteBuffers =
            typeof this.opts.promoteBuffers === 'boolean' ? this.opts.promoteBuffers : false;
        this.bsonRegExp = typeof this.opts.bsonRegExp === 'boolean' ? this.opts.bsonRegExp : false;
        this.documents = [];
    }
    isParsed() {
        return this.parsed;
    }
    parse(options) {
        // Don't parse again if not needed
        if (this.parsed)
            return;
        options = options ?? {};
        this.index = 4;
        // Allow the return of raw documents instead of parsing
        const raw = options.raw || false;
        const documentsReturnedIn = options.documentsReturnedIn || null;
        const useBigInt64 = options.useBigInt64 ?? this.opts.useBigInt64;
        const promoteLongs = options.promoteLongs ?? this.opts.promoteLongs;
        const promoteValues = options.promoteValues ?? this.opts.promoteValues;
        const promoteBuffers = options.promoteBuffers ?? this.opts.promoteBuffers;
        const bsonRegExp = options.bsonRegExp ?? this.opts.bsonRegExp;
        const validation = this.parseBsonSerializationOptions(options);
        // Set up the options
        const bsonOptions = {
            useBigInt64,
            promoteLongs,
            promoteValues,
            promoteBuffers,
            bsonRegExp,
            validation
            // Due to the strictness of the BSON libraries validation option we need this cast
        };
        while (this.index < this.data.length) {
            const payloadType = this.data.readUInt8(this.index++);
            if (payloadType === 0) {
                const bsonSize = this.data.readUInt32LE(this.index);
                const bin = this.data.slice(this.index, this.index + bsonSize);
                this.documents.push(raw ? bin : BSON$1.deserialize(bin, bsonOptions));
                this.index += bsonSize;
            }
            else if (payloadType === 1) {
                // It was decided that no driver makes use of payload type 1
                // TODO(NODE-3483): Replace with MongoDeprecationError
                throw new error_1$g.MongoRuntimeError('OP_MSG Payload Type 1 detected unsupported protocol');
            }
        }
        if (this.documents.length === 1 && documentsReturnedIn != null && raw) {
            const fieldsAsRaw = {};
            fieldsAsRaw[documentsReturnedIn] = true;
            bsonOptions.fieldsAsRaw = fieldsAsRaw;
            const doc = BSON$1.deserialize(this.documents[0], bsonOptions);
            this.documents = [doc];
        }
        this.parsed = true;
    }
    parseBsonSerializationOptions({ enableUtf8Validation }) {
        if (enableUtf8Validation === false) {
            return { utf8: false };
        }
        return { utf8: { writeErrors: false } };
    }
}
commands.BinMsg = BinMsg;

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SENSITIVE_COMMANDS = exports.CommandFailedEvent = exports.CommandSucceededEvent = exports.CommandStartedEvent = void 0;
	const constants_1 = constants;
	const utils_1 = utils;
	const commands_1 = commands;
	/**
	 * An event indicating the start of a given
	 * @public
	 * @category Event
	 */
	class CommandStartedEvent {
	    /**
	     * Create a started event
	     *
	     * @internal
	     * @param pool - the pool that originated the command
	     * @param command - the command
	     */
	    constructor(connection, command) {
	        /** @internal */
	        this.name = constants_1.COMMAND_STARTED;
	        const cmd = extractCommand(command);
	        const commandName = extractCommandName(cmd);
	        const { address, connectionId, serviceId } = extractConnectionDetails(connection);
	        // TODO: remove in major revision, this is not spec behavior
	        if (exports.SENSITIVE_COMMANDS.has(commandName)) {
	            this.commandObj = {};
	            this.commandObj[commandName] = true;
	        }
	        this.address = address;
	        this.connectionId = connectionId;
	        this.serviceId = serviceId;
	        this.requestId = command.requestId;
	        this.databaseName = databaseName(command);
	        this.commandName = commandName;
	        this.command = maybeRedact(commandName, cmd, cmd);
	    }
	    /* @internal */
	    get hasServiceId() {
	        return !!this.serviceId;
	    }
	}
	exports.CommandStartedEvent = CommandStartedEvent;
	/**
	 * An event indicating the success of a given command
	 * @public
	 * @category Event
	 */
	class CommandSucceededEvent {
	    /**
	     * Create a succeeded event
	     *
	     * @internal
	     * @param pool - the pool that originated the command
	     * @param command - the command
	     * @param reply - the reply for this command from the server
	     * @param started - a high resolution tuple timestamp of when the command was first sent, to calculate duration
	     */
	    constructor(connection, command, reply, started) {
	        /** @internal */
	        this.name = constants_1.COMMAND_SUCCEEDED;
	        const cmd = extractCommand(command);
	        const commandName = extractCommandName(cmd);
	        const { address, connectionId, serviceId } = extractConnectionDetails(connection);
	        this.address = address;
	        this.connectionId = connectionId;
	        this.serviceId = serviceId;
	        this.requestId = command.requestId;
	        this.commandName = commandName;
	        this.duration = (0, utils_1.calculateDurationInMs)(started);
	        this.reply = maybeRedact(commandName, cmd, extractReply(command, reply));
	    }
	    /* @internal */
	    get hasServiceId() {
	        return !!this.serviceId;
	    }
	}
	exports.CommandSucceededEvent = CommandSucceededEvent;
	/**
	 * An event indicating the failure of a given command
	 * @public
	 * @category Event
	 */
	class CommandFailedEvent {
	    /**
	     * Create a failure event
	     *
	     * @internal
	     * @param pool - the pool that originated the command
	     * @param command - the command
	     * @param error - the generated error or a server error response
	     * @param started - a high resolution tuple timestamp of when the command was first sent, to calculate duration
	     */
	    constructor(connection, command, error, started) {
	        /** @internal */
	        this.name = constants_1.COMMAND_FAILED;
	        const cmd = extractCommand(command);
	        const commandName = extractCommandName(cmd);
	        const { address, connectionId, serviceId } = extractConnectionDetails(connection);
	        this.address = address;
	        this.connectionId = connectionId;
	        this.serviceId = serviceId;
	        this.requestId = command.requestId;
	        this.commandName = commandName;
	        this.duration = (0, utils_1.calculateDurationInMs)(started);
	        this.failure = maybeRedact(commandName, cmd, error);
	    }
	    /* @internal */
	    get hasServiceId() {
	        return !!this.serviceId;
	    }
	}
	exports.CommandFailedEvent = CommandFailedEvent;
	/**
	 * Commands that we want to redact because of the sensitive nature of their contents
	 * @internal
	 */
	exports.SENSITIVE_COMMANDS = new Set([
	    'authenticate',
	    'saslStart',
	    'saslContinue',
	    'getnonce',
	    'createUser',
	    'updateUser',
	    'copydbgetnonce',
	    'copydbsaslstart',
	    'copydb'
	]);
	const HELLO_COMMANDS = new Set(['hello', constants_1.LEGACY_HELLO_COMMAND, constants_1.LEGACY_HELLO_COMMAND_CAMEL_CASE]);
	// helper methods
	const extractCommandName = (commandDoc) => Object.keys(commandDoc)[0];
	const namespace = (command) => command.ns;
	const databaseName = (command) => command.ns.split('.')[0];
	const collectionName = (command) => command.ns.split('.')[1];
	const maybeRedact = (commandName, commandDoc, result) => exports.SENSITIVE_COMMANDS.has(commandName) ||
	    (HELLO_COMMANDS.has(commandName) && commandDoc.speculativeAuthenticate)
	    ? {}
	    : result;
	const LEGACY_FIND_QUERY_MAP = {
	    $query: 'filter',
	    $orderby: 'sort',
	    $hint: 'hint',
	    $comment: 'comment',
	    $maxScan: 'maxScan',
	    $max: 'max',
	    $min: 'min',
	    $returnKey: 'returnKey',
	    $showDiskLoc: 'showRecordId',
	    $maxTimeMS: 'maxTimeMS',
	    $snapshot: 'snapshot'
	};
	const LEGACY_FIND_OPTIONS_MAP = {
	    numberToSkip: 'skip',
	    numberToReturn: 'batchSize',
	    returnFieldSelector: 'projection'
	};
	const OP_QUERY_KEYS = [
	    'tailable',
	    'oplogReplay',
	    'noCursorTimeout',
	    'awaitData',
	    'partial',
	    'exhaust'
	];
	/** Extract the actual command from the query, possibly up-converting if it's a legacy format */
	function extractCommand(command) {
	    if (command instanceof commands_1.Msg) {
	        return (0, utils_1.deepCopy)(command.command);
	    }
	    if (command.query?.$query) {
	        let result;
	        if (command.ns === 'admin.$cmd') {
	            // up-convert legacy command
	            result = Object.assign({}, command.query.$query);
	        }
	        else {
	            // up-convert legacy find command
	            result = { find: collectionName(command) };
	            Object.keys(LEGACY_FIND_QUERY_MAP).forEach(key => {
	                if (command.query[key] != null) {
	                    result[LEGACY_FIND_QUERY_MAP[key]] = (0, utils_1.deepCopy)(command.query[key]);
	                }
	            });
	        }
	        Object.keys(LEGACY_FIND_OPTIONS_MAP).forEach(key => {
	            const legacyKey = key;
	            if (command[legacyKey] != null) {
	                result[LEGACY_FIND_OPTIONS_MAP[legacyKey]] = (0, utils_1.deepCopy)(command[legacyKey]);
	            }
	        });
	        OP_QUERY_KEYS.forEach(key => {
	            if (command[key]) {
	                result[key] = command[key];
	            }
	        });
	        if (command.pre32Limit != null) {
	            result.limit = command.pre32Limit;
	        }
	        if (command.query.$explain) {
	            return { explain: result };
	        }
	        return result;
	    }
	    const clonedQuery = {};
	    const clonedCommand = {};
	    if (command.query) {
	        for (const k in command.query) {
	            clonedQuery[k] = (0, utils_1.deepCopy)(command.query[k]);
	        }
	        clonedCommand.query = clonedQuery;
	    }
	    for (const k in command) {
	        if (k === 'query')
	            continue;
	        clonedCommand[k] = (0, utils_1.deepCopy)(command[k]);
	    }
	    return command.query ? clonedQuery : clonedCommand;
	}
	function extractReply(command, reply) {
	    if (!reply) {
	        return reply;
	    }
	    if (command instanceof commands_1.Msg) {
	        return (0, utils_1.deepCopy)(reply.result ? reply.result : reply);
	    }
	    // is this a legacy find command?
	    if (command.query && command.query.$query != null) {
	        return {
	            ok: 1,
	            cursor: {
	                id: (0, utils_1.deepCopy)(reply.cursorId),
	                ns: namespace(command),
	                firstBatch: (0, utils_1.deepCopy)(reply.documents)
	            }
	        };
	    }
	    return (0, utils_1.deepCopy)(reply.result ? reply.result : reply);
	}
	function extractConnectionDetails(connection) {
	    let connectionId;
	    if ('id' in connection) {
	        connectionId = connection.id;
	    }
	    return {
	        address: connection.address,
	        serviceId: connection.serviceId,
	        connectionId
	    };
	}
	
} (command_monitoring_events));

var message_stream = {};

Object.defineProperty(message_stream, "__esModule", { value: true });
message_stream.MessageStream = void 0;
const stream_1$2 = require$$0$5;
const error_1$f = error;
const utils_1$a = utils;
const commands_1$1 = commands;
const compression_1 = compression;
const constants_1$2 = constants$1;
const MESSAGE_HEADER_SIZE = 16;
const COMPRESSION_DETAILS_SIZE = 9; // originalOpcode + uncompressedSize, compressorID
const kDefaultMaxBsonMessageSize = 1024 * 1024 * 16 * 4;
/** @internal */
const kBuffer = Symbol('buffer');
/**
 * A duplex stream that is capable of reading and writing raw wire protocol messages, with
 * support for optional compression
 * @internal
 */
class MessageStream extends stream_1$2.Duplex {
    constructor(options = {}) {
        super(options);
        /** @internal */
        this.isMonitoringConnection = false;
        this.maxBsonMessageSize = options.maxBsonMessageSize || kDefaultMaxBsonMessageSize;
        this[kBuffer] = new utils_1$a.BufferPool();
    }
    get buffer() {
        return this[kBuffer];
    }
    _write(chunk, _, callback) {
        this[kBuffer].append(chunk);
        processIncomingData(this, callback);
    }
    _read( /* size */) {
        // NOTE: This implementation is empty because we explicitly push data to be read
        //       when `writeMessage` is called.
        return;
    }
    writeCommand(command, operationDescription) {
        const agreedCompressor = operationDescription.agreedCompressor ?? 'none';
        if (agreedCompressor === 'none' || !canCompress(command)) {
            const data = command.toBin();
            this.push(Array.isArray(data) ? Buffer.concat(data) : data);
            return;
        }
        // otherwise, compress the message
        const concatenatedOriginalCommandBuffer = Buffer.concat(command.toBin());
        const messageToBeCompressed = concatenatedOriginalCommandBuffer.slice(MESSAGE_HEADER_SIZE);
        // Extract information needed for OP_COMPRESSED from the uncompressed message
        const originalCommandOpCode = concatenatedOriginalCommandBuffer.readInt32LE(12);
        const options = {
            agreedCompressor,
            zlibCompressionLevel: operationDescription.zlibCompressionLevel ?? 0
        };
        // Compress the message body
        (0, compression_1.compress)(options, messageToBeCompressed).then(compressedMessage => {
            // Create the msgHeader of OP_COMPRESSED
            const msgHeader = Buffer.alloc(MESSAGE_HEADER_SIZE);
            msgHeader.writeInt32LE(MESSAGE_HEADER_SIZE + COMPRESSION_DETAILS_SIZE + compressedMessage.length, 0); // messageLength
            msgHeader.writeInt32LE(command.requestId, 4); // requestID
            msgHeader.writeInt32LE(0, 8); // responseTo (zero)
            msgHeader.writeInt32LE(constants_1$2.OP_COMPRESSED, 12); // opCode
            // Create the compression details of OP_COMPRESSED
            const compressionDetails = Buffer.alloc(COMPRESSION_DETAILS_SIZE);
            compressionDetails.writeInt32LE(originalCommandOpCode, 0); // originalOpcode
            compressionDetails.writeInt32LE(messageToBeCompressed.length, 4); // Size of the uncompressed compressedMessage, excluding the MsgHeader
            compressionDetails.writeUInt8(compression_1.Compressor[agreedCompressor], 8); // compressorID
            this.push(Buffer.concat([msgHeader, compressionDetails, compressedMessage]));
        }, error => {
            operationDescription.cb(error);
        });
    }
}
message_stream.MessageStream = MessageStream;
// Return whether a command contains an uncompressible command term
// Will return true if command contains no uncompressible command terms
function canCompress(command) {
    const commandDoc = command instanceof commands_1$1.Msg ? command.command : command.query;
    const commandName = Object.keys(commandDoc)[0];
    return !compression_1.uncompressibleCommands.has(commandName);
}
function processIncomingData(stream, callback) {
    const buffer = stream[kBuffer];
    const sizeOfMessage = buffer.getInt32();
    if (sizeOfMessage == null) {
        return callback();
    }
    if (sizeOfMessage < 0) {
        return callback(new error_1$f.MongoParseError(`Invalid message size: ${sizeOfMessage}`));
    }
    if (sizeOfMessage > stream.maxBsonMessageSize) {
        return callback(new error_1$f.MongoParseError(`Invalid message size: ${sizeOfMessage}, max allowed: ${stream.maxBsonMessageSize}`));
    }
    if (sizeOfMessage > buffer.length) {
        return callback();
    }
    const message = buffer.read(sizeOfMessage);
    const messageHeader = {
        length: message.readInt32LE(0),
        requestId: message.readInt32LE(4),
        responseTo: message.readInt32LE(8),
        opCode: message.readInt32LE(12)
    };
    const monitorHasAnotherHello = () => {
        if (stream.isMonitoringConnection) {
            // Can we read the next message size?
            const sizeOfMessage = buffer.getInt32();
            if (sizeOfMessage != null && sizeOfMessage <= buffer.length) {
                return true;
            }
        }
        return false;
    };
    let ResponseType = messageHeader.opCode === constants_1$2.OP_MSG ? commands_1$1.BinMsg : commands_1$1.Response;
    if (messageHeader.opCode !== constants_1$2.OP_COMPRESSED) {
        const messageBody = message.subarray(MESSAGE_HEADER_SIZE);
        // If we are a monitoring connection message stream and
        // there is more in the buffer that can be read, skip processing since we
        // want the last hello command response that is in the buffer.
        if (monitorHasAnotherHello()) {
            return processIncomingData(stream, callback);
        }
        stream.emit('message', new ResponseType(message, messageHeader, messageBody));
        if (buffer.length >= 4) {
            return processIncomingData(stream, callback);
        }
        return callback();
    }
    messageHeader.fromCompressed = true;
    messageHeader.opCode = message.readInt32LE(MESSAGE_HEADER_SIZE);
    messageHeader.length = message.readInt32LE(MESSAGE_HEADER_SIZE + 4);
    const compressorID = message[MESSAGE_HEADER_SIZE + 8];
    const compressedBuffer = message.slice(MESSAGE_HEADER_SIZE + 9);
    // recalculate based on wrapped opcode
    ResponseType = messageHeader.opCode === constants_1$2.OP_MSG ? commands_1$1.BinMsg : commands_1$1.Response;
    (0, compression_1.decompress)(compressorID, compressedBuffer).then(messageBody => {
        if (messageBody.length !== messageHeader.length) {
            return callback(new error_1$f.MongoDecompressionError('Message body and message header must be the same length'));
        }
        // If we are a monitoring connection message stream and
        // there is more in the buffer that can be read, skip processing since we
        // want the last hello command response that is in the buffer.
        if (monitorHasAnotherHello()) {
            return processIncomingData(stream, callback);
        }
        stream.emit('message', new ResponseType(message, messageHeader, messageBody));
        if (buffer.length >= 4) {
            return processIncomingData(stream, callback);
        }
        return callback();
    }, error => {
        return callback(error);
    });
}

var stream_description = {};

Object.defineProperty(stream_description, "__esModule", { value: true });
stream_description.StreamDescription = void 0;
const common_1 = common$1;
const server_description_1 = server_description;
const RESPONSE_FIELDS = [
    'minWireVersion',
    'maxWireVersion',
    'maxBsonObjectSize',
    'maxMessageSizeBytes',
    'maxWriteBatchSize',
    'logicalSessionTimeoutMinutes'
];
/** @public */
class StreamDescription {
    constructor(address, options) {
        this.address = address;
        this.type = common_1.ServerType.Unknown;
        this.minWireVersion = undefined;
        this.maxWireVersion = undefined;
        this.maxBsonObjectSize = 16777216;
        this.maxMessageSizeBytes = 48000000;
        this.maxWriteBatchSize = 100000;
        this.logicalSessionTimeoutMinutes = options?.logicalSessionTimeoutMinutes;
        this.loadBalanced = !!options?.loadBalanced;
        this.compressors =
            options && options.compressors && Array.isArray(options.compressors)
                ? options.compressors
                : [];
    }
    receiveResponse(response) {
        if (response == null) {
            return;
        }
        this.type = (0, server_description_1.parseServerType)(response);
        for (const field of RESPONSE_FIELDS) {
            if (response[field] != null) {
                this[field] = response[field];
            }
            // testing case
            if ('__nodejs_mock_server__' in response) {
                this.__nodejs_mock_server__ = response['__nodejs_mock_server__'];
            }
        }
        if (response.compression) {
            this.compressor = this.compressors.filter(c => response.compression?.includes(c))[0];
        }
    }
}
stream_description.StreamDescription = StreamDescription;

Object.defineProperty(connection, "__esModule", { value: true });
connection.hasSessionSupport = connection.CryptoConnection = connection.Connection = void 0;
const timers_1$1 = require$$0$7;
const util_1$2 = require$$0$6;
const constants_1$1 = constants;
const error_1$e = error;
const mongo_types_1$2 = mongo_types;
const sessions_1 = sessions;
const utils_1$9 = utils;
const command_monitoring_events_1 = command_monitoring_events;
const commands_1 = commands;
const message_stream_1 = message_stream;
const stream_description_1 = stream_description;
const shared_1 = shared;
/** @internal */
const kStream = Symbol('stream');
/** @internal */
const kQueue = Symbol('queue');
/** @internal */
const kMessageStream = Symbol('messageStream');
/** @internal */
const kGeneration = Symbol('generation');
/** @internal */
const kLastUseTime = Symbol('lastUseTime');
/** @internal */
const kClusterTime = Symbol('clusterTime');
/** @internal */
const kDescription = Symbol('description');
/** @internal */
const kHello = Symbol('hello');
/** @internal */
const kAutoEncrypter = Symbol('autoEncrypter');
/** @internal */
const kDelayedTimeoutId = Symbol('delayedTimeoutId');
const INVALID_QUEUE_SIZE = 'Connection internal queue contains more than 1 operation description';
/** @internal */
class Connection extends mongo_types_1$2.TypedEventEmitter {
    constructor(stream, options) {
        super();
        this.commandAsync = (0, util_1$2.promisify)((ns, cmd, options, callback) => this.command(ns, cmd, options, callback));
        this.id = options.id;
        this.address = streamIdentifier(stream, options);
        this.socketTimeoutMS = options.socketTimeoutMS ?? 0;
        this.monitorCommands = options.monitorCommands;
        this.serverApi = options.serverApi;
        this.closed = false;
        this[kHello] = null;
        this[kClusterTime] = null;
        this[kDescription] = new stream_description_1.StreamDescription(this.address, options);
        this[kGeneration] = options.generation;
        this[kLastUseTime] = (0, utils_1$9.now)();
        // setup parser stream and message handling
        this[kQueue] = new Map();
        this[kMessageStream] = new message_stream_1.MessageStream({
            ...options,
            maxBsonMessageSize: this.hello?.maxBsonMessageSize
        });
        this[kStream] = stream;
        this[kDelayedTimeoutId] = null;
        this[kMessageStream].on('message', message => this.onMessage(message));
        this[kMessageStream].on('error', error => this.onError(error));
        this[kStream].on('close', () => this.onClose());
        this[kStream].on('timeout', () => this.onTimeout());
        this[kStream].on('error', () => {
            /* ignore errors, listen to `close` instead */
        });
        // hook the message stream up to the passed in stream
        this[kStream].pipe(this[kMessageStream]);
        this[kMessageStream].pipe(this[kStream]);
    }
    get description() {
        return this[kDescription];
    }
    get hello() {
        return this[kHello];
    }
    // the `connect` method stores the result of the handshake hello on the connection
    set hello(response) {
        this[kDescription].receiveResponse(response);
        this[kDescription] = Object.freeze(this[kDescription]);
        // TODO: remove this, and only use the `StreamDescription` in the future
        this[kHello] = response;
    }
    // Set the whether the message stream is for a monitoring connection.
    set isMonitoringConnection(value) {
        this[kMessageStream].isMonitoringConnection = value;
    }
    get isMonitoringConnection() {
        return this[kMessageStream].isMonitoringConnection;
    }
    get serviceId() {
        return this.hello?.serviceId;
    }
    get loadBalanced() {
        return this.description.loadBalanced;
    }
    get generation() {
        return this[kGeneration] || 0;
    }
    set generation(generation) {
        this[kGeneration] = generation;
    }
    get idleTime() {
        return (0, utils_1$9.calculateDurationInMs)(this[kLastUseTime]);
    }
    get clusterTime() {
        return this[kClusterTime];
    }
    get stream() {
        return this[kStream];
    }
    markAvailable() {
        this[kLastUseTime] = (0, utils_1$9.now)();
    }
    onError(error) {
        this.cleanup(true, error);
    }
    onClose() {
        const message = `connection ${this.id} to ${this.address} closed`;
        this.cleanup(true, new error_1$e.MongoNetworkError(message));
    }
    onTimeout() {
        this[kDelayedTimeoutId] = (0, timers_1$1.setTimeout)(() => {
            const message = `connection ${this.id} to ${this.address} timed out`;
            const beforeHandshake = this.hello == null;
            this.cleanup(true, new error_1$e.MongoNetworkTimeoutError(message, { beforeHandshake }));
        }, 1).unref(); // No need for this timer to hold the event loop open
    }
    onMessage(message) {
        const delayedTimeoutId = this[kDelayedTimeoutId];
        if (delayedTimeoutId != null) {
            (0, timers_1$1.clearTimeout)(delayedTimeoutId);
            this[kDelayedTimeoutId] = null;
        }
        const socketTimeoutMS = this[kStream].timeout ?? 0;
        this[kStream].setTimeout(0);
        // always emit the message, in case we are streaming
        this.emit('message', message);
        let operationDescription = this[kQueue].get(message.responseTo);
        if (!operationDescription && this.isMonitoringConnection) {
            // This is how we recover when the initial hello's requestId is not
            // the responseTo when hello responses have been skipped:
            // First check if the map is of invalid size
            if (this[kQueue].size > 1) {
                this.cleanup(true, new error_1$e.MongoRuntimeError(INVALID_QUEUE_SIZE));
            }
            else {
                // Get the first orphaned operation description.
                const entry = this[kQueue].entries().next();
                if (entry.value != null) {
                    const [requestId, orphaned] = entry.value;
                    // If the orphaned operation description exists then set it.
                    operationDescription = orphaned;
                    // Remove the entry with the bad request id from the queue.
                    this[kQueue].delete(requestId);
                }
            }
        }
        if (!operationDescription) {
            return;
        }
        const callback = operationDescription.cb;
        // SERVER-45775: For exhaust responses we should be able to use the same requestId to
        // track response, however the server currently synthetically produces remote requests
        // making the `responseTo` change on each response
        this[kQueue].delete(message.responseTo);
        if ('moreToCome' in message && message.moreToCome) {
            // If the operation description check above does find an orphaned
            // description and sets the operationDescription then this line will put one
            // back in the queue with the correct requestId and will resolve not being able
            // to find the next one via the responseTo of the next streaming hello.
            this[kQueue].set(message.requestId, operationDescription);
            this[kStream].setTimeout(socketTimeoutMS);
        }
        try {
            // Pass in the entire description because it has BSON parsing options
            message.parse(operationDescription);
        }
        catch (err) {
            // If this error is generated by our own code, it will already have the correct class applied
            // if it is not, then it is coming from a catastrophic data parse failure or the BSON library
            // in either case, it should not be wrapped
            callback(err);
            return;
        }
        if (message.documents[0]) {
            const document = message.documents[0];
            const session = operationDescription.session;
            if (session) {
                (0, sessions_1.updateSessionFromResponse)(session, document);
            }
            if (document.$clusterTime) {
                this[kClusterTime] = document.$clusterTime;
                this.emit(Connection.CLUSTER_TIME_RECEIVED, document.$clusterTime);
            }
            if (document.writeConcernError) {
                callback(new error_1$e.MongoWriteConcernError(document.writeConcernError, document), document);
                return;
            }
            if (document.ok === 0 || document.$err || document.errmsg || document.code) {
                callback(new error_1$e.MongoServerError(document));
                return;
            }
        }
        callback(undefined, message.documents[0]);
    }
    destroy(options, callback) {
        if (this.closed) {
            process.nextTick(() => callback?.());
            return;
        }
        if (typeof callback === 'function') {
            this.once('close', () => process.nextTick(() => callback()));
        }
        // load balanced mode requires that these listeners remain on the connection
        // after cleanup on timeouts, errors or close so we remove them before calling
        // cleanup.
        this.removeAllListeners(Connection.PINNED);
        this.removeAllListeners(Connection.UNPINNED);
        const message = `connection ${this.id} to ${this.address} closed`;
        this.cleanup(options.force, new error_1$e.MongoNetworkError(message));
    }
    /**
     * A method that cleans up the connection.  When `force` is true, this method
     * forcibly destroys the socket.
     *
     * If an error is provided, any in-flight operations will be closed with the error.
     *
     * This method does nothing if the connection is already closed.
     */
    cleanup(force, error) {
        if (this.closed) {
            return;
        }
        this.closed = true;
        const completeCleanup = () => {
            for (const op of this[kQueue].values()) {
                op.cb(error);
            }
            this[kQueue].clear();
            this.emit(Connection.CLOSE);
        };
        this[kStream].removeAllListeners();
        this[kMessageStream].removeAllListeners();
        this[kMessageStream].destroy();
        if (force) {
            this[kStream].destroy();
            completeCleanup();
            return;
        }
        if (!this[kStream].writableEnded) {
            this[kStream].end(() => {
                this[kStream].destroy();
                completeCleanup();
            });
        }
        else {
            completeCleanup();
        }
    }
    command(ns, command, options, callback) {
        let cmd = { ...command };
        const readPreference = (0, shared_1.getReadPreference)(options);
        const shouldUseOpMsg = supportsOpMsg(this);
        const session = options?.session;
        let clusterTime = this.clusterTime;
        if (this.serverApi) {
            const { version, strict, deprecationErrors } = this.serverApi;
            cmd.apiVersion = version;
            if (strict != null)
                cmd.apiStrict = strict;
            if (deprecationErrors != null)
                cmd.apiDeprecationErrors = deprecationErrors;
        }
        if (hasSessionSupport(this) && session) {
            if (session.clusterTime &&
                clusterTime &&
                session.clusterTime.clusterTime.greaterThan(clusterTime.clusterTime)) {
                clusterTime = session.clusterTime;
            }
            const err = (0, sessions_1.applySession)(session, cmd, options);
            if (err) {
                return callback(err);
            }
        }
        else if (session?.explicit) {
            return callback(new error_1$e.MongoCompatibilityError('Current topology does not support sessions'));
        }
        // if we have a known cluster time, gossip it
        if (clusterTime) {
            cmd.$clusterTime = clusterTime;
        }
        if ((0, shared_1.isSharded)(this) && !shouldUseOpMsg && readPreference && readPreference.mode !== 'primary') {
            cmd = {
                $query: cmd,
                $readPreference: readPreference.toJSON()
            };
        }
        const commandOptions = Object.assign({
            numberToSkip: 0,
            numberToReturn: -1,
            checkKeys: false,
            // This value is not overridable
            secondaryOk: readPreference.secondaryOk()
        }, options);
        const cmdNs = `${ns.db}.$cmd`;
        const message = shouldUseOpMsg
            ? new commands_1.Msg(cmdNs, cmd, commandOptions)
            : new commands_1.Query(cmdNs, cmd, commandOptions);
        try {
            write(this, message, commandOptions, callback);
        }
        catch (err) {
            callback(err);
        }
    }
}
/** @event */
Connection.COMMAND_STARTED = constants_1$1.COMMAND_STARTED;
/** @event */
Connection.COMMAND_SUCCEEDED = constants_1$1.COMMAND_SUCCEEDED;
/** @event */
Connection.COMMAND_FAILED = constants_1$1.COMMAND_FAILED;
/** @event */
Connection.CLUSTER_TIME_RECEIVED = constants_1$1.CLUSTER_TIME_RECEIVED;
/** @event */
Connection.CLOSE = constants_1$1.CLOSE;
/** @event */
Connection.MESSAGE = constants_1$1.MESSAGE;
/** @event */
Connection.PINNED = constants_1$1.PINNED;
/** @event */
Connection.UNPINNED = constants_1$1.UNPINNED;
connection.Connection = Connection;
/** @internal */
class CryptoConnection extends Connection {
    constructor(stream, options) {
        super(stream, options);
        this[kAutoEncrypter] = options.autoEncrypter;
    }
    /** @internal @override */
    command(ns, cmd, options, callback) {
        const autoEncrypter = this[kAutoEncrypter];
        if (!autoEncrypter) {
            return callback(new error_1$e.MongoMissingDependencyError('No AutoEncrypter available for encryption'));
        }
        const serverWireVersion = (0, utils_1$9.maxWireVersion)(this);
        if (serverWireVersion === 0) {
            // This means the initial handshake hasn't happened yet
            return super.command(ns, cmd, options, callback);
        }
        if (serverWireVersion < 8) {
            callback(new error_1$e.MongoCompatibilityError('Auto-encryption requires a minimum MongoDB version of 4.2'));
            return;
        }
        // Save sort or indexKeys based on the command being run
        // the encrypt API serializes our JS objects to BSON to pass to the native code layer
        // and then deserializes the encrypted result, the protocol level components
        // of the command (ex. sort) are then converted to JS objects potentially losing
        // import key order information. These fields are never encrypted so we can save the values
        // from before the encryption and replace them after encryption has been performed
        const sort = cmd.find || cmd.findAndModify ? cmd.sort : null;
        const indexKeys = cmd.createIndexes
            ? cmd.indexes.map((index) => index.key)
            : null;
        autoEncrypter.encrypt(ns.toString(), cmd, options, (err, encrypted) => {
            if (err || encrypted == null) {
                callback(err, null);
                return;
            }
            // Replace the saved values
            if (sort != null && (cmd.find || cmd.findAndModify)) {
                encrypted.sort = sort;
            }
            if (indexKeys != null && cmd.createIndexes) {
                for (const [offset, index] of indexKeys.entries()) {
                    encrypted.indexes[offset].key = index;
                }
            }
            super.command(ns, encrypted, options, (err, response) => {
                if (err || response == null) {
                    callback(err, response);
                    return;
                }
                autoEncrypter.decrypt(response, options, callback);
            });
        });
    }
}
connection.CryptoConnection = CryptoConnection;
/** @internal */
function hasSessionSupport(conn) {
    const description = conn.description;
    return description.logicalSessionTimeoutMinutes != null;
}
connection.hasSessionSupport = hasSessionSupport;
function supportsOpMsg(conn) {
    const description = conn.description;
    if (description == null) {
        return false;
    }
    return (0, utils_1$9.maxWireVersion)(conn) >= 6 && !description.__nodejs_mock_server__;
}
function streamIdentifier(stream, options) {
    if (options.proxyHost) {
        // If proxy options are specified, the properties of `stream` itself
        // will not accurately reflect what endpoint this is connected to.
        return options.hostAddress.toString();
    }
    const { remoteAddress, remotePort } = stream;
    if (typeof remoteAddress === 'string' && typeof remotePort === 'number') {
        return utils_1$9.HostAddress.fromHostPort(remoteAddress, remotePort).toString();
    }
    return (0, utils_1$9.uuidV4)().toString('hex');
}
function write(conn, command, options, callback) {
    options = options ?? {};
    const operationDescription = {
        requestId: command.requestId,
        cb: callback,
        session: options.session,
        noResponse: typeof options.noResponse === 'boolean' ? options.noResponse : false,
        documentsReturnedIn: options.documentsReturnedIn,
        // for BSON parsing
        useBigInt64: typeof options.useBigInt64 === 'boolean' ? options.useBigInt64 : false,
        promoteLongs: typeof options.promoteLongs === 'boolean' ? options.promoteLongs : true,
        promoteValues: typeof options.promoteValues === 'boolean' ? options.promoteValues : true,
        promoteBuffers: typeof options.promoteBuffers === 'boolean' ? options.promoteBuffers : false,
        bsonRegExp: typeof options.bsonRegExp === 'boolean' ? options.bsonRegExp : false,
        enableUtf8Validation: typeof options.enableUtf8Validation === 'boolean' ? options.enableUtf8Validation : true,
        raw: typeof options.raw === 'boolean' ? options.raw : false,
        started: 0
    };
    if (conn[kDescription] && conn[kDescription].compressor) {
        operationDescription.agreedCompressor = conn[kDescription].compressor;
        if (conn[kDescription].zlibCompressionLevel) {
            operationDescription.zlibCompressionLevel = conn[kDescription].zlibCompressionLevel;
        }
    }
    if (typeof options.socketTimeoutMS === 'number') {
        conn[kStream].setTimeout(options.socketTimeoutMS);
    }
    else if (conn.socketTimeoutMS !== 0) {
        conn[kStream].setTimeout(conn.socketTimeoutMS);
    }
    // if command monitoring is enabled we need to modify the callback here
    if (conn.monitorCommands) {
        conn.emit(Connection.COMMAND_STARTED, new command_monitoring_events_1.CommandStartedEvent(conn, command));
        operationDescription.started = (0, utils_1$9.now)();
        operationDescription.cb = (err, reply) => {
            // Command monitoring spec states that if ok is 1, then we must always emit
            // a command succeeded event, even if there's an error. Write concern errors
            // will have an ok: 1 in their reply.
            if (err && reply?.ok !== 1) {
                conn.emit(Connection.COMMAND_FAILED, new command_monitoring_events_1.CommandFailedEvent(conn, command, err, operationDescription.started));
            }
            else {
                if (reply && (reply.ok === 0 || reply.$err)) {
                    conn.emit(Connection.COMMAND_FAILED, new command_monitoring_events_1.CommandFailedEvent(conn, command, reply, operationDescription.started));
                }
                else {
                    conn.emit(Connection.COMMAND_SUCCEEDED, new command_monitoring_events_1.CommandSucceededEvent(conn, command, reply, operationDescription.started));
                }
            }
            if (typeof callback === 'function') {
                // Since we're passing through the reply with the write concern error now, we
                // need it not to be provided to the original callback in this case so
                // retryability does not get tricked into thinking the command actually
                // succeeded.
                callback(err, err instanceof error_1$e.MongoWriteConcernError ? undefined : reply);
            }
        };
    }
    if (!operationDescription.noResponse) {
        conn[kQueue].set(operationDescription.requestId, operationDescription);
    }
    try {
        conn[kMessageStream].writeCommand(command, operationDescription);
    }
    catch (e) {
        if (!operationDescription.noResponse) {
            conn[kQueue].delete(operationDescription.requestId);
            operationDescription.cb(e);
            return;
        }
    }
    if (operationDescription.noResponse) {
        operationDescription.cb();
    }
}

var connection_pool = {};

var connect = {};

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(net);

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(socks);

const require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(tls);

var mongocr = {};

Object.defineProperty(mongocr, "__esModule", { value: true });
mongocr.MongoCR = void 0;
const crypto$2 = require$$0$9;
const error_1$d = error;
const utils_1$8 = utils;
const auth_provider_1$4 = auth_provider;
class MongoCR extends auth_provider_1$4.AuthProvider {
    async auth(authContext) {
        const { connection, credentials } = authContext;
        if (!credentials) {
            throw new error_1$d.MongoMissingCredentialsError('AuthContext must provide credentials.');
        }
        const { username, password, source } = credentials;
        const { nonce } = await connection.commandAsync((0, utils_1$8.ns)(`${source}.$cmd`), { getnonce: 1 }, undefined);
        const hashPassword = crypto$2
            .createHash('md5')
            .update(`${username}:mongo:${password}`, 'utf8')
            .digest('hex');
        // Final key
        const key = crypto$2
            .createHash('md5')
            .update(`${nonce}${username}${hashPassword}`, 'utf8')
            .digest('hex');
        const authenticateCommand = {
            authenticate: 1,
            user: username,
            nonce,
            key
        };
        await connection.commandAsync((0, utils_1$8.ns)(`${source}.$cmd`), authenticateCommand, undefined);
    }
}
mongocr.MongoCR = MongoCR;

var mongodb_aws = {};

Object.defineProperty(mongodb_aws, "__esModule", { value: true });
mongodb_aws.MongoDBAWS = void 0;
const crypto$1 = require$$0$9;
const util_1$1 = require$$0$6;
const BSON = bson;
const deps_1$1 = deps;
const error_1$c = error;
const utils_1$7 = utils;
const auth_provider_1$3 = auth_provider;
const mongo_credentials_1 = mongo_credentials;
const providers_1$3 = providers;
const ASCII_N = 110;
const AWS_RELATIVE_URI = 'http://169.254.170.2';
const AWS_EC2_URI = 'http://169.254.169.254';
const AWS_EC2_PATH = '/latest/meta-data/iam/security-credentials';
const bsonOptions = {
    useBigInt64: false,
    promoteLongs: true,
    promoteValues: true,
    promoteBuffers: false,
    bsonRegExp: false
};
class MongoDBAWS extends auth_provider_1$3.AuthProvider {
    constructor() {
        super();
        this.randomBytesAsync = (0, util_1$1.promisify)(crypto$1.randomBytes);
    }
    async auth(authContext) {
        const { connection } = authContext;
        if (!authContext.credentials) {
            throw new error_1$c.MongoMissingCredentialsError('AuthContext must provide credentials.');
        }
        if ('kModuleError' in deps_1$1.aws4) {
            throw deps_1$1.aws4['kModuleError'];
        }
        const { sign } = deps_1$1.aws4;
        if ((0, utils_1$7.maxWireVersion)(connection) < 9) {
            throw new error_1$c.MongoCompatibilityError('MONGODB-AWS authentication requires MongoDB version 4.4 or later');
        }
        if (!authContext.credentials.username) {
            authContext.credentials = await makeTempCredentials(authContext.credentials);
        }
        const { credentials } = authContext;
        const accessKeyId = credentials.username;
        const secretAccessKey = credentials.password;
        const sessionToken = credentials.mechanismProperties.AWS_SESSION_TOKEN;
        // If all three defined, include sessionToken, else include username and pass, else no credentials
        const awsCredentials = accessKeyId && secretAccessKey && sessionToken
            ? { accessKeyId, secretAccessKey, sessionToken }
            : accessKeyId && secretAccessKey
                ? { accessKeyId, secretAccessKey }
                : undefined;
        const db = credentials.source;
        const nonce = await this.randomBytesAsync(32);
        const saslStart = {
            saslStart: 1,
            mechanism: 'MONGODB-AWS',
            payload: BSON.serialize({ r: nonce, p: ASCII_N }, bsonOptions)
        };
        const saslStartResponse = await connection.commandAsync((0, utils_1$7.ns)(`${db}.$cmd`), saslStart, undefined);
        const serverResponse = BSON.deserialize(saslStartResponse.payload.buffer, bsonOptions);
        const host = serverResponse.h;
        const serverNonce = serverResponse.s.buffer;
        if (serverNonce.length !== 64) {
            // TODO(NODE-3483)
            throw new error_1$c.MongoRuntimeError(`Invalid server nonce length ${serverNonce.length}, expected 64`);
        }
        if (!utils_1$7.ByteUtils.equals(serverNonce.subarray(0, nonce.byteLength), nonce)) {
            // throw because the serverNonce's leading 32 bytes must equal the client nonce's 32 bytes
            // https://github.com/mongodb/specifications/blob/875446db44aade414011731840831f38a6c668df/source/auth/auth.rst#id11
            // TODO(NODE-3483)
            throw new error_1$c.MongoRuntimeError('Server nonce does not begin with client nonce');
        }
        if (host.length < 1 || host.length > 255 || host.indexOf('..') !== -1) {
            // TODO(NODE-3483)
            throw new error_1$c.MongoRuntimeError(`Server returned an invalid host: "${host}"`);
        }
        const body = 'Action=GetCallerIdentity&Version=2011-06-15';
        const options = sign({
            method: 'POST',
            host,
            region: deriveRegion(serverResponse.h),
            service: 'sts',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': body.length,
                'X-MongoDB-Server-Nonce': utils_1$7.ByteUtils.toBase64(serverNonce),
                'X-MongoDB-GS2-CB-Flag': 'n'
            },
            path: '/',
            body
        }, awsCredentials);
        const payload = {
            a: options.headers.Authorization,
            d: options.headers['X-Amz-Date']
        };
        if (sessionToken) {
            payload.t = sessionToken;
        }
        const saslContinue = {
            saslContinue: 1,
            conversationId: 1,
            payload: BSON.serialize(payload, bsonOptions)
        };
        await connection.commandAsync((0, utils_1$7.ns)(`${db}.$cmd`), saslContinue, undefined);
    }
}
mongodb_aws.MongoDBAWS = MongoDBAWS;
async function makeTempCredentials(credentials) {
    function makeMongoCredentialsFromAWSTemp(creds) {
        if (!creds.AccessKeyId || !creds.SecretAccessKey || !creds.Token) {
            throw new error_1$c.MongoMissingCredentialsError('Could not obtain temporary MONGODB-AWS credentials');
        }
        return new mongo_credentials_1.MongoCredentials({
            username: creds.AccessKeyId,
            password: creds.SecretAccessKey,
            source: credentials.source,
            mechanism: providers_1$3.AuthMechanism.MONGODB_AWS,
            mechanismProperties: {
                AWS_SESSION_TOKEN: creds.Token
            }
        });
    }
    const credentialProvider = (0, deps_1$1.getAwsCredentialProvider)();
    // Check if the AWS credential provider from the SDK is present. If not,
    // use the old method.
    if ('kModuleError' in credentialProvider) {
        // If the environment variable AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
        // is set then drivers MUST assume that it was set by an AWS ECS agent
        if (process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI) {
            return makeMongoCredentialsFromAWSTemp(await (0, utils_1$7.request)(`${AWS_RELATIVE_URI}${process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI}`));
        }
        // Otherwise assume we are on an EC2 instance
        // get a token
        const token = await (0, utils_1$7.request)(`${AWS_EC2_URI}/latest/api/token`, {
            method: 'PUT',
            json: false,
            headers: { 'X-aws-ec2-metadata-token-ttl-seconds': 30 }
        });
        // get role name
        const roleName = await (0, utils_1$7.request)(`${AWS_EC2_URI}/${AWS_EC2_PATH}`, {
            json: false,
            headers: { 'X-aws-ec2-metadata-token': token }
        });
        // get temp credentials
        const creds = await (0, utils_1$7.request)(`${AWS_EC2_URI}/${AWS_EC2_PATH}/${roleName}`, {
            headers: { 'X-aws-ec2-metadata-token': token }
        });
        return makeMongoCredentialsFromAWSTemp(creds);
    }
    else {
        /*
         * Creates a credential provider that will attempt to find credentials from the
         * following sources (listed in order of precedence):
         *
         * - Environment variables exposed via process.env
         * - SSO credentials from token cache
         * - Web identity token credentials
         * - Shared credentials and config ini files
         * - The EC2/ECS Instance Metadata Service
         */
        const { fromNodeProviderChain } = credentialProvider;
        const provider = fromNodeProviderChain();
        try {
            const creds = await provider();
            return makeMongoCredentialsFromAWSTemp({
                AccessKeyId: creds.accessKeyId,
                SecretAccessKey: creds.secretAccessKey,
                Token: creds.sessionToken,
                Expiration: creds.expiration
            });
        }
        catch (error) {
            throw new error_1$c.MongoAWSError(error.message);
        }
    }
}
function deriveRegion(host) {
    const parts = host.split('.');
    if (parts.length === 1 || parts[1] === 'amazonaws') {
        return 'us-east-1';
    }
    return parts[1];
}

var mongodb_oidc = {};

var aws_service_workflow = {};

var service_workflow = {};

Object.defineProperty(service_workflow, "__esModule", { value: true });
service_workflow.commandDocument = service_workflow.ServiceWorkflow = void 0;
const bson_1$4 = require$$0$8;
const utils_1$6 = utils;
const providers_1$2 = providers;
/**
 * Common behaviour for OIDC device workflows.
 * @internal
 */
class ServiceWorkflow {
    /**
     * Execute the workflow. Looks for AWS_WEB_IDENTITY_TOKEN_FILE in the environment
     * and then attempts to read the token from that path.
     */
    async execute(connection, credentials) {
        const token = await this.getToken(credentials);
        const command = commandDocument(token);
        return connection.commandAsync((0, utils_1$6.ns)(credentials.source), command, undefined);
    }
    /**
     * Get the document to add for speculative authentication.
     */
    async speculativeAuth(credentials) {
        const token = await this.getToken(credentials);
        const document = commandDocument(token);
        document.db = credentials.source;
        return { speculativeAuthenticate: document };
    }
}
service_workflow.ServiceWorkflow = ServiceWorkflow;
/**
 * Create the saslStart command document.
 */
function commandDocument(token) {
    return {
        saslStart: 1,
        mechanism: providers_1$2.AuthMechanism.MONGODB_OIDC,
        payload: bson_1$4.BSON.serialize({ jwt: token })
    };
}
service_workflow.commandDocument = commandDocument;

Object.defineProperty(aws_service_workflow, "__esModule", { value: true });
aws_service_workflow.AwsServiceWorkflow = void 0;
const fs = require$$0$2;
const error_1$b = error;
const service_workflow_1$1 = service_workflow;
/** Error for when the token is missing in the environment. */
const TOKEN_MISSING_ERROR = 'AWS_WEB_IDENTITY_TOKEN_FILE must be set in the environment.';
/**
 * Device workflow implementation for AWS.
 *
 * @internal
 */
class AwsServiceWorkflow extends service_workflow_1$1.ServiceWorkflow {
    constructor() {
        super();
    }
    /**
     * Get the token from the environment.
     */
    async getToken() {
        const tokenFile = process.env.AWS_WEB_IDENTITY_TOKEN_FILE;
        if (!tokenFile) {
            throw new error_1$b.MongoAWSError(TOKEN_MISSING_ERROR);
        }
        return fs.promises.readFile(tokenFile, 'utf8');
    }
}
aws_service_workflow.AwsServiceWorkflow = AwsServiceWorkflow;

var azure_service_workflow = {};

var azure_token_cache = {};

var cache = {};

Object.defineProperty(cache, "__esModule", { value: true });
cache.Cache = cache.ExpiringCacheEntry = void 0;
/* 5 minutes in milliseconds */
const EXPIRATION_BUFFER_MS = 300000;
/**
 * An entry in a cache that can expire in a certain amount of time.
 */
class ExpiringCacheEntry {
    /**
     * Create a new expiring token entry.
     */
    constructor(expiration) {
        this.expiration = this.expirationTime(expiration);
    }
    /**
     * The entry is still valid if the expiration is more than
     * 5 minutes from the expiration time.
     */
    isValid() {
        return this.expiration - Date.now() > EXPIRATION_BUFFER_MS;
    }
    /**
     * Get an expiration time in milliseconds past epoch.
     */
    expirationTime(expiresInSeconds) {
        return Date.now() + expiresInSeconds * 1000;
    }
}
cache.ExpiringCacheEntry = ExpiringCacheEntry;
/**
 * Base class for OIDC caches.
 */
class Cache {
    /**
     * Create a new cache.
     */
    constructor() {
        this.entries = new Map();
    }
    /**
     * Clear the cache.
     */
    clear() {
        this.entries.clear();
    }
    /**
     * Create a cache key from the address and username.
     */
    hashedCacheKey(address, username, callbackHash) {
        return JSON.stringify([address, username, callbackHash]);
    }
}
cache.Cache = Cache;

Object.defineProperty(azure_token_cache, "__esModule", { value: true });
azure_token_cache.AzureTokenCache = azure_token_cache.AzureTokenEntry = void 0;
const cache_1$2 = cache;
/** @internal */
class AzureTokenEntry extends cache_1$2.ExpiringCacheEntry {
    /**
     * Instantiate the entry.
     */
    constructor(token, expiration) {
        super(expiration);
        this.token = token;
    }
}
azure_token_cache.AzureTokenEntry = AzureTokenEntry;
/**
 * A cache of access tokens from Azure.
 * @internal
 */
class AzureTokenCache extends cache_1$2.Cache {
    /**
     * Add an entry to the cache.
     */
    addEntry(tokenAudience, token) {
        const entry = new AzureTokenEntry(token.access_token, token.expires_in);
        this.entries.set(tokenAudience, entry);
        return entry;
    }
    /**
     * Create a cache key.
     */
    cacheKey(tokenAudience) {
        return tokenAudience;
    }
    /**
     * Delete an entry from the cache.
     */
    deleteEntry(tokenAudience) {
        this.entries.delete(tokenAudience);
    }
    /**
     * Get an Azure token entry from the cache.
     */
    getEntry(tokenAudience) {
        return this.entries.get(tokenAudience);
    }
}
azure_token_cache.AzureTokenCache = AzureTokenCache;

Object.defineProperty(azure_service_workflow, "__esModule", { value: true });
azure_service_workflow.AzureServiceWorkflow = void 0;
const error_1$a = error;
const utils_1$5 = utils;
const azure_token_cache_1 = azure_token_cache;
const service_workflow_1 = service_workflow;
/** Base URL for getting Azure tokens. */
const AZURE_BASE_URL = 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01';
/** Azure request headers. */
const AZURE_HEADERS = Object.freeze({ Metadata: 'true', Accept: 'application/json' });
/** Invalid endpoint result error. */
const ENDPOINT_RESULT_ERROR = 'Azure endpoint did not return a value with only access_token and expires_in properties';
/** Error for when the token audience is missing in the environment. */
const TOKEN_AUDIENCE_MISSING_ERROR = 'TOKEN_AUDIENCE must be set in the auth mechanism properties when PROVIDER_NAME is azure.';
/**
 * Device workflow implementation for Azure.
 *
 * @internal
 */
class AzureServiceWorkflow extends service_workflow_1.ServiceWorkflow {
    constructor() {
        super(...arguments);
        this.cache = new azure_token_cache_1.AzureTokenCache();
    }
    /**
     * Get the token from the environment.
     */
    async getToken(credentials) {
        const tokenAudience = credentials?.mechanismProperties.TOKEN_AUDIENCE;
        if (!tokenAudience) {
            throw new error_1$a.MongoAzureError(TOKEN_AUDIENCE_MISSING_ERROR);
        }
        let token;
        const entry = this.cache.getEntry(tokenAudience);
        if (entry?.isValid()) {
            token = entry.token;
        }
        else {
            this.cache.deleteEntry(tokenAudience);
            const response = await getAzureTokenData(tokenAudience);
            if (!isEndpointResultValid(response)) {
                throw new error_1$a.MongoAzureError(ENDPOINT_RESULT_ERROR);
            }
            this.cache.addEntry(tokenAudience, response);
            token = response.access_token;
        }
        return token;
    }
}
azure_service_workflow.AzureServiceWorkflow = AzureServiceWorkflow;
/**
 * Hit the Azure endpoint to get the token data.
 */
async function getAzureTokenData(tokenAudience) {
    const url = `${AZURE_BASE_URL}&resource=${tokenAudience}`;
    const data = await (0, utils_1$5.request)(url, {
        json: true,
        headers: AZURE_HEADERS
    });
    return data;
}
/**
 * Determines if a result returned from the endpoint is valid.
 * This means the result is not nullish, contains the access_token required field
 * and the expires_in required field.
 */
function isEndpointResultValid(token) {
    if (token == null || typeof token !== 'object')
        return false;
    return 'access_token' in token && 'expires_in' in token;
}

var callback_workflow = {};

var callback_lock_cache = {};

Object.defineProperty(callback_lock_cache, "__esModule", { value: true });
callback_lock_cache.CallbackLockCache = void 0;
const error_1$9 = error;
const cache_1$1 = cache;
/** Error message for when request callback is missing. */
const REQUEST_CALLBACK_REQUIRED_ERROR = 'Auth mechanism property REQUEST_TOKEN_CALLBACK is required.';
/* Counter for function "hashes".*/
let FN_HASH_COUNTER = 0;
/* No function present function */
const NO_FUNCTION = async () => ({ accessToken: 'test' });
/* The map of function hashes */
const FN_HASHES = new WeakMap();
/* Put the no function hash in the map. */
FN_HASHES.set(NO_FUNCTION, FN_HASH_COUNTER);
/**
 * A cache of request and refresh callbacks per server/user.
 */
class CallbackLockCache extends cache_1$1.Cache {
    /**
     * Get the callbacks for the connection and credentials. If an entry does not
     * exist a new one will get set.
     */
    getEntry(connection, credentials) {
        const requestCallback = credentials.mechanismProperties.REQUEST_TOKEN_CALLBACK;
        const refreshCallback = credentials.mechanismProperties.REFRESH_TOKEN_CALLBACK;
        if (!requestCallback) {
            throw new error_1$9.MongoInvalidArgumentError(REQUEST_CALLBACK_REQUIRED_ERROR);
        }
        const callbackHash = hashFunctions(requestCallback, refreshCallback);
        const key = this.cacheKey(connection.address, credentials.username, callbackHash);
        const entry = this.entries.get(key);
        if (entry) {
            return entry;
        }
        return this.addEntry(key, callbackHash, requestCallback, refreshCallback);
    }
    /**
     * Set locked callbacks on for connection and credentials.
     */
    addEntry(key, callbackHash, requestCallback, refreshCallback) {
        const entry = {
            requestCallback: withLock(requestCallback),
            refreshCallback: refreshCallback ? withLock(refreshCallback) : undefined,
            callbackHash: callbackHash
        };
        this.entries.set(key, entry);
        return entry;
    }
    /**
     * Create a cache key from the address and username.
     */
    cacheKey(address, username, callbackHash) {
        return this.hashedCacheKey(address, username, callbackHash);
    }
}
callback_lock_cache.CallbackLockCache = CallbackLockCache;
/**
 * Ensure the callback is only executed one at a time.
 */
function withLock(callback) {
    let lock = Promise.resolve();
    return async (info, context) => {
        await lock;
        lock = lock.then(() => callback(info, context));
        return lock;
    };
}
/**
 * Get the hash string for the request and refresh functions.
 */
function hashFunctions(requestFn, refreshFn) {
    let requestHash = FN_HASHES.get(requestFn);
    let refreshHash = FN_HASHES.get(refreshFn ?? NO_FUNCTION);
    if (requestHash == null) {
        // Create a new one for the function and put it in the map.
        FN_HASH_COUNTER++;
        requestHash = FN_HASH_COUNTER;
        FN_HASHES.set(requestFn, FN_HASH_COUNTER);
    }
    if (refreshHash == null && refreshFn) {
        // Create a new one for the function and put it in the map.
        FN_HASH_COUNTER++;
        refreshHash = FN_HASH_COUNTER;
        FN_HASHES.set(refreshFn, FN_HASH_COUNTER);
    }
    return `${requestHash}-${refreshHash}`;
}

var token_entry_cache = {};

Object.defineProperty(token_entry_cache, "__esModule", { value: true });
token_entry_cache.TokenEntryCache = token_entry_cache.TokenEntry = void 0;
const cache_1 = cache;
/* Default expiration is now for when no expiration provided */
const DEFAULT_EXPIRATION_SECS = 0;
/** @internal */
class TokenEntry extends cache_1.ExpiringCacheEntry {
    /**
     * Instantiate the entry.
     */
    constructor(tokenResult, serverInfo, expiration) {
        super(expiration);
        this.tokenResult = tokenResult;
        this.serverInfo = serverInfo;
    }
}
token_entry_cache.TokenEntry = TokenEntry;
/**
 * Cache of OIDC token entries.
 * @internal
 */
class TokenEntryCache extends cache_1.Cache {
    /**
     * Set an entry in the token cache.
     */
    addEntry(address, username, callbackHash, tokenResult, serverInfo) {
        const entry = new TokenEntry(tokenResult, serverInfo, tokenResult.expiresInSeconds ?? DEFAULT_EXPIRATION_SECS);
        this.entries.set(this.cacheKey(address, username, callbackHash), entry);
        return entry;
    }
    /**
     * Delete an entry from the cache.
     */
    deleteEntry(address, username, callbackHash) {
        this.entries.delete(this.cacheKey(address, username, callbackHash));
    }
    /**
     * Get an entry from the cache.
     */
    getEntry(address, username, callbackHash) {
        return this.entries.get(this.cacheKey(address, username, callbackHash));
    }
    /**
     * Delete all expired entries from the cache.
     */
    deleteExpiredEntries() {
        for (const [key, entry] of this.entries) {
            if (!entry.isValid()) {
                this.entries.delete(key);
            }
        }
    }
    /**
     * Create a cache key from the address and username.
     */
    cacheKey(address, username, callbackHash) {
        return this.hashedCacheKey(address, username, callbackHash);
    }
}
token_entry_cache.TokenEntryCache = TokenEntryCache;

Object.defineProperty(callback_workflow, "__esModule", { value: true });
callback_workflow.CallbackWorkflow = void 0;
const bson_1$3 = require$$0$8;
const error_1$8 = error;
const utils_1$4 = utils;
const providers_1$1 = providers;
const callback_lock_cache_1 = callback_lock_cache;
const token_entry_cache_1 = token_entry_cache;
/** The current version of OIDC implementation. */
const OIDC_VERSION = 0;
/** 5 minutes in seconds */
const TIMEOUT_S = 300;
/** Properties allowed on results of callbacks. */
const RESULT_PROPERTIES = ['accessToken', 'expiresInSeconds', 'refreshToken'];
/** Error message when the callback result is invalid. */
const CALLBACK_RESULT_ERROR = 'User provided OIDC callbacks must return a valid object with an accessToken.';
/**
 * OIDC implementation of a callback based workflow.
 * @internal
 */
class CallbackWorkflow {
    /**
     * Instantiate the workflow
     */
    constructor() {
        this.cache = new token_entry_cache_1.TokenEntryCache();
        this.callbackCache = new callback_lock_cache_1.CallbackLockCache();
    }
    /**
     * Get the document to add for speculative authentication. This also needs
     * to add a db field from the credentials source.
     */
    async speculativeAuth(credentials) {
        const document = startCommandDocument(credentials);
        document.db = credentials.source;
        return { speculativeAuthenticate: document };
    }
    /**
     * Execute the OIDC callback workflow.
     */
    async execute(connection, credentials, reauthenticating, response) {
        // Get the callbacks with locks from the callback lock cache.
        const { requestCallback, refreshCallback, callbackHash } = this.callbackCache.getEntry(connection, credentials);
        // Look for an existing entry in the cache.
        const entry = this.cache.getEntry(connection.address, credentials.username, callbackHash);
        let result;
        if (entry) {
            // Reauthentication cannot use a token from the cache since the server has
            // stated it is invalid by the request for reauthentication.
            if (entry.isValid() && !reauthenticating) {
                // Presence of a valid cache entry means we can skip to the finishing step.
                result = await this.finishAuthentication(connection, credentials, entry.tokenResult, response?.speculativeAuthenticate?.conversationId);
            }
            else {
                // Presence of an expired cache entry means we must fetch a new one and
                // then execute the final step.
                const tokenResult = await this.fetchAccessToken(connection, credentials, entry.serverInfo, reauthenticating, callbackHash, requestCallback, refreshCallback);
                try {
                    result = await this.finishAuthentication(connection, credentials, tokenResult, reauthenticating ? undefined : response?.speculativeAuthenticate?.conversationId);
                }
                catch (error) {
                    // If we are reauthenticating and this errors with reauthentication
                    // required, we need to do the entire process over again and clear
                    // the cache entry.
                    if (reauthenticating &&
                        error instanceof error_1$8.MongoError &&
                        error.code === error_1$8.MONGODB_ERROR_CODES.Reauthenticate) {
                        this.cache.deleteEntry(connection.address, credentials.username, callbackHash);
                        result = await this.execute(connection, credentials, reauthenticating);
                    }
                    else {
                        throw error;
                    }
                }
            }
        }
        else {
            // No entry in the cache requires us to do all authentication steps
            // from start to finish, including getting a fresh token for the cache.
            const startDocument = await this.startAuthentication(connection, credentials, reauthenticating, response);
            const conversationId = startDocument.conversationId;
            const serverResult = bson_1$3.BSON.deserialize(startDocument.payload.buffer);
            const tokenResult = await this.fetchAccessToken(connection, credentials, serverResult, reauthenticating, callbackHash, requestCallback, refreshCallback);
            result = await this.finishAuthentication(connection, credentials, tokenResult, conversationId);
        }
        return result;
    }
    /**
     * Starts the callback authentication process. If there is a speculative
     * authentication document from the initial handshake, then we will use that
     * value to get the issuer, otherwise we will send the saslStart command.
     */
    async startAuthentication(connection, credentials, reauthenticating, response) {
        let result;
        if (!reauthenticating && response?.speculativeAuthenticate) {
            result = response.speculativeAuthenticate;
        }
        else {
            result = await connection.commandAsync((0, utils_1$4.ns)(credentials.source), startCommandDocument(credentials), undefined);
        }
        return result;
    }
    /**
     * Finishes the callback authentication process.
     */
    async finishAuthentication(connection, credentials, tokenResult, conversationId) {
        const result = await connection.commandAsync((0, utils_1$4.ns)(credentials.source), finishCommandDocument(tokenResult.accessToken, conversationId), undefined);
        return result;
    }
    /**
     * Fetches an access token using either the request or refresh callbacks and
     * puts it in the cache.
     */
    async fetchAccessToken(connection, credentials, serverInfo, reauthenticating, callbackHash, requestCallback, refreshCallback) {
        // Get the token from the cache.
        const entry = this.cache.getEntry(connection.address, credentials.username, callbackHash);
        let result;
        const context = { timeoutSeconds: TIMEOUT_S, version: OIDC_VERSION };
        // Check if there's a token in the cache.
        if (entry) {
            // If the cache entry is valid, return the token result.
            if (entry.isValid() && !reauthenticating) {
                return entry.tokenResult;
            }
            // If the cache entry is not valid, remove it from the cache and first attempt
            // to use the refresh callback to get a new token. If no refresh callback
            // exists, then fallback to the request callback.
            if (refreshCallback) {
                context.refreshToken = entry.tokenResult.refreshToken;
                result = await refreshCallback(serverInfo, context);
            }
            else {
                result = await requestCallback(serverInfo, context);
            }
        }
        else {
            // With no token in the cache we use the request callback.
            result = await requestCallback(serverInfo, context);
        }
        // Validate that the result returned by the callback is acceptable. If it is not
        // we must clear the token result from the cache.
        if (isCallbackResultInvalid(result)) {
            this.cache.deleteEntry(connection.address, credentials.username, callbackHash);
            throw new error_1$8.MongoMissingCredentialsError(CALLBACK_RESULT_ERROR);
        }
        // Cleanup the cache.
        this.cache.deleteExpiredEntries();
        // Put the new entry into the cache.
        this.cache.addEntry(connection.address, credentials.username || '', callbackHash, result, serverInfo);
        return result;
    }
}
callback_workflow.CallbackWorkflow = CallbackWorkflow;
/**
 * Generate the finishing command document for authentication. Will be a
 * saslStart or saslContinue depending on the presence of a conversation id.
 */
function finishCommandDocument(token, conversationId) {
    if (conversationId != null && typeof conversationId === 'number') {
        return {
            saslContinue: 1,
            conversationId: conversationId,
            payload: new bson_1$3.Binary(bson_1$3.BSON.serialize({ jwt: token }))
        };
    }
    // saslContinue requires a conversationId in the command to be valid so in this
    // case the server allows "step two" to actually be a saslStart with the token
    // as the jwt since the use of the cached value has no correlating conversating
    // on the particular connection.
    return {
        saslStart: 1,
        mechanism: providers_1$1.AuthMechanism.MONGODB_OIDC,
        payload: new bson_1$3.Binary(bson_1$3.BSON.serialize({ jwt: token }))
    };
}
/**
 * Determines if a result returned from a request or refresh callback
 * function is invalid. This means the result is nullish, doesn't contain
 * the accessToken required field, and does not contain extra fields.
 */
function isCallbackResultInvalid(tokenResult) {
    if (tokenResult == null || typeof tokenResult !== 'object')
        return true;
    if (!('accessToken' in tokenResult))
        return true;
    return !Object.getOwnPropertyNames(tokenResult).every(prop => RESULT_PROPERTIES.includes(prop));
}
/**
 * Generate the saslStart command document.
 */
function startCommandDocument(credentials) {
    const payload = {};
    if (credentials.username) {
        payload.n = credentials.username;
    }
    return {
        saslStart: 1,
        autoAuthorize: 1,
        mechanism: providers_1$1.AuthMechanism.MONGODB_OIDC,
        payload: new bson_1$3.Binary(bson_1$3.BSON.serialize(payload))
    };
}

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MongoDBOIDC = exports.OIDC_WORKFLOWS = void 0;
	const error_1 = error;
	const auth_provider_1 = auth_provider;
	const aws_service_workflow_1 = aws_service_workflow;
	const azure_service_workflow_1 = azure_service_workflow;
	const callback_workflow_1 = callback_workflow;
	/** Error when credentials are missing. */
	const MISSING_CREDENTIALS_ERROR = 'AuthContext must provide credentials.';
	/** @internal */
	exports.OIDC_WORKFLOWS = new Map();
	exports.OIDC_WORKFLOWS.set('callback', new callback_workflow_1.CallbackWorkflow());
	exports.OIDC_WORKFLOWS.set('aws', new aws_service_workflow_1.AwsServiceWorkflow());
	exports.OIDC_WORKFLOWS.set('azure', new azure_service_workflow_1.AzureServiceWorkflow());
	/**
	 * OIDC auth provider.
	 * @experimental
	 */
	class MongoDBOIDC extends auth_provider_1.AuthProvider {
	    /**
	     * Instantiate the auth provider.
	     */
	    constructor() {
	        super();
	    }
	    /**
	     * Authenticate using OIDC
	     */
	    async auth(authContext) {
	        const { connection, reauthenticating, response } = authContext;
	        const credentials = getCredentials(authContext);
	        const workflow = getWorkflow(credentials);
	        await workflow.execute(connection, credentials, reauthenticating, response);
	    }
	    /**
	     * Add the speculative auth for the initial handshake.
	     */
	    async prepare(handshakeDoc, authContext) {
	        const credentials = getCredentials(authContext);
	        const workflow = getWorkflow(credentials);
	        const result = await workflow.speculativeAuth(credentials);
	        return { ...handshakeDoc, ...result };
	    }
	}
	exports.MongoDBOIDC = MongoDBOIDC;
	/**
	 * Get credentials from the auth context, throwing if they do not exist.
	 */
	function getCredentials(authContext) {
	    const { credentials } = authContext;
	    if (!credentials) {
	        throw new error_1.MongoMissingCredentialsError(MISSING_CREDENTIALS_ERROR);
	    }
	    return credentials;
	}
	/**
	 * Gets either a device workflow or callback workflow.
	 */
	function getWorkflow(credentials) {
	    const providerName = credentials.mechanismProperties.PROVIDER_NAME;
	    const workflow = exports.OIDC_WORKFLOWS.get(providerName || 'callback');
	    if (!workflow) {
	        throw new error_1.MongoInvalidArgumentError(`Could not load workflow for provider ${credentials.mechanismProperties.PROVIDER_NAME}`);
	    }
	    return workflow;
	}
	
} (mongodb_oidc));

var plain = {};

Object.defineProperty(plain, "__esModule", { value: true });
plain.Plain = void 0;
const bson_1$2 = bson;
const error_1$7 = error;
const utils_1$3 = utils;
const auth_provider_1$2 = auth_provider;
class Plain extends auth_provider_1$2.AuthProvider {
    async auth(authContext) {
        const { connection, credentials } = authContext;
        if (!credentials) {
            throw new error_1$7.MongoMissingCredentialsError('AuthContext must provide credentials.');
        }
        const { username, password } = credentials;
        const payload = new bson_1$2.Binary(Buffer.from(`\x00${username}\x00${password}`));
        const command = {
            saslStart: 1,
            mechanism: 'PLAIN',
            payload: payload,
            autoAuthorize: 1
        };
        await connection.commandAsync((0, utils_1$3.ns)('$external.$cmd'), command, undefined);
    }
}
plain.Plain = Plain;

var scram = {};

Object.defineProperty(scram, "__esModule", { value: true });
scram.ScramSHA256 = scram.ScramSHA1 = void 0;
const crypto = require$$0$9;
const util_1 = require$$0$6;
const bson_1$1 = bson;
const deps_1 = deps;
const error_1$6 = error;
const utils_1$2 = utils;
const auth_provider_1$1 = auth_provider;
const providers_1 = providers;
class ScramSHA extends auth_provider_1$1.AuthProvider {
    constructor(cryptoMethod) {
        super();
        this.cryptoMethod = cryptoMethod || 'sha1';
        this.randomBytesAsync = (0, util_1.promisify)(crypto.randomBytes);
    }
    async prepare(handshakeDoc, authContext) {
        const cryptoMethod = this.cryptoMethod;
        const credentials = authContext.credentials;
        if (!credentials) {
            throw new error_1$6.MongoMissingCredentialsError('AuthContext must provide credentials.');
        }
        if (cryptoMethod === 'sha256' &&
            ('kModuleError' in deps_1.saslprep || typeof deps_1.saslprep !== 'function')) {
            (0, utils_1$2.emitWarning)('Warning: no saslprep library specified. Passwords will not be sanitized');
        }
        const nonce = await this.randomBytesAsync(24);
        // store the nonce for later use
        authContext.nonce = nonce;
        const request = {
            ...handshakeDoc,
            speculativeAuthenticate: {
                ...makeFirstMessage(cryptoMethod, credentials, nonce),
                db: credentials.source
            }
        };
        return request;
    }
    async auth(authContext) {
        const { reauthenticating, response } = authContext;
        if (response?.speculativeAuthenticate && !reauthenticating) {
            return continueScramConversation(this.cryptoMethod, response.speculativeAuthenticate, authContext);
        }
        return executeScram(this.cryptoMethod, authContext);
    }
}
function cleanUsername(username) {
    return username.replace('=', '=3D').replace(',', '=2C');
}
function clientFirstMessageBare(username, nonce) {
    // NOTE: This is done b/c Javascript uses UTF-16, but the server is hashing in UTF-8.
    // Since the username is not sasl-prep-d, we need to do this here.
    return Buffer.concat([
        Buffer.from('n=', 'utf8'),
        Buffer.from(username, 'utf8'),
        Buffer.from(',r=', 'utf8'),
        Buffer.from(nonce.toString('base64'), 'utf8')
    ]);
}
function makeFirstMessage(cryptoMethod, credentials, nonce) {
    const username = cleanUsername(credentials.username);
    const mechanism = cryptoMethod === 'sha1' ? providers_1.AuthMechanism.MONGODB_SCRAM_SHA1 : providers_1.AuthMechanism.MONGODB_SCRAM_SHA256;
    // NOTE: This is done b/c Javascript uses UTF-16, but the server is hashing in UTF-8.
    // Since the username is not sasl-prep-d, we need to do this here.
    return {
        saslStart: 1,
        mechanism,
        payload: new bson_1$1.Binary(Buffer.concat([Buffer.from('n,,', 'utf8'), clientFirstMessageBare(username, nonce)])),
        autoAuthorize: 1,
        options: { skipEmptyExchange: true }
    };
}
async function executeScram(cryptoMethod, authContext) {
    const { connection, credentials } = authContext;
    if (!credentials) {
        throw new error_1$6.MongoMissingCredentialsError('AuthContext must provide credentials.');
    }
    if (!authContext.nonce) {
        throw new error_1$6.MongoInvalidArgumentError('AuthContext must contain a valid nonce property');
    }
    const nonce = authContext.nonce;
    const db = credentials.source;
    const saslStartCmd = makeFirstMessage(cryptoMethod, credentials, nonce);
    const response = await connection.commandAsync((0, utils_1$2.ns)(`${db}.$cmd`), saslStartCmd, undefined);
    await continueScramConversation(cryptoMethod, response, authContext);
}
async function continueScramConversation(cryptoMethod, response, authContext) {
    const connection = authContext.connection;
    const credentials = authContext.credentials;
    if (!credentials) {
        throw new error_1$6.MongoMissingCredentialsError('AuthContext must provide credentials.');
    }
    if (!authContext.nonce) {
        throw new error_1$6.MongoInvalidArgumentError('Unable to continue SCRAM without valid nonce');
    }
    const nonce = authContext.nonce;
    const db = credentials.source;
    const username = cleanUsername(credentials.username);
    const password = credentials.password;
    let processedPassword;
    if (cryptoMethod === 'sha256') {
        processedPassword =
            'kModuleError' in deps_1.saslprep || typeof deps_1.saslprep !== 'function' ? password : (0, deps_1.saslprep)(password);
    }
    else {
        processedPassword = passwordDigest(username, password);
    }
    const payload = Buffer.isBuffer(response.payload)
        ? new bson_1$1.Binary(response.payload)
        : response.payload;
    const dict = parsePayload(payload.value());
    const iterations = parseInt(dict.i, 10);
    if (iterations && iterations < 4096) {
        // TODO(NODE-3483)
        throw new error_1$6.MongoRuntimeError(`Server returned an invalid iteration count ${iterations}`);
    }
    const salt = dict.s;
    const rnonce = dict.r;
    if (rnonce.startsWith('nonce')) {
        // TODO(NODE-3483)
        throw new error_1$6.MongoRuntimeError(`Server returned an invalid nonce: ${rnonce}`);
    }
    // Set up start of proof
    const withoutProof = `c=biws,r=${rnonce}`;
    const saltedPassword = HI(processedPassword, Buffer.from(salt, 'base64'), iterations, cryptoMethod);
    const clientKey = HMAC(cryptoMethod, saltedPassword, 'Client Key');
    const serverKey = HMAC(cryptoMethod, saltedPassword, 'Server Key');
    const storedKey = H(cryptoMethod, clientKey);
    const authMessage = [clientFirstMessageBare(username, nonce), payload.value(), withoutProof].join(',');
    const clientSignature = HMAC(cryptoMethod, storedKey, authMessage);
    const clientProof = `p=${xor(clientKey, clientSignature)}`;
    const clientFinal = [withoutProof, clientProof].join(',');
    const serverSignature = HMAC(cryptoMethod, serverKey, authMessage);
    const saslContinueCmd = {
        saslContinue: 1,
        conversationId: response.conversationId,
        payload: new bson_1$1.Binary(Buffer.from(clientFinal))
    };
    const r = await connection.commandAsync((0, utils_1$2.ns)(`${db}.$cmd`), saslContinueCmd, undefined);
    const parsedResponse = parsePayload(r.payload.value());
    if (!compareDigest(Buffer.from(parsedResponse.v, 'base64'), serverSignature)) {
        throw new error_1$6.MongoRuntimeError('Server returned an invalid signature');
    }
    if (r.done !== false) {
        // If the server sends r.done === true we can save one RTT
        return;
    }
    const retrySaslContinueCmd = {
        saslContinue: 1,
        conversationId: r.conversationId,
        payload: Buffer.alloc(0)
    };
    await connection.commandAsync((0, utils_1$2.ns)(`${db}.$cmd`), retrySaslContinueCmd, undefined);
}
function parsePayload(payload) {
    const dict = {};
    const parts = payload.split(',');
    for (let i = 0; i < parts.length; i++) {
        const valueParts = parts[i].split('=');
        dict[valueParts[0]] = valueParts[1];
    }
    return dict;
}
function passwordDigest(username, password) {
    if (typeof username !== 'string') {
        throw new error_1$6.MongoInvalidArgumentError('Username must be a string');
    }
    if (typeof password !== 'string') {
        throw new error_1$6.MongoInvalidArgumentError('Password must be a string');
    }
    if (password.length === 0) {
        throw new error_1$6.MongoInvalidArgumentError('Password cannot be empty');
    }
    let md5;
    try {
        md5 = crypto.createHash('md5');
    }
    catch (err) {
        if (crypto.getFips()) {
            // This error is (slightly) more helpful than what comes from OpenSSL directly, e.g.
            // 'Error: error:060800C8:digital envelope routines:EVP_DigestInit_ex:disabled for FIPS'
            throw new Error('Auth mechanism SCRAM-SHA-1 is not supported in FIPS mode');
        }
        throw err;
    }
    md5.update(`${username}:mongo:${password}`, 'utf8');
    return md5.digest('hex');
}
// XOR two buffers
function xor(a, b) {
    if (!Buffer.isBuffer(a)) {
        a = Buffer.from(a);
    }
    if (!Buffer.isBuffer(b)) {
        b = Buffer.from(b);
    }
    const length = Math.max(a.length, b.length);
    const res = [];
    for (let i = 0; i < length; i += 1) {
        res.push(a[i] ^ b[i]);
    }
    return Buffer.from(res).toString('base64');
}
function H(method, text) {
    return crypto.createHash(method).update(text).digest();
}
function HMAC(method, key, text) {
    return crypto.createHmac(method, key).update(text).digest();
}
let _hiCache = {};
let _hiCacheCount = 0;
function _hiCachePurge() {
    _hiCache = {};
    _hiCacheCount = 0;
}
const hiLengthMap = {
    sha256: 32,
    sha1: 20
};
function HI(data, salt, iterations, cryptoMethod) {
    // omit the work if already generated
    const key = [data, salt.toString('base64'), iterations].join('_');
    if (_hiCache[key] != null) {
        return _hiCache[key];
    }
    // generate the salt
    const saltedData = crypto.pbkdf2Sync(data, salt, iterations, hiLengthMap[cryptoMethod], cryptoMethod);
    // cache a copy to speed up the next lookup, but prevent unbounded cache growth
    if (_hiCacheCount >= 200) {
        _hiCachePurge();
    }
    _hiCache[key] = saltedData;
    _hiCacheCount += 1;
    return saltedData;
}
function compareDigest(lhs, rhs) {
    if (lhs.length !== rhs.length) {
        return false;
    }
    if (typeof crypto.timingSafeEqual === 'function') {
        return crypto.timingSafeEqual(lhs, rhs);
    }
    let result = 0;
    for (let i = 0; i < lhs.length; i++) {
        result |= lhs[i] ^ rhs[i];
    }
    return result === 0;
}
class ScramSHA1 extends ScramSHA {
    constructor() {
        super('sha1');
    }
}
scram.ScramSHA1 = ScramSHA1;
class ScramSHA256 extends ScramSHA {
    constructor() {
        super('sha256');
    }
}
scram.ScramSHA256 = ScramSHA256;

var x509 = {};

Object.defineProperty(x509, "__esModule", { value: true });
x509.X509 = void 0;
const error_1$5 = error;
const utils_1$1 = utils;
const auth_provider_1 = auth_provider;
class X509 extends auth_provider_1.AuthProvider {
    async prepare(handshakeDoc, authContext) {
        const { credentials } = authContext;
        if (!credentials) {
            throw new error_1$5.MongoMissingCredentialsError('AuthContext must provide credentials.');
        }
        return { ...handshakeDoc, speculativeAuthenticate: x509AuthenticateCommand(credentials) };
    }
    async auth(authContext) {
        const connection = authContext.connection;
        const credentials = authContext.credentials;
        if (!credentials) {
            throw new error_1$5.MongoMissingCredentialsError('AuthContext must provide credentials.');
        }
        const response = authContext.response;
        if (response?.speculativeAuthenticate) {
            return;
        }
        await connection.commandAsync((0, utils_1$1.ns)('$external.$cmd'), x509AuthenticateCommand(credentials), undefined);
    }
}
x509.X509 = X509;
function x509AuthenticateCommand(credentials) {
    const command = { authenticate: 1, mechanism: 'MONGODB-X509' };
    if (credentials.username) {
        command.user = credentials.username;
    }
    return command;
}

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LEGAL_TCP_SOCKET_OPTIONS = exports.LEGAL_TLS_SOCKET_OPTIONS = exports.prepareHandshakeDocument = exports.connect = exports.AUTH_PROVIDERS = void 0;
	const net = require$$0;
	const socks_1 = require$$1;
	const tls = require$$2;
	const constants_1 = constants;
	const error_1 = error;
	const utils_1 = utils;
	const auth_provider_1 = auth_provider;
	const gssapi_1 = gssapi;
	const mongocr_1 = mongocr;
	const mongodb_aws_1 = mongodb_aws;
	const mongodb_oidc_1 = mongodb_oidc;
	const plain_1 = plain;
	const providers_1 = providers;
	const scram_1 = scram;
	const x509_1 = x509;
	const connection_1 = connection;
	const constants_2 = constants$1;
	/** @internal */
	exports.AUTH_PROVIDERS = new Map([
	    [providers_1.AuthMechanism.MONGODB_AWS, new mongodb_aws_1.MongoDBAWS()],
	    [providers_1.AuthMechanism.MONGODB_CR, new mongocr_1.MongoCR()],
	    [providers_1.AuthMechanism.MONGODB_GSSAPI, new gssapi_1.GSSAPI()],
	    [providers_1.AuthMechanism.MONGODB_OIDC, new mongodb_oidc_1.MongoDBOIDC()],
	    [providers_1.AuthMechanism.MONGODB_PLAIN, new plain_1.Plain()],
	    [providers_1.AuthMechanism.MONGODB_SCRAM_SHA1, new scram_1.ScramSHA1()],
	    [providers_1.AuthMechanism.MONGODB_SCRAM_SHA256, new scram_1.ScramSHA256()],
	    [providers_1.AuthMechanism.MONGODB_X509, new x509_1.X509()]
	]);
	function connect(options, callback) {
	    makeConnection({ ...options, existingSocket: undefined }, (err, socket) => {
	        if (err || !socket) {
	            return callback(err);
	        }
	        let ConnectionType = options.connectionType ?? connection_1.Connection;
	        if (options.autoEncrypter) {
	            ConnectionType = connection_1.CryptoConnection;
	        }
	        const connection = new ConnectionType(socket, options);
	        performInitialHandshake(connection, options).then(() => callback(undefined, connection), error => {
	            connection.destroy({ force: false });
	            callback(error);
	        });
	    });
	}
	exports.connect = connect;
	function checkSupportedServer(hello, options) {
	    const maxWireVersion = Number(hello.maxWireVersion);
	    const minWireVersion = Number(hello.minWireVersion);
	    const serverVersionHighEnough = !Number.isNaN(maxWireVersion) && maxWireVersion >= constants_2.MIN_SUPPORTED_WIRE_VERSION;
	    const serverVersionLowEnough = !Number.isNaN(minWireVersion) && minWireVersion <= constants_2.MAX_SUPPORTED_WIRE_VERSION;
	    if (serverVersionHighEnough) {
	        if (serverVersionLowEnough) {
	            return null;
	        }
	        const message = `Server at ${options.hostAddress} reports minimum wire version ${JSON.stringify(hello.minWireVersion)}, but this version of the Node.js Driver requires at most ${constants_2.MAX_SUPPORTED_WIRE_VERSION} (MongoDB ${constants_2.MAX_SUPPORTED_SERVER_VERSION})`;
	        return new error_1.MongoCompatibilityError(message);
	    }
	    const message = `Server at ${options.hostAddress} reports maximum wire version ${JSON.stringify(hello.maxWireVersion) ?? 0}, but this version of the Node.js Driver requires at least ${constants_2.MIN_SUPPORTED_WIRE_VERSION} (MongoDB ${constants_2.MIN_SUPPORTED_SERVER_VERSION})`;
	    return new error_1.MongoCompatibilityError(message);
	}
	async function performInitialHandshake(conn, options) {
	    const credentials = options.credentials;
	    if (credentials) {
	        if (!(credentials.mechanism === providers_1.AuthMechanism.MONGODB_DEFAULT) &&
	            !exports.AUTH_PROVIDERS.get(credentials.mechanism)) {
	            throw new error_1.MongoInvalidArgumentError(`AuthMechanism '${credentials.mechanism}' not supported`);
	        }
	    }
	    const authContext = new auth_provider_1.AuthContext(conn, credentials, options);
	    conn.authContext = authContext;
	    const handshakeDoc = await prepareHandshakeDocument(authContext);
	    // @ts-expect-error: TODO(NODE-5141): The options need to be filtered properly, Connection options differ from Command options
	    const handshakeOptions = { ...options };
	    if (typeof options.connectTimeoutMS === 'number') {
	        // The handshake technically is a monitoring check, so its socket timeout should be connectTimeoutMS
	        handshakeOptions.socketTimeoutMS = options.connectTimeoutMS;
	    }
	    const start = new Date().getTime();
	    const response = await conn.commandAsync((0, utils_1.ns)('admin.$cmd'), handshakeDoc, handshakeOptions);
	    if (!('isWritablePrimary' in response)) {
	        // Provide hello-style response document.
	        response.isWritablePrimary = response[constants_1.LEGACY_HELLO_COMMAND];
	    }
	    if (response.helloOk) {
	        conn.helloOk = true;
	    }
	    const supportedServerErr = checkSupportedServer(response, options);
	    if (supportedServerErr) {
	        throw supportedServerErr;
	    }
	    if (options.loadBalanced) {
	        if (!response.serviceId) {
	            throw new error_1.MongoCompatibilityError('Driver attempted to initialize in load balancing mode, ' +
	                'but the server does not support this mode.');
	        }
	    }
	    // NOTE: This is metadata attached to the connection while porting away from
	    //       handshake being done in the `Server` class. Likely, it should be
	    //       relocated, or at very least restructured.
	    conn.hello = response;
	    conn.lastHelloMS = new Date().getTime() - start;
	    if (!response.arbiterOnly && credentials) {
	        // store the response on auth context
	        authContext.response = response;
	        const resolvedCredentials = credentials.resolveAuthMechanism(response);
	        const provider = exports.AUTH_PROVIDERS.get(resolvedCredentials.mechanism);
	        if (!provider) {
	            throw new error_1.MongoInvalidArgumentError(`No AuthProvider for ${resolvedCredentials.mechanism} defined.`);
	        }
	        try {
	            await provider.auth(authContext);
	        }
	        catch (error) {
	            if (error instanceof error_1.MongoError) {
	                error.addErrorLabel(error_1.MongoErrorLabel.HandshakeError);
	                if ((0, error_1.needsRetryableWriteLabel)(error, response.maxWireVersion)) {
	                    error.addErrorLabel(error_1.MongoErrorLabel.RetryableWriteError);
	                }
	            }
	            throw error;
	        }
	    }
	}
	/**
	 * @internal
	 *
	 * This function is only exposed for testing purposes.
	 */
	async function prepareHandshakeDocument(authContext) {
	    const options = authContext.options;
	    const compressors = options.compressors ? options.compressors : [];
	    const { serverApi } = authContext.connection;
	    const handshakeDoc = {
	        [serverApi?.version ? 'hello' : constants_1.LEGACY_HELLO_COMMAND]: 1,
	        helloOk: true,
	        client: options.metadata,
	        compression: compressors
	    };
	    if (options.loadBalanced === true) {
	        handshakeDoc.loadBalanced = true;
	    }
	    const credentials = authContext.credentials;
	    if (credentials) {
	        if (credentials.mechanism === providers_1.AuthMechanism.MONGODB_DEFAULT && credentials.username) {
	            handshakeDoc.saslSupportedMechs = `${credentials.source}.${credentials.username}`;
	            const provider = exports.AUTH_PROVIDERS.get(providers_1.AuthMechanism.MONGODB_SCRAM_SHA256);
	            if (!provider) {
	                // This auth mechanism is always present.
	                throw new error_1.MongoInvalidArgumentError(`No AuthProvider for ${providers_1.AuthMechanism.MONGODB_SCRAM_SHA256} defined.`);
	            }
	            return provider.prepare(handshakeDoc, authContext);
	        }
	        const provider = exports.AUTH_PROVIDERS.get(credentials.mechanism);
	        if (!provider) {
	            throw new error_1.MongoInvalidArgumentError(`No AuthProvider for ${credentials.mechanism} defined.`);
	        }
	        return provider.prepare(handshakeDoc, authContext);
	    }
	    return handshakeDoc;
	}
	exports.prepareHandshakeDocument = prepareHandshakeDocument;
	/** @public */
	exports.LEGAL_TLS_SOCKET_OPTIONS = [
	    'ALPNProtocols',
	    'ca',
	    'cert',
	    'checkServerIdentity',
	    'ciphers',
	    'crl',
	    'ecdhCurve',
	    'key',
	    'minDHSize',
	    'passphrase',
	    'pfx',
	    'rejectUnauthorized',
	    'secureContext',
	    'secureProtocol',
	    'servername',
	    'session'
	];
	/** @public */
	exports.LEGAL_TCP_SOCKET_OPTIONS = [
	    'family',
	    'hints',
	    'localAddress',
	    'localPort',
	    'lookup'
	];
	function parseConnectOptions(options) {
	    const hostAddress = options.hostAddress;
	    if (!hostAddress)
	        throw new error_1.MongoInvalidArgumentError('Option "hostAddress" is required');
	    const result = {};
	    for (const name of exports.LEGAL_TCP_SOCKET_OPTIONS) {
	        if (options[name] != null) {
	            result[name] = options[name];
	        }
	    }
	    if (typeof hostAddress.socketPath === 'string') {
	        result.path = hostAddress.socketPath;
	        return result;
	    }
	    else if (typeof hostAddress.host === 'string') {
	        result.host = hostAddress.host;
	        result.port = hostAddress.port;
	        return result;
	    }
	    else {
	        // This should never happen since we set up HostAddresses
	        // But if we don't throw here the socket could hang until timeout
	        // TODO(NODE-3483)
	        throw new error_1.MongoRuntimeError(`Unexpected HostAddress ${JSON.stringify(hostAddress)}`);
	    }
	}
	function parseSslOptions(options) {
	    const result = parseConnectOptions(options);
	    // Merge in valid SSL options
	    for (const name of exports.LEGAL_TLS_SOCKET_OPTIONS) {
	        if (options[name] != null) {
	            result[name] = options[name];
	        }
	    }
	    if (options.existingSocket) {
	        result.socket = options.existingSocket;
	    }
	    // Set default sni servername to be the same as host
	    if (result.servername == null && result.host && !net.isIP(result.host)) {
	        result.servername = result.host;
	    }
	    return result;
	}
	const SOCKET_ERROR_EVENT_LIST = ['error', 'close', 'timeout', 'parseError'];
	const SOCKET_ERROR_EVENTS = new Set(SOCKET_ERROR_EVENT_LIST);
	function makeConnection(options, _callback) {
	    const useTLS = options.tls ?? false;
	    const keepAlive = options.keepAlive ?? true;
	    const socketTimeoutMS = options.socketTimeoutMS ?? Reflect.get(options, 'socketTimeout') ?? 0;
	    const noDelay = options.noDelay ?? true;
	    const connectTimeoutMS = options.connectTimeoutMS ?? 30000;
	    const rejectUnauthorized = options.rejectUnauthorized ?? true;
	    const keepAliveInitialDelay = ((options.keepAliveInitialDelay ?? 120000) > socketTimeoutMS
	        ? Math.round(socketTimeoutMS / 2)
	        : options.keepAliveInitialDelay) ?? 120000;
	    const existingSocket = options.existingSocket;
	    let socket;
	    const callback = function (err, ret) {
	        if (err && socket) {
	            socket.destroy();
	        }
	        _callback(err, ret);
	    };
	    if (options.proxyHost != null) {
	        // Currently, only Socks5 is supported.
	        return makeSocks5Connection({
	            ...options,
	            connectTimeoutMS // Should always be present for Socks5
	        }, callback);
	    }
	    if (useTLS) {
	        const tlsSocket = tls.connect(parseSslOptions(options));
	        if (typeof tlsSocket.disableRenegotiation === 'function') {
	            tlsSocket.disableRenegotiation();
	        }
	        socket = tlsSocket;
	    }
	    else if (existingSocket) {
	        // In the TLS case, parseSslOptions() sets options.socket to existingSocket,
	        // so we only need to handle the non-TLS case here (where existingSocket
	        // gives us all we need out of the box).
	        socket = existingSocket;
	    }
	    else {
	        socket = net.createConnection(parseConnectOptions(options));
	    }
	    socket.setKeepAlive(keepAlive, keepAliveInitialDelay);
	    socket.setTimeout(connectTimeoutMS);
	    socket.setNoDelay(noDelay);
	    const connectEvent = useTLS ? 'secureConnect' : 'connect';
	    let cancellationHandler;
	    function errorHandler(eventName) {
	        return (err) => {
	            SOCKET_ERROR_EVENTS.forEach(event => socket.removeAllListeners(event));
	            if (cancellationHandler && options.cancellationToken) {
	                options.cancellationToken.removeListener('cancel', cancellationHandler);
	            }
	            socket.removeListener(connectEvent, connectHandler);
	            callback(connectionFailureError(eventName, err));
	        };
	    }
	    function connectHandler() {
	        SOCKET_ERROR_EVENTS.forEach(event => socket.removeAllListeners(event));
	        if (cancellationHandler && options.cancellationToken) {
	            options.cancellationToken.removeListener('cancel', cancellationHandler);
	        }
	        if ('authorizationError' in socket) {
	            if (socket.authorizationError && rejectUnauthorized) {
	                // TODO(NODE-5192): wrap this with a MongoError subclass
	                return callback(socket.authorizationError);
	            }
	        }
	        socket.setTimeout(0);
	        callback(undefined, socket);
	    }
	    SOCKET_ERROR_EVENTS.forEach(event => socket.once(event, errorHandler(event)));
	    if (options.cancellationToken) {
	        cancellationHandler = errorHandler('cancel');
	        options.cancellationToken.once('cancel', cancellationHandler);
	    }
	    if (existingSocket) {
	        process.nextTick(connectHandler);
	    }
	    else {
	        socket.once(connectEvent, connectHandler);
	    }
	}
	function makeSocks5Connection(options, callback) {
	    const hostAddress = utils_1.HostAddress.fromHostPort(options.proxyHost ?? '', // proxyHost is guaranteed to set here
	    options.proxyPort ?? 1080);
	    // First, connect to the proxy server itself:
	    makeConnection({
	        ...options,
	        hostAddress,
	        tls: false,
	        proxyHost: undefined
	    }, (err, rawSocket) => {
	        if (err) {
	            return callback(err);
	        }
	        const destination = parseConnectOptions(options);
	        if (typeof destination.host !== 'string' || typeof destination.port !== 'number') {
	            return callback(new error_1.MongoInvalidArgumentError('Can only make Socks5 connections to TCP hosts'));
	        }
	        // Then, establish the Socks5 proxy connection:
	        socks_1.SocksClient.createConnection({
	            existing_socket: rawSocket,
	            timeout: options.connectTimeoutMS,
	            command: 'connect',
	            destination: {
	                host: destination.host,
	                port: destination.port
	            },
	            proxy: {
	                // host and port are ignored because we pass existing_socket
	                host: 'iLoveJavaScript',
	                port: 0,
	                type: 5,
	                userId: options.proxyUsername || undefined,
	                password: options.proxyPassword || undefined
	            }
	        }).then(({ socket }) => {
	            // Finally, now treat the resulting duplex stream as the
	            // socket over which we send and receive wire protocol messages:
	            makeConnection({
	                ...options,
	                existingSocket: socket,
	                proxyHost: undefined
	            }, callback);
	        }, error => callback(connectionFailureError('error', error)));
	    });
	}
	function connectionFailureError(type, err) {
	    switch (type) {
	        case 'error':
	            return new error_1.MongoNetworkError(err);
	        case 'timeout':
	            return new error_1.MongoNetworkTimeoutError('connection timed out');
	        case 'close':
	            return new error_1.MongoNetworkError('connection closed');
	        case 'cancel':
	            return new error_1.MongoNetworkError('connection establishment was cancelled');
	        default:
	            return new error_1.MongoNetworkError('unknown network error');
	    }
	}
	
} (connect));

var connection_pool_events = {};

Object.defineProperty(connection_pool_events, "__esModule", { value: true });
connection_pool_events.ConnectionPoolClearedEvent = connection_pool_events.ConnectionCheckedInEvent = connection_pool_events.ConnectionCheckedOutEvent = connection_pool_events.ConnectionCheckOutFailedEvent = connection_pool_events.ConnectionCheckOutStartedEvent = connection_pool_events.ConnectionClosedEvent = connection_pool_events.ConnectionReadyEvent = connection_pool_events.ConnectionCreatedEvent = connection_pool_events.ConnectionPoolClosedEvent = connection_pool_events.ConnectionPoolReadyEvent = connection_pool_events.ConnectionPoolCreatedEvent = connection_pool_events.ConnectionPoolMonitoringEvent = void 0;
const constants_1 = constants;
/**
 * The base export class for all monitoring events published from the connection pool
 * @public
 * @category Event
 */
class ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool) {
        this.time = new Date();
        this.address = pool.address;
    }
}
connection_pool_events.ConnectionPoolMonitoringEvent = ConnectionPoolMonitoringEvent;
/**
 * An event published when a connection pool is created
 * @public
 * @category Event
 */
class ConnectionPoolCreatedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_POOL_CREATED;
        this.options = pool.options;
    }
}
connection_pool_events.ConnectionPoolCreatedEvent = ConnectionPoolCreatedEvent;
/**
 * An event published when a connection pool is ready
 * @public
 * @category Event
 */
class ConnectionPoolReadyEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_POOL_READY;
    }
}
connection_pool_events.ConnectionPoolReadyEvent = ConnectionPoolReadyEvent;
/**
 * An event published when a connection pool is closed
 * @public
 * @category Event
 */
class ConnectionPoolClosedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_POOL_CLOSED;
    }
}
connection_pool_events.ConnectionPoolClosedEvent = ConnectionPoolClosedEvent;
/**
 * An event published when a connection pool creates a new connection
 * @public
 * @category Event
 */
class ConnectionCreatedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool, connection) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_CREATED;
        this.connectionId = connection.id;
    }
}
connection_pool_events.ConnectionCreatedEvent = ConnectionCreatedEvent;
/**
 * An event published when a connection is ready for use
 * @public
 * @category Event
 */
class ConnectionReadyEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool, connection) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_READY;
        this.connectionId = connection.id;
    }
}
connection_pool_events.ConnectionReadyEvent = ConnectionReadyEvent;
/**
 * An event published when a connection is closed
 * @public
 * @category Event
 */
class ConnectionClosedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool, connection, reason, error) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_CLOSED;
        this.connectionId = connection.id;
        this.reason = reason;
        this.serviceId = connection.serviceId;
        this.error = error ?? null;
    }
}
connection_pool_events.ConnectionClosedEvent = ConnectionClosedEvent;
/**
 * An event published when a request to check a connection out begins
 * @public
 * @category Event
 */
class ConnectionCheckOutStartedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_CHECK_OUT_STARTED;
    }
}
connection_pool_events.ConnectionCheckOutStartedEvent = ConnectionCheckOutStartedEvent;
/**
 * An event published when a request to check a connection out fails
 * @public
 * @category Event
 */
class ConnectionCheckOutFailedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool, reason, error) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_CHECK_OUT_FAILED;
        this.reason = reason;
        this.error = error;
    }
}
connection_pool_events.ConnectionCheckOutFailedEvent = ConnectionCheckOutFailedEvent;
/**
 * An event published when a connection is checked out of the connection pool
 * @public
 * @category Event
 */
class ConnectionCheckedOutEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool, connection) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_CHECKED_OUT;
        this.connectionId = connection.id;
    }
}
connection_pool_events.ConnectionCheckedOutEvent = ConnectionCheckedOutEvent;
/**
 * An event published when a connection is checked into the connection pool
 * @public
 * @category Event
 */
class ConnectionCheckedInEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool, connection) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_CHECKED_IN;
        this.connectionId = connection.id;
    }
}
connection_pool_events.ConnectionCheckedInEvent = ConnectionCheckedInEvent;
/**
 * An event published when a connection pool is cleared
 * @public
 * @category Event
 */
class ConnectionPoolClearedEvent extends ConnectionPoolMonitoringEvent {
    /** @internal */
    constructor(pool, options = {}) {
        super(pool);
        /** @internal */
        this.name = constants_1.CONNECTION_POOL_CLEARED;
        this.serviceId = options.serviceId;
        this.interruptInUseConnections = options.interruptInUseConnections;
    }
}
connection_pool_events.ConnectionPoolClearedEvent = ConnectionPoolClearedEvent;

var errors = {};

Object.defineProperty(errors, "__esModule", { value: true });
errors.WaitQueueTimeoutError = errors.PoolClearedOnNetworkError = errors.PoolClearedError = errors.PoolClosedError = void 0;
const error_1$4 = error;
/**
 * An error indicating a connection pool is closed
 * @category Error
 */
class PoolClosedError extends error_1$4.MongoDriverError {
    constructor(pool) {
        super('Attempted to check out a connection from closed connection pool');
        this.address = pool.address;
    }
    get name() {
        return 'MongoPoolClosedError';
    }
}
errors.PoolClosedError = PoolClosedError;
/**
 * An error indicating a connection pool is currently paused
 * @category Error
 */
class PoolClearedError extends error_1$4.MongoNetworkError {
    constructor(pool, message) {
        const errorMessage = message
            ? message
            : `Connection pool for ${pool.address} was cleared because another operation failed with: "${pool.serverError?.message}"`;
        super(errorMessage);
        this.address = pool.address;
        this.addErrorLabel(error_1$4.MongoErrorLabel.RetryableWriteError);
    }
    get name() {
        return 'MongoPoolClearedError';
    }
}
errors.PoolClearedError = PoolClearedError;
/**
 * An error indicating that a connection pool has been cleared after the monitor for that server timed out.
 * @category Error
 */
class PoolClearedOnNetworkError extends PoolClearedError {
    constructor(pool) {
        super(pool, `Connection to ${pool.address} interrupted due to server monitor timeout`);
    }
    get name() {
        return 'PoolClearedOnNetworkError';
    }
}
errors.PoolClearedOnNetworkError = PoolClearedOnNetworkError;
/**
 * An error thrown when a request to check out a connection times out
 * @category Error
 */
class WaitQueueTimeoutError extends error_1$4.MongoDriverError {
    constructor(message, address) {
        super(message);
        this.address = address;
    }
    get name() {
        return 'MongoWaitQueueTimeoutError';
    }
}
errors.WaitQueueTimeoutError = WaitQueueTimeoutError;

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ConnectionPool = exports.PoolState = void 0;
	const timers_1 = require$$0$7;
	const constants_1 = constants;
	const error_1 = error;
	const mongo_types_1 = mongo_types;
	const utils_1 = utils;
	const connect_1 = connect;
	const connection_1 = connection;
	const connection_pool_events_1 = connection_pool_events;
	const errors_1 = errors;
	const metrics_1 = metrics;
	/** @internal */
	const kServer = Symbol('server');
	/** @internal */
	const kConnections = Symbol('connections');
	/** @internal */
	const kPending = Symbol('pending');
	/** @internal */
	const kCheckedOut = Symbol('checkedOut');
	/** @internal */
	const kMinPoolSizeTimer = Symbol('minPoolSizeTimer');
	/** @internal */
	const kGeneration = Symbol('generation');
	/** @internal */
	const kServiceGenerations = Symbol('serviceGenerations');
	/** @internal */
	const kConnectionCounter = Symbol('connectionCounter');
	/** @internal */
	const kCancellationToken = Symbol('cancellationToken');
	/** @internal */
	const kWaitQueue = Symbol('waitQueue');
	/** @internal */
	const kCancelled = Symbol('cancelled');
	/** @internal */
	const kMetrics = Symbol('metrics');
	/** @internal */
	const kProcessingWaitQueue = Symbol('processingWaitQueue');
	/** @internal */
	const kPoolState = Symbol('poolState');
	/** @internal */
	exports.PoolState = Object.freeze({
	    paused: 'paused',
	    ready: 'ready',
	    closed: 'closed'
	});
	/**
	 * A pool of connections which dynamically resizes, and emit events related to pool activity
	 * @internal
	 */
	class ConnectionPool extends mongo_types_1.TypedEventEmitter {
	    constructor(server, options) {
	        super();
	        this.options = Object.freeze({
	            ...options,
	            connectionType: connection_1.Connection,
	            maxPoolSize: options.maxPoolSize ?? 100,
	            minPoolSize: options.minPoolSize ?? 0,
	            maxConnecting: options.maxConnecting ?? 2,
	            maxIdleTimeMS: options.maxIdleTimeMS ?? 0,
	            waitQueueTimeoutMS: options.waitQueueTimeoutMS ?? 0,
	            minPoolSizeCheckFrequencyMS: options.minPoolSizeCheckFrequencyMS ?? 100,
	            autoEncrypter: options.autoEncrypter,
	            metadata: options.metadata
	        });
	        if (this.options.minPoolSize > this.options.maxPoolSize) {
	            throw new error_1.MongoInvalidArgumentError('Connection pool minimum size must not be greater than maximum pool size');
	        }
	        this[kPoolState] = exports.PoolState.paused;
	        this[kServer] = server;
	        this[kConnections] = new utils_1.List();
	        this[kPending] = 0;
	        this[kCheckedOut] = new Set();
	        this[kMinPoolSizeTimer] = undefined;
	        this[kGeneration] = 0;
	        this[kServiceGenerations] = new Map();
	        this[kConnectionCounter] = (0, utils_1.makeCounter)(1);
	        this[kCancellationToken] = new mongo_types_1.CancellationToken();
	        this[kCancellationToken].setMaxListeners(Infinity);
	        this[kWaitQueue] = new utils_1.List();
	        this[kMetrics] = new metrics_1.ConnectionPoolMetrics();
	        this[kProcessingWaitQueue] = false;
	        this.mongoLogger = this[kServer].topology.client.mongoLogger;
	        this.component = 'connection';
	        process.nextTick(() => {
	            this.emitAndLog(ConnectionPool.CONNECTION_POOL_CREATED, new connection_pool_events_1.ConnectionPoolCreatedEvent(this));
	        });
	    }
	    /** The address of the endpoint the pool is connected to */
	    get address() {
	        return this.options.hostAddress.toString();
	    }
	    /**
	     * Check if the pool has been closed
	     *
	     * TODO(NODE-3263): We can remove this property once shell no longer needs it
	     */
	    get closed() {
	        return this[kPoolState] === exports.PoolState.closed;
	    }
	    /** An integer representing the SDAM generation of the pool */
	    get generation() {
	        return this[kGeneration];
	    }
	    /** An integer expressing how many total connections (available + pending + in use) the pool currently has */
	    get totalConnectionCount() {
	        return (this.availableConnectionCount + this.pendingConnectionCount + this.currentCheckedOutCount);
	    }
	    /** An integer expressing how many connections are currently available in the pool. */
	    get availableConnectionCount() {
	        return this[kConnections].length;
	    }
	    get pendingConnectionCount() {
	        return this[kPending];
	    }
	    get currentCheckedOutCount() {
	        return this[kCheckedOut].size;
	    }
	    get waitQueueSize() {
	        return this[kWaitQueue].length;
	    }
	    get loadBalanced() {
	        return this.options.loadBalanced;
	    }
	    get serviceGenerations() {
	        return this[kServiceGenerations];
	    }
	    get serverError() {
	        return this[kServer].description.error;
	    }
	    /**
	     * This is exposed ONLY for use in mongosh, to enable
	     * killing all connections if a user quits the shell with
	     * operations in progress.
	     *
	     * This property may be removed as a part of NODE-3263.
	     */
	    get checkedOutConnections() {
	        return this[kCheckedOut];
	    }
	    /**
	     * Get the metrics information for the pool when a wait queue timeout occurs.
	     */
	    waitQueueErrorMetrics() {
	        return this[kMetrics].info(this.options.maxPoolSize);
	    }
	    /**
	     * Set the pool state to "ready"
	     */
	    ready() {
	        if (this[kPoolState] !== exports.PoolState.paused) {
	            return;
	        }
	        this[kPoolState] = exports.PoolState.ready;
	        this.emitAndLog(ConnectionPool.CONNECTION_POOL_READY, new connection_pool_events_1.ConnectionPoolReadyEvent(this));
	        (0, timers_1.clearTimeout)(this[kMinPoolSizeTimer]);
	        this.ensureMinPoolSize();
	    }
	    /**
	     * Check a connection out of this pool. The connection will continue to be tracked, but no reference to it
	     * will be held by the pool. This means that if a connection is checked out it MUST be checked back in or
	     * explicitly destroyed by the new owner.
	     */
	    checkOut(callback) {
	        this.emitAndLog(ConnectionPool.CONNECTION_CHECK_OUT_STARTED, new connection_pool_events_1.ConnectionCheckOutStartedEvent(this));
	        const waitQueueMember = { callback };
	        const waitQueueTimeoutMS = this.options.waitQueueTimeoutMS;
	        if (waitQueueTimeoutMS) {
	            waitQueueMember.timer = (0, timers_1.setTimeout)(() => {
	                waitQueueMember[kCancelled] = true;
	                waitQueueMember.timer = undefined;
	                this.emitAndLog(ConnectionPool.CONNECTION_CHECK_OUT_FAILED, new connection_pool_events_1.ConnectionCheckOutFailedEvent(this, 'timeout'));
	                waitQueueMember.callback(new errors_1.WaitQueueTimeoutError(this.loadBalanced
	                    ? this.waitQueueErrorMetrics()
	                    : 'Timed out while checking out a connection from connection pool', this.address));
	            }, waitQueueTimeoutMS);
	        }
	        this[kWaitQueue].push(waitQueueMember);
	        process.nextTick(() => this.processWaitQueue());
	    }
	    /**
	     * Check a connection into the pool.
	     *
	     * @param connection - The connection to check in
	     */
	    checkIn(connection) {
	        if (!this[kCheckedOut].has(connection)) {
	            return;
	        }
	        const poolClosed = this.closed;
	        const stale = this.connectionIsStale(connection);
	        const willDestroy = !!(poolClosed || stale || connection.closed);
	        if (!willDestroy) {
	            connection.markAvailable();
	            this[kConnections].unshift(connection);
	        }
	        this[kCheckedOut].delete(connection);
	        this.emitAndLog(ConnectionPool.CONNECTION_CHECKED_IN, new connection_pool_events_1.ConnectionCheckedInEvent(this, connection));
	        if (willDestroy) {
	            const reason = connection.closed ? 'error' : poolClosed ? 'poolClosed' : 'stale';
	            this.destroyConnection(connection, reason);
	        }
	        process.nextTick(() => this.processWaitQueue());
	    }
	    /**
	     * Clear the pool
	     *
	     * Pool reset is handled by incrementing the pool's generation count. Any existing connection of a
	     * previous generation will eventually be pruned during subsequent checkouts.
	     */
	    clear(options = {}) {
	        if (this.closed) {
	            return;
	        }
	        // handle load balanced case
	        if (this.loadBalanced) {
	            const { serviceId } = options;
	            if (!serviceId) {
	                throw new error_1.MongoRuntimeError('ConnectionPool.clear() called in load balanced mode with no serviceId.');
	            }
	            const sid = serviceId.toHexString();
	            const generation = this.serviceGenerations.get(sid);
	            // Only need to worry if the generation exists, since it should
	            // always be there but typescript needs the check.
	            if (generation == null) {
	                throw new error_1.MongoRuntimeError('Service generations are required in load balancer mode.');
	            }
	            else {
	                // Increment the generation for the service id.
	                this.serviceGenerations.set(sid, generation + 1);
	            }
	            this.emitAndLog(ConnectionPool.CONNECTION_POOL_CLEARED, new connection_pool_events_1.ConnectionPoolClearedEvent(this, { serviceId }));
	            return;
	        }
	        // handle non load-balanced case
	        const interruptInUseConnections = options.interruptInUseConnections ?? false;
	        const oldGeneration = this[kGeneration];
	        this[kGeneration] += 1;
	        const alreadyPaused = this[kPoolState] === exports.PoolState.paused;
	        this[kPoolState] = exports.PoolState.paused;
	        this.clearMinPoolSizeTimer();
	        if (!alreadyPaused) {
	            this.emitAndLog(ConnectionPool.CONNECTION_POOL_CLEARED, new connection_pool_events_1.ConnectionPoolClearedEvent(this, {
	                interruptInUseConnections
	            }));
	        }
	        if (interruptInUseConnections) {
	            process.nextTick(() => this.interruptInUseConnections(oldGeneration));
	        }
	        this.processWaitQueue();
	    }
	    /**
	     * Closes all stale in-use connections in the pool with a resumable PoolClearedOnNetworkError.
	     *
	     * Only connections where `connection.generation <= minGeneration` are killed.
	     */
	    interruptInUseConnections(minGeneration) {
	        for (const connection of this[kCheckedOut]) {
	            if (connection.generation <= minGeneration) {
	                this.checkIn(connection);
	                connection.onError(new errors_1.PoolClearedOnNetworkError(this));
	            }
	        }
	    }
	    close(_options, _cb) {
	        let options = _options;
	        const callback = (_cb ?? _options);
	        if (typeof options === 'function') {
	            options = {};
	        }
	        options = Object.assign({ force: false }, options);
	        if (this.closed) {
	            return callback();
	        }
	        // immediately cancel any in-flight connections
	        this[kCancellationToken].emit('cancel');
	        // end the connection counter
	        if (typeof this[kConnectionCounter].return === 'function') {
	            this[kConnectionCounter].return(undefined);
	        }
	        this[kPoolState] = exports.PoolState.closed;
	        this.clearMinPoolSizeTimer();
	        this.processWaitQueue();
	        (0, utils_1.eachAsync)(this[kConnections].toArray(), (conn, cb) => {
	            this.emitAndLog(ConnectionPool.CONNECTION_CLOSED, new connection_pool_events_1.ConnectionClosedEvent(this, conn, 'poolClosed'));
	            conn.destroy({ force: !!options.force }, cb);
	        }, err => {
	            this[kConnections].clear();
	            this.emitAndLog(ConnectionPool.CONNECTION_POOL_CLOSED, new connection_pool_events_1.ConnectionPoolClosedEvent(this));
	            callback(err);
	        });
	    }
	    /**
	     * Runs a lambda with an implicitly checked out connection, checking that connection back in when the lambda
	     * has completed by calling back.
	     *
	     * NOTE: please note the required signature of `fn`
	     *
	     * @remarks When in load balancer mode, connections can be pinned to cursors or transactions.
	     *   In these cases we pass the connection in to this method to ensure it is used and a new
	     *   connection is not checked out.
	     *
	     * @param conn - A pinned connection for use in load balancing mode.
	     * @param fn - A function which operates on a managed connection
	     * @param callback - The original callback
	     */
	    withConnection(conn, fn, callback) {
	        if (conn) {
	            // use the provided connection, and do _not_ check it in after execution
	            fn(undefined, conn, (fnErr, result) => {
	                if (fnErr) {
	                    return this.withReauthentication(fnErr, conn, fn, callback);
	                }
	                callback(undefined, result);
	            });
	            return;
	        }
	        this.checkOut((err, conn) => {
	            // don't callback with `err` here, we might want to act upon it inside `fn`
	            fn(err, conn, (fnErr, result) => {
	                if (fnErr) {
	                    if (conn) {
	                        this.withReauthentication(fnErr, conn, fn, callback);
	                    }
	                    else {
	                        callback(fnErr);
	                    }
	                }
	                else {
	                    callback(undefined, result);
	                }
	                if (conn) {
	                    this.checkIn(conn);
	                }
	            });
	        });
	    }
	    withReauthentication(fnErr, conn, fn, callback) {
	        if (fnErr instanceof error_1.MongoError && fnErr.code === error_1.MONGODB_ERROR_CODES.Reauthenticate) {
	            this.reauthenticate(conn, fn, (error, res) => {
	                if (error) {
	                    return callback(error);
	                }
	                callback(undefined, res);
	            });
	        }
	        else {
	            callback(fnErr);
	        }
	    }
	    /**
	     * Reauthenticate on the same connection and then retry the operation.
	     */
	    reauthenticate(connection, fn, callback) {
	        const authContext = connection.authContext;
	        if (!authContext) {
	            return callback(new error_1.MongoRuntimeError('No auth context found on connection.'));
	        }
	        const credentials = authContext.credentials;
	        if (!credentials) {
	            return callback(new error_1.MongoMissingCredentialsError('Connection is missing credentials when asked to reauthenticate'));
	        }
	        const resolvedCredentials = credentials.resolveAuthMechanism(connection.hello || undefined);
	        const provider = connect_1.AUTH_PROVIDERS.get(resolvedCredentials.mechanism);
	        if (!provider) {
	            return callback(new error_1.MongoMissingCredentialsError(`Reauthenticate failed due to no auth provider for ${credentials.mechanism}`));
	        }
	        provider.reauth(authContext).then(() => {
	            fn(undefined, connection, (fnErr, fnResult) => {
	                if (fnErr) {
	                    return callback(fnErr);
	                }
	                callback(undefined, fnResult);
	            });
	        }, error => callback(error));
	    }
	    /** Clear the min pool size timer */
	    clearMinPoolSizeTimer() {
	        const minPoolSizeTimer = this[kMinPoolSizeTimer];
	        if (minPoolSizeTimer) {
	            (0, timers_1.clearTimeout)(minPoolSizeTimer);
	        }
	    }
	    destroyConnection(connection, reason) {
	        this.emitAndLog(ConnectionPool.CONNECTION_CLOSED, new connection_pool_events_1.ConnectionClosedEvent(this, connection, reason));
	        // destroy the connection
	        process.nextTick(() => connection.destroy({ force: false }));
	    }
	    connectionIsStale(connection) {
	        const serviceId = connection.serviceId;
	        if (this.loadBalanced && serviceId) {
	            const sid = serviceId.toHexString();
	            const generation = this.serviceGenerations.get(sid);
	            return connection.generation !== generation;
	        }
	        return connection.generation !== this[kGeneration];
	    }
	    connectionIsIdle(connection) {
	        return !!(this.options.maxIdleTimeMS && connection.idleTime > this.options.maxIdleTimeMS);
	    }
	    /**
	     * Destroys a connection if the connection is perished.
	     *
	     * @returns `true` if the connection was destroyed, `false` otherwise.
	     */
	    destroyConnectionIfPerished(connection) {
	        const isStale = this.connectionIsStale(connection);
	        const isIdle = this.connectionIsIdle(connection);
	        if (!isStale && !isIdle && !connection.closed) {
	            return false;
	        }
	        const reason = connection.closed ? 'error' : isStale ? 'stale' : 'idle';
	        this.destroyConnection(connection, reason);
	        return true;
	    }
	    createConnection(callback) {
	        const connectOptions = {
	            ...this.options,
	            id: this[kConnectionCounter].next().value,
	            generation: this[kGeneration],
	            cancellationToken: this[kCancellationToken]
	        };
	        this[kPending]++;
	        // This is our version of a "virtual" no-I/O connection as the spec requires
	        this.emitAndLog(ConnectionPool.CONNECTION_CREATED, new connection_pool_events_1.ConnectionCreatedEvent(this, { id: connectOptions.id }));
	        (0, connect_1.connect)(connectOptions, (err, connection) => {
	            if (err || !connection) {
	                this[kPending]--;
	                this.emitAndLog(ConnectionPool.CONNECTION_CLOSED, new connection_pool_events_1.ConnectionClosedEvent(this, { id: connectOptions.id, serviceId: undefined }, 'error', 
	                // TODO(NODE-5192): Remove this cast
	                err));
	                if (err instanceof error_1.MongoNetworkError || err instanceof error_1.MongoServerError) {
	                    err.connectionGeneration = connectOptions.generation;
	                }
	                callback(err ?? new error_1.MongoRuntimeError('Connection creation failed without error'));
	                return;
	            }
	            // The pool might have closed since we started trying to create a connection
	            if (this[kPoolState] !== exports.PoolState.ready) {
	                this[kPending]--;
	                connection.destroy({ force: true });
	                callback(this.closed ? new errors_1.PoolClosedError(this) : new errors_1.PoolClearedError(this));
	                return;
	            }
	            // forward all events from the connection to the pool
	            for (const event of [...constants_1.APM_EVENTS, connection_1.Connection.CLUSTER_TIME_RECEIVED]) {
	                connection.on(event, (e) => this.emit(event, e));
	            }
	            if (this.loadBalanced) {
	                connection.on(connection_1.Connection.PINNED, pinType => this[kMetrics].markPinned(pinType));
	                connection.on(connection_1.Connection.UNPINNED, pinType => this[kMetrics].markUnpinned(pinType));
	                const serviceId = connection.serviceId;
	                if (serviceId) {
	                    let generation;
	                    const sid = serviceId.toHexString();
	                    if ((generation = this.serviceGenerations.get(sid))) {
	                        connection.generation = generation;
	                    }
	                    else {
	                        this.serviceGenerations.set(sid, 0);
	                        connection.generation = 0;
	                    }
	                }
	            }
	            connection.markAvailable();
	            this.emitAndLog(ConnectionPool.CONNECTION_READY, new connection_pool_events_1.ConnectionReadyEvent(this, connection));
	            this[kPending]--;
	            callback(undefined, connection);
	            return;
	        });
	    }
	    ensureMinPoolSize() {
	        const minPoolSize = this.options.minPoolSize;
	        if (this[kPoolState] !== exports.PoolState.ready || minPoolSize === 0) {
	            return;
	        }
	        this[kConnections].prune(connection => this.destroyConnectionIfPerished(connection));
	        if (this.totalConnectionCount < minPoolSize &&
	            this.pendingConnectionCount < this.options.maxConnecting) {
	            // NOTE: ensureMinPoolSize should not try to get all the pending
	            // connection permits because that potentially delays the availability of
	            // the connection to a checkout request
	            this.createConnection((err, connection) => {
	                if (err) {
	                    this[kServer].handleError(err);
	                }
	                if (!err && connection) {
	                    this[kConnections].push(connection);
	                    process.nextTick(() => this.processWaitQueue());
	                }
	                if (this[kPoolState] === exports.PoolState.ready) {
	                    (0, timers_1.clearTimeout)(this[kMinPoolSizeTimer]);
	                    this[kMinPoolSizeTimer] = (0, timers_1.setTimeout)(() => this.ensureMinPoolSize(), this.options.minPoolSizeCheckFrequencyMS);
	                }
	            });
	        }
	        else {
	            (0, timers_1.clearTimeout)(this[kMinPoolSizeTimer]);
	            this[kMinPoolSizeTimer] = (0, timers_1.setTimeout)(() => this.ensureMinPoolSize(), this.options.minPoolSizeCheckFrequencyMS);
	        }
	    }
	    processWaitQueue() {
	        if (this[kProcessingWaitQueue]) {
	            return;
	        }
	        this[kProcessingWaitQueue] = true;
	        while (this.waitQueueSize) {
	            const waitQueueMember = this[kWaitQueue].first();
	            if (!waitQueueMember) {
	                this[kWaitQueue].shift();
	                continue;
	            }
	            if (waitQueueMember[kCancelled]) {
	                this[kWaitQueue].shift();
	                continue;
	            }
	            if (this[kPoolState] !== exports.PoolState.ready) {
	                const reason = this.closed ? 'poolClosed' : 'connectionError';
	                const error = this.closed ? new errors_1.PoolClosedError(this) : new errors_1.PoolClearedError(this);
	                this.emitAndLog(ConnectionPool.CONNECTION_CHECK_OUT_FAILED, new connection_pool_events_1.ConnectionCheckOutFailedEvent(this, reason, error));
	                if (waitQueueMember.timer) {
	                    (0, timers_1.clearTimeout)(waitQueueMember.timer);
	                }
	                this[kWaitQueue].shift();
	                waitQueueMember.callback(error);
	                continue;
	            }
	            if (!this.availableConnectionCount) {
	                break;
	            }
	            const connection = this[kConnections].shift();
	            if (!connection) {
	                break;
	            }
	            if (!this.destroyConnectionIfPerished(connection)) {
	                this[kCheckedOut].add(connection);
	                this.emitAndLog(ConnectionPool.CONNECTION_CHECKED_OUT, new connection_pool_events_1.ConnectionCheckedOutEvent(this, connection));
	                if (waitQueueMember.timer) {
	                    (0, timers_1.clearTimeout)(waitQueueMember.timer);
	                }
	                this[kWaitQueue].shift();
	                waitQueueMember.callback(undefined, connection);
	            }
	        }
	        const { maxPoolSize, maxConnecting } = this.options;
	        while (this.waitQueueSize > 0 &&
	            this.pendingConnectionCount < maxConnecting &&
	            (maxPoolSize === 0 || this.totalConnectionCount < maxPoolSize)) {
	            const waitQueueMember = this[kWaitQueue].shift();
	            if (!waitQueueMember || waitQueueMember[kCancelled]) {
	                continue;
	            }
	            this.createConnection((err, connection) => {
	                if (waitQueueMember[kCancelled]) {
	                    if (!err && connection) {
	                        this[kConnections].push(connection);
	                    }
	                }
	                else {
	                    if (err) {
	                        this.emitAndLog(ConnectionPool.CONNECTION_CHECK_OUT_FAILED, 
	                        // TODO(NODE-5192): Remove this cast
	                        new connection_pool_events_1.ConnectionCheckOutFailedEvent(this, 'connectionError', err));
	                    }
	                    else if (connection) {
	                        this[kCheckedOut].add(connection);
	                        this.emitAndLog(ConnectionPool.CONNECTION_CHECKED_OUT, new connection_pool_events_1.ConnectionCheckedOutEvent(this, connection));
	                    }
	                    if (waitQueueMember.timer) {
	                        (0, timers_1.clearTimeout)(waitQueueMember.timer);
	                    }
	                    waitQueueMember.callback(err, connection);
	                }
	                process.nextTick(() => this.processWaitQueue());
	            });
	        }
	        this[kProcessingWaitQueue] = false;
	    }
	}
	/**
	 * Emitted when the connection pool is created.
	 * @event
	 */
	ConnectionPool.CONNECTION_POOL_CREATED = constants_1.CONNECTION_POOL_CREATED;
	/**
	 * Emitted once when the connection pool is closed
	 * @event
	 */
	ConnectionPool.CONNECTION_POOL_CLOSED = constants_1.CONNECTION_POOL_CLOSED;
	/**
	 * Emitted each time the connection pool is cleared and it's generation incremented
	 * @event
	 */
	ConnectionPool.CONNECTION_POOL_CLEARED = constants_1.CONNECTION_POOL_CLEARED;
	/**
	 * Emitted each time the connection pool is marked ready
	 * @event
	 */
	ConnectionPool.CONNECTION_POOL_READY = constants_1.CONNECTION_POOL_READY;
	/**
	 * Emitted when a connection is created.
	 * @event
	 */
	ConnectionPool.CONNECTION_CREATED = constants_1.CONNECTION_CREATED;
	/**
	 * Emitted when a connection becomes established, and is ready to use
	 * @event
	 */
	ConnectionPool.CONNECTION_READY = constants_1.CONNECTION_READY;
	/**
	 * Emitted when a connection is closed
	 * @event
	 */
	ConnectionPool.CONNECTION_CLOSED = constants_1.CONNECTION_CLOSED;
	/**
	 * Emitted when an attempt to check out a connection begins
	 * @event
	 */
	ConnectionPool.CONNECTION_CHECK_OUT_STARTED = constants_1.CONNECTION_CHECK_OUT_STARTED;
	/**
	 * Emitted when an attempt to check out a connection fails
	 * @event
	 */
	ConnectionPool.CONNECTION_CHECK_OUT_FAILED = constants_1.CONNECTION_CHECK_OUT_FAILED;
	/**
	 * Emitted each time a connection is successfully checked out of the connection pool
	 * @event
	 */
	ConnectionPool.CONNECTION_CHECKED_OUT = constants_1.CONNECTION_CHECKED_OUT;
	/**
	 * Emitted each time a connection is successfully checked into the connection pool
	 * @event
	 */
	ConnectionPool.CONNECTION_CHECKED_IN = constants_1.CONNECTION_CHECKED_IN;
	exports.ConnectionPool = ConnectionPool;
	
} (connection_pool));

var monitor = {};

var hasRequiredMonitor;

function requireMonitor () {
	if (hasRequiredMonitor) return monitor;
	hasRequiredMonitor = 1;
	Object.defineProperty(monitor, "__esModule", { value: true });
	monitor.MonitorInterval = monitor.RTTPinger = monitor.Monitor = void 0;
	const timers_1 = require$$0$7;
	const bson_1 = bson;
	const connect_1 = connect;
	const connection_1 = connection;
	const constants_1 = constants;
	const error_1 = error;
	const mongo_types_1 = mongo_types;
	const utils_1 = utils;
	const common_1 = common$1;
	const events_1 = events;
	const server_1 = requireServer();
	/** @internal */
	const kServer = Symbol('server');
	/** @internal */
	const kMonitorId = Symbol('monitorId');
	/** @internal */
	const kConnection = Symbol('connection');
	/** @internal */
	const kCancellationToken = Symbol('cancellationToken');
	/** @internal */
	const kRTTPinger = Symbol('rttPinger');
	/** @internal */
	const kRoundTripTime = Symbol('roundTripTime');
	const STATE_IDLE = 'idle';
	const STATE_MONITORING = 'monitoring';
	const stateTransition = (0, utils_1.makeStateMachine)({
	    [common_1.STATE_CLOSING]: [common_1.STATE_CLOSING, STATE_IDLE, common_1.STATE_CLOSED],
	    [common_1.STATE_CLOSED]: [common_1.STATE_CLOSED, STATE_MONITORING],
	    [STATE_IDLE]: [STATE_IDLE, STATE_MONITORING, common_1.STATE_CLOSING],
	    [STATE_MONITORING]: [STATE_MONITORING, STATE_IDLE, common_1.STATE_CLOSING]
	});
	const INVALID_REQUEST_CHECK_STATES = new Set([common_1.STATE_CLOSING, common_1.STATE_CLOSED, STATE_MONITORING]);
	function isInCloseState(monitor) {
	    return monitor.s.state === common_1.STATE_CLOSED || monitor.s.state === common_1.STATE_CLOSING;
	}
	/** @internal */
	class Monitor extends mongo_types_1.TypedEventEmitter {
	    get connection() {
	        return this[kConnection];
	    }
	    constructor(server, options) {
	        super();
	        this[kServer] = server;
	        this[kConnection] = undefined;
	        this[kCancellationToken] = new mongo_types_1.CancellationToken();
	        this[kCancellationToken].setMaxListeners(Infinity);
	        this[kMonitorId] = undefined;
	        this.s = {
	            state: common_1.STATE_CLOSED
	        };
	        this.address = server.description.address;
	        this.options = Object.freeze({
	            connectTimeoutMS: options.connectTimeoutMS ?? 10000,
	            heartbeatFrequencyMS: options.heartbeatFrequencyMS ?? 10000,
	            minHeartbeatFrequencyMS: options.minHeartbeatFrequencyMS ?? 500
	        });
	        const cancellationToken = this[kCancellationToken];
	        // TODO: refactor this to pull it directly from the pool, requires new ConnectionPool integration
	        const connectOptions = Object.assign({
	            id: '<monitor>',
	            generation: server.pool.generation,
	            connectionType: connection_1.Connection,
	            cancellationToken,
	            hostAddress: server.description.hostAddress
	        }, options, 
	        // force BSON serialization options
	        {
	            raw: false,
	            useBigInt64: false,
	            promoteLongs: true,
	            promoteValues: true,
	            promoteBuffers: true
	        });
	        // ensure no authentication is used for monitoring
	        delete connectOptions.credentials;
	        if (connectOptions.autoEncrypter) {
	            delete connectOptions.autoEncrypter;
	        }
	        this.connectOptions = Object.freeze(connectOptions);
	    }
	    connect() {
	        if (this.s.state !== common_1.STATE_CLOSED) {
	            return;
	        }
	        // start
	        const heartbeatFrequencyMS = this.options.heartbeatFrequencyMS;
	        const minHeartbeatFrequencyMS = this.options.minHeartbeatFrequencyMS;
	        this[kMonitorId] = new MonitorInterval(monitorServer(this), {
	            heartbeatFrequencyMS: heartbeatFrequencyMS,
	            minHeartbeatFrequencyMS: minHeartbeatFrequencyMS,
	            immediate: true
	        });
	    }
	    requestCheck() {
	        if (INVALID_REQUEST_CHECK_STATES.has(this.s.state)) {
	            return;
	        }
	        this[kMonitorId]?.wake();
	    }
	    reset() {
	        const topologyVersion = this[kServer].description.topologyVersion;
	        if (isInCloseState(this) || topologyVersion == null) {
	            return;
	        }
	        stateTransition(this, common_1.STATE_CLOSING);
	        resetMonitorState(this);
	        // restart monitor
	        stateTransition(this, STATE_IDLE);
	        // restart monitoring
	        const heartbeatFrequencyMS = this.options.heartbeatFrequencyMS;
	        const minHeartbeatFrequencyMS = this.options.minHeartbeatFrequencyMS;
	        this[kMonitorId] = new MonitorInterval(monitorServer(this), {
	            heartbeatFrequencyMS: heartbeatFrequencyMS,
	            minHeartbeatFrequencyMS: minHeartbeatFrequencyMS
	        });
	    }
	    close() {
	        if (isInCloseState(this)) {
	            return;
	        }
	        stateTransition(this, common_1.STATE_CLOSING);
	        resetMonitorState(this);
	        // close monitor
	        this.emit('close');
	        stateTransition(this, common_1.STATE_CLOSED);
	    }
	}
	monitor.Monitor = Monitor;
	function resetMonitorState(monitor) {
	    monitor[kMonitorId]?.stop();
	    monitor[kMonitorId] = undefined;
	    monitor[kRTTPinger]?.close();
	    monitor[kRTTPinger] = undefined;
	    monitor[kCancellationToken].emit('cancel');
	    monitor[kConnection]?.destroy({ force: true });
	    monitor[kConnection] = undefined;
	}
	function checkServer(monitor, callback) {
	    let start = (0, utils_1.now)();
	    monitor.emit(server_1.Server.SERVER_HEARTBEAT_STARTED, new events_1.ServerHeartbeatStartedEvent(monitor.address));
	    function failureHandler(err) {
	        monitor[kConnection]?.destroy({ force: true });
	        monitor[kConnection] = undefined;
	        monitor.emit(server_1.Server.SERVER_HEARTBEAT_FAILED, new events_1.ServerHeartbeatFailedEvent(monitor.address, (0, utils_1.calculateDurationInMs)(start), err));
	        const error = !(err instanceof error_1.MongoError) ? new error_1.MongoError(err) : err;
	        error.addErrorLabel(error_1.MongoErrorLabel.ResetPool);
	        if (error instanceof error_1.MongoNetworkTimeoutError) {
	            error.addErrorLabel(error_1.MongoErrorLabel.InterruptInUseConnections);
	        }
	        monitor.emit('resetServer', error);
	        callback(err);
	    }
	    const connection = monitor[kConnection];
	    if (connection && !connection.closed) {
	        const { serverApi, helloOk } = connection;
	        const connectTimeoutMS = monitor.options.connectTimeoutMS;
	        const maxAwaitTimeMS = monitor.options.heartbeatFrequencyMS;
	        const topologyVersion = monitor[kServer].description.topologyVersion;
	        const isAwaitable = topologyVersion != null;
	        const cmd = {
	            [serverApi?.version || helloOk ? 'hello' : constants_1.LEGACY_HELLO_COMMAND]: 1,
	            ...(isAwaitable && topologyVersion
	                ? { maxAwaitTimeMS, topologyVersion: makeTopologyVersion(topologyVersion) }
	                : {})
	        };
	        const options = isAwaitable
	            ? {
	                socketTimeoutMS: connectTimeoutMS ? connectTimeoutMS + maxAwaitTimeMS : 0,
	                exhaustAllowed: true
	            }
	            : { socketTimeoutMS: connectTimeoutMS };
	        if (isAwaitable && monitor[kRTTPinger] == null) {
	            monitor[kRTTPinger] = new RTTPinger(monitor[kCancellationToken], Object.assign({ heartbeatFrequencyMS: monitor.options.heartbeatFrequencyMS }, monitor.connectOptions));
	        }
	        connection.command((0, utils_1.ns)('admin.$cmd'), cmd, options, (err, hello) => {
	            if (err) {
	                return failureHandler(err);
	            }
	            if (!('isWritablePrimary' in hello)) {
	                // Provide hello-style response document.
	                hello.isWritablePrimary = hello[constants_1.LEGACY_HELLO_COMMAND];
	            }
	            const rttPinger = monitor[kRTTPinger];
	            const duration = isAwaitable && rttPinger ? rttPinger.roundTripTime : (0, utils_1.calculateDurationInMs)(start);
	            monitor.emit(server_1.Server.SERVER_HEARTBEAT_SUCCEEDED, new events_1.ServerHeartbeatSucceededEvent(monitor.address, duration, hello));
	            // if we are using the streaming protocol then we immediately issue another `started`
	            // event, otherwise the "check" is complete and return to the main monitor loop
	            if (isAwaitable && hello.topologyVersion) {
	                monitor.emit(server_1.Server.SERVER_HEARTBEAT_STARTED, new events_1.ServerHeartbeatStartedEvent(monitor.address));
	                start = (0, utils_1.now)();
	            }
	            else {
	                monitor[kRTTPinger]?.close();
	                monitor[kRTTPinger] = undefined;
	                callback(undefined, hello);
	            }
	        });
	        return;
	    }
	    // connecting does an implicit `hello`
	    (0, connect_1.connect)(monitor.connectOptions, (err, conn) => {
	        if (err) {
	            monitor[kConnection] = undefined;
	            failureHandler(err);
	            return;
	        }
	        if (conn) {
	            // Tell the connection that we are using the streaming protocol so that the
	            // connection's message stream will only read the last hello on the buffer.
	            conn.isMonitoringConnection = true;
	            if (isInCloseState(monitor)) {
	                conn.destroy({ force: true });
	                return;
	            }
	            monitor[kConnection] = conn;
	            monitor.emit(server_1.Server.SERVER_HEARTBEAT_SUCCEEDED, new events_1.ServerHeartbeatSucceededEvent(monitor.address, (0, utils_1.calculateDurationInMs)(start), conn.hello));
	            callback(undefined, conn.hello);
	        }
	    });
	}
	function monitorServer(monitor) {
	    return (callback) => {
	        if (monitor.s.state === STATE_MONITORING) {
	            process.nextTick(callback);
	            return;
	        }
	        stateTransition(monitor, STATE_MONITORING);
	        function done() {
	            if (!isInCloseState(monitor)) {
	                stateTransition(monitor, STATE_IDLE);
	            }
	            callback();
	        }
	        checkServer(monitor, (err, hello) => {
	            if (err) {
	                // otherwise an error occurred on initial discovery, also bail
	                if (monitor[kServer].description.type === common_1.ServerType.Unknown) {
	                    return done();
	                }
	            }
	            // if the check indicates streaming is supported, immediately reschedule monitoring
	            if (hello && hello.topologyVersion) {
	                (0, timers_1.setTimeout)(() => {
	                    if (!isInCloseState(monitor)) {
	                        monitor[kMonitorId]?.wake();
	                    }
	                }, 0);
	            }
	            done();
	        });
	    };
	}
	function makeTopologyVersion(tv) {
	    return {
	        processId: tv.processId,
	        // tests mock counter as just number, but in a real situation counter should always be a Long
	        // TODO(NODE-2674): Preserve int64 sent from MongoDB
	        counter: bson_1.Long.isLong(tv.counter) ? tv.counter : bson_1.Long.fromNumber(tv.counter)
	    };
	}
	/** @internal */
	class RTTPinger {
	    constructor(cancellationToken, options) {
	        this[kConnection] = undefined;
	        this[kCancellationToken] = cancellationToken;
	        this[kRoundTripTime] = 0;
	        this.closed = false;
	        const heartbeatFrequencyMS = options.heartbeatFrequencyMS;
	        this[kMonitorId] = (0, timers_1.setTimeout)(() => measureRoundTripTime(this, options), heartbeatFrequencyMS);
	    }
	    get roundTripTime() {
	        return this[kRoundTripTime];
	    }
	    close() {
	        this.closed = true;
	        (0, timers_1.clearTimeout)(this[kMonitorId]);
	        this[kConnection]?.destroy({ force: true });
	        this[kConnection] = undefined;
	    }
	}
	monitor.RTTPinger = RTTPinger;
	function measureRoundTripTime(rttPinger, options) {
	    const start = (0, utils_1.now)();
	    options.cancellationToken = rttPinger[kCancellationToken];
	    const heartbeatFrequencyMS = options.heartbeatFrequencyMS;
	    if (rttPinger.closed) {
	        return;
	    }
	    function measureAndReschedule(conn) {
	        if (rttPinger.closed) {
	            conn?.destroy({ force: true });
	            return;
	        }
	        if (rttPinger[kConnection] == null) {
	            rttPinger[kConnection] = conn;
	        }
	        rttPinger[kRoundTripTime] = (0, utils_1.calculateDurationInMs)(start);
	        rttPinger[kMonitorId] = (0, timers_1.setTimeout)(() => measureRoundTripTime(rttPinger, options), heartbeatFrequencyMS);
	    }
	    const connection = rttPinger[kConnection];
	    if (connection == null) {
	        (0, connect_1.connect)(options, (err, conn) => {
	            if (err) {
	                rttPinger[kConnection] = undefined;
	                rttPinger[kRoundTripTime] = 0;
	                return;
	            }
	            measureAndReschedule(conn);
	        });
	        return;
	    }
	    connection.command((0, utils_1.ns)('admin.$cmd'), { [constants_1.LEGACY_HELLO_COMMAND]: 1 }, undefined, err => {
	        if (err) {
	            rttPinger[kConnection] = undefined;
	            rttPinger[kRoundTripTime] = 0;
	            return;
	        }
	        measureAndReschedule();
	    });
	}
	/**
	 * @internal
	 */
	class MonitorInterval {
	    constructor(fn, options = {}) {
	        this.isExpeditedCallToFnScheduled = false;
	        this.stopped = false;
	        this.isExecutionInProgress = false;
	        this.hasExecutedOnce = false;
	        this._executeAndReschedule = () => {
	            if (this.stopped)
	                return;
	            if (this.timerId) {
	                (0, timers_1.clearTimeout)(this.timerId);
	            }
	            this.isExpeditedCallToFnScheduled = false;
	            this.isExecutionInProgress = true;
	            this.fn(() => {
	                this.lastExecutionEnded = (0, utils_1.now)();
	                this.isExecutionInProgress = false;
	                this._reschedule(this.heartbeatFrequencyMS);
	            });
	        };
	        this.fn = fn;
	        this.lastExecutionEnded = -Infinity;
	        this.heartbeatFrequencyMS = options.heartbeatFrequencyMS ?? 1000;
	        this.minHeartbeatFrequencyMS = options.minHeartbeatFrequencyMS ?? 500;
	        if (options.immediate) {
	            this._executeAndReschedule();
	        }
	        else {
	            this._reschedule(undefined);
	        }
	    }
	    wake() {
	        const currentTime = (0, utils_1.now)();
	        const timeSinceLastCall = currentTime - this.lastExecutionEnded;
	        // TODO(NODE-4674): Add error handling and logging to the monitor
	        if (timeSinceLastCall < 0) {
	            return this._executeAndReschedule();
	        }
	        if (this.isExecutionInProgress) {
	            return;
	        }
	        // debounce multiple calls to wake within the `minInterval`
	        if (this.isExpeditedCallToFnScheduled) {
	            return;
	        }
	        // reschedule a call as soon as possible, ensuring the call never happens
	        // faster than the `minInterval`
	        if (timeSinceLastCall < this.minHeartbeatFrequencyMS) {
	            this.isExpeditedCallToFnScheduled = true;
	            this._reschedule(this.minHeartbeatFrequencyMS - timeSinceLastCall);
	            return;
	        }
	        this._executeAndReschedule();
	    }
	    stop() {
	        this.stopped = true;
	        if (this.timerId) {
	            (0, timers_1.clearTimeout)(this.timerId);
	            this.timerId = undefined;
	        }
	        this.lastExecutionEnded = -Infinity;
	        this.isExpeditedCallToFnScheduled = false;
	    }
	    toString() {
	        return JSON.stringify(this);
	    }
	    toJSON() {
	        const currentTime = (0, utils_1.now)();
	        const timeSinceLastCall = currentTime - this.lastExecutionEnded;
	        return {
	            timerId: this.timerId != null ? 'set' : 'cleared',
	            lastCallTime: this.lastExecutionEnded,
	            isExpeditedCheckScheduled: this.isExpeditedCallToFnScheduled,
	            stopped: this.stopped,
	            heartbeatFrequencyMS: this.heartbeatFrequencyMS,
	            minHeartbeatFrequencyMS: this.minHeartbeatFrequencyMS,
	            currentTime,
	            timeSinceLastCall
	        };
	    }
	    _reschedule(ms) {
	        if (this.stopped)
	            return;
	        if (this.timerId) {
	            (0, timers_1.clearTimeout)(this.timerId);
	        }
	        this.timerId = (0, timers_1.setTimeout)(this._executeAndReschedule, ms || this.heartbeatFrequencyMS);
	    }
	}
	monitor.MonitorInterval = MonitorInterval;
	
	return monitor;
}

var hasRequiredServer;

function requireServer () {
	if (hasRequiredServer) return server;
	hasRequiredServer = 1;
	Object.defineProperty(server, "__esModule", { value: true });
	server.Server = void 0;
	const util_1 = require$$0$6;
	const connection_1 = connection;
	const connection_pool_1 = connection_pool;
	const errors_1 = errors;
	const constants_1 = constants;
	const error_1 = error;
	const mongo_types_1 = mongo_types;
	const transactions_1 = transactions;
	const utils_1 = utils;
	const common_1 = common$1;
	const monitor_1 = requireMonitor();
	const server_description_1 = server_description;
	const stateTransition = (0, utils_1.makeStateMachine)({
	    [common_1.STATE_CLOSED]: [common_1.STATE_CLOSED, common_1.STATE_CONNECTING],
	    [common_1.STATE_CONNECTING]: [common_1.STATE_CONNECTING, common_1.STATE_CLOSING, common_1.STATE_CONNECTED, common_1.STATE_CLOSED],
	    [common_1.STATE_CONNECTED]: [common_1.STATE_CONNECTED, common_1.STATE_CLOSING, common_1.STATE_CLOSED],
	    [common_1.STATE_CLOSING]: [common_1.STATE_CLOSING, common_1.STATE_CLOSED]
	});
	/** @internal */
	const kMonitor = Symbol('monitor');
	/** @internal */
	class Server extends mongo_types_1.TypedEventEmitter {
	    /**
	     * Create a server
	     */
	    constructor(topology, description, options) {
	        super();
	        this.commandAsync = (0, util_1.promisify)((ns, cmd, options, callback) => this.command(ns, cmd, options, callback));
	        this.serverApi = options.serverApi;
	        const poolOptions = { hostAddress: description.hostAddress, ...options };
	        this.topology = topology;
	        this.pool = new connection_pool_1.ConnectionPool(this, poolOptions);
	        this.s = {
	            description,
	            options,
	            state: common_1.STATE_CLOSED,
	            operationCount: 0
	        };
	        for (const event of [...constants_1.CMAP_EVENTS, ...constants_1.APM_EVENTS]) {
	            this.pool.on(event, (e) => this.emit(event, e));
	        }
	        this.pool.on(connection_1.Connection.CLUSTER_TIME_RECEIVED, (clusterTime) => {
	            this.clusterTime = clusterTime;
	        });
	        if (this.loadBalanced) {
	            this[kMonitor] = null;
	            // monitoring is disabled in load balancing mode
	            return;
	        }
	        // create the monitor
	        // TODO(NODE-4144): Remove new variable for type narrowing
	        const monitor = new monitor_1.Monitor(this, this.s.options);
	        this[kMonitor] = monitor;
	        for (const event of constants_1.HEARTBEAT_EVENTS) {
	            monitor.on(event, (e) => this.emit(event, e));
	        }
	        monitor.on('resetServer', (error) => markServerUnknown(this, error));
	        monitor.on(Server.SERVER_HEARTBEAT_SUCCEEDED, (event) => {
	            this.emit(Server.DESCRIPTION_RECEIVED, new server_description_1.ServerDescription(this.description.hostAddress, event.reply, {
	                roundTripTime: calculateRoundTripTime(this.description.roundTripTime, event.duration)
	            }));
	            if (this.s.state === common_1.STATE_CONNECTING) {
	                stateTransition(this, common_1.STATE_CONNECTED);
	                this.emit(Server.CONNECT, this);
	            }
	        });
	    }
	    get clusterTime() {
	        return this.topology.clusterTime;
	    }
	    set clusterTime(clusterTime) {
	        this.topology.clusterTime = clusterTime;
	    }
	    get description() {
	        return this.s.description;
	    }
	    get name() {
	        return this.s.description.address;
	    }
	    get autoEncrypter() {
	        if (this.s.options && this.s.options.autoEncrypter) {
	            return this.s.options.autoEncrypter;
	        }
	        return;
	    }
	    get loadBalanced() {
	        return this.topology.description.type === common_1.TopologyType.LoadBalanced;
	    }
	    /**
	     * Initiate server connect
	     */
	    connect() {
	        if (this.s.state !== common_1.STATE_CLOSED) {
	            return;
	        }
	        stateTransition(this, common_1.STATE_CONNECTING);
	        // If in load balancer mode we automatically set the server to
	        // a load balancer. It never transitions out of this state and
	        // has no monitor.
	        if (!this.loadBalanced) {
	            this[kMonitor]?.connect();
	        }
	        else {
	            stateTransition(this, common_1.STATE_CONNECTED);
	            this.emit(Server.CONNECT, this);
	        }
	    }
	    /** Destroy the server connection */
	    destroy(options, callback) {
	        if (typeof options === 'function') {
	            callback = options;
	            options = { force: false };
	        }
	        options = Object.assign({}, { force: false }, options);
	        if (this.s.state === common_1.STATE_CLOSED) {
	            if (typeof callback === 'function') {
	                callback();
	            }
	            return;
	        }
	        stateTransition(this, common_1.STATE_CLOSING);
	        if (!this.loadBalanced) {
	            this[kMonitor]?.close();
	        }
	        this.pool.close(options, err => {
	            stateTransition(this, common_1.STATE_CLOSED);
	            this.emit('closed');
	            if (typeof callback === 'function') {
	                callback(err);
	            }
	        });
	    }
	    /**
	     * Immediately schedule monitoring of this server. If there already an attempt being made
	     * this will be a no-op.
	     */
	    requestCheck() {
	        if (!this.loadBalanced) {
	            this[kMonitor]?.requestCheck();
	        }
	    }
	    /**
	     * Execute a command
	     * @internal
	     */
	    command(ns, cmd, options, callback) {
	        if (callback == null) {
	            throw new error_1.MongoInvalidArgumentError('Callback must be provided');
	        }
	        if (ns.db == null || typeof ns === 'string') {
	            throw new error_1.MongoInvalidArgumentError('Namespace must not be a string');
	        }
	        if (this.s.state === common_1.STATE_CLOSING || this.s.state === common_1.STATE_CLOSED) {
	            callback(new error_1.MongoServerClosedError());
	            return;
	        }
	        // Clone the options
	        const finalOptions = Object.assign({}, options, { wireProtocolCommand: false });
	        // There are cases where we need to flag the read preference not to get sent in
	        // the command, such as pre-5.0 servers attempting to perform an aggregate write
	        // with a non-primary read preference. In this case the effective read preference
	        // (primary) is not the same as the provided and must be removed completely.
	        if (finalOptions.omitReadPreference) {
	            delete finalOptions.readPreference;
	        }
	        const session = finalOptions.session;
	        const conn = session?.pinnedConnection;
	        // NOTE: This is a hack! We can't retrieve the connections used for executing an operation
	        //       (and prevent them from being checked back in) at the point of operation execution.
	        //       This should be considered as part of the work for NODE-2882
	        // NOTE:
	        //       When incrementing operation count, it's important that we increment it before we
	        //       attempt to check out a connection from the pool.  This ensures that operations that
	        //       are waiting for a connection are included in the operation count.  Load balanced
	        //       mode will only ever have a single server, so the operation count doesn't matter.
	        //       Incrementing the operation count above the logic to handle load balanced mode would
	        //       require special logic to decrement it again, or would double increment (the load
	        //       balanced code makes a recursive call).  Instead, we increment the count after this
	        //       check.
	        if (this.loadBalanced && session && conn == null && isPinnableCommand(cmd, session)) {
	            this.pool.checkOut((err, checkedOut) => {
	                if (err || checkedOut == null) {
	                    if (callback)
	                        return callback(err);
	                    return;
	                }
	                session.pin(checkedOut);
	                this.command(ns, cmd, finalOptions, callback);
	            });
	            return;
	        }
	        this.incrementOperationCount();
	        this.pool.withConnection(conn, (err, conn, cb) => {
	            if (err || !conn) {
	                this.decrementOperationCount();
	                if (!err) {
	                    return cb(new error_1.MongoRuntimeError('Failed to create connection without error'));
	                }
	                if (!(err instanceof errors_1.PoolClearedError)) {
	                    this.handleError(err);
	                }
	                return cb(err);
	            }
	            conn.command(ns, cmd, finalOptions, makeOperationHandler(this, conn, cmd, finalOptions, (error, response) => {
	                this.decrementOperationCount();
	                cb(error, response);
	            }));
	        }, callback);
	    }
	    /**
	     * Handle SDAM error
	     * @internal
	     */
	    handleError(error, connection) {
	        if (!(error instanceof error_1.MongoError)) {
	            return;
	        }
	        const isStaleError = error.connectionGeneration && error.connectionGeneration < this.pool.generation;
	        if (isStaleError) {
	            return;
	        }
	        const isNetworkNonTimeoutError = error instanceof error_1.MongoNetworkError && !(error instanceof error_1.MongoNetworkTimeoutError);
	        const isNetworkTimeoutBeforeHandshakeError = (0, error_1.isNetworkErrorBeforeHandshake)(error);
	        const isAuthHandshakeError = error.hasErrorLabel(error_1.MongoErrorLabel.HandshakeError);
	        if (isNetworkNonTimeoutError || isNetworkTimeoutBeforeHandshakeError || isAuthHandshakeError) {
	            // In load balanced mode we never mark the server as unknown and always
	            // clear for the specific service id.
	            if (!this.loadBalanced) {
	                error.addErrorLabel(error_1.MongoErrorLabel.ResetPool);
	                markServerUnknown(this, error);
	            }
	            else if (connection) {
	                this.pool.clear({ serviceId: connection.serviceId });
	            }
	        }
	        else {
	            if ((0, error_1.isSDAMUnrecoverableError)(error)) {
	                if (shouldHandleStateChangeError(this, error)) {
	                    const shouldClearPool = (0, utils_1.maxWireVersion)(this) <= 7 || (0, error_1.isNodeShuttingDownError)(error);
	                    if (this.loadBalanced && connection && shouldClearPool) {
	                        this.pool.clear({ serviceId: connection.serviceId });
	                    }
	                    if (!this.loadBalanced) {
	                        if (shouldClearPool) {
	                            error.addErrorLabel(error_1.MongoErrorLabel.ResetPool);
	                        }
	                        markServerUnknown(this, error);
	                        process.nextTick(() => this.requestCheck());
	                    }
	                }
	            }
	        }
	    }
	    /**
	     * Decrement the operation count, returning the new count.
	     */
	    decrementOperationCount() {
	        return (this.s.operationCount -= 1);
	    }
	    /**
	     * Increment the operation count, returning the new count.
	     */
	    incrementOperationCount() {
	        return (this.s.operationCount += 1);
	    }
	}
	/** @event */
	Server.SERVER_HEARTBEAT_STARTED = constants_1.SERVER_HEARTBEAT_STARTED;
	/** @event */
	Server.SERVER_HEARTBEAT_SUCCEEDED = constants_1.SERVER_HEARTBEAT_SUCCEEDED;
	/** @event */
	Server.SERVER_HEARTBEAT_FAILED = constants_1.SERVER_HEARTBEAT_FAILED;
	/** @event */
	Server.CONNECT = constants_1.CONNECT;
	/** @event */
	Server.DESCRIPTION_RECEIVED = constants_1.DESCRIPTION_RECEIVED;
	/** @event */
	Server.CLOSED = constants_1.CLOSED;
	/** @event */
	Server.ENDED = constants_1.ENDED;
	server.Server = Server;
	function calculateRoundTripTime(oldRtt, duration) {
	    if (oldRtt === -1) {
	        return duration;
	    }
	    const alpha = 0.2;
	    return alpha * duration + (1 - alpha) * oldRtt;
	}
	function markServerUnknown(server, error) {
	    // Load balancer servers can never be marked unknown.
	    if (server.loadBalanced) {
	        return;
	    }
	    if (error instanceof error_1.MongoNetworkError && !(error instanceof error_1.MongoNetworkTimeoutError)) {
	        server[kMonitor]?.reset();
	    }
	    server.emit(Server.DESCRIPTION_RECEIVED, new server_description_1.ServerDescription(server.description.hostAddress, undefined, { error }));
	}
	function isPinnableCommand(cmd, session) {
	    if (session) {
	        return (session.inTransaction() ||
	            'aggregate' in cmd ||
	            'find' in cmd ||
	            'getMore' in cmd ||
	            'listCollections' in cmd ||
	            'listIndexes' in cmd);
	    }
	    return false;
	}
	function connectionIsStale(pool, connection) {
	    if (connection.serviceId) {
	        return (connection.generation !== pool.serviceGenerations.get(connection.serviceId.toHexString()));
	    }
	    return connection.generation !== pool.generation;
	}
	function shouldHandleStateChangeError(server, err) {
	    const etv = err.topologyVersion;
	    const stv = server.description.topologyVersion;
	    return (0, server_description_1.compareTopologyVersion)(stv, etv) < 0;
	}
	function inActiveTransaction(session, cmd) {
	    return session && session.inTransaction() && !(0, transactions_1.isTransactionCommand)(cmd);
	}
	/** this checks the retryWrites option passed down from the client options, it
	 * does not check if the server supports retryable writes */
	function isRetryableWritesEnabled(topology) {
	    return topology.s.options.retryWrites !== false;
	}
	function makeOperationHandler(server, connection, cmd, options, callback) {
	    const session = options?.session;
	    return function handleOperationResult(error, result) {
	        // We should not swallow an error if it is present.
	        if (error == null && result != null) {
	            return callback(undefined, result);
	        }
	        if (options != null && 'noResponse' in options && options.noResponse === true) {
	            return callback(undefined, null);
	        }
	        if (!error) {
	            return callback(new error_1.MongoUnexpectedServerResponseError('Empty response with no error'));
	        }
	        if (!(error instanceof error_1.MongoError)) {
	            // Node.js or some other error we have not special handling for
	            return callback(error);
	        }
	        if (connectionIsStale(server.pool, connection)) {
	            return callback(error);
	        }
	        if (error instanceof error_1.MongoNetworkError) {
	            if (session && !session.hasEnded && session.serverSession) {
	                session.serverSession.isDirty = true;
	            }
	            // inActiveTransaction check handles commit and abort.
	            if (inActiveTransaction(session, cmd) &&
	                !error.hasErrorLabel(error_1.MongoErrorLabel.TransientTransactionError)) {
	                error.addErrorLabel(error_1.MongoErrorLabel.TransientTransactionError);
	            }
	            if ((isRetryableWritesEnabled(server.topology) || (0, transactions_1.isTransactionCommand)(cmd)) &&
	                (0, utils_1.supportsRetryableWrites)(server) &&
	                !inActiveTransaction(session, cmd)) {
	                error.addErrorLabel(error_1.MongoErrorLabel.RetryableWriteError);
	            }
	        }
	        else {
	            if ((isRetryableWritesEnabled(server.topology) || (0, transactions_1.isTransactionCommand)(cmd)) &&
	                (0, error_1.needsRetryableWriteLabel)(error, (0, utils_1.maxWireVersion)(server)) &&
	                !inActiveTransaction(session, cmd)) {
	                error.addErrorLabel(error_1.MongoErrorLabel.RetryableWriteError);
	            }
	        }
	        if (session &&
	            session.isPinned &&
	            error.hasErrorLabel(error_1.MongoErrorLabel.TransientTransactionError)) {
	            session.unpin({ force: true });
	        }
	        server.handleError(error, connection);
	        return callback(error);
	    };
	}
	
	return server;
}

var srv_polling = {};

Object.defineProperty(srv_polling, "__esModule", { value: true });
srv_polling.SrvPoller = srv_polling.SrvPollingEvent = void 0;
const dns = require$$0$3;
const timers_1 = require$$0$7;
const error_1$3 = error;
const mongo_types_1$1 = mongo_types;
const utils_1 = utils;
/**
 * @internal
 * @category Event
 */
class SrvPollingEvent {
    constructor(srvRecords) {
        this.srvRecords = srvRecords;
    }
    hostnames() {
        return new Set(this.srvRecords.map(r => utils_1.HostAddress.fromSrvRecord(r).toString()));
    }
}
srv_polling.SrvPollingEvent = SrvPollingEvent;
/** @internal */
class SrvPoller extends mongo_types_1$1.TypedEventEmitter {
    constructor(options) {
        super();
        if (!options || !options.srvHost) {
            throw new error_1$3.MongoRuntimeError('Options for SrvPoller must exist and include srvHost');
        }
        this.srvHost = options.srvHost;
        this.srvMaxHosts = options.srvMaxHosts ?? 0;
        this.srvServiceName = options.srvServiceName ?? 'mongodb';
        this.rescanSrvIntervalMS = 60000;
        this.heartbeatFrequencyMS = options.heartbeatFrequencyMS ?? 10000;
        this.haMode = false;
        this.generation = 0;
        this._timeout = undefined;
    }
    get srvAddress() {
        return `_${this.srvServiceName}._tcp.${this.srvHost}`;
    }
    get intervalMS() {
        return this.haMode ? this.heartbeatFrequencyMS : this.rescanSrvIntervalMS;
    }
    start() {
        if (!this._timeout) {
            this.schedule();
        }
    }
    stop() {
        if (this._timeout) {
            (0, timers_1.clearTimeout)(this._timeout);
            this.generation += 1;
            this._timeout = undefined;
        }
    }
    // TODO(NODE-4994): implement new logging logic for SrvPoller failures
    schedule() {
        if (this._timeout) {
            (0, timers_1.clearTimeout)(this._timeout);
        }
        this._timeout = (0, timers_1.setTimeout)(() => {
            this._poll().catch(() => null);
        }, this.intervalMS);
    }
    success(srvRecords) {
        this.haMode = false;
        this.schedule();
        this.emit(SrvPoller.SRV_RECORD_DISCOVERY, new SrvPollingEvent(srvRecords));
    }
    failure() {
        this.haMode = true;
        this.schedule();
    }
    async _poll() {
        const generation = this.generation;
        let srvRecords;
        try {
            srvRecords = await dns.promises.resolveSrv(this.srvAddress);
        }
        catch (dnsError) {
            this.failure();
            return;
        }
        if (generation !== this.generation) {
            return;
        }
        const finalAddresses = [];
        for (const record of srvRecords) {
            if ((0, utils_1.matchesParentDomain)(record.name, this.srvHost)) {
                finalAddresses.push(record);
            }
        }
        if (!finalAddresses.length) {
            this.failure();
            return;
        }
        this.success(finalAddresses);
    }
}
/** @event */
SrvPoller.SRV_RECORD_DISCOVERY = 'srvRecordDiscovery';
srv_polling.SrvPoller = SrvPoller;

var hasRequiredTopology;

function requireTopology () {
	if (hasRequiredTopology) return topology;
	hasRequiredTopology = 1;
	Object.defineProperty(topology, "__esModule", { value: true });
	topology.ServerCapabilities = topology.Topology = void 0;
	const timers_1 = require$$0$7;
	const util_1 = require$$0$6;
	const connection_string_1 = requireConnection_string();
	const constants_1 = constants;
	const error_1 = error;
	const mongo_types_1 = mongo_types;
	const read_preference_1 = read_preference;
	const utils_1 = utils;
	const common_1 = common$1;
	const events_1 = events;
	const server_1 = requireServer();
	const server_description_1 = server_description;
	const server_selection_1 = server_selection;
	const srv_polling_1 = srv_polling;
	const topology_description_1 = topology_description;
	// Global state
	let globalTopologyCounter = 0;
	const stateTransition = (0, utils_1.makeStateMachine)({
	    [common_1.STATE_CLOSED]: [common_1.STATE_CLOSED, common_1.STATE_CONNECTING],
	    [common_1.STATE_CONNECTING]: [common_1.STATE_CONNECTING, common_1.STATE_CLOSING, common_1.STATE_CONNECTED, common_1.STATE_CLOSED],
	    [common_1.STATE_CONNECTED]: [common_1.STATE_CONNECTED, common_1.STATE_CLOSING, common_1.STATE_CLOSED],
	    [common_1.STATE_CLOSING]: [common_1.STATE_CLOSING, common_1.STATE_CLOSED]
	});
	/** @internal */
	const kCancelled = Symbol('cancelled');
	/** @internal */
	const kWaitQueue = Symbol('waitQueue');
	/**
	 * A container of server instances representing a connection to a MongoDB topology.
	 * @internal
	 */
	class Topology extends mongo_types_1.TypedEventEmitter {
	    /**
	     * @param seedlist - a list of HostAddress instances to connect to
	     */
	    constructor(client, seeds, options) {
	        super();
	        this.client = client;
	        this.selectServerAsync = (0, util_1.promisify)((selector, options, callback) => this.selectServer(selector, options, callback));
	        // Options should only be undefined in tests, MongoClient will always have defined options
	        options = options ?? {
	            hosts: [utils_1.HostAddress.fromString('localhost:27017')],
	            ...Object.fromEntries(connection_string_1.DEFAULT_OPTIONS.entries()),
	            ...Object.fromEntries(connection_string_1.FEATURE_FLAGS.entries())
	        };
	        if (typeof seeds === 'string') {
	            seeds = [utils_1.HostAddress.fromString(seeds)];
	        }
	        else if (!Array.isArray(seeds)) {
	            seeds = [seeds];
	        }
	        const seedlist = [];
	        for (const seed of seeds) {
	            if (typeof seed === 'string') {
	                seedlist.push(utils_1.HostAddress.fromString(seed));
	            }
	            else if (seed instanceof utils_1.HostAddress) {
	                seedlist.push(seed);
	            }
	            else {
	                // FIXME(NODE-3483): May need to be a MongoParseError
	                throw new error_1.MongoRuntimeError(`Topology cannot be constructed from ${JSON.stringify(seed)}`);
	            }
	        }
	        const topologyType = topologyTypeFromOptions(options);
	        const topologyId = globalTopologyCounter++;
	        const selectedHosts = options.srvMaxHosts == null ||
	            options.srvMaxHosts === 0 ||
	            options.srvMaxHosts >= seedlist.length
	            ? seedlist
	            : (0, utils_1.shuffle)(seedlist, options.srvMaxHosts);
	        const serverDescriptions = new Map();
	        for (const hostAddress of selectedHosts) {
	            serverDescriptions.set(hostAddress.toString(), new server_description_1.ServerDescription(hostAddress));
	        }
	        this[kWaitQueue] = new utils_1.List();
	        this.s = {
	            // the id of this topology
	            id: topologyId,
	            // passed in options
	            options,
	            // initial seedlist of servers to connect to
	            seedlist,
	            // initial state
	            state: common_1.STATE_CLOSED,
	            // the topology description
	            description: new topology_description_1.TopologyDescription(topologyType, serverDescriptions, options.replicaSet, undefined, undefined, undefined, options),
	            serverSelectionTimeoutMS: options.serverSelectionTimeoutMS,
	            heartbeatFrequencyMS: options.heartbeatFrequencyMS,
	            minHeartbeatFrequencyMS: options.minHeartbeatFrequencyMS,
	            // a map of server instances to normalized addresses
	            servers: new Map(),
	            credentials: options?.credentials,
	            clusterTime: undefined,
	            // timer management
	            connectionTimers: new Set(),
	            detectShardedTopology: ev => this.detectShardedTopology(ev),
	            detectSrvRecords: ev => this.detectSrvRecords(ev)
	        };
	        if (options.srvHost && !options.loadBalanced) {
	            this.s.srvPoller =
	                options.srvPoller ??
	                    new srv_polling_1.SrvPoller({
	                        heartbeatFrequencyMS: this.s.heartbeatFrequencyMS,
	                        srvHost: options.srvHost,
	                        srvMaxHosts: options.srvMaxHosts,
	                        srvServiceName: options.srvServiceName
	                    });
	            this.on(Topology.TOPOLOGY_DESCRIPTION_CHANGED, this.s.detectShardedTopology);
	        }
	    }
	    detectShardedTopology(event) {
	        const previousType = event.previousDescription.type;
	        const newType = event.newDescription.type;
	        const transitionToSharded = previousType !== common_1.TopologyType.Sharded && newType === common_1.TopologyType.Sharded;
	        const srvListeners = this.s.srvPoller?.listeners(srv_polling_1.SrvPoller.SRV_RECORD_DISCOVERY);
	        const listeningToSrvPolling = !!srvListeners?.includes(this.s.detectSrvRecords);
	        if (transitionToSharded && !listeningToSrvPolling) {
	            this.s.srvPoller?.on(srv_polling_1.SrvPoller.SRV_RECORD_DISCOVERY, this.s.detectSrvRecords);
	            this.s.srvPoller?.start();
	        }
	    }
	    detectSrvRecords(ev) {
	        const previousTopologyDescription = this.s.description;
	        this.s.description = this.s.description.updateFromSrvPollingEvent(ev, this.s.options.srvMaxHosts);
	        if (this.s.description === previousTopologyDescription) {
	            // Nothing changed, so return
	            return;
	        }
	        updateServers(this);
	        this.emit(Topology.TOPOLOGY_DESCRIPTION_CHANGED, new events_1.TopologyDescriptionChangedEvent(this.s.id, previousTopologyDescription, this.s.description));
	    }
	    /**
	     * @returns A `TopologyDescription` for this topology
	     */
	    get description() {
	        return this.s.description;
	    }
	    get loadBalanced() {
	        return this.s.options.loadBalanced;
	    }
	    get capabilities() {
	        return new ServerCapabilities(this.lastHello());
	    }
	    connect(options, callback) {
	        if (typeof options === 'function')
	            (callback = options), (options = {});
	        options = options ?? {};
	        if (this.s.state === common_1.STATE_CONNECTED) {
	            if (typeof callback === 'function') {
	                callback();
	            }
	            return;
	        }
	        stateTransition(this, common_1.STATE_CONNECTING);
	        // emit SDAM monitoring events
	        this.emit(Topology.TOPOLOGY_OPENING, new events_1.TopologyOpeningEvent(this.s.id));
	        // emit an event for the topology change
	        this.emit(Topology.TOPOLOGY_DESCRIPTION_CHANGED, new events_1.TopologyDescriptionChangedEvent(this.s.id, new topology_description_1.TopologyDescription(common_1.TopologyType.Unknown), // initial is always Unknown
	        this.s.description));
	        // connect all known servers, then attempt server selection to connect
	        const serverDescriptions = Array.from(this.s.description.servers.values());
	        this.s.servers = new Map(serverDescriptions.map(serverDescription => [
	            serverDescription.address,
	            createAndConnectServer(this, serverDescription)
	        ]));
	        // In load balancer mode we need to fake a server description getting
	        // emitted from the monitor, since the monitor doesn't exist.
	        if (this.s.options.loadBalanced) {
	            for (const description of serverDescriptions) {
	                const newDescription = new server_description_1.ServerDescription(description.hostAddress, undefined, {
	                    loadBalanced: this.s.options.loadBalanced
	                });
	                this.serverUpdateHandler(newDescription);
	            }
	        }
	        const exitWithError = (error) => callback ? callback(error) : this.emit(Topology.ERROR, error);
	        const readPreference = options.readPreference ?? read_preference_1.ReadPreference.primary;
	        this.selectServer((0, server_selection_1.readPreferenceServerSelector)(readPreference), options, (err, server) => {
	            if (err) {
	                return this.close({ force: false }, () => exitWithError(err));
	            }
	            // TODO: NODE-2471
	            const skipPingOnConnect = this.s.options[Symbol.for('@@mdb.skipPingOnConnect')] === true;
	            if (!skipPingOnConnect && server && this.s.credentials) {
	                server.command((0, utils_1.ns)('admin.$cmd'), { ping: 1 }, {}, err => {
	                    if (err) {
	                        return exitWithError(err);
	                    }
	                    stateTransition(this, common_1.STATE_CONNECTED);
	                    this.emit(Topology.OPEN, this);
	                    this.emit(Topology.CONNECT, this);
	                    callback?.(undefined, this);
	                });
	                return;
	            }
	            stateTransition(this, common_1.STATE_CONNECTED);
	            this.emit(Topology.OPEN, this);
	            this.emit(Topology.CONNECT, this);
	            callback?.(undefined, this);
	        });
	    }
	    close(options, callback) {
	        options = options ?? { force: false };
	        if (this.s.state === common_1.STATE_CLOSED || this.s.state === common_1.STATE_CLOSING) {
	            return callback?.();
	        }
	        const destroyedServers = Array.from(this.s.servers.values(), server => {
	            return (0, util_1.promisify)(destroyServer)(server, this, { force: !!options?.force });
	        });
	        Promise.all(destroyedServers)
	            .then(() => {
	            this.s.servers.clear();
	            stateTransition(this, common_1.STATE_CLOSING);
	            drainWaitQueue(this[kWaitQueue], new error_1.MongoTopologyClosedError());
	            (0, common_1.drainTimerQueue)(this.s.connectionTimers);
	            if (this.s.srvPoller) {
	                this.s.srvPoller.stop();
	                this.s.srvPoller.removeListener(srv_polling_1.SrvPoller.SRV_RECORD_DISCOVERY, this.s.detectSrvRecords);
	            }
	            this.removeListener(Topology.TOPOLOGY_DESCRIPTION_CHANGED, this.s.detectShardedTopology);
	            stateTransition(this, common_1.STATE_CLOSED);
	            // emit an event for close
	            this.emit(Topology.TOPOLOGY_CLOSED, new events_1.TopologyClosedEvent(this.s.id));
	        })
	            .finally(() => callback?.());
	    }
	    /**
	     * Selects a server according to the selection predicate provided
	     *
	     * @param selector - An optional selector to select servers by, defaults to a random selection within a latency window
	     * @param options - Optional settings related to server selection
	     * @param callback - The callback used to indicate success or failure
	     * @returns An instance of a `Server` meeting the criteria of the predicate provided
	     */
	    selectServer(selector, options, callback) {
	        let serverSelector;
	        if (typeof selector !== 'function') {
	            if (typeof selector === 'string') {
	                serverSelector = (0, server_selection_1.readPreferenceServerSelector)(read_preference_1.ReadPreference.fromString(selector));
	            }
	            else {
	                let readPreference;
	                if (selector instanceof read_preference_1.ReadPreference) {
	                    readPreference = selector;
	                }
	                else {
	                    read_preference_1.ReadPreference.translate(options);
	                    readPreference = options.readPreference || read_preference_1.ReadPreference.primary;
	                }
	                serverSelector = (0, server_selection_1.readPreferenceServerSelector)(readPreference);
	            }
	        }
	        else {
	            serverSelector = selector;
	        }
	        options = Object.assign({}, { serverSelectionTimeoutMS: this.s.serverSelectionTimeoutMS }, options);
	        const isSharded = this.description.type === common_1.TopologyType.Sharded;
	        const session = options.session;
	        const transaction = session && session.transaction;
	        if (isSharded && transaction && transaction.server) {
	            callback(undefined, transaction.server);
	            return;
	        }
	        const waitQueueMember = {
	            serverSelector,
	            transaction,
	            callback
	        };
	        const serverSelectionTimeoutMS = options.serverSelectionTimeoutMS;
	        if (serverSelectionTimeoutMS) {
	            waitQueueMember.timer = (0, timers_1.setTimeout)(() => {
	                waitQueueMember[kCancelled] = true;
	                waitQueueMember.timer = undefined;
	                const timeoutError = new error_1.MongoServerSelectionError(`Server selection timed out after ${serverSelectionTimeoutMS} ms`, this.description);
	                waitQueueMember.callback(timeoutError);
	            }, serverSelectionTimeoutMS);
	        }
	        this[kWaitQueue].push(waitQueueMember);
	        processWaitQueue(this);
	    }
	    /**
	     * Update the internal TopologyDescription with a ServerDescription
	     *
	     * @param serverDescription - The server to update in the internal list of server descriptions
	     */
	    serverUpdateHandler(serverDescription) {
	        if (!this.s.description.hasServer(serverDescription.address)) {
	            return;
	        }
	        // ignore this server update if its from an outdated topologyVersion
	        if (isStaleServerDescription(this.s.description, serverDescription)) {
	            return;
	        }
	        // these will be used for monitoring events later
	        const previousTopologyDescription = this.s.description;
	        const previousServerDescription = this.s.description.servers.get(serverDescription.address);
	        if (!previousServerDescription) {
	            return;
	        }
	        // Driver Sessions Spec: "Whenever a driver receives a cluster time from
	        // a server it MUST compare it to the current highest seen cluster time
	        // for the deployment. If the new cluster time is higher than the
	        // highest seen cluster time it MUST become the new highest seen cluster
	        // time. Two cluster times are compared using only the BsonTimestamp
	        // value of the clusterTime embedded field."
	        const clusterTime = serverDescription.$clusterTime;
	        if (clusterTime) {
	            (0, common_1._advanceClusterTime)(this, clusterTime);
	        }
	        // If we already know all the information contained in this updated description, then
	        // we don't need to emit SDAM events, but still need to update the description, in order
	        // to keep client-tracked attributes like last update time and round trip time up to date
	        const equalDescriptions = previousServerDescription && previousServerDescription.equals(serverDescription);
	        // first update the TopologyDescription
	        this.s.description = this.s.description.update(serverDescription);
	        if (this.s.description.compatibilityError) {
	            this.emit(Topology.ERROR, new error_1.MongoCompatibilityError(this.s.description.compatibilityError));
	            return;
	        }
	        // emit monitoring events for this change
	        if (!equalDescriptions) {
	            const newDescription = this.s.description.servers.get(serverDescription.address);
	            if (newDescription) {
	                this.emit(Topology.SERVER_DESCRIPTION_CHANGED, new events_1.ServerDescriptionChangedEvent(this.s.id, serverDescription.address, previousServerDescription, newDescription));
	            }
	        }
	        // update server list from updated descriptions
	        updateServers(this, serverDescription);
	        // attempt to resolve any outstanding server selection attempts
	        if (this[kWaitQueue].length > 0) {
	            processWaitQueue(this);
	        }
	        if (!equalDescriptions) {
	            this.emit(Topology.TOPOLOGY_DESCRIPTION_CHANGED, new events_1.TopologyDescriptionChangedEvent(this.s.id, previousTopologyDescription, this.s.description));
	        }
	    }
	    auth(credentials, callback) {
	        if (typeof credentials === 'function')
	            (callback = credentials), (credentials = undefined);
	        if (typeof callback === 'function')
	            callback(undefined, true);
	    }
	    get clientMetadata() {
	        return this.s.options.metadata;
	    }
	    isConnected() {
	        return this.s.state === common_1.STATE_CONNECTED;
	    }
	    isDestroyed() {
	        return this.s.state === common_1.STATE_CLOSED;
	    }
	    // NOTE: There are many places in code where we explicitly check the last hello
	    //       to do feature support detection. This should be done any other way, but for
	    //       now we will just return the first hello seen, which should suffice.
	    lastHello() {
	        const serverDescriptions = Array.from(this.description.servers.values());
	        if (serverDescriptions.length === 0)
	            return {};
	        const sd = serverDescriptions.filter((sd) => sd.type !== common_1.ServerType.Unknown)[0];
	        const result = sd || { maxWireVersion: this.description.commonWireVersion };
	        return result;
	    }
	    get commonWireVersion() {
	        return this.description.commonWireVersion;
	    }
	    get logicalSessionTimeoutMinutes() {
	        return this.description.logicalSessionTimeoutMinutes;
	    }
	    get clusterTime() {
	        return this.s.clusterTime;
	    }
	    set clusterTime(clusterTime) {
	        this.s.clusterTime = clusterTime;
	    }
	}
	/** @event */
	Topology.SERVER_OPENING = constants_1.SERVER_OPENING;
	/** @event */
	Topology.SERVER_CLOSED = constants_1.SERVER_CLOSED;
	/** @event */
	Topology.SERVER_DESCRIPTION_CHANGED = constants_1.SERVER_DESCRIPTION_CHANGED;
	/** @event */
	Topology.TOPOLOGY_OPENING = constants_1.TOPOLOGY_OPENING;
	/** @event */
	Topology.TOPOLOGY_CLOSED = constants_1.TOPOLOGY_CLOSED;
	/** @event */
	Topology.TOPOLOGY_DESCRIPTION_CHANGED = constants_1.TOPOLOGY_DESCRIPTION_CHANGED;
	/** @event */
	Topology.ERROR = constants_1.ERROR;
	/** @event */
	Topology.OPEN = constants_1.OPEN;
	/** @event */
	Topology.CONNECT = constants_1.CONNECT;
	/** @event */
	Topology.CLOSE = constants_1.CLOSE;
	/** @event */
	Topology.TIMEOUT = constants_1.TIMEOUT;
	topology.Topology = Topology;
	/** Destroys a server, and removes all event listeners from the instance */
	function destroyServer(server, topology, options, callback) {
	    options = options ?? { force: false };
	    for (const event of constants_1.LOCAL_SERVER_EVENTS) {
	        server.removeAllListeners(event);
	    }
	    server.destroy(options, () => {
	        topology.emit(Topology.SERVER_CLOSED, new events_1.ServerClosedEvent(topology.s.id, server.description.address));
	        for (const event of constants_1.SERVER_RELAY_EVENTS) {
	            server.removeAllListeners(event);
	        }
	        if (typeof callback === 'function') {
	            callback();
	        }
	    });
	}
	/** Predicts the TopologyType from options */
	function topologyTypeFromOptions(options) {
	    if (options?.directConnection) {
	        return common_1.TopologyType.Single;
	    }
	    if (options?.replicaSet) {
	        return common_1.TopologyType.ReplicaSetNoPrimary;
	    }
	    if (options?.loadBalanced) {
	        return common_1.TopologyType.LoadBalanced;
	    }
	    return common_1.TopologyType.Unknown;
	}
	/**
	 * Creates new server instances and attempts to connect them
	 *
	 * @param topology - The topology that this server belongs to
	 * @param serverDescription - The description for the server to initialize and connect to
	 */
	function createAndConnectServer(topology, serverDescription) {
	    topology.emit(Topology.SERVER_OPENING, new events_1.ServerOpeningEvent(topology.s.id, serverDescription.address));
	    const server = new server_1.Server(topology, serverDescription, topology.s.options);
	    for (const event of constants_1.SERVER_RELAY_EVENTS) {
	        server.on(event, (e) => topology.emit(event, e));
	    }
	    server.on(server_1.Server.DESCRIPTION_RECEIVED, description => topology.serverUpdateHandler(description));
	    server.connect();
	    return server;
	}
	/**
	 * @param topology - Topology to update.
	 * @param incomingServerDescription - New server description.
	 */
	function updateServers(topology, incomingServerDescription) {
	    // update the internal server's description
	    if (incomingServerDescription && topology.s.servers.has(incomingServerDescription.address)) {
	        const server = topology.s.servers.get(incomingServerDescription.address);
	        if (server) {
	            server.s.description = incomingServerDescription;
	            if (incomingServerDescription.error instanceof error_1.MongoError &&
	                incomingServerDescription.error.hasErrorLabel(error_1.MongoErrorLabel.ResetPool)) {
	                const interruptInUseConnections = incomingServerDescription.error.hasErrorLabel(error_1.MongoErrorLabel.InterruptInUseConnections);
	                server.pool.clear({ interruptInUseConnections });
	            }
	            else if (incomingServerDescription.error == null) {
	                const newTopologyType = topology.s.description.type;
	                const shouldMarkPoolReady = incomingServerDescription.isDataBearing ||
	                    (incomingServerDescription.type !== common_1.ServerType.Unknown &&
	                        newTopologyType === common_1.TopologyType.Single);
	                if (shouldMarkPoolReady) {
	                    server.pool.ready();
	                }
	            }
	        }
	    }
	    // add new servers for all descriptions we currently don't know about locally
	    for (const serverDescription of topology.description.servers.values()) {
	        if (!topology.s.servers.has(serverDescription.address)) {
	            const server = createAndConnectServer(topology, serverDescription);
	            topology.s.servers.set(serverDescription.address, server);
	        }
	    }
	    // for all servers no longer known, remove their descriptions and destroy their instances
	    for (const entry of topology.s.servers) {
	        const serverAddress = entry[0];
	        if (topology.description.hasServer(serverAddress)) {
	            continue;
	        }
	        if (!topology.s.servers.has(serverAddress)) {
	            continue;
	        }
	        const server = topology.s.servers.get(serverAddress);
	        topology.s.servers.delete(serverAddress);
	        // prepare server for garbage collection
	        if (server) {
	            destroyServer(server, topology);
	        }
	    }
	}
	function drainWaitQueue(queue, err) {
	    while (queue.length) {
	        const waitQueueMember = queue.shift();
	        if (!waitQueueMember) {
	            continue;
	        }
	        if (waitQueueMember.timer) {
	            (0, timers_1.clearTimeout)(waitQueueMember.timer);
	        }
	        if (!waitQueueMember[kCancelled]) {
	            waitQueueMember.callback(err);
	        }
	    }
	}
	function processWaitQueue(topology) {
	    if (topology.s.state === common_1.STATE_CLOSED) {
	        drainWaitQueue(topology[kWaitQueue], new error_1.MongoTopologyClosedError());
	        return;
	    }
	    const isSharded = topology.description.type === common_1.TopologyType.Sharded;
	    const serverDescriptions = Array.from(topology.description.servers.values());
	    const membersToProcess = topology[kWaitQueue].length;
	    for (let i = 0; i < membersToProcess; ++i) {
	        const waitQueueMember = topology[kWaitQueue].shift();
	        if (!waitQueueMember) {
	            continue;
	        }
	        if (waitQueueMember[kCancelled]) {
	            continue;
	        }
	        let selectedDescriptions;
	        try {
	            const serverSelector = waitQueueMember.serverSelector;
	            selectedDescriptions = serverSelector
	                ? serverSelector(topology.description, serverDescriptions)
	                : serverDescriptions;
	        }
	        catch (e) {
	            if (waitQueueMember.timer) {
	                (0, timers_1.clearTimeout)(waitQueueMember.timer);
	            }
	            waitQueueMember.callback(e);
	            continue;
	        }
	        let selectedServer;
	        if (selectedDescriptions.length === 0) {
	            topology[kWaitQueue].push(waitQueueMember);
	            continue;
	        }
	        else if (selectedDescriptions.length === 1) {
	            selectedServer = topology.s.servers.get(selectedDescriptions[0].address);
	        }
	        else {
	            const descriptions = (0, utils_1.shuffle)(selectedDescriptions, 2);
	            const server1 = topology.s.servers.get(descriptions[0].address);
	            const server2 = topology.s.servers.get(descriptions[1].address);
	            selectedServer =
	                server1 && server2 && server1.s.operationCount < server2.s.operationCount
	                    ? server1
	                    : server2;
	        }
	        if (!selectedServer) {
	            waitQueueMember.callback(new error_1.MongoServerSelectionError('server selection returned a server description but the server was not found in the topology', topology.description));
	            return;
	        }
	        const transaction = waitQueueMember.transaction;
	        if (isSharded && transaction && transaction.isActive && selectedServer) {
	            transaction.pinServer(selectedServer);
	        }
	        if (waitQueueMember.timer) {
	            (0, timers_1.clearTimeout)(waitQueueMember.timer);
	        }
	        waitQueueMember.callback(undefined, selectedServer);
	    }
	    if (topology[kWaitQueue].length > 0) {
	        // ensure all server monitors attempt monitoring soon
	        for (const [, server] of topology.s.servers) {
	            process.nextTick(function scheduleServerCheck() {
	                return server.requestCheck();
	            });
	        }
	    }
	}
	function isStaleServerDescription(topologyDescription, incomingServerDescription) {
	    const currentServerDescription = topologyDescription.servers.get(incomingServerDescription.address);
	    const currentTopologyVersion = currentServerDescription?.topologyVersion;
	    return ((0, server_description_1.compareTopologyVersion)(currentTopologyVersion, incomingServerDescription.topologyVersion) > 0);
	}
	/** @public */
	class ServerCapabilities {
	    constructor(hello) {
	        this.minWireVersion = hello.minWireVersion || 0;
	        this.maxWireVersion = hello.maxWireVersion || 0;
	    }
	    get hasAggregationCursor() {
	        return this.maxWireVersion >= 1;
	    }
	    get hasWriteCommands() {
	        return this.maxWireVersion >= 2;
	    }
	    get hasTextSearch() {
	        return this.minWireVersion >= 0;
	    }
	    get hasAuthCommands() {
	        return this.maxWireVersion >= 1;
	    }
	    get hasListCollectionsCommand() {
	        return this.maxWireVersion >= 3;
	    }
	    get hasListIndexesCommand() {
	        return this.maxWireVersion >= 3;
	    }
	    get supportsSnapshotReads() {
	        return this.maxWireVersion >= 13;
	    }
	    get commandsTakeWriteConcern() {
	        return this.maxWireVersion >= 5;
	    }
	    get commandsTakeCollation() {
	        return this.maxWireVersion >= 5;
	    }
	}
	topology.ServerCapabilities = ServerCapabilities;
	
	return topology;
}

var hasRequiredMongo_client;

function requireMongo_client () {
	if (hasRequiredMongo_client) return mongo_client;
	hasRequiredMongo_client = 1;
	Object.defineProperty(mongo_client, "__esModule", { value: true });
	mongo_client.MongoClient = mongo_client.ServerApiVersion = void 0;
	const util_1 = require$$0$6;
	const bson_1 = bson;
	const change_stream_1 = requireChange_stream();
	const mongo_credentials_1 = mongo_credentials;
	const providers_1 = providers;
	const connection_string_1 = requireConnection_string();
	const constants_1 = constants;
	const db_1 = requireDb();
	const error_1 = error;
	const mongo_logger_1 = mongo_logger;
	const mongo_types_1 = mongo_types;
	const read_preference_1 = read_preference;
	const server_selection_1 = server_selection;
	const topology_1 = requireTopology();
	const sessions_1 = sessions;
	const utils_1 = utils;
	/** @public */
	mongo_client.ServerApiVersion = Object.freeze({
	    v1: '1'
	});
	/** @internal */
	const kOptions = Symbol('options');
	/**
	 * The **MongoClient** class is a class that allows for making Connections to MongoDB.
	 * @public
	 *
	 * @remarks
	 * The programmatically provided options take precedence over the URI options.
	 *
	 * @example
	 * ```ts
	 * import { MongoClient } from 'mongodb';
	 *
	 * // Enable command monitoring for debugging
	 * const client = new MongoClient('mongodb://localhost:27017', { monitorCommands: true });
	 *
	 * client.on('commandStarted', started => console.log(started));
	 * client.db().collection('pets');
	 * await client.insertOne({ name: 'spot', kind: 'dog' });
	 * ```
	 */
	class MongoClient extends mongo_types_1.TypedEventEmitter {
	    constructor(url, options) {
	        super();
	        this[kOptions] = (0, connection_string_1.parseOptions)(url, this, options);
	        this.mongoLogger = new mongo_logger_1.MongoLogger(this[kOptions].mongoLoggerOptions);
	        // eslint-disable-next-line @typescript-eslint/no-this-alias
	        const client = this;
	        // The internal state
	        this.s = {
	            url,
	            bsonOptions: (0, bson_1.resolveBSONOptions)(this[kOptions]),
	            namespace: (0, utils_1.ns)('admin'),
	            hasBeenClosed: false,
	            sessionPool: new sessions_1.ServerSessionPool(this),
	            activeSessions: new Set(),
	            get options() {
	                return client[kOptions];
	            },
	            get readConcern() {
	                return client[kOptions].readConcern;
	            },
	            get writeConcern() {
	                return client[kOptions].writeConcern;
	            },
	            get readPreference() {
	                return client[kOptions].readPreference;
	            },
	            get isMongoClient() {
	                return true;
	            }
	        };
	    }
	    /** @see MongoOptions */
	    get options() {
	        return Object.freeze({ ...this[kOptions] });
	    }
	    get serverApi() {
	        return this[kOptions].serverApi && Object.freeze({ ...this[kOptions].serverApi });
	    }
	    /**
	     * Intended for APM use only
	     * @internal
	     */
	    get monitorCommands() {
	        return this[kOptions].monitorCommands;
	    }
	    set monitorCommands(value) {
	        this[kOptions].monitorCommands = value;
	    }
	    get autoEncrypter() {
	        return this[kOptions].autoEncrypter;
	    }
	    get readConcern() {
	        return this.s.readConcern;
	    }
	    get writeConcern() {
	        return this.s.writeConcern;
	    }
	    get readPreference() {
	        return this.s.readPreference;
	    }
	    get bsonOptions() {
	        return this.s.bsonOptions;
	    }
	    /**
	     * Connect to MongoDB using a url
	     *
	     * @see docs.mongodb.org/manual/reference/connection-string/
	     */
	    async connect() {
	        if (this.connectionLock) {
	            return this.connectionLock;
	        }
	        try {
	            this.connectionLock = this._connect();
	            await this.connectionLock;
	        }
	        finally {
	            // release
	            this.connectionLock = undefined;
	        }
	        return this;
	    }
	    /**
	     * Create a topology to open the connection, must be locked to avoid topology leaks in concurrency scenario.
	     * Locking is enforced by the connect method.
	     *
	     * @internal
	     */
	    async _connect() {
	        if (this.topology && this.topology.isConnected()) {
	            return this;
	        }
	        const options = this[kOptions];
	        if (typeof options.srvHost === 'string') {
	            const hosts = await (0, connection_string_1.resolveSRVRecord)(options);
	            for (const [index, host] of hosts.entries()) {
	                options.hosts[index] = host;
	            }
	        }
	        // It is important to perform validation of hosts AFTER SRV resolution, to check the real hostname,
	        // but BEFORE we even attempt connecting with a potentially not allowed hostname
	        if (options.credentials?.mechanism === providers_1.AuthMechanism.MONGODB_OIDC) {
	            const allowedHosts = options.credentials?.mechanismProperties?.ALLOWED_HOSTS || mongo_credentials_1.DEFAULT_ALLOWED_HOSTS;
	            const isServiceAuth = !!options.credentials?.mechanismProperties?.PROVIDER_NAME;
	            if (!isServiceAuth) {
	                for (const host of options.hosts) {
	                    if (!(0, utils_1.hostMatchesWildcards)(host.toHostPort().host, allowedHosts)) {
	                        throw new error_1.MongoInvalidArgumentError(`Host '${host}' is not valid for OIDC authentication with ALLOWED_HOSTS of '${allowedHosts.join(',')}'`);
	                    }
	                }
	            }
	        }
	        this.topology = new topology_1.Topology(this, options.hosts, options);
	        // Events can be emitted before initialization is complete so we have to
	        // save the reference to the topology on the client ASAP if the event handlers need to access it
	        this.topology.once(topology_1.Topology.OPEN, () => this.emit('open', this));
	        for (const event of constants_1.MONGO_CLIENT_EVENTS) {
	            this.topology.on(event, (...args) => this.emit(event, ...args));
	        }
	        const topologyConnect = async () => {
	            try {
	                await (0, util_1.promisify)(callback => this.topology?.connect(options, callback))();
	            }
	            catch (error) {
	                this.topology?.close({ force: true });
	                throw error;
	            }
	        };
	        if (this.autoEncrypter) {
	            const initAutoEncrypter = (0, util_1.promisify)(callback => this.autoEncrypter?.init(callback));
	            await initAutoEncrypter();
	            await topologyConnect();
	            await options.encrypter.connectInternalClient();
	        }
	        else {
	            await topologyConnect();
	        }
	        return this;
	    }
	    /**
	     * Close the client and its underlying connections
	     *
	     * @param force - Force close, emitting no events
	     */
	    async close(force = false) {
	        // There's no way to set hasBeenClosed back to false
	        Object.defineProperty(this.s, 'hasBeenClosed', {
	            value: true,
	            enumerable: true,
	            configurable: false,
	            writable: false
	        });
	        const activeSessionEnds = Array.from(this.s.activeSessions, session => session.endSession());
	        this.s.activeSessions.clear();
	        await Promise.all(activeSessionEnds);
	        if (this.topology == null) {
	            return;
	        }
	        // If we would attempt to select a server and get nothing back we short circuit
	        // to avoid the server selection timeout.
	        const selector = (0, server_selection_1.readPreferenceServerSelector)(read_preference_1.ReadPreference.primaryPreferred);
	        const topologyDescription = this.topology.description;
	        const serverDescriptions = Array.from(topologyDescription.servers.values());
	        const servers = selector(topologyDescription, serverDescriptions);
	        if (servers.length !== 0) {
	            const endSessions = Array.from(this.s.sessionPool.sessions, ({ id }) => id);
	            if (endSessions.length !== 0) {
	                await this.db('admin')
	                    .command({ endSessions }, { readPreference: read_preference_1.ReadPreference.primaryPreferred, noResponse: true })
	                    .catch(() => null); // outcome does not matter
	            }
	        }
	        // clear out references to old topology
	        const topology = this.topology;
	        this.topology = undefined;
	        await new Promise((resolve, reject) => {
	            topology.close({ force }, error => {
	                if (error)
	                    return reject(error);
	                const { encrypter } = this[kOptions];
	                if (encrypter) {
	                    return encrypter.close(this, force, error => {
	                        if (error)
	                            return reject(error);
	                        resolve();
	                    });
	                }
	                resolve();
	            });
	        });
	    }
	    /**
	     * Create a new Db instance sharing the current socket connections.
	     *
	     * @param dbName - The name of the database we want to use. If not provided, use database name from connection string.
	     * @param options - Optional settings for Db construction
	     */
	    db(dbName, options) {
	        options = options ?? {};
	        // Default to db from connection string if not provided
	        if (!dbName) {
	            dbName = this.options.dbName;
	        }
	        // Copy the options and add out internal override of the not shared flag
	        const finalOptions = Object.assign({}, this[kOptions], options);
	        // Return the db object
	        const db = new db_1.Db(this, dbName, finalOptions);
	        // Return the database
	        return db;
	    }
	    /**
	     * Connect to MongoDB using a url
	     *
	     * @remarks
	     * The programmatically provided options take precedence over the URI options.
	     *
	     * @see https://www.mongodb.com/docs/manual/reference/connection-string/
	     */
	    static async connect(url, options) {
	        const client = new this(url, options);
	        return client.connect();
	    }
	    /** Starts a new session on the server */
	    startSession(options) {
	        const session = new sessions_1.ClientSession(this, this.s.sessionPool, { explicit: true, ...options }, this[kOptions]);
	        this.s.activeSessions.add(session);
	        session.once('ended', () => {
	            this.s.activeSessions.delete(session);
	        });
	        return session;
	    }
	    async withSession(optionsOrOperation, callback) {
	        const options = {
	            // Always define an owner
	            owner: Symbol(),
	            // If it's an object inherit the options
	            ...(typeof optionsOrOperation === 'object' ? optionsOrOperation : {})
	        };
	        const withSessionCallback = typeof optionsOrOperation === 'function' ? optionsOrOperation : callback;
	        if (withSessionCallback == null) {
	            throw new error_1.MongoInvalidArgumentError('Missing required callback parameter');
	        }
	        const session = this.startSession(options);
	        try {
	            await withSessionCallback(session);
	        }
	        finally {
	            try {
	                await session.endSession();
	            }
	            catch {
	                // We are not concerned with errors from endSession()
	            }
	        }
	    }
	    /**
	     * Create a new Change Stream, watching for new changes (insertions, updates,
	     * replacements, deletions, and invalidations) in this cluster. Will ignore all
	     * changes to system collections, as well as the local, admin, and config databases.
	     *
	     * @remarks
	     * watch() accepts two generic arguments for distinct use cases:
	     * - The first is to provide the schema that may be defined for all the data within the current cluster
	     * - The second is to override the shape of the change stream document entirely, if it is not provided the type will default to ChangeStreamDocument of the first argument
	     *
	     * @param pipeline - An array of {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
	     * @param options - Optional settings for the command
	     * @typeParam TSchema - Type of the data being detected by the change stream
	     * @typeParam TChange - Type of the whole change stream document emitted
	     */
	    watch(pipeline = [], options = {}) {
	        // Allow optionally not specifying a pipeline
	        if (!Array.isArray(pipeline)) {
	            options = pipeline;
	            pipeline = [];
	        }
	        return new change_stream_1.ChangeStream(this, pipeline, (0, utils_1.resolveOptions)(this, options));
	    }
	}
	mongo_client.MongoClient = MongoClient;
	
	return mongo_client;
}

var hasRequiredChange_stream;

function requireChange_stream () {
	if (hasRequiredChange_stream) return change_stream;
	hasRequiredChange_stream = 1;
	Object.defineProperty(change_stream, "__esModule", { value: true });
	change_stream.ChangeStream = void 0;
	const collection_1 = requireCollection();
	const constants_1 = constants;
	const change_stream_cursor_1 = requireChange_stream_cursor();
	const db_1 = requireDb();
	const error_1 = error;
	const mongo_client_1 = requireMongo_client();
	const mongo_types_1 = mongo_types;
	const utils_1 = utils;
	/** @internal */
	const kCursorStream = Symbol('cursorStream');
	/** @internal */
	const kClosed = Symbol('closed');
	/** @internal */
	const kMode = Symbol('mode');
	const CHANGE_STREAM_OPTIONS = [
	    'resumeAfter',
	    'startAfter',
	    'startAtOperationTime',
	    'fullDocument',
	    'fullDocumentBeforeChange',
	    'showExpandedEvents'
	];
	const CHANGE_DOMAIN_TYPES = {
	    COLLECTION: Symbol('Collection'),
	    DATABASE: Symbol('Database'),
	    CLUSTER: Symbol('Cluster')
	};
	const CHANGE_STREAM_EVENTS = [constants_1.RESUME_TOKEN_CHANGED, constants_1.END, constants_1.CLOSE];
	const NO_RESUME_TOKEN_ERROR = 'A change stream document has been received that lacks a resume token (_id).';
	const CHANGESTREAM_CLOSED_ERROR = 'ChangeStream is closed';
	/**
	 * Creates a new Change Stream instance. Normally created using {@link Collection#watch|Collection.watch()}.
	 * @public
	 */
	class ChangeStream extends mongo_types_1.TypedEventEmitter {
	    /**
	     * @internal
	     *
	     * @param parent - The parent object that created this change stream
	     * @param pipeline - An array of {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents
	     */
	    constructor(parent, pipeline = [], options = {}) {
	        super();
	        this.pipeline = pipeline;
	        this.options = { ...options };
	        delete this.options.writeConcern;
	        if (parent instanceof collection_1.Collection) {
	            this.type = CHANGE_DOMAIN_TYPES.COLLECTION;
	        }
	        else if (parent instanceof db_1.Db) {
	            this.type = CHANGE_DOMAIN_TYPES.DATABASE;
	        }
	        else if (parent instanceof mongo_client_1.MongoClient) {
	            this.type = CHANGE_DOMAIN_TYPES.CLUSTER;
	        }
	        else {
	            throw new error_1.MongoChangeStreamError('Parent provided to ChangeStream constructor must be an instance of Collection, Db, or MongoClient');
	        }
	        this.parent = parent;
	        this.namespace = parent.s.namespace;
	        if (!this.options.readPreference && parent.readPreference) {
	            this.options.readPreference = parent.readPreference;
	        }
	        // Create contained Change Stream cursor
	        this.cursor = this._createChangeStreamCursor(options);
	        this[kClosed] = false;
	        this[kMode] = false;
	        // Listen for any `change` listeners being added to ChangeStream
	        this.on('newListener', eventName => {
	            if (eventName === 'change' && this.cursor && this.listenerCount('change') === 0) {
	                this._streamEvents(this.cursor);
	            }
	        });
	        this.on('removeListener', eventName => {
	            if (eventName === 'change' && this.listenerCount('change') === 0 && this.cursor) {
	                this[kCursorStream]?.removeAllListeners('data');
	            }
	        });
	    }
	    /** @internal */
	    get cursorStream() {
	        return this[kCursorStream];
	    }
	    /** The cached resume token that is used to resume after the most recently returned change. */
	    get resumeToken() {
	        return this.cursor?.resumeToken;
	    }
	    /** Check if there is any document still available in the Change Stream */
	    async hasNext() {
	        this._setIsIterator();
	        // Change streams must resume indefinitely while each resume event succeeds.
	        // This loop continues until either a change event is received or until a resume attempt
	        // fails.
	        // eslint-disable-next-line no-constant-condition
	        while (true) {
	            try {
	                const hasNext = await this.cursor.hasNext();
	                return hasNext;
	            }
	            catch (error) {
	                try {
	                    await this._processErrorIteratorMode(error);
	                }
	                catch (error) {
	                    try {
	                        await this.close();
	                    }
	                    catch {
	                        // We are not concerned with errors from close()
	                    }
	                    throw error;
	                }
	            }
	        }
	    }
	    /** Get the next available document from the Change Stream. */
	    async next() {
	        this._setIsIterator();
	        // Change streams must resume indefinitely while each resume event succeeds.
	        // This loop continues until either a change event is received or until a resume attempt
	        // fails.
	        // eslint-disable-next-line no-constant-condition
	        while (true) {
	            try {
	                const change = await this.cursor.next();
	                const processedChange = this._processChange(change ?? null);
	                return processedChange;
	            }
	            catch (error) {
	                try {
	                    await this._processErrorIteratorMode(error);
	                }
	                catch (error) {
	                    try {
	                        await this.close();
	                    }
	                    catch {
	                        // We are not concerned with errors from close()
	                    }
	                    throw error;
	                }
	            }
	        }
	    }
	    /**
	     * Try to get the next available document from the Change Stream's cursor or `null` if an empty batch is returned
	     */
	    async tryNext() {
	        this._setIsIterator();
	        // Change streams must resume indefinitely while each resume event succeeds.
	        // This loop continues until either a change event is received or until a resume attempt
	        // fails.
	        // eslint-disable-next-line no-constant-condition
	        while (true) {
	            try {
	                const change = await this.cursor.tryNext();
	                return change ?? null;
	            }
	            catch (error) {
	                try {
	                    await this._processErrorIteratorMode(error);
	                }
	                catch (error) {
	                    try {
	                        await this.close();
	                    }
	                    catch {
	                        // We are not concerned with errors from close()
	                    }
	                    throw error;
	                }
	            }
	        }
	    }
	    async *[Symbol.asyncIterator]() {
	        if (this.closed) {
	            return;
	        }
	        try {
	            // Change streams run indefinitely as long as errors are resumable
	            // So the only loop breaking condition is if `next()` throws
	            while (true) {
	                yield await this.next();
	            }
	        }
	        finally {
	            try {
	                await this.close();
	            }
	            catch {
	                // we're not concerned with errors from close()
	            }
	        }
	    }
	    /** Is the cursor closed */
	    get closed() {
	        return this[kClosed] || this.cursor.closed;
	    }
	    /** Close the Change Stream */
	    async close() {
	        this[kClosed] = true;
	        const cursor = this.cursor;
	        try {
	            await cursor.close();
	        }
	        finally {
	            this._endStream();
	        }
	    }
	    /**
	     * Return a modified Readable stream including a possible transform method.
	     *
	     * NOTE: When using a Stream to process change stream events, the stream will
	     * NOT automatically resume in the case a resumable error is encountered.
	     *
	     * @throws MongoChangeStreamError if the underlying cursor or the change stream is closed
	     */
	    stream(options) {
	        if (this.closed) {
	            throw new error_1.MongoChangeStreamError(CHANGESTREAM_CLOSED_ERROR);
	        }
	        this.streamOptions = options;
	        return this.cursor.stream(options);
	    }
	    /** @internal */
	    _setIsEmitter() {
	        if (this[kMode] === 'iterator') {
	            // TODO(NODE-3485): Replace with MongoChangeStreamModeError
	            throw new error_1.MongoAPIError('ChangeStream cannot be used as an EventEmitter after being used as an iterator');
	        }
	        this[kMode] = 'emitter';
	    }
	    /** @internal */
	    _setIsIterator() {
	        if (this[kMode] === 'emitter') {
	            // TODO(NODE-3485): Replace with MongoChangeStreamModeError
	            throw new error_1.MongoAPIError('ChangeStream cannot be used as an iterator after being used as an EventEmitter');
	        }
	        this[kMode] = 'iterator';
	    }
	    /**
	     * Create a new change stream cursor based on self's configuration
	     * @internal
	     */
	    _createChangeStreamCursor(options) {
	        const changeStreamStageOptions = (0, utils_1.filterOptions)(options, CHANGE_STREAM_OPTIONS);
	        if (this.type === CHANGE_DOMAIN_TYPES.CLUSTER) {
	            changeStreamStageOptions.allChangesForCluster = true;
	        }
	        const pipeline = [{ $changeStream: changeStreamStageOptions }, ...this.pipeline];
	        const client = this.type === CHANGE_DOMAIN_TYPES.CLUSTER
	            ? this.parent
	            : this.type === CHANGE_DOMAIN_TYPES.DATABASE
	                ? this.parent.client
	                : this.type === CHANGE_DOMAIN_TYPES.COLLECTION
	                    ? this.parent.client
	                    : null;
	        if (client == null) {
	            // This should never happen because of the assertion in the constructor
	            throw new error_1.MongoRuntimeError(`Changestream type should only be one of cluster, database, collection. Found ${this.type.toString()}`);
	        }
	        const changeStreamCursor = new change_stream_cursor_1.ChangeStreamCursor(client, this.namespace, pipeline, options);
	        for (const event of CHANGE_STREAM_EVENTS) {
	            changeStreamCursor.on(event, e => this.emit(event, e));
	        }
	        if (this.listenerCount(ChangeStream.CHANGE) > 0) {
	            this._streamEvents(changeStreamCursor);
	        }
	        return changeStreamCursor;
	    }
	    /** @internal */
	    _closeEmitterModeWithError(error) {
	        this.emit(ChangeStream.ERROR, error);
	        this.close().catch(() => null);
	    }
	    /** @internal */
	    _streamEvents(cursor) {
	        this._setIsEmitter();
	        const stream = this[kCursorStream] ?? cursor.stream();
	        this[kCursorStream] = stream;
	        stream.on('data', change => {
	            try {
	                const processedChange = this._processChange(change);
	                this.emit(ChangeStream.CHANGE, processedChange);
	            }
	            catch (error) {
	                this.emit(ChangeStream.ERROR, error);
	            }
	        });
	        stream.on('error', error => this._processErrorStreamMode(error));
	    }
	    /** @internal */
	    _endStream() {
	        const cursorStream = this[kCursorStream];
	        if (cursorStream) {
	            ['data', 'close', 'end', 'error'].forEach(event => cursorStream.removeAllListeners(event));
	            cursorStream.destroy();
	        }
	        this[kCursorStream] = undefined;
	    }
	    /** @internal */
	    _processChange(change) {
	        if (this[kClosed]) {
	            // TODO(NODE-3485): Replace with MongoChangeStreamClosedError
	            throw new error_1.MongoAPIError(CHANGESTREAM_CLOSED_ERROR);
	        }
	        // a null change means the cursor has been notified, implicitly closing the change stream
	        if (change == null) {
	            // TODO(NODE-3485): Replace with MongoChangeStreamClosedError
	            throw new error_1.MongoRuntimeError(CHANGESTREAM_CLOSED_ERROR);
	        }
	        if (change && !change._id) {
	            throw new error_1.MongoChangeStreamError(NO_RESUME_TOKEN_ERROR);
	        }
	        // cache the resume token
	        this.cursor.cacheResumeToken(change._id);
	        // wipe the startAtOperationTime if there was one so that there won't be a conflict
	        // between resumeToken and startAtOperationTime if we need to reconnect the cursor
	        this.options.startAtOperationTime = undefined;
	        return change;
	    }
	    /** @internal */
	    _processErrorStreamMode(changeStreamError) {
	        // If the change stream has been closed explicitly, do not process error.
	        if (this[kClosed])
	            return;
	        if ((0, error_1.isResumableError)(changeStreamError, this.cursor.maxWireVersion)) {
	            this._endStream();
	            this.cursor.close().catch(() => null);
	            const topology = (0, utils_1.getTopology)(this.parent);
	            topology.selectServer(this.cursor.readPreference, {}, serverSelectionError => {
	                if (serverSelectionError)
	                    return this._closeEmitterModeWithError(changeStreamError);
	                this.cursor = this._createChangeStreamCursor(this.cursor.resumeOptions);
	            });
	        }
	        else {
	            this._closeEmitterModeWithError(changeStreamError);
	        }
	    }
	    /** @internal */
	    async _processErrorIteratorMode(changeStreamError) {
	        if (this[kClosed]) {
	            // TODO(NODE-3485): Replace with MongoChangeStreamClosedError
	            throw new error_1.MongoAPIError(CHANGESTREAM_CLOSED_ERROR);
	        }
	        if (!(0, error_1.isResumableError)(changeStreamError, this.cursor.maxWireVersion)) {
	            try {
	                await this.close();
	            }
	            catch {
	                // ignore errors from close
	            }
	            throw changeStreamError;
	        }
	        await this.cursor.close().catch(() => null);
	        const topology = (0, utils_1.getTopology)(this.parent);
	        try {
	            await topology.selectServerAsync(this.cursor.readPreference, {});
	            this.cursor = this._createChangeStreamCursor(this.cursor.resumeOptions);
	        }
	        catch {
	            // if the topology can't reconnect, close the stream
	            await this.close();
	            throw changeStreamError;
	        }
	    }
	}
	/** @event */
	ChangeStream.RESPONSE = constants_1.RESPONSE;
	/** @event */
	ChangeStream.MORE = constants_1.MORE;
	/** @event */
	ChangeStream.INIT = constants_1.INIT;
	/** @event */
	ChangeStream.CLOSE = constants_1.CLOSE;
	/**
	 * Fired for each new matching change in the specified namespace. Attaching a `change`
	 * event listener to a Change Stream will switch the stream into flowing mode. Data will
	 * then be passed as soon as it is available.
	 * @event
	 */
	ChangeStream.CHANGE = constants_1.CHANGE;
	/** @event */
	ChangeStream.END = constants_1.END;
	/** @event */
	ChangeStream.ERROR = constants_1.ERROR;
	/**
	 * Emitted each time the change stream stores a new resume token.
	 * @event
	 */
	ChangeStream.RESUME_TOKEN_CHANGED = constants_1.RESUME_TOKEN_CHANGED;
	change_stream.ChangeStream = ChangeStream;
	
	return change_stream;
}

var gridfs = {};

var download = {};

Object.defineProperty(download, "__esModule", { value: true });
download.GridFSBucketReadStream = void 0;
const stream_1$1 = require$$0$5;
const error_1$2 = error;
/**
 * A readable stream that enables you to read buffers from GridFS.
 *
 * Do not instantiate this class directly. Use `openDownloadStream()` instead.
 * @public
 */
class GridFSBucketReadStream extends stream_1$1.Readable {
    /**
     * @param chunks - Handle for chunks collection
     * @param files - Handle for files collection
     * @param readPreference - The read preference to use
     * @param filter - The filter to use to find the file document
     * @internal
     */
    constructor(chunks, files, readPreference, filter, options) {
        super();
        this.s = {
            bytesToTrim: 0,
            bytesToSkip: 0,
            bytesRead: 0,
            chunks,
            expected: 0,
            files,
            filter,
            init: false,
            expectedEnd: 0,
            options: {
                start: 0,
                end: 0,
                ...options
            },
            readPreference
        };
    }
    /**
     * Reads from the cursor and pushes to the stream.
     * Private Impl, do not call directly
     * @internal
     */
    _read() {
        if (this.destroyed)
            return;
        waitForFile(this, () => doRead(this));
    }
    /**
     * Sets the 0-based offset in bytes to start streaming from. Throws
     * an error if this stream has entered flowing mode
     * (e.g. if you've already called `on('data')`)
     *
     * @param start - 0-based offset in bytes to start streaming from
     */
    start(start = 0) {
        throwIfInitialized(this);
        this.s.options.start = start;
        return this;
    }
    /**
     * Sets the 0-based offset in bytes to start streaming from. Throws
     * an error if this stream has entered flowing mode
     * (e.g. if you've already called `on('data')`)
     *
     * @param end - Offset in bytes to stop reading at
     */
    end(end = 0) {
        throwIfInitialized(this);
        this.s.options.end = end;
        return this;
    }
    /**
     * Marks this stream as aborted (will never push another `data` event)
     * and kills the underlying cursor. Will emit the 'end' event, and then
     * the 'close' event once the cursor is successfully killed.
     */
    async abort() {
        this.push(null);
        this.destroyed = true;
        if (this.s.cursor) {
            try {
                await this.s.cursor.close();
            }
            finally {
                this.emit(GridFSBucketReadStream.CLOSE);
            }
        }
        else {
            if (!this.s.init) {
                // If not initialized, fire close event because we will never
                // get a cursor
                this.emit(GridFSBucketReadStream.CLOSE);
            }
        }
    }
}
/**
 * An error occurred
 * @event
 */
GridFSBucketReadStream.ERROR = 'error';
/**
 * Fires when the stream loaded the file document corresponding to the provided id.
 * @event
 */
GridFSBucketReadStream.FILE = 'file';
/**
 * Emitted when a chunk of data is available to be consumed.
 * @event
 */
GridFSBucketReadStream.DATA = 'data';
/**
 * Fired when the stream is exhausted (no more data events).
 * @event
 */
GridFSBucketReadStream.END = 'end';
/**
 * Fired when the stream is exhausted and the underlying cursor is killed
 * @event
 */
GridFSBucketReadStream.CLOSE = 'close';
download.GridFSBucketReadStream = GridFSBucketReadStream;
function throwIfInitialized(stream) {
    if (stream.s.init) {
        throw new error_1$2.MongoGridFSStreamError('Options cannot be changed after the stream is initialized');
    }
}
function doRead(stream) {
    if (stream.destroyed)
        return;
    if (!stream.s.cursor)
        return;
    if (!stream.s.file)
        return;
    const handleReadResult = ({ error, doc }) => {
        if (stream.destroyed) {
            return;
        }
        if (error) {
            stream.emit(GridFSBucketReadStream.ERROR, error);
            return;
        }
        if (!doc) {
            stream.push(null);
            stream.s.cursor?.close().then(() => {
                stream.emit(GridFSBucketReadStream.CLOSE);
            }, error => {
                stream.emit(GridFSBucketReadStream.ERROR, error);
            });
            return;
        }
        if (!stream.s.file)
            return;
        const bytesRemaining = stream.s.file.length - stream.s.bytesRead;
        const expectedN = stream.s.expected++;
        const expectedLength = Math.min(stream.s.file.chunkSize, bytesRemaining);
        if (doc.n > expectedN) {
            return stream.emit(GridFSBucketReadStream.ERROR, new error_1$2.MongoGridFSChunkError(`ChunkIsMissing: Got unexpected n: ${doc.n}, expected: ${expectedN}`));
        }
        if (doc.n < expectedN) {
            return stream.emit(GridFSBucketReadStream.ERROR, new error_1$2.MongoGridFSChunkError(`ExtraChunk: Got unexpected n: ${doc.n}, expected: ${expectedN}`));
        }
        let buf = Buffer.isBuffer(doc.data) ? doc.data : doc.data.buffer;
        if (buf.byteLength !== expectedLength) {
            if (bytesRemaining <= 0) {
                return stream.emit(GridFSBucketReadStream.ERROR, new error_1$2.MongoGridFSChunkError(`ExtraChunk: Got unexpected n: ${doc.n}, expected file length ${stream.s.file.length} bytes but already read ${stream.s.bytesRead} bytes`));
            }
            return stream.emit(GridFSBucketReadStream.ERROR, new error_1$2.MongoGridFSChunkError(`ChunkIsWrongSize: Got unexpected length: ${buf.byteLength}, expected: ${expectedLength}`));
        }
        stream.s.bytesRead += buf.byteLength;
        if (buf.byteLength === 0) {
            return stream.push(null);
        }
        let sliceStart = null;
        let sliceEnd = null;
        if (stream.s.bytesToSkip != null) {
            sliceStart = stream.s.bytesToSkip;
            stream.s.bytesToSkip = 0;
        }
        const atEndOfStream = expectedN === stream.s.expectedEnd - 1;
        const bytesLeftToRead = stream.s.options.end - stream.s.bytesToSkip;
        if (atEndOfStream && stream.s.bytesToTrim != null) {
            sliceEnd = stream.s.file.chunkSize - stream.s.bytesToTrim;
        }
        else if (stream.s.options.end && bytesLeftToRead < doc.data.byteLength) {
            sliceEnd = bytesLeftToRead;
        }
        if (sliceStart != null || sliceEnd != null) {
            buf = buf.slice(sliceStart || 0, sliceEnd || buf.byteLength);
        }
        stream.push(buf);
        return;
    };
    stream.s.cursor.next().then(doc => handleReadResult({ error: null, doc }), error => handleReadResult({ error, doc: null }));
}
function init(stream) {
    const findOneOptions = {};
    if (stream.s.readPreference) {
        findOneOptions.readPreference = stream.s.readPreference;
    }
    if (stream.s.options && stream.s.options.sort) {
        findOneOptions.sort = stream.s.options.sort;
    }
    if (stream.s.options && stream.s.options.skip) {
        findOneOptions.skip = stream.s.options.skip;
    }
    const handleReadResult = ({ error, doc }) => {
        if (error) {
            return stream.emit(GridFSBucketReadStream.ERROR, error);
        }
        if (!doc) {
            const identifier = stream.s.filter._id
                ? stream.s.filter._id.toString()
                : stream.s.filter.filename;
            const errmsg = `FileNotFound: file ${identifier} was not found`;
            // TODO(NODE-3483)
            const err = new error_1$2.MongoRuntimeError(errmsg);
            err.code = 'ENOENT'; // TODO: NODE-3338 set property as part of constructor
            return stream.emit(GridFSBucketReadStream.ERROR, err);
        }
        // If document is empty, kill the stream immediately and don't
        // execute any reads
        if (doc.length <= 0) {
            stream.push(null);
            return;
        }
        if (stream.destroyed) {
            // If user destroys the stream before we have a cursor, wait
            // until the query is done to say we're 'closed' because we can't
            // cancel a query.
            stream.emit(GridFSBucketReadStream.CLOSE);
            return;
        }
        try {
            stream.s.bytesToSkip = handleStartOption(stream, doc, stream.s.options);
        }
        catch (error) {
            return stream.emit(GridFSBucketReadStream.ERROR, error);
        }
        const filter = { files_id: doc._id };
        // Currently (MongoDB 3.4.4) skip function does not support the index,
        // it needs to retrieve all the documents first and then skip them. (CS-25811)
        // As work around we use $gte on the "n" field.
        if (stream.s.options && stream.s.options.start != null) {
            const skip = Math.floor(stream.s.options.start / doc.chunkSize);
            if (skip > 0) {
                filter['n'] = { $gte: skip };
            }
        }
        stream.s.cursor = stream.s.chunks.find(filter).sort({ n: 1 });
        if (stream.s.readPreference) {
            stream.s.cursor.withReadPreference(stream.s.readPreference);
        }
        stream.s.expectedEnd = Math.ceil(doc.length / doc.chunkSize);
        stream.s.file = doc;
        try {
            stream.s.bytesToTrim = handleEndOption(stream, doc, stream.s.cursor, stream.s.options);
        }
        catch (error) {
            return stream.emit(GridFSBucketReadStream.ERROR, error);
        }
        stream.emit(GridFSBucketReadStream.FILE, doc);
        return;
    };
    stream.s.files.findOne(stream.s.filter, findOneOptions).then(doc => handleReadResult({ error: null, doc }), error => handleReadResult({ error, doc: null }));
}
function waitForFile(stream, callback) {
    if (stream.s.file) {
        return callback();
    }
    if (!stream.s.init) {
        init(stream);
        stream.s.init = true;
    }
    stream.once('file', () => {
        callback();
    });
}
function handleStartOption(stream, doc, options) {
    if (options && options.start != null) {
        if (options.start > doc.length) {
            throw new error_1$2.MongoInvalidArgumentError(`Stream start (${options.start}) must not be more than the length of the file (${doc.length})`);
        }
        if (options.start < 0) {
            throw new error_1$2.MongoInvalidArgumentError(`Stream start (${options.start}) must not be negative`);
        }
        if (options.end != null && options.end < options.start) {
            throw new error_1$2.MongoInvalidArgumentError(`Stream start (${options.start}) must not be greater than stream end (${options.end})`);
        }
        stream.s.bytesRead = Math.floor(options.start / doc.chunkSize) * doc.chunkSize;
        stream.s.expected = Math.floor(options.start / doc.chunkSize);
        return options.start - stream.s.bytesRead;
    }
    throw new error_1$2.MongoInvalidArgumentError('Start option must be defined');
}
function handleEndOption(stream, doc, cursor, options) {
    if (options && options.end != null) {
        if (options.end > doc.length) {
            throw new error_1$2.MongoInvalidArgumentError(`Stream end (${options.end}) must not be more than the length of the file (${doc.length})`);
        }
        if (options.start == null || options.start < 0) {
            throw new error_1$2.MongoInvalidArgumentError(`Stream end (${options.end}) must not be negative`);
        }
        const start = options.start != null ? Math.floor(options.start / doc.chunkSize) : 0;
        cursor.limit(Math.ceil(options.end / doc.chunkSize) - start);
        stream.s.expectedEnd = Math.ceil(options.end / doc.chunkSize);
        return Math.ceil(options.end / doc.chunkSize) * doc.chunkSize - options.end;
    }
    throw new error_1$2.MongoInvalidArgumentError('End option must be defined');
}

var upload = {};

Object.defineProperty(upload, "__esModule", { value: true });
upload.GridFSBucketWriteStream = void 0;
const stream_1 = require$$0$5;
const bson_1 = bson;
const error_1$1 = error;
const write_concern_1$1 = write_concern;
/**
 * A writable stream that enables you to write buffers to GridFS.
 *
 * Do not instantiate this class directly. Use `openUploadStream()` instead.
 * @public
 */
class GridFSBucketWriteStream extends stream_1.Writable {
    /**
     * @param bucket - Handle for this stream's corresponding bucket
     * @param filename - The value of the 'filename' key in the files doc
     * @param options - Optional settings.
     * @internal
     */
    constructor(bucket, filename, options) {
        super();
        options = options ?? {};
        this.bucket = bucket;
        this.chunks = bucket.s._chunksCollection;
        this.filename = filename;
        this.files = bucket.s._filesCollection;
        this.options = options;
        this.writeConcern = write_concern_1$1.WriteConcern.fromOptions(options) || bucket.s.options.writeConcern;
        // Signals the write is all done
        this.done = false;
        this.id = options.id ? options.id : new bson_1.ObjectId();
        // properly inherit the default chunksize from parent
        this.chunkSizeBytes = options.chunkSizeBytes || this.bucket.s.options.chunkSizeBytes;
        this.bufToStore = Buffer.alloc(this.chunkSizeBytes);
        this.length = 0;
        this.n = 0;
        this.pos = 0;
        this.state = {
            streamEnd: false,
            outstandingRequests: 0,
            errored: false,
            aborted: false
        };
        if (!this.bucket.s.calledOpenUploadStream) {
            this.bucket.s.calledOpenUploadStream = true;
            checkIndexes(this).then(() => {
                this.bucket.s.checkedIndexes = true;
                this.bucket.emit('index');
            }, () => null);
        }
    }
    write(chunk, encodingOrCallback, callback) {
        const encoding = typeof encodingOrCallback === 'function' ? undefined : encodingOrCallback;
        callback = typeof encodingOrCallback === 'function' ? encodingOrCallback : callback;
        return waitForIndexes(this, () => doWrite(this, chunk, encoding, callback));
    }
    /**
     * Places this write stream into an aborted state (all future writes fail)
     * and deletes all chunks that have already been written.
     */
    async abort() {
        if (this.state.streamEnd) {
            // TODO(NODE-3485): Replace with MongoGridFSStreamClosed
            throw new error_1$1.MongoAPIError('Cannot abort a stream that has already completed');
        }
        if (this.state.aborted) {
            // TODO(NODE-3485): Replace with MongoGridFSStreamClosed
            throw new error_1$1.MongoAPIError('Cannot call abort() on a stream twice');
        }
        this.state.aborted = true;
        await this.chunks.deleteMany({ files_id: this.id });
    }
    end(chunkOrCallback, encodingOrCallback, callback) {
        const chunk = typeof chunkOrCallback === 'function' ? undefined : chunkOrCallback;
        const encoding = typeof encodingOrCallback === 'function' ? undefined : encodingOrCallback;
        callback =
            typeof chunkOrCallback === 'function'
                ? chunkOrCallback
                : typeof encodingOrCallback === 'function'
                    ? encodingOrCallback
                    : callback;
        if (this.state.streamEnd || checkAborted(this, callback))
            return this;
        this.state.streamEnd = true;
        if (callback) {
            this.once(GridFSBucketWriteStream.FINISH, (result) => {
                if (callback)
                    callback(undefined, result);
            });
        }
        if (!chunk) {
            waitForIndexes(this, () => !!writeRemnant(this));
            return this;
        }
        this.write(chunk, encoding, () => {
            writeRemnant(this);
        });
        return this;
    }
}
/** @event */
GridFSBucketWriteStream.CLOSE = 'close';
/** @event */
GridFSBucketWriteStream.ERROR = 'error';
/**
 * `end()` was called and the write stream successfully wrote the file metadata and all the chunks to MongoDB.
 * @event
 */
GridFSBucketWriteStream.FINISH = 'finish';
upload.GridFSBucketWriteStream = GridFSBucketWriteStream;
function __handleError(stream, error, callback) {
    if (stream.state.errored) {
        return;
    }
    stream.state.errored = true;
    if (callback) {
        return callback(error);
    }
    stream.emit(GridFSBucketWriteStream.ERROR, error);
}
function createChunkDoc(filesId, n, data) {
    return {
        _id: new bson_1.ObjectId(),
        files_id: filesId,
        n,
        data
    };
}
async function checkChunksIndex(stream) {
    const index = { files_id: 1, n: 1 };
    let indexes;
    try {
        indexes = await stream.chunks.listIndexes().toArray();
    }
    catch (error) {
        if (error instanceof error_1$1.MongoError && error.code === error_1$1.MONGODB_ERROR_CODES.NamespaceNotFound) {
            indexes = [];
        }
        else {
            throw error;
        }
    }
    const hasChunksIndex = !!indexes.find(index => {
        const keys = Object.keys(index.key);
        if (keys.length === 2 && index.key.files_id === 1 && index.key.n === 1) {
            return true;
        }
        return false;
    });
    if (!hasChunksIndex) {
        await stream.chunks.createIndex(index, {
            ...stream.writeConcern,
            background: true,
            unique: true
        });
    }
}
function checkDone(stream, callback) {
    if (stream.done)
        return true;
    if (stream.state.streamEnd && stream.state.outstandingRequests === 0 && !stream.state.errored) {
        // Set done so we do not trigger duplicate createFilesDoc
        stream.done = true;
        // Create a new files doc
        const filesDoc = createFilesDoc(stream.id, stream.length, stream.chunkSizeBytes, stream.filename, stream.options.contentType, stream.options.aliases, stream.options.metadata);
        if (checkAborted(stream, callback)) {
            return false;
        }
        stream.files.insertOne(filesDoc, { writeConcern: stream.writeConcern }).then(() => {
            stream.emit(GridFSBucketWriteStream.FINISH, filesDoc);
            stream.emit(GridFSBucketWriteStream.CLOSE);
        }, error => {
            return __handleError(stream, error, callback);
        });
        return true;
    }
    return false;
}
async function checkIndexes(stream) {
    const doc = await stream.files.findOne({}, { projection: { _id: 1 } });
    if (doc != null) {
        // If at least one document exists assume the collection has the required index
        return;
    }
    const index = { filename: 1, uploadDate: 1 };
    let indexes;
    try {
        indexes = await stream.files.listIndexes().toArray();
    }
    catch (error) {
        if (error instanceof error_1$1.MongoError && error.code === error_1$1.MONGODB_ERROR_CODES.NamespaceNotFound) {
            indexes = [];
        }
        else {
            throw error;
        }
    }
    const hasFileIndex = !!indexes.find(index => {
        const keys = Object.keys(index.key);
        if (keys.length === 2 && index.key.filename === 1 && index.key.uploadDate === 1) {
            return true;
        }
        return false;
    });
    if (!hasFileIndex) {
        await stream.files.createIndex(index, { background: false });
    }
    await checkChunksIndex(stream);
}
function createFilesDoc(_id, length, chunkSize, filename, contentType, aliases, metadata) {
    const ret = {
        _id,
        length,
        chunkSize,
        uploadDate: new Date(),
        filename
    };
    if (contentType) {
        ret.contentType = contentType;
    }
    if (aliases) {
        ret.aliases = aliases;
    }
    if (metadata) {
        ret.metadata = metadata;
    }
    return ret;
}
function doWrite(stream, chunk, encoding, callback) {
    if (checkAborted(stream, callback)) {
        return false;
    }
    const inputBuf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    stream.length += inputBuf.length;
    // Input is small enough to fit in our buffer
    if (stream.pos + inputBuf.length < stream.chunkSizeBytes) {
        inputBuf.copy(stream.bufToStore, stream.pos);
        stream.pos += inputBuf.length;
        callback && callback();
        // Note that we reverse the typical semantics of write's return value
        // to be compatible with node's `.pipe()` function.
        // True means client can keep writing.
        return true;
    }
    // Otherwise, buffer is too big for current chunk, so we need to flush
    // to MongoDB.
    let inputBufRemaining = inputBuf.length;
    let spaceRemaining = stream.chunkSizeBytes - stream.pos;
    let numToCopy = Math.min(spaceRemaining, inputBuf.length);
    let outstandingRequests = 0;
    while (inputBufRemaining > 0) {
        const inputBufPos = inputBuf.length - inputBufRemaining;
        inputBuf.copy(stream.bufToStore, stream.pos, inputBufPos, inputBufPos + numToCopy);
        stream.pos += numToCopy;
        spaceRemaining -= numToCopy;
        let doc;
        if (spaceRemaining === 0) {
            doc = createChunkDoc(stream.id, stream.n, Buffer.from(stream.bufToStore));
            ++stream.state.outstandingRequests;
            ++outstandingRequests;
            if (checkAborted(stream, callback)) {
                return false;
            }
            stream.chunks.insertOne(doc, { writeConcern: stream.writeConcern }).then(() => {
                --stream.state.outstandingRequests;
                --outstandingRequests;
                if (!outstandingRequests) {
                    stream.emit('drain', doc);
                    callback && callback();
                    checkDone(stream);
                }
            }, error => {
                return __handleError(stream, error);
            });
            spaceRemaining = stream.chunkSizeBytes;
            stream.pos = 0;
            ++stream.n;
        }
        inputBufRemaining -= numToCopy;
        numToCopy = Math.min(spaceRemaining, inputBufRemaining);
    }
    // Note that we reverse the typical semantics of write's return value
    // to be compatible with node's `.pipe()` function.
    // False means the client should wait for the 'drain' event.
    return false;
}
function waitForIndexes(stream, callback) {
    if (stream.bucket.s.checkedIndexes) {
        return callback(false);
    }
    stream.bucket.once('index', () => {
        callback(true);
    });
    return true;
}
function writeRemnant(stream, callback) {
    // Buffer is empty, so don't bother to insert
    if (stream.pos === 0) {
        return checkDone(stream, callback);
    }
    ++stream.state.outstandingRequests;
    // Create a new buffer to make sure the buffer isn't bigger than it needs
    // to be.
    const remnant = Buffer.alloc(stream.pos);
    stream.bufToStore.copy(remnant, 0, 0, stream.pos);
    const doc = createChunkDoc(stream.id, stream.n, remnant);
    // If the stream was aborted, do not write remnant
    if (checkAborted(stream, callback)) {
        return false;
    }
    stream.chunks.insertOne(doc, { writeConcern: stream.writeConcern }).then(() => {
        --stream.state.outstandingRequests;
        checkDone(stream);
    }, error => {
        return __handleError(stream, error);
    });
    return true;
}
function checkAborted(stream, callback) {
    if (stream.state.aborted) {
        if (typeof callback === 'function') {
            // TODO(NODE-3485): Replace with MongoGridFSStreamClosedError
            callback(new error_1$1.MongoAPIError('Stream has been aborted'));
        }
        return true;
    }
    return false;
}

Object.defineProperty(gridfs, "__esModule", { value: true });
gridfs.GridFSBucket = void 0;
const error_1 = error;
const mongo_types_1 = mongo_types;
const write_concern_1 = write_concern;
const download_1 = download;
const upload_1 = upload;
const DEFAULT_GRIDFS_BUCKET_OPTIONS = {
    bucketName: 'fs',
    chunkSizeBytes: 255 * 1024
};
/**
 * Constructor for a streaming GridFS interface
 * @public
 */
class GridFSBucket extends mongo_types_1.TypedEventEmitter {
    constructor(db, options) {
        super();
        this.setMaxListeners(0);
        const privateOptions = {
            ...DEFAULT_GRIDFS_BUCKET_OPTIONS,
            ...options,
            writeConcern: write_concern_1.WriteConcern.fromOptions(options)
        };
        this.s = {
            db,
            options: privateOptions,
            _chunksCollection: db.collection(privateOptions.bucketName + '.chunks'),
            _filesCollection: db.collection(privateOptions.bucketName + '.files'),
            checkedIndexes: false,
            calledOpenUploadStream: false
        };
    }
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS. The stream's 'id' property contains the resulting
     * file's id.
     *
     * @param filename - The value of the 'filename' key in the files doc
     * @param options - Optional settings.
     */
    openUploadStream(filename, options) {
        return new upload_1.GridFSBucketWriteStream(this, filename, options);
    }
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS for a custom file id. The stream's 'id' property contains the resulting
     * file's id.
     */
    openUploadStreamWithId(id, filename, options) {
        return new upload_1.GridFSBucketWriteStream(this, filename, { ...options, id });
    }
    /** Returns a readable stream (GridFSBucketReadStream) for streaming file data from GridFS. */
    openDownloadStream(id, options) {
        return new download_1.GridFSBucketReadStream(this.s._chunksCollection, this.s._filesCollection, this.s.options.readPreference, { _id: id }, options);
    }
    /**
     * Deletes a file with the given id
     *
     * @param id - The id of the file doc
     */
    async delete(id) {
        const { deletedCount } = await this.s._filesCollection.deleteOne({ _id: id });
        // Delete orphaned chunks before returning FileNotFound
        await this.s._chunksCollection.deleteMany({ files_id: id });
        if (deletedCount === 0) {
            // TODO(NODE-3483): Replace with more appropriate error
            // Consider creating new error MongoGridFSFileNotFoundError
            throw new error_1.MongoRuntimeError(`File not found for id ${id}`);
        }
    }
    /** Convenience wrapper around find on the files collection */
    find(filter = {}, options = {}) {
        return this.s._filesCollection.find(filter, options);
    }
    /**
     * Returns a readable stream (GridFSBucketReadStream) for streaming the
     * file with the given name from GridFS. If there are multiple files with
     * the same name, this will stream the most recent file with the given name
     * (as determined by the `uploadDate` field). You can set the `revision`
     * option to change this behavior.
     */
    openDownloadStreamByName(filename, options) {
        let sort = { uploadDate: -1 };
        let skip = undefined;
        if (options && options.revision != null) {
            if (options.revision >= 0) {
                sort = { uploadDate: 1 };
                skip = options.revision;
            }
            else {
                skip = -options.revision - 1;
            }
        }
        return new download_1.GridFSBucketReadStream(this.s._chunksCollection, this.s._filesCollection, this.s.options.readPreference, { filename }, { ...options, sort, skip });
    }
    /**
     * Renames the file with the given _id to the given string
     *
     * @param id - the id of the file to rename
     * @param filename - new name for the file
     */
    async rename(id, filename) {
        const filter = { _id: id };
        const update = { $set: { filename } };
        const { matchedCount } = await this.s._filesCollection.updateOne(filter, update);
        if (matchedCount === 0) {
            throw new error_1.MongoRuntimeError(`File with id ${id} not found`);
        }
    }
    /** Removes this bucket's files collection, followed by its chunks collection. */
    async drop() {
        await this.s._filesCollection.drop();
        await this.s._chunksCollection.drop();
    }
}
/**
 * When the first call to openUploadStream is made, the upload stream will
 * check to see if it needs to create the proper indexes on the chunks and
 * files collections. This event is fired either when 1) it determines that
 * no index creation is necessary, 2) when it successfully creates the
 * necessary indexes.
 * @event
 */
GridFSBucket.INDEX = 'index';
gridfs.GridFSBucket = GridFSBucket;

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.AbstractCursor = exports.MongoWriteConcernError = exports.MongoUnexpectedServerResponseError = exports.MongoTransactionError = exports.MongoTopologyClosedError = exports.MongoTailableCursorError = exports.MongoSystemError = exports.MongoServerSelectionError = exports.MongoServerError = exports.MongoServerClosedError = exports.MongoRuntimeError = exports.MongoParseError = exports.MongoNotConnectedError = exports.MongoNetworkTimeoutError = exports.MongoNetworkError = exports.MongoMissingDependencyError = exports.MongoMissingCredentialsError = exports.MongoKerberosError = exports.MongoInvalidArgumentError = exports.MongoGridFSStreamError = exports.MongoGridFSChunkError = exports.MongoExpiredSessionError = exports.MongoError = exports.MongoDriverError = exports.MongoDecompressionError = exports.MongoCursorInUseError = exports.MongoCursorExhaustedError = exports.MongoCompatibilityError = exports.MongoChangeStreamError = exports.MongoBatchReExecutionError = exports.MongoAzureError = exports.MongoAWSError = exports.MongoAPIError = exports.ChangeStreamCursor = exports.MongoBulkWriteError = exports.Timestamp = exports.ObjectId = exports.MinKey = exports.MaxKey = exports.Long = exports.Int32 = exports.Double = exports.Decimal128 = exports.DBRef = exports.Code = exports.BSONType = exports.BSONSymbol = exports.BSONRegExp = exports.Binary = exports.BSON = void 0;
		exports.ServerClosedEvent = exports.ConnectionReadyEvent = exports.ConnectionPoolReadyEvent = exports.ConnectionPoolMonitoringEvent = exports.ConnectionPoolCreatedEvent = exports.ConnectionPoolClosedEvent = exports.ConnectionPoolClearedEvent = exports.ConnectionCreatedEvent = exports.ConnectionClosedEvent = exports.ConnectionCheckOutStartedEvent = exports.ConnectionCheckOutFailedEvent = exports.ConnectionCheckedOutEvent = exports.ConnectionCheckedInEvent = exports.CommandSucceededEvent = exports.CommandStartedEvent = exports.CommandFailedEvent = exports.WriteConcern = exports.ReadPreference = exports.ReadConcern = exports.TopologyType = exports.ServerType = exports.ReadPreferenceMode = exports.ReadConcernLevel = exports.ProfilingLevel = exports.ReturnDocument = exports.ServerApiVersion = exports.ExplainVerbosity = exports.MongoErrorLabel = exports.AutoEncryptionLoggerLevel = exports.CURSOR_FLAGS = exports.Compressor = exports.AuthMechanism = exports.GSSAPICanonicalizationValue = exports.BatchType = exports.UnorderedBulkOperation = exports.OrderedBulkOperation = exports.MongoClient = exports.ListIndexesCursor = exports.ListCollectionsCursor = exports.GridFSBucketWriteStream = exports.GridFSBucketReadStream = exports.GridFSBucket = exports.FindCursor = exports.Db = exports.Collection = exports.ClientSession = exports.ChangeStream = exports.CancellationToken = exports.AggregationCursor = exports.Admin = void 0;
		exports.SrvPollingEvent = exports.TopologyOpeningEvent = exports.TopologyDescriptionChangedEvent = exports.TopologyClosedEvent = exports.ServerOpeningEvent = exports.ServerHeartbeatSucceededEvent = exports.ServerHeartbeatStartedEvent = exports.ServerHeartbeatFailedEvent = exports.ServerDescriptionChangedEvent = void 0;
		const admin_1 = admin;
		Object.defineProperty(exports, "Admin", { enumerable: true, get: function () { return admin_1.Admin; } });
		const ordered_1 = ordered;
		Object.defineProperty(exports, "OrderedBulkOperation", { enumerable: true, get: function () { return ordered_1.OrderedBulkOperation; } });
		const unordered_1 = unordered;
		Object.defineProperty(exports, "UnorderedBulkOperation", { enumerable: true, get: function () { return unordered_1.UnorderedBulkOperation; } });
		const change_stream_1 = requireChange_stream();
		Object.defineProperty(exports, "ChangeStream", { enumerable: true, get: function () { return change_stream_1.ChangeStream; } });
		const collection_1 = requireCollection();
		Object.defineProperty(exports, "Collection", { enumerable: true, get: function () { return collection_1.Collection; } });
		const abstract_cursor_1 = abstract_cursor;
		Object.defineProperty(exports, "AbstractCursor", { enumerable: true, get: function () { return abstract_cursor_1.AbstractCursor; } });
		const aggregation_cursor_1 = aggregation_cursor;
		Object.defineProperty(exports, "AggregationCursor", { enumerable: true, get: function () { return aggregation_cursor_1.AggregationCursor; } });
		const find_cursor_1 = find_cursor;
		Object.defineProperty(exports, "FindCursor", { enumerable: true, get: function () { return find_cursor_1.FindCursor; } });
		const list_collections_cursor_1 = list_collections_cursor;
		Object.defineProperty(exports, "ListCollectionsCursor", { enumerable: true, get: function () { return list_collections_cursor_1.ListCollectionsCursor; } });
		const list_indexes_cursor_1 = list_indexes_cursor;
		Object.defineProperty(exports, "ListIndexesCursor", { enumerable: true, get: function () { return list_indexes_cursor_1.ListIndexesCursor; } });
		const db_1 = requireDb();
		Object.defineProperty(exports, "Db", { enumerable: true, get: function () { return db_1.Db; } });
		const gridfs_1 = gridfs;
		Object.defineProperty(exports, "GridFSBucket", { enumerable: true, get: function () { return gridfs_1.GridFSBucket; } });
		const download_1 = download;
		Object.defineProperty(exports, "GridFSBucketReadStream", { enumerable: true, get: function () { return download_1.GridFSBucketReadStream; } });
		const upload_1 = upload;
		Object.defineProperty(exports, "GridFSBucketWriteStream", { enumerable: true, get: function () { return upload_1.GridFSBucketWriteStream; } });
		const mongo_client_1 = requireMongo_client();
		Object.defineProperty(exports, "MongoClient", { enumerable: true, get: function () { return mongo_client_1.MongoClient; } });
		const mongo_types_1 = mongo_types;
		Object.defineProperty(exports, "CancellationToken", { enumerable: true, get: function () { return mongo_types_1.CancellationToken; } });
		const sessions_1 = sessions;
		Object.defineProperty(exports, "ClientSession", { enumerable: true, get: function () { return sessions_1.ClientSession; } });
		/** @public */
		var bson_1 = bson;
		Object.defineProperty(exports, "BSON", { enumerable: true, get: function () { return bson_1.BSON; } });
		var bson_2 = bson;
		Object.defineProperty(exports, "Binary", { enumerable: true, get: function () { return bson_2.Binary; } });
		Object.defineProperty(exports, "BSONRegExp", { enumerable: true, get: function () { return bson_2.BSONRegExp; } });
		Object.defineProperty(exports, "BSONSymbol", { enumerable: true, get: function () { return bson_2.BSONSymbol; } });
		Object.defineProperty(exports, "BSONType", { enumerable: true, get: function () { return bson_2.BSONType; } });
		Object.defineProperty(exports, "Code", { enumerable: true, get: function () { return bson_2.Code; } });
		Object.defineProperty(exports, "DBRef", { enumerable: true, get: function () { return bson_2.DBRef; } });
		Object.defineProperty(exports, "Decimal128", { enumerable: true, get: function () { return bson_2.Decimal128; } });
		Object.defineProperty(exports, "Double", { enumerable: true, get: function () { return bson_2.Double; } });
		Object.defineProperty(exports, "Int32", { enumerable: true, get: function () { return bson_2.Int32; } });
		Object.defineProperty(exports, "Long", { enumerable: true, get: function () { return bson_2.Long; } });
		Object.defineProperty(exports, "MaxKey", { enumerable: true, get: function () { return bson_2.MaxKey; } });
		Object.defineProperty(exports, "MinKey", { enumerable: true, get: function () { return bson_2.MinKey; } });
		Object.defineProperty(exports, "ObjectId", { enumerable: true, get: function () { return bson_2.ObjectId; } });
		Object.defineProperty(exports, "Timestamp", { enumerable: true, get: function () { return bson_2.Timestamp; } });
		var common_1 = common;
		Object.defineProperty(exports, "MongoBulkWriteError", { enumerable: true, get: function () { return common_1.MongoBulkWriteError; } });
		var change_stream_cursor_1 = requireChange_stream_cursor();
		Object.defineProperty(exports, "ChangeStreamCursor", { enumerable: true, get: function () { return change_stream_cursor_1.ChangeStreamCursor; } });
		var error_1 = error;
		Object.defineProperty(exports, "MongoAPIError", { enumerable: true, get: function () { return error_1.MongoAPIError; } });
		Object.defineProperty(exports, "MongoAWSError", { enumerable: true, get: function () { return error_1.MongoAWSError; } });
		Object.defineProperty(exports, "MongoAzureError", { enumerable: true, get: function () { return error_1.MongoAzureError; } });
		Object.defineProperty(exports, "MongoBatchReExecutionError", { enumerable: true, get: function () { return error_1.MongoBatchReExecutionError; } });
		Object.defineProperty(exports, "MongoChangeStreamError", { enumerable: true, get: function () { return error_1.MongoChangeStreamError; } });
		Object.defineProperty(exports, "MongoCompatibilityError", { enumerable: true, get: function () { return error_1.MongoCompatibilityError; } });
		Object.defineProperty(exports, "MongoCursorExhaustedError", { enumerable: true, get: function () { return error_1.MongoCursorExhaustedError; } });
		Object.defineProperty(exports, "MongoCursorInUseError", { enumerable: true, get: function () { return error_1.MongoCursorInUseError; } });
		Object.defineProperty(exports, "MongoDecompressionError", { enumerable: true, get: function () { return error_1.MongoDecompressionError; } });
		Object.defineProperty(exports, "MongoDriverError", { enumerable: true, get: function () { return error_1.MongoDriverError; } });
		Object.defineProperty(exports, "MongoError", { enumerable: true, get: function () { return error_1.MongoError; } });
		Object.defineProperty(exports, "MongoExpiredSessionError", { enumerable: true, get: function () { return error_1.MongoExpiredSessionError; } });
		Object.defineProperty(exports, "MongoGridFSChunkError", { enumerable: true, get: function () { return error_1.MongoGridFSChunkError; } });
		Object.defineProperty(exports, "MongoGridFSStreamError", { enumerable: true, get: function () { return error_1.MongoGridFSStreamError; } });
		Object.defineProperty(exports, "MongoInvalidArgumentError", { enumerable: true, get: function () { return error_1.MongoInvalidArgumentError; } });
		Object.defineProperty(exports, "MongoKerberosError", { enumerable: true, get: function () { return error_1.MongoKerberosError; } });
		Object.defineProperty(exports, "MongoMissingCredentialsError", { enumerable: true, get: function () { return error_1.MongoMissingCredentialsError; } });
		Object.defineProperty(exports, "MongoMissingDependencyError", { enumerable: true, get: function () { return error_1.MongoMissingDependencyError; } });
		Object.defineProperty(exports, "MongoNetworkError", { enumerable: true, get: function () { return error_1.MongoNetworkError; } });
		Object.defineProperty(exports, "MongoNetworkTimeoutError", { enumerable: true, get: function () { return error_1.MongoNetworkTimeoutError; } });
		Object.defineProperty(exports, "MongoNotConnectedError", { enumerable: true, get: function () { return error_1.MongoNotConnectedError; } });
		Object.defineProperty(exports, "MongoParseError", { enumerable: true, get: function () { return error_1.MongoParseError; } });
		Object.defineProperty(exports, "MongoRuntimeError", { enumerable: true, get: function () { return error_1.MongoRuntimeError; } });
		Object.defineProperty(exports, "MongoServerClosedError", { enumerable: true, get: function () { return error_1.MongoServerClosedError; } });
		Object.defineProperty(exports, "MongoServerError", { enumerable: true, get: function () { return error_1.MongoServerError; } });
		Object.defineProperty(exports, "MongoServerSelectionError", { enumerable: true, get: function () { return error_1.MongoServerSelectionError; } });
		Object.defineProperty(exports, "MongoSystemError", { enumerable: true, get: function () { return error_1.MongoSystemError; } });
		Object.defineProperty(exports, "MongoTailableCursorError", { enumerable: true, get: function () { return error_1.MongoTailableCursorError; } });
		Object.defineProperty(exports, "MongoTopologyClosedError", { enumerable: true, get: function () { return error_1.MongoTopologyClosedError; } });
		Object.defineProperty(exports, "MongoTransactionError", { enumerable: true, get: function () { return error_1.MongoTransactionError; } });
		Object.defineProperty(exports, "MongoUnexpectedServerResponseError", { enumerable: true, get: function () { return error_1.MongoUnexpectedServerResponseError; } });
		Object.defineProperty(exports, "MongoWriteConcernError", { enumerable: true, get: function () { return error_1.MongoWriteConcernError; } });
		// enums
		var common_2 = common;
		Object.defineProperty(exports, "BatchType", { enumerable: true, get: function () { return common_2.BatchType; } });
		var gssapi_1 = gssapi;
		Object.defineProperty(exports, "GSSAPICanonicalizationValue", { enumerable: true, get: function () { return gssapi_1.GSSAPICanonicalizationValue; } });
		var providers_1 = providers;
		Object.defineProperty(exports, "AuthMechanism", { enumerable: true, get: function () { return providers_1.AuthMechanism; } });
		var compression_1 = compression;
		Object.defineProperty(exports, "Compressor", { enumerable: true, get: function () { return compression_1.Compressor; } });
		var abstract_cursor_2 = abstract_cursor;
		Object.defineProperty(exports, "CURSOR_FLAGS", { enumerable: true, get: function () { return abstract_cursor_2.CURSOR_FLAGS; } });
		var deps_1 = deps;
		Object.defineProperty(exports, "AutoEncryptionLoggerLevel", { enumerable: true, get: function () { return deps_1.AutoEncryptionLoggerLevel; } });
		var error_2 = error;
		Object.defineProperty(exports, "MongoErrorLabel", { enumerable: true, get: function () { return error_2.MongoErrorLabel; } });
		var explain_1 = explain;
		Object.defineProperty(exports, "ExplainVerbosity", { enumerable: true, get: function () { return explain_1.ExplainVerbosity; } });
		var mongo_client_2 = requireMongo_client();
		Object.defineProperty(exports, "ServerApiVersion", { enumerable: true, get: function () { return mongo_client_2.ServerApiVersion; } });
		var find_and_modify_1 = find_and_modify;
		Object.defineProperty(exports, "ReturnDocument", { enumerable: true, get: function () { return find_and_modify_1.ReturnDocument; } });
		var set_profiling_level_1 = set_profiling_level;
		Object.defineProperty(exports, "ProfilingLevel", { enumerable: true, get: function () { return set_profiling_level_1.ProfilingLevel; } });
		var read_concern_1 = read_concern;
		Object.defineProperty(exports, "ReadConcernLevel", { enumerable: true, get: function () { return read_concern_1.ReadConcernLevel; } });
		var read_preference_1 = read_preference;
		Object.defineProperty(exports, "ReadPreferenceMode", { enumerable: true, get: function () { return read_preference_1.ReadPreferenceMode; } });
		var common_3 = common$1;
		Object.defineProperty(exports, "ServerType", { enumerable: true, get: function () { return common_3.ServerType; } });
		Object.defineProperty(exports, "TopologyType", { enumerable: true, get: function () { return common_3.TopologyType; } });
		// Helper classes
		var read_concern_2 = read_concern;
		Object.defineProperty(exports, "ReadConcern", { enumerable: true, get: function () { return read_concern_2.ReadConcern; } });
		var read_preference_2 = read_preference;
		Object.defineProperty(exports, "ReadPreference", { enumerable: true, get: function () { return read_preference_2.ReadPreference; } });
		var write_concern_1 = write_concern;
		Object.defineProperty(exports, "WriteConcern", { enumerable: true, get: function () { return write_concern_1.WriteConcern; } });
		// events
		var command_monitoring_events_1 = command_monitoring_events;
		Object.defineProperty(exports, "CommandFailedEvent", { enumerable: true, get: function () { return command_monitoring_events_1.CommandFailedEvent; } });
		Object.defineProperty(exports, "CommandStartedEvent", { enumerable: true, get: function () { return command_monitoring_events_1.CommandStartedEvent; } });
		Object.defineProperty(exports, "CommandSucceededEvent", { enumerable: true, get: function () { return command_monitoring_events_1.CommandSucceededEvent; } });
		var connection_pool_events_1 = connection_pool_events;
		Object.defineProperty(exports, "ConnectionCheckedInEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionCheckedInEvent; } });
		Object.defineProperty(exports, "ConnectionCheckedOutEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionCheckedOutEvent; } });
		Object.defineProperty(exports, "ConnectionCheckOutFailedEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionCheckOutFailedEvent; } });
		Object.defineProperty(exports, "ConnectionCheckOutStartedEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionCheckOutStartedEvent; } });
		Object.defineProperty(exports, "ConnectionClosedEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionClosedEvent; } });
		Object.defineProperty(exports, "ConnectionCreatedEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionCreatedEvent; } });
		Object.defineProperty(exports, "ConnectionPoolClearedEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionPoolClearedEvent; } });
		Object.defineProperty(exports, "ConnectionPoolClosedEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionPoolClosedEvent; } });
		Object.defineProperty(exports, "ConnectionPoolCreatedEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionPoolCreatedEvent; } });
		Object.defineProperty(exports, "ConnectionPoolMonitoringEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionPoolMonitoringEvent; } });
		Object.defineProperty(exports, "ConnectionPoolReadyEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionPoolReadyEvent; } });
		Object.defineProperty(exports, "ConnectionReadyEvent", { enumerable: true, get: function () { return connection_pool_events_1.ConnectionReadyEvent; } });
		var events_1 = events;
		Object.defineProperty(exports, "ServerClosedEvent", { enumerable: true, get: function () { return events_1.ServerClosedEvent; } });
		Object.defineProperty(exports, "ServerDescriptionChangedEvent", { enumerable: true, get: function () { return events_1.ServerDescriptionChangedEvent; } });
		Object.defineProperty(exports, "ServerHeartbeatFailedEvent", { enumerable: true, get: function () { return events_1.ServerHeartbeatFailedEvent; } });
		Object.defineProperty(exports, "ServerHeartbeatStartedEvent", { enumerable: true, get: function () { return events_1.ServerHeartbeatStartedEvent; } });
		Object.defineProperty(exports, "ServerHeartbeatSucceededEvent", { enumerable: true, get: function () { return events_1.ServerHeartbeatSucceededEvent; } });
		Object.defineProperty(exports, "ServerOpeningEvent", { enumerable: true, get: function () { return events_1.ServerOpeningEvent; } });
		Object.defineProperty(exports, "TopologyClosedEvent", { enumerable: true, get: function () { return events_1.TopologyClosedEvent; } });
		Object.defineProperty(exports, "TopologyDescriptionChangedEvent", { enumerable: true, get: function () { return events_1.TopologyDescriptionChangedEvent; } });
		Object.defineProperty(exports, "TopologyOpeningEvent", { enumerable: true, get: function () { return events_1.TopologyOpeningEvent; } });
		var srv_polling_1 = srv_polling;
		Object.defineProperty(exports, "SrvPollingEvent", { enumerable: true, get: function () { return srv_polling_1.SrvPollingEvent; } });
		
	} (lib));
	return lib;
}

var libExports = requireLib();

const message = model("Message", new Schema({
  user: { type: String },
  uid: { type: String, required: true },
  conv: { type: String, required: true },
  Q: { type: String, default: "" },
  A: { type: String, required: true },
  queries: { type: [String], default: void 0 },
  urls: { type: [String], default: void 0 },
  more: { type: [String], default: void 0 },
  dt: { type: Number, default: void 0 }
}, {
  versionKey: false,
  strict: "throw"
}), "messages");

const conversation = model("Conversation", new Schema({
  user: { type: String },
  id: { type: String, required: true },
  uid: { type: String, required: true },
  name: { type: String },
  config: { type: String },
  mtime: { type: Number }
}, {
  versionKey: false
}), "conversations");

var _a;
config();
console.log("MONGO:", (_a = process.env.MONGODB_KEY) == null ? void 0 : _a.slice(0, 11));
void mongoose.connect(process.env.MONGODB_KEY);
(async () => {
  const allMessages = await message.find({}, { _id: 1, user: 1 });
  console.log("Total messages:", allMessages.length);
  allMessages.forEach(async (m) => {
    if (!m.user) {
      return;
    }
    await message.updateOne({ _id: new libExports.ObjectId(m._id) }, {
      $set: { uid: m.user },
      $unset: { user: "" }
    });
    console.log("update message:", m._id.toString());
  });
})();
(async () => {
  const allConversations = await conversation.find({}, { _id: 1, user: 1 });
  console.log("Total convesations:", allConversations.length);
  allConversations.forEach(async (c) => {
    if (!c.user) {
      return;
    }
    await conversation.updateOne({ _id: new libExports.ObjectId(c._id) }, {
      $set: { uid: c.user },
      $unset: { user: "" }
    });
    console.log("update conv:", c._id.toString());
  });
})();

export { conversation as c, libExports as l, message as m };
//# sourceMappingURL=index2.mjs.map
