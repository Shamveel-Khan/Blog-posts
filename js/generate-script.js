// DOM Elements
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
        const markdownEditor = document.getElementById('markdown-editor');
        const previewToggle = document.getElementById('preview-toggle');
        const editorContainer = document.getElementById('editor-container');
        const previewContainer = document.getElementById('preview-container');
        const previewContent = document.getElementById('preview-content');
        const wordCount = document.getElementById('word-count');
        const charCount = document.getElementById('char-count');
        const exportBtn = document.getElementById('export-btn');
        const exportModal = document.getElementById('export-modal');
        const successModal = document.getElementById('success-modal');
        const modalClose = document.getElementById('modal-close');
        const successClose = document.getElementById('success-close');
        const exportForm = document.getElementById('export-form');
        
        // State
        let isPreviewMode = false;
        let currentNoteData = {};

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            updateWordCount();
            markdownEditor.focus();
        });

        // Mobile sidebar toggle
        function toggleSidebar() {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        }

        // Event Listeners
        mobileMenuButton?.addEventListener('click', toggleSidebar);
        sidebarOverlay?.addEventListener('click', toggleSidebar);
        sidebarCloseBtn?.addEventListener('click', toggleSidebar);

        // Word count update
        markdownEditor.addEventListener('input', () => {
            updateWordCount();
            if (isPreviewMode) {
                updatePreview();
            }
        });

        function updateWordCount() {
            const text = markdownEditor.value;
            const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            const chars = text.length;
            
            wordCount.textContent = words;
            charCount.textContent = chars;
        }

        // Preview toggle
        previewToggle.addEventListener('click', () => {
            isPreviewMode = !isPreviewMode;
            
            if (isPreviewMode) {
                editorContainer.classList.add('hidden');
                previewContainer.classList.remove('hidden');
                previewToggle.innerHTML = '<i class="fas fa-edit"></i><span>Edit</span>';
                previewToggle.classList.remove('bg-cyber-accent', 'hover:bg-blue-600');
                previewToggle.classList.add('bg-orange-600', 'hover:bg-orange-700');
                updatePreview();
            } else {
                editorContainer.classList.remove('hidden');
                previewContainer.classList.add('hidden');
                previewToggle.innerHTML = '<i class="fas fa-eye"></i><span>Preview</span>';
                previewToggle.classList.remove('bg-orange-600', 'hover:bg-orange-700');
                previewToggle.classList.add('bg-cyber-accent', 'hover:bg-blue-600');
            }
        });

        function updatePreview() {
            const markdown = markdownEditor.value;
            const html = marked.parse(markdown);
            previewContent.innerHTML = html || '<p class="text-gray-500 italic">Your preview will appear here...</p>';
        }

        // Export functionality
        exportBtn.addEventListener('click', () => {
            if (markdownEditor.value.trim() === '') {
                alert('Please write some content before exporting!');
                return;
            }
            exportModal.classList.remove('hidden');
        });

        modalClose.addEventListener('click', () => {
            exportModal.classList.add('hidden');
        });

        successClose.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });

        exportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('note-title').value;
            const fileName = document.getElementById('file-name').value;
            const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const category = document.getElementById('category').value;
            const content = markdownEditor.value;
            const htmlContent = marked.parse(content);
            
            // Generate excerpt from first 150 characters
            const excerpt = content.replace(/[#*`\[\]]/g, '').trim().substring(0, 150) + '...';
            
            // Current date
            const today = new Date().toISOString().split('T')[0];
            
            // Create note data
            currentNoteData = {
                title,
                fileName,
                excerpt,
                tags,
                category,
                content,
                htmlContent,
                date: today,
                json: {
                    title,
                    excerpt,
                    path: `notes/${fileName}`,
                    tags,
                    category,
                    date: today
                }
            };
            
            exportModal.classList.add('hidden');
            successModal.classList.remove('hidden');
        });

        // Download HTML
        document.getElementById('download-html').addEventListener('click', () => {
            // Use the note-template.html structure for the downloaded file
            const title = currentNoteData.title;
            const tags = currentNoteData.tags;
            const category = currentNoteData.category;
            const date = currentNoteData.date;
            const htmlContent = currentNoteData.htmlContent;

            // Compose tags HTML
            const tagsHtml = tags.map(tag =>
                `<span class="bg-red-900 text-red-200 px-2 py-1 rounded text-xs">${tag}</span>`
            ).join(' ');
            const categoryHtml = `<span class="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">${category}</span>`;

            // Build the template
            const htmlTemplate = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Shamveel's Cybersecurity Notes</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'cyber-accent': '#3b82f6',
                        'cyber-accent-light': '#cbd5e1',
                        'cyber-accent-dark': '#64748b',
                    },
                    animation: {
                        'fade-in': 'fadeIn 300ms ease-in-out',
                        'slide-in': 'slideIn 300ms ease-in-out',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' }
                        },
                        slideIn: {
                            '0%': { transform: 'translateX(-100%)' },
                            '100%': { transform: 'translateX(0)' }
                        }
                    }
                }
            }
        }
    <\/script>
    <link rel="stylesheet" href="../css/noteStyle.css">
    <style>
        #note-content h1 {
            font-size: 2.25rem;
            line-height: 2.5rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #3b82f6;
        }
        #note-content h2 {
            font-size: 1.5rem;
            line-height: 2rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #3b82f6;
        }
        #note-content h3 {
            font-size: 1.25rem;
            line-height: 1.75rem;
            font-weight: 600;
            margin-top: 1.25rem;
            margin-bottom: 0.5rem;
            color: #3b82f6;
        }
        #note-content h4 {
            font-size: 1.125rem;
            line-height: 1.5rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #3b82f6;
        }
        #note-content h5 {
            font-size: 1rem;
            line-height: 1.25rem;
            font-weight: 600;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
            color: #3b82f6;
        }
        #note-content h6 {
            font-size: 0.875rem;
            line-height: 1.25rem;
            font-weight: 600;
            margin-top: 0.5rem;
            margin-bottom: 0.25rem;
            color: #3b82f6;
        }
        
        #note-content code {
            background-color: #0e3855;
            color: #cbd5e1;
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            font-size: 0.875em;
        }
        
        #note-content pre {
            background-color: #1a1a25;
            border: 1px solid #374151;
            margin:0;
        }
        
        #note-content pre code {
            background-color: transparent;
            padding: 0;
        }
        
        #note-content blockquote {
            border-left: 4px solid #3b82f6;
            background-color: rgba(59, 130, 246, 0.1);
        }
        
        #note-content a {
            color: #3b82f6;
        }
        #note-content p {
            margin-top: 7px;
        }
        #note-content a:hover {
            color: #60a5fa;
        }
        
        #note-content table {
            border-collapse: collapse;
        }
        
        #note-content th, #note-content td {
            border: 1px solid #374151;
            padding: 0.5rem;
        }
        
        #note-content th {
            background-color: #1a1a25;
        } 
        
        #note-content ::-webkit-scrollbar {
            width: 8px;
        }
        
        #note-content ::-webkit-scrollbar-track {
            background: #111118;
        }
        
        #note-content ::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 4px;
        }
        
        #note-content ::-webkit-scrollbar-thumb:hover {
            background: #60a5fa;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 font-mono">
    <!-- Mobile Menu Button -->
    <button id="mobile-menu-btn" class="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md border border-gray-700 transition-all duration-300 hover:border-cyber-accent">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    </button>
    <!-- Sidebar -->
    <aside id="sidebar" class="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out z-40">
        <div class="p-6">
            <button id="sidebar-close-btn" class="absolute top-4 right-4 z-50 text-gray-400 hover:text-cyber-accent transition-colors hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <div class="mb-8">
                <h1 class="text-xl font-bold text-cyber-accent">
                    <span class="text-gray-100">$</span> cybersec_notes
                </h1>
                <p class="text-sm text-gray-400 mt-1">Security Research Hub</p>
            </div>
            <nav class="space-y-4">
                <a href="../index.html" class="flex items-center space-x-3 p-3 rounded-lg bg-gray-700 text-cyber-accent border border-gray-600">
                    <span class="text-lg">🏠</span>
                    <span>Home</span>
                </a>
                <a href="../about.html" class="nav-link flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <span class="text-lg">👨‍💻</span>
                    <span>About the Developer</span>
                </a>
            </nav>
            <div class="mt-8">
                <label class="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                    <span class="text-lg">📊</span>
                    <span>Word Count</span>
                </label>
                <div id="word-count" class="text-xl font-bold text-cyber-accent"></div>
                <div class="text-xs text-gray-500 mt-1">
                        <span id="char-count">${markdownEditor.value.length}</span> characters
                </div>
            </div>
            <div class="mt-8 p-4 bg-gray-700 rounded-lg border border-gray-600 animate-fade-in">
                <div class="text-sm text-gray-400">Note Details</div>
                <div class="mt-2 text-sm text-gray-300">
                    <div class="mt-1">Updated: ${date}</div>
                    <div class="mt-2 flex flex-wrap gap-1">
                        ${tagsHtml}
                        ${categoryHtml}
                    </div>
                </div>
            </div>
        </div>
    </aside>
    <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden hidden transition-opacity duration-300"></div>
    <main class="lg:ml-64 min-h-screen transition-transform duration-300">
        <div class="p-6 lg:p-8">
            <header class="mb-8 pb-4 border-b border-gray-700">
                <div class="flex items-start justify-between">
                    <div>
                        <h1 class="text-3xl lg:text-4xl font-bold mb-2 text-cyber-accent">
                            ${title}
                        </h1>
                        <div class="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Last updated: ${date}</span>
                            <span>•</span>
                            <span id="reading-time">Reading time: 0 min</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${tagsHtml}
                        ${categoryHtml}
                    </div>
                </div>
            </header>
            <article id="note-content" class="prose prose-invert max-w-none text-gray-300">
                ${htmlContent}
            </article>
        </div>
    </main>
    <script src="../js/notes.js"><\/script>
