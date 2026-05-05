import { CURRICULUM_DATA, SUBJECTS_LIST } from './constants.js';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initScrollNavbar();
  handleRouting();
  initAudio();
});

window.addEventListener('hashchange', () => {
  closePreview();
  handleRouting();
});

// --- Audio Logic ---
let buttonSound, exitSound;

function initAudio() {
  buttonSound = new Audio('./SFX/CLICK.mp3');
  exitSound = new Audio('./SFX/EXIT.mp3');

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, [role="button"]');
    if (!target) return;

    // Check if it's a back/exit button
    const isExit = target.innerText.toLowerCase().includes('back') || 
                   target.innerText.toLowerCase().includes('exit') ||
                   target.querySelector('[data-lucide="arrow-left"]');
    
    if (isExit) {
      exitSound.currentTime = 0;
      exitSound.play().catch(() => {});
    } else {
      buttonSound.currentTime = 0;
      buttonSound.play().catch(() => {});
    }
  });
}

// --- Lenis Smooth Scroll ---
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// --- Navbar Logic ---
function initScrollNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('glass', 'py-4', 'border-b', 'border-white/10');
      navbar.classList.remove('py-6');
    } else {
      navbar.classList.remove('glass', 'py-4', 'border-b', 'border-white/10');
      navbar.classList.add('py-6');
    }
  });
}

// --- Preview Modal ---
window.openPreview = (url, title) => {
  const modal = document.getElementById('preview-modal');
  const iframe = document.getElementById('preview-iframe');
  const previewTitle = document.getElementById('preview-title');
  const previewExternal = document.getElementById('preview-external');
  const loader = document.getElementById('preview-loader');

  // Convert drive links to preview type if possible
  let previewUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    previewUrl = url.replace('/view', '/preview').replace('/edit', '/preview');
  }

  previewTitle.innerText = title;
  previewExternal.href = url;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  // Reset scroll
  document.body.style.overflow = 'hidden';
  
  loader.style.display = 'flex';
  iframe.src = previewUrl;
  
  iframe.onload = () => {
    loader.style.display = 'none';
  };
};

window.closePreview = () => {
  const modal = document.getElementById('preview-modal');
  const iframe = document.getElementById('preview-iframe');
  
  modal.classList.remove('flex');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  iframe.src = '';
};

// --- Routing ---
function handleRouting() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');
  app.innerHTML = ''; // Clear current content

  // Simple route matching
  if (hash === '#/') renderHome();
  else if (hash === '#/subjects') renderSubjects();
  else if (hash.startsWith('#/subjects/')) {
    const parts = hash.split('/');
    const subjectId = parts[2];
    const section = parts[3] || 'notes';
    renderSubjectExplorer(subjectId, section);
  }
  else if (hash.startsWith('#/notes/')) {
    const parts = hash.split('/');
    const subjectId = parts[2];
    const chapterId = parts[3];
    const subChapterId = parts[4];
    renderNotesPage(subjectId, chapterId, subChapterId);
  }
  else render404();

  // Re-run lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Active Link logic
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const target = link.getAttribute('data-nav-link');
    if (hash === `#${target}` || (target !== '/' && hash.startsWith(`#${target}`))) {
      link.classList.add('bg-brand-accent/20', 'text-brand-accent');
    } else {
      link.classList.remove('bg-brand-accent/20', 'text-brand-accent');
    }
  });

  window.scrollTo(0, 0);
}

// --- Page Renderers ---

