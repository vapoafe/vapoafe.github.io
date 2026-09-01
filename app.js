/* -----------------------------------------------
/* CircuitParticles.js Configuration
/* Customized by Vasileios Apostolidis-Afentoulis
/* ----------------------------------------------- */

var circuitInstance = null;

var lightConfig = {
  particles: {
    number: {
      value: 60,
      density: { enable: true, value_area: 900 }
    },
    color: {
      value: ["#012169", "#5a2aad", "#035f42", "#d97706", "#841515"]
    },
    shape: {
      type: ["via", "chip", "circle", "hex", "resistor"],
      stroke: { width: 1.5, color: "#012169" }
    },
    opacity: {
      value: 0.85,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false }
    },
    size: {
      value: 10,
      random: true,
      anim: { enable: true, speed: 1.2, size_min: 2 }
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce"
    }
  },
  traces: {
    enable: true,
    distance: 140,
    color: "#012169",
    opacity: 0.45,
    width: 1.6,
    style: "chamfer45",
    chamferSize: 12,
    maxConnections: 3
  },
  signals: {
    enable: true,
    speed: 0.5,
    frequency: 0.85,
    length: 18,
    size: 2.5,
    color: "#FFC20A",
    tailColor: "#012169",
    glow: 6,
    burstOnClick: true
  },
  glow: {
    enable: true,
    intensity: 8,
    color: "#012169",
    nodeGlow: true,
    traceGlow: false,
    signalGlow: true,
    compositeMode: "source-over"
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "probe" },
      onclick: { enable: true, mode: "pulse-burst" },
      resize: true
    },
    modes: {
      probe: { radius: 150, traceColor: "#FFC20A", maxConnections: 4 },
      voltage_surge: { radius: 160, speedMultiplier: 2.5, sparkCount: 5 },
      breaker: { radius: 180, force: 5 },
      magnet: { radius: 160, speed: 2 },
      pulse_burst: { count: 6, speed: 5 },
      emp_blast: { radius: 220, ringSpeed: 4, disableDuration: 1500 }
    }
  },
  background: {
    color: "#f8fafc",
    grid: { enable: true, type: "dots", size: 30, opacity: 0.18, color: "#012169" },
    pcbMarks: { enable: true, labels: true, opacity: 0.25 }
  },
  retina_detect: true,
  fps_limit: 60
};

var darkConfig = {
  particles: {
    number: {
      value: 60,
      density: { enable: true, value_area: 900 }
    },
    color: {
      value: ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e"]
    },
    shape: {
      type: ["via", "chip", "circle", "hex", "resistor"],
      stroke: { width: 1.5, color: "#38bdf8" }
    },
    opacity: {
      value: 0.85,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false }
    },
    size: {
      value: 10,
      random: true,
      anim: { enable: true, speed: 1.2, size_min: 2 }
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce"
    }
  },
  traces: {
    enable: true,
    distance: 140,
    color: "#38bdf8",
    opacity: 0.35,
    width: 1.5,
    style: "chamfer45",
    chamferSize: 12,
    maxConnections: 3
  },
  signals: {
    enable: true,
    speed: 0.5,
    frequency: 0.85,
    length: 18,
    size: 2.5,
    color: "#fbbf24",
    tailColor: "#38bdf8",
    glow: 6,
    burstOnClick: true
  },
  glow: {
    enable: true,
    intensity: 8,
    color: "#38bdf8",
    nodeGlow: true,
    traceGlow: false,
    signalGlow: true,
    compositeMode: "source-over"
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "probe" },
      onclick: { enable: true, mode: "pulse-burst" },
      resize: true
    },
    modes: {
      probe: { radius: 150, traceColor: "#fbbf24", maxConnections: 4 },
      voltage_surge: { radius: 160, speedMultiplier: 2.5, sparkCount: 5 },
      breaker: { radius: 180, force: 5 },
      magnet: { radius: 160, speed: 2 },
      pulse_burst: { count: 6, speed: 5 },
      emp_blast: { radius: 220, ringSpeed: 4, disableDuration: 1500 }
    }
  },
  background: {
    color: "#080d1a",
    grid: { enable: true, type: "dots", size: 30, opacity: 0.12, color: "#38bdf8" },
    pcbMarks: { enable: true, labels: true, opacity: 0.2 }
  },
  retina_detect: true,
  fps_limit: 60
};

function initCircuit(theme) {
  var particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer) return;

  if (circuitInstance) {
    circuitInstance.destroy();
    circuitInstance = null;
  }

  var config = (theme === "dark") ? darkConfig : lightConfig;
  circuitInstance = circuitParticlesJS("particles-js", config);
}

function updateThemeUI(theme) {
  var toggleBtn = document.getElementById("theme-toggle");
  var themeText = document.getElementById("theme-text");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Switch to light mode");
    if (themeText) {
      themeText.textContent = "Light";
    }
  } else {
    document.body.classList.remove("dark-mode");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Switch to dark mode");
    if (themeText) {
      themeText.textContent = "Dark";
    }
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

document.addEventListener("DOMContentLoaded", function () {
  // Light mode is default unless explicitly saved as 'dark'
  var savedTheme = localStorage.getItem("theme") || "light";
  
  updateThemeUI(savedTheme);
  initCircuit(savedTheme);

  var toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }
});