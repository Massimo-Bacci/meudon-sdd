// =====================
// Global state
// =====================
const events = JSON.parse(localStorage.getItem("events")) || [];
let editingEventId = null;

// =====================
// Base styles
// =====================
document.body.style.cssText = `
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f3f4f6;
`;

// =====================
// Toolbar
// =====================
const toolbar = document.createElement("div");
toolbar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: #111827;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
  z-index: 1000;
`;

const title = document.createElement("div");
title.textContent = "Urban Soccer Meudon – Stars Du Dimanche";
title.style.cssText = `
  color: white;
  font-weight: 600;
  margin-right: 24px;
`;

function toolbarButton(label) {
  const b = document.createElement("button");
  b.textContent = label;
  b.style.cssText = `
    background: #1f2937;
    color: #e5e7eb;
    border: 1px solid #374151;
    border-radius: 10px;
    padding: 8px 14px;
    cursor: pointer;
  `;
  return b;
}

const subscribeBtn = toolbarButton("Subscribe");
const createEventBtn = toolbarButton("Create Event");

toolbar.append(title, subscribeBtn, createEventBtn);
document.body.appendChild(toolbar);
document.body.style.paddingTop = "64px";

// =====================
// Main content
// =====================
const content = document.createElement("div");
content.style.cssText = `
  padding: 24px;
  max-width: 900px;
  margin: auto;
`;
document.body.appendChild(content);

// =====================
// Render events
// =====================
function renderList() {
  content.innerHTML = "<h2>Events</h2>";

  if (!events.length) {
    content.innerHTML += "<p>No events created yet.</p>";
    return;
  }

  events.forEach(event => {
    const card = document.createElement("div");
    card.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    `;

    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    `;

    const info = document.createElement("div");
    info.innerHTML = `
      <strong>${event.date} ${event.time}</strong><br>
      <span style="color:#6b7280">
        Field: ${event.field} · Players: ${event.players}
      </span>
    `;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.cssText = `
      background: #2563eb;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
    `;
    editBtn.onclick = () => openEditEvent(event);

    header.append(info, editBtn);
    card.appendChild(header);

    const subTitle = document.createElement("div");
    subTitle.textContent = "Subscribers";
    subTitle.style.cssText = "font-weight:600;margin-top:10px";
    card.appendChild(subTitle);

    if (!event.subscribers.length) {
      card.innerHTML += "<p style='color:#6b7280'>No subscribers yet</p>";
    } else {
      event.subscribers.forEach(s => {
        const row = document.createElement("div");
        row.style.cssText = `
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #e5e7eb;
        `;
        row.innerHTML = `<span>${s.name}</span><span>${s.phone}</span>`;
        card.appendChild(row);
      });
    }

    content.appendChild(card);
  });
}

// =====================
// Modal helpers
// =====================
function createOverlay() {
  const o = document.createElement("div");
  o.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  `;
  document.body.appendChild(o);
  return o;
}

function createModal(title) {
  const m = document.createElement("div");
  m.style.cssText = `
    background: white;
    padding: 24px;
    width: 380px;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 20px;
  `;
  m.innerHTML = `<h3 style="margin-top:0">${title}</h3>`;
  return m;
}

function input(placeholder = "") {
  const i = document.createElement("input");
  i.placeholder = placeholder;
  i.style.cssText = `
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
  `;
  return i;
}

function primaryButton(label) {
  const b = document.createElement("button");
  b.textContent = label;
  b.style.cssText = `
    width: 100%;
    padding: 12px;
    background: #111827;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 12px;
  `;
  return b;
}

// =====================
// Create Event modal
// =====================
const createOverlayEl = createOverlay();
const createModalEl = createModal("Create Event");

const dateInput = input("Date");
dateInput.type = "date";
const timeInput = input("Time");
timeInput.type = "time";
const playersInput = input("Number of players");
playersInput.type = "number";
const fieldInput = input("Field");

const createSave = primaryButton("Create Event");
const createCancel = primaryButton("Cancel");
createCancel.style.background = "#e5e7eb";
createCancel.style.color = "black";

