function flip ( event ) { e = event.currentTarget; e.children[ 0 ].classList.toggle( 'flip' ); }

var alum = [
      {
            "name": "Hrutwick Sawant",
            "img": "tesla.png",
            "list": [
                  {
                        "name": "testsamp",
                        "pos": "testsamp2"
                  },
                  {
                        "name": "testsamp",
                        "pos": "testsamp3"
                  }
            ]
      },
      {
            "name": "Harshvardhan Chandirasekar",
            "img": "ford.png",
            "list": [
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  },
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  }
            ]
      },
      {
            "name": "Hrutwick Sawant",
            "img": "tesla.png",
            "list": [
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  },
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  }
            ]
      },
      {
            "name": "Harshvardhan Chandirasekar",
            "img": "ford.png",
            "list": [
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  },
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  }
            ]
      },
      {
            "name": "Hrutwick Sawant",
            "img": "tesla.png",
            "list": [
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  },
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  }
            ]
      },
      {
            "name": "Harshvardhan Chandirasekar",
            "img": "ford.png",
            "list": [
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  },
                  {
                        "name": "testsamp",
                        "pos": "testsamp"
                  }
            ]
      },

];

function wi () {
      w = window.innerWidth;
      if ( w > 1400 ) return ( w / 5 )
      if ( w > 991 && w < 1400 ) return ( w / 4 )
      if ( w > 768 && w < 991 ) return ( w / 3 )
      if ( w > 600 && w < 768 ) return ( w / 2 )
      if ( w < 600 ) return w
}

function al ( p ) {
      list = "";
      p.list.forEach( pn => { list += `${ pn.name } - ${ pn.pos } <br>`; } );
      return `
    <div class="flip-card" style="width:${wi() }px;height:${ wi() }px;" onclick="flip(event)">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img src="./assets/alums/${p.img }" alt="Avatar" style="width:${ wi() }px;height:${ wi() }px;">
        </div>
        <div class="flip-card-back">
          <h1>${p.name }</h1>
          ${list }
        </div>
      </div>
    </div>
    `
}

document.getElementById( "companies" ).innerHTML = `
    ${alum.map( al ).join( '' ) }
`