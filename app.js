/* =========================================================================
   FAHAD TRAVELS — front-end demo application
   Everything (packages, bookings, gallery, reviews, FAQs, settings, admin
   account) lives in localStorage so the whole "CMS" is editable from the
   Admin Dashboard with zero code changes. This is a self-contained
   PROTOTYPE: there is no real server, so payments/emails are simulated.
   ========================================================================= */

const DB_KEY = 'fahadTravelsDB_v1';
const SESSION_KEY = 'fahadTravelsSession_v1';

/* ---------- crypto helper (demo-grade hashing, not a real backend) ------ */
async function sha256(text){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function uid(prefix){ return prefix + '-' + Math.random().toString(36).slice(2,8).toUpperCase(); }
function fmtMoney(n){ const s = DB.settings.currencySymbol || '$'; return s + Number(n).toLocaleString(); }
function fmtDate(d){ return new Date(d).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}); }
function starString(rating){ const full=Math.round(rating); return '★'.repeat(full)+'☆'.repeat(5-full); }

/* ---------------------------- seed data --------------------------------- */
function seedPackages(){
  const img = (id)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=60`;
  return [
    {id:uid('PKG'), title:'Maldives Overwater Bliss', destination:'Maldives', country:'Maldives', category:'Honeymoon',
      price:1899, discount:10, duration:'5 Days / 4 Nights', rating:4.9, ratingCount:128,
      image:img('photo-1514282401047-d79a71a590e8'),
      gallery:[img('photo-1514282401047-d79a71a590e8'), img('photo-1544551763-46a013bb70d5'), img('photo-1573843981267-be1999ff37cd')],
      description:'Private overwater villas, turquoise lagoons, and sunset dolphin cruises.',
      itinerary:[{day:1,title:'Arrival & Resort Check-in',desc:'Speedboat transfer to your private villa, welcome drinks.'},
                 {day:2,title:'Snorkeling & Coral Reef',desc:'Guided snorkeling tour across the house reef.'},
                 {day:3,title:'Sunset Dolphin Cruise',desc:'Evening cruise with a private dinner on the sandbank.'},
                 {day:4,title:'Spa & Leisure Day',desc:'Free day — spa treatments, kayaking, or relaxing.'},
                 {day:5,title:'Departure',desc:'Breakfast and speedboat transfer to the airport.'}],
      hotel:'5★ Overwater Villa Resort', included:['Airport transfers','Daily breakfast & dinner','Snorkeling gear','1 spa session'],
      excluded:['International flights','Travel insurance','Alcoholic beverages'],
      availableDates:['2026-09-10','2026-10-05','2026-11-14'], featured:true, status:'active'},

    {id:uid('PKG'), title:'Swiss Alps Adventure', destination:'Interlaken', country:'Switzerland', category:'Adventure',
      price:1450, discount:0, duration:'6 Days / 5 Nights', rating:4.8, ratingCount:94,
      image:img('photo-1530122037265-a5f1f91d3b99'),
      gallery:[img('photo-1530122037265-a5f1f91d3b99'), img('photo-1502786129293-79981df4e689'), img('photo-1483728642387-6c3bdd6c93e5')],
      description:'Paragliding, glacier hikes, and scenic train rides through the Bernese Alps.',
      itinerary:[{day:1,title:'Arrival in Interlaken',desc:'Check-in and evening lakeside walk.'},
                 {day:2,title:'Jungfraujoch — Top of Europe',desc:'Cogwheel train to the highest station in Europe.'},
                 {day:3,title:'Paragliding Experience',desc:'Tandem paragliding over the Alps.'},
                 {day:4,title:'Grindelwald Glacier Hike',desc:'Guided hike with mountain-view picnic.'},
                 {day:5,title:'Lucerne Day Trip',desc:'Explore the old town and Chapel Bridge.'},
                 {day:6,title:'Departure',desc:'Transfer to Zurich airport.'}],
      hotel:'4★ Alpine Boutique Hotel', included:['All transfers','Daily breakfast','Jungfraujoch tickets','Paragliding session'],
      excluded:['Flights','Lunch & dinner','Travel insurance'],
      availableDates:['2026-08-20','2026-09-15'], featured:true, status:'active'},

    {id:uid('PKG'), title:'Bali Tropical Escape', destination:'Bali', country:'Indonesia', category:'Beach',
      price:990, discount:15, duration:'5 Days / 4 Nights', rating:4.7, ratingCount:210,
      image:img('photo-1537996194471-e657df975ab4'),
      gallery:[img('photo-1537996194471-e657df975ab4'), img('photo-1518548419970-58e3b4079ab2'), img('photo-1552733407-5d5c46c3bb3b')],
      description:'Rice terraces, beach clubs, and temple hopping across the Island of the Gods.',
      itinerary:[{day:1,title:'Arrival in Ubud',desc:'Check-in and welcome dinner.'},
                 {day:2,title:'Tegalalang Rice Terrace',desc:'Sunrise tour and swing photo stop.'},
                 {day:3,title:'Temple Hopping',desc:'Tanah Lot and Uluwatu at sunset.'},
                 {day:4,title:'Beach Club Day',desc:'Relax at a Seminyak beach club.'},
                 {day:5,title:'Departure',desc:'Souvenir shopping and airport transfer.'}],
      hotel:'4★ Boutique Resort & Spa', included:['Airport transfers','Daily breakfast','Guided tours'],
      excluded:['Flights','Visa fees','Personal expenses'],
      availableDates:['2026-08-01','2026-09-01','2026-10-01'], featured:true, status:'active'},

    {id:uid('PKG'), title:'Istanbul Heritage Tour', destination:'Istanbul', country:'Türkiye', category:'Family',
      price:760, discount:0, duration:'4 Days / 3 Nights', rating:4.6, ratingCount:75,
      image:img('photo-1524231757912-21f4fe3a7200'),
      gallery:[img('photo-1524231757912-21f4fe3a7200'), img('photo-1524231757912-21f4fe3a7200'), img('photo-1541432901042-2d8bd64b4a9b')],
      description:'Bosphorus cruises, grand bazaars, and centuries of Ottoman history.',
      itinerary:[{day:1,title:'Arrival & Old City',desc:'Hagia Sophia and Blue Mosque tour.'},
                 {day:2,title:'Bosphorus Cruise',desc:'Sightseeing cruise between two continents.'},
                 {day:3,title:'Grand Bazaar & Spice Market',desc:'Shopping and local food tasting.'},
                 {day:4,title:'Departure',desc:'Free morning, airport transfer.'}],
      hotel:'4★ City Center Hotel', included:['Transfers','Daily breakfast','Bosphorus cruise ticket'],
      excluded:['Flights','Lunch & dinner','Tips'],
      availableDates:['2026-08-12','2026-09-22'], featured:false, status:'active'},

    {id:uid('PKG'), title:'Cappadocia Balloon Dream', destination:'Cappadocia', country:'Türkiye', category:'Adventure',
      price:640, discount:5, duration:'3 Days / 2 Nights', rating:4.9, ratingCount:162,
      image:img('photo-1526772662000-3f88f10405ff'),
      gallery:[img('photo-1526772662000-3f88f10405ff'), img('photo-1541432901042-2d8bd64b4a9b')],
      description:'Sunrise hot-air balloons over surreal fairy chimneys and cave hotels.',
      itinerary:[{day:1,title:'Arrival & Cave Hotel Check-in',desc:'Evening walk in Göreme.'},
                 {day:2,title:'Sunrise Balloon Ride',desc:'Hot air balloon flight over the valleys.'},
                 {day:3,title:'Underground City Tour',desc:'Explore Derinkuyu before departure.'}],
      hotel:'Boutique Cave Hotel', included:['Balloon ride','Transfers','Breakfast'],
      excluded:['Flights','Lunch & dinner'],
      availableDates:['2026-09-05','2026-10-10'], featured:false, status:'active'},

    {id:uid('PKG'), title:'Dubai Luxury Getaway', destination:'Dubai', country:'UAE', category:'Luxury',
      price:1290, discount:0, duration:'4 Days / 3 Nights', rating:4.7, ratingCount:140,
      image:img('photo-1512453979798-5ea266f8880c'),
      gallery:[img('photo-1512453979798-5ea266f8880c'), img('photo-1518684079-3c830dcef090')],
      description:'Desert safaris, Burj Khalifa views, and five-star skyline hotels.',
      itinerary:[{day:1,title:'Arrival & Burj Khalifa',desc:'At the Top experience and Dubai Mall.'},
                 {day:2,title:'Desert Safari',desc:'Dune bashing, BBQ dinner, and cultural show.'},
                 {day:3,title:'Marina & Palm Jumeirah',desc:'Yacht cruise and beach time.'},
                 {day:4,title:'Departure',desc:'Free morning, airport transfer.'}],
      hotel:'5★ Downtown Hotel', included:['Transfers','Daily breakfast','Desert safari'],
      excluded:['Flights','City tourism fee','Personal expenses'],
      availableDates:['2026-08-18','2026-09-28'], featured:true, status:'active'},

    {id:uid('PKG'), title:'Kerala Backwaters Family Trip', destination:'Kerala', country:'India', category:'Family',
      price:540, discount:0, duration:'5 Days / 4 Nights', rating:4.5, ratingCount:58,
      image:img('photo-1602216056096-3b40cc0c9944'),
      gallery:[img('photo-1602216056096-3b40cc0c9944')],
      description:'Houseboat stays, tea plantations, and gentle family-friendly sightseeing.',
      itinerary:[{day:1,title:'Arrival in Kochi',desc:'Fort Kochi walking tour.'},
                 {day:2,title:'Munnar Tea Gardens',desc:'Scenic drive and plantation visit.'},
                 {day:3,title:'Alleppey Houseboat',desc:'Overnight stay on the backwaters.'},
                 {day:4,title:'Kumarakom',desc:'Bird sanctuary and lakeside leisure.'},
                 {day:5,title:'Departure',desc:'Transfer to airport.'}],
      hotel:'Houseboat + 4★ Resort', included:['Transfers','All meals on houseboat','Breakfast at hotels'],
      excluded:['Flights','Entry tickets','Tips'],
      availableDates:['2026-08-25','2026-10-15'], featured:false, status:'active'},

    {id:uid('PKG'), title:'Umrah Spiritual Journey', destination:'Makkah & Madinah', country:'Saudi Arabia', category:'Religious',
      price:1150, discount:0, duration:'8 Days / 7 Nights', rating:5.0, ratingCount:301,
      image:img('photo-1591604129939-f1efa4d9f7fa'),
      gallery:[img('photo-1591604129939-f1efa4d9f7fa')],
      description:'Comfortable, guided Umrah packages with nearby hotels and experienced guides.',
      itinerary:[{day:1,title:'Arrival in Jeddah',desc:'Transfer to Makkah.'},
                 {day:2,title:'Umrah Rituals',desc:'Guided Umrah performance.'},
                 {day:5,title:'Travel to Madinah',desc:'Visit to Masjid an-Nabawi.'},
                 {day:8,title:'Departure',desc:'Transfer to airport.'}],
      hotel:'Hotels within walking distance of Haram', included:['Visa assistance','Transfers','Guided rituals','Breakfast'],
      excluded:['Flights','Lunch & dinner','Ziyarat tours'],
      availableDates:['2026-09-01','2026-10-01','2026-11-01'], featured:false, status:'active'},
  ];
}

function seedGallery(){
  const cats = ['Beaches','Mountains','Adventure','Wildlife','Cities','Honeymoon','Historical Places'];
  const photos = ['photo-1507525428034-b723cf961d3e','photo-1519681393784-d120267933ba','photo-1530122037265-a5f1f91d3b99',
    'photo-1500835556837-99ac94a94552','photo-1512453979798-5ea266f8880c','photo-1524231757912-21f4fe3a7200',
    'photo-1518684079-3c830dcef090','photo-1544551763-46a013bb70d5','photo-1502786129293-79981df4e689',
    'photo-1537996194471-e657df975ab4','photo-1552733407-5d5c46c3bb3b','photo-1573843981267-be1999ff37cd'];
  return photos.map((p,i)=>({id:uid('IMG'), url:`https://images.unsplash.com/${p}?auto=format&fit=crop&w=600&q=60`, category:cats[i%cats.length]}));
}

function seedReviews(){
  return [
    {id:uid('REV'), name:'Amina R.', country:'UAE', rating:5, text:'The Maldives trip Fahad Travels arranged was flawless — every detail was taken care of.', approved:true, avatar:'https://i.pravatar.cc/100?img=32'},
    {id:uid('REV'), name:'David K.', country:'Germany', rating:5, text:'Our Swiss Alps adventure exceeded expectations. The guide was fantastic and very professional.', approved:true, avatar:'https://i.pravatar.cc/100?img=15'},
    {id:uid('REV'), name:'Sara P.', country:'UK', rating:4, text:'Bali was beautiful and the itinerary was well paced. Would book again.', approved:true, avatar:'https://i.pravatar.cc/100?img=47'},
    {id:uid('REV'), name:'Hamid T.', country:'Pakistan', rating:5, text:'Excellent Umrah arrangements, hotels were exactly as promised and very close to Haram.', approved:true, avatar:'https://i.pravatar.cc/100?img=8'},
  ];
}

function seedFaqs(){
  return [
    {id:uid('FAQ'), q:'How do I book a tour package?', a:'Choose a package, click "Book Now", fill in the booking form and submit. You will receive a Booking ID and confirmation instantly.'},
    {id:uid('FAQ'), q:'Can I edit my booking after submitting it?', a:'Yes — you can edit or cancel your booking from your Customer Dashboard within the edit window shown on your booking (set by the admin, default 24 hours after booking). After that window closes, please contact support.'},
    {id:uid('FAQ'), q:'What payment methods do you accept?', a:'We accept Stripe, PayPal, bank transfer, and cash on arrival for select packages.'},
    {id:uid('FAQ'), q:'Is travel insurance included?', a:'Travel insurance is not included by default but can be added during booking or arranged separately.'},
    {id:uid('FAQ'), q:'Do you offer custom / tailor-made tours?', a:'Yes, contact our team with your preferences and we will design a custom itinerary for you.'},
  ];
}