createModalEl.append(
  dateInput,
  timeInput,
  playersInput,
  fieldInput,
  createSave,
  createCancel
);
createOverlayEl.appendChild(createModalEl);

// =====================
// Subscribe modal
// =====================
const subOverlay = createOverlay();
const subModal = createModal("Subscribe");

const eventSelect = document.createElement("select");
eventSelect.style.cssText = input().style.cssText;

const nameInput = input("Your name");
const phoneInput = input("Phone number");

const subSave = primaryButton("Subscribe");
const subCancel = primaryButton("Cancel");
subCancel.style.background = "#e5e7eb";
subCancel.style.color = "black";

subModal.append(eventSelect, nameInput, phoneInput, subSave, subCancel);
subOverlay.appendChild(subModal);

// =====================
// Edit Event modal (with subscribers)
// =====================
const editOverlay = createOverlay();
const editModal = createModal("Edit Event");
editOverlay.appendChild(editModal);

function openEditEvent(event) {
  editModal.innerHTML = "<h3>Edit Event</h3>";

  const d = input();
  d.type = "date";
  d.value = event.date;

  const t = input();
  t.type = "time";
  t.value = event.time;

  const p = input();
  p.type = "number";
  p.value = event.players;

  const f = input();
  f.value = event.field;

  editModal.append(d, t, p, f);
  editModal.appendChild(document.createElement("hr"));

  event.subscribers.forEach((s, idx) => {
    const row = document.createElement("div");
    row.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 8px;
      margin-bottom: 8px;
    `;

    const ni = input();
    ni.value = s.name;
    const pi = input();
    pi.value = s.phone;

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.style.cssText = `
      background:#fee2e2;
      border:none;
      border-radius:8px;
      cursor:pointer;
    `;
    remove.onclick = () => {
      event.subscribers.splice(idx, 1);
      openEditEvent(event);
    };

    row.append(ni, pi, remove);
    editModal.appendChild(row);

    s._ni = ni;
    s._pi = pi;
  });

  const save = primaryButton("Save changes");
  save.onclick = () => {
    event.date = d.value;
    event.time = t.value;
    event.players = p.value;
    event.field = f.value;
    event.subscribers.forEach(s => {
      s.name = s._ni.value;
      s.phone = s._pi.value;
      delete s._ni;
      delete s._pi;
    });
    localStorage.setItem("events", JSON.stringify(events));
    editOverlay.style.display = "none";
    renderList();
  };

  editModal.appendChild(save);
  editOverlay.style.display = "flex";
}

// =====================
// Actions
// =====================
createEventBtn.onclick = () => {
  dateInput.value = timeInput.value = playersInput.value = fieldInput.value = "";
  createOverlayEl.style.display = "flex";
};

createCancel.onclick = () => createOverlayEl.style.display = "none";

createSave.onclick = () => {
  if (!dateInput.value || !timeInput.value || !playersInput.value || !fieldInput.value) {
    alert("Fill all fields");
    return;
  }
  events.push({
    id: crypto.randomUUID(),
    date: dateInput.value,
    time: timeInput.value,
    players: playersInput.value,
    field: fieldInput.value,
    subscribers: []
  });
  localStorage.setItem("events", JSON.stringify(events));
  createOverlayEl.style.display = "none";
  renderList();
};

subscribeBtn.onclick = () => {
  eventSelect.innerHTML = "<option value=''>Select event</option>";
  events.forEach(e => {
    const o = document.createElement("option");
    o.value = e.id;
    o.textContent = `${e.date} ${e.time} - ${e.field}`;
    eventSelect.appendChild(o);
  });
  subOverlay.style.display = "flex";
};

subCancel.onclick = () => subOverlay.style.display = "none";

subSave.onclick = () => {
  const event = events.find(e => e.id === eventSelect.value);
  if (!event || !nameInput.value || !phoneInput.value) {
    alert("Fill all fields");
    return;
  }
  event.subscribers.push({ name: nameInput.value, phone: phoneInput.value });
  localStorage.setItem("events", JSON.stringify(events));
  nameInput.value = phoneInput.value = "";
  subOverlay.style.display = "none";
  renderList();
};

// =====================
// Init
// =====================
renderList();
