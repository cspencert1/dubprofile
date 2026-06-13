/* ============================================================
   DUB PROFILE — interactions + client-side rendering
   ============================================================ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

  /* ---------- global chrome ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const toggle = $('.nav-toggle');
  const menu = $('#nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', e => {
      if (e.target.closest('a')) { menu.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // reveal-on-scroll
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { threshold: 0.12 })
    : null;
  function observeReveals(root = document) {
    $$('[data-reveal]', root).forEach(el => io ? io.observe(el) : el.classList.add('in'));
  }
  observeReveals();

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- status tag helper ---------- */
  function statusTag(key, opts = {}) {
    const s = STATUS[key] || STATUS.locked;
    const txt = opts.compact ? s.label : s.label;
    return `<span class="status-tag ${s.cls}"><span class="dot"></span>${txt}</span>`;
  }

  /* ---------- reach-out modal ---------- */
  const modal = $('#modal');
  let modalContext = '';
  function openModal(ctx, subText) {
    modalContext = ctx || '';
    if (!modal) return;
    if (subText) { const sub = $('[data-modal-sub]', modal); if (sub) sub.textContent = subText; }
    modal.classList.add('open');
    const f = $('#m-from', modal); if (f) setTimeout(() => f.focus(), 50);
  }
  function closeModal() { modal && modal.classList.remove('open'); }
  if (modal) {
    $$('[data-close]', modal).forEach(b => b.addEventListener('click', closeModal));
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    const send = $('[data-send]', modal);
    if (send) send.addEventListener('click', () => {
      closeModal();
      toast(modalContext ? `Request sent to ${modalContext} ✓` : 'Request sent ✓');
      const msg = $('#m-msg', modal); if (msg) msg.value = '';
    });
    $$('.seg-toggle button', modal).forEach(b => b.addEventListener('click', () => {
      $$('.seg-toggle button', modal).forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    }));
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ============================================================
     PAGE: ATHLETE MASTER PROFILE
     ============================================================ */
  function renderAthlete() {
    const root = $('#profile-root');
    if (!root) return;
    const a = getAthlete(qp('id'));
    document.title = `${a.first} ${a.last} — Dub Profile`;
    const crumb = $('[data-crumb]'); if (crumb) crumb.textContent = `${a.first} ${a.last}`;

    const sportKeys = Object.keys(a.sports);
    // master status = strongest intent across sports (open > radar > locked)
    const order = { open: 3, radar: 2, locked: 1 };
    const topStatus = sportKeys.map(k => a.sports[k].status).sort((x, y) => order[y] - order[x])[0] || 'locked';

    const cards = sportKeys.map(key => {
      const sp = a.sports[key];
      const cfg = SPORTS[key] || { name: key, emoji: '🏅', grad: 'var(--panel)' };
      return `
        <a class="sportcard" href="sport.html?athlete=${esc(a.id)}&sport=${esc(key)}" data-reveal>
          <div class="sportcard-top" style="background:${cfg.grad}">
            <span>${cfg.emoji}</span>
            ${sp.favorite ? '<span class="sportcard-fav" title="Top sport">⭐</span>' : ''}
            <span class="sportcard-status">${statusTag(sp.status)}</span>
          </div>
          <div class="sportcard-body">
            <h3>${esc(cfg.name)}</h3>
            <div class="sportcard-line"><span class="lvl">${esc(sp.tier)}</span><span>·</span><span>${esc(sp.position)}</span><span>·</span><span>${esc(sp.level)}</span></div>
            <div class="sportcard-cta">View sport profile <span class="arrow">→</span></div>
          </div>
        </a>`;
    }).join('');

    root.innerHTML = `
      <div class="container profile-hero">
        <div class="profile-banner"><span class="watermark" aria-hidden="true">${esc(a.initials)}</span></div>
        <div class="profile-id">
          <div class="profile-avatar">${esc(a.initials)}</div>
          <div class="profile-id-main">
            <h1>${esc(a.first)} ${esc(a.last)}</h1>
            <div class="profile-id-meta">
              <span><b>Age ${a.age}</b></span><span>·</span>
              <span>Class of '${esc(String(a.grad).slice(-2))}</span><span>·</span>
              <span>${esc(a.city)}, ${esc(a.state)}</span><span>·</span>
              <span>${sportKeys.length} sport${sportKeys.length > 1 ? 's' : ''}</span>
            </div>
            <div style="margin-top:14px">${statusTag(topStatus)}</div>
            <p style="color:var(--muted);margin:14px 0 0;max-width:40em">${esc(a.tagline)}</p>
          </div>
          <div class="profile-id-actions">
            ${a.id === 'me'
              ? `<a class="btn btn-primary" href="create.html">Edit profile</a>`
              : `<button class="btn btn-primary" data-reach="${esc(a.first)} ${esc(a.last)}">Reach out</button>`}
            <button class="btn btn-outline" data-share>Share</button>
          </div>
        </div>

        <div class="section-label">Sports — tap to drill in</div>
        <div class="sport-grid">
          ${cards}
          <button class="addcard" data-add-sport><span class="plus">+</span><span>Add a sport</span></button>
        </div>

        <div class="section-label" style="margin-top:54px">About this profile</div>
        <div class="panel">
          <p style="margin:0;color:var(--muted)">
            This master profile links every sport ${esc(a.first)} plays. Each sport has its own page with
            stats, highlight reels, level, practice schedule, and an availability status — all managed by a parent.
            Coaches only see what the family chooses to share, and every reach-out is approved before contact details change hands.
          </p>
        </div>
      </div>`;

    observeReveals(root);
    wireReach(root);
    const add = $('[data-add-sport]', root);
    if (add) add.addEventListener('click', () => { location.href = 'create.html'; });
    const share = $('[data-share]', root);
    if (share) share.addEventListener('click', () => toast('Profile link copied to clipboard ✓'));
  }

  /* ============================================================
     PAGE: SPORT DETAIL
     ============================================================ */
  function renderSport() {
    const root = $('#sport-root');
    if (!root) return;
    const a = getAthlete(qp('athlete'));
    const key = qp('sport') || Object.keys(a.sports)[0];
    const sp = a.sports[key] || a.sports[Object.keys(a.sports)[0]];
    const cfg = SPORTS[key] || { name: key, emoji: '🏅', tiers: [] };

    document.title = `${a.first} ${a.last} — ${cfg.name} — Dub Profile`;
    const crumb = $('[data-crumb]'); if (crumb) crumb.textContent = `${cfg.name}`;
    $$('[data-back-link]').forEach(l => l.href = `athlete.html?id=${encodeURIComponent(a.id)}`);

    const stats = sp.stats.map(s => `
      <div class="stat ${s.accent ? 'accent' : ''}"><div class="v">${esc(s.v)}</div><div class="k">${esc(s.k)}</div></div>
    `).join('');

    const tiers = (cfg.tiers || []).map(t => `<span class="tier ${t === sp.tier ? 'on' : ''}">${esc(t)}</span>`).join('');

    const videos = sp.videos.length ? sp.videos.map((v, i) => `
      <button class="reel-item" data-video data-url="${esc(v.url || '')}" style="background:linear-gradient(150deg, hsl(${(i*70+200)%360} 60% 22%), #0c0f18)">
        <span class="play"><span class="tri"></span></span>
        <span class="cap">${esc(v.cap)}</span>${v.dur ? `<span class="dur">${esc(v.dur)}</span>` : ''}
      </button>`).join('')
      : `<p style="color:var(--muted);grid-column:1/-1;margin:0">No highlight videos added yet.</p>`;

    const photos = Array.from({ length: sp.photos }, (_, i) => `
      <div class="photo" style="background:linear-gradient(150deg, hsl(${(i*48+90)%360} 45% 24%), #0c0f18)">${['📸','🏟️','🔥'][i % 3]}</div>
    `).join('') || `<p style="color:var(--muted);grid-column:1/-1;margin:0">No photos yet.</p>`;

    const want = sp.practice.want; // 1..3
    const segs = [1,2,3].map(n => `<span class="seg ${n <= want ? 'on' : ''}"></span>`).join('');

    root.innerHTML = `
      <div class="sport-head" data-reveal>
        <div class="sport-title">
          <span class="sport-emoji">${cfg.emoji}</span>
          <div>
            <h1>${esc(cfg.name)}</h1>
            <div class="who">${esc(a.first)} ${esc(a.last)} · ${esc(sp.position)} · ${esc(a.city)}, ${esc(a.state)}</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <a class="btn btn-outline" href="athlete.html?id=${esc(a.id)}">← Master profile</a>
          <button class="btn btn-primary" data-reach="${esc(a.first)} ${esc(a.last)} (${esc(cfg.name)})">Reach out</button>
        </div>
      </div>

      <div class="detail-grid">
        <div>
          <div class="panel" data-reveal>
            <div class="panel-title">Key stats</div>
            <div class="stat-grid">${stats}</div>
          </div>
          <div class="panel" data-reveal>
            <div class="panel-title">Highlight reel</div>
            <div class="reel">${videos}</div>
          </div>
          <div class="panel" data-reveal>
            <div class="panel-title">Photos</div>
            <div class="photo-grid">${photos}</div>
          </div>
        </div>

        <div>
          <div class="panel intent-card" data-reveal>
            <div class="panel-title">Recruiting status</div>
            ${statusTag(sp.status)}
            <p style="color:var(--muted);font-size:14.5px;margin:14px 0 0">${esc(STATUS[sp.status].blurb)}</p>
          </div>
          <div class="panel" data-reveal>
            <div class="panel-title">Level</div>
            <div class="kv"><span class="k">Skill</span><span class="v">${esc(sp.level)}</span></div>
            <div class="kv"><span class="k">Position</span><span class="v">${esc(sp.position)}</span></div>
            <div class="kv"><span class="k">Current tier</span><span class="v" style="color:var(--volt)">${esc(sp.tier)}</span></div>
            <div style="margin-top:16px"><div class="panel-title" style="margin-bottom:10px">Tier ladder</div><div class="tier-row">${tiers}</div></div>
          </div>
          <div class="panel" data-reveal>
            <div class="panel-title">Practice</div>
            <div class="kv"><span class="k">Typical days</span><span class="v">${esc(sp.practice.days)}</span></div>
            <div class="kv"><span class="k">Time</span><span class="v">${esc(sp.practice.time)}</span></div>
            <div style="margin-top:14px">
              <div class="kv" style="border:0;padding-bottom:6px"><span class="k">Wants to train</span><span class="v">${esc(wantLabel(want))}</span></div>
              <div class="want-meter">${segs}</div>
              <div style="display:flex;justify-content:space-between;color:var(--faint);font-size:11px;font-weight:700;margin-top:6px;text-transform:uppercase;letter-spacing:.5px"><span>Lighter</span><span>More reps</span></div>
            </div>
          </div>
        </div>
      </div>`;

    observeReveals(root);
    wireReach(root);
    $$('[data-video]', root).forEach(v => v.addEventListener('click', () => {
      const url = v.dataset.url;
      if (url) window.open(url, '_blank', 'noopener');
      else toast('Add a video link to this clip in the profile builder.');
    }));
  }

  /* ============================================================
     PAGE: DISCOVER (coach view)
     ============================================================ */
  function renderDiscover() {
    const grid = $('#recruit-grid');
    if (!grid) return;

    // flatten athletes into per-sport recruit rows.
    // Include the parent's own created profile (if any) so they see it appear here.
    const mine = loadMyAthlete();
    const roster = mine ? [mine, ...ATHLETES] : ATHLETES.slice();
    const ROWS = [];
    roster.forEach(a => {
      Object.keys(a.sports).forEach(key => {
        const sp = a.sports[key];
        ROWS.push({
          athlete: a, sportKey: key, sport: SPORTS[key] || { name: key, emoji: '🏅' },
          status: sp.status, level: sp.level, position: sp.position, tier: sp.tier, sp,
        });
      });
    });

    const state = { status: new Set(['open']), sport: new Set(), level: new Set(), age: 18, city: '' };
    const selected = new Set();

    function matches(r) {
      if (state.status.size && !state.status.has(r.status)) return false;
      if (state.sport.size && !state.sport.has(r.sportKey)) return false;
      if (state.level.size && !state.level.has(r.level)) return false;
      if (r.athlete.age > state.age) return false;
      if (state.city && !r.athlete.city.toLowerCase().includes(state.city.toLowerCase())) return false;
      return true;
    }

    function card(r) {
      const a = r.athlete;
      const id = `${a.id}:${r.sportKey}`;
      const on = selected.has(id);
      const top = STATUS[r.status].cls;
      return `
        <article class="recruit" data-id="${esc(id)}" data-reveal>
          <div class="recruit-top" style="background:${r.sport.grad || 'var(--panel-2)'}">
            ${statusTag(r.status)}
            <div class="recruit-av">${esc(a.initials)}</div>
          </div>
          <div class="recruit-body">
            <h3>${esc(a.first)} ${esc(a.last)}</h3>
            <div class="recruit-meta">${r.sport.emoji} ${esc(r.sport.name)} · ${esc(r.position)} · Age ${a.age} · ${esc(a.city)}, ${esc(a.state)}</div>
            <div class="recruit-tags">
              <span class="mini-tag sport">${esc(r.tier)}</span>
              <span class="mini-tag">${esc(r.level)}</span>
              <span class="mini-tag">Class '${esc(String(a.grad).slice(-2))}</span>
            </div>
            <div class="recruit-foot">
              <a class="btn btn-outline btn-sm" href="sport.html?athlete=${esc(a.id)}&sport=${esc(r.sportKey)}">View</a>
              <button class="btn ${on ? 'btn-primary' : 'btn-ghost'} btn-sm" data-pick>${on ? 'Added ✓' : '+ Shortlist'}</button>
              <button class="btn btn-blue btn-sm" data-reach="${esc(a.first)} ${esc(a.last)}">Reach</button>
            </div>
          </div>
        </article>`;
    }

    function draw() {
      const rows = ROWS.filter(matches);
      $('[data-count]').textContent = rows.length;
      const empty = $('#empty');
      if (!rows.length) { grid.innerHTML = ''; empty.hidden = false; }
      else { empty.hidden = true; grid.innerHTML = rows.map(card).join(''); }
      observeReveals(grid);

      $$('[data-pick]', grid).forEach(btn => btn.addEventListener('click', () => {
        const id = btn.closest('.recruit').dataset.id;
        if (selected.has(id)) selected.delete(id); else selected.add(id);
        drawBulk(); draw();
      }));
      wireReach(grid);
      drawBulk();
    }

    function drawBulk() {
      const bar = $('#bulk-bar');
      $('[data-sel-count]').textContent = selected.size;
      bar.classList.toggle('hidden', selected.size === 0);
    }

    // filter wiring
    $$('[data-filter="status"] .chip, [data-filter="sport"] .chip, [data-filter="level"] .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.closest('[data-filter]');
        const field = group.dataset.filter;
        const multi = group.hasAttribute('data-multi');
        const val = chip.dataset.val;
        if (!multi) {
          // single-select toggle
          const wasOn = chip.classList.contains('on');
          $$('.chip', group).forEach(c => c.classList.remove('on'));
          state[field].clear();
          if (!wasOn) { chip.classList.add('on'); state[field].add(val); }
        } else {
          chip.classList.toggle('on');
          if (state[field].has(val)) state[field].delete(val); else state[field].add(val);
        }
        draw();
      });
    });

    const ageInput = $('[data-filter="age"]');
    if (ageInput) ageInput.addEventListener('input', () => {
      state.age = +ageInput.value; $('[data-age-out]').textContent = ageInput.value; draw();
    });
    const cityInput = $('[data-filter="city"]');
    if (cityInput) cityInput.addEventListener('input', () => { state.city = cityInput.value.trim(); draw(); });

    const reset = $('[data-reset]');
    if (reset) reset.addEventListener('click', () => {
      state.status = new Set(); state.sport.clear(); state.level.clear(); state.age = 18; state.city = '';
      $$('.chip').forEach(c => c.classList.remove('on'));
      if (ageInput) ageInput.value = 18; $('[data-age-out]').textContent = '18';
      if (cityInput) cityInput.value = '';
      draw();
    });

    const selectAll = $('[data-select-all]');
    if (selectAll) selectAll.addEventListener('click', () => {
      ROWS.filter(matches).forEach(r => selected.add(`${r.athlete.id}:${r.sportKey}`));
      draw();
    });
    const clearSel = $('[data-clear-sel]');
    if (clearSel) clearSel.addEventListener('click', () => { selected.clear(); draw(); });
    const msgAll = $('[data-msg-all]');
    if (msgAll) msgAll.addEventListener('click', () => openModal(`${selected.size} athletes`, `Send one message to all ${selected.size} shortlisted families. Each parent approves before contact details are shared.`));

    draw();
  }

  /* ---------- reach-out wiring (shared) ---------- */
  function wireReach(root) {
    $$('[data-reach]', root).forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.reach)));
  }

  /* ============================================================
     PAGE: PROFILE BUILDER (create.html)
     Saves to the browser (localStorage). No server required.
     ============================================================ */
  function renderBuilder() {
    const root = $('#builder-root');
    if (!root) return;

    const existing = loadMyAthlete();
    const sportOptions = Object.keys(SPORTS)
      .map(k => `<option value="${k}">${SPORTS[k].emoji} ${SPORTS[k].name}</option>`).join('');

    root.innerHTML = `
      <h1>${existing ? 'Edit your' : 'Build your'} athlete's profile</h1>
      <p class="hint">Fill this in and hit save — your athlete's profile comes to life instantly. You can come back and edit it anytime.</p>

      <div class="builder-card">
        <h2>The basics</h2>
        <div class="grid2">
          <div><label for="b-first">First name</label><input class="field" id="b-first" placeholder="Jayden" /></div>
          <div><label for="b-last">Last name</label><input class="field" id="b-last" placeholder="Cole" /></div>
        </div>
        <div class="grid3">
          <div><label for="b-age">Age</label><input class="field" id="b-age" type="number" min="4" max="19" placeholder="13" /></div>
          <div><label for="b-grad">Class of (grad year)</label><input class="field" id="b-grad" placeholder="2031" /></div>
          <div><label for="b-state">State</label><input class="field" id="b-state" placeholder="TX" /></div>
        </div>
        <div class="grid2">
          <div><label for="b-city">City</label><input class="field" id="b-city" placeholder="Austin" /></div>
          <div><label for="b-init">Initials (for the badge)</label><input class="field" id="b-init" maxlength="3" placeholder="JC" /></div>
        </div>
        <label for="b-tagline">One-line bio</label>
        <input class="field" id="b-tagline" placeholder="Two-way player. Lives for the big moment." />
      </div>

      <div class="builder-card">
        <h2>Sports</h2>
        <p class="sub">Add every sport your athlete plays — or wants to try. Each one gets its own page.</p>
        <div id="sports-list"></div>
        <div class="builder-actions">
          <button class="btn btn-ghost" id="add-sport" type="button">+ Add a sport</button>
        </div>
      </div>

      <div class="builder-actions">
        <button class="btn btn-primary btn-lg" id="save-profile" type="button">Save profile</button>
        <a class="btn btn-outline" href="athlete.html?id=me">View my profile</a>
      </div>
      <div class="builder-saved" id="saved-msg">Saved! Taking you to the profile…</div>
    `;

    const list = $('#sports-list', root);

    function sportBlock(prefill) {
      const wrap = document.createElement('div');
      wrap.className = 'sport-block';
      wrap.innerHTML = `
        <div class="sb-head"><h3>Sport</h3><button type="button" class="remove">Remove</button></div>
        <div class="grid2">
          <div><label>Sport</label><select class="field b-sport">${sportOptions}</select></div>
          <div><label>Position</label><input class="field b-pos" placeholder="Shortstop / Pitcher" /></div>
        </div>
        <div class="grid3">
          <div><label>Skill level</label><select class="field b-level"><option>Beginner</option><option selected>Intermediate</option><option>Advanced</option></select></div>
          <div><label>Tier</label><select class="field b-tier"></select></div>
          <div><label>Recruiting status</label><select class="field b-status">
            <option value="open">Open to Offers</option>
            <option value="radar" selected>On the Radar</option>
            <option value="locked">Locked In</option>
          </select></div>
        </div>
        <label class="checkbox"><input type="checkbox" class="b-fav" /> This is a top sport for them</label>

        <label style="margin-top:20px">Key stats</label>
        <div class="grid3 b-stats"></div>

        <div class="grid3" style="margin-top:6px">
          <div><label>Practice days</label><input class="field b-days" placeholder="Mon · Wed · Fri" /></div>
          <div><label>Practice time</label><input class="field b-time" placeholder="5:30–7:30 PM" /></div>
          <div><label>Training appetite</label><select class="field b-want">
            <option value="1">Prefers lighter load</option>
            <option value="2" selected>Happy with the load</option>
            <option value="3">Wants more reps</option>
          </select></div>
        </div>

        <label style="margin-top:20px">Highlight videos (paste a YouTube / Hudl / Vimeo link)</label>
        <div class="grid2"><input class="field b-vcap1" placeholder="Clip title — e.g. Walk-off triple" /><input class="field b-vurl1" placeholder="https://youtube.com/..." /></div>
        <div class="grid2" style="margin-top:10px"><input class="field b-vcap2" placeholder="Clip title (optional)" /><input class="field b-vurl2" placeholder="https://..." /></div>
      `;

      const sportSel = $('.b-sport', wrap);
      const tierSel = $('.b-tier', wrap);
      const statsWrap = $('.b-stats', wrap);

      function syncSport() {
        const key = sportSel.value;
        tierSel.innerHTML = (SPORTS[key].tiers || []).map(t => `<option>${t}</option>`).join('');
        statsWrap.innerHTML = (STAT_FIELDS[key] || []).map((f, i) =>
          `<div><label style="margin-top:0">${esc(f.k)}</label><input class="field b-stat" data-key="${esc(f.k)}" data-accent="${f.accent ? 1 : 0}" placeholder="${esc(f.ph)}" /></div>`
        ).join('');
      }
      sportSel.addEventListener('change', syncSport);
      $('.remove', wrap).addEventListener('click', () => wrap.remove());

      syncSport();

      // prefill an existing sport
      if (prefill) {
        sportSel.value = prefill.key;
        syncSport();
        $('.b-pos', wrap).value = prefill.position || '';
        $('.b-level', wrap).value = prefill.level || 'Intermediate';
        $('.b-tier', wrap).value = prefill.tier || tierSel.value;
        $('.b-status', wrap).value = prefill.status || 'radar';
        $('.b-fav', wrap).checked = !!prefill.favorite;
        $('.b-days', wrap).value = (prefill.practice && prefill.practice.days) || '';
        $('.b-time', wrap).value = (prefill.practice && prefill.practice.time) || '';
        $('.b-want', wrap).value = String((prefill.practice && prefill.practice.want) || 2);
        (prefill.stats || []).forEach(s => {
          const inp = $$('.b-stat', wrap).find(x => x.dataset.key === s.k);
          if (inp) inp.value = s.v;
        });
        if (prefill.videos && prefill.videos[0]) { $('.b-vcap1', wrap).value = prefill.videos[0].cap || ''; $('.b-vurl1', wrap).value = prefill.videos[0].url || ''; }
        if (prefill.videos && prefill.videos[1]) { $('.b-vcap2', wrap).value = prefill.videos[1].cap || ''; $('.b-vurl2', wrap).value = prefill.videos[1].url || ''; }
      }

      list.appendChild(wrap);
      return wrap;
    }

    function readBlock(wrap) {
      const key = $('.b-sport', wrap).value;
      const videos = [];
      [['1'], ['2']].forEach(([n]) => {
        const cap = $('.b-vcap' + n, wrap).value.trim();
        const url = $('.b-vurl' + n, wrap).value.trim();
        if (cap || url) videos.push({ cap: cap || 'Highlight', url, dur: '' });
      });
      const stats = $$('.b-stat', wrap)
        .map(inp => ({ k: inp.dataset.key, v: inp.value.trim(), accent: inp.dataset.accent === '1' }))
        .filter(s => s.v);
      return {
        key,
        data: {
          position: $('.b-pos', wrap).value.trim() || '—',
          level: $('.b-level', wrap).value,
          tier: $('.b-tier', wrap).value,
          status: $('.b-status', wrap).value,
          favorite: $('.b-fav', wrap).checked,
          stats,
          practice: { days: $('.b-days', wrap).value.trim() || 'TBD', time: $('.b-time', wrap).value.trim() || 'TBD', want: +$('.b-want', wrap).value },
          videos,
          photos: 0,
        },
      };
    }

    // seed blocks (existing profile, or one empty starter)
    if (existing && existing.sports && Object.keys(existing.sports).length) {
      Object.keys(existing.sports).forEach(k => sportBlock(Object.assign({ key: k }, existing.sports[k])));
      // prefill basics
      $('#b-first', root).value = existing.first || '';
      $('#b-last', root).value = existing.last || '';
      $('#b-age', root).value = existing.age || '';
      $('#b-grad', root).value = existing.grad || '';
      $('#b-state', root).value = existing.state || '';
      $('#b-city', root).value = existing.city || '';
      $('#b-init', root).value = existing.initials || '';
      $('#b-tagline', root).value = existing.tagline || '';
    } else {
      sportBlock(null);
    }

    $('#add-sport', root).addEventListener('click', () => sportBlock(null));

    $('#save-profile', root).addEventListener('click', () => {
      const first = $('#b-first', root).value.trim();
      const last = $('#b-last', root).value.trim();
      if (!first) { toast('Add a first name to save.'); $('#b-first', root).focus(); return; }

      const blocks = $$('.sport-block', root).map(readBlock);
      if (!blocks.length) { toast('Add at least one sport.'); return; }

      const sports = {};
      blocks.forEach(b => { sports[b.key] = b.data; }); // last block wins if a sport is duplicated

      const initials = ($('#b-init', root).value.trim()
        || ((first[0] || '') + (last[0] || ''))).toUpperCase();

      const athlete = {
        id: 'me',
        first, last,
        age: +$('#b-age', root).value || 0,
        grad: $('#b-grad', root).value.trim() || '',
        city: $('#b-city', root).value.trim() || '',
        state: $('#b-state', root).value.trim().toUpperCase() || '',
        initials,
        tagline: $('#b-tagline', root).value.trim() || `${first} is on Dub Profile.`,
        sports,
      };

      saveMyAthlete(athlete);
      $('#saved-msg', root).classList.add('show');
      toast('Profile saved ✓');
      setTimeout(() => { location.href = 'athlete.html?id=me'; }, 700);
    });
  }

  /* ---------- route ---------- */
  const page = document.body.dataset.page;
  if (page === 'athlete') renderAthlete();
  else if (page === 'sport') renderSport();
  else if (page === 'discover') renderDiscover();
  else if (page === 'builder') renderBuilder();
})();
