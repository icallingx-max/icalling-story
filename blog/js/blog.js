// Blog Data Loader
// Loads blog posts from JSON

async function loadBlogPosts() {
    try {
        const response = await fetch('data/posts.json');
        const data = await response.json();
        
        const container = document.getElementById('blog-posts');
        if (!container) return;
        
        if (data.posts && data.posts.length > 0) {
            container.innerHTML = data.posts.map(post => `
                <div class="blog-card">
                    <div class="blog-date">${post.date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="#" class="blog-read-more" onclick="showPost('${post.id}')">Read more →</a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function showPost(id) {
    // Future: Load individual post content
    alert('Post detail view coming soon!');
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);
