import projectsData from '../data/projects.json';

/**
 * Find a property by id across all projects.
 * @param {string} propertyId
 * @returns {object|null} Property object or null
 */
export function getPropertyById(propertyId) {
    if (!propertyId) return null;
    const projects = projectsData?.projects || [];
    for (const project of projects) {
        const properties = project.properties || [];
        const found = properties.find((p) => p.id === propertyId);
        if (found) return found;
    }
    return null;
}
