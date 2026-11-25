// SMART PARK — front-end prototype logic
// Demo data is stored in this browser using localStorage. It is not a production database.

const STORAGE_KEY = "smartParkDemo_v1";
const initialSlots = [
  {id:"A01",area:"Central Parking",price:30,distance:2,type:"Car",status:"Available",ev:false},
  {id:"A02",area:"Central Parking",price:25,distance:5,type:"Car",status:"Occupied",ev:false},
  {id:"A03",area:"Central Parking",price:35,distance:1,type:"Car",status:"Available",ev:false},
  {id:"A04",area:"Central Parking",price:45,distance:3,type:"EV",status:"Available",ev:true},
  {id:"A05",area:"Central Parking",price:30,distance:4,type:"Car",status:"Reserved",ev:false},
  {id:"A06",area:"Central Parking",price:25,distance:6,type:"Bike",status:"Available",ev:false},
  {id:"B01",area:"Central Parking",price:40,distance:2,type:"Car",status:"Occupied",ev:false},
  {id:"B02",area:"Central Parking",price:50,distance:1,type:"EV",status:"Available",ev:true},
  {id:"B03",area:"Central Parking",price:30,distance:5,type:"Car",status:"Available",ev:false},
  {id:"B04",area:"Central Parking",price:20,distance:7,type:"Bike",status:"Available",ev:false},
  {id:"B05",area:"Central Parking",price:45,distance:3,type:"Car",status:"Occupied",ev:false},
  {id:"B06",area:"Central Parking",price:40,distance:2,type:"EV",status:"Available",ev:true},
  {id:"C01",area:"City Mall Parking",price:50,distance:2,type:"Car",status:"Available",ev:false},
  {id:"C02",area:"City Mall Parking",price:55,distance:3,type:"Car",status:"Available",ev:false},
  {id:"C03",area:"City Mall Parking",price:40,distance:5,type:"Bike",status:"Occupied",ev:false},
  {id:"C04",area:"City Mall Parking",price:60,distance:1,type:"EV",status:"Available",ev:true},
  {id:"C05",area:"City Mall Parking",price:45,distance:4,type:"Car",status:"Occupied",ev:false},
  {id:"C06",area:"City Mall Parking",price:35,distance:6,type:"Bike",status:"Available",ev:false},
  {id:"D01",area:"Tech Park",price:35,distance:3,type:"Car",status:"Available",ev:false},
  {id:"D02",area:"Tech Park",price:30,distance:4,type:"Car",status:"Available",ev:false},
  {id:"D03",area:"Tech Park",price:55,distance:1,type:"EV",status:"Available",ev:true},
  {id:"D04",area:"Tech Park",price:25,distance:6,type:"Bike",status:"Occupied",ev:false},
  {id:"D05",area:"Tech Park",price:40,distance:2,type:"Car",status:"Available",ev:false},
  {id:"D06",area:"Tech Park",price:45,distance:3,type:"Car",status:"Occupied",ev:false}
];

const areas = [
  {name:"Central Parking",description:"City centre · Convenient access",distance:"Near the main entrance",symbol:"⌖"},
  {name:"City Mall Parking",description:"Shopping district · Covered parking",distance:"Mall entrance access",symbol:"◇"},
  {name:"Tech Park",description:"Business district · Everyday parking",distance:"Office zone access",symbol:"▦"}
];

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved && Array.isArray(saved.slots) && Array.isArray(saved.bookings)) return saved;
  }catch(error){ console.warn("Could not read saved demo data.", error); }
  return {slots:initialSlots.map(slot=>({...slot})),bookings:[],lastBookingId:null};
}
let state = loadState();
let selectedMapSlot = null;
let toastTimer;

