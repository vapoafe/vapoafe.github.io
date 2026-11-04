/* -------------------------------------------------------------
 * Study Subpage Logic & Dynamic PDF Rendering
 * Pure HTML, CSS, and JavaScript
 * Customized by Vasileios Apostolidis-Afentoulis
 * ------------------------------------------------------------- */

// Course categories (4 official courses + All)
var COURSE_CATEGORIES = {
  "all": {
    id: "all",
    el: "Όλα",
    en: "All"
  },
  "arch-ilektro": {
    id: "arch-ilektro",
    el: "Αρχές Ηλεκτρολογίας και Ηλεκτρονικής",
    en: "Principles of Electrical & Electronic Engineering"
  },
  "ilektrotechnia": {
    id: "ilektrotechnia",
    el: "Ηλεκτροτεχνία (Κυκλώματα Συνεχούς και Εναλλασσόμενου Ρεύματος)",
    en: "Electrical Engineering (DC & AC Circuits)"
  },
  "anlog-psif": {
    id: "anlog-psif",
    el: "Αναλογικά και Ψηφιακά Ηλεκτρονικά",
    en: "Analog and Digital Electronics"
  },
  "diktya-ypologistes": {
    id: "diktya-ypologistes",
    el: "Εγκατάσταση και Διαχείριση Δικτύων – Συντήρηση Υπολογιστικών Συστημάτων",
    en: "Network Installation & Management – Computer Systems Maintenance"
  }
};

// Default list of PDF files located in files/ folder
var DEFAULT_PDF_FILES = [
  {
    fileName: "Circuit_Analysis_Ch03_Ohm_Kirchhoff_Thevenin.pdf",
    category: "ilektrotechnia"
  },
  {
    fileName: "Electronics_I_Ch01_Semiconductors_Diodes.pdf",
    category: "anlog-psif"
  },
  {
    fileName: "Digital_Systems_Ch02_Logic_Gates_Boolean_Algebra.pdf",
    category: "anlog-psif"
  },
  {
    fileName: "Microcontrollers_Lab01_Arduino_ESP32_GPIO.pdf",
    category: "anlog-psif"
  },
  {
    fileName: "Computer_Networks_Ch01_OSI_TCP_IP_Architecture.pdf",
    category: "diktya-ypologistes"
  },
  {
    fileName: "Telecommunications_Ch01_Modulation_AM_FM_Digital.pdf",
    category: "diktya-ypologistes"
  },
  {
    fileName: "Sensors_IoT_Lab02_ADC_Transducers_Interfacing.pdf",
    category: "arch-ilektro"
  },
  {
    fileName: "EPAL_Electronics_Curriculum_Syllabus_2026.pdf",
    category: "arch-ilektro"
  }
];

// Active materials array
var studyMaterialsList = DEFAULT_PDF_FILES.slice();
var activeCategory = "all";
var currentLang = "el"; // Default to Greek as requested

// Helper: infer course category automatically from filename if not specified
function inferCategoryFromFilename(fileName) {
  var lower = fileName.toLowerCase();
  if (lower.indexOf("circuit") !== -1 || lower.indexOf("ohm") !== -1 || lower.indexOf("kirchhoff") !== -1 || lower.indexOf("thevenin") !== -1 || lower.indexOf("kyklwm") !== -1 || lower.indexOf("κυκλωμ") !== -1 || lower.indexOf("ηλεκτροτεχν") !== -1) {
    return "ilektrotechnia";
  }
  if (lower.indexOf("network") !== -1 || lower.indexOf("osi") !== -1 || lower.indexOf("tcp") !== -1 || lower.indexOf("ip") !== -1 || lower.indexOf("telecom") !== -1 || lower.indexOf("δικτυ") !== -1 || lower.indexOf("συντηρησ") !== -1) {
    return "diktya-ypologistes";
  }
  if (lower.indexOf("electronic") !== -1 || lower.indexOf("digital") !== -1 || lower.indexOf("gate") !== -1 || lower.indexOf("microcontroller") !== -1 || lower.indexOf("arduino") !== -1 || lower.indexOf("esp32") !== -1 || lower.indexOf("gpio") !== -1 || lower.indexOf("ψηφιακ") !== -1 || lower.indexOf("ηλεκτρονικ") !== -1) {
    return "anlog-psif";
  }
  if (lower.indexOf("sensor") !== -1 || lower.indexOf("iot") !== -1 || lower.indexOf("transducer") !== -1 || lower.indexOf("curriculum") !== -1 || lower.indexOf("syllabus") !== -1 || lower.indexOf("αρχες") !== -1 || lower.indexOf("αισθητηρ") !== -1) {
    return "arch-ilektro";
  }
  return "arch-ilektro";
}

