document.getElementById( 'nav' ).innerHTML = `
<link rel="stylesheet" href="./css/nav.css">
<input type="checkbox" id="nav-check">
<div class="nav-header">
      <a href="./index.html" class="nav-title" style="top: -1.25em;"><img src="./assets/logo.png" alt=""
                  width="60%"></a>
</div>
<div class="nav-btn">
      <label for="nav-check">
            <span></span>
            <span></span>
            <span></span>
      </label>
</div>

<div class="nav-links">
      <a href="./about.html" target="_blank">About Us</a>
      <a href="./sponsors.html" target="_blank">Sponsors</a>
      <a href="./alumni.html" target="_blank">Alumni</a>
      <a href="./cars.html" target="_blank">Our Cars</a>
      <a href="./contact.html" target="_blank">Contact Us</a>
</div>
`