
// localStorage fonts caching by https://github.com/hdragomir

(function () {
  "use strict";
  var css_href = './cdn/font.css';
  // a simple event handler wrapper
  function on(el, ev, callback) {
    if (el.addEventListener) {
      el.addEventListener(ev, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent("on" + ev, callback);
    }
  }
 
  // quick way to determine whether a css file has been cached locally
  function fileIsCached(href) {
    return window.localStorage && localStorage.font_css_cache && (localStorage.font_css_cache_file === href);
  }

  // time to get the actual css file
  function injectFontsStylesheet() {
   // if this is an older browser
    if (!window.localStorage || !window.XMLHttpRequest) {
      var stylesheet = document.createElement('link');
      
      stylesheet.href = css_href;
      //We'll use the CDN file for the non-cached
      
      //stylesheet.href = '//cdn.jaicab.com/font.css';
      
      stylesheet.rel = 'stylesheet';
      stylesheet.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(stylesheet);
      // just use the native browser cache
      // this requires a good expires header on the server
      document.cookie = "font_css_cache";
    
    // if this isn't an old browser
    } else {
       // use the cached version if we already have it
      if (fileIsCached(css_href)) {
        injectRawStyle(localStorage.font_css_cache);
      // otherwise, load it with ajax
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", css_href, true);
        on(xhr, 'load', function () {
          if (xhr.readyState === 4) {
            // once we have the content, quickly inject the css rules
            injectRawStyle(xhr.responseText);
            // and cache the text content for further use
            localStorage.font_css_cache = xhr.responseText;
            localStorage.font_css_cache_file = css_href;
          }
        });
        xhr.send();
      }
    }
  }

  // this is the simple utitily that injects the cached or loaded css text
  function injectRawStyle(text) {
    var style = document.createElement('style');
    style.innerHTML = text;
    document.getElementsByTagName('head')[0].appendChild(style);
  }


  // if we have the fonts in localStorage or if we've cached them using the native browser cache
  if ((window.localStorage && localStorage.font_css_cache) || document.cookie.indexOf('font_css_cache') > -1){
    // just use the cached version
    injectFontsStylesheet();
  } else {
   // otherwise, don't block the loading of the page; wait until it's done.
    on(window, "load", injectFontsStylesheet);
  }
  

}());