function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Hero Section -->
    <section class="min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[20%] left-[10%] w-96 h-96 bg-brand-accent/10 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[20%] right-[10%] w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full"></div>
      </div>
      
      <div class="max-w-7xl mx-auto w-full relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span class="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          <span class="text-xs font-medium uppercase tracking-widest text-white/60">The Future of Education is Here</span>
        </div>
        
        <h1 class="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-tight">
          SKILL<span class="text-gradient">POINT</span>
        </h1>
        
        <p class="max-w-2xl mx-auto text-xl text-white/40 mb-4 leading-relaxed">
          A private repository for high-yield IGCSE & A-Level notes and academic resources.
        </p>
        <p class="text-xs font-mono text-brand-accent/40 mb-12">
          Note: This is a private repository and is not to be shared ;)
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="#/subjects" class="px-8 py-4 bg-brand-accent text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,255,136,0.2)]">
            Explore Subjects <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </a>
          <button class="px-8 py-4 glass rounded-full font-bold hover:bg-white/10 transition-colors">
            Our Methods
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-32 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="relative">
          <div class="aspect-square relative flex items-center justify-center p-12">
            <div class="absolute inset-0 border border-white/10 rounded-[4rem] rotate-6"></div>
            <div class="absolute inset-0 border border-brand-accent/20 rounded-[4rem] -rotate-3"></div>
            <div class="w-full h-full glass rounded-[4rem] flex items-center justify-center relative overflow-hidden">
               <div class="text-center p-8">
                  <i data-lucide="zap" class="w-24 h-24 text-brand-accent mx-auto mb-6 opacity-20"></i>
                  <h3 class="text-3xl font-bold mb-4 italic font-serif text-white/80">"Education is not the learning of facts, but the training of the mind."</h3>
                  <div class="text-sm font-mono tracking-widest text-brand-accent uppercase">Albert Einstein</div>
               </div>
            </div>
          </div>
        </div>
        
        <div>
          <span class="text-brand-accent font-mono text-sm uppercase tracking-[0.3em] mb-4 block">Our Philosophy</span>
          <h2 class="text-5xl font-bold mb-8 tracking-tight">Active Learning, <br/>Passive <span class="text-gradient">Distraction.</span></h2>
          <p class="text-xl text-white/50 mb-12 leading-relaxed">
            SkillPoint is a curated repository for notes designed for maximum extraction. We distill complex syllabi into actionable knowledge through a private, high-contrast visual architecture.
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div class="flex items-start gap-4 p-6 glass rounded-2xl border-white/5">
              <i data-lucide="check-circle-2" class="text-brand-accent w-6 h-6 mt-1"></i>
              <div>
                <h4 class="font-bold mb-2 uppercase text-xs tracking-widest">Efficiency</h4>
                <p class="text-sm text-white/40">Compressed data points for 3x faster revision.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-6 glass rounded-2xl border-white/5">
              <i data-lucide="zap" class="text-brand-accent w-6 h-6 mt-1"></i>
              <div>
                <h4 class="font-bold mb-2 uppercase text-xs tracking-widest">Precision</h4>
                <p class="text-sm text-white/40">Targeted towards specific exam board patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 px-6">
      <div class="max-w-5xl mx-auto py-20 px-8 glass rounded-[3rem] text-center relative overflow-hidden border border-white/10">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50"></div>
        <i data-lucide="graduation-cap" class="w-20 h-20 text-brand-accent mx-auto mb-8 animate-bounce"></i>
        <h2 class="text-5xl md:text-7xl font-bold mb-8 tracking-tighter italic font-serif">Ready to Level Up?</h2>
        <p class="text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of students who have already transformed their learning journey. All resources are free, forever.
        </p>
        <a href="#/subjects" class="px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-brand-accent transition-colors shadow-2xl">
          Get Started Now
        </a>
      </div>
    </section>
  `;
  
  // Animate elements with GSAP
  gsap.from('h1', { y: 100, opacity: 0, duration: 1.5, ease: 'power4.out', delay: 0.2 });
  gsap.from('p', { y: 50, opacity: 0, duration: 1.5, ease: 'power4.out', delay: 0.4 });
}

function renderSubjects() {
  const app = document.getElementById('app');
  
  // Separate subjects by category
  const categories = {
    'IGCSE': SUBJECTS_LIST.filter(s => s.category === 'IGCSE'),
    'A-Level': SUBJECTS_LIST.filter(s => s.category === 'A-Level')
  };

  app.innerHTML = `
    <div class="min-h-screen pt-32 pb-20 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-16">
          <span class="text-brand-accent font-mono text-sm uppercase tracking-[0.3em] mb-4 block">Knowledge Base</span>
          <h1 class="text-6xl font-bold tracking-tighter">Subject <span class="text-gradient">Explorer</span></h1>
        </div>

        ${Object.keys(categories).map(cat => `
          <div class="mb-20">
            <h2 class="text-3xl font-bold mb-10 flex items-center gap-4 text-white/40 italic font-serif">
              <span class="w-12 h-[1px] bg-white/10"></span> ${cat}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${categories[cat].map(subject => `
                <a href="#/subjects/${subject.id}" 
                   class="group p-8 glass rounded-3xl border border-white/5 hover:border-brand-accent/50 transition-all duration-500 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-3xl group-hover:bg-brand-accent/10 transition-all"></div>
                  
                  <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10">
                    <i data-lucide="${subject.icon}" class="text-brand-accent w-8 h-8"></i>
                  </div>

                  <div>
                    <span class="text-xs font-mono text-brand-accent/60 uppercase tracking-widest mb-2 block">${subject.category} • ${subject.code}</span>
                    <h3 class="text-3xl font-bold mb-4">${subject.title}</h3>
                    <div class="flex items-center gap-2 text-white/30 text-sm font-medium">
                      Explore Resources <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-2 transition-transform"></i>
                    </div>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSubjectExplorer(subjectId, section) {
  const subject = CURRICULUM_DATA[subjectId];
  const app = document.getElementById('app');

  if (!subject) {
    render404();
    return;
  }

  const sections = [
    { id: 'notes', label: 'Revision Notes', icon: 'file-text' },
    { id: 'topical', label: 'Topical Questions', icon: 'help-circle' },
    { id: 'textbooks', label: 'Textbooks', icon: 'book' },
    { id: 'resources', label: 'Resources', icon: 'link' }
  ];

  app.innerHTML = `
    <div class="min-h-screen pt-32 pb-20 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Explorer Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <a href="#/subjects" class="inline-flex items-center gap-2 text-white/30 hover:text-brand-accent transition-colors mb-6 group">
              <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> Back to all subjects
            </a>
            <div class="flex items-center gap-4 mb-4">
               <span class="px-3 py-1 bg-brand-accent/10 text-brand-accent text-xs font-mono border border-brand-accent/20 rounded-full">${subject.category}</span>
               <span class="text-white/30 font-mono text-xs">${subject.code}</span>
            </div>
            <h1 class="text-7xl font-bold tracking-tighter">${subject.title}</h1>
          </div>
        </div>

        <!-- Explorer Navigation -->
        <div class="flex flex-wrap gap-2 p-1 glass rounded-2xl mb-12 w-fit">
          ${sections.map(s => `
            <a href="#/subjects/${subjectId}/${s.id}" 
               class="px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${section === s.id ? 'bg-brand-accent text-black scale-105 shadow-xl' : 'hover:bg-white/5 text-white/40'}">
              <i data-lucide="${s.icon}" class="w-4 h-4"></i> ${s.label}
            </a>
          `).join('')}
        </div>

        <!-- Section Content -->
        <div id="explorer-content" class="min-h-[400px]">
           ${renderSectionContent(subject, section)}
        </div>
      </div>
    </div>
  `;
}

function renderSectionContent(subject, section) {
  switch (section) {
    case 'notes':
      let html = '';
      
      // Handle discrete subchapters (IGCSE style)
      if (subject.notes && subject.notes.length > 0) {
        html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
        html += subject.notes.map(chapter => `
          <div class="glass rounded-3xl p-8 border border-white/5">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <i data-lucide="folder" class="text-brand-accent w-6 h-6"></i> ${chapter.title}
            </h3>
            <div class="space-y-4">
              ${chapter.subChapters.map(sub => `
                <a href="#/notes/${subject.id}/${chapter.id}/${sub.id}" 
                   class="group flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 hover:translate-x-2 transition-all border border-transparent hover:border-white/10">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <i data-lucide="file-text" class="w-5 h-5"></i>
                    </div>
                    <span class="font-medium text-white/80">${sub.title}</span>
                  </div>
                  <i data-lucide="chevron-right" class="w-5 h-5 text-white/20 group-hover:text-brand-accent"></i>
                </a>
              `).join('')}
            </div>
          </div>
        `).join('');
        html += `</div>`;
      }
      
      // Handle resource-based notes (A-Level style)
      if (subject.noteResources && subject.noteResources.length > 0) {
        const categories = [...new Set(subject.noteResources.map(r => r.category))];
        html += categories.map(cat => `
          <div class="mb-16">
            <h3 class="text-2xl font-bold mb-8 flex items-center gap-3 text-white/40 uppercase tracking-widest font-mono">
              <i data-lucide="folder" class="w-5 h-5"></i> ${cat}
            </h3>
            <div class="space-y-3">
              ${subject.noteResources.filter(r => r.category === cat).map(res => `
                <button onclick="openPreview('${res.url}', '${res.title}')" 
                   class="w-full flex items-center justify-between p-5 glass rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all group text-left">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i data-lucide="file-text" class="text-brand-accent w-6 h-6"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-lg text-white/90 group-hover:text-brand-accent transition-colors">${res.title}</h4>
                      <span class="text-xs text-white/30 uppercase tracking-tighter">${res.type || 'Resource'}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-white/20 group-hover:text-white/40 transition-colors hidden sm:block">Preview Document</span>
                    <i data-lucide="maximize-2" class="w-5 h-5 text-white/20 group-hover:text-brand-accent transition-all group-hover:scale-110"></i>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        `).join('');
      }
      
      return html || renderEmptyState('No notes available yet.');

    case 'topical':
      if (subject.topicalQuestions && subject.topicalQuestions.length > 0) {
        const categories = [...new Set(subject.topicalQuestions.map(r => r.category))];
        return categories.map(cat => `
          <div class="mb-16">
            <h3 class="text-xl font-bold mb-8 flex items-center gap-3 text-white/30 uppercase tracking-widest font-mono">
              <span class="w-8 h-[1px] bg-white/10"></span> ${cat}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${subject.topicalQuestions.filter(r => r.category === cat).map(res => `
                <button onclick="openPreview('${res.url}', '${res.title}')" 
                   class="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all group text-left">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors">
                      <i data-lucide="help-circle" class="text-brand-accent/60 w-5 h-5 group-hover:text-brand-accent transition-colors"></i>
                    </div>
                    <span class="font-bold text-white/80 group-hover:text-white transition-colors">${res.title}</span>
                  </div>
                  <i data-lucide="eye" class="w-4 h-4 text-white/20 group-hover:text-brand-accent"></i>
                </button>
              `).join('')}
            </div>
          </div>
        `).join('');
      }
      return renderEmptyState('Topical questions coming soon.');

    case 'textbooks':
      if (subject.textbooks && subject.textbooks.length > 0) {
        return `
          <div class="space-y-4">
            ${subject.textbooks.map(book => `
              <button onclick="openPreview('${book.url}', '${book.title}')" 
                 class="w-full flex flex-col md:flex-row md:items-center justify-between p-6 glass rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all group gap-6 text-left">
                <div class="flex items-center gap-6">
                  <div class="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <i data-lucide="book" class="text-brand-accent w-8 h-8"></i>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">${book.title}</h3>
                    <p class="text-white/40 text-sm italic font-serif">${book.description || ''}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-white/40 group-hover:bg-brand-accent group-hover:text-black transition-all">
                    Open Preview
                  </div>
                  <i data-lucide="maximize-2" class="w-6 h-6 text-white/20 group-hover:text-brand-accent group-hover:scale-110 transition-all"></i>
                </div>
              </button>
            `).join('')}
          </div>
        `;
      }
      return renderEmptyState('No textbooks available.');

    case 'resources':
      if (subject.resources && subject.resources.length > 0) {
        return `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${subject.resources.map(res => `
              <a href="${res.url}" download
                 class="p-8 glass rounded-3xl border border-white/5 hover:border-brand-accent/30 transition-all group flex items-center justify-between">
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i data-lucide="${res.type === 'xlsx' ? 'table' : 'file'}" class="text-brand-accent w-8 h-8"></i>
                  </div>
                  <div>
                    <h4 class="text-xl font-bold mb-1">${res.title}</h4>
                    <span class="text-xs text-brand-accent font-mono uppercase tracking-widest">${res.type || 'Resource'} File</span>
                  </div>
                </div>
                <i data-lucide="download" class="w-6 h-6 text-white/20 group-hover:text-brand-accent transition-all"></i>
              </a>
            `).join('')}
          </div>
        `;
      }
      return renderEmptyState('Learning resources are being curated.');

    default:
      return '';
  }
}

function renderEmptyState(message) {
  return `
    <div class="flex flex-col items-center justify-center py-32 text-center glass rounded-[3rem] border-dashed border-2 border-white/10">
      <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 opacity-20">
        <i data-lucide="help-circle" class="w-10 h-10"></i>
      </div>
      <p class="text-white/30 text-xl italic font-serif">${message}</p>
    </div>
  `;
}

function renderNotesPage(subjectId, chapterId, subChapterId) {
  const subject = CURRICULUM_DATA[subjectId];
  const chapter = subject?.notes.find(c => c.id === chapterId);
  const subChapter = chapter?.subChapters.find(s => s.id === subChapterId);
  const app = document.getElementById('app');

  if (!subject || !chapter || !subChapter) {
    render404();
    return;
  }

  app.innerHTML = `
    <div class="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div class="mb-12">
        <a href="#/subjects/${subjectId}/notes" 
           class="inline-flex items-center gap-2 text-white/40 hover:text-brand-accent transition-colors mb-8 group">
          <i data-lucide="arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></i> Back to Notes
        </a>
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span class="text-brand-accent font-mono text-sm uppercase tracking-widest mb-2 block">
              ${chapter.title}
            </span>
            <h1 class="text-5xl font-bold tracking-tighter">${subChapter.title}</h1>
          </div>
          
          <a href="${subChapter.downloadUrl}"
             class="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-brand-accent transition-colors shadow-xl">
            <i data-lucide="download" class="w-5 h-5"></i> Download PDF
          </a>
        </div>
      </div>

      <div class="glass rounded-[2rem] p-8 md:p-12 min-h-[400px]">
        <div class="flex items-center gap-3 mb-12 text-white/30">
          <i data-lucide="file-text" class="w-6 h-6"></i>
          <span class="text-sm font-medium uppercase tracking-widest">Revision Notes</span>
        </div>
        
        <div class="prose prose-invert max-w-none space-y-12">
           ${subChapter.content.map(block => {
             if (block.type === 'heading') return `<h2 class="text-3xl font-bold text-white tracking-tight mt-12 mb-6">${block.content}</h2>`;
             if (block.type === 'text') return `<p class="text-xl text-white/70 leading-relaxed">${block.content}</p>`;
             if (block.type === 'image') return `
                <figure class="group">
                  <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                    <img src="${block.url}" alt="${block.caption || ''}" class="w-full h-auto select-none" referrerPolicy="no-referrer">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                  ${block.caption ? `<figcaption class="mt-4 text-sm text-white/40 italic text-center font-serif">${block.caption}</figcaption>` : ''}
                </figure>
             `;
             return '';
           }).join('')}

           <div class="mt-20 pt-12 border-t border-white/5 space-y-6">
            <h3 class="text-2xl font-bold text-white">Key Concepts</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-4">
                <div class="w-2 h-2 rounded-full bg-brand-accent mt-2"></div>
                <p class="text-white/60">Comprehensive coverage of the syllabus requirements for this topic.</p>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-2 h-2 rounded-full bg-brand-accent mt-2"></div>
                <p class="text-white/60">Step-by-step explanations of complex concepts.</p>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-2 h-2 rounded-full bg-brand-accent mt-2"></div>
                <p class="text-white/60">Important formulas and units highlighted for quick revision.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function render404() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-brand-accent mb-4">404</h1>
        <p class="text-2xl text-white/40 mb-8 font-serif italic">The page you're looking for has vanished into thin air.</p>
        <a href="#/" class="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-brand-accent transition-colors">Return Home</a>
      </div>
    </div>
  `;
}
