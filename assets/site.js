/* hi.iam.wijangi.ng
   Loads the Markdown files in /content and turns them into the page.
   You should not need to edit this file. Edit the .md files instead. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme (day / night) ---------- */
  var btn = document.getElementById('theme');
  function setTheme(t, save) {
    root.setAttribute('data-theme', t);
    if (btn) {
      btn.textContent = t === 'dark' ? '☀ day' : '☾ night';
      btn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'day' : 'night') + ' mode');
    }
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  setTheme(root.getAttribute('data-theme') || 'light', false);
  if (btn) btn.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* ---------- markdown helpers ---------- */
  function medalClass(text) {
    var t = text.toLowerCase();
    if (/gold/.test(t)) return 'gold';
    if (/silver/.test(t)) return 'silver';
    if (/bronze|rank 3\b/.test(t)) return 'bronze';
    if (/rank|sapphire|published|solver|award/.test(t)) return 'star';
    return '';
  }

  function placeholder(img) {
    var box = document.createElement('div');
    box.className = 'ph';
    var file = (img.getAttribute('src') || '').split('?')[0];
    box.innerHTML = '<span class="ph-plus">+</span><span class="ph-t">photo goes here</span><code></code>';
    box.querySelector('code').textContent = file;
    img.replaceWith(box);
  }

  function decorate(el) {
    /* photos: every image becomes a taped polaroid, the alt text is the caption */
    var tilt = 0;
    el.querySelectorAll('img').forEach(function (img) {
      var fig = document.createElement('figure');
      fig.className = 'polaroid tilt' + (tilt++ % 4);
      var cap = document.createElement('figcaption');
      cap.textContent = img.getAttribute('alt') || '';
      img.replaceWith(fig);
      fig.appendChild(img);
      fig.appendChild(cap);
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.title = 'Click to see it bigger';
      if (img.complete && img.naturalWidth === 0) placeholder(img);
      else img.addEventListener('error', function () { placeholder(img); });
    });
    /* a paragraph that only holds photos becomes a photo row */
    el.querySelectorAll('p').forEach(function (p) {
      var onlyPhotos = p.querySelector('.polaroid') && Array.prototype.every.call(p.childNodes, function (n) {
        return n.nodeType === 1 ? (n.classList.contains('polaroid') || n.tagName === 'BR') : !n.textContent.trim();
      });
      if (onlyPhotos) {
        var row = document.createElement('div');
        row.className = 'photos';
        while (p.firstChild) row.appendChild(p.firstChild);
        p.replaceWith(row);
      }
    });
    /* tables: scroll on small screens, colour the result in the last column */
    el.querySelectorAll('table').forEach(function (t) {
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      t.replaceWith(wrap);
      wrap.appendChild(t);
      t.querySelectorAll('tbody tr').forEach(function (tr) {
        var last = tr.lastElementChild;
        if (!last) return;
        var c = medalClass(last.textContent);
        last.innerHTML = '<span class="result ' + c + '">' + last.innerHTML + '</span>';
      });
    });
    /* links to other websites open in a new tab */
    el.querySelectorAll('a[href^="http"]').forEach(function (a) {
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  function load(el, file) {
    return fetch(file, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (md) {
        el.innerHTML = window.marked.parse(md);
        decorate(el);
        el.classList.add('ready');
      })
      .catch(function () {
        el.innerHTML = '<p class="oops">Could not load <code>' + file + '</code>. Check the file name.</p>';
      });
  }

  /* ---------- click a photo to see it big ---------- */
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo');
  box.innerHTML = '<button type="button" class="lb-close" aria-label="Close">×</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(box);
  var lastFocus = null;

  function openPhoto(img) {
    var fig = img.closest('.polaroid');
    var cap = fig ? fig.querySelector('figcaption').textContent : '';
    box.querySelector('img').src = img.currentSrc || img.src;
    box.querySelector('img').alt = cap;
    box.querySelector('figcaption').textContent = cap;
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add('lb-open');
    box.querySelector('.lb-close').focus();
  }
  function closePhoto() {
    if (box.hidden) return;
    box.hidden = true;
    document.body.classList.remove('lb-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function photoFrom(e) {
    var t = e.target;
    return t && t.tagName === 'IMG' && t.closest('.polaroid') && !t.closest('.lightbox') ? t : null;
  }
  document.addEventListener('click', function (e) {
    var img = photoFrom(e);
    if (img) openPhoto(img);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') return closePhoto();
    if ((e.key === 'Enter' || e.key === ' ') && photoFrom(e)) { e.preventDefault(); openPhoto(e.target); }
  });
  box.addEventListener('click', closePhoto);

  /* ---------- home page: every element with data-md ---------- */
  var jobs = [];
  document.querySelectorAll('[data-md]').forEach(function (el) {
    jobs.push(load(el, el.getAttribute('data-md')));
  });

  /* ---------- extra pages: page.html?p=name loads content/pages/name.md ---------- */
  var page = document.getElementById('page');
  if (page) {
    var name = (new URLSearchParams(location.search).get('p') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!name) name = 'record';
    jobs.push(load(page, 'content/pages/' + name + '.md').then(function () {
      var h = page.querySelector('h1');
      if (h) document.title = h.textContent + ' · Wijanging';
    }));
  }

  /* after everything is in place, jump to the #section in the address if there is one */
  Promise.all(jobs).then(function () {
    if (location.hash.length > 1) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  });
})();
