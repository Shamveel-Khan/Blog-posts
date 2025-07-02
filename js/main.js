// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const mainContent = document.querySelector('main');

function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
    mobileMenuBtn.classList.add('hidden');
    sidebarCloseBtn.classList.remove('hidden');
    document.body.classList.add('sidebar-open');
    setTimeout(() => {
        sidebarOverlay.classList.add('opacity-100');
    }, 10);
}

function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
    mobileMenuBtn.classList.remove('hidden');
    sidebarCloseBtn.classList.add('hidden');
    document.body.classList.remove('sidebar-open');
    sidebarOverlay.classList.remove('opacity-100');
}

mobileMenuBtn.addEventListener('click', openSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
sidebarCloseBtn.addEventListener('click', closeSidebar);

// Search functionality
const searchInput = document.getElementById('search-input');
const notesContainer = document.getElementById('notes-container');
const noResults = document.getElementById('no-results');
const notesCount = document.getElementById('notes-count');
const filteredCount = document.getElementById('filtered-count');

// Function to create a note card
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-cyber-accent cursor-pointer';
    card.dataset.path = note.path;
    
    // Create tag elements
    const tagElements = note.tags.map(tag => {
        const colorClasses = {
            'Critical': 'bg-red-900 text-red-200',
            'Tools': 'bg-blue-900 text-blue-200',
            'Recon': 'bg-green-900 text-green-200',
            'Post-Exploit': 'bg-purple-900 text-purple-200',
            'Reference': 'bg-yellow-900 text-yellow-200',
            'Exploitation': 'bg-red-900 text-red-200',
            'Windows': 'bg-purple-900 text-purple-200',
            'Payloads': 'bg-orange-900 text-orange-200',
            'Forensics': 'bg-blue-900 text-blue-200',
            'Intel': 'bg-green-900 text-green-200',
            'Containers': 'bg-cyan-900 text-cyan-200'
        };
        
        const colorClass = colorClasses[tag] || 'bg-gray-700 text-gray-300';
        return `<span class="text-xs ${colorClass} px-2 py-1 rounded mr-1">${tag}</span>`;
    }).join('');
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-cyber-accent">${note.title}</h3>
            <div class="flex flex-wrap justify-end gap-1">${tagElements}</div>
        </div>
        <p class="text-gray-400 text-sm mb-4">${note.excerpt}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
            <span>${note.category}</span>
            <span>${note.date}</span>
        </div>
    `;
    
    return card;
}

// Function to render note cards
function renderNoteCards(notes) {
    // Clear existing cards
    notesContainer.innerHTML = '';
    
    // Create and append new cards
    notes.forEach(note => {
        const card = createNoteCard(note);
        notesContainer.appendChild(card);
    });
    
    // Update notes count
    notesCount.textContent = notes.length;
    filteredCount.textContent = `${notes.length} notes available`;
}

// Function to filter notes based on search term
function filterNotes(searchTerm, notes) {
    if (!searchTerm.trim()) return notes;
    
    return notes.filter(note => {
        const searchText = searchTerm.toLowerCase();
        const title = note.title.toLowerCase();
        const excerpt = note.excerpt.toLowerCase();
        const category = note.category.toLowerCase();
        const tags = note.tags.join(' ').toLowerCase();
        
        return title.includes(searchText) || 
               excerpt.includes(searchText) || 
               category.includes(searchText) ||
               tags.includes(searchText);
    });
}

// Function to handle search input
function handleSearch(notes) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filtered = filterNotes(searchTerm, notes);
    
    renderNoteCards(filtered);
    
    // Show/hide no results message
    if (filtered.length === 0 && searchTerm !== '') {
        notesContainer.style.display = 'none';
        noResults.classList.remove('hidden');
        noResults.classList.add('animate-fade-in');
    } else {
        notesContainer.style.display = 'grid';
        noResults.classList.add('hidden');
    }
    
    // Update filtered count
    filteredCount.textContent = `${filtered.length} notes available`;
}

// Event delegation for note card clicks
notesContainer.addEventListener('click', function(e) {
    let card = e.target;
    while (card && !card.classList.contains('note-card')) {
        card = card.parentElement;
    }
    
    if (card && card.dataset.path) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
            // Navigate to the note's path
            window.location.href = card.dataset.path;
        }, 600);
    }
});

// Fetch notes from JSON file
async function fetchNotes() {
    try {
        const response = await fetch('data/notes.json');
        const notes = await response.json();
        
        // Render all notes initially
        renderNoteCards(notes);
        
        // Add search event listener
        searchInput.addEventListener('input', () => handleSearch(notes));
        
        // Initialize search with empty term
        handleSearch(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
        // Show error message
        notesContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-xl font-semibold text-gray-400 mb-2">Failed to load notes</h3>
                <p class="text-gray-500">Please try again later</p>
            </div>
        `;
    }
}

// Close sidebar when clicking on main content on mobile
mainContent.addEventListener('click', (e) => {
    if (window.innerWidth < 1024 && !sidebar.classList.contains('-translate-x-full') && 
        e.target.closest('#sidebar') === null) {
        closeSidebar();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
        mobileMenuBtn.classList.add('hidden');
        sidebarCloseBtn.classList.add('hidden');
        document.body.classList.remove('sidebar-open');
    } else if (window.innerWidth < 1024 && !sidebar.classList.contains('-translate-x-full')) {
        closeSidebar();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();
});