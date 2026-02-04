type PostMetadata = {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	category: string;
	emoji: string;
	published: boolean;
};

export async function load() {
	const postFiles = import.meta.glob('/src/content/blog/**/*.md', { eager: true });

	const posts = Object.entries(postFiles).map(([path, module]) => {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const post = module as { metadata: Record<string, any> };
		return {
			slug,
			...post.metadata
		} as PostMetadata;
	});

	return {
		posts: posts
			.filter((p) => p.published)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	};
}
