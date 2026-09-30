export function renderTextToImage(container) {
  let selectedImage = '';
  
  container.innerHTML = `
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>
    
    <div class="container">
      <div class="header">
        <div class="logo">✨ DreamDrop AI</div>
        <div class="nav-buttons">
          <button class="btn btn-secondary" onclick="navigateTo('home')">← Back</button>
        </div>
      </div>
      
      <h2 class="page-title">🎨 Text to Image</h2>
      <p class="page-subtitle">Describe your dream, and AI brings it to life</p>
      
      <div class="card">
        <div class="form-group">
          <label>Your Prompt (Be Detailed!)</label>
          <textarea id="promptInput" placeholder="Example: A woman wearing a red saree, standing in a beautiful garden, soft golden sunlight, cinematic, professional photography, highly detailed, 4k"></textarea>
        </div>
        
        <div class="form-group">
          <label>Reference Image (Optional)</label>
          <div class="dropzone" id="dropzone">
            <span class="dropzone-icon">📤</span>
            <p class="dropzone-text">Click or drag an image here</p>
          </div>
          <img id="refPreview" class="preview-image" hidden>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="useRef" checked>
          <label style="margin: 0;">Use reference image as visual guide</label>
        </div>
        
        <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" id="generateBtn">
          ✨ Generate Image
        </button>
      </div>
      
      <div class="result-area" id="resultArea" style="display: none;">
        <div id="resultContent"></div>
      </div>
    </div>
  `;
  
  const dropzone = container.querySelector('#dropzone');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;
  
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
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  });
  
  fileInput.addEventListener('change', (e) => {
    handleImageUpload(e.target.files[0]);
  });
  
  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage = e.target.result;
      container.querySelector('#refPreview').src = selectedImage;
      container.querySelector('#refPreview').hidden = false;
    };
    reader.readAsDataURL(file);
  }
  
  container.querySelector('#generateBtn').addEventListener('click', async () => {
    const prompt = container.querySelector('#promptInput').value.trim();
    if (!prompt) {
      alert('Please enter a prompt!');
      return;
    }
    
    const btn = container.querySelector('#generateBtn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="display: inline-block; margin-right: 10px;"></div>Generating...';
    
    const resultArea = container.querySelector('#resultArea');
    const resultContent = container.querySelector('#resultContent');
    resultArea.style.display = 'block';
    resultContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Creating your masterpiece...</p></div>';
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          referenceImage: selectedImage || null,
          useReference: container.querySelector('#useRef').checked
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