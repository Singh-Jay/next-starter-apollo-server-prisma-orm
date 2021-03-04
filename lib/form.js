export function getError(error) {
	console.log(error.graphQLErrors);
	if (error.graphQLErrors) {
		for (const graphQLError of error.graphQLErrors) {
			if (graphQLError.extensions && graphQLError.extensions.code === 'BAD_USER_INPUT') {
				return graphQLError.extensions.errors;
			}
		}
	}
	return { general: error.message };
}
