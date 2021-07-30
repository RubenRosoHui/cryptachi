export async function handleResponse(res) {
	if (res.ok) return;

	const error = new Error('Server response returned an error.');
	error.httpStatusCode = res.status;

	if (res.status >= 400) {
		const jres = await res.json();
		Object.assign(error, jres.error);
    error.message = jres.message;
	}

	throw error;
}
