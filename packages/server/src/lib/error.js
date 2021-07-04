exports.errorWrapper = err => {
	return err instanceof Error ? err : Error(err);
};

exports.paymentRequiredError = function(err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'PaymentRequiredError';
	error.statusCode = 402;
	error.message = error.message || 'Request cannot be processed until payment is made';
	return error;
}

exports.badRequestError = function(err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'BadRequestError';
	error.statusCode = 400;
	error.message = error.message || 'The request had invalid syntax.';
	return error;
}

exports.authenticationError = function(err) {
	//console.log("test");
	const error = module.exports.errorWrapper(err);
	error.name = 'AuthenticationError';
	error.statusCode = 401;
	error.message = error.message || 'The requested resource requires valid credentials.';
	return error;
}

exports.unauthorizedAccessError = function(err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'UnauthorizedAccessError';
	error.statusCode = 403;
	error.message = error.message || 'The requested resource requires greater access rights.';
	return error;
}

exports.notFoundError = function(err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'NotFoundError';
	error.statusCode = 404;
	error.message = error.message || 'The requested resource could not be found.';
	return error;
}

exports.conflictError = function(err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'ConflictError';
	error.statusCode = 409;
	error.message = error.message || 'The requested resouce could not be modified due to a conflict.';
	return error;
}

exports.unprocessableEntityError = function(err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'UnprocessableEntityError';
	error.statusCode = 422;
	error.message = error.message || 'Request is malformed.';
	return error;
}

exports.serverError = function(err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'ServerError';
	error.statusCode = 500;
	error.message = error.message || 'The server has encountered an error.';
	return error;
}
