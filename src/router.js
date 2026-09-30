import { renderHome } from './pages/home.js';
import { renderTextToImage } from './pages/text-to-image.js';
import { renderImageEditor } from './pages/image-editor.js';

const app = document.getElementById('app');
let currentPage = 'home';

function navigateTo(page) {
  currentPage = page;
  app.innerHTML = '';
  
  switch(page) {
    case 'home':
      renderHome(app);
      break;
    case 'text-to-image':
      renderTextToImage(app);
      break;
    case 'image-editor':
      renderImageEditor(app);
      break;
    default:
      renderHome(app);
  }
  
  window.scrollTo(0, 0);
}

window.navigateTo = navigateTo;
navigated = 'home';
