export async function load({ fetch }) {
    let blogPosts = await fetch('/api/blogs');
    return {
        blogPosts: await blogPosts.json()
    };
}
