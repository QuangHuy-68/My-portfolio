async function loadProject() {
    const container = document.getElementById('project-detail');

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        container.innerHTML = `
            <h1>Project not found</h1>
            <a href="index.html#projects">Back to Projects</a>
        `;
        return;
    }

    try {
        const response = await fetch(`/api/projects/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Project not found');
        }

        const project = result.data;

        document.title = `${project.title} — Quang Huy`;

        container.innerHTML = `
            <article class="project-detail-card">

                ${
                    project.image_url
                        ? `
                            <img
                                src="${project.image_url}"
                                alt="${project.title}"
                                class="project-detail-image"
                            >
                        `
                        : ''
                }

                <h1>${project.title}</h1>

                <p class="project-description">
                    ${project.description}
                </p>

                <h2>Tech Stack</h2>

                <p>
                    ${project.tech_stack || 'Not specified'}
                </p>

                <div class="project-detail-links">

                    ${
                        project.demo_url
                            ? `
                                <a
                                    href="${project.demo_url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Live Demo
                                </a>
                            `
                            : ''
                    }

                    ${
                        project.github_url
                            ? `
                                <a
                                    href="${project.github_url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub Repository
                                </a>
                            `
                            : ''
                    }

                </div>

            </article>
        `;

    } catch (error) {
        console.error('Project detail error:', error);

        container.innerHTML = `
            <h1>Unable to load project</h1>
            <p>${error.message}</p>

            <a href="index.html#projects">
                ← Back to Projects
            </a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadProject);