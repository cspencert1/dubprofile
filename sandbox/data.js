/* ============================================================
   DUB PROFILE — shared mock data
   In production this comes from the API. For the prototype it
   lives here so every page renders the same athletes.
   ============================================================ */

// Availability is the signature feature. Friendly, non-clinical labels.
const STATUS = {
  open:   { key: 'open',   label: 'Open to Offers', cls: 'status-open',
            blurb: 'Actively looking for a new team or program.' },
  radar:  { key: 'radar',  label: 'On the Radar',   cls: 'status-radar',
            blurb: 'Happy where they are, but open to the right fit.' },
  locked: { key: 'locked', label: 'Locked In',      cls: 'status-locked',
            blurb: 'Settled with a team this season.' },
};

// Per-sport config: emoji, gradient, level tiers, and which stats matter.
const SPORTS = {
  baseball: {
    name: 'Baseball', emoji: '⚾',
    grad: 'linear-gradient(150deg,#1f6feb33,#0c0f18), radial-gradient(120% 120% at 20% 0%,#ccff0033,transparent 50%)',
    tiers: ['Rec', 'AA', 'AAA', 'Majors', 'Travel', 'Elite'],
  },
  basketball: {
    name: 'Basketball', emoji: '🏀',
    grad: 'linear-gradient(150deg,#ff6a0033,#0c0f18), radial-gradient(120% 120% at 80% 0%,#ff2e7e33,transparent 50%)',
    tiers: ['Rec', 'JV', 'Varsity', 'AAU', 'Elite'],
  },
  soccer: {
    name: 'Soccer', emoji: '⚽',
    grad: 'linear-gradient(150deg,#29e7d633,#0c0f18), radial-gradient(120% 120% at 30% 0%,#ccff0033,transparent 50%)',
    tiers: ['Rec', 'Select', 'Academy', 'ECNL', 'Elite'],
  },
  football: {
    name: 'Football', emoji: '🏈',
    grad: 'linear-gradient(150deg,#8b5cf633,#0c0f18), radial-gradient(120% 120% at 75% 0%,#3d7bff33,transparent 50%)',
    tiers: ['Rec', 'JV', 'Varsity', '7v7', 'Elite'],
  },
  volleyball: {
    name: 'Volleyball', emoji: '🏐',
    grad: 'linear-gradient(150deg,#ff2e7e33,#0c0f18), radial-gradient(120% 120% at 25% 0%,#29e7d633,transparent 50%)',
    tiers: ['Rec', 'JV', 'Varsity', 'Club', 'Elite'],
  },
  hockey: {
    name: 'Hockey', emoji: '🏒',
    grad: 'linear-gradient(150deg,#3d7bff33,#0c0f18), radial-gradient(120% 120% at 80% 0%,#29e7d633,transparent 50%)',
    tiers: ['House', 'A', 'AA', 'AAA', 'Elite'],
  },
};

// "want" = does the kid want more / less / just-right practice (1=less .. 3=more)
// favorite is stored but never labeled as "favorite" in the UI (subtle highlight only).
const ATHLETES = [
  {
    id: 'jayden-cole', first: 'Jayden', last: 'Cole', grad: '2031',
    age: 13, city: 'Austin', state: 'TX', initials: 'JC',
    tagline: 'Two-way player. Lives for the big moment.',
    sports: {
      baseball: {
        position: 'SS / RHP', tier: 'AAA', level: 'Advanced',
        status: 'open', favorite: true, jersey: 7,
        stats: [
          { k: 'Height', v: `5'7"`, accent: false },
          { k: 'Weight', v: '128', accent: false },
          { k: 'Bats / Throws', v: 'R / R', accent: false },
          { k: 'Exit Velo', v: '78', accent: true },
          { k: '60 Yard', v: '7.9s', accent: true },
          { k: 'Batting Avg', v: '.412', accent: true },
        ],
        practice: { days: 'Mon · Wed · Fri', time: '5:30–7:30 PM', want: 3 },
        videos: [
          { cap: 'Walk-off triple', dur: '0:48' },
          { cap: 'Bullpen — 4 pitch', dur: '1:12' },
        ],
        photos: 3,
      },
      basketball: {
        position: 'Point Guard', tier: 'AAU', level: 'Intermediate',
        status: 'radar', favorite: false, jersey: 3,
        stats: [
          { k: 'Height', v: `5'7"`, accent: false },
          { k: 'Wingspan', v: `5'9"`, accent: false },
          { k: 'Vertical', v: '22"', accent: true },
          { k: 'PPG', v: '14.2', accent: true },
          { k: 'APG', v: '6.1', accent: false },
          { k: 'Position', v: 'PG', accent: false },
        ],
        practice: { days: 'Tue · Thu', time: '6:00–8:00 PM', want: 2 },
        videos: [{ cap: 'Crossover highlight', dur: '0:36' }],
        photos: 2,
      },
    },
  },
  {
    id: 'maya-rivera', first: 'Maya', last: 'Rivera', grad: '2030',
    age: 14, city: 'Round Rock', state: 'TX', initials: 'MR',
    tagline: 'Outside hitter with a relentless first step.',
    sports: {
      volleyball: {
        position: 'Outside Hitter', tier: 'Club', level: 'Advanced',
        status: 'open', favorite: true, jersey: 11,
        stats: [
          { k: 'Height', v: `5'9"`, accent: false },
          { k: 'Approach Touch', v: `9'2"`, accent: true },
          { k: 'Vertical', v: '24"', accent: true },
          { k: 'Reach', v: `7'4"`, accent: false },
          { k: 'Kills / Set', v: '3.4', accent: true },
          { k: 'Position', v: 'OH', accent: false },
        ],
        practice: { days: 'Mon · Wed · Sat', time: '4:00–6:00 PM', want: 3 },
        videos: [{ cap: 'Kill compilation', dur: '1:02' }, { cap: 'Serving run', dur: '0:41' }],
        photos: 3,
      },
      soccer: {
        position: 'Forward', tier: 'Select', level: 'Intermediate',
        status: 'radar', favorite: false, jersey: 9,
        stats: [
          { k: 'Height', v: `5'9"`, accent: false },
          { k: '40 Yard', v: '5.4s', accent: true },
          { k: 'Pref. Foot', v: 'Right', accent: false },
          { k: 'Goals', v: '12', accent: true },
          { k: 'Assists', v: '7', accent: false },
          { k: 'Position', v: 'FWD', accent: false },
        ],
        practice: { days: 'Tue · Thu', time: '5:00–6:30 PM', want: 1 },
        videos: [{ cap: 'Top corner finish', dur: '0:28' }],
        photos: 2,
      },
    },
  },
  {
    id: 'eli-thompson', first: 'Eli', last: 'Thompson', grad: '2029',
    age: 15, city: 'Cedar Park', state: 'TX', initials: 'ET',
    tagline: 'Pocket presence beyond his years.',
    sports: {
      football: {
        position: 'Quarterback', tier: 'Varsity', level: 'Advanced',
        status: 'open', favorite: true, jersey: 12,
        stats: [
          { k: 'Height', v: `6'1"`, accent: false },
          { k: 'Weight', v: '175', accent: false },
          { k: '40 Yard', v: '4.8s', accent: true },
          { k: 'Wingspan', v: `6'3"`, accent: false },
          { k: 'Pass Yds', v: '2.4K', accent: true },
          { k: 'TD : INT', v: '24 : 5', accent: true },
        ],
        practice: { days: 'Mon–Thu', time: '3:30–5:30 PM', want: 2 },
        videos: [{ cap: 'Game-winning drive', dur: '1:30' }, { cap: '60-yd dime', dur: '0:22' }],
        photos: 3,
      },
    },
  },
  {
    id: 'sophia-nguyen', first: 'Sophia', last: 'Nguyen', grad: '2032',
    age: 12, city: 'Austin', state: 'TX', initials: 'SN',
    tagline: 'Lockdown defender who never stops moving.',
    sports: {
      soccer: {
        position: 'Center Back', tier: 'Academy', level: 'Advanced',
        status: 'radar', favorite: true, jersey: 4,
        stats: [
          { k: 'Height', v: `5'4"`, accent: false },
          { k: '40 Yard', v: '5.6s', accent: true },
          { k: 'Pref. Foot', v: 'Left', accent: false },
          { k: 'Clean Sheets', v: '9', accent: true },
          { k: 'Tackles', v: '54', accent: false },
          { k: 'Position', v: 'CB', accent: false },
        ],
        practice: { days: 'Mon · Wed · Fri', time: '5:30–7:00 PM', want: 3 },
        videos: [{ cap: 'Defensive clinic', dur: '0:55' }],
        photos: 2,
      },
      basketball: {
        position: 'Shooting Guard', tier: 'JV', level: 'Beginner',
        status: 'locked', favorite: false, jersey: 8,
        stats: [
          { k: 'Height', v: `5'4"`, accent: false },
          { k: 'Vertical', v: '18"', accent: true },
          { k: 'PPG', v: '8.0', accent: false },
          { k: '3PT %', v: '34%', accent: true },
          { k: 'Position', v: 'SG', accent: false },
          { k: 'Wingspan', v: `5'5"`, accent: false },
        ],
        practice: { days: 'Sat', time: '10:00–11:30 AM', want: 1 },
        videos: [],
        photos: 1,
      },
    },
  },
  {
    id: 'marcus-bell', first: 'Marcus', last: 'Bell', grad: '2030',
    age: 14, city: 'Pflugerville', state: 'TX', initials: 'MB',
    tagline: 'Power forward with a soft touch.',
    sports: {
      basketball: {
        position: 'Power Forward', tier: 'Elite', level: 'Advanced',
        status: 'open', favorite: true, jersey: 23,
        stats: [
          { k: 'Height', v: `6'2"`, accent: false },
          { k: 'Weight', v: '180', accent: false },
          { k: 'Wingspan', v: `6'6"`, accent: true },
          { k: 'Vertical', v: '28"', accent: true },
          { k: 'PPG', v: '18.5', accent: true },
          { k: 'RPG', v: '9.3', accent: false },
        ],
        practice: { days: 'Mon · Tue · Thu · Sat', time: '6:00–8:00 PM', want: 2 },
        videos: [{ cap: 'Poster dunk', dur: '0:18' }, { cap: 'Full-game reel', dur: '2:05' }],
        photos: 3,
      },
    },
  },
  {
    id: 'ava-patel', first: 'Ava', last: 'Patel', grad: '2031',
    age: 13, city: 'Leander', state: 'TX', initials: 'AP',
    tagline: 'Glove-first shortstop with pop in the bat.',
    sports: {
      baseball: {
        position: 'SS', tier: 'Majors', level: 'Advanced',
        status: 'radar', favorite: true, jersey: 2,
        stats: [
          { k: 'Height', v: `5'5"`, accent: false },
          { k: 'Weight', v: '120', accent: false },
          { k: 'Bats / Throws', v: 'L / R', accent: false },
          { k: 'Exit Velo', v: '72', accent: true },
          { k: '60 Yard', v: '8.1s', accent: true },
          { k: 'Fielding %', v: '.965', accent: true },
        ],
        practice: { days: 'Tue · Thu · Sun', time: '4:30–6:30 PM', want: 3 },
        videos: [{ cap: 'Double-play turn', dur: '0:33' }],
        photos: 2,
      },
    },
  },
];

// ---- helpers shared across pages ----
function getAthlete(id) {
  return ATHLETES.find(a => a.id === id) || ATHLETES[0];
}
function qp(name) {
  return new URLSearchParams(location.search).get(name);
}
function wantLabel(w) {
  return w === 3 ? 'Wants more reps' : w === 1 ? 'Prefers lighter load' : 'Happy with the load';
}
