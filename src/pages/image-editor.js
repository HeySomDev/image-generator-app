export function renderImageEditor(container) {
  const mainDiv = document.createElement('div');
  
  mainDiv.innerHTML = `
    <div class="container">
      <div class="header">
        <div class="logo">✨ DreamDrop AI Pro</div>
        <div class="nav-buttons">
          <button class="btn btn-secondary" onclick="navigateTo('home')">← Back Home</button>
        </div>
      </div>
      
      <h2 class="page-title">📸 Transform Your Image</h2>
      <p class="page-subtitle">Upload a photo and describe how AI should change it</p>
      
      <div class="two-column">
        <div>
          <div class="card">
            <div class="form-group">
              <label>Upload Your Image</label>
              <div class="dropzone" id="dropzone">
                <span class="dropzone-icon">📸</span>
                <p class="dropzone-text">Click or drag your image here</p>
              </div>
              <img id="imagePreview" class="preview-image" style="display: none;">
            </div>
            
            <div class="form-group">
              <label>What should I change?</label>
              <textarea id="editPrompt" placeholder="Examples:\n- Add a beautiful red saree with golden embroidery\n- Make the background a magical garden\n- Add glowing effects and make it cinematic\n- Change the lighting to golden sunset\n- Make the style more cinematic and detailed"></textarea>
            </div>
            
            <div class="form-group">
              <label>Quality Level</label>
              <select id="qualitySelect">
                <option value="professional">Professional</option>
                <option value="cinematic">Cinematic</option>
                <option value="artistic">Artistic</option>
                <option value="realistic">Realistic</option>
              </select>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" id="transformBtn">
              🎭 Transform Image
            </button>
          </div>
        </div>
        
        <div>
          <div class="result-area" id="resultArea" style="display: none;">
            <div id="resultContent"></div>
          </div>
          <div id="placeholderArea" class="card" style="text-align: center; height: 400px; display: flex; align-items: center; justify-content: center;">
            <div>
              <div style="font-size: 64px; margin-bottom: 16px;">🎭</div>
              <p style="color: var(--text-secondary);">Transformed image will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(mainDiv);
  setupImageEditor(container, mainDiv);
}

function setupImageEditor(container, mainDiv) {
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
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage = e.target.result;
      mainDiv.querySelector('#imagePreview').src = selectedImage;
      mainDiv.querySelector('#imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  
  mainDiv.querySelector('#transformBtn').addEventListener('click', async () => {
    if (!selectedImage) {
      alert('Please upload an image first!');
      return;
    }
    
    const editPrompt = mainDiv.querySelector('#editPrompt').value.trim();
    const quality = mainDiv.querySelector('#qualitySelect').value;
    
    if (!editPrompt) {
      alert('Please describe what you want to change!');
      return;
    }
    
    const fullPrompt = `Transform this image: ${editPrompt}, ${quality} quality, highly detailed, professional`;
    const btn = mainDiv.querySelector('#transformBtn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin-right: 10px; display: inline-block;"></div>Transforming...';
    
    const resultArea = mainDiv.querySelector('#resultArea');
    const placeholderArea = mainDiv.querySelector('#placeholderArea');
    placeholderArea.style.display = 'none';
    resultArea.style.display = 'block';
    const resultContent = mainDiv.querySelector('#resultContent');
    resultContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Applying your transformations...</p></div>';
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          referenceImage: selectedImage,
          useReference: true
        })
      });
      
      if (!response.ok) throw new Error('Transformation failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      resultContent.innerHTML = `
        <img src="${url}" class="result-image" alt="Transformed image">
        <button class="btn btn-primary" onclick="{
          const a = document.createElement('a');
          a.href = '${url}';
          a.download = 'dreamdrop-transformed-' + Date.now() + '.png';
          a.click();
        }">⬇️ Download</button>
      `;
    } catch (error) {
      resultContent.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '🎭 Transform Image';
    }
  });
}
