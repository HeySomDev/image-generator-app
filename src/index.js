import { renderHome } from './pages/home.js';
import { renderTextToImage } from './pages/text-to-image.js';
import { renderImageEditor } from './pages/image-editor.js';

const app = document.getElementById('app');
let currentPage = 'home';

window.navigateTo = function(page) {
  currentPage = page;
  app.innerHTML = '';
  
  const orbs = `
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>
  `;
  
  switch(page) {
    case 'home':
      app.innerHTML = orbs;
      renderHome(app);
      break;
    case 'text-to-image':
      app.innerHTML = orbs;
      renderTextToImage(app);
      break;
    case 'image-editor':
      app.innerHTML = orbs;
      renderImageEditor(app);
      break;
    default:
      app.innerHTML = orbs;
      renderHome(app);
  }
  
  window.scrollTo(0, 0);
};

window.navigateTo('home');
