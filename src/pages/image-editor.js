export function renderImageEditor(container) {
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
      
      <h2 class="page-title">📸 Edit Image with AI</h2>
      <p class="page-subtitle">Upload an image and tell AI what to transform</p>
      
      <div class="card">
        <div class="form-group">
          <label>Upload Your Image</label>
          <div class="dropzone" id="dropzone">
            <span class="dropzone-icon">📸</span>
            <p class="dropzone-text">Click or drag your image here</p>
          </div>
          <img id="imagePreview" class="preview-image" hidden>
        </div>
        
        <div class="form-group">
          <label>What to Change? (Be Specific!)</label>
          <textarea id="editPrompt" placeholder="Example: Add a beautiful red saree to this person, make the background a golden garden, add glowing effects"></textarea>
        </div>
        
        <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" id="editBtn">
          ✨ Transform Image
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
    if (!file) {
      alert('Please select an image!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage = e.target.result;
      container.querySelector('#imagePreview').src = selectedImage;
      container.querySelector('#imagePreview').hidden = false;
    };
    reader.readAsDataURL(file);
  }
  
  container.querySelector('#editBtn').addEventListener('click', async () => {
    if (!selectedImage) {
      alert('Please upload an image first!');
      return;
    }
    
    const editPrompt = container.querySelector('#editPrompt').value.trim();
    if (!editPrompt) {
      alert('Please tell me what to change!');
      return;
    }
    
    const btn = container.querySelector('#editBtn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="display: inline-block; margin-right: 10px;"></div>Transforming...';
    
    const resultArea = container.querySelector('#resultArea');
    const resultContent = container.querySelector('#resultContent');
    resultArea.style.display = 'block';
    resultContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Applying your transformations...</p></div>';
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt,
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
          a.download = 'dreamdrop-edited-' + Date.now() + '.png';
          a.click();
        }">⬇️ Download</button>
      `;
    } catch (error) {
      resultContent.innerHTML = `<div class="error">❌ ${error.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '✨ Transform Image';
    }
  });
}