// Helper: generate clean readable title from filename
function getTitleFromFilename(fileName) {
  if (!fileName) return "";
  return fileName
    .replace(/\.[^/.]+$/, "") // strip .pdf extension
    .replace(/[_-]+/g, " ")   // replace underscores/hyphens with spaces
    .replace(/\s+/g, " ")
    .trim();
}

// Determine relative files directory path depending on location
function getFilesBasePath() {
  return "files/";
}

// Render all PDF cards automatically into #pdf-container
function renderStudyCards() {
  var container = document.getElementById("pdf-container");
  if (!container) return;

  var searchInput = document.getElementById("study-search");
  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  var basePath = getFilesBasePath();
  var lang = localStorage.getItem("lang") || currentLang;
  var downloadLabel = lang === "el" ? "Λήψη PDF" : "Download PDF";

  container.innerHTML = "";
  var visibleCount = 0;

  studyMaterialsList.forEach(function (item) {
    var categoryId = item.category || inferCategoryFromFilename(item.fileName);
    var matchesCat = (activeCategory === "all" || categoryId === activeCategory);

    var title = getTitleFromFilename(item.fileName);
    var catInfo = COURSE_CATEGORIES[categoryId] || COURSE_CATEGORIES["arch-ilektro"];
    var catLabel = lang === "el" ? catInfo.el : catInfo.en;

    var searchableText = (title + " " + item.fileName + " " + catLabel).toLowerCase();
    var matchesSearch = (query === "" || searchableText.indexOf(query) !== -1);

    if (matchesCat && matchesSearch) {
      visibleCount++;

      var card = document.createElement("article");
      card.className = "pdf-card";
      card.setAttribute("data-cat", categoryId);

      card.innerHTML = 
        '<div class="pdf-card-left">' +
          '<div class="pdf-icon-badge">' +
            '<span>PDF</span>' +
          '</div>' +
          '<div class="pdf-card-info">' +
            '<span class="pdf-course-tag">' + catLabel + '</span>' +
            '<h3 class="pdf-card-title">' + title + '</h3>' +
          '</div>' +
        '</div>' +
        '<a href="' + basePath + item.fileName + '" download="' + item.fileName + '" class="pdf-download-btn" aria-label="' + downloadLabel + ' ' + title + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
            '<polyline points="7 10 12 15 17 10"/>' +
            '<line x1="12" y1="15" x2="12" y2="3"/>' +
          '</svg>' +
          '<span>' + downloadLabel + '</span>' +
        '</a>';

      container.appendChild(card);
    }
  });

  var noResultsMsg = document.getElementById("no-results-msg");
  if (noResultsMsg) {
    noResultsMsg.style.display = (visibleCount === 0) ? "block" : "none";
  }
}

