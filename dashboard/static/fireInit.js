var fireInit = function() {
  console.log('FireInit')
  const started = Date.now()
  const body = document.getElementsByTagName('body')[0];

  function loadScriptAsync(s) {
    return new Promise(function(resolve) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = function() {
        console.log(`%c Loaded ${s.name}`, 'background: #CDDC39; color: #000000');
        resolve();
      }
      script.onreadystatechange = function () {
        if (this.readyState == 'complete') script.onload();
      }
      script.src = s.src;
      console.log(`%c Loading ${s.name}`, 'background: #FFEB3B; color: #000000');
      body.appendChild(script);
    })
  }

  console.log(`%c Loading Firebase`, 'background: #ffcb2c; color: #f5820b');

  loadScriptAsync({
    rel: 'javascript',
    name: 'firebase-app.js',
    src: 'https://www.gstatic.com/firebasejs/6.6.1/firebase.js'
  }).then(function () {
    return loadScriptAsync({
      rel: 'javascript',
      name: 'firebaseui.js',
      src: 'https://cdn.firebase.com/libs/firebaseui/4.2.0/firebaseui.js'
    })
  }).then(function () {
    console.log(`%c Firebase loaded in ${Date.now() - started}ms`, 'background: #ffcb2c; color: #f5820b');
    window.dispatchEvent(new Event('firebase-loaded'));
  })
}

console.log(document.readyState)
if (document.readyState === "complete" || document.readyState === "interactive") {
  fireInit()
} else {
  try {
    window.addEventListener("load", fireInit, false);
  } catch(e) {
    window.onload = fireInit;
  }
}