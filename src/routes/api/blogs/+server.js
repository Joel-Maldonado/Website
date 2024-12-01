import { json } from '@sveltejs/kit';

// Import all .md files from lib/blogs-md
const blogFiles = import.meta.glob('$lib/blogs-md/*.md');

export async function GET() {
    // Process all blog files
    const blogs = await Promise.all(
        Object.entries(blogFiles).map(async ([path, resolver]) => {
            const resolved = await resolver();
            const metadata = resolved.metadata;

            // Extract slug from path 
            const slug = path.split('/').pop().replace('.md', '');

            return {
                ...metadata,
                slug
            };
        })
    );

    // Sort blogs by date in descending order
    const sortedBlogs = blogs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    return json(sortedBlogs);
}