// Translations dictionary
var studyTranslations = {
  en: {
    pageTitle: "Study & Course Materials - Vasileios Apostolidis-Afentoulis",
    pageDesc: "Download class PDF files by Vasileios Apostolidis-Afentoulis.",
    backToCv: "← Back to CV",
    studyHeaderTitle: "Study & Class Materials",
    studyHeaderBio: "1st Vocational High School of Kalamaria · Electronics Engineering",
    studyHeaderDesc: "Select a course tag or click the download button for any PDF file.",
    searchPlaceholder: "Search file or course...",
    catAll: "All",
    catArchIlektro: "Principles of Electrical & Electronic Engineering",
    catIlektrotechnia: "Electrical Engineering (DC & AC Circuits)",
    catAnlogPsif: "Analog and Digital Electronics",
    catDiktyaYpologistes: "Network Installation & Management – Computer Systems Maintenance",
    downloadPdf: "Download PDF",
    footerText: 'Created by: <a href="https://github.com/ritaly" target="_blank" rel="noopener noreferrer">@ritaly</a> / Customized by: <a href="https://github.com/vapoafe" target="_blank" rel="noopener noreferrer">@vapoafe</a> / 2018 - Present',
    btnLabel: "ΕΛ",
    btnFlagSrc: "./img/gr.svg",
    btnFlagAlt: "Greek Flag",
    btnAria: "Μετάβαση στα Ελληνικά",
    btnTitle: "Switch language to Greek / Μετάβαση στα Ελληνικά",
    noResults: "No files found matching your search."
  },
  el: {
    pageTitle: "Εκπαιδευτικό Υλικό & Σημειώσεις - Βασίλειος Αποστολίδης-Αφεντούλης",
    pageDesc: "Λήψη αρχείων PDF μαθημάτων από τον Βασίλειο Αποστολίδη-Αφεντούλη.",
    backToCv: "← Επιστροφή στο Βιογραφικό",
    studyHeaderTitle: "Εκπαιδευτικό Υλικό & Σημειώσεις Μαθημάτων",
    studyHeaderBio: "1ο Επαγγελματικό Λύκειο Καλαμαριάς · Τομέας Ηλεκτρολογίας & Ηλεκτρονικής",
    studyHeaderDesc: "Επιλέξτε ετικέτα μαθήματος ή πατήστε απευθείας στο κουμπί λήψης για αποθήκευση οποιουδήποτε αρχείου PDF.",
    searchPlaceholder: "Αναζήτηση αρχείου ή μαθήματος...",
    catAll: "Όλα",
    catArchIlektro: "Αρχές Ηλεκτρολογίας και Ηλεκτρονικής",
    catIlektrotechnia: "Ηλεκτροτεχνία (Κυκλώματα Συνεχούς και Εναλλασσόμενου Ρεύματος)",
    catAnlogPsif: "Αναλογικά και Ψηφιακά Ηλεκτρονικά",
    catDiktyaYpologistes: "Εγκατάσταση και Διαχείριση Δικτύων – Συντήρηση Υπολογιστικών Συστημάτων",
    downloadPdf: "Λήψη PDF",
    footerText: 'Δημιουργήθηκε από: <a href="https://github.com/ritaly" target="_blank" rel="noopener noreferrer">@ritaly</a> / Διαμορφώθηκε από: <a href="https://github.com/vapoafe" target="_blank" rel="noopener noreferrer">@vapoafe</a> / 2018 - Σήμερα',
    btnLabel: "EN",
    btnFlagSrc: "./img/uk.svg",
    btnFlagAlt: "United Kingdom Flag",
    btnAria: "Switch language to English",
    btnTitle: "Switch language to English / Αλλαγή σε Αγγλικά",
    noResults: "Δεν βρέθηκε αρχείο που να ταιριάζει στην αναζήτησή σας."
  }
};

function updateStudyLanguageUI(lang) {
  currentLang = lang;
  var t = studyTranslations[lang] || studyTranslations.el;
  document.documentElement.lang = lang;
  document.title = t.pageTitle;

  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t.pageDesc);

  var langBtn = document.getElementById("lang-toggle");
  var langText = document.getElementById("lang-text");
  var langFlag = document.getElementById("lang-flag-img");
  if (langBtn) {
    langBtn.setAttribute("aria-label", t.btnAria);
    langBtn.setAttribute("title", t.btnTitle);
  }
  if (langText) langText.textContent = t.btnLabel;
  if (langFlag) {
    var prefix = (window.location.pathname.indexOf("/study/") !== -1) ? "../" : "";
    langFlag.src = prefix + t.btnFlagSrc;
    langFlag.alt = t.btnFlagAlt;
  }

  var searchInput = document.getElementById("study-search");
  if (searchInput) {
    searchInput.placeholder = t.searchPlaceholder;
  }

  var i18nElements = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < i18nElements.length; i++) {
    var el = i18nElements[i];
    var key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      if (el.getAttribute("data-i18n-html") === "true") {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  }

  renderStudyCards();
}

function setStudyLanguage(lang) {
  localStorage.setItem("lang", lang);
  updateStudyLanguageUI(lang);
}

function toggleStudyLanguage() {
  var saved = localStorage.getItem("lang") || "el";
  var nextLang = (saved === "el") ? "en" : "el";
  setStudyLanguage(nextLang);
}

// Background circuit particle animation
var circuitInstance = null;

var lightConfig = {
  particles: {
    number: { value: 10, density: { enable: true, value_area: 900 } },
    color: { value: ["#012169", "#5a2aad", "#035f42", "#d97706", "#841515"] },
    shape: { type: ["via", "chip", "circle", "hex", "resistor"], stroke: { width: 1.5, color: "#012169" } },
    opacity: { value: 0.85, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false } },
    size: { value: 10, random: true, anim: { enable: true, speed: 1.2, size_min: 2 } },
    move: { enable: true, speed: 0.2, direction: "none", random: true, straight: false, out_mode: "bounce" }
  },
  traces: { enable: true, distance: 140, color: "#012169", opacity: 0.45, width: 1.6, style: "chamfer45", chamferSize: 12, maxConnections: 3 },
  signals: { enable: true, speed: 0.5, frequency: 0.85, length: 18, size: 2.5, color: "#FFC20A", tailColor: "#012169", glow: 6, burstOnClick: true },
  glow: { enable: true, intensity: 8, color: "#012169", nodeGlow: true, traceGlow: false, signalGlow: true, compositeMode: "source-over" },
  interactivity: {
    detect_on: "window",
    events: { onhover: { enable: true, mode: "breaker" }, onclick: { enable: true, mode: "pulse_burst" }, resize: true },
    modes: { breaker: { radius: 180, force: 5 }, pulse_burst: { count: 6, speed: 5 } }
  },
  background: { color: "#f8fafc", grid: { enable: true, type: "dots", size: 30, opacity: 0.3, color: "#012169" } },
  retina_detect: true,
  fps_limit: 60
};

