// ==UserScript==
// @name         Arrow Keys: Next/Prev Chapter
// @namespace    https://github.com/Astropilot
// @version      0.2.0
// @description  Arrow Key Keyboard shortcuts for multiple manga reader websites (next/prev chapter)
// @author       Astropilot
// @license      MIT
// @homepage     https://github.com/Astropilot/webtoon_userscripts
// @homepageURL  https://github.com/Astropilot/webtoon_userscripts
// @supportURL   https://github.com/Astropilot/webtoon_userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/Astropilot/webtoon_userscripts/main/src/arrow_keys.user.js
// @run-at       document-end
// @grant        none
// @noframes
// @match        *://*.asurascans.com/*-chapter-*
// @match        *://*.asura.gg/*-chapter-*
// @match        *://*.asuracomics.com/*-chapter-*
// @match        *://*.manga-scans.com/chapter/*
// @match        *://*.reaperscans.com/comics/*/chapters/*
// @match        *://*.webtoons.com/*/viewer*episode_no=*
// @match        *://*.xcalibrscans.com/*-chapter-*
// @match        *://*.mangakakalot.com/chapter/*
// @match        *://*.chapmanganato.com/manga-*/chapter-*
// @match        *://*.scyllascans.org/read/*
// @require      https://cdn.jsdelivr.net/npm/psl@1.9.0/dist/psl.min.js#sha256-pGXYc481WIYNZUsKubKxCxQUydhNrlM5S8g5eMU8fdw=
// ==/UserScript==

(function () {
  "use strict";

  // Selectors should point to link (<a href/>) or <button> that redirect to prev/next chapter.
  const navigationSelectorsPerDomains = [
    {
      hosts: ["asurascans.com", "asura.gg", "asuracomics.com", "xcalibrscans.com"],
      selectors: {
        prev: "a.ch-prev-btn",
        next: "a.ch-next-btn"
      }
    },
    {
      hosts: ["manga-scans.com"],
      selectors: {
        prev: "div.prev-post > a",
        next: "div.next-post > a"
      }
    },
    {
      hosts: ["reaperscans.com"],
      selectors: {
        prev: "main nav:nth-of-type(1) div.flex:nth-of-type(1) > a",
        next: "main nav:nth-of-type(1) div.flex:nth-of-type(3) > a:nth-of-type(2)"
      },
    },
    {
      hosts: ["webtoons.com"],
      selectors: {
        prev: "a._prevEpisode",
        next: "a._nextEpisode"
      }
    },
    {
      hosts: ["mangakakalot.com"],
      selectors: {
        prev: ".btn-navigation-chap > a.next", // Not an error, next/back classes are really reversed...
        next: ".btn-navigation-chap > a.back"
      }
    },
    {
      hosts: ["chapmanganato.com"],
      selectors: {
        prev: ".navi-change-chapter-btn > a.navi-change-chapter-btn-prev",
        next: ".navi-change-chapter-btn > a.navi-change-chapter-btn-next"
      }
    },
    {
      hosts: ["scyllascans.org"],
      selectors: {
        prev: "div[class*='BottomActionsWrapper'] > button:nth-of-type(1)",
        next: "div[class*='BottomActionsWrapper'] > button:nth-of-type(2)"
      }
    }
  ];

  // We extract top domain from hostname without subdomains
  const currentDomain = psl.get(window.location.hostname);

  if (currentDomain === null || currentDomain.length === 0) {
    console.warn("[Arrow Keys UserScript] Failed to parse current domain!");
    return;
  }

  let rule = null;
  for (const domainsRule of navigationSelectorsPerDomains) {
    if (domainsRule.hosts.includes(currentDomain)) {
      rule = domainsRule;
      break;
    }
  }

  if (rule === null) {
    console.warn("[Arrow Keys UserScript] Failed to find selectors rule!");
    return;
  }

  document.addEventListener("keyup", (event) => {
    if (event.target && (event.target.matches("input") || event.target.matches("textarea") || event.target.isContentEditable)) {
      // Do nothing when inside a text/editable field.
      return;
    }
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
      // Do nothing when modifiers are held
      return;
    }

    if (event.code === "ArrowLeft") {
      document.querySelector(rule.selectors.prev)?.click();
    } else if (event.code === "ArrowRight") {
      document.querySelector(rule.selectors.next)?.click();
    }
  });
})();