function seedBlog(){
  return [
    {id:uid('BLG'), title:'5 Reasons the Maldives Should Be Your Next Honeymoon', excerpt:'From overwater villas to private sandbanks, here is why couples fall in love with the Maldives.', image:'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=700&q=60', date:'2026-06-02'},
    {id:uid('BLG'), title:'A First-Timer\u2019s Guide to Umrah Travel', excerpt:'Everything you need to know before your first Umrah journey, from visas to packing lists.', image:'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=700&q=60', date:'2026-05-18'},
    {id:uid('BLG'), title:'Best Time to See Cappadocia\u2019s Hot Air Balloons', excerpt:'Season-by-season guide to catching the perfect sunrise balloon ride.', image:'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=700&q=60', date:'2026-04-27'},
  ];
}

function defaultDB(){
  return {
    settings:{
      siteName:'Fahad Travels', tagline:'Explore the World with Comfort & Confidence',
      currency:'USD', currencySymbol:'$', editWindowHours:24,
      address:'221B Clifton Road, Karachi, Pakistan', phone:'+92 300 1234567', email:'hello@fahadtravels.com',
      hours:'Mon–Sat: 9:00 AM – 7:00 PM', mapQuery:'Karachi, Pakistan',
      social:{facebook:'#', instagram:'#', twitter:'#', youtube:'#'},
      aboutText:'Fahad Travels has been crafting unforgettable journeys for over a decade, blending comfort, safety, and genuine local experiences.',
      mission:'To make world-class travel accessible, safe, and unforgettable for every customer.',
      vision:'To be the most trusted travel partner across the region, known for honesty and care.',
      story:'Founded with a single desk and a big dream, Fahad Travels has grown into a full-service agency trusted by thousands of happy travelers.',
      maintenanceMode:false,
      stats:{customers:12800, countries:64, tours:3400, years:11, hotels:520},
      heroImage:'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=70',
      privacyText:'Fahad Travels respects your privacy. We only collect the information required to process your bookings and improve our services. We never sell your data to third parties. For questions, contact us using the details on our Contact page.',
      termsText:'By booking with Fahad Travels, you agree to our booking, cancellation, and payment terms. Bookings can be edited or cancelled within the edit window shown at the time of booking. After that window, changes are handled by our support team on a case-by-case basis.',
    },
    admin:{ username:'Fahad', passwordHash:null, securityQuestion:'What is your favourite color?', securityAnswerHash:null },
    packages: seedPackages(),
    bookings: [],
    customers: [],
    reviews: seedReviews(),
    gallery: seedGallery(),
    faqs: seedFaqs(),
    blog: seedBlog(),
    messages: [],
    questions: [],
    activityLog: [],
    coupons: [{id:uid('CPN'), code:'WELCOME10', discount:10, expiry:'2026-12-31', usageLimit:100, used:0}],
  };
}

let DB = null;
function loadDB(){
  const raw = localStorage.getItem(DB_KEY);
  if(raw){
    DB = JSON.parse(raw);
    const fresh = defaultDB();
    // migrate: fill in any new fields older saved data doesn't have yet
    if(!DB.messages) DB.messages = [];
    if(!DB.questions) DB.questions = [];
    DB.settings = Object.assign({}, fresh.settings, DB.settings);
    saveDB();
    return;
  }
  DB = defaultDB();
  saveDB();
}
function saveDB(){ localStorage.setItem(DB_KEY, JSON.stringify(DB)); }
async function ensureAdminSeed(){
  if(!DB.admin.passwordHash){
    DB.admin.passwordHash = await sha256('Fahadtravels');
    DB.admin.securityAnswerHash = await sha256('green');
    saveDB();
  }
}
function logActivity(text){
  DB.activityLog.unshift({text, at:Date.now()});
  DB.activityLog = DB.activityLog.slice(0,40);
  saveDB();
}

/* ------------------------------ session --------------------------------- */
// Customer login persists across visits (stored). Admin auth is intentionally
// NOT persisted anywhere — it lives only in memory for this page load, so the
// admin panel always requires a fresh login after a reload or new visit.
let SESSION = JSON.parse(localStorage.getItem(SESSION_KEY) || '{"customerEmail":null}');
let adminAuthed = false;
function saveSession(){ localStorage.setItem(SESSION_KEY, JSON.stringify({customerEmail:SESSION.customerEmail})); }
function currentCustomer(){ return DB.customers.find(c=>c.email===SESSION.customerEmail) || null; }

/* ------------------------------ toast ------------------------------------ */
function toast(msg, type=''){
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(()=>el.remove(), 3200);
}

/* ------------------------------ router ------------------------------------ */
const routes = {};
function route(pattern, handler){ routes[pattern] = handler; }
function parseHash(){
  let h = location.hash.slice(1) || '/';
  const [path, query] = h.split('?');
  const params = new URLSearchParams(query || '');
  return {path, params};
}
function matchRoute(path){
  const parts = path.split('/').filter(Boolean);
  for(const pattern in routes){
    const pParts = pattern.split('/').filter(Boolean);
    if(pParts.length !== parts.length) continue;
    const args = {};
    let ok = true;
    for(let i=0;i<pParts.length;i++){
      if(pParts[i].startsWith(':')) args[pParts[i].slice(1)] = decodeURIComponent(parts[i]);
      else if(pParts[i] !== parts[i]) { ok = false; break; }
    }
    if(ok) return {handler:routes[pattern], args};
  }
  return null;
}
async function render(){
  const {path, params} = parseHash();
  const app = document.getElementById('app');
  const match = matchRoute(path);
  window.scrollTo({top:0, behavior:'instant'});
  document.querySelectorAll('.main-nav a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === '#'+path);
  });
  document.getElementById('main-nav').classList.remove('open');
  if(!match){ app.innerHTML = notFoundPage(); revealSetup(); return; }
  try{
    const html = await match.handler(match.args, params);
    app.innerHTML = html;
  }catch(err){
    console.error(err);
    app.innerHTML = `<div class="container section"><h2>Something went wrong</h2><p class="muted">${err.message}</p></div>`;
  }
  applyBranding();
  revealSetup();
  wirePageScripts();
}
window.addEventListener('hashchange', render);

/* ---------------------- scroll reveal + misc chrome ----------------------- */
function revealSetup(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12});
  els.forEach(el=>io.observe(el));
}
function applyBranding(){
  document.getElementById('brand-name').textContent = DB.settings.siteName;
  document.getElementById('brand-tagline').textContent = DB.settings.tagline;
  document.getElementById('footer-brand-name').textContent = DB.settings.siteName;
  document.title = `${DB.settings.siteName} — ${DB.settings.tagline}`;
  document.getElementById('footer-about-text').textContent = DB.settings.aboutText;
  document.getElementById('footer-address').textContent = DB.settings.address;
  document.getElementById('footer-phone').textContent = DB.settings.phone;
  document.getElementById('footer-email').textContent = DB.settings.email;
  document.getElementById('footer-copyright').textContent = `© ${new Date().getFullYear()} ${DB.settings.siteName}. All rights reserved.`;
  const social = document.getElementById('footer-social');
  social.innerHTML = Object.entries(DB.settings.social||{}).map(([k,v])=>`<a href="${v}" title="${k}">${({facebook:'f',instagram:'◎',twitter:'𝕏',youtube:'▶'})[k]||'•'}</a>`).join('');
  document.getElementById('nav-account').textContent = currentCustomer() ? 'My Account' : 'Login';
  const navAccountMobile = document.getElementById('nav-account-mobile');
  if(navAccountMobile) navAccountMobile.textContent = currentCustomer() ? 'My Account' : 'Login';
}

/* ================================ PAGES ================================= */

function notFoundPage(){
  return `<div class="container section" style="text-align:center;">
    <div class="eyebrow" style="justify-content:center">404</div>
    <h1 style="font-size:2.4rem">Looks like this trip doesn't exist</h1>
    <p class="muted">The page you're looking for may have moved or never existed. Let's get you back on route.</p>
    <a href="#/" class="btn btn-cta">Back to Home</a>
  </div>`;
}

function pkgCard(p){
  const finalPrice = Math.round(p.price * (1 - (p.discount||0)/100));
  return `
  <div class="card pkg-card reveal">
    <div class="pkg-media">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      ${p.discount ? `<span class="pkg-badge">${p.discount}% OFF</span>` : ''}
      <div class="pkg-price-tag"><b>${fmtMoney(finalPrice)}</b><span>per person</span></div>
    </div>
    <div class="pkg-body">
      <div class="pkg-dest">${p.destination}, ${p.country}</div>
      <div class="pkg-title">${p.title}</div>
      <div class="pkg-meta"><span>⏱ ${p.duration}</span><span>🏷 ${p.category}</span></div>
      <p class="pkg-desc">${p.description}</p>
      <div class="pkg-foot">
        <span class="stars" title="${p.rating}/5">${starString(p.rating)} <span class="muted" style="font-size:.78rem">(${p.ratingCount})</span></span>
        <a class="btn btn-primary btn-sm" href="#/package/${p.id}">View & Book</a>
      </div>
    </div>
  </div>`;
}

