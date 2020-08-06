

var words = document.getElementsByClassName( 'word' );
var wordArray = [];
var currentWord = 0;

words[ currentWord ].style.opacity = 1;
for ( var i = 0;i < words.length;i++ ) {
  splitLetters( words[ i ] );
}

function changeWord () {
  var cw = wordArray[ currentWord ];
  var nw = currentWord == words.length - 1 ? wordArray[ 0 ] : wordArray[ currentWord + 1 ];
  for ( var i = 0;i < cw.length;i++ ) {
    animateLetterOut( cw, i );
  }

  for ( var i = 0;i < nw.length;i++ ) {
    nw[ i ].className = 'letter behind';
    nw[ 0 ].parentElement.style.opacity = 1;
    animateLetterIn( nw, i );
  }

  currentWord = ( currentWord == wordArray.length - 1 ) ? 0 : currentWord + 1;
}

function animateLetterOut ( cw, i ) {
  setTimeout( function () {
    cw[ i ].className = 'letter out';
  }, i * 80 );
}

function animateLetterIn ( nw, i ) {
  setTimeout( function () {
    nw[ i ].className = 'letter in';
  }, 340 + ( i * 80 ) );
}

function splitLetters ( word ) {
  var content = word.innerHTML;
  word.innerHTML = '';
  var letters = [];
  for ( var i = 0;i < content.length;i++ ) {
    var letter = document.createElement( 'span' );
    letter.className = 'letter';
    letter.innerHTML = content.charAt( i );
    word.appendChild( letter );
    letters.push( letter );
  }

  wordArray.push( letters );
}

changeWord();
setInterval( changeWord, 4000 );

// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("imgb");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}