</body>
</html>`;

            downloadFile(htmlTemplate, currentNoteData.fileName, 'text/html');
        });

        // Copy JSON
        document.getElementById('copy-json').addEventListener('click', async () => {
            const jsonString = JSON.stringify(currentNoteData.json, null, 2);
            try {
                await navigator.clipboard.writeText(jsonString);
                const btn = document.getElementById('copy-json');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                btn.classList.add('bg-green-800');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('bg-green-800');
                    btn.classList.add('bg-green-600', 'hover:bg-green-700');
                }, 2000);
            } catch (err) {
                alert('Failed to copy to clipboard');
            }
        });

        // Download JSON
        document.getElementById('download-json').addEventListener('click', () => {
            const jsonString = JSON.stringify(currentNoteData.json, null, 2);
            downloadFile(jsonString, `${currentNoteData.fileName.replace('.html', '')}-metadata.json`, 'application/json');
        });

        // Utility function to download files
        function downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Close modals when clicking outside
        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) {
                exportModal.classList.add('hidden');
            }
        });

        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.add('hidden');
            }
        });

        // Auto-generate filename from title
        document.getElementById('note-title').addEventListener('input', (e) => {
            const title = e.target.value;
            const filename = title
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .replace(/^-+|-+$/g, '') + '.html';
            document.getElementById('file-name').value = filename;
        });