/**
 * notes.js - Notes Repository and Management System
 * Fetches notes from the backend (MongoDB) so every user, on every
 * device, sees notes the admin has uploaded.
 */

// Same backend URL used elsewhere in this project (developer.html admin panel)
const NOTES_API_URL = "https://sgpa-calculator-g0c8.onrender.com";

const defaultNotes = [
  {
    id: "default-1",
    stream: "science",
    dept: "computer_science",
    semester: "1",
    title: "Programming in C - Core I Lecture Notes",
    link: "https://drive.google.com/drive/folders/1TMCgN0t3kZxp8m-2VbKq_74uP1y5W0fD",
  },
  {
    id: "default-2",
    stream: "science",
    dept: "mathematics",
    semester: "2",
    title: "Discrete Mathematics Complete Study Guide",
    link: "https://drive.google.com/drive/folders/1V1_8c_nMc82i9sLpC5hRkSg2tP83c7sM",
  },
  {
    id: "default-3",
    stream: "arts",
    dept: "economics",
    semester: "1",
    title: "Microeconomics Basics & Reference Materials",
    link: "https://drive.google.com/drive/folders/1G4h8y1mK-nZk8m9oLpC4tR4uP8y3W6fC",
  },
  {
    id: "default-4",
    stream: "commerce",
    dept: "general",
    semester: "3",
    title: "Financial Accounting & Business Statistics Handouts",
    link: "https://drive.google.com/drive/folders/1K6h8y1mJ-uZk9m8oLpC5tR4uQ8y3W7fD",
  },
  {
    id: "default-5",
    stream: "science",
    dept: "physics",
    semester: "3",
    title: "Electromagnetic Theory - Core VII Notes",
    link: "https://drive.google.com/drive/folders/1L6h8y1mJ-uZk9m8oLpC5tR4uQ8y3W7fE",
  },
  {
    id: "default-6",
    stream: "arts",
    dept: "political_science",
    semester: "2",
    title: "Political Theory & Constitutional Democracy Notes",
    link: "https://drive.google.com/drive/folders/1M6h8y1mJ-uZk9m8oLpC5tR4uQ8y3W7fF",
  },
];

const deptOptions = {
  science: [
    { value: "botany", text: "Botany" },
    { value: "chemistry", text: "Chemistry" },
    { value: "computer_science", text: "Computer Science" },
    { value: "mathematics", text: "Mathematics" },
    { value: "physics", text: "Physics" },
    { value: "zoology", text: "Zoology" },
  ],
  arts: [
    { value: "economics", text: "Economics" },
    { value: "education", text: "Education" },
    { value: "english", text: "English" },
    { value: "history", text: "History" },
    { value: "odia", text: "Odia" },
    { value: "philosophy", text: "Philosophy" },
    { value: "political_science", text: "Political Science" },
    { value: "sanskrit", text: "Sanskrit" },
  ],
  commerce: [{ value: "general", text: "Commerce Honors / General" }],
};

