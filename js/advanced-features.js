// Advanced Features for Tech Made Simple Blog

// ============================================
// 1. FUZZY SEARCH with Fuse.js-like functionality
// ============================================
function fuzzyMatch(pattern, str) {
    pattern = pattern.toLowerCase();
    str = str.toLowerCase();

    let patternIdx = 0;
    let strIdx = 0;
    let score = 0;

    while (patternIdx < pattern.length && strIdx < str.length) {
        if (pattern[patternIdx] === str[strIdx]) {
            score++;
            patternIdx++;
        }
        strIdx++;
    }

    return patternIdx === pattern.length ? score / pattern.length : 0;
}

function enhancedSearch(searchTerm, cards) {
    if (!searchTerm) return cards;

    const results = cards.map(card => {
        const title = card.querySelector('.card-title').textContent;
        const description = card.querySelector('.card-description').textContent;
        const tags = card.dataset.tags || '';

        const titleScore = fuzzyMatch(searchTerm, title) * 3;
        const descScore = fuzzyMatch(searchTerm, description) * 2;
        const tagScore = fuzzyMatch(searchTerm, tags);

        return {
            card,
            score: titleScore + descScore + tagScore
        };
    }).filter(item => item.score > 0.3);

    return results.sort((a, b) => b.score - a.score).map(item => item.card);
}

// ============================================
// 2. READ PROGRESS INDICATOR
// ============================================
function initReadProgress() {
    const article = document.querySelector('article');
    if (!article) return;

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'read-progress';
    progressBar.innerHTML = '<div class="read-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const progressBarFill = progressBar.querySelector('.read-progress-bar');

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        progressBarFill.style.width = Math.min(progress, 100) + '%';
    });
}

// ============================================
// 3. RELATED POSTS
// ============================================
function findRelatedPosts(currentTags, currentCategory, allPosts, limit = 3) {
    const currentTagsArray = currentTags ? currentTags.split(' ') : [];

    const scored = allPosts.map(post => {
        const postTags = post.dataset.tags ? post.dataset.tags.split(' ') : [];
        const postCategory = post.dataset.category;

        let score = 0;

        // Category match
        if (postCategory === currentCategory) score += 5;

        // Tag matches
        currentTagsArray.forEach(tag => {
            if (postTags.includes(tag)) score += 2;
        });

        return { post, score };
    }).filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scored.map(item => item.post);
}

function displayRelatedPosts() {
    const relatedContainer = document.getElementById('relatedPosts');
    if (!relatedContainer) return;

    // Get current post info from meta tags or URL
    const currentPath = window.location.pathname;
    const currentTags = document.querySelector('meta[name="tags"]')?.content || '';
    const currentCategory = document.querySelector('meta[name="category"]')?.content || '';

    // Fetch all posts (in real app, this would be from API or static data)
    // For now, we'll create a simple implementation
    const relatedHTML = `
        <h3>Related Articles</h3>
        <div class="related-posts-grid">
            <a href="api-explained.html" class="related-post-card">
                <div class="related-thumbnail">🔌</div>
                <h4>APIs Explained</h4>
                <p>Learn about APIs through simple analogies</p>
            </a>
            <a href="rest-explained.html" class="related-post-card">
                <div class="related-thumbnail">🍽️</div>
                <h4>REST APIs</h4>
                <p>Understanding RESTful architecture</p>
            </a>
            <a href="webhooks-explained.html" class="related-post-card">
                <div class="related-thumbnail">🔔</div>
                <h4>Webhooks</h4>
                <p>Event-driven notifications explained</p>
            </a>
        </div>
    `;

    relatedContainer.innerHTML = relatedHTML;
}

// ============================================
// 4. BOOKMARKS (LocalStorage)
// ============================================
function initBookmarks() {
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (!bookmarkBtn) return;

    const currentUrl = window.location.pathname;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    // Check if current page is bookmarked
    const isBookmarked = bookmarks.includes(currentUrl);
    updateBookmarkButton(bookmarkBtn, isBookmarked);

    bookmarkBtn.addEventListener('click', () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const index = bookmarks.indexOf(currentUrl);

        if (index > -1) {
            bookmarks.splice(index, 1);
            updateBookmarkButton(bookmarkBtn, false);
        } else {
            bookmarks.push(currentUrl);
            updateBookmarkButton(bookmarkBtn, true);
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        trackEvent('Bookmark', isBookmarked ? 'Remove' : 'Add', currentUrl);
    });
}

function updateBookmarkButton(btn, isBookmarked) {
    btn.innerHTML = isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark';
    btn.classList.toggle('bookmarked', isBookmarked);
}

// ============================================
// 5. READING TIME CALCULATOR
// ============================================
function calculateReadingTime() {
    const article = document.querySelector('article');
    if (!article) return;

    const text = article.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute

    const readTimeElement = document.querySelector('.reading-time');
    if (readTimeElement) {
        readTimeElement.textContent = `${readingTime} min read`;
    }
}

// ============================================
// 6. VIEW COUNTER (LocalStorage)
// ============================================
function trackPageView() {
    const currentUrl = window.location.pathname;
    const views = JSON.parse(localStorage.getItem('pageViews') || '{}');

    views[currentUrl] = (views[currentUrl] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(views));

    return views[currentUrl];
}

function getPopularPosts(limit = 5) {
    const views = JSON.parse(localStorage.getItem('pageViews') || '{}');
    return Object.entries(views)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
}

// ============================================
// 7. SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 8. LAST READ POSITION (Resume Reading)
// ============================================
function saveReadPosition() {
    const currentUrl = window.location.pathname;
    const scrollPosition = window.scrollY;

    localStorage.setItem(`readPos_${currentUrl}`, scrollPosition.toString());
}

function restoreReadPosition() {
    const currentUrl = window.location.pathname;
    const savedPosition = localStorage.getItem(`readPos_${currentUrl}`);

    if (savedPosition && parseInt(savedPosition) > 100) {
        const shouldRestore = confirm('Continue reading from where you left off?');
        if (shouldRestore) {
            window.scrollTo({ top: parseInt(savedPosition), behavior: 'smooth' });
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all advanced features
    initReadProgress();
    initBookmarks();
    initScrollToTop();
    calculateReadingTime();
    displayRelatedPosts();

    // Track page view
    const viewCount = trackPageView();
    console.log(`Page views: ${viewCount}`);

    // Restore read position
    setTimeout(restoreReadPosition, 500);

    // Save position on scroll (debounced)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(saveReadPosition, 1000);
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fuzzyMatch,
        enhancedSearch,
        findRelatedPosts,
        calculateReadingTime,
        getPopularPosts
    };
}