var darkConfig = {
  particles: {
    number: { value: 10, density: { enable: true, value_area: 900 } },
    color: { value: ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e"] },
    shape: { type: ["via", "chip", "circle", "hex", "resistor"], stroke: { width: 1.5, color: "#38bdf8" } },
    opacity: { value: 0.85, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false } },
    size: { value: 10, random: true, anim: { enable: true, speed: 1.2, size_min: 2 } },
    move: { enable: true, speed: 0.2, direction: "none", random: true, straight: false, out_mode: "bounce" }
  },
  traces: { enable: true, distance: 140, color: "#38bdf8", opacity: 0.45, width: 1.6, style: "chamfer45", chamferSize: 12, maxConnections: 3 },
  signals: { enable: true, speed: 0.5, frequency: 0.85, length: 18, size: 2.5, color: "#fbbf24", tailColor: "#38bdf8", glow: 6, burstOnClick: true },
  glow: { enable: true, intensity: 8, color: "#38bdf8", nodeGlow: true, traceGlow: false, signalGlow: true, compositeMode: "source-over" },
  interactivity: {
    detect_on: "window",
    events: { onhover: { enable: true, mode: "magnet" }, onclick: { enable: true, mode: "pulse_burst" }, resize: true },
    modes: { magnet: { radius: 160, speed: 2 }, pulse_burst: { count: 6, speed: 5 } }
  },
  background: { color: "#080d1a", grid: { enable: true, type: "dots", size: 30, opacity: 0.3, color: "#38bdf8" } },
  retina_detect: true,
  fps_limit: 60
};

function initCircuit(theme) {
  var particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer || typeof circuitParticlesJS !== "function") return;
  if (circuitInstance) {
    circuitInstance.destroy();
    circuitInstance = null;
  }
  var config = (theme === "dark") ? darkConfig : lightConfig;
  circuitInstance = circuitParticlesJS("particles-js", config);
}

function updateThemeUI(theme) {
  var toggleBtn = document.getElementById("theme-toggle");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Switch to light mode");
  } else {
    document.body.classList.remove("dark-mode");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Switch to dark mode");
  }
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
  updateThemeUI(theme);
  initCircuit(theme);
}

function toggleTheme() {
  var isDark = document.body.classList.contains("dark-mode");
  setTheme(isDark ? "light" : "dark");
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  // Theme init
  var savedTheme = localStorage.getItem("theme") || "light";
  updateThemeUI(savedTheme);
  initCircuit(savedTheme);

  var themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Language init (default to Greek)
  var savedLang = localStorage.getItem("lang") || "el";
  updateStudyLanguageUI(savedLang);

  var langToggleBtn = document.getElementById("lang-toggle");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", toggleStudyLanguage);
  }

  // Search input handler
  var searchInput = document.getElementById("study-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderStudyCards();
    });
  }

  // Category filter buttons
  var categoryBtns = document.querySelectorAll(".study-category-btn");
  for (var i = 0; i < categoryBtns.length; i++) {
    categoryBtns[i].addEventListener("click", function () {
      for (var j = 0; j < categoryBtns.length; j++) {
        categoryBtns[j].classList.remove("active");
      }
      this.classList.add("active");
      activeCategory = this.getAttribute("data-cat") || "all";
      renderStudyCards();
    });
  }

  // Try to load dynamic manifest if available in files/materials.json
  var basePath = getFilesBasePath();
  fetch(basePath + "materials.json")
    .then(function (res) {
      if (res.ok) return res.json();
      throw new Error("No materials.json");
    })
    .then(function (data) {
      if (Array.isArray(data) && data.length > 0) {
        studyMaterialsList = data;
        renderStudyCards();
      }
    })
    .catch(function () {
      // Keep default materials list
      renderStudyCards();
    });
});
