module.exports = (request, h) => {
	const response = request.response;
	if (response.isBoom) {
		if (response.output.statusCode === 400) {
			return h
				.response({
					statusCode: 400,
					error: "Bad Request",
					message: response.message,
					validation: response.output.payload.validation,
				})
				.code(400);
		}
		if (response.output.statusCode >= 500 && response.output.statusCode < 600) {
			console.error("[ERROR]", response);
		}
	}
	return h.continue;
};
