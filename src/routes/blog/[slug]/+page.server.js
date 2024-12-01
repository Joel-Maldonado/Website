export async function load({ params }) {
    try {
        const post = await import(`../../../lib/blogs-md/${params.slug}.md`);
        return {
            slug: params.slug,
            metadata: post.metadata
        };
    } catch (error) {
        throw error;
    }
}