const NotesManager = {
  notes: [],
  currentType: "notes", // "notes" or "pyq" — controlled by the tab buttons

  async init() {
    this.setupEventListeners();
    this.updateDeptSelects();
    await this.loadNotes();
  },

  // Fetch notes (or PYQs) from the backend (shared across all users/devices).
  // Falls back to the built-in default list if the server is unreachable.
  async loadNotes() {
    try {
      const res = await fetch(
        NOTES_API_URL + "/api/notes?type=" + this.currentType,
      );
      if (!res.ok) throw new Error("Bad response");
      const serverNotes = await res.json();
      this.notes =
        this.currentType === "notes" && serverNotes.length === 0
          ? [...defaultNotes]
          : serverNotes;
    } catch (err) {
      console.warn("Could not reach notes server, using default notes.", err);
      this.notes = this.currentType === "notes" ? [...defaultNotes] : [];
    }
  },

  setupEventListeners() {
    // Dropdown dynamic update listener
    const notesStreamSelect = document.getElementById("notes-stream-select");
    if (notesStreamSelect) {
      notesStreamSelect.addEventListener("change", () => {
        this.updateDeptSelect("notes-stream-select", "notes-dept-select");
      });
    }

    // Browse / Filter Button
    const viewBtn = document.getElementById("btn-view-notes");
    if (viewBtn) {
      viewBtn.addEventListener("click", () => this.filterNotes());
    }

    // Tab buttons: switch between Notes and PYQ
    const tabButtons = document.querySelectorAll(".notes-tab-btn");
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const type = btn.getAttribute("data-type");
        if (!type || type === this.currentType) return;

        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        this.currentType = type;
        await this.loadNotes();

        // Re-show the "please select filters" prompt on tab switch
        const container = document.getElementById("notes-list-container");
        if (container) {
          const label =
            type === "pyq"
              ? "PYQs"
              : type === "syllabus"
                ? "syllabus"
                : "notes";
          container.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-solid fa-circle-info" style="font-size: 2rem; color: var(--accent); margin-bottom: 10px;"></i>
                            <p style="font-weight: 600;">Please select Stream, Department, and Semester to view ${label}.</p>
                        </div>
                    `;
        }
      });
    });
  },

  updateDeptSelects() {
    this.updateDeptSelect("notes-stream-select", "notes-dept-select");
  },

  updateDeptSelect(streamId, deptId) {
    const streamSelect = document.getElementById(streamId);
    const deptSelect = document.getElementById(deptId);
    if (!streamSelect || !deptSelect) return;

    const val = streamSelect.value;
    deptSelect.innerHTML = '<option value="">Choose Department</option>';

    if (val && deptOptions[val]) {
      deptOptions[val].forEach((dept) => {
        const opt = document.createElement("option");
        opt.value = dept.value;
        opt.textContent = dept.text;
        deptSelect.appendChild(opt);
      });
    }
  },

  filterNotes() {
    const stream = document.getElementById("notes-stream-select").value;
    const dept = document.getElementById("notes-dept-select").value;
    const sem = document.getElementById("notes-sem-select").value;
    const container = document.getElementById("notes-list-container");
    const label =
      this.currentType === "pyq"
        ? "PYQs"
        : this.currentType === "syllabus"
          ? "syllabus"
          : "notes";

    if (!container) return;

    if (!stream || !dept || !sem) {
      container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-circle-info" style="font-size: 2rem; color: var(--accent); margin-bottom: 10px;"></i>
                    <p style="font-weight: 600;">Please select Stream, Department, and Semester to view ${label}.</p>
                </div>
            `;
      return;
    }

    const filtered = this.notes.filter(
      (note) =>
        note.stream === stream && note.dept === dept && note.semester === sem,
    );

    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 10px;"></i>
                    <p style="font-weight: 600;">No ${label} found for this combination.</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Request your coordinator or an admin to upload ${label}.</p>
                </div>
            `;
      return;
    }

    filtered.forEach((note) => {
      const card = document.createElement("div");
      card.className = "note-item-card";
      const icon =
        this.currentType === "pyq"
          ? "fa-file-circle-question"
          : this.currentType === "syllabus"
            ? "fa-scroll"
            : "fa-file-pdf";
      const btnLabel =
        this.currentType === "pyq"
          ? "Open PYQ"
          : this.currentType === "syllabus"
            ? "Open Syllabus"
            : "Open Notes";
      card.innerHTML = `
                <div class="note-info">
                    <i class="fa-solid ${icon} note-icon"></i>
                    <div style="text-align: left;">
                        <h4 class="note-title">${note.title}</h4>
                        <span class="note-meta">${note.dept.toUpperCase().replace("_", " ")} | Semester ${note.semester}</span>
                    </div>
                </div>
                <a href="${note.link}" target="_blank" class="btn btn-download-note">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> ${btnLabel}
                </a>
            `;
      container.appendChild(card);
    });
  },
};

window.addEventListener("DOMContentLoaded", () => {
  NotesManager.init();
});
