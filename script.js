document.addEventListener('DOMContentLoaded', () => {

    // --- STATE & DATA ---
    let activeView = 'dashboard';
    let selectedProject = null;
    const projects = [
        { id: 1, name: 'Q1 Product Launch', status: 'active', progress: 65, team: ['Alice', 'Bob', 'Charlie'] },
        { id: 2, name: 'Infrastructure Migration', status: 'at-risk', progress: 30, team: ['David', 'Eve'] }
    ];
    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'projects', label: 'Projects', icon: 'folder' },
        { id: 'goals', label: 'Goals', icon: 'target' },
        { id: 'intelligence', label: 'Intelligence', icon: 'brain' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
    ];

    // --- DOM ELEMENT SELECTORS ---
    const sidebar = document.getElementById('sidebar');
    const sidebarNav = document.getElementById('sidebar-nav');
    const headerTitle = document.getElementById('header-title');
    const viewContainer = document.getElementById('view-container');
    const newProjectModal = document.getElementById('new-project-modal');
    const newProjectBtn = document.getElementById('new-project-btn'); // Will be created dynamically
    const closeProjectModalBtn = document.getElementById('close-project-modal-btn');
    const cancelProjectModalBtn = document.getElementById('cancel-project-modal-btn');
    const generateProjectBtn = document.getElementById('generate-project-btn');
    const projectPromptInput = document.getElementById('project-prompt');

    // --- RENDER FUNCTIONS ---
    
    // Render the main sidebar navigation
    const renderSidebar = () => {
        sidebarNav.innerHTML = sidebarItems.map(item => `
            <button class="nav-item ${item.id === activeView ? 'active' : ''}" data-view="${item.id}">
                <i data-lucide="${item.icon}"></i>
                <span class="nav-item-label">${item.label}</span>
            </button>
        `).join('');
    };

    // Render the Dashboard view
    const renderDashboard = () => {
        viewContainer.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <i data-lucide="sparkles"></i>
                    Nexus Suggestions
                </div>
                <p>Suggestion content goes here...</p>
            </div>
        `;
    };

    // Render the Projects view
    const renderProjects = () => {
        const projectsHTML = projects.map(p => `
            <div class="card project-card" data-project-id="${p.id}">
                <div class="project-card-header">
                    <h3>${p.name}</h3>
                    <span class="status-badge ${p.status}">${p.status}</span>
                </div>
                <div class="project-card-details">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${p.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-inner" style="width: ${p.progress}%;"></div>
                    </div>
                </div>
            </div>
        `).join('');

        viewContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2>All Projects</h2>
                <button id="new-project-btn" class="btn btn-primary">
                    <i data-lucide="plus"></i> New Project
                </button>
            </div>
            <div class="projects-grid">
                ${projectsHTML}
            </div>
        `;
    };

    // Generic renderer for other views
    const renderGenericView = (viewName) => {
        viewContainer.innerHTML = `
            <div class="card">
                <h2>${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h2>
                <p>Content for ${viewName} goes here.</p>
            </div>`;
    };


    // --- UI LOGIC & EVENT HANDLERS ---

    // Function to switch between views
    const switchView = (viewId) => {
        activeView = viewId;
        headerTitle.textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);
        
        switch (viewId) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'projects':
                renderProjects();
                break;
            case 'goals':
            case 'intelligence':
            case 'settings':
                renderGenericView(viewId);
                break;
            default:
                renderDashboard();
        }

        renderSidebar(); // Re-render sidebar to update active state
        lucide.createIcons(); // Re-render icons
    };

    // Handler for creating a new project
    const handleNewProject = () => {
        const prompt = projectPromptInput.value.trim();
        if (!prompt) {
            alert('Please describe your project.');
            return;
        }

        const newProject = {
            id: projects.length + 1,
            name: prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''),
            status: 'active',
            progress: 0,
            team: ['Admin']
        };

        projects.push(newProject);
        projectPromptInput.value = '';
        newProjectModal.classList.add('hidden');
        switchView('projects'); // Refresh the projects view
    };

    // --- EVENT LISTENERS ---

    sidebar.addEventListener('mouseenter', () => sidebar.classList.add('expanded'));
    sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('expanded'));

    sidebarNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            const viewId = navItem.dataset.view;
            switchView(viewId);
        }
    });
    
    // Use event delegation for buttons inside the dynamic view container
    viewContainer.addEventListener('click', (e) => {
        if (e.target.id === 'new-project-btn' || e.target.closest('#new-project-btn')) {
             newProjectModal.classList.remove('hidden');
        }
    });

    closeProjectModalBtn.addEventListener('click', () => newProjectModal.classList.add('hidden'));
    cancelProjectModalBtn.addEventListener('click', () => newProjectModal.classList.add('hidden'));
    generateProjectBtn.addEventListener('click', handleNewProject);
    
    // Close modal if backdrop is clicked
    newProjectModal.addEventListener('click', (e) => {
        if (e.target === newProjectModal) {
            newProjectModal.classList.add('hidden');
        }
    });

    // --- INITIALIZATION ---
    const init = () => {
        switchView('dashboard'); // Load the initial view
    };

    init();
});