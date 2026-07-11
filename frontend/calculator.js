/**
 * calculator.js - Professional Tabulation SGPA & CGPA Calculator for Fakir Mohan University.
 * Supports NEP-2020 and CBCS Syllabus Schemes with automatic template loading,
 * component-level pass/fail validation, grace marks advice, history database, and printing.
 */

const templates = {
    nep: {
        arts: {
            economics: [
                { name: 'CORE-I (MAJOR) ECO-I', cr: 4, hasPr: false },
                { name: 'CORE-I (MAJOR) ECO-II', cr: 4, hasPr: false },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: false },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (MIL-Odia)', cr: 4, hasPr: false }
            ],
            education: [
                { name: 'CORE-I (MAJOR) EDU-I', cr: 4, hasPr: true },
                { name: 'CORE-I (MAJOR) EDU-II', cr: 4, hasPr: true },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: false },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ],
            general: [
                { name: 'CORE-I (MAJOR) - Paper I', cr: 4, hasPr: false },
                { name: 'CORE-I (MAJOR) - Paper II', cr: 4, hasPr: false },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: false },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ]
        },
        science: {
            botany: [
                { name: 'CORE-I (MAJOR) BOT-I', cr: 4, hasPr: true },
                { name: 'CORE-I (MAJOR) BOT-II', cr: 4, hasPr: true },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: true },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ],
            chemistry: [
                { name: 'CORE-I (MAJOR) CHEM-I', cr: 4, hasPr: true },
                { name: 'CORE-I (MAJOR) CHEM-II', cr: 4, hasPr: true },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: true },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ],
            computer_science: [
                { name: 'CORE-I (MAJOR) CSC-I', cr: 4, hasPr: true },
                { name: 'CORE-I (MAJOR) CSC-II', cr: 4, hasPr: true },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: true },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ],
            mathematics: [
                { name: 'CORE-I (MAJOR) MATH-I', cr: 4, hasPr: false },
                { name: 'CORE-I (MAJOR) MATH-II', cr: 4, hasPr: false },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: false },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ],
            physics: [
                { name: 'CORE-I (MAJOR) PHY-I', cr: 4, hasPr: true },
                { name: 'CORE-I (MAJOR) PHY-II', cr: 4, hasPr: true },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: true },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ],
            zoology: [
                { name: 'CORE-I (MAJOR) ZOOL-I', cr: 4, hasPr: true },
                { name: 'CORE-I (MAJOR) ZOOL-II', cr: 4, hasPr: true },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: true },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ],
            general: [
                { name: 'CORE-I (MAJOR) - Paper I', cr: 4, hasPr: false },
                { name: 'CORE-I (MAJOR) - Paper II', cr: 4, hasPr: false },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: false },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ]
        },
        commerce: {
            general: [
                { name: 'CORE-I (MAJOR) - Paper I', cr: 4, hasPr: false },
                { name: 'CORE-I (MAJOR) - Paper II', cr: 4, hasPr: false },
                { name: 'CORE-II (MINOR) - Paper I', cr: 4, hasPr: false },
                { name: 'MDC-I (Multi-Disciplinary)', cr: 3, hasPr: false },
                { name: 'AEC-I (Language/MIL)', cr: 4, hasPr: false }
            ]
        }
    },
    cbcs: {
        arts: {
            economics: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2 (QLT)', cr: 4, hasPr: false },
                { name: 'CORE-8 (ECO)', cr: 6, hasPr: false },
                { name: 'CORE-9 (ECO)', cr: 6, hasPr: false },
                { name: 'CORE-10 (ECO)', cr: 6, hasPr: false },
                { name: 'GE-B2 (Generic Elective)', cr: 6, hasPr: false }
            ],
            education: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2 (LPP)', cr: 4, hasPr: false },
                { name: 'CORE-8 (EDU)', cr: 6, hasPr: true },
                { name: 'CORE-9 (EDU)', cr: 6, hasPr: true },
                { name: 'CORE-10 (EDU)', cr: 6, hasPr: true },
                { name: 'GE-B2 (Generic Elective)', cr: 6, hasPr: false }
            ],
            general: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8', cr: 6, hasPr: false },
                { name: 'CORE-9', cr: 6, hasPr: false },
                { name: 'CORE-10', cr: 6, hasPr: false },
                { name: 'GE-B2', cr: 6, hasPr: false }
            ]
        },
        science: {
            botany: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8 (BOT)', cr: 6, hasPr: true },
                { name: 'CORE-9 (BOT)', cr: 6, hasPr: true },
                { name: 'CORE-10 (BOT)', cr: 6, hasPr: true },
                { name: 'GE-B2', cr: 6, hasPr: true }
            ],
            chemistry: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8 (CHEM)', cr: 6, hasPr: true },
                { name: 'CORE-9 (CHEM)', cr: 6, hasPr: true },
                { name: 'CORE-10 (CHEM)', cr: 6, hasPr: true },
                { name: 'GE-B2', cr: 6, hasPr: true }
            ],
            computer_science: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8 (CSC)', cr: 6, hasPr: true },
                { name: 'CORE-9 (CSC)', cr: 6, hasPr: true },
                { name: 'CORE-10 (CSC)', cr: 6, hasPr: true },
                { name: 'GE-B2', cr: 6, hasPr: true }
            ],
            mathematics: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8 (MATH)', cr: 6, hasPr: false },
                { name: 'CORE-9 (MATH)', cr: 6, hasPr: false },
                { name: 'CORE-10 (MATH)', cr: 6, hasPr: false },
                { name: 'GE-B2', cr: 6, hasPr: false }
            ],
            physics: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8 (PHY)', cr: 6, hasPr: true },
                { name: 'CORE-9 (PHY)', cr: 6, hasPr: true },
                { name: 'CORE-10 (PHY)', cr: 6, hasPr: true },
                { name: 'GE-B2', cr: 6, hasPr: true }
            ],
            zoology: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8 (ZOOL)', cr: 6, hasPr: true },
                { name: 'CORE-9 (ZOOL)', cr: 6, hasPr: true },
                { name: 'CORE-10 (ZOOL)', cr: 6, hasPr: true },
                { name: 'GE-B2', cr: 6, hasPr: true }
            ],
            general: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8', cr: 6, hasPr: false },
                { name: 'CORE-9', cr: 6, hasPr: false },
                { name: 'CORE-10', cr: 6, hasPr: false },
                { name: 'GE-B2', cr: 6, hasPr: false }
            ]
        },
        commerce: {
            general: [
                { name: 'AECC-EV (Ethics & Values)', cr: 1, hasPr: false },
                { name: 'SEC-2', cr: 4, hasPr: false },
                { name: 'CORE-8', cr: 6, hasPr: false },
                { name: 'CORE-9', cr: 6, hasPr: false },
                { name: 'CORE-10', cr: 6, hasPr: false },
                { name: 'GE-B2', cr: 6, hasPr: false }
            ]
        }
    }
};

