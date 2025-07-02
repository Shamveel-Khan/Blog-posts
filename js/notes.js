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
        }

        function closeSidebar() {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            mobileMenuBtn.classList.remove('hidden');
            sidebarCloseBtn.classList.add('hidden');
            document.body.classList.remove('sidebar-open');
        }

        mobileMenuBtn.addEventListener('click', openSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
        sidebarCloseBtn.addEventListener('click', closeSidebar);

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

        // Word count functionality
        function calculateWordCount() {
            const noteContent = document.getElementById('note-content');
            const text = noteContent.textContent || noteContent.innerText;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            return words.length;
        }

        function calculateReadingTime(wordCount) {
            // Average reading speed: 200 words per minute
            const minutes = Math.ceil(wordCount / 200);
            return minutes;
        }

        // Update word count and reading time
        function updateWordStats() {
            const wordCount = calculateWordCount();
            const readingTime = calculateReadingTime(wordCount);
            
            document.getElementById('word-count').textContent = wordCount;
            document.getElementById('reading-time').textContent = `Reading time: ${readingTime} min`;
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            updateWordStats();
            
            // Simple syntax highlighting
            document.querySelectorAll('pre code').forEach((block) => {
                const code = block.textContent;
                // This is a simplified approach - for real projects use a library
                block.innerHTML = code
                    .replace(/\b(function|var|let|const|if|else|for|while|return)\b/g, '<span class="hljs-keyword">$&</span>')
                    .replace(/(".*?"|'.*?')/g, '<span class="hljs-string">$&</span>')
                    .replace(/\/\/.*/g, '<span class="hljs-comment">$&</span>');
            });
        });