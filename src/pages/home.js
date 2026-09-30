export function renderHome(container) {
  container.innerHTML = `
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>
    
    <div class="container">
      <div class="header">
        <div class="logo">✨ DreamDrop AI</div>
        <div class="nav-buttons">
          <button class="btn btn-primary" onclick="navigateTo('text-to-image')">
            🎨 Text to Image
          </button>
          <button class="btn btn-primary" onclick="navigateTo('image-editor')">
            📸 Edit Image
          </button>
        </div>
      </div>
      
      <div class="container">
        <h2 class="page-title">Welcome to DreamDrop AI</h2>
        <p class="page-subtitle">Transform your imagination into stunning visuals using AI</p>
        
        <div class="grid">
          <div class="feature-card" onclick="navigateTo('text-to-image')">
            <span class="feature-icon">✍️</span>
            <h3 class="feature-title">Text to Image</h3>
            <p class="feature-desc">Describe what you want, and AI creates it for you</p>
          </div>
          
          <div class="feature-card" onclick="navigateTo('image-editor')">
            <span class="feature-icon">🎭</span>
            <h3 class="feature-title">Image Editor</h3>
            <p class="feature-desc">Upload an image and ask AI to transform it</p>
          </div>
          
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h3 class="feature-title">Lightning Fast</h3>
            <p class="feature-desc">Ultra-efficient Cloudflare Workers AI</p>
          </div>
        </div>
        
        <div class="card">
          <h3 style="color: var(--primary); margin-top: 0;">Quick Tips:</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            <li>Be specific with your descriptions for better results</li>
            <li>Mention the art style, mood, and colors you want</li>
            <li>You can ask for specific transformations (e.g., "add a saree", "make it glowing")</li>
            <li>Upload reference images for guidance</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}