// main.js — binds data to UI and handles interactions
import { openLightbox } from './lightbox.js';

const els = {
  navToggle: document.getElementById('navToggle'),
  primaryNav: document.getElementById('primaryNav'),
  themeToggle: document.getElementById('themeToggle'),
  basicInfo: document.getElementById('basicInfo'),
  abilitiesList: document.getElementById('abilitiesList'),
  timelineList: document.getElementById('timelineList'),
  relationshipsGrid: document.getElementById('relationshipsGrid'),
  quotesWrap: document.getElementById('quotesWrap'),
  galleryGrid: document.getElementById('galleryGrid'),
};

// Basic nav toggle
els.navToggle?.addEventListener('click', () => {
  const open = els.primaryNav.classList.toggle('open');
  els.navToggle.setAttribute('aria-expanded', String(open));
});

// Theme toggle
const THEME_KEY = 'obito-theme';
function applyTheme(theme){
  if(theme === 'light'){
    document.documentElement.style.setProperty('--bg', '#f6f7fb');
    document.documentElement.style.setProperty('--surface', '#ffffff');
    document.documentElement.style.setProperty('--text', '#0e1016');
    document.documentElement.style.setProperty('--muted', '#4c5568');
    document.documentElement.style.setProperty('--card', '#ffffff');
    document.body.style.background = 'radial-gradient(1600px 800px at 80% -10%, rgba(194,31,57,0.12), transparent 60%), var(--bg)';
  }else{
    // reset to dark via CSS variables default
    document.documentElement.style.cssText = '';
  }
}
els.themeToggle.addEventListener('click', () => {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});
applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

// Data loading
async function loadData(){
  const res = await fetch('./data/obito.json');
  const data = await res.json();
  return data;
}

function renderBasicInfo(info){
  const items = [
    { label: 'Full Name', value: info.fullName },
    { label: 'Aliases', value: info.aliases.join(', ') },
    { label: 'Affiliations', value: info.affiliations.join(', ') },
    { label: 'Occupation', value: info.occupation },
    { label: 'Clan', value: info.clan },
    { label: 'First Appearance', value: info.firstAppearance },
  ];

  els.basicInfo.innerHTML = items.map(it => `
    <article class="card">
      <h3>${it.label}</h3>
      <p>${it.value}</p>
    </article>
  `).join('');
}

function renderAbilities(abilities){
  els.abilitiesList.innerHTML = abilities.map(a => `
    <li class="card">
      <h3>${a.name}</h3>
      <p>${a.description}</p>
      ${a.tags?.length ? `<div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">${a.tags.map(t=>`<span class="pill">${t}</span>`).join('')}</div>` : ''}
    </li>
  `).join('');
}

function renderTimeline(timeline){
  els.timelineList.innerHTML = timeline.map(step => `
    <li>
      <strong>${step.title}</strong><br/>
      <span class="muted">${step.summary}</span>
    </li>
  `).join('');
}

function renderRelationships(rel){
  els.relationshipsGrid.innerHTML = rel.map(r => `
    <article class="card rel-card">
      <h3>${r.name}</h3>
      <div class="meta">${r.role}</div>
      <p style="margin-top:8px;">${r.description}</p>
    </article>
  `).join('');
}

function renderQuotes(quotes){
  els.quotesWrap.innerHTML = quotes.map(q => `
    <blockquote class="quote">“${q.text}”<cite>— ${q.context}</cite></blockquote>
  `).join('');
}

function renderGallery(items){
  els.galleryGrid.innerHTML = items.map((g, idx) => `
    <figure class="gallery-card" role="button" tabindex="0" data-idx="${idx}">
      <img src="${g.src}" alt="${g.alt}"/>
      <figcaption class="caption">${g.caption}</figcaption>
    </figure>
  `).join('');

  els.galleryGrid.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = Number(card.getAttribute('data-idx'));
      openLightbox(items[idx].src, items[idx].alt, items[idx].caption);
    });
    card.addEventListener('keypress', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        const idx = Number(card.getAttribute('data-idx'));
        openLightbox(items[idx].src, items[idx].alt, items[idx].caption);
      }
    });
  });
}

loadData().then(data => {
  renderBasicInfo(data.basicInfo);
  renderAbilities(data.abilities);
  renderTimeline(data.timeline);
  renderRelationships(data.relationships);
  renderQuotes(data.quotes);
  renderGallery(data.gallery);
});