const state = {
    user: null,
    stream: 'arts',
    activeTab: 'calc',
    syllabusMode: 'nep',
    subjects: [],
    history: []
};

const CalculatorController = {
    init() {
        this.loadTheme();
        this.detectStream();
        this.loadUserSession();
        this.bindEvents();
        this.detectSyllabusAndLoad();
        this.loadSavedHistory();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem("theme") || "theme-light";
        document.body.className = savedTheme;
        const icon = document.querySelector('#theme-toggle-btn i');
        if (icon) {
            if (savedTheme === 'theme-dark') {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    },

    detectStream() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);
        if (page.includes('science')) {
            state.stream = 'science';
        } else if (page.includes('commerce')) {
            state.stream = 'commerce';
        } else {
            state.stream = 'arts';
        }
    },

    loadUserSession() {
        const loggedInUser = localStorage.getItem("loggedInUser");
        const profileSection = document.getElementById("user-profile-section");
        const loginBtn = document.getElementById("header-login-btn");

        if (!loggedInUser) {
            window.location.href = "login.html";
            return;
        }

        state.user = JSON.parse(loggedInUser);
        if (profileSection) profileSection.style.display = "flex";
        if (loginBtn) loginBtn.style.display = "none";
        
        const nameDisplay = document.getElementById("user-name-display");
        if (nameDisplay) nameDisplay.textContent = state.user.name;

        const printName = document.getElementById("print-user-name");
        if (printName) printName.textContent = state.user.name;

        const printEmail = document.getElementById("print-user-email");
        if (printEmail) printEmail.textContent = state.user.email;
    },

    bindEvents() {
        // Theme toggler
        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            const body = document.body;
            const icon = document.querySelector('#theme-toggle-btn i');
            if (body.classList.contains('theme-light')) {
                body.classList.replace('theme-light', 'theme-dark');
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem("theme", "theme-dark");
            } else {
                body.classList.replace('theme-dark', 'theme-light');
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem("theme", "theme-light");
            }
        });

        // Logout
        document.getElementById("logout-btn").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            window.location.href = "index.html";
        });

        // Dropdowns change events
        document.getElementById('dept-select').addEventListener('change', () => this.detectSyllabusAndLoad());
        document.getElementById('semester-select').addEventListener('change', () => this.detectSyllabusAndLoad());

        // Buttons
        document.getElementById('custom-reset-btn').addEventListener('click', () => this.resetCalculator());
        
        const saveBtn = document.getElementById('save-result-btn');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveCurrentResult());

        const printBtn = document.getElementById('custom-print-btn');
        if (printBtn) printBtn.addEventListener('click', () => this.printGradeSheet());
    },

    detectSyllabusAndLoad() {
        const semester = parseInt(document.getElementById("semester-select").value);
        const mode = semester <= 3 ? 'nep' : 'cbcs';
        state.syllabusMode = mode;

        const badge = document.getElementById("syllabus-badge");
        if (badge) {
            badge.textContent = mode === 'nep' ? 'NEP-2020 Scheme' : 'CBCS Scheme';
        }

        this.renderHeaders();
        this.loadCurriculumTemplate(semester);
    },

    renderHeaders() {
        const headerRow = document.getElementById("table-headers-row");
        if (!headerRow) return;

        if (state.syllabusMode === 'cbcs') {
            headerRow.innerHTML = `
                <th style="min-width: 240px; text-align: left;">Paper / Subject</th>
                <th>Credits (CR)</th>
                <th>Practical?</th>
                <th>Mid Sem</th>
                <th>End Theory</th>
                <th>End Practical</th>
                <th>Total</th>
                <th>Grade</th>
                <th>GP</th>
                <th>CP</th>
            `;
        } else {
            headerRow.innerHTML = `
                <th style="min-width: 240px; text-align: left;">Paper / Subject</th>
                <th>Credits (CR)</th>
                <th>Practical?</th>
                <th>Mid Theory</th>
                <th>Mid Pract.</th>
                <th>Mid Att.</th>
                <th>Mid S/T</th>
                <th>Mid Ass.</th>
                <th>End Theory</th>
                <th>End Practical</th>
                <th>Total</th>
                <th>Grade</th>
                <th>GP</th>
                <th>CP</th>
            `;
        }
    },

    loadCurriculumTemplate(semester) {
        const dept = document.getElementById("dept-select").value;
        const mode = state.syllabusMode;
        
        let deptKey = 'general';
        if (state.stream === 'arts') {
            deptKey = (dept === 'economics' || dept === 'education') ? dept : 'general';
        } else if (state.stream === 'science') {
            deptKey = templates[mode][state.stream][dept] ? dept : 'general';
        }

        let list = JSON.parse(JSON.stringify(templates[mode][state.stream][deptKey] || templates[mode][state.stream].general));

        // Syllabus adjustments for semesters
        if (mode === 'nep') {
            if (semester === 1) {
                // Keep default templates
            } else if (semester === 2) {
                list = list.map(s => {
                    let name = s.name.replace('-I', '-III').replace('-II', '-IV').replace('Paper I', 'Paper III').replace('Paper II', 'Paper IV').replace('MINOR - Paper I', 'MINOR - Paper II');
                    if (name.includes('AEC-I')) name = 'AEC-II (MIL-CE)';
                    if (name.includes('MDC-I')) name = 'MDC-II';
                    return { ...s, name };
                });
                list.push({ name: 'SEC-II (Skill Course)', cr: 3, hasPr: false });
                list.push({ name: 'VAC-II (Ethics & Values)', cr: 3, hasPr: false });
            } else if (semester === 3) {
                list = list.map(s => {
                    let name = s.name.replace('-I', '-V').replace('-II', '-VI').replace('Paper I', 'Paper V').replace('Paper II', 'Paper VI');
                    if (name.includes('MDC-I')) name = 'MDC-III';
                    if (name.includes('AEC-I')) name = 'VAC-II (Ethics & Values)';
                    return { ...s, name };
                });
                // Add Major VII
                const majorDeptName = dept.toUpperCase();
                list.splice(2, 0, { name: `CORE-I (MAJOR) ${majorDeptName}-VII`, cr: 4, hasPr: (deptKey === 'education' || state.stream === 'science' && deptKey !== 'mathematics') });
            }
        } else if (mode === 'cbcs') {
            if (semester === 4) {
                list = list.map(s => {
                    let name = s.name.replace('EV', 'EV-4');
                    return { ...s, name };
                });
            } else if (semester === 5) {
                if (state.stream === 'commerce') {
                    list = [
                        { name: 'AECC-EV (EV-5)', cr: 1, hasPr: false },
                        { name: 'CORE-11 (CAETR)', cr: 6, hasPr: true },
                        { name: 'CORE-12 (FFM)', cr: 6, hasPr: false },
                        { name: 'DSE-1 (FMIS)', cr: 6, hasPr: false },
                        { name: 'DSE-2 (FSAR)', cr: 6, hasPr: false }
                    ];
                } else {
                    list = list.filter(s => !s.name.includes('SEC-2') && !s.name.includes('GE-B2'));
                    list = list.map(s => {
                        let name = s.name.replace('AECC-EV', 'AECC-EV (EV-5)').replace('CORE-8', 'CORE-11').replace('CORE-9', 'CORE-12');
                        return { ...s, name };
                    });
                    const hasPr = (deptKey === 'education' || (state.stream === 'science' && deptKey !== 'mathematics'));
                    list.push({ name: 'DSE-1', cr: 6, hasPr });
                    list.push({ name: 'DSE-2', cr: 6, hasPr });
                }
            } else if (semester === 6) {
                if (state.stream === 'commerce') {
                    list = [
                        { name: 'AECC-EV (EV-6)', cr: 1, hasPr: false },
                        { name: 'CORE-13 (ACG)', cr: 6, hasPr: false },
                        { name: 'CORE-14 (BM)', cr: 6, hasPr: false },
                        { name: 'DSE-3 (FCTP)', cr: 6, hasPr: false },
                        { name: 'DSE-4 (BRMP)', cr: 6, hasPr: false, isBRMP: true }
                    ];
                } else {
                    list = list.filter(s => !s.name.includes('SEC-2') && !s.name.includes('GE-B2'));
                    list = list.map(s => {
                        let name = s.name.replace('AECC-EV', 'AECC-EV (EV-6)').replace('CORE-8', 'CORE-13').replace('CORE-9', 'CORE-14');
                        return { ...s, name };
                    });
                    const hasPr = (deptKey === 'education' || (state.stream === 'science' && deptKey !== 'mathematics'));
                    list.push({ name: 'DSE-3', cr: 6, hasPr });
                    list.push({ name: 'DSE-4 (PRJ - Project)', cr: 6, hasPr: false, isPRJ: true });
                }
            }
        }

        state.subjects = list.map(s => ({
            ...s,
            midTh: 0,
            midPr: 0,
            midAtt: 0,
            midSt: 0,
            midAssign: 0,
            endTh: 0,
            endPr: 0
        }));

        this.renderTableRows();
    },

    renderTableRows() {
        const container = document.getElementById('custom-table-body');
        if (!container) return;
        container.innerHTML = '';

        state.subjects.forEach((s, idx) => {
            const tr = document.createElement('tr');
            tr.dataset.index = idx;

            const isEthics = s.name.includes('Ethics') || s.name.includes('AECC-EV') || false;
            const isEVS = s.name.includes('EVS') || false;

            // Maximum values dynamically updated based on hasPr and syllabusMode
            let maxMidTh = s.hasPr ? 10 : 20;
            let maxMidSt = s.hasPr ? 5 : 10;
            let maxEndTh = s.hasPr ? 50 : 60;
            let maxEndPr = s.hasPr ? 20 : 0;

            if (state.syllabusMode === 'cbcs') {
                if (isEthics || s.cr === 1) {
                    maxMidTh = 0;
                    maxEndTh = 25;
                } else {
                    maxMidTh = s.hasPr ? 15 : 20;
                    maxEndTh = s.hasPr ? 60 : 80;
                }
                maxEndPr = s.hasPr ? 25 : 0;
            } else if (isEVS) {
                maxMidTh = 0;
                maxEndTh = 100;
                maxEndPr = 0;
            }

            if (s.isPRJ) {
                maxMidTh = 0;
                maxEndTh = 100;
                maxEndPr = 0;
            } else if (s.isBRMP) {
                maxMidTh = 50;
                maxEndTh = 50;
                maxEndPr = 0;
            }

            if (state.syllabusMode === 'cbcs') {
                tr.innerHTML = `
                    <td data-label="Subject" style="text-align: left; font-weight: 600;">${s.name}</td>
                    <td data-label="Credits (CR)">${s.cr}</td>
                    <td data-label="Practical?">
                        <button class="practical-toggle-btn ${s.hasPr ? 'active' : ''}" onclick="CalculatorController.togglePractical(${idx})" ${s.isPRJ || s.isBRMP || isEthics ? 'disabled' : ''}>
                            ${s.hasPr ? 'Yes' : 'No'}
                        </button>
                    </td>
                    <td data-label="Mid Sem">
                        <div class="input-table-container">
                            <input type="number" min="0" max="${maxMidTh}" value="${s.midTh || ''}" oninput="CalculatorController.updateMark(${idx}, 'midTh', this.value)" class="input-table" ${maxMidTh === 0 ? 'disabled' : ''}>
                            <span class="max-label">${maxMidTh > 0 ? '/' + maxMidTh : '-'}</span>
                        </div>
                    </td>
                    <td data-label="End Theory">
                        <div class="input-table-container">
                            <input type="number" min="0" max="${maxEndTh}" value="${s.endTh || ''}" oninput="CalculatorController.updateMark(${idx}, 'endTh', this.value)" class="input-table">
                            <span class="max-label">/${maxEndTh}</span>
                        </div>
                    </td>
                    <td data-label="End Practical">
                        <div class="input-table-container">
                            <input type="number" min="0" max="${maxEndPr}" value="${s.endPr || ''}" oninput="CalculatorController.updateMark(${idx}, 'endPr', this.value)" class="input-table" ${!s.hasPr ? 'disabled' : ''}>
                            <span class="max-label">${s.hasPr ? '/' + maxEndPr : '-'}</span>
                        </div>
                    </td>
                    <td data-label="Total" class="total-score" id="total-${idx}" style="font-weight: 700;">0</td>
                    <td data-label="Grade"><span class="badge f-grade" id="grade-${idx}">F</span></td>
                    <td data-label="GP" id="gp-${idx}" style="font-weight: 600;">0</td>
                    <td data-label="CP" id="cp-${idx}" style="font-weight: 700; color: var(--primary);">0</td>
                `;
            } else {
                tr.innerHTML = `
                    <td data-label="Subject" style="text-align: left; font-weight: 600;">${s.name}</td>
                    <td data-label="Credits (CR)">${s.cr}</td>
                    <td data-label="Practical?">
                        <button class="practical-toggle-btn ${s.hasPr ? 'active' : ''}" onclick="CalculatorController.togglePractical(${idx})" ${isEVS ? 'disabled' : ''}>
                            ${s.hasPr ? 'Yes' : 'No'}
                        </button>
                    </td>
                    <td data-label="Mid Theory">
                        <div class="input-table-container">
                            <input type="number" min="0" max="${maxMidTh}" value="${s.midTh || ''}" oninput="CalculatorController.updateMark(${idx}, 'midTh', this.value)" class="input-table" ${maxMidTh === 0 ? 'disabled' : ''}>
                            <span class="max-label">${maxMidTh > 0 ? '/' + maxMidTh : '-'}</span>
                        </div>
                    </td>
                    <td data-label="Mid Practical">
                        <div class="input-table-container">
                            <input type="number" min="0" max="10" value="${s.midPr || ''}" oninput="CalculatorController.updateMark(${idx}, 'midPr', this.value)" class="input-table" ${!s.hasPr || isEVS ? 'disabled' : ''}>
                            <span class="max-label">${s.hasPr ? '/10' : '-'}</span>
                        </div>
                    </td>
                    <td data-label="Mid Attendance">
                        <div class="input-table-container">
                            <input type="number" min="0" max="5" value="${s.midAtt || ''}" oninput="CalculatorController.updateMark(${idx}, 'midAtt', this.value)" class="input-table" ${isEVS ? 'disabled' : ''}>
                            <span class="max-label">${isEVS ? '-' : '/5'}</span>
                        </div>
                    </td>
                    <td data-label="Mid Seminar">
                        <div class="input-table-container">
                            <input type="number" min="0" max="${maxMidSt}" value="${s.midSt || ''}" oninput="CalculatorController.updateMark(${idx}, 'midSt', this.value)" class="input-table" ${isEVS ? 'disabled' : ''}>
                            <span class="max-label">${isEVS ? '-' : '/' + maxMidSt}</span>
                        </div>
                    </td>
                    <td data-label="Mid Assignment">
                        <div class="input-table-container">
                            <input type="number" min="0" max="5" value="${s.midAssign || ''}" oninput="CalculatorController.updateMark(${idx}, 'midAssign', this.value)" class="input-table" ${s.hasPr || isEVS ? 'disabled' : ''}>
                            <span class="max-label">${!s.hasPr && !isEVS ? '/5' : '-'}</span>
                        </div>
                    </td>
                    <td data-label="End Theory">
                        <div class="input-table-container">
                            <input type="number" min="0" max="${maxEndTh}" value="${s.endTh || ''}" oninput="CalculatorController.updateMark(${idx}, 'endTh', this.value)" class="input-table">
                            <span class="max-label">/${maxEndTh}</span>
                        </div>
                    </td>
                    <td data-label="End Practical">
                        <div class="input-table-container">
                            <input type="number" min="0" max="${maxEndPr}" value="${s.endPr || ''}" oninput="CalculatorController.updateMark(${idx}, 'endPr', this.value)" class="input-table" ${!s.hasPr ? 'disabled' : ''}>
                            <span class="max-label">${s.hasPr ? '/' + maxEndPr : '-'}</span>
                        </div>
                    </td>
                    <td data-label="Total" class="total-score" id="total-${idx}" style="font-weight: 700;">0</td>
                    <td data-label="Grade"><span class="badge f-grade" id="grade-${idx}">F</span></td>
                    <td data-label="GP" id="gp-${idx}" style="font-weight: 600;">0</td>
                    <td data-label="CP" id="cp-${idx}" style="font-weight: 700; color: var(--primary);">0</td>
                `;
            }

            container.appendChild(tr);
        });

        this.recalculateAll();
    },

    togglePractical(idx) {
        state.subjects[idx].hasPr = !state.subjects[idx].hasPr;
        if (state.subjects[idx].hasPr) {
            state.subjects[idx].midAssign = 0;
        } else {
            state.subjects[idx].midPr = 0;
            state.subjects[idx].endPr = 0;
        }
        this.renderTableRows();
    },

    updateMark(idx, field, val) {
        state.subjects[idx][field] = parseFloat(val) || 0;
        this.recalculateRow(idx);
        this.calculateOverall();
    },

    recalculateRow(index) {
        const s = state.subjects[index];
        const isEthics = s.name.includes('Ethics') || s.name.includes('AECC-EV') || false;
        const isEVS = s.name.includes('EVS') || false;

        let midTotal = 0;
        let endTotal = 0;
        let finalTotal = 0;

        if (state.syllabusMode === 'cbcs') {
            midTotal = s.midTh;
            endTotal = s.endTh + (s.hasPr ? s.endPr : 0);
        } else {
            midTotal = s.midTh + (s.hasPr ? s.midPr : 0) + s.midAtt + s.midSt + (!s.hasPr ? s.midAssign : 0);
            endTotal = s.endTh + (s.hasPr ? s.endPr : 0);
        }
        finalTotal = midTotal + endTotal;

        document.getElementById(`total-${index}`).textContent = Math.round(finalTotal);

        // pass benchmarks calculation
        let endThMax = 60;
        let endPrMax = 20;

        if (state.syllabusMode === 'cbcs') {
            if (isEthics || s.cr === 1) {
                endThMax = 25;
            } else {
                endThMax = s.hasPr ? 60 : 80;
            }
            endPrMax = 25;
        } else {
            if (isEVS) {
                endThMax = 100;
            } else {
                endThMax = s.hasPr ? 50 : 60;
            }
            endPrMax = 20;
        }

        if (s.isPRJ) {
            endThMax = 100;
        } else if (s.isBRMP) {
            endThMax = 50;
        }

        const endThPercentage = (s.endTh / endThMax) * 100;

        let hasFailedComponent = false;

        // End Sem Theory threshold 40% (except Project and Ethics which are integrated or evaluated differently)
        if (!isEthics && !isEVS && !s.isPRJ && !s.isBRMP && endThPercentage < 40) {
            hasFailedComponent = true;
        }
        
        // Practical threshold 40% (if applicable)
        if (s.hasPr && (s.endPr / endPrMax) * 100 < 40) {
            hasFailedComponent = true;
        }
        
        // Aggregate threshold 40%
        const aggregateMax = (state.syllabusMode === 'cbcs' && (isEthics || s.cr === 1)) ? 25 : 100;
        if ((finalTotal / aggregateMax) * 100 < 40) {
            hasFailedComponent = true;
        }

        let grade = 'F';
        let gp = 0;

        if (!hasFailedComponent) {
            const scalePct = (finalTotal / aggregateMax) * 100;

            if (scalePct >= 90) { grade = 'O'; gp = 10; }
            else if (scalePct >= 80) { grade = 'A+'; gp = 9; }
            else if (scalePct >= 70) { grade = 'A'; gp = 8; }
            else if (scalePct >= 60) { grade = 'B+'; gp = 7; }
            else if (scalePct >= 50) { grade = 'B'; gp = 6; }
            else if (scalePct >= 45) { grade = 'C'; gp = 5; }
            else if (scalePct >= 40) { grade = 'D'; gp = 4; }
        }

        const gradeBadge = document.getElementById(`grade-${index}`);
        gradeBadge.textContent = grade;
        gradeBadge.className = `badge ${grade.toLowerCase().replace('+', 'p')}-grade`;

        document.getElementById(`gp-${index}`).textContent = gp;
        const cp = gp * s.cr;
        document.getElementById(`cp-${index}`).textContent = cp;
    },

    recalculateAll() {
        state.subjects.forEach((_, idx) => this.recalculateRow(idx));
        this.calculateOverall();
    },

    calculateOverall() {
        let totalCR = 0;
        let totalCP = 0;
        let totalSecured = 0;
        let totalMax = 0;
        let hasFails = false;
        const warnings = [];

        state.subjects.forEach((s, idx) => {
            const ms = parseFloat(document.getElementById(`total-${idx}`).textContent) || 0;
            const gp = parseInt(document.getElementById(`gp-${idx}`).textContent) || 0;
            const cp = parseFloat(document.getElementById(`cp-${idx}`).textContent) || 0;

            totalCR += s.cr;
            totalCP += cp;
            totalSecured += ms;
            
            const isEthics = s.name.includes('Ethics') || s.name.includes('AECC-EV') || false;
            const isEVS = s.name.includes('EVS') || false;
            const paperMax = (state.syllabusMode === 'cbcs' && (isEthics || s.cr === 1)) ? 25 : 100;
            totalMax += paperMax;

            if (gp === 0) hasFails = true;

            // pass margins
            let endThPassMin = 0;
            let endPrPassMin = 0;
            let endThMax = 0;
            let endPrMax = 0;

            if (state.syllabusMode === 'cbcs') {
                if (isEthics || s.cr === 1) {
                    endThPassMin = 10;
                    endThMax = 25;
                } else {
                    endThPassMin = s.hasPr ? 24 : 32;
                    endThMax = s.hasPr ? 60 : 80;
                }
                endPrPassMin = 10;
                endPrMax = 25;
            } else {
                if (isEVS) {
                    endThPassMin = 40;
                    endThMax = 100;
                } else {
                    endThPassMin = s.hasPr ? 20 : 24;
                    endThMax = s.hasPr ? 50 : 60;
                }
                endPrPassMin = 8;
                endPrMax = 20;
            }

            if (s.isPRJ) {
                endThPassMin = 40;
                endThMax = 100;
            } else if (s.isBRMP) {
                endThPassMin = 20;
                endThMax = 50;
            }

            if (ms > 0) {
                if (s.endTh < endThPassMin && !isEthics && !isEVS) {
                    warnings.push({
                        type: 'theory',
                        subject: s.name,
                        secured: s.endTh,
                        min: endThPassMin,
                        max: endThMax
                    });
                }

                if (s.hasPr && s.endPr < endPrPassMin) {
                    warnings.push({
                        type: 'practical',
                        subject: s.name,
                        secured: s.endPr,
                        min: endPrPassMin,
                        max: endPrMax
                    });
                }

                if (ms < (paperMax * 0.4) && s.endTh >= endThPassMin && (!s.hasPr || s.endPr >= endPrPassMin)) {
                    warnings.push({
                        type: 'aggregate',
                        subject: s.name,
                        secured: Math.round(ms),
                        min: Math.round(paperMax * 0.4),
                        max: paperMax
                    });
                }
            }
        });

        const sgpa = totalCR > 0 ? (totalCP / totalCR) : 0;
        document.getElementById('sgpa-value').textContent = sgpa.toFixed(2);
        document.getElementById('summary-total-cr').textContent = totalCR;
        document.getElementById('summary-total-cp').textContent = totalCP.toFixed(2);

        const statusBadge = document.getElementById('status-badge');
        const statusText = document.getElementById('status-text');

        if (hasFails || sgpa < 4.0 || state.subjects.length === 0) {
            statusBadge.className = 'status-indicator fail';
            statusText.textContent = 'FAIL';
        } else {
            statusBadge.className = 'status-indicator pass';
            statusText.textContent = 'PASS';
        }

        document.getElementById('total-marks-secured').textContent = `${Math.round(totalSecured)} / ${totalMax}`;
        const percentage = totalMax > 0 ? (totalSecured / totalMax) * 100 : 0;
        document.getElementById('overall-percentage').textContent = `${percentage.toFixed(1)}%`;

        this.renderWarnings(warnings);
    },

    renderWarnings(warnings) {
        const container = document.getElementById('calculator-warnings-container');
        if (!container) return;
        container.innerHTML = '';

        if (warnings.length === 0 || state.subjects.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';

        warnings.forEach(w => {
            const div = document.createElement('div');
            div.className = 'card alert-card';

            let msg = '';
            if (w.type === 'theory') {
                msg = `Theory Exam component failed in <strong>${w.subject}</strong>. Secured only <strong>${w.secured}/${w.max}</strong> (Minimum required is 40%, which is ${w.min} marks).`;
            } else if (w.type === 'practical') {
                msg = `Practical Exam component failed in <strong>${w.subject}</strong>. Secured only <strong>${w.secured}/${w.max}</strong> (Minimum required is 40%, which is ${w.min} marks).`;
            } else if (w.type === 'aggregate') {
                msg = `Aggregate Subject score failed in <strong>${w.subject}</strong>. Total secured is <strong>${w.secured}/${w.max}</strong> (Minimum passing aggregate required is 40%, which is ${w.min} marks).`;
            }

            const shortfall = w.min - w.secured;
            let graceInfo = '';
            if (shortfall > 0 && shortfall <= 5) {
                div.className = 'card alert-card warning';
                graceInfo = `<br><small style="color: #A67C37;"><i class="fa-solid fa-circle-info"></i> Eligible for Hardcase Grace Marks consideration (Shortfall is ${shortfall} marks).</small>`;
            }

            div.innerHTML = `
                <div class="alert-title">
                    <i class="fa-solid fa-triangle-warning" style="color: ${shortfall <= 5 ? '#D97706' : '#EF4444'}"></i> Component Failure Alert
                </div>
                <div class="alert-message">${msg}${graceInfo}</div>
            `;
            container.appendChild(div);
        });
    },

    saveCurrentResult() {
        if (state.subjects.length === 0) return;

        const dept = document.getElementById("dept-select").value;
        const semester = document.getElementById("semester-select").value;
        const totalCR = parseInt(document.getElementById("summary-total-cr").textContent) || 0;
        const totalCP = parseFloat(document.getElementById("summary-total-cp").textContent) || 0;
        const sgpa = parseFloat(document.getElementById("sgpa-value").textContent) || 0;
        const status = document.getElementById("status-text").textContent;
        const percentage = document.getElementById("overall-percentage").textContent;

        const email = (state.user && state.user.email) ? state.user.email : 'guest@fmu.ac.in';
        const historyItem = {
            id: Date.now().toString(),
            userEmail: email,
            stream: state.stream,
            dept,
            semester,
            cr: totalCR,
            cp: totalCP,
            sgpa,
            status,
            percentage,
            date: new Date().toLocaleDateString('en-GB')
        };

        const allHistory = JSON.parse(localStorage.getItem("academicHistory") || "[]");
        allHistory.push(historyItem);
        localStorage.setItem("academicHistory", JSON.stringify(allHistory));

        alert("Result saved successfully to History!");
        this.loadSavedHistory();
    },

    loadSavedHistory() {
        const allHistory = JSON.parse(localStorage.getItem("academicHistory") || "[]");
        
        // Filter history matching current active user & stream
        const email = (state.user && state.user.email) ? state.user.email : 'guest@fmu.ac.in';
        state.history = allHistory.filter(h => h.userEmail === email && h.stream === state.stream);

        const container = document.getElementById("history-table-body");
        if (!container) return;
        container.innerHTML = '';

        let passedSemesters = state.history.filter(h => h.status === 'PASS');
        let totalCR = 0;
        let totalCP = 0;
        let highestSGPA = 0;

        state.history.forEach(h => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left; font-weight: 600;">${h.dept.toUpperCase()}</td>
                <td>Sem ${h.semester}</td>
                <td>${h.cr}</td>
                <td>${h.cp.toFixed(2)}</td>
                <td style="font-weight: 700; color: var(--primary);">${h.sgpa.toFixed(2)}</td>
                <td><span class="badge ${h.status.toLowerCase()}-grade" style="width: auto; padding: 4px 10px; border-radius: 20px;">${h.status}</span></td>
                <td>${h.date}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="CalculatorController.deleteHistoryItem('${h.id}')" style="padding: 4px 8px; border-radius: var(--radius-sm);"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            container.appendChild(tr);

            if (h.sgpa > highestSGPA) highestSGPA = h.sgpa;
        });

        // Compute CGPA
        passedSemesters.forEach(h => {
            totalCR += h.cr;
            totalCP += h.cp;
        });

        const cgpa = totalCR > 0 ? (totalCP / totalCR) : 0;

        const analyticsCgpa = document.getElementById("analytics-cgpa");
        if (analyticsCgpa) analyticsCgpa.textContent = cgpa.toFixed(2);

        const analyticsCr = document.getElementById("analytics-total-cr");
        if (analyticsCr) analyticsCr.textContent = totalCR;

        const analyticsHigh = document.getElementById("analytics-highest-sgpa");
        if (analyticsHigh) analyticsHigh.textContent = highestSGPA.toFixed(2);

        this.renderHistoryChart();
    },

    deleteHistoryItem(id) {
        if (!confirm("Are you sure you want to delete this result from history?")) return;
        const allHistory = JSON.parse(localStorage.getItem("academicHistory") || "[]");
        const filtered = allHistory.filter(h => h.id !== id);
        localStorage.setItem("academicHistory", JSON.stringify(filtered));
        this.loadSavedHistory();
    },

    renderHistoryChart() {
        const container = document.getElementById("chart-container");
        if (!container) return;
        container.innerHTML = '';

        if (state.history.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">No saved calculations found. Save a result to see analysis.</p>';
            return;
        }

        // Group by semester and show performance bar
        state.history.forEach(h => {
            const row = document.createElement("div");
            row.className = "chart-bar-row";

            const percentVal = parseFloat(h.percentage) || 0;
            let fillClass = 'low';
            if (percentVal >= 70) fillClass = 'high';
            else if (percentVal >= 50) fillClass = 'medium';

            row.innerHTML = `
                <div class="chart-label">Sem ${h.semester} (${h.dept.toUpperCase()})</div>
                <div class="chart-bar-wrapper">
                    <div class="chart-bar-fill ${fillClass}" style="width: ${percentVal}%;"></div>
                </div>
                <div class="chart-value-label">${h.sgpa.toFixed(2)}</div>
            `;
            container.appendChild(row);
        });
    },

    printGradeSheet() {
        const printTableBody = document.getElementById('print-table-body');
        if (!printTableBody) return;
        printTableBody.innerHTML = '';

        const semester = document.getElementById("semester-select").value;
        const dept = document.getElementById("dept-select").value;
        
        let semText = "1st Semester";
        if (semester === "2") semText = "2nd Semester";
        else if (semester === "3") semText = "3rd Semester";
        else if (semester === "4") semText = "4th Semester";
        else if (semester === "5") semText = "5th Semester";
        else if (semester === "6") semText = "6th Semester";

        document.getElementById('print-marksheet-sem-title').textContent = `+3 ${semText.toUpperCase()} REGULAR EXAMINATION Tabulation Register - 2026`;
        document.getElementById('print-user-stream').textContent = `${state.stream.toUpperCase()} (${dept.toUpperCase()})`;
        document.getElementById('print-date').textContent = new Date().toLocaleDateString('en-GB');

        let totalCR = 0;
        let totalCP = 0;
        let totalFM = 0;
        let totalMS = 0;
        let hasFails = false;

        state.subjects.forEach((s, idx) => {
            const isEthics = s.name.includes('Ethics') || s.name.includes('AECC-EV') || false;
            const isEVS = s.name.includes('EVS') || false;

            let midTotal = 0;
            let midMax = 40;

            if (state.syllabusMode === 'cbcs') {
                midTotal = s.midTh;
                if (isEthics || s.cr === 1) {
                    midMax = 0;
                } else {
                    midMax = s.hasPr ? 15 : 20;
                }
            } else {
                midTotal = s.midTh + (s.hasPr ? s.midPr : 0) + s.midAtt + s.midSt + (!s.hasPr ? s.midAssign : 0);
                midMax = s.hasPr ? 30 : 40;
            }

            if (s.isPRJ) {
                midTotal = 0;
                midMax = 0;
            } else if (s.isBRMP) {
                midTotal = s.midTh;
                midMax = 50;
            }

            let endThMax = 60;
            let endPrMax = 20;

            if (state.syllabusMode === 'cbcs') {
                if (isEthics || s.cr === 1) {
                    endThMax = 25;
                } else {
                    endThMax = s.hasPr ? 60 : 80;
                }
                endPrMax = 25;
            } else {
                if (isEVS) {
                    endThMax = 100;
                } else {
                    endThMax = s.hasPr ? 50 : 60;
                }
                endPrMax = 20;
            }

            if (s.isPRJ) {
                endThMax = 100;
            } else if (s.isBRMP) {
                endThMax = 50;
            }

            const endThVal = s.endTh;
            const endPrVal = s.hasPr ? s.endPr : '-';

            const ms = parseFloat(document.getElementById(`total-${idx}`).textContent) || 0;
            const gr = document.getElementById(`grade-${idx}`).textContent;
            const gp = document.getElementById(`gp-${idx}`).textContent;
            const cp = parseFloat(document.getElementById(`cp-${idx}`).textContent) || 0;

            totalCR += s.cr;
            totalCP += cp;
            
            const paperMax = (state.syllabusMode === 'cbcs' && (isEthics || s.cr === 1)) ? 25 : 100;
            totalFM += paperMax;
            totalMS += ms;
            if (gr === 'F') hasFails = true;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left; font-weight: 600;">${s.name}</td>
                <td>${midMax === 0 ? '-' : Math.round(midTotal) + ' / ' + midMax}</td>
                <td>${endThVal} / ${endThMax}</td>
                <td>${s.hasPr ? endPrVal + ' / ' + endPrMax : '-'}</td>
                <td>${Math.round(ms)} / ${paperMax}</td>
                <td>${gr}</td>
                <td>${gp}</td>
                <td>${s.cr}</td>
                <td>${cp}</td>
            `;
            printTableBody.appendChild(tr);
        });

        const sgpa = totalCR > 0 ? (totalCP / totalCR) : 0;
        document.getElementById('print-total-marks').textContent = `${Math.round(totalMS)} / ${totalFM}`;
        document.getElementById('print-total-cr').textContent = totalCR;
        document.getElementById('print-total-cp').textContent = totalCP.toFixed(2);
        document.getElementById('print-sgpa').textContent = sgpa.toFixed(2);

        const percentage = totalFM > 0 ? (totalMS / totalFM) * 100 : 0;
        document.getElementById('print-overall-percentage').textContent = `${percentage.toFixed(1)}%`;

        const statusText = document.getElementById('print-result-status');
        const printStatusBox = document.getElementById('print-status-box');
        
        if (hasFails || sgpa < 4.0 || state.subjects.length === 0) {
            printStatusBox.className = 'print-status-box fail';
            statusText.textContent = 'FAIL / PROMOTED';
        } else {
            printStatusBox.className = 'print-status-box pass';
            statusText.textContent = 'PASS';
        }

        window.print();
    }
};

// Global context exposure for delete buttons and onclick listeners
window.CalculatorController = CalculatorController;

window.addEventListener('DOMContentLoaded', () => {
    CalculatorController.init();
});
