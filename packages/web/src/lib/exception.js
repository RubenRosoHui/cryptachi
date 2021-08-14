export async function handleResponse(res) {
  const jres = await res.json();

	if (res.ok) return jres;

	const error = new Error('Server response returned an error.');
	error.httpStatusCode = res.status;

	if (res.status >= 400) {
		Object.assign(error, jres.error);
    error.message = jres.message;
	}

	throw error;
}
