// lightbox.js — simple accessible lightbox
export function openLightbox(src, alt, caption){
  let lb = document.getElementById('lightbox');
  if(!lb){
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-content" role="document">
        <button class="lb-close" aria-label="Close">✕</button>
        <img class="lb-img" alt=""/>
        <div class="lb-cap"></div>
      </div>
    `;
    document.body.appendChild(lb);

    const style = document.createElement('style');
    style.textContent = `
      #lightbox{ position:fixed; inset:0; display:none; place-items:center; }
      #lightbox.open{ display:grid; }
      .lb-backdrop{ position:absolute; inset:0; background:rgba(0,0,0,.7); backdrop-filter: blur(2px); }
      .lb-content{ position:relative; z-index:2; max-width:min(92vw, 960px); max-height:86vh; background:var(--card); border:1px solid rgba(255,255,255,.1); border-radius:16px; padding:12px; }
      .lb-img{ max-width:100%; max-height:70vh; display:block; border-radius:12px; }
      .lb-cap{ color:var(--muted); margin-top:8px; text-align:center; }
      .lb-close{ position:absolute; top:8px; right:8px; border:1px solid rgba(255,255,255,.2); background:transparent; color:inherit; border-radius:10px; padding:6px 10px; cursor:pointer; }
    `;
    document.head.appendChild(style);

    lb.querySelector('.lb-backdrop').addEventListener('click', close);
    lb.querySelector('.lb-close').addEventListener('click', close);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
  }
  lb.querySelector('.lb-img').src = src;
  lb.querySelector('.lb-img').alt = alt;
  lb.querySelector('.lb-cap').textContent = caption;
  lb.classList.add('open');
  lb.querySelector('.lb-close').focus();

  function close(){
    lb.classList.remove('open');
  }
}
