/* Casa Somba — script.js (plan Lot 009 §E). Trois conforts, jamais des conditions :
   1) repli du menu téléphone sous le seuil unique (1030px)
   2) en-tête compacte au défilement (hystérésis 70/160 px)
   3) messages du formulaire affichés à côté des champs (posé au Lot 009 §F,
      branché quand le formulaire complet existe)
   Rien ici n'est requis pour utiliser le site : chaque comportement a un repli
   correct sans JavaScript (voir styles.css). */
(function () {
  "use strict";

  var SEUIL_REPLI = 1030;

  function initEnTete() {
    var enTete = document.querySelector("[data-en-tete]");
    var bouton = document.querySelector("[data-bouton-menu]");
    var libelleSpan = document.querySelector("[data-bouton-menu-libelle]");
    var nav = document.getElementById("navigation-principale");
    if (!enTete || !bouton || !nav || !libelleSpan) return;

    var libelleOuvrir = libelleSpan.textContent;
    var libelleFermer = bouton.getAttribute("data-libelle-fermer") || libelleOuvrir;

    var etroit = false;
    var ouvert = false;

    function fermerMenu() {
      ouvert = false;
      nav.dataset.ouvert = "false";
      bouton.setAttribute("aria-expanded", "false");
      libelleSpan.textContent = libelleOuvrir;
    }

    // Le repli du menu est en CSS pur depuis le 2026-08-11 : plus de classe à poser
    // ici. On ne garde que la fermeture du menu quand on change de largeur (sinon un
    // menu resté ouvert traverse le passage au format ordinateur), et le suivi de
    // `etroit`, que l'en-tête compacte au défilement utilise plus bas.
    function appliquerLargeur() {
      var estEtroit = window.innerWidth <= SEUIL_REPLI;
      if (estEtroit === etroit) return;
      etroit = estEtroit;
      fermerMenu();
    }

    bouton.addEventListener("click", function () {
      ouvert = !ouvert;
      nav.dataset.ouvert = String(ouvert);
      bouton.setAttribute("aria-expanded", String(ouvert));
      libelleSpan.textContent = ouvert ? libelleFermer : libelleOuvrir;
    });

    window.addEventListener("resize", appliquerLargeur);
    appliquerLargeur();

    var compacte = false;
    function appliquerDefilement() {
      if (etroit) return;
      var y = window.scrollY;
      if (!compacte && y > 160) {
        compacte = true;
        enTete.classList.add("en-tete--compacte");
      } else if (compacte && y < 70) {
        compacte = false;
        enTete.classList.remove("en-tete--compacte");
      }
    }
    window.addEventListener("scroll", appliquerDefilement, { passive: true });
    appliquerDefilement();
  }

  initEnTete();
})();

// Pré-remplissage du logement (ch.7) : les fiches envoient vers /fr/demande/?logement=…
// Confort seulement — sans script, le visiteur coche lui-même.
(function () {
  var valeur = new URLSearchParams(window.location.search).get("logement");
  if (!valeur) return;
  var champ = document.querySelector('input[name="logement"][value="' + valeur + '"]');
  if (champ) champ.checked = true;
})();
