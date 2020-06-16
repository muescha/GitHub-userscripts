// ==UserScript==
// @name         GitHub: add me Author
// @version      0.1.2
// @description  Add me near to the Author drop down
// @author       Muescha
// @namespace    https://github.com/muescha
// @match        https://github.com/*/*/issues
// @match        https://github.com/*/*/issues?*
// @match        https://github.com/*/*/pulls
// @match        https://github.com/*/*/pulls?*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/muescha/GitHub-userscripts/master/github-author-me.user.js
// @downloadURL  https://raw.githubusercontent.com/muescha/GitHub-userscripts/master/github-author-me.user.js
// ==/UserScript==

(function () {
  'use strict';

  function getQueryParts(search) {
    return search.split(/\s+/);
  }

  function includes(search, ...searchStrings) {
    return getQueryParts(search).some(queryPart => searchStrings.includes(queryPart));
  }

  function removeFilter(search, filter) {
    return getQueryParts(search).filter(s => s !== filter).join(' ')
  }

  function addFilter(search, filter) {
    let parts = getQueryParts(search)
    parts.push(filter)
    return parts.join(' ')
  }


  function init() {

    let user_login = document.querySelector('meta[name="user-login"]').content
    let author_filter = "author:" + user_login

    let q = document.querySelector("#js-issues-search").value.trim();

    let isAuthorFilterActive = includes(q, author_filter);

    let newSearch = isAuthorFilterActive ? removeFilter(q, author_filter) : addFilter(q, author_filter)

    let searchParams = new URLSearchParams(document.location.search);
    searchParams.set("q", newSearch)

    let cleanPathName = '/' + location.pathname.split('/').slice(1, 4).join('/')

    let newLink = `${cleanPathName}?${searchParams}`

    let authorDropDownCaret = document.querySelector('#author-select-menu span.dropdown-caret')

    let newItem = document.createElement("SUP")

    let a = document.createElement('a')
    a.href = newLink
    a.innerHTML = "me "

    if (isAuthorFilterActive) {
      newItem.setAttribute('style', 'text-decoration: line-through !important;')
    }
    newItem.appendChild(a)

    authorDropDownCaret.parentNode.insertBefore(newItem, authorDropDownCaret);

  }

  document.addEventListener("pjax:end", init);
  init();

})();
