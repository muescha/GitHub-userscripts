// ==UserScript==
// @name         GitHub: hide unread
// @version      0.1.4
// @description  Hide unread issues and unread pull requests
// @author       Muescha
// @namespace    https://github.com/muescha
// @match        https://github.com/*/*/issues
// @match        https://github.com/*/*/issues?*
// @match        https://github.com/*/*/pulls
// @match        https://github.com/*/*/pulls?*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/muescha/GitHub-userscripts/master/github-unread.user.js
// @downloadURL  https://raw.githubusercontent.com/muescha/GitHub-userscripts/master/github-unread.user.js
// ==/UserScript==

(function () {
  'use strict';

  function getQueryParts(search) {
    return search.split(/\s+/);
  }

  function includes(search, ...searchStrings) {
    return getQueryParts(search).some(queryPart => searchStrings.includes(queryPart));
  }

  function init() {

    let q = document.querySelector("#js-issues-search").value;

    const isHideUnread = includes(q, "is:unread");
    const isGreyUnread = includes(q, "is:unread-grey", "is:unread-debug", "is:unreadr");


    if (isGreyUnread || isHideUnread) {

      document.querySelectorAll(".js-navigation-container:first-child div.Box-row:not(.Box-row--unread)").forEach(el => {

        if (isHideUnread) {
          el.remove();
        } else {
          let title = el.querySelector("a").innerText
          el.classList.add("Box--condensed");
          el.querySelector("input").outerHTML = `<div style="width:12px;"></div>`;

          let linkEl = el.querySelectorAll("div")[3];
          linkEl.innerHTML = title;
          linkEl.setAttribute("style", "font-weight: 600!important;color:grey")
        }
      });
    }
  }

  document.addEventListener("pjax:end", init);
  init();

})();