route('/', ()=>{
  const s = DB.settings;
  const featured = DB.packages.filter(p=>p.featured && p.status==='active').slice(0,6);
  const destinations = [...new Map(DB.packages.map(p=>[p.destination, p])).values()].slice(0,6);
  const reviews = DB.reviews.filter(r=>r.approved).slice(0,3);
  const blog = DB.blog.slice(0,3);

  return `
  <section class="hero" style="background-image:linear-gradient(rgba(8,20,40,.82),rgba(8,20,40,.88)), url('${s.heroImage}');background-size:cover;background-position:center;">
    <div class="container hero-inner">
      <div>
        <div class="eyebrow" style="color:var(--sky-2)">Trusted by ${s.stats.customers.toLocaleString()}+ travelers</div>
        <h1>${s.tagline.split('&')[0]}&amp;<br><em>${s.tagline.split('&')[1]||'Confidence'}</em></h1>
        <p class="lead">Handpicked tour packages, honeymoon escapes, adventure trips and spiritual journeys — planned down to the last detail by ${s.siteName}.</p>
        <div class="hero-ctas">
          <a href="#/packages" class="btn btn-cta">Explore Packages</a>
          <a href="#/contact" class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.35)">Talk to an Expert</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><b>${s.stats.countries}+</b><span>Countries</span></div>
          <div class="hero-stat"><b>${s.stats.tours.toLocaleString()}+</b><span>Tours Completed</span></div>
          <div class="hero-stat"><b>${s.stats.years}+</b><span>Years Experience</span></div>
        </div>
      </div>
      <div class="boarding-pass reveal">
        <div class="bp-top"><b>${s.siteName.toUpperCase()}</b><span>BOARDING PASS</span></div>
        <div class="bp-body">
          <div class="bp-main">
            <div class="bp-route"><span class="city">KHI</span><span class="line"></span><span class="plane">✈</span><span class="line"></span><span class="city">MLE</span></div>
            <div class="bp-grid">
              <div><span>Passenger</span><b>You</b></div>
              <div><span>Package</span><b>Maldives</b></div>
              <div><span>Class</span><b>Premium</b></div>
              <div><span>Gate</span><b>A7</b></div>
              <div><span>Seat</span><b>4B</b></div>
              <div><span>Status</span><b>Confirmed</b></div>
            </div>
          </div>
          <div class="bp-stub"><div class="qr"></div><small>Scan to view booking</small></div>
        </div>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="search-bar reveal">
      <div class="field" style="margin:0"><label>Destination</label><input id="home-search-dest" placeholder="e.g. Maldives, Bali, Dubai..."></div>
      <div class="field" style="margin:0"><label>Category</label>
        <select id="home-search-cat"><option value="">Any</option>${[...new Set(DB.packages.map(p=>p.category))].map(c=>`<option>${c}</option>`).join('')}</select>
      </div>
      <div class="field" style="margin:0"><label>Budget (max)</label><input id="home-search-budget" type="number" placeholder="e.g. 1500"></div>
      <button class="btn btn-cta" id="home-search-btn" style="align-self:end">Search Tours</button>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <div class="eyebrow">Who we are</div>
        <h2>A travel agency built on trust</h2>
        <p class="muted">${s.aboutText}</p>
      </div>
      <div class="grid grid-3">
        <div class="card feature-card reveal"><div class="feature-icon">🎯</div><h3>Our Mission</h3><p>${s.mission}</p></div>
        <div class="card feature-card reveal"><div class="feature-icon">🔭</div><h3>Our Vision</h3><p>${s.vision}</p></div>
        <div class="card feature-card reveal"><div class="feature-icon">📖</div><h3>Our Story</h3><p>${s.story}</p></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--paper)">
    <div class="container">
      <div class="section-head reveal">
        <div class="eyebrow">Featured</div>
        <h2>Popular Tour Packages</h2>
        <p class="muted">Our most loved journeys, curated by our travel experts.</p>
      </div>
      <div class="grid grid-3">${featured.map(pkgCard).join('')}</div>
      <div style="text-align:center;margin-top:34px"><a href="#/packages" class="btn btn-ghost">View All Packages →</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal"><div class="eyebrow">Explore</div><h2>Popular Destinations</h2></div>
      <div class="grid grid-3">
        ${destinations.map(p=>`
          <a href="#/packages?destination=${encodeURIComponent(p.destination)}" class="dest-card reveal">
            <img src="${p.image}" alt="${p.destination}">
            <div class="dest-overlay"><h3>${p.destination}</h3><span>${p.country} · from ${fmtMoney(p.price)}</span></div>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--paper)">
    <div class="container">
      <div class="section-head reveal"><div class="eyebrow">Why Fahad Travels</div><h2>Why Travelers Choose Us</h2></div>
      <div class="grid grid-3">
        ${[['💰','Best Prices','Transparent pricing with no hidden fees, ever.'],
           ['🛡️','Trusted Guides','Certified, experienced local guides in every destination.'],
           ['🔒','Secure Booking','Your payments and data are protected end-to-end.'],
           ['🏨','Luxury Hotels','Hand-picked stays that match your comfort expectations.'],
           ['🕐','24/7 Support','Round-the-clock help before, during, and after your trip.'],
           ['🧭','Customized Tours','Every itinerary can be tailored to your preferences.']]
           .map(([icon,t,d])=>`<div class="card feature-card reveal"><div class="feature-icon">${icon}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="stat-board reveal">
        <div><b>${s.stats.customers.toLocaleString()}+</b><span>Happy Customers</span></div>
        <div><b>${s.stats.countries}+</b><span>Countries Covered</span></div>
        <div><b>${s.stats.tours.toLocaleString()}+</b><span>Tours Completed</span></div>
        <div><b>${s.stats.years}+</b><span>Years Experience</span></div>
        <div><b>${s.stats.hotels}+</b><span>Hotel Partners</span></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--paper)">
    <div class="container">
      <div class="section-head reveal"><div class="eyebrow">Testimonials</div><h2>What Our Travelers Say</h2></div>
      <div class="grid grid-3">
        ${reviews.map(r=>`
          <div class="card testimonial-card reveal">
            <div class="t-head"><img class="t-avatar" src="${r.avatar}" alt=""><div><div class="t-name">${r.name}</div><div class="t-country">${r.country}</div></div></div>
            <div class="stars">${starString(r.rating)}</div>
            <p>"${r.text}"</p>
          </div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:30px"><a href="#/reviews" class="btn btn-ghost">Read All Reviews →</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal"><div class="eyebrow">Gallery</div><h2>Moments From Our Trips</h2></div>
      <div class="grid grid-4">
        ${DB.gallery.slice(0,8).map(g=>`<a href="#/gallery" class="card reveal" style="height:150px;overflow:hidden"><img src="${g.url}" style="width:100%;height:100%;object-fit:cover" loading="lazy"></a>`).join('')}
      </div>
      <div style="text-align:center;margin-top:30px"><a href="#/gallery" class="btn btn-ghost">View Full Gallery →</a></div>
    </div>
  </section>

  <section class="section" style="background:var(--paper)">
    <div class="container">
      <div class="section-head reveal"><div class="eyebrow">From the Blog</div><h2>Travel Tips &amp; Stories</h2></div>
      <div class="grid grid-3">
        ${blog.map(b=>`
          <div class="card reveal">
            <div class="pkg-media" style="height:160px"><img src="${b.image}"></div>
            <div class="pkg-body"><div class="pkg-dest">${fmtDate(b.date)}</div><div class="pkg-title" style="font-size:1.05rem">${b.title}</div><p class="pkg-desc">${b.excerpt}</p></div>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="card reveal" style="padding:40px;text-align:center;background:linear-gradient(135deg,var(--navy),var(--navy-2));color:#fff;border:none">
        <h2 style="color:#fff">Get Travel Deals in Your Inbox</h2>
        <p style="color:#CBD9EE;max-width:480px;margin:0 auto 22px">Subscribe for exclusive discounts, new packages, and travel inspiration.</p>
        <form id="newsletter-form" style="display:flex;gap:10px;max-width:420px;margin:0 auto;flex-wrap:wrap;justify-content:center">
          <input required type="email" placeholder="Your email address" style="flex:1;min-width:220px;padding:12px 16px;border-radius:999px;border:none">
          <button class="btn btn-cta" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  </section>
  `;
});

route('/about', ()=>{
  const s = DB.settings;
  return `
  <section class="section">
    <div class="container">
      <div class="breadcrumb"><a href="#/">Home</a> / About</div>
      <div class="two-col reveal">
        <div>
          <div class="eyebrow">About Us</div>
          <h1>The Story Behind ${s.siteName}</h1>
          <p class="muted">${s.story}</p>
          <p class="muted">${s.aboutText}</p>
        </div>
        <img class="rounded-photo" src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=60" alt="Team">
      </div>
      <div class="grid grid-2" style="margin-top:50px">
        <div class="card feature-card reveal"><div class="feature-icon">🎯</div><h3>Mission</h3><p>${s.mission}</p></div>
        <div class="card feature-card reveal"><div class="feature-icon">🔭</div><h3>Vision</h3><p>${s.vision}</p></div>
      </div>
      <div class="stat-board reveal" style="margin-top:50px">
        <div><b>${s.stats.customers.toLocaleString()}+</b><span>Happy Customers</span></div>
        <div><b>${s.stats.countries}+</b><span>Countries Covered</span></div>
        <div><b>${s.stats.tours.toLocaleString()}+</b><span>Tours Completed</span></div>
        <div><b>${s.stats.years}+</b><span>Years Experience</span></div>
        <div><b>${s.stats.hotels}+</b><span>Hotel Partners</span></div>
      </div>
    </div>
  </section>`;
});

route('/packages', (args, params)=>{
  const destF = params.get('destination') || '';
  return `
  <section class="section-tight">
    <div class="container">
      <div class="breadcrumb"><a href="#/">Home</a> / Packages</div>
      <div class="section-head" style="margin-bottom:26px">
        <div class="eyebrow">All Packages</div>
        <h1>Find Your Next Journey</h1>
      </div>
      <div class="filter-bar">
        <select id="f-country"><option value="">All Countries</option>${[...new Set(DB.packages.map(p=>p.country))].map(c=>`<option>${c}</option>`).join('')}</select>
        <select id="f-category"><option value="">All Categories</option>${[...new Set(DB.packages.map(p=>p.category))].map(c=>`<option>${c}</option>`).join('')}</select>
        <input id="f-price" type="number" placeholder="Max price">
        <select id="f-sort">
          <option value="latest">Sort: Latest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Sort: Rating</option>
        </select>
        <input id="f-dest" placeholder="Destination" value="${destF}">
        <button class="btn btn-primary btn-sm" id="f-apply">Apply Filters</button>
      </div>
      <div id="pkg-results" class="grid grid-3"></div>
    </div>
  </section>`;
});

route('/package/:id', (args)=>{
  const p = DB.packages.find(x=>x.id===args.id);
  if(!p) return notFoundPage();
  const finalPrice = Math.round(p.price * (1 - (p.discount||0)/100));
  const similar = DB.packages.filter(x=>x.id!==p.id && x.category===p.category).slice(0,3);
  const pkgReviews = DB.reviews.filter(r=>r.approved).slice(0,2);
  return `
  <section class="section-tight">
    <div class="container">
      <div class="breadcrumb"><a href="#/">Home</a> / <a href="#/packages">Packages</a> / ${p.title}</div>
      <div class="two-col reveal">
        <div>
          <div class="eyebrow">${p.category} · ${p.country}</div>
          <h1>${p.title}</h1>
          <div class="pkg-meta" style="margin-bottom:16px"><span class="stars">${starString(p.rating)}</span><span class="muted">(${p.ratingCount} reviews)</span><span>⏱ ${p.duration}</span></div>
          <p class="muted">${p.description}</p>
        </div>
        <img class="rounded-photo" src="${p.image}" alt="${p.title}">
      </div>
      <div class="grid grid-4" style="margin:24px 0">
        ${p.gallery.map(g=>`<img class="rounded-photo" style="height:120px;object-fit:cover" src="${g}">`).join('')}
      </div>

      <div class="grid" style="grid-template-columns:2fr 1fr;gap:30px;align-items:start" >
        <div>
          <div class="panel reveal">
            <h3>Itinerary</h3>
            ${p.itinerary.map(d=>`<div style="display:flex;gap:14px;margin-bottom:14px"><b style="color:var(--sky);flex:none">Day ${d.day}</b><div><b>${d.title}</b><p class="muted" style="margin:2px 0 0">${d.desc}</p></div></div>`).join('')}
          </div>
          <div class="panel reveal">
            <h3>Hotel</h3><p class="muted">${p.hotel}</p>
          </div>
          <div class="grid grid-2 reveal">
            <div class="panel"><h3>✅ Included</h3><ul>${p.included.map(i=>`<li class="muted">${i}</li>`).join('')}</ul></div>
            <div class="panel"><h3>❌ Excluded</h3><ul>${p.excluded.map(i=>`<li class="muted">${i}</li>`).join('')}</ul></div>
          </div>
          <div class="panel reveal">
            <h3>Available Dates</h3>
            <div class="pill-row">${p.availableDates.map(d=>`<span class="pill">${fmtDate(d)}</span>`).join('')}</div>
          </div>
          <div class="panel reveal">
            <h3>Reviews</h3>
            ${pkgReviews.map(r=>`<div style="margin-bottom:14px"><b>${r.name}</b> <span class="stars">${starString(r.rating)}</span><p class="muted" style="margin:2px 0">${r.text}</p></div>`).join('')}
          </div>
          <div class="panel reveal">
            <h3>Frequently Asked Questions</h3>
            ${DB.faqs.slice(0,3).map(f=>`<details style="margin-bottom:10px"><summary style="cursor:pointer;font-weight:700">${f.q}</summary><p class="muted">${f.a}</p></details>`).join('')}
          </div>
        </div>
        <div class="panel reveal" style="position:sticky;top:100px">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <div><b style="font-family:var(--display);font-size:1.6rem">${fmtMoney(finalPrice)}</b><span class="muted"> /person</span></div>
            ${p.discount?`<span class="pkg-badge" style="position:static">${p.discount}% OFF</span>`:''}
          </div>
          <a href="#/booking/${p.id}" class="btn btn-cta btn-block" style="margin-top:16px">Book This Ticket</a>
          <p class="hint" style="margin-top:12px">You can edit or cancel your booking for up to ${DB.settings.editWindowHours} hours after booking.</p>
        </div>
      </div>

      ${similar.length? `<div class="section-head" style="margin-top:50px"><div class="eyebrow">You may also like</div><h2>Similar Packages</h2></div><div class="grid grid-3">${similar.map(pkgCard).join('')}</div>`:''}
    </div>
  </section>`;
});

function bookingFieldsHtml(p, existing){
  const e = existing || {};
  return `
    <div class="field-row">
      <div class="field"><label>Full Name</label><input required name="name" value="${e.name||''}"></div>
      <div class="field"><label>Email</label><input required type="email" name="email" value="${e.email||currentCustomer()?.email||''}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Phone</label><input required name="phone" value="${e.phone||''}"></div>
      <div class="field"><label>Country</label><input required name="country" value="${e.country||''}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Number of Adults</label><input required type="number" min="1" name="adults" value="${e.adults||1}"></div>
      <div class="field"><label>Number of Children</label><input type="number" min="0" name="children" value="${e.children||0}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Travel Date</label><input required type="date" name="travelDate" value="${e.travelDate||''}"></div>
      <div class="field"><label>Return Date</label><input required type="date" name="returnDate" value="${e.returnDate||''}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Hotel Preference</label>
        <select name="hotelPref">
          ${['Standard','Deluxe','Suite / Premium'].map(o=>`<option ${e.hotelPref===o?'selected':''}>${o}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Budget (approx.)</label><input type="number" name="budget" value="${e.budget||''}"></div>
    </div>
    <div class="field"><label>Special Requests</label><textarea name="notes" rows="3">${e.notes||''}</textarea></div>
    <div class="field"><label>Payment Method</label>
      <select name="payment">
        ${['Stripe','PayPal','Bank Transfer','Cash on Arrival'].map(o=>`<option ${e.payment===o?'selected':''}>${o}</option>`).join('')}
      </select>
    </div>`;
}

route('/booking/:id', (args)=>{
  const p = DB.packages.find(x=>x.id===args.id);
  if(!p) return notFoundPage();
  const finalPrice = Math.round(p.price * (1 - (p.discount||0)/100));
  return `
  <section class="section-tight">
    <div class="container" style="max-width:760px">
      <div class="breadcrumb"><a href="#/">Home</a> / <a href="#/package/${p.id}">${p.title}</a> / Book</div>
      <div class="form-card reveal">
        <div class="eyebrow">Booking Form</div>
        <h1 style="font-size:1.6rem">Book: ${p.title}</h1>
        <p class="muted">Price per person: <b>${fmtMoney(finalPrice)}</b> · ${p.duration}</p>
        <form id="booking-form">
          ${bookingFieldsHtml(p)}
          <button class="btn btn-cta btn-block" type="submit">Confirm Booking</button>
          <p class="hint" style="text-align:center;margin-top:14px">You'll be able to edit this booking for ${DB.settings.editWindowHours} hours after it's placed.</p>
        </form>
      </div>
    </div>
  </section>`;
});

route('/booking-confirmed/:id', (args)=>{
  const b = DB.bookings.find(x=>x.id===args.id);
  if(!b) return notFoundPage();
  return `
  <section class="section">
    <div class="container confirm-wrap reveal">
      <div class="confirm-icon">✓</div>
      <h1>Booking Confirmed!</h1>
      <p class="muted">Thank you, ${b.name}. Your booking has been received. A confirmation would normally be emailed to <b>${b.email}</b> (simulated in this demo).</p>
      <div class="boarding-pass" style="transform:none;max-width:480px;margin:26px auto;text-align:left">
        <div class="bp-top"><b>${DB.settings.siteName.toUpperCase()}</b><span>E-TICKET</span></div>
        <div class="bp-body">
          <div class="bp-main">
            <div class="bp-route"><span class="city">${b.name.split(' ')[0]}</span><span class="line"></span><span class="plane">✈</span><span class="line"></span><span class="city">${b.packageTitle.split(' ')[0]}</span></div>
            <div class="bp-grid">
              <div><span>Booking ID</span><b>${b.id}</b></div>
              <div><span>Travel Date</span><b>${fmtDate(b.travelDate)}</b></div>
              <div><span>Return</span><b>${fmtDate(b.returnDate)}</b></div>
              <div><span>Adults</span><b>${b.adults}</b></div>
              <div><span>Children</span><b>${b.children}</b></div>
              <div><span>Status</span><b>${b.status}</b></div>
            </div>
          </div>
          <div class="bp-stub"><div class="qr"></div><small>${b.id}</small></div>
        </div>
      </div>
      <p class="hint">You can edit or cancel this booking from your <a href="#/dashboard">Dashboard</a> within ${DB.settings.editWindowHours} hours.</p>
      <a href="#/dashboard" class="btn btn-primary">Go to My Dashboard</a>
    </div>
  </section>`;
});

route('/gallery', ()=>{
  const cats = ['All', ...new Set(DB.gallery.map(g=>g.category))];
  return `
  <section class="section-tight">
    <div class="container">
      <div class="breadcrumb"><a href="#/">Home</a> / Gallery</div>
      <div class="section-head" style="margin-bottom:20px"><div class="eyebrow">Gallery</div><h1>Moments Worth Sharing</h1></div>
      <div class="pill-row" id="gallery-filters" style="margin-bottom:20px">
        ${cats.map((c,i)=>`<button class="pill ${i===0?'active':''}" data-cat="${c}">${c}</button>`).join('')}
      </div>
      <div class="masonry" id="gallery-grid">
        ${DB.gallery.map(g=>`<div class="m-item" data-cat="${g.category}"><img src="${g.url}" loading="lazy" data-full="${g.url}"></div>`).join('')}
      </div>
    </div>
  </section>`;
});

route('/reviews', ()=>{
  const approved = DB.reviews.filter(r=>r.approved);
  return `
  <section class="section-tight">
    <div class="container">
      <div class="breadcrumb"><a href="#/">Home</a> / Reviews</div>
      <div class="section-head" style="margin-bottom:26px"><div class="eyebrow">Reviews</div><h1>What Our Travelers Say</h1></div>
      <div class="grid grid-3">
        ${approved.map(r=>`
          <div class="card testimonial-card reveal">
            <div class="t-head"><img class="t-avatar" src="${r.avatar}"><div><div class="t-name">${r.name}</div><div class="t-country">${r.country}</div></div></div>
            <div class="stars">${starString(r.rating)}</div><p>"${r.text}"</p>
          </div>`).join('')}
      </div>
      <div class="form-card reveal" style="max-width:560px;margin:44px auto 0">
        <h3>Leave a Review</h3>
        <p class="hint">Only customers with a completed booking can submit reviews.</p>
        <form id="review-form">
          <div class="field"><label>Your Name</label><input required name="name"></div>
          <div class="field"><label>Country</label><input required name="country"></div>
          <div class="field"><label>Rating</label>
            <select name="rating">${[5,4,3,2,1].map(n=>`<option value="${n}">${n} Stars</option>`).join('')}</select>
          </div>
          <div class="field"><label>Your Review</label><textarea required rows="3" name="text"></textarea></div>
          <div class="field"><label>Your Photo (optional)</label><input type="file" accept="image/*" data-fill="avatar"><input type="hidden" name="avatar"></div>
          <button class="btn btn-cta btn-block">Submit Review</button>
          <p class="hint" style="text-align:center;margin-top:10px">Reviews are checked by our team before appearing publicly.</p>
        </form>
      </div>
    </div>
  </section>`;
});

route('/blog', ()=>{
  return `
  <section class="section-tight">
    <div class="container">
      <div class="breadcrumb"><a href="#/">Home</a> / Blog</div>
      <div class="section-head" style="margin-bottom:26px"><div class="eyebrow">Blog</div><h1>Travel Tips &amp; Stories</h1></div>
      <div class="grid grid-3">
        ${DB.blog.map(b=>`
          <div class="card reveal">
            <div class="pkg-media" style="height:180px"><img src="${b.image}"></div>
            <div class="pkg-body"><div class="pkg-dest">${fmtDate(b.date)}</div><div class="pkg-title" style="font-size:1.1rem">${b.title}</div><p class="pkg-desc">${b.excerpt}</p></div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
});

route('/faq', ()=>{
  return `
  <section class="section-tight">
    <div class="container" style="max-width:760px">
      <div class="breadcrumb"><a href="#/">Home</a> / FAQs</div>
      <div class="section-head" style="margin-bottom:26px"><div class="eyebrow">FAQs</div><h1>Frequently Asked Questions</h1></div>
      ${DB.faqs.map(f=>`<div class="panel reveal"><h3 style="font-size:1rem">${f.q}</h3><p class="muted" style="margin:0">${f.a}</p></div>`).join('')}
    </div>
  </section>`;
});

route('/contact', ()=>{
  const s = DB.settings;
  return `
  <section class="section-tight">
    <div class="container">
      <div class="breadcrumb"><a href="#/">Home</a> / Contact</div>
      <div class="section-head" style="margin-bottom:26px"><div class="eyebrow">Contact</div><h1>We'd Love to Hear From You</h1></div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:30px">
        <div class="form-card reveal">
          <form id="contact-form">
            <div class="field-row"><div class="field"><label>Name</label><input required name="name"></div><div class="field"><label>Email</label><input required type="email" name="email"></div></div>
            <div class="field"><label>Subject</label><input name="subject"></div>
            <div class="field"><label>Message</label><textarea required rows="4" name="message"></textarea></div>
            <button class="btn btn-cta btn-block">Send Message</button>
          </form>
        </div>
        <div class="reveal">
          <div class="panel"><h3>📍 Office Address</h3><p class="muted">${s.address}</p></div>
          <div class="panel"><h3>📞 Phone</h3><p class="muted">${s.phone}</p></div>
          <div class="panel"><h3>✉️ Email</h3><p class="muted">${s.email}</p></div>
          <div class="panel"><h3>🕐 Business Hours</h3><p class="muted">${s.hours}</p></div>
          <div class="panel" style="padding:0;overflow:hidden"><iframe title="map" width="100%" height="200" style="border:0;display:block" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&output=embed"></iframe></div>
        </div>
      </div>
    </div>
  </section>`;
});

route('/privacy', ()=>`<section class="section-tight"><div class="container" style="max-width:800px"><div class="breadcrumb"><a href="#/">Home</a> / Privacy Policy</div><h1>Privacy Policy</h1><p class="muted">${DB.settings.privacyText}</p></div></section>`);
route('/terms', ()=>`<section class="section-tight"><div class="container" style="max-width:800px"><div class="breadcrumb"><a href="#/">Home</a> / Terms &amp; Conditions</div><h1>Terms &amp; Conditions</h1><p class="muted">${DB.settings.termsText}</p></div></section>`);

/* ---------------------------- customer auth ------------------------------ */
route('/login', ()=>{
  if(currentCustomer()) { location.hash = '#/dashboard'; return ''; }
  return `
  <section class="section-tight">
    <div class="container auth-wrap">
      <div class="form-card reveal">
        <div class="eyebrow">Customer Login</div><h1 style="font-size:1.5rem">Welcome Back</h1>
        <form id="login-form">
          <div class="field"><label>Email</label><input required type="email" name="email"></div>
          <div class="field"><label>Password</label><input required type="password" name="password"></div>
          <button class="btn btn-cta btn-block">Log In</button>
        </form>
        <div class="auth-switch"><a href="#/forgot">Forgot password?</a></div>
        <div class="auth-switch">New here? <a href="#/register">Create an account</a></div>
      </div>
    </div>
  </section>`;
});

route('/register', ()=>{
  return `
  <section class="section-tight">
    <div class="container auth-wrap">
      <div class="form-card reveal">
        <div class="eyebrow">Create Account</div><h1 style="font-size:1.5rem">Join ${DB.settings.siteName}</h1>
        <form id="register-form">
          <div class="field"><label>Full Name</label><input required name="name"></div>
          <div class="field"><label>Email</label><input required type="email" name="email"></div>
          <div class="field"><label>Phone (optional)</label><input type="tel" name="phone" placeholder="e.g. +92 300 1234567"></div>
          <div class="field"><label>Password</label><input required type="password" name="password" minlength="6"></div>
          <div class="field"><label>Profile Picture (optional)</label><input type="file" accept="image/*" data-fill="avatar"><input type="hidden" name="avatar"></div>
          <div class="field"><label>Security Question <span class="muted" style="font-weight:400">(your own choice — used to reset your password)</span></label><input required name="securityQuestion" placeholder="e.g. What was your first pet's name?"></div>
          <div class="field"><label>Security Answer</label><input required name="securityAnswer"></div>
          <button class="btn btn-cta btn-block">Create Account</button>
        </form>
        <div class="auth-switch">Already have an account? <a href="#/login">Log in</a></div>
      </div>
    </div>
  </section>`;
});

route('/forgot', ()=>{
  return `
  <section class="section-tight">
    <div class="container auth-wrap">
      <div class="form-card reveal">
        <div class="eyebrow">Reset Password</div><h1 style="font-size:1.5rem">Forgot Your Password?</h1>
        <form id="forgot-email-form">
          <div class="field"><label>Your Account Email</label><input required type="email" name="email"></div>
          <button class="btn btn-primary btn-block">Continue</button>
        </form>
        <div id="forgot-step2"></div>
        <div class="auth-switch"><a href="#/login">Back to Login</a></div>
      </div>
    </div>
  </section>`;
});

function editWindowChip(b){
  const closes = b.createdAt + DB.settings.editWindowHours*3600*1000;
  const open = Date.now() < closes && ['Pending','Confirmed'].includes(b.status);
  if(open){
    const hrsLeft = Math.max(0,((closes-Date.now())/3600000)).toFixed(1);
    return `<span class="edit-window">Editable · ${hrsLeft}h left</span>`;
  }
  return `<span class="edit-window closed">Edit window closed</span>`;
}

function myBookingsTableHtml(list){
  if(list.length===0) return `<div class="empty-state"><div class="em-icon">🔍</div>No bookings match that filter.</div>`;
  return `<div class="table-wrap"><table>
    <thead><tr><th>Booking ID</th><th>Package</th><th>Travel Date</th><th>Status</th><th>Edit Window</th><th>Actions</th></tr></thead>
    <tbody>
    ${list.map(b=>`
      <tr>
        <td>${b.id}</td><td>${b.packageTitle}</td><td>${fmtDate(b.travelDate)}</td>
        <td><span class="badge badge-${b.status.toLowerCase()}">${b.status}</span></td>
        <td>${editWindowChip(b)}</td>
        <td class="row-actions">
          <button data-edit="${b.id}" ${(Date.now() > b.createdAt + DB.settings.editWindowHours*3600*1000 || !['Pending','Confirmed'].includes(b.status))?'disabled':''}>Edit</button>
          <button data-cancel="${b.id}" ${(Date.now() > b.createdAt + DB.settings.editWindowHours*3600*1000 || b.status==='Cancelled')?'disabled':''}>Cancel</button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

let dashHistoryFilter = {month:'', year:''};
route('/dashboard', ()=>{
  const c = currentCustomer();
  if(!c){ return `<section class="section"><div class="container" style="text-align:center"><h2>Please log in to view your dashboard</h2><a href="#/login" class="btn btn-cta">Log In</a></div></section>`; }
  const myBookings = DB.bookings.filter(b=>b.customerEmail===c.email).sort((a,b)=>b.createdAt-a.createdAt);
  const myQuestions = DB.questions.filter(q=>q.customerEmail===c.email).sort((a,b)=>b.createdAt-a.createdAt);
  const years = [...new Set(myBookings.map(b=>new Date(b.travelDate).getFullYear()))].sort((a,b)=>b-a);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let filteredBookings = myBookings;
  if(dashHistoryFilter.month !== '') filteredBookings = filteredBookings.filter(b=>new Date(b.travelDate).getMonth()===Number(dashHistoryFilter.month));
  if(dashHistoryFilter.year !== '') filteredBookings = filteredBookings.filter(b=>new Date(b.travelDate).getFullYear()===Number(dashHistoryFilter.year));
  return `
  <section class="section-tight">
    <div class="container">
      <div class="dash-topbar">
        <div class="dash-welcome">
          ${c.avatar? `<img class="avatar-lg" src="${c.avatar}">` : `<div class="avatar-circle-placeholder">${c.name.charAt(0).toUpperCase()}</div>`}
          <div><div class="eyebrow">Customer Dashboard</div><h1 style="margin:0">Welcome, ${c.name}</h1></div>
        </div>
        <button class="btn btn-ghost" id="logout-btn">Log Out</button>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card"><span>Total Bookings</span><b>${myBookings.length}</b></div>
        <div class="kpi-card"><span>Upcoming Trips</span><b>${myBookings.filter(b=>['Pending','Confirmed'].includes(b.status)).length}</b></div>
        <div class="kpi-card"><span>Completed</span><b>${myBookings.filter(b=>b.status==='Completed').length}</b></div>
        <div class="kpi-card"><span>Wishlist</span><b>${(DB.wishlist&&DB.wishlist[c.email]||[]).length}</b></div>
      </div>
      <div class="panel">
        <h3>My Bookings &amp; History</h3>
        ${myBookings.length===0? `<div class="empty-state"><div class="em-icon">🧳</div>No bookings yet — <a href="#/packages">browse packages</a> to book your first trip.</div>` : `
        <div class="filter-bar" style="margin-bottom:16px">
          <select id="hist-month"><option value="">All Months</option>${months.map((m,i)=>`<option value="${i}" ${String(i)===dashHistoryFilter.month?'selected':''}>${m}</option>`).join('')}</select>
          <select id="hist-year"><option value="">All Years</option>${years.map(y=>`<option ${String(y)===dashHistoryFilter.year?'selected':''}>${y}</option>`).join('')}</select>
        </div>
        ${myBookingsTableHtml(filteredBookings)}`}
      </div>
      <div id="edit-booking-slot"></div>

      <div class="panel">
        <h3>Ask a Question</h3>
        <p class="hint">Have something you'd like to ask our team? Submit it here — the answer will appear below once we reply.</p>
        <form id="ask-question-form">
          <div class="field"><label>Your Question</label><textarea required name="question" rows="2" placeholder="e.g. Can I add an extra night to my Maldives trip?"></textarea></div>
          <button class="btn btn-primary">Submit Question</button>
        </form>
        <div style="margin-top:18px">
          ${myQuestions.length===0? `<p class="muted" style="margin:0">You haven't asked any questions yet.</p>` :
          myQuestions.map(q=>`
            <div class="qa-item">
              <div class="q">Q: ${q.question}</div>
              <div class="muted" style="font-size:.78rem">${new Date(q.createdAt).toLocaleString()}</div>
              ${q.answer? `<div class="a">A: ${q.answer}</div>` : `<span class="qa-status badge-pending" style="background:#FFF1DB;color:#C98A1E;display:inline-block;margin-top:8px">Awaiting answer</span>`}
            </div>`).join('')}
        </div>
      </div>

      <div class="panel">
        <h3>Profile Settings</h3>
        <form id="profile-form">
          <div class="field-row">
            <div class="field"><label>Full Name</label><input name="name" value="${c.name}"></div>
            <div class="field"><label>Email</label><input value="${c.email}" disabled></div>
          </div>
          <div class="field"><label>Phone (optional)</label><input type="tel" name="phone" value="${c.phone||''}"></div>
          <div class="field"><label>Profile Picture</label><input type="file" accept="image/*" data-fill="avatar"><input type="hidden" name="avatar" value="${c.avatar||''}">${c.avatar?`<img class="upload-thumb" src="${c.avatar}">`:''}</div>
          <button class="btn btn-primary">Save Changes</button>
        </form>
      </div>

      <div class="panel">
        <h3>Change Password</h3>
        <form id="cust-change-password-form">
          <div class="field"><label>Current Password</label><input type="password" name="current" required></div>
          <div class="field-row">
            <div class="field"><label>New Password</label><input type="password" name="newPassword" minlength="6" required></div>
            <div class="field"><label>Confirm New Password</label><input type="password" name="confirmPassword" minlength="6" required></div>
          </div>
          <button class="btn btn-primary">Update Password</button>
        </form>
      </div>

      <div class="panel">
        <h3>Security Question</h3>
        <p class="hint">Used to reset your password if you forget it.</p>
        <form id="cust-change-security-form">
          <div class="field"><label>Security Question</label><input name="question" value="${c.securityQuestion||''}" required></div>
          <div class="field"><label>New Answer</label><input name="answer" required placeholder="Enter a new answer"></div>
          <button class="btn btn-primary">Update Security Question</button>
        </form>
      </div>
    </div>
  </section>`;
});

/* ------------------------------ admin ------------------------------------ */
route('/admin/login', ()=>{
  if(adminAuthed){ location.hash = '#/admin'; return ''; }
  return `
  <section class="section-tight">
    <div class="container auth-wrap">
      <div class="form-card reveal">
        <div class="eyebrow">Admin</div><h1 style="font-size:1.5rem">Administrator Login</h1>
        <form id="admin-login-form">
          <div class="field"><label>Username</label><input required name="username"></div>
          <div class="field"><label>Password</label><input required type="password" name="password"></div>
          <button class="btn btn-cta btn-block">Log In</button>
        </form>
        <div class="auth-switch"><a href="#/admin/forgot">Forgot password?</a></div>
      </div>
    </div>
  </section>`;
});

route('/admin/forgot', ()=>{
  return `
  <section class="section-tight">
    <div class="container auth-wrap">
      <div class="form-card reveal">
        <div class="eyebrow">Admin</div><h1 style="font-size:1.5rem">Reset Admin Password</h1>
        <form id="admin-forgot-form">
          <div class="field"><label>Username</label><input required name="username" value="${DB.admin.username}"></div>
          <div class="field"><label>${DB.admin.securityQuestion}</label><input required name="answer"></div>
          <div class="field"><label>New Password</label><input required type="password" minlength="6" name="newPassword"></div>
          <button class="btn btn-cta btn-block">Reset Password</button>
        </form>
      </div>
    </div>
  </section>`;
});

function adminGuard(){
  if(!adminAuthed){ location.hash = '#/admin/login'; return false; }
  return true;
}

const adminNavGroups = [
  {label:'Overview', items:[['overview','📊 Dashboard']]},
  {label:'Content', items:[['packages','🧳 Packages'],['bookings','🎫 Bookings'],['gallery','🖼 Gallery'],['reviews','⭐ Reviews'],['blog','📰 Blog'],['faqs','❓ FAQs'],['questions','💬 Customer Questions']]},
  {label:'People', items:[['customers','👥 Customers'],['messages','✉️ Messages']]},
  {label:'Store', items:[['coupons','🏷 Coupons']]},
  {label:'Configuration', items:[['settings','⚙️ Site Settings'],['account','🔐 Account & Security']]},
];

function adminShell(active, body){
  return `
  <div class="dash-shell">
    <aside class="dash-sidebar">
      <div class="brand"><span class="brand-mark">✈</span><span class="brand-name">${DB.settings.siteName}</span></div>
      <nav class="dash-nav">
        ${adminNavGroups.map(g=>`<div class="group-label">${g.label}</div>${g.items.map(([k,label])=>{
          let unread = 0;
          if(k==='messages') unread = DB.messages.filter(m=>!m.read).length;
          if(k==='questions') unread = DB.questions.filter(q=>q.status==='pending').length;
          return `<a href="#/admin/${k}" class="${active===k?'active':''}">${label}${unread?`<span class="nav-badge">${unread}</span>`:''}</a>`;
        }).join('')}`).join('')}
        <div class="group-label">&nbsp;</div>
        <a href="#/" >🌐 View Site</a>
        <a href="#" id="admin-logout">🚪 Log Out</a>
      </nav>
    </aside>
    <div class="dash-main">${body}</div>
  </div>`;
}

route('/admin', ()=>{ location.hash='#/admin/overview'; return ''; });

route('/admin/overview', ()=>{
  if(!adminGuard()) return '';
  const revenue = DB.bookings.filter(b=>b.status!=='Cancelled').reduce((sum,b)=>{
    const p = DB.packages.find(x=>x.id===b.packageId); if(!p) return sum;
    return sum + Math.round(p.price*(1-(p.discount||0)/100))*(Number(b.adults)+Number(b.children)*0.7);
  },0);
  const body = `
    <div class="dash-topbar"><h1>Dashboard Overview</h1><span class="muted">Welcome back, ${DB.admin.username}</span></div>
    <div class="kpi-grid">
      <div class="kpi-card"><span>Total Bookings</span><b>${DB.bookings.length}</b></div>
      <div class="kpi-card"><span>Revenue</span><b>${fmtMoney(Math.round(revenue))}</b></div>
      <div class="kpi-card"><span>Customers</span><b>${DB.customers.length}</b></div>
      <div class="kpi-card"><span>Tour Packages</span><b>${DB.packages.length}</b></div>
      <div class="kpi-card"><span>Reviews</span><b>${DB.reviews.length}</b></div>
      <div class="kpi-card"><span>Gallery Images</span><b>${DB.gallery.length}</b></div>
      <div class="kpi-card"><span>Pending Bookings</span><b>${DB.bookings.filter(b=>b.status==='Pending').length}</b></div>
      <div class="kpi-card"><span>Unread Messages</span><b>${DB.messages.filter(m=>!m.read).length}</b></div>
    </div>
    <div class="panel">
      <h3>Recent Activity</h3>
      ${DB.activityLog.length===0?`<div class="empty-state"><div class="em-icon">🕐</div>No activity yet.</div>`:
        `<div class="table-wrap"><table><tbody>${DB.activityLog.map(a=>`<tr><td>${a.text}</td><td class="muted">${new Date(a.at).toLocaleString()}</td></tr>`).join('')}</tbody></table></div>`}
    </div>
    <div class="panel">
      <h3>Recent Bookings</h3>
      ${bookingsTable(DB.bookings.slice(0,6))}
    </div>
  `;
  return adminShell('overview', body);
});

function bookingsTable(list){
  if(list.length===0) return `<div class="empty-state"><div class="em-icon">🎫</div>No bookings yet.</div>`;
  return `<div class="table-wrap"><table>
    <thead><tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Status</th><th>Edit Window</th><th>Actions</th></tr></thead>
    <tbody>
    ${list.map(b=>`
      <tr>
        <td>${b.id}</td><td>${b.name}<br><span class="muted">${b.email}</span></td><td>${b.packageTitle}</td><td>${fmtDate(b.travelDate)}</td>
        <td><span class="badge badge-${b.status.toLowerCase()}">${b.status}</span></td>
        <td>${editWindowChip(b)}</td>
        <td class="row-actions">
          <button data-status="${b.id}|Confirmed">Accept</button>
          <button data-status="${b.id}|Completed">Complete</button>
          <button data-status="${b.id}|Cancelled">Cancel</button>
          <button data-status="${b.id}|Refunded">Refund</button>
        </td>
      </tr>`).join('')}
    </tbody></table></div>`;
}

route('/admin/bookings', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Booking Management</h1></div>
    <div class="panel">
      <h3>All Bookings (${DB.bookings.length})</h3>
      ${bookingsTable(DB.bookings.sort((a,b)=>b.createdAt-a.createdAt))}
    </div>
  `;
  return adminShell('bookings', body);
});

function pkgRow(p){
  const finalPrice = Math.round(p.price * (1 - (p.discount||0)/100));
  return `<tr>
    <td><img src="${p.image}" style="width:44px;height:44px;object-fit:cover;border-radius:8px"></td>
    <td>${p.title}<br><span class="muted">${p.destination}, ${p.country}</span></td>
    <td>${p.category}</td>
    <td>${fmtMoney(finalPrice)}${p.discount?` <span class="muted">(-${p.discount}%)</span>`:''}</td>
    <td>${p.featured?'⭐':''}</td>
    <td><span class="badge badge-${p.status==='active'?'confirmed':'cancelled'}">${p.status}</span></td>
    <td class="row-actions">
      <button data-edit-pkg="${p.id}">Edit</button>
      <button data-dup-pkg="${p.id}">Duplicate</button>
      <button data-archive-pkg="${p.id}">${p.status==='active'?'Archive':'Activate'}</button>
      <button data-del-pkg="${p.id}">Delete</button>
    </td>
  </tr>`;
}

function pkgFormHtml(p){
  const e = p || {title:'',destination:'',country:'',category:'Adventure',price:0,discount:0,duration:'',rating:5,ratingCount:0,image:'',description:'',hotel:'',featured:false};
  return `
  <div class="field-row">
    <div class="field"><label>Title</label><input name="title" value="${e.title}" required></div>
    <div class="field"><label>Category</label>
      <select name="category">${['Adventure','Family','Honeymoon','Religious','Luxury','Beach','Mountain'].map(c=>`<option ${e.category===c?'selected':''}>${c}</option>`).join('')}</select>
    </div>
  </div>
  <div class="field-row">
    <div class="field"><label>Destination</label><input name="destination" value="${e.destination}" required></div>
    <div class="field"><label>Country</label><input name="country" value="${e.country}" required></div>
  </div>
  <div class="field-row">
    <div class="field"><label>Price (USD)</label><input type="number" name="price" value="${e.price}" required></div>
    <div class="field"><label>Discount (%)</label><input type="number" name="discount" value="${e.discount||0}"></div>
  </div>
  <div class="field-row">
    <div class="field"><label>Duration</label><input name="duration" value="${e.duration}" placeholder="e.g. 5 Days / 4 Nights"></div>
    <div class="field"><label>Hotel</label><input name="hotel" value="${e.hotel||''}"></div>
  </div>
  <div class="field"><label>Cover Image URL</label><input name="image" value="${e.image}"></div>
  <div class="field"><label>Or Upload From Device</label><input type="file" accept="image/*" data-fill="image">${e.image?`<img class="upload-thumb" src="${e.image}">`:''}</div>
  <div class="field"><label>Description</label><textarea name="description" rows="3">${e.description}</textarea></div>
  <div class="field"><label><input type="checkbox" name="featured" ${e.featured?'checked':''}> Featured on homepage</label></div>
  `;
}

route('/admin/packages', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Tour Packages</h1><button class="btn btn-cta" id="new-pkg-btn">+ Add Package</button></div>
    <div id="pkg-form-slot"></div>
    <div class="panel">
      <div class="table-wrap"><table>
        <thead><tr><th>Image</th><th>Package</th><th>Category</th><th>Price</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${DB.packages.map(pkgRow).join('')}</tbody>
      </table></div>
    </div>
  `;
  return adminShell('packages', body);
});

route('/admin/gallery', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Gallery Management</h1></div>
    <div class="panel">
      <h3>Upload New Image</h3>
      <form id="gallery-add-form" class="field-row" style="align-items:end">
        <div class="field"><label>Image URL</label><input name="url" placeholder="https://..."></div>
        <div class="field"><label>Or Upload From Device</label><input type="file" accept="image/*" data-fill="url"></div>
        <div class="field"><label>Category</label>
          <select name="category">${['Beaches','Mountains','Adventure','Wildlife','Cities','Honeymoon','Historical Places'].map(c=>`<option>${c}</option>`).join('')}</select>
        </div>
        <button class="btn btn-primary" style="height:44px">Add Image</button>
      </form>
    </div>
    <div class="panel">
      <h3>All Images (${DB.gallery.length})</h3>
      <div class="grid grid-4">
        ${DB.gallery.map(g=>`
          <div class="card" style="padding:10px">
            <img src="${g.url}" style="height:100px;width:100%;object-fit:cover;border-radius:8px;margin-bottom:8px">
            <div class="muted" style="font-size:.78rem;margin-bottom:8px">${g.category}</div>
            <button class="btn btn-sm btn-danger btn-block" data-del-img="${g.id}">Delete</button>
          </div>`).join('')}
      </div>
    </div>
  `;
  return adminShell('gallery', body);
});

route('/admin/reviews', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Reviews Management</h1></div>
    <div class="panel">
      <div class="table-wrap"><table>
        <thead><tr><th>Name</th><th>Country</th><th>Rating</th><th>Review</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
        ${DB.reviews.map(r=>`
          <tr><td>${r.name}</td><td>${r.country}</td><td class="stars">${starString(r.rating)}</td><td style="white-space:normal;max-width:300px">${r.text}</td>
          <td><span class="badge badge-${r.approved?'confirmed':'pending'}">${r.approved?'Approved':'Pending'}</span></td>
          <td class="row-actions">
            <button data-approve-rev="${r.id}">${r.approved?'Unapprove':'Approve'}</button>
            <button data-del-rev="${r.id}">Delete</button>
          </td></tr>`).join('')}
        </tbody>
      </table></div>
    </div>
  `;
  return adminShell('reviews', body);
});

route('/admin/blog', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Blog Management</h1></div>
    <div class="panel">
      <h3>Add Article</h3>
      <form id="blog-add-form">
        <div class="field-row">
          <div class="field"><label>Title</label><input name="title" required></div>
          <div class="field"><label>Image URL</label><input name="image"></div>
        </div>
        <div class="field"><label>Or Upload From Device</label><input type="file" accept="image/*" data-fill="image"></div>
        <div class="field"><label>Excerpt</label><textarea name="excerpt" rows="2" required></textarea></div>
        <button class="btn btn-primary">Publish Article</button>
      </form>
    </div>
    <div class="panel">
      <div class="table-wrap"><table>
        <thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>${DB.blog.map(b=>`<tr><td>${b.title}</td><td>${fmtDate(b.date)}</td><td class="row-actions"><button data-del-blog="${b.id}">Delete</button></td></tr>`).join('')}</tbody>
      </table></div>
    </div>
  `;
  return adminShell('blog', body);
});

route('/admin/faqs', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>FAQ Management</h1></div>
    <div class="panel">
      <h3>Add FAQ</h3>
      <form id="faq-add-form">
        <div class="field"><label>Question</label><input name="q" required></div>
        <div class="field"><label>Answer</label><textarea name="a" rows="2" required></textarea></div>
        <button class="btn btn-primary">Add FAQ</button>
      </form>
    </div>
    <div class="panel">
      ${DB.faqs.map(f=>`<div style="display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)"><div><b>${f.q}</b><p class="muted" style="margin:2px 0 0">${f.a}</p></div><button class="btn btn-sm" data-del-faq="${f.id}">Delete</button></div>`).join('')}
    </div>
  `;
  return adminShell('faqs', body);
});

route('/admin/questions', ()=>{
  if(!adminGuard()) return '';
  const list = DB.questions.slice().sort((a,b)=>b.createdAt-a.createdAt);
  const body = `
    <div class="dash-topbar"><h1>Customer Questions</h1><span class="muted">${DB.questions.filter(q=>q.status==='pending').length} awaiting reply</span></div>
    <div class="panel">
      ${list.length===0? `<div class="empty-state"><div class="em-icon">💬</div>No questions yet — questions customers ask from their dashboard will appear here.</div>` :
      list.map(q=>`
        <div class="qa-item">
          <div class="q">${q.customerName} <span class="muted" style="font-weight:400">(${q.customerEmail})</span> asked:</div>
          <p style="margin:6px 0">${q.question}</p>
          <div class="muted" style="font-size:.78rem;margin-bottom:10px">${new Date(q.createdAt).toLocaleString()} · <span class="badge badge-${q.status==='answered'?'confirmed':'pending'}">${q.status==='answered'?'Answered':'Pending'}</span></div>
          <form class="reply-question-form" data-qid="${q.id}">
            <div class="field"><label>Your Reply</label><textarea name="reply" rows="2" required>${q.answer||''}</textarea></div>
            <button class="btn btn-primary btn-sm">Send Reply</button>
          </form>
        </div>`).join('')}
    </div>
  `;
  return adminShell('questions', body);
});

route('/admin/customers', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Customer Management</h1></div>
    <div class="panel">
      <div class="table-wrap"><table>
        <thead><tr><th></th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Bookings</th><th>Actions</th></tr></thead>
        <tbody>
        ${DB.customers.map(c=>`<tr>
          <td>${c.avatar?`<img src="${c.avatar}" style="width:34px;height:34px;border-radius:50%;object-fit:cover">`:`<div class="avatar-circle-placeholder" style="width:34px;height:34px;font-size:.85rem">${c.name.charAt(0).toUpperCase()}</div>`}</td>
          <td>${c.name}</td><td>${c.email}</td><td>${c.phone||'—'}</td><td>${fmtDate(c.joined)}</td><td>${DB.bookings.filter(b=>b.customerEmail===c.email).length}</td>
          <td class="row-actions"><a class="btn btn-sm" href="#/admin/customer/${encodeURIComponent(c.email)}">View History</a><button data-del-cust="${c.email}">Delete</button></td></tr>`).join('')}
        </tbody>
      </table></div>
      ${DB.customers.length===0?`<div class="empty-state"><div class="em-icon">👥</div>No registered customers yet.</div>`:''}
    </div>
  `;
  return adminShell('customers', body);
});

let adminCustHistoryFilter = {month:'', year:''};
route('/admin/customer/:email', (args)=>{
  if(!adminGuard()) return '';
  const email = args.email;
  const c = DB.customers.find(x=>x.email===email);
  if(!c) return notFoundPage();
  const allBookings = DB.bookings.filter(b=>b.customerEmail===email).sort((a,b)=>b.createdAt-a.createdAt);
  const myQuestions = DB.questions.filter(q=>q.customerEmail===email).sort((a,b)=>b.createdAt-a.createdAt);
  const years = [...new Set(allBookings.map(b=>new Date(b.travelDate).getFullYear()))].sort((a,b)=>b-a);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let filtered = allBookings;
  if(adminCustHistoryFilter.month !== '') filtered = filtered.filter(b=>new Date(b.travelDate).getMonth()===Number(adminCustHistoryFilter.month));
  if(adminCustHistoryFilter.year !== '') filtered = filtered.filter(b=>new Date(b.travelDate).getFullYear()===Number(adminCustHistoryFilter.year));
  const body = `
    <div class="dash-topbar"><h1>Customer: ${c.name}</h1><a href="#/admin/customers" class="btn btn-ghost">← Back to Customers</a></div>
    <div class="panel" style="display:flex;gap:18px;align-items:center">
      ${c.avatar?`<img class="avatar-lg" src="${c.avatar}">`:`<div class="avatar-circle-placeholder">${c.name.charAt(0).toUpperCase()}</div>`}
      <div>
        <div><b>${c.name}</b></div>
        <div class="muted">${c.email}${c.phone?` · ${c.phone}`:''}</div>
        <div class="muted">Joined ${fmtDate(c.joined)} · Security question: "${c.securityQuestion||'—'}"</div>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card"><span>Total Bookings (All Time)</span><b>${allBookings.length}</b></div>
      <div class="kpi-card"><span>Completed</span><b>${allBookings.filter(b=>b.status==='Completed').length}</b></div>
      <div class="kpi-card"><span>Cancelled</span><b>${allBookings.filter(b=>b.status==='Cancelled').length}</b></div>
      <div class="kpi-card"><span>Questions Asked</span><b>${myQuestions.length}</b></div>
    </div>
    <div class="panel">
      <h3>Booking History</h3>
      <div class="filter-bar" style="margin-bottom:16px">
        <select id="admin-hist-month"><option value="">All Months</option>${months.map((m,i)=>`<option value="${i}" ${String(i)===adminCustHistoryFilter.month?'selected':''}>${m}</option>`).join('')}</select>
        <select id="admin-hist-year"><option value="">All Years</option>${years.map(y=>`<option ${String(y)===adminCustHistoryFilter.year?'selected':''}>${y}</option>`).join('')}</select>
      </div>
      ${bookingsTable(filtered)}
    </div>
    <div class="panel">
      <h3>Questions Asked</h3>
      ${myQuestions.length===0? `<p class="muted" style="margin:0">No questions asked yet.</p>` :
      myQuestions.map(q=>`<div class="qa-item"><div class="q">${q.question}</div>${q.answer?`<div class="a">A: ${q.answer}</div>`:`<span class="qa-status" style="background:#FFF1DB;color:#C98A1E">Awaiting reply</span>`}</div>`).join('')}
    </div>
  `;
  return adminShell('customers', body);
});

route('/admin/messages', ()=>{
  if(!adminGuard()) return '';
  const list = DB.messages.slice().sort((a,b)=>b.createdAt-a.createdAt);
  const body = `
    <div class="dash-topbar"><h1>Customer Messages</h1><span class="muted">${DB.messages.filter(m=>!m.read).length} unread</span></div>
    <div class="panel">
      ${list.length===0? `<div class="empty-state"><div class="em-icon">✉️</div>No messages yet — submissions from the Contact page will appear here.</div>` : `
      <div class="table-wrap"><table>
        <thead><tr><th>From</th><th>Subject</th><th>Message</th><th>Received</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
        ${list.map(m=>`
          <tr>
            <td>${m.name}<br><span class="muted">${m.email}</span></td>
            <td>${m.subject}</td>
            <td style="white-space:normal;max-width:320px">${m.message}</td>
            <td class="muted">${new Date(m.createdAt).toLocaleString()}</td>
            <td><span class="badge badge-${m.read?'completed':'pending'}">${m.read?'Read':'Unread'}</span></td>
            <td class="row-actions">
              <button data-toggle-msg="${m.id}">${m.read?'Mark Unread':'Mark Read'}</button>
              <button data-del-msg="${m.id}">Delete</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>`}
    </div>
  `;
  return adminShell('messages', body);
});

route('/admin/coupons', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Coupons</h1></div>
    <div class="panel">
      <h3>Create Coupon</h3>
      <form id="coupon-add-form" class="field-row">
        <div class="field"><label>Code</label><input name="code" required style="text-transform:uppercase"></div>
        <div class="field"><label>Discount (%)</label><input name="discount" type="number" required></div>
        <div class="field"><label>Expiry</label><input name="expiry" type="date" required></div>
        <div class="field"><label>Usage Limit</label><input name="usageLimit" type="number" value="100"></div>
        <button class="btn btn-primary" style="height:44px">Create</button>
      </form>
    </div>
    <div class="panel">
      <div class="table-wrap"><table>
        <thead><tr><th>Code</th><th>Discount</th><th>Expiry</th><th>Used</th><th>Actions</th></tr></thead>
        <tbody>${DB.coupons.map(c=>`<tr><td>${c.code}</td><td>${c.discount}%</td><td>${fmtDate(c.expiry)}</td><td>${c.used}/${c.usageLimit}</td><td><button data-del-cpn="${c.id}">Delete</button></td></tr>`).join('')}</tbody>
      </table></div>
    </div>
  `;
  return adminShell('coupons', body);
});

route('/admin/settings', ()=>{
  if(!adminGuard()) return '';
  const s = DB.settings;
  const body = `
    <div class="dash-topbar"><h1>Website Settings</h1></div>
    <form id="settings-form">
      <div class="panel">
        <h3>Branding</h3>
        <div class="field-row">
          <div class="field"><label>Website Name</label><input name="siteName" value="${s.siteName}"></div>
          <div class="field"><label>Tagline</label><input name="tagline" value="${s.tagline}"></div>
        </div>
        <div class="field"><label>About Text</label><textarea name="aboutText" rows="2">${s.aboutText}</textarea></div>
        <div class="field-row">
          <div class="field"><label>Mission</label><textarea name="mission" rows="2">${s.mission}</textarea></div>
          <div class="field"><label>Vision</label><textarea name="vision" rows="2">${s.vision}</textarea></div>
        </div>
        <div class="field"><label>Company Story</label><textarea name="story" rows="2">${s.story}</textarea></div>
        <div class="field"><label>Homepage Hero Image URL</label><input name="heroImage" value="${s.heroImage}"></div>
        <div class="field"><label>Or Upload From Device</label><input type="file" accept="image/*" data-fill="heroImage"><img class="upload-thumb" src="${s.heroImage}"></div>
      </div>
      <div class="panel">
        <h3>Legal Pages</h3>
        <div class="field"><label>Privacy Policy Text</label><textarea name="privacyText" rows="4">${s.privacyText}</textarea></div>
        <div class="field"><label>Terms &amp; Conditions Text</label><textarea name="termsText" rows="4">${s.termsText}</textarea></div>
      </div>
      <div class="panel">
        <h3>Booking Rules</h3>
        <div class="field"><label>Booking Edit Window (hours)</label><input type="number" name="editWindowHours" value="${s.editWindowHours}"></div>
        <p class="hint">Customers can edit or cancel a new booking for this many hours after placing it. After that, it locks automatically.</p>
      </div>
      <div class="panel">
        <h3>Contact & Business Info</h3>
        <div class="field-row">
          <div class="field"><label>Address</label><input name="address" value="${s.address}"></div>
          <div class="field"><label>Phone</label><input name="phone" value="${s.phone}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Email</label><input name="email" value="${s.email}"></div>
          <div class="field"><label>Business Hours</label><input name="hours" value="${s.hours}"></div>
        </div>
        <div class="field"><label>Map Location (address/city used for embed)</label><input name="mapQuery" value="${s.mapQuery}"></div>
      </div>
      <div class="panel">
        <h3>Social Links</h3>
        <div class="field-row">
          <div class="field"><label>Facebook</label><input name="social_facebook" value="${s.social.facebook}"></div>
          <div class="field"><label>Instagram</label><input name="social_instagram" value="${s.social.instagram}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Twitter / X</label><input name="social_twitter" value="${s.social.twitter}"></div>
          <div class="field"><label>YouTube</label><input name="social_youtube" value="${s.social.youtube}"></div>
        </div>
      </div>
      <div class="panel">
        <h3>Currency &amp; Stats</h3>
        <div class="field-row">
          <div class="field"><label>Currency Symbol</label><input name="currencySymbol" value="${s.currencySymbol}"></div>
          <div class="field"><label>Currency Code</label><input name="currency" value="${s.currency}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Happy Customers</label><input type="number" name="stat_customers" value="${s.stats.customers}"></div>
          <div class="field"><label>Countries Covered</label><input type="number" name="stat_countries" value="${s.stats.countries}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Tours Completed</label><input type="number" name="stat_tours" value="${s.stats.tours}"></div>
          <div class="field"><label>Years Experience</label><input type="number" name="stat_years" value="${s.stats.years}"></div>
        </div>
        <div class="field"><label>Hotel Partners</label><input type="number" name="stat_hotels" value="${s.stats.hotels}"></div>
      </div>
      <div class="panel">
        <h3>Maintenance Mode</h3>
        <label><input type="checkbox" name="maintenanceMode" ${s.maintenanceMode?'checked':''}> Put the public site into maintenance mode</label>
      </div>
      <button class="btn btn-cta" style="padding:14px 30px">Save All Settings</button>
    </form>
  `;
  return adminShell('settings', body);
});

route('/admin/account', ()=>{
  if(!adminGuard()) return '';
  const body = `
    <div class="dash-topbar"><h1>Account & Security</h1></div>
    <div class="panel">
      <h3>Change Username</h3>
      <form id="change-username-form" class="field-row" style="align-items:end">
        <div class="field"><label>New Username</label><input name="username" value="${DB.admin.username}" required></div>
        <button class="btn btn-primary" style="height:44px">Update Username</button>
      </form>
    </div>
    <div class="panel">
      <h3>Change Password</h3>
      <form id="change-password-form">
        <div class="field"><label>Current Password</label><input type="password" name="current" required></div>
        <div class="field-row">
          <div class="field"><label>New Password</label><input type="password" name="newPassword" minlength="6" required></div>
          <div class="field"><label>Confirm New Password</label><input type="password" name="confirmPassword" minlength="6" required></div>
        </div>
        <button class="btn btn-primary">Update Password</button>
      </form>
    </div>
    <div class="panel">
      <h3>Change Security Question</h3>
      <form id="change-security-form">
        <div class="field"><label>Security Question</label><input name="question" value="${DB.admin.securityQuestion}" required></div>
        <div class="field"><label>New Answer</label><input name="answer" required placeholder="Enter a new answer"></div>
        <button class="btn btn-primary">Update Security Question</button>
      </form>
    </div>
  `;
  return adminShell('account', body);
});

/* ------------------------------ password visibility ------------------------ */
function wirePasswordToggles(root){
  (root||document).querySelectorAll('input[type="password"]:not([data-pw-wired])').forEach(input=>{
    input.dataset.pwWired = '1';
    const wrap = document.createElement('div');
    wrap.className = 'pw-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'pw-toggle'; btn.textContent = '👁'; btn.setAttribute('aria-label','Show password');
    wrap.appendChild(btn);
    btn.addEventListener('click', ()=>{
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? '🙈' : '👁';
    });
  });
}

/* ============================ page scripts =============================== */
function wirePageScripts(){
  // theme toggle handled globally, not here

  // ---- Home search
  const homeSearchBtn = document.getElementById('home-search-btn');
  if(homeSearchBtn){
    homeSearchBtn.addEventListener('click', ()=>{
      const dest = document.getElementById('home-search-dest').value.trim();
      const cat = document.getElementById('home-search-cat').value;
      const budget = document.getElementById('home-search-budget').value;
      const q = new URLSearchParams();
      if(dest) q.set('destination', dest);
      if(cat) q.set('category', cat);
      if(budget) q.set('price', budget);
      location.hash = '#/packages?' + q.toString();
    });
  }
  const newsletterForm = document.getElementById('newsletter-form');
  if(newsletterForm) newsletterForm.addEventListener('submit', e=>{ e.preventDefault(); toast('Subscribed! Watch your inbox for travel deals.', 'success'); newsletterForm.reset(); });

  // ---- Packages listing
  const pkgResults = document.getElementById('pkg-results');
  if(pkgResults){
    const applyFilters = ()=>{
      let list = DB.packages.filter(p=>p.status==='active');
      const country = document.getElementById('f-country').value;
      const category = document.getElementById('f-category').value;
      const price = Number(document.getElementById('f-price').value)||0;
      const destQ = document.getElementById('f-dest').value.trim().toLowerCase();
      const sort = document.getElementById('f-sort').value;
      if(country) list = list.filter(p=>p.country===country);
      if(category) list = list.filter(p=>p.category===category);
      if(price) list = list.filter(p=>Math.round(p.price*(1-(p.discount||0)/100)) <= price);
      if(destQ) list = list.filter(p=>p.destination.toLowerCase().includes(destQ) || p.title.toLowerCase().includes(destQ));
      if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
      if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
      if(sort==='rating') list.sort((a,b)=>b.rating-a.rating);
      pkgResults.innerHTML = list.length? list.map(pkgCard).join('') : `<div class="empty-state" style="grid-column:1/-1"><div class="em-icon">🔍</div>No packages match your filters. Try adjusting them.</div>`;
      revealSetup();
    };
    document.getElementById('f-apply').addEventListener('click', applyFilters);
    const {params} = parseHash();
    if(params.get('price')) document.getElementById('f-price').value = params.get('price');
    if(params.get('category')) document.getElementById('f-category').value = params.get('category');
    applyFilters();
  }

  // ---- Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  if(galleryGrid){
    document.getElementById('gallery-filters').addEventListener('click', e=>{
      const btn = e.target.closest('button'); if(!btn) return;
      document.querySelectorAll('#gallery-filters .pill').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      galleryGrid.querySelectorAll('.m-item').forEach(it=>{
        it.style.display = (cat==='All' || it.dataset.cat===cat) ? '' : 'none';
      });
    });
    galleryGrid.addEventListener('click', e=>{
      const img = e.target.closest('img'); if(!img) return;
      const lb = document.createElement('div');
      lb.className='lightbox';
      lb.innerHTML = `<button class="lightbox-close">×</button><img src="${img.dataset.full}">`;
      lb.addEventListener('click', ()=>lb.remove());
      document.body.appendChild(lb);
    });
  }

  // ---- Review submit
  const reviewForm = document.getElementById('review-form');
  if(reviewForm) reviewForm.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(reviewForm);
    const avatar = fd.get('avatar') || `https://i.pravatar.cc/100?u=${encodeURIComponent(fd.get('name'))}`;
    DB.reviews.push({id:uid('REV'), name:fd.get('name'), country:fd.get('country'), rating:Number(fd.get('rating')), text:fd.get('text'), approved:false, avatar});
    saveDB(); logActivity(`New review submitted by ${fd.get('name')}`);
    toast('Thanks! Your review will appear after admin approval.', 'success');
    reviewForm.reset();
  });

  // ---- Contact form
  const contactForm = document.getElementById('contact-form');
  if(contactForm) contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(contactForm);
    DB.messages.unshift({id:uid('MSG'), name:fd.get('name'), email:fd.get('email'), subject:fd.get('subject')||'(No subject)', message:fd.get('message'), createdAt:Date.now(), read:false});
    saveDB();
    toast('Message sent! Our team will get back to you soon.', 'success');
    logActivity(`New contact message from ${fd.get('name')}`);
    contactForm.reset();
  });

  // ---- Booking form (create)
  const bookingForm = document.getElementById('booking-form');
  if(bookingForm) bookingForm.addEventListener('submit', e=>{
    e.preventDefault();
    const idMatch = location.hash.match(/#\/booking\/([^?]+)/);
    const p = DB.packages.find(x=>x.id===idMatch[1]);
    const fd = new FormData(bookingForm);
    const booking = {
      id: uid('BK'), packageId:p.id, packageTitle:p.title,
      name:fd.get('name'), email:fd.get('email'), phone:fd.get('phone'), country:fd.get('country'),
      adults:Number(fd.get('adults')), children:Number(fd.get('children')),
      travelDate:fd.get('travelDate'), returnDate:fd.get('returnDate'), hotelPref:fd.get('hotelPref'),
      budget:fd.get('budget'), notes:fd.get('notes'), payment:fd.get('payment'),
      status:'Pending', createdAt:Date.now(),
      customerEmail: currentCustomer()?.email || fd.get('email'),
    };
    DB.bookings.unshift(booking); saveDB();
    logActivity(`New booking ${booking.id} for "${p.title}" by ${booking.name}`);
    toast('Booking confirmed! Booking ID: ' + booking.id, 'success');
    location.hash = '#/booking-confirmed/' + booking.id;
  });

  // ---- Customer dashboard: edit/cancel booking
  const dashPanel = document.querySelector('.dash-topbar');
  document.querySelectorAll('[data-edit]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const b = DB.bookings.find(x=>x.id===btn.dataset.edit);
      const slot = document.getElementById('edit-booking-slot');
      slot.innerHTML = `
        <div class="panel">
          <h3>Edit Booking ${b.id}</h3>
          <form id="edit-booking-form">
            ${bookingFieldsHtml(DB.packages.find(p=>p.id===b.packageId)||{}, b)}
            <button class="btn btn-primary">Save Changes</button>
            <button type="button" class="btn btn-ghost" id="cancel-edit-form">Close</button>
          </form>
        </div>`;
      slot.scrollIntoView({behavior:'smooth'});
      document.getElementById('cancel-edit-form').addEventListener('click', ()=>slot.innerHTML='');
      document.getElementById('edit-booking-form').addEventListener('submit', ev=>{
        ev.preventDefault();
        const fd = new FormData(ev.target);
        Object.assign(b, {
          name:fd.get('name'), email:fd.get('email'), phone:fd.get('phone'), country:fd.get('country'),
          adults:Number(fd.get('adults')), children:Number(fd.get('children')),
          travelDate:fd.get('travelDate'), returnDate:fd.get('returnDate'), hotelPref:fd.get('hotelPref'),
          budget:fd.get('budget'), notes:fd.get('notes'), payment:fd.get('payment'),
        });
        saveDB(); logActivity(`Booking ${b.id} edited by customer`);
        toast('Booking updated successfully.', 'success');
        render();
      });
    });
  });
  document.querySelectorAll('[data-cancel]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const b = DB.bookings.find(x=>x.id===btn.dataset.cancel);
      if(!confirm('Cancel this booking?')) return;
      b.status = 'Cancelled'; saveDB(); logActivity(`Booking ${b.id} cancelled by customer`);
      toast('Booking cancelled.', 'success'); render();
    });
  });
  const histMonth = document.getElementById('hist-month');
  const histYear = document.getElementById('hist-year');
  if(histMonth) histMonth.addEventListener('change', ()=>{ dashHistoryFilter.month = histMonth.value; render(); });
  if(histYear) histYear.addEventListener('change', ()=>{ dashHistoryFilter.year = histYear.value; render(); });

  const logoutBtn = document.getElementById('logout-btn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ SESSION.customerEmail=null; saveSession(); toast('Logged out'); location.hash='#/'; });

  const profileForm = document.getElementById('profile-form');
  if(profileForm) profileForm.addEventListener('submit', e=>{
    e.preventDefault(); const c = currentCustomer(); const fd = new FormData(profileForm);
    c.name = fd.get('name'); c.phone = fd.get('phone')||''; c.avatar = fd.get('avatar')||c.avatar||'';
    saveDB(); toast('Profile updated.', 'success'); render();
  });

  const custChangePasswordForm = document.getElementById('cust-change-password-form');
  if(custChangePasswordForm) custChangePasswordForm.addEventListener('submit', async e=>{
    e.preventDefault(); const c = currentCustomer(); const fd = new FormData(custChangePasswordForm);
    const curHash = await sha256(fd.get('current'));
    if(curHash !== c.passwordHash){ toast('Current password is incorrect.', 'error'); return; }
    if(fd.get('newPassword') !== fd.get('confirmPassword')){ toast('New passwords do not match.', 'error'); return; }
    c.passwordHash = await sha256(fd.get('newPassword'));
    saveDB(); toast('Password updated.', 'success'); custChangePasswordForm.reset();
  });

  const custChangeSecurityForm = document.getElementById('cust-change-security-form');
  if(custChangeSecurityForm) custChangeSecurityForm.addEventListener('submit', async e=>{
    e.preventDefault(); const c = currentCustomer(); const fd = new FormData(custChangeSecurityForm);
    c.securityQuestion = fd.get('question'); c.securityAnswerHash = await sha256(fd.get('answer').toLowerCase().trim());
    saveDB(); toast('Security question updated.', 'success'); custChangeSecurityForm.reset();
  });

  // ---- Customer auth
  const loginForm = document.getElementById('login-form');
  if(loginForm) loginForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd = new FormData(loginForm);
    const email = fd.get('email').toLowerCase().trim();
    const c = DB.customers.find(x=>x.email===email);
    if(!c){ toast('No account found with that email.', 'error'); return; }
    const hash = await sha256(fd.get('password'));
    if(hash !== c.passwordHash){ toast('Incorrect password.', 'error'); return; }
    SESSION.customerEmail = email; saveSession();
    toast('Welcome back, ' + c.name + '!', 'success');
    location.hash = '#/dashboard';
  });

  const registerForm = document.getElementById('register-form');
  if(registerForm) registerForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd = new FormData(registerForm);
    const email = fd.get('email').toLowerCase().trim();
    if(DB.customers.some(c=>c.email===email)){ toast('An account with this email already exists.', 'error'); return; }
    const passwordHash = await sha256(fd.get('password'));
    const securityAnswerHash = await sha256(fd.get('securityAnswer').toLowerCase().trim());
    DB.customers.push({
      name:fd.get('name'), email, phone:fd.get('phone')||'', passwordHash, avatar:fd.get('avatar')||'',
      securityQuestion:fd.get('securityQuestion'), securityAnswerHash, joined:Date.now()
    });
    saveDB(); logActivity(`New customer registered: ${fd.get('name')}`);
    SESSION.customerEmail = email; saveSession();
    toast('Account created! Welcome to ' + DB.settings.siteName + '.', 'success');
    location.hash = '#/dashboard';
  });

  // ---- Customer forgot password (own custom security question)
  const forgotEmailForm = document.getElementById('forgot-email-form');
  if(forgotEmailForm) forgotEmailForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = new FormData(forgotEmailForm).get('email').toLowerCase().trim();
    const c = DB.customers.find(x=>x.email===email);
    const slot = document.getElementById('forgot-step2');
    if(!c){ toast('No account found with that email.', 'error'); return; }
    forgotEmailForm.querySelector('input[name="email"]').disabled = true;
    forgotEmailForm.querySelector('button').style.display='none';
    slot.innerHTML = `
      <form id="forgot-reset-form" style="margin-top:6px">
        <div class="field"><label>${c.securityQuestion}</label><input required name="answer"></div>
        <div class="field"><label>New Password</label><input required type="password" minlength="6" name="newPassword"></div>
        <button class="btn btn-cta btn-block">Reset Password</button>
      </form>`;
    wirePasswordToggles(slot);
    document.getElementById('forgot-reset-form').addEventListener('submit', async ev=>{
      ev.preventDefault();
      const fd2 = new FormData(ev.target);
      const ansHash = await sha256(fd2.get('answer').toLowerCase().trim());
      if(ansHash !== c.securityAnswerHash){ toast('That answer doesn\'t match our records.', 'error'); return; }
      c.passwordHash = await sha256(fd2.get('newPassword'));
      saveDB(); logActivity(`Customer ${c.email} reset their password`);
      toast('Password reset! You can now log in.', 'success');
      location.hash = '#/login';
    });
  });

  // ---- Ask a Question (customer dashboard)
  const askForm = document.getElementById('ask-question-form');
  if(askForm) askForm.addEventListener('submit', e=>{
    e.preventDefault();
    const c = currentCustomer();
    const q = new FormData(askForm).get('question');
    DB.questions.unshift({id:uid('QST'), customerEmail:c.email, customerName:c.name, question:q, answer:'', status:'pending', createdAt:Date.now()});
    saveDB(); logActivity(`New question submitted by ${c.name}`);
    toast('Question sent! You\'ll see the answer here once our team replies.', 'success');
    askForm.reset(); render();
  });

  // ---- Admin auth
  const adminLoginForm = document.getElementById('admin-login-form');
  if(adminLoginForm) adminLoginForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd = new FormData(adminLoginForm);
    const hash = await sha256(fd.get('password'));
    if(fd.get('username') === DB.admin.username && hash === DB.admin.passwordHash){
      adminAuthed = true;
      logActivity('Admin logged in');
      toast('Welcome back, ' + DB.admin.username + '!', 'success');
      location.hash = '#/admin/overview';
    } else { toast('Invalid username or password.', 'error'); }
  });

  const adminForgotForm = document.getElementById('admin-forgot-form');
  if(adminForgotForm) adminForgotForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd = new FormData(adminForgotForm);
    const ansHash = await sha256(fd.get('answer').toLowerCase().trim());
    if(fd.get('username') !== DB.admin.username || ansHash !== DB.admin.securityAnswerHash){
      toast('Username or security answer is incorrect.', 'error'); return;
    }
    DB.admin.passwordHash = await sha256(fd.get('newPassword'));
    saveDB(); logActivity('Admin password reset via security question');
    toast('Password reset! You can now log in.', 'success');
    location.hash = '#/admin/login';
  });

  const adminLogout = document.getElementById('admin-logout');
  if(adminLogout) adminLogout.addEventListener('click', e=>{ e.preventDefault(); adminAuthed=false; location.hash='#/admin/login'; });

  // ---- Admin: bookings status change
  document.querySelectorAll('[data-status]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const [id, status] = btn.dataset.status.split('|');
      const b = DB.bookings.find(x=>x.id===id); b.status = status;
      saveDB(); logActivity(`Booking ${id} marked as ${status} by admin`);
      toast(`Booking ${id} → ${status}`, 'success'); render();
    });
  });

  // ---- Admin: packages CRUD
  const newPkgBtn = document.getElementById('new-pkg-btn');
  if(newPkgBtn) newPkgBtn.addEventListener('click', ()=>openPkgForm(null));
  document.querySelectorAll('[data-edit-pkg]').forEach(btn=>btn.addEventListener('click', ()=>openPkgForm(DB.packages.find(p=>p.id===btn.dataset.editPkg))));
  document.querySelectorAll('[data-dup-pkg]').forEach(btn=>btn.addEventListener('click', ()=>{
    const p = DB.packages.find(x=>x.id===btn.dataset.dupPkg);
    const copy = {...p, id:uid('PKG'), title:p.title+' (Copy)'};
    DB.packages.push(copy); saveDB(); toast('Package duplicated.', 'success'); render();
  }));
  document.querySelectorAll('[data-archive-pkg]').forEach(btn=>btn.addEventListener('click', ()=>{
    const p = DB.packages.find(x=>x.id===btn.dataset.archivePkg);
    p.status = p.status==='active' ? 'archived' : 'active';
    saveDB(); toast('Package ' + (p.status==='active'?'activated':'archived') + '.', 'success'); render();
  }));
  document.querySelectorAll('[data-del-pkg]').forEach(btn=>btn.addEventListener('click', ()=>{
    if(!confirm('Delete this package permanently?')) return;
    DB.packages = DB.packages.filter(x=>x.id!==btn.dataset.delPkg); saveDB(); toast('Package deleted.', 'success'); render();
  }));
  function openPkgForm(p){
    const slot = document.getElementById('pkg-form-slot');
    slot.innerHTML = `<div class="panel"><h3>${p?'Edit':'Add'} Package</h3><form id="pkg-form">${pkgFormHtml(p)}<button class="btn btn-primary">Save Package</button> <button type="button" class="btn btn-ghost" id="pkg-form-close">Cancel</button></form></div>`;
    slot.scrollIntoView({behavior:'smooth'});
    document.getElementById('pkg-form-close').addEventListener('click', ()=>slot.innerHTML='');
    document.getElementById('pkg-form').addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        title:fd.get('title'), category:fd.get('category'), destination:fd.get('destination'), country:fd.get('country'),
        price:Number(fd.get('price')), discount:Number(fd.get('discount')||0), duration:fd.get('duration'), hotel:fd.get('hotel'),
        image:fd.get('image')||'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60',
        description:fd.get('description'), featured: fd.get('featured')==='on',
      };
      if(p){ Object.assign(p, data); toast('Package updated.', 'success'); }
      else { DB.packages.push({id:uid('PKG'), gallery:[data.image], itinerary:[], included:[], excluded:[], availableDates:[], rating:5, ratingCount:0, status:'active', ...data}); toast('Package added.', 'success'); }
      saveDB(); render();
    });
  }

  // ---- Admin: gallery
  const galleryAddForm = document.getElementById('gallery-add-form');
  if(galleryAddForm) galleryAddForm.addEventListener('submit', e=>{
    e.preventDefault(); const fd = new FormData(galleryAddForm);
    if(!fd.get('url')){ toast('Please add an image URL or upload one from your device.', 'error'); return; }
    DB.gallery.unshift({id:uid('IMG'), url:fd.get('url'), category:fd.get('category')});
    saveDB(); toast('Image added.', 'success'); render();
  });
  document.querySelectorAll('[data-del-img]').forEach(btn=>btn.addEventListener('click', ()=>{
    DB.gallery = DB.gallery.filter(g=>g.id!==btn.dataset.delImg); saveDB(); toast('Image deleted.', 'success'); render();
  }));

  // ---- Admin: reviews
  document.querySelectorAll('[data-approve-rev]').forEach(btn=>btn.addEventListener('click', ()=>{
    const r = DB.reviews.find(x=>x.id===btn.dataset.approveRev); r.approved = !r.approved; saveDB(); render();
  }));
  document.querySelectorAll('[data-del-rev]').forEach(btn=>btn.addEventListener('click', ()=>{
    DB.reviews = DB.reviews.filter(r=>r.id!==btn.dataset.delRev); saveDB(); toast('Review deleted.', 'success'); render();
  }));

  // ---- Admin: blog
  const blogAddForm = document.getElementById('blog-add-form');
  if(blogAddForm) blogAddForm.addEventListener('submit', e=>{
    e.preventDefault(); const fd = new FormData(blogAddForm);
    const image = fd.get('image') || 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=700&q=60';
    DB.blog.unshift({id:uid('BLG'), title:fd.get('title'), image, excerpt:fd.get('excerpt'), date:new Date().toISOString().slice(0,10)});
    saveDB(); toast('Article published.', 'success'); render();
  });
  document.querySelectorAll('[data-del-blog]').forEach(btn=>btn.addEventListener('click', ()=>{
    DB.blog = DB.blog.filter(b=>b.id!==btn.dataset.delBlog); saveDB(); toast('Article deleted.', 'success'); render();
  }));

  // ---- Admin: faqs
  const faqAddForm = document.getElementById('faq-add-form');
  if(faqAddForm) faqAddForm.addEventListener('submit', e=>{
    e.preventDefault(); const fd = new FormData(faqAddForm);
    DB.faqs.push({id:uid('FAQ'), q:fd.get('q'), a:fd.get('a')});
    saveDB(); toast('FAQ added.', 'success'); render();
  });
  document.querySelectorAll('[data-del-faq]').forEach(btn=>btn.addEventListener('click', ()=>{
    DB.faqs = DB.faqs.filter(f=>f.id!==btn.dataset.delFaq); saveDB(); toast('FAQ deleted.', 'success'); render();
  }));

  // ---- Admin: reply to customer questions
  document.querySelectorAll('.reply-question-form').forEach(f=>{
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const q = DB.questions.find(x=>x.id===f.dataset.qid);
      q.answer = new FormData(f).get('reply'); q.status = 'answered';
      saveDB(); logActivity(`Replied to a question from ${q.customerName}`);
      toast('Reply sent.', 'success'); render();
    });
  });

  // ---- Admin: customer detail history filters
  const adminHistMonth = document.getElementById('admin-hist-month');
  const adminHistYear = document.getElementById('admin-hist-year');
  if(adminHistMonth) adminHistMonth.addEventListener('change', ()=>{ adminCustHistoryFilter.month = adminHistMonth.value; render(); });
  if(adminHistYear) adminHistYear.addEventListener('change', ()=>{ adminCustHistoryFilter.year = adminHistYear.value; render(); });

  // ---- Admin: customers
  document.querySelectorAll('[data-del-cust]').forEach(btn=>btn.addEventListener('click', ()=>{
    if(!confirm('Delete this customer?')) return;
    DB.customers = DB.customers.filter(c=>c.email!==btn.dataset.delCust); saveDB(); toast('Customer deleted.', 'success'); render();
  }));

  // ---- Admin: messages
  document.querySelectorAll('[data-toggle-msg]').forEach(btn=>btn.addEventListener('click', ()=>{
    const m = DB.messages.find(x=>x.id===btn.dataset.toggleMsg); m.read = !m.read; saveDB(); render();
  }));
  document.querySelectorAll('[data-del-msg]').forEach(btn=>btn.addEventListener('click', ()=>{
    DB.messages = DB.messages.filter(m=>m.id!==btn.dataset.delMsg); saveDB(); toast('Message deleted.', 'success'); render();
  }));

  // ---- Admin: coupons
  const couponAddForm = document.getElementById('coupon-add-form');
  if(couponAddForm) couponAddForm.addEventListener('submit', e=>{
    e.preventDefault(); const fd = new FormData(couponAddForm);
    DB.coupons.push({id:uid('CPN'), code:fd.get('code').toUpperCase(), discount:Number(fd.get('discount')), expiry:fd.get('expiry'), usageLimit:Number(fd.get('usageLimit')), used:0});
    saveDB(); toast('Coupon created.', 'success'); render();
  });
  document.querySelectorAll('[data-del-cpn]').forEach(btn=>btn.addEventListener('click', ()=>{
    DB.coupons = DB.coupons.filter(c=>c.id!==btn.dataset.delCpn); saveDB(); toast('Coupon deleted.', 'success'); render();
  }));

  // ---- Admin: settings
  const settingsForm = document.getElementById('settings-form');
  if(settingsForm) settingsForm.addEventListener('submit', e=>{
    e.preventDefault(); const fd = new FormData(settingsForm);
    Object.assign(DB.settings, {
      siteName:fd.get('siteName'), tagline:fd.get('tagline'), aboutText:fd.get('aboutText'),
      mission:fd.get('mission'), vision:fd.get('vision'), story:fd.get('story'),
      heroImage:fd.get('heroImage')||DB.settings.heroImage,
      privacyText:fd.get('privacyText'), termsText:fd.get('termsText'),
      editWindowHours:Number(fd.get('editWindowHours'))||24,
      address:fd.get('address'), phone:fd.get('phone'), email:fd.get('email'), hours:fd.get('hours'), mapQuery:fd.get('mapQuery'),
      currencySymbol:fd.get('currencySymbol'), currency:fd.get('currency'),
      maintenanceMode: fd.get('maintenanceMode')==='on',
    });
    DB.settings.social = {facebook:fd.get('social_facebook'), instagram:fd.get('social_instagram'), twitter:fd.get('social_twitter'), youtube:fd.get('social_youtube')};
    DB.settings.stats = {customers:Number(fd.get('stat_customers')), countries:Number(fd.get('stat_countries')), tours:Number(fd.get('stat_tours')), years:Number(fd.get('stat_years')), hotels:Number(fd.get('stat_hotels'))};
    saveDB(); logActivity('Site settings updated'); toast('Settings saved!', 'success'); applyBranding();
  });

  // ---- Admin: account & security
  const changeUsernameForm = document.getElementById('change-username-form');
  if(changeUsernameForm) changeUsernameForm.addEventListener('submit', e=>{
    e.preventDefault(); DB.admin.username = new FormData(changeUsernameForm).get('username');
    saveDB(); logActivity('Admin username changed'); toast('Username updated.', 'success');
  });
  const changePasswordForm = document.getElementById('change-password-form');
  if(changePasswordForm) changePasswordForm.addEventListener('submit', async e=>{
    e.preventDefault(); const fd = new FormData(changePasswordForm);
    const curHash = await sha256(fd.get('current'));
    if(curHash !== DB.admin.passwordHash){ toast('Current password is incorrect.', 'error'); return; }
    if(fd.get('newPassword') !== fd.get('confirmPassword')){ toast('New passwords do not match.', 'error'); return; }
    DB.admin.passwordHash = await sha256(fd.get('newPassword'));
    saveDB(); logActivity('Admin password changed'); toast('Password updated.', 'success'); changePasswordForm.reset();
  });
  const changeSecurityForm = document.getElementById('change-security-form');
  if(changeSecurityForm) changeSecurityForm.addEventListener('submit', async e=>{
    e.preventDefault(); const fd = new FormData(changeSecurityForm);
    DB.admin.securityQuestion = fd.get('question');
    DB.admin.securityAnswerHash = await sha256(fd.get('answer').toLowerCase().trim());
    saveDB(); logActivity('Admin security question updated'); toast('Security question updated.', 'success'); changeSecurityForm.reset();
  });

  wirePasswordToggles(document);
}

