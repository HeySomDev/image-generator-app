export function renderTextToImage(container) {
  const mainDiv = document.createElement('div');
  let selectedImage = '';
  
  mainDiv.innerHTML = `
    <div class="container">
      <div class="header">
        <div class="logo">✨ DreamDrop AI Pro</div>
        <div class="nav-buttons">
          <button class="btn btn-secondary" onclick="navigateTo('home')">← Back Home</button>
        </div>
      </div>
      
      <h2 class="page-title">🎨 Text to Image</h2>
      <p class="page-subtitle">Describe your vision and let AI bring it to life</p>
      
      <div class="two-column">
        <div>
          <div class="card">
            <div class="form-group">
              <label>What do you want to see?</label>
              <textarea id="promptInput" placeholder="Example: A woman wearing a beautiful red saree with golden embroidery, standing in a lush green garden, golden sunlight, professional photography, cinematic, highly detailed, 4k"></textarea>
            </div>
            
            <div class="form-group">
              <label>Art Style (Optional)</label>
              <select id="styleSelect">
                <option value="">--- Select a style ---</option>
                <option value="cinematic">Cinematic</option>
                <option value="photorealistic">Photorealistic</option>
                <option value="digital painting">Digital Painting</option>
                <option value="3D render">3D Render</option>
                <option value="oil painting">Oil Painting</option>
                <option value="watercolor">Watercolor</option>
                <option value="anime">Anime</option>
                <option value="cartoon">Cartoon</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Reference Image (Optional)</label>
              <div class="dropzone" id="dropzone">
                <span class="dropzone-icon">📷</span>
                <p class="dropzone-text">Click or drag image here</p>
              </div>
              <img id="refPreview" class="preview-image" style="display: none;">
            </div>
            
            <div class="checkbox-group">
              <input type="checkbox" id="useRef" checked>
              <label style="margin: 0; text-transform: none; font-size: 14px; font-weight: 400;">Use reference image as guide</label>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" id="generateBtn">
              ✨ Generate Image
            </button>
          </div>
        </div>
        
        <div>
          <div class="result-area" id="resultArea" style="display: none;">
            <div id="resultContent"></div>
          </div>
          <div id="placeholderArea" class="card" style="text-align: center; height: 400px; display: flex; align-items: center; justify-content: center;">
            <div>
              <div style="font-size: 64px; margin-bottom: 16px;">🎨</div>
              <p style="color: var(--text-secondary);">Your generated image will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(mainDiv);
  setupTextToImage(container, mainDiv);
}

function setupTextToImage(container, mainDiv) {
  let selectedImage = '';
  const dropzone = mainDiv.querySelector('#dropzone');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  dropzone.appendChild(fileInput);
  
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleImageUpload(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', (e) => handleImageUpload(e.target.files[0]));
  
  function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage = e.target.result;
      mainDiv.querySelector('#refPreview').src = selectedImage;
      mainDiv.querySelector('#refPreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  
  mainDiv.querySelector('#generateBtn').addEventListener('click', async () => {
    const prompt = mainDiv.querySelector('#promptInput').value.trim();
    const style = mainDiv.querySelector('#styleSelect').value;
    
    if (!prompt) {
      alert('Please enter a prompt!');
      return;
    }
    
    const fullPrompt = style ? `${prompt}, ${style} style` : prompt;
    const btn = mainDiv.querySelector('#generateBtn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin-right: 10px; display: inline-block;"></div>Generating...';
    
    const resultArea = mainDiv.querySelector('#resultArea');
    const placeholderArea = mainDiv.querySelector('#placeholderArea');
    placeholderArea.style.display = 'none';
    resultArea.style.display = 'block';
    const resultContent = mainDiv.querySelector('#resultContent');
    resultContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Creating your masterpiece...</p></div>';
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          referenceImage: selectedImage || null,
          useReference: mainDiv.querySelector('#useRef').checked
        })
      });
      
      if (!response.ok) throw new Error('Generation failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      resultContent.innerHTML = `
        <img src="${url}" class="result-image" alt="Generated image">
        <button class="btn btn-primary" onclick="{
          const a = document.createElement('a');
          a.href = '${url}';
          a.download = 'dreamdrop-' + Date.now() + '.png';
          a.click();
        }">⬇️ Download</button>
      `;
    } catch (error) {
      resultContent.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '✨ Generate Image';
    }
  });
}
