import { json } from '@sveltejs/kit';
import projectsData from '$lib/data/projects.json';

export function GET({ url }) {
    const limit = url.searchParams.get('limit');
    let projects = projectsData.projects;

    projects = projects.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (limit) {
        projects = projects.slice(0, parseInt(limit));
    }

    return json({ projects });
}
