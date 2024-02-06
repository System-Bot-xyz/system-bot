// Elemente auswählen
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
const searchIcon = document.querySelector(".search-icon");
const search = document.querySelector(".search");

// Menü-Button klicken
menuBtn.addEventListener("click", () => {
  // Menü-Button umschalten
  menuBtn.classList.toggle("open");
  // Navigationsbereich umschalten
  if (menuBtn.classList.contains("open")) {
    // Navigationsbereich öffnen
    nav.style.height = "300px";
  } else {
    // Navigationsbereich schließen
    nav.style.height = "0";
  }
});

// Suchsymbol klicken
searchIcon.addEventListener("click", () => {
  // Suchsymbol umschalten
  searchIcon.classList.toggle("active");
  // Suchleiste umschalten
  if (searchIcon.classList.contains("active")) {
    // Suchleiste anzeigen
    search.style.display = "block";
  } else {
    // Suchleiste verstecken
    search.style.display = "none";
  }
});