/* ------------------------ device image upload (generic) -------------------- */
// Any <input type="file" data-fill="fieldName"> inside a <form> will, on
// selection, read the image as a data URL and write it into that form's
// [name="fieldName"] field, plus show a thumbnail preview. This lets every
// admin image field (and the review photo field) accept an uploaded file
// from the device instead of only a pasted URL.
function setupImageUploads(){
  document.addEventListener('change', (e)=>{
    const input = e.target;
    if(!(input.tagName==='INPUT' && input.type==='file' && input.dataset.fill)) return;
    const file = input.files && input.files[0];
    if(!file) return;
    if(file.size > 4*1024*1024){ toast('Please choose an image smaller than 4MB.', 'error'); input.value=''; return; }
    const reader = new FileReader();
    reader.onload = ()=>{
      const form = input.closest('form');
      const target = form ? form.querySelector(`[name="${input.dataset.fill}"]`) : null;
      if(target) target.value = reader.result;
      let preview = input.parentElement.querySelector('.upload-thumb');
      if(!preview){ preview = document.createElement('img'); preview.className='upload-thumb'; input.parentElement.appendChild(preview); }
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ------------------------------ global chrome ------------------------------ */
function initChrome(){
  document.getElementById('nav-burger').addEventListener('click', ()=>document.getElementById('main-nav').classList.toggle('open'));
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('fahad-theme') || 'light';
  if(savedTheme==='dark'){ document.documentElement.setAttribute('data-theme','dark'); themeToggle.textContent='☀️'; }
  themeToggle.addEventListener('click', ()=>{
    const isDark = document.documentElement.getAttribute('data-theme')==='dark';
    if(isDark){ document.documentElement.removeAttribute('data-theme'); themeToggle.textContent='🌙'; localStorage.setItem('fahad-theme','light'); }
    else{ document.documentElement.setAttribute('data-theme','dark'); themeToggle.textContent='☀️'; localStorage.setItem('fahad-theme','dark'); }
  });

  const backBtn = document.createElement('button');
  backBtn.className = 'back-to-top'; backBtn.textContent = '↑'; backBtn.title='Back to top';
  backBtn.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
  document.body.appendChild(backBtn);
  window.addEventListener('scroll', ()=>backBtn.classList.toggle('show', window.scrollY>500));

  if(!localStorage.getItem('fahad-cookie-consent')){
    const bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.innerHTML = `<p>We use cookies to improve your browsing experience. By continuing, you agree to our <a href="#/privacy" style="color:#fff;text-decoration:underline">Privacy Policy</a>.</p><button class="btn btn-cta btn-sm" id="cookie-accept">Accept</button>`;
    document.body.appendChild(bar);
    document.getElementById('cookie-accept').addEventListener('click', ()=>{ localStorage.setItem('fahad-cookie-consent','1'); bar.remove(); });
  }
}

/* --------------------------------- boot ------------------------------------ */
(async function boot(){
  const loader = document.createElement('div');
  loader.className = 'loader-screen';
  loader.innerHTML = `<div class="loader-plane">✈️</div><div>Loading Fahad Travels…</div>`;
  document.body.appendChild(loader);

  loadDB();
  await ensureAdminSeed();
  initChrome();
  setupImageUploads();
  await render();

  setTimeout(()=>{ loader.style.transition='opacity .4s ease'; loader.style.opacity='0'; setTimeout(()=>loader.remove(), 400); }, 350);
})();
