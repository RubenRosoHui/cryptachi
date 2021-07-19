exports.errorWrapper = err => {
	return err instanceof Error ? err : Error(err);
};

//The server could not understand the request due to invalid syntax.
exports.badRequestError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'BadRequestError';
	error.statusCode = 400;
	error.message = error.message || 'The request had invalid syntax.';
	return error;
}
// Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". 
// That is, the client must authenticate itself to get the requested response.
exports.authenticationError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'AuthenticationError';
	error.statusCode = 401;
	error.message = error.message || 'The requested resource requires valid credentials.';
	return error;
}
// This response code is reserved for future use. The initial aim for creating this code was using it 
// for digital payment systems, however this status code is used very rarely and no standard convention exists.
exports.paymentRequiredError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'PaymentRequiredError';
	error.statusCode = 402;
	error.message = error.message || 'Request cannot be processed until payment is made';
	return error;
}
// The client does not have access rights to the content; that is, it is unauthorized, 
// so the server is refusing to give the requested resource. 
// Unlike 401, the client's identity is known to the server.
exports.unauthorizedAccessError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'UnauthorizedAccessError';
	error.statusCode = 403;
	error.message = error.message || 'The requested resource requires greater access rights.';
	return error;
}
// The server can not find the requested resource. In the browser, this means the URL is not recognized. 
// In an API, this can also mean that the endpoint is valid but the resource itself does not exist. 
// Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. 
// This response code is probably the most famous one due to its frequent occurrence on the web.
exports.notFoundError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'NotFoundError';
	error.statusCode = 404;
	error.message = error.message || 'The requested resource could not be found.';
	return error;
}
// This response is sent when a request conflicts with the current state of the server.
exports.conflictError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'ConflictError';
	error.statusCode = 409;
	error.message = error.message || 'The requested resouce could not be modified due to a conflict.';
	return error;
}
// The request was well-formed but it was unable to process the contained instructions.
exports.unprocessableEntityError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'UnprocessableEntityError';
	error.statusCode = 422;
	error.message = error.message || 'Request is malformed.';
	return error;
}
// The server has encountered a situation it doesn't know how to handle.
exports.serverError = function (err) {
	const error = module.exports.errorWrapper(err);
	error.name = 'ServerError';
	error.statusCode = 500;
	error.message = error.message || 'The server has encountered an error.';
	return error;
}
