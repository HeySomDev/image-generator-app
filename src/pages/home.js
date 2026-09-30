export function renderHome(container) {
  const mainDiv = document.createElement('div');
  mainDiv.innerHTML = `
    <div class="container">
      <div class="header">
        <div class="logo">✨ DreamDrop AI Pro</div>
        <div class="nav-buttons">
          <button class="btn btn-primary" onclick="navigateTo('text-to-image')">
            🎨 Generate Image
          </button>
          <button class="btn btn-primary" onclick="navigateTo('image-editor')">
            📸 Transform Image
          </button>
        </div>
      </div>
      
      <h2 class="page-title">Welcome to DreamDrop AI Pro</h2>
      <p class="page-subtitle">Transform your imagination into stunning visuals using AI-powered generation</p>
      
      <div class="grid">
        <div class="feature-card" onclick="navigateTo('text-to-image')">
          <span class="feature-icon">✍️</span>
          <h3 class="feature-title">Text to Image</h3>
          <p class="feature-desc">Describe anything and AI creates it instantly</p>
        </div>
        
        <div class="feature-card" onclick="navigateTo('image-editor')">
          <span class="feature-icon">🎭</span>
          <h3 class="feature-title">AI Image Editor</h3>
          <p class="feature-desc">Upload and transform images with AI magic</p>
        </div>
        
        <div class="feature-card">
          <span class="feature-icon">⚡</span>
          <h3 class="feature-title">Ultra-Fast</h3>
          <p class="feature-desc">Powered by Cloudflare Workers AI</p>
        </div>
        
        <div class="feature-card">
          <span class="feature-icon">💰</span>
          <h3 class="feature-title">Low Cost</h3>
          <p class="feature-desc">Efficient token usage, maximum results</p>
        </div>
      </div>
      
      <div class="card">
        <h3 style="color: var(--primary); margin-bottom: 16px;">💡 How to Use:</h3>
        <div style="color: var(--text-secondary); line-height: 1.8;">
          <p><strong>Text to Image:</strong> Type what you want to see. E.g., "A woman wearing a red saree in a golden garden at sunset"</p>
          <p><strong>Transform Image:</strong> Upload a photo and describe what to change. E.g., "Add a beautiful blue saree with golden embroidery"</p>
          <p><strong>Pro Tips:</strong></p>
          <ul>
            <li>Be specific with details for better results</li>
            <li>Mention style: cinematic, painting, 3D render, etc.</li>
            <li>Add lighting: golden hour, studio light, neon glow</li>
            <li>Use reference images to guide the AI</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  container.appendChild(mainDiv);
}
