import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		// Import from all possible locations
		let post;
		try {
			post = await import(`../../../content/blog/recipes/${params.slug}.md`);
		} catch {
			post = await import(`../../../content/blog/lifestyle/${params.slug}.md`);
		}

		return {
			content: post.default,
			metadata: post.metadata
		};
	} catch (e) {
		throw error(404, `Post "${params.slug}" not found`);
	}
}
