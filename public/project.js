async function loadProject() {
    const container = document.getElementById('project-detail');

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        container.innerHTML = `
            <div class="project-not-found">
                <h1>Project not found</h1>
                <a href="index.html#projects">← Back to Projects</a>
            </div>
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

                <div class="project-detail-header">

                    <span class="project-detail-label">
                        PROJECT
                    </span>

                    <h1>${project.title}</h1>

                    <p class="project-detail-description">
                        ${project.description}
                    </p>

                </div>

                ${
                    project.image_url
                        ? `
                            <div class="project-detail-image-wrapper">
                                <img
                                    src="${project.image_url}"
                                    alt="${project.title}"
                                    class="project-detail-image"
                                >
                            </div>
                        `
                        : ''
                }

                <section class="project-detail-section">

                    <h2>Tech Stack</h2>

                    <div class="project-detail-tech">
                        ${
                            project.tech_stack
                                ? project.tech_stack
                                    .split(',')
                                    .map(
                                        tech =>
                                            `<span>${tech.trim()}</span>`
                                    )
                                    .join('')
                                : '<span>Not specified</span>'
                        }
                    </div>

                </section>

                <div class="project-detail-actions">

                    ${
                        project.demo_url
                            ? `
                                <a
                                    href="${project.demo_url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="project-detail-btn primary"
                                >
                                    Live Demo
                                    <span>↗</span>
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
                                    class="project-detail-btn secondary"
                                >
                                    GitHub Repository
                                    <span>↗</span>
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
            <div class="project-not-found">
                <h1>Unable to load project</h1>
                <p>${error.message}</p>

                <a href="index.html#projects">
                    ← Back to Projects
                </a>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadProject);