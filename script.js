
// SMART PARK — Milestone 01 interactions

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// 1. Mobile navigation menu
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

// 2. Close mobile menu after clicking a navigation link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// 3. Demo parking search
const parkingSearch = document.getElementById("parkingSearch");
const searchFeedback = document.getElementById("searchFeedback");

parkingSearch.addEventListener("submit", (event) => {
  event.preventDefault();

  const location = document
    .getElementById("locationInput")
    .value.trim();

  const vehicle = document.getElementById("vehicleType").value;

  const preference = document.getElementById("preference").value;

  if (!location) {
    searchFeedback.textContent =
      "Please enter a parking location to continue.";

    return;
  }

  searchFeedback.textContent =
    `Demo search ready: ${vehicle} parking near "${location}" · Preference: ${preference}. Parking results will be connected in Milestone 2.`;
});

// 4. EV section interaction
document.getElementById("evExplore").addEventListener("click", () => {
  document.getElementById("vehicleType").value = "EV";

  document.getElementById("preference").value = "EV charging";
});

// 5. Automatically display current year
document.getElementById("year").textContent =
  new Date().getFullYear();

// 6. Highlight navigation item based on visible section
const sections = document.querySelectorAll("main section[id]");

const navItems = document.querySelectorAll(
  ".nav-links .nav-link"
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navItems.forEach((item) => {
        item.classList.toggle(
          "active",
          item.getAttribute("href") === `#${entry.target.id}`
        );
      });
    }
  });
}, {
  rootMargin: "-35% 0px -55% 0px"
});

sections.forEach((section) => observer.observe(section));