function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
function money(value){ return `₹${value}`; }
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}
function showToast(message){
  const toast=document.getElementById("toast");
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function availableSlots(){return state.slots.filter(slot=>slot.status==="Available");}
function activeBookings(){return state.bookings.filter(booking=>booking.status==="Reserved");}

// Simple in-page navigation: each page is a section in index.html.
function navigate(page){
  const target=document.querySelector(`[data-page="${page}"]`);
  if(!target) return;
  document.querySelectorAll(".page").forEach(section=>section.classList.toggle("active",section===target));
  document.querySelectorAll(".nav-link").forEach(link=>link.classList.toggle("active",link.dataset.pageLink===page));
  document.getElementById("mainNav").classList.remove("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded","false");
  window.location.hash=page;
  window.scrollTo({top:0,behavior:"smooth"});
  renderAll();
}
document.addEventListener("click",event=>{
  const link=event.target.closest("[data-page-link]");
  if(link){event.preventDefault();navigate(link.dataset.pageLink);}
});
document.getElementById("menuToggle").addEventListener("click",()=>{
  const nav=document.getElementById("mainNav");
  nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded",nav.classList.contains("open")?"true":"false");
});

function bookSlot(slotId){
  const slot=state.slots.find(item=>item.id===slotId);
  if(!slot || slot.status!=="Available"){showToast("Sorry, this space is no longer available.");renderAll();return;}
  const bookingId="SP-"+Date.now().toString().slice(-7);
  const booking={
    id:bookingId,slotId:slot.id,area:slot.area,price:slot.price,
    vehicle:slot.type==="EV"?"Electric vehicle":slot.type,
    date:new Date().toISOString().slice(0,10),startTime:"10:00 AM",status:"Reserved",
    user:"Demo User",createdAt:new Date().toISOString()
  };
  slot.status="Reserved";
  state.bookings.unshift(booking);
  state.lastBookingId=bookingId;
  saveState();renderAll();
  showToast(`${slot.id} reserved successfully!`);
  navigate("pass");
}
function cancelBooking(bookingId){
  const booking=state.bookings.find(item=>item.id===bookingId);
  if(!booking || booking.status!=="Reserved") return;
  booking.status="Cancelled";
  const slot=state.slots.find(item=>item.id===booking.slotId);
  if(slot) slot.status="Available";
  saveState();renderAll();showToast("Demo booking cancelled.");
}
function showPass(bookingId){
  state.lastBookingId=bookingId;saveState();renderPass();navigate("pass");
}

function renderParking(){
  const search=(document.getElementById("parkingSearch")?.value||"").toLowerCase();
  const vehicle=document.getElementById("vehicleFilter")?.value||"All";
  const availability=document.getElementById("availabilityFilter")?.value||"All";
  const list=document.getElementById("parkingList");
  const filtered=areas.filter(area=>{
    const matchesName=area.name.toLowerCase().includes(search);
    const slots=state.slots.filter(slot=>slot.area===area.name);
    const matchesVehicle=vehicle==="All"||slots.some(slot=>slot.type===vehicle);
    const matchesAvailability=availability==="All"||slots.some(slot=>slot.status==="Available");
    return matchesName&&matchesVehicle&&matchesAvailability;
  });
  document.getElementById("resultCount").textContent=`${filtered.length} parking area${filtered.length===1?"":"s"}`;
  list.innerHTML=filtered.length?filtered.map(area=>{
    const slots=state.slots.filter(slot=>slot.area===area.name);
    const available=slots.filter(slot=>slot.status==="Available").length;
    const lowest=slots.filter(slot=>slot.status==="Available").reduce((min,slot)=>Math.min(min,slot.price),Infinity);
    return `<article class="parking-card">
      <div class="parking-card-top"><span class="parking-symbol">${area.symbol}</span><span class="availability-tag">● ${available} AVAILABLE</span></div>
      <h3>${escapeHTML(area.name)}</h3><p>${escapeHTML(area.description)}</p>
      <div class="parking-meta"><span>⌖ ${escapeHTML(area.distance)}</span><span>▦ ${slots.length} demo slots</span></div>
      <div class="parking-card-bottom"><div class="parking-price">${Number.isFinite(lowest)?money(lowest):"—"}<small> / hour</small></div><button class="small-book" data-area="${escapeHTML(area.name)}">View spaces ↗</button></div>
    </article>`;
  }).join(""):`<div class="empty-state"><span>⌕</span><h3>No matching locations</h3><p>Try another search or change your filters.</p></div>`;
}
document.getElementById("parkingSearch").addEventListener("input",renderParking);
document.getElementById("vehicleFilter").addEventListener("change",renderParking);
document.getElementById("availabilityFilter").addEventListener("change",renderParking);
document.getElementById("parkingList").addEventListener("click",event=>{
  const button=event.target.closest("[data-area]");
  if(!button)return;
  navigate("parking-map");
  showToast(`Showing the sample parking map for ${button.dataset.area}.`);
});

document.getElementById("homeSearchForm").addEventListener("submit",event=>{
  event.preventDefault();
  const location=document.getElementById("homeLocation").value.trim();
  document.getElementById("parkingSearch").value=location;
  navigate("find-parking");renderParking();
});
document.getElementById("homeDate").value=new Date().toISOString().slice(0,10);

// SmartMatch: filters unavailable spaces, then ranks candidates using weighted scores.
function calculateMatch(slot,budget,nearOnly,needsEV){
  const distanceScore=Math.max(0,100-(slot.distance*12));
  const priceScore=Math.max(0,100-(slot.price/budget)*35);
  const preferenceScore=nearOnly?(slot.distance<=3?100:35):80;
  const evScore=needsEV?(slot.ev?100:0):(slot.ev?75:80);
  return Math.round(distanceScore*.4+priceScore*.3+preferenceScore*.2+evScore*.1);
}
document.getElementById("matchForm").addEventListener("submit",event=>{
  event.preventDefault();
  const budget=Number(document.getElementById("budgetPreference").value);
  const nearOnly=document.getElementById("distancePreference").value==="Near";
  const needsEV=document.getElementById("evPreference").checked;
  let candidates=availableSlots().filter(slot=>slot.price<=budget);
  if(needsEV)candidates=candidates.filter(slot=>slot.ev);
  const ranked=candidates.map(slot=>({...slot,score:calculateMatch(slot,budget,nearOnly,needsEV)})).sort((a,b)=>b.score-a.score);
  const container=document.getElementById("matchList");
  if(!ranked.length){
    container.innerHTML=`<div class="empty-state"><span>⌕</span><h3>No matching spaces right now.</h3><p>Try increasing your budget or changing your preferences.</p></div>`;
    return;
  }
  container.innerHTML=ranked.slice(0,5).map((slot,index)=>`<article class="match-card ${index===0?"best":""}">
    <div><h3>${escapeHTML(slot.area)} · ${slot.id}</h3><p>${money(slot.price)} / hour · ${slot.distance} min walk · ${slot.ev?"EV space":"Standard space"}</p>${index===0?'<span class="availability-tag">✦ BEST MATCH FOR YOU</span>':""}</div>
    <div class="match-score">${slot.score}<small>MATCH SCORE</small></div>
    <button class="small-book" data-book-slot="${slot.id}">Reserve this space ↗</button>
  </article>`).join("");
});

function renderMap(){
  const grid=document.getElementById("parkingGrid");
  const slots=state.slots.filter(slot=>slot.area==="Central Parking").slice(0,12);
  grid.innerHTML=slots.map(slot=>{
    const statusClass=slot.status.toLowerCase();
    const isSelected=selectedMapSlot===slot.id;
    const visualClass=(slot.ev && slot.status==="Available")?"ev":statusClass;
    const icon=slot.ev?"⚡":"▣";
    return `<button class="slot ${visualClass} ${isSelected?"selected":""}" data-map-slot="${slot.id}" ${slot.status!=="Available"?"disabled":""}>
      <span>${icon}</span><strong>${slot.id}</strong><small>${slot.status.toUpperCase()}</small>
    </button>`;
  }).join("");
  if(selectedMapSlot){
    const slot=state.slots.find(item=>item.id===selectedMapSlot);
    document.getElementById("mapSelection").textContent=slot?`${slot.id} · ${money(slot.price)} per hour · ${slot.ev?"EV space":"Standard space"} — use Reserve to confirm.`:"Select an available parking slot.";
  }
}
document.getElementById("parkingGrid").addEventListener("click",event=>{
  const button=event.target.closest("[data-map-slot]");
  if(!button)return;
  selectedMapSlot=button.dataset.mapSlot;renderMap();
  const slot=state.slots.find(item=>item.id===selectedMapSlot);
  document.getElementById("mapSelection").innerHTML=`<strong>${slot.id}</strong> · ${money(slot.price)} per hour · ${slot.ev?"EV space":"Standard space"} <button class="small-book" data-book-slot="${slot.id}">Reserve this slot</button>`;
});

function renderEco(){
  const evSlots=state.slots.filter(slot=>slot.ev);
  document.getElementById("evTotal").textContent=evSlots.length;
  document.getElementById("evAvailable").textContent=evSlots.filter(slot=>slot.status==="Available").length;
  document.getElementById("evList").innerHTML=evSlots.map(slot=>`<article class="ev-card"><div><h3>${escapeHTML(slot.area)} · ${slot.id}</h3><p>EV designated space · ${money(slot.price)} / hour</p><span class="ev-status">● ${slot.status.toUpperCase()}</span></div>${slot.status==="Available"?`<button class="small-book" data-book-slot="${slot.id}">Reserve ↗</button>`:"<span class='demo-label'>UNAVAILABLE</span>"}</article>`).join("");
}
function renderBookings(){
  const list=document.getElementById("bookingList");
  if(!state.bookings.length){
    list.innerHTML=`<div class="empty-state"><span>▤</span><h3>No bookings yet.</h3><p>Your reservations will appear here after you book a demo space.</p><button class="btn btn-gold" data-page-link="find-parking">Find parking</button></div>`;
  }else{
    list.innerHTML=state.bookings.map(booking=>`<article class="booking-item"><div><h3>${escapeHTML(booking.area)} · ${escapeHTML(booking.slotId)}</h3><p>${escapeHTML(booking.id)} · ${escapeHTML(booking.date)} · ${money(booking.price)} / hour</p><span class="status-chip">${booking.status.toUpperCase()}</span></div><div class="booking-actions"><button class="small-book" data-show-pass="${booking.id}">View pass</button>${booking.status==="Reserved"?`<button class="small-book" data-cancel="${booking.id}">Cancel</button>`:""}</div></article>`).join("");
  }
  const recent=state.bookings.slice(0,3);
  document.getElementById("dashboardBookings").innerHTML=recent.length?recent.map(booking=>`<div class="compact-booking"><div><strong>${escapeHTML(booking.area)} · ${escapeHTML(booking.slotId)}</strong><small>${escapeHTML(booking.id)}</small></div><span class="status-chip">${booking.status}</span></div>`).join(""):`<p class="tiny-note">No bookings yet. Your first reservation will appear here.</p>`;
  document.getElementById("userActive").textContent=activeBookings().length;
  document.getElementById("userAvailable").textContent=availableSlots().length;
  document.getElementById("userTotal").textContent=state.bookings.length;
}
function renderPass(){
  const booking=state.bookings.find(item=>item.id===state.lastBookingId);
  const container=document.getElementById("passContent");
  if(!booking){
    container.innerHTML=`<div class="empty-state"><span>▤</span><h3>No pass selected yet.</h3><p>Make a demo booking to create your parking pass.</p><button class="btn btn-gold" data-page-link="find-parking">Find parking</button></div>`;
    return;
  }
  container.innerHTML=`<div class="pass-card"><div class="pass-top"><strong>SMART<span style="color:var(--gold)">PARK</span></strong><span>DIGITAL PARKING PASS</span></div><div class="pass-id">${escapeHTML(booking.id)}</div><div class="pass-details">
    <div><small>PARKING LOCATION</small><strong>${escapeHTML(booking.area)}</strong></div>
    <div><small>SPACE NUMBER</small><strong>${escapeHTML(booking.slotId)}</strong></div>
    <div><small>DATE</small><strong>${escapeHTML(booking.date)}</strong></div>
    <div><small>ARRIVAL TIME</small><strong>${escapeHTML(booking.startTime)}</strong></div>
    <div><small>VEHICLE</small><strong>${escapeHTML(booking.vehicle)}</strong></div>
    <div><small>HOURLY RATE</small><strong>${money(booking.price)} / hour</strong></div>
    </div><p class="pass-disclaimer">DEMO PASS ONLY · This booking is stored in this browser. It is not a valid entry ticket for a real parking facility.</p></div>`;
}
function renderAdmin(){
  const total=state.slots.length,available=availableSlots().length,active=activeBookings();
  document.getElementById("adminTotalSlots").textContent=total;
  document.getElementById("adminAvailable").textContent=available;
  document.getElementById("adminBookings").textContent=active.length;
  document.getElementById("adminRevenue").textContent=money(active.reduce((sum,booking)=>sum+booking.price,0));
  const tbody=document.getElementById("adminBookingRows");
  tbody.innerHTML=state.bookings.length?state.bookings.map(booking=>`<tr><td>${escapeHTML(booking.id)}</td><td>${escapeHTML(booking.area)} / ${escapeHTML(booking.slotId)}</td><td>${escapeHTML(booking.user)}</td><td>${money(booking.price)}</td><td>${escapeHTML(booking.status)}</td><td>${booking.status==="Reserved"?`<button class="table-action" data-cancel="${booking.id}">Cancel</button>`:"—"}</td></tr>`).join(""):`<tr><td colspan="6">No demo bookings yet.</td></tr>`;
}
function renderAll(){
  renderParking();renderMap();renderEco();renderBookings();renderPass();renderAdmin();
  document.getElementById("heroAvailable").textContent=`${availableSlots().length} spaces`;
}
document.addEventListener("click",event=>{
  const book=event.target.closest("[data-book-slot]");
  if(book){bookSlot(book.dataset.bookSlot);return;}
  const cancel=event.target.closest("[data-cancel]");
  if(cancel){cancelBooking(cancel.dataset.cancel);return;}
  const pass=event.target.closest("[data-show-pass]");
  if(pass){showPass(pass.dataset.showPass);return;}
});
document.getElementById("refreshAdmin").addEventListener("click",()=>{renderAll();showToast("Admin data refreshed.");});
document.getElementById("year").textContent=new Date().getFullYear();

// Restore the requested page when a page hash is present.
const initialPage=window.location.hash.replace("#","");
if(initialPage && document.querySelector(`[data-page="${initialPage}"]`)){
  document.querySelectorAll(".page").forEach(section=>section.classList.toggle("active",section.dataset.page===initialPage));
  document.querySelectorAll(".nav-link").forEach(link=>link.classList.toggle("active",link.dataset.pageLink===initialPage));
}
renderAll();
