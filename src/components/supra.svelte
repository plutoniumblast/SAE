<script>
      import Lazy from "svelte-lazy";

      export let data;

      const subsystem = data.subsys;
</script>

<style type="text/scss">
      section {
            color: white;
      }
      .oldModel {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            justify-content: space-around;
            .car {
                  width: 33%;
                  img {
                        width: 80%;
                        height: auto;
                        object-fit: cover;
                        border-radius: 1em;
                  }
            }
      }
      .about {
            font-size: 1.5rem;
            line-height: 1.5em;
            padding: 1rem;
            text-align: justify;
      }
      .subsystems {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            text-align: center;
            .system {
                  margin: 1em 0;
                  width: 20%;
                  img {
                        width: 5em;
                        height: 5em;
                        border-radius: 50%;
                        object-fit: cover;
                  }
            }
      }
      .landing {
            padding: 1em;
            display: flex;
            flex-wrap: wrap;
            width: calc(100% - 2em);
            height: 100vh;
            align-items: center;
            background: white;
            img {
                  width: calc(60% - 2em);
                  height: auto;
                  object-fit: contain;
            }
            .specs {
                  display: flex;
                  flex-wrap: wrap;
                  width: calc(40% - 2em);
                  padding: 1em;
                  height: 8em;
                  color: black;
                  .spec {
                        margin: 0.75em 1.5em;
                        font-family: "Times New Roman", Times, serif;
                        font-size: 3em;
                        width: calc(50% - 3em);
                        line-height: 0.5;
                        font-weight: 500;
                        .units {
                              font-size: 0.5em;
                        }
                        .specAbt {
                              color: #444;
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 0.34em;
                              font-weight: 300;
                        }
                  }
            }
      }
      @media (max-width: 1200px) {
            .oldModel {
                  .car {
                        width: 33%;
                        img {
                              width: 90%;
                              border-radius: 1em;
                        }
                  }
            }
            .subsystems {
                  .system {
                        width: 25%;
                  }
            }
            .landing {
                  padding: 0.25em;
                  height: 100vh;
                  width: calc(100% - 0.5em);
                  img {
                        width: calc(60% - 0.5em);
                  }
                  .specs {
                        width: calc(40% - 0.5em);
                        padding: 0.5em;
                        height: 8em;
                        .spec {
                              margin: 0.75em 1em;
                              width: calc(50% - 2em);
                        }
                  }
            }
      }
      @media (max-width: 768px) {
            .sponsor-btn {
                  font-size: 0.75em;
                  svg {
                        height: 40px;
                        width: 40px;
                  }
            }
            .oldModel {
                  .car {
                        width: 100%;
                        margin: 0.75em 0;
                        img {
                              width: 90%;
                              border-radius: 1em;
                        }
                  }
            }
            .about {
                  font-size: 1rem;
            }
            .subsystems {
                  .system {
                        width: 33%;
                  }
            }
            .landing {
                  padding: 0 0.25em;
                  width: calc(100% - 0.5em);
                  min-height: 100vh;
                  img {
                        width: 100%;
                  }
                  .specs {
                        width: 100%;
                        padding: 0;
                        .spec {
                              margin: 0.5em 0.25em;
                              width: calc(50% - 0.5em);
                        }
                        padding-bottom: 1.5em;
                  }
            }
      }
</style>

<section>
      <div class="landing">
            <img
                  src="https://api.ferrarinetwork.ferrari.com/v2/network-content/medias/resize/5d1e265c58f6950a986a9996-d-dinamica-040719?apikey=9QscUiwr5n0NhOuQb463QEKghPrVlpaF&width=1920&height=1080"
                  alt="" />
            <div class="specs">
                  <div class="spec">
                        100
                        <span class="units">HP</span>
                        <br />
                        <span class="specAbt">Power</span>
                  </div>
                  <div class="spec">
                        80
                        <span class="units">km/h</span>
                        <br />
                        <span class="specAbt">Top Speed</span>
                  </div>
                  <div class="spec">
                        5
                        <span class="units">sec</span>
                        <br />
                        <span class="specAbt">0-100 km/h</span>
                  </div>
                  <div class="spec">
                        V12
                        <span class="units" />
                        <br />
                        <span class="specAbt">Engine</span>
                  </div>
            </div>
      </div>
      <div style="padding: 1em;">
            <div style="width:100%;text-align:center;">
                  <button class="sponsor-btn">
                        <span
                              style="font-size:4em;font-weight:200;padding:0 0.15em;">
                              <i> Sponsor Us </i></span>
                        <svg
                              width="50"
                              height="50"
                              viewBox="0 0 4274 3976"
                              style="transform:scaleY(-1) skewX(0deg)">
                              <path
                                    stroke="#fff"
                                    fill="none"
                                    stroke-width="150"
                                    stroke-linecap="round"
                                    d="M2238 210C2135 107 1968 112 1865 215 1762 318 1762 485 1865 588L2127 849C2230 952 2397 948 2500 845 2603 742 2603 575 2500 472ZM1862 587C1759 484 1592 488 1489 591 1386 694 1386 861 1489 964L1750 1226C1853 1329 2020 1324 2123 1221 2226 1118 2226 951 2123 848ZM1485 963C1382 860 1215 865 1112 968 1009 1071 1009 1238 1112 1341L1374 1602C1477 1705 1644 1701 1747 1598 1850 1495 1850 1328 1747 1225ZM1109 1340C1006 1237 839 1241 736 1344 633 1447 633 1614 736 1717L997 1979C1100 2082 1267 2077 1370 1974 1473 1871 1473 1704 1370 1601ZM2539 3059L2088 2608C1869 2385 1525 2385 1313 2597L2078 3362M2076 3360C2533 3818 3339 3882 3796 3424 4253 2967 4253 2225 3796 1768M2547 3055L3703 1899C3806 1796 3801 1629 3698 1526 3595 1423 3428 1423 3325 1526M2548 2301L3326 1522C3429 1419 3425 1252 3322 1149 3219 1046 3052 1046 2949 1149L2170 1928M2950 1146C3053 1043 3048 876 2945 773 2842 670 2675 670 2572 773M617 1672L512 1777C54 2235-10 3040 448 3498 905 3955 1647 3955 2104 3498L2136 3465" />
                        </svg>
                  </button>
            </div>
            <br />
            <div class="oldModel">
                  <div class="car">
                        <Lazy
                              offset={100}
                              fadeOption={{ delay: 0, duration: 500 }}
                              height={300}>
                              <img src="./assets/cars/sieg1.jpg" alt="" />
                        </Lazy>
                        <br />
                        <span style="color:#ccc">Baja 2017</span>
                  </div>
                  <div class="car">
                        <Lazy
                              offset={100}
                              fadeOption={{ delay: 0, duration: 500 }}
                              height={300}>
                              <img src="./assets/cars/sieg2.jpg" alt="" />
                        </Lazy>
                        <br />
                        <span style="color:#ddd">Baja 2018</span>
                  </div>
                  <div class="car">
                        <Lazy
                              offset={100}
                              fadeOption={{ delay: 0, duration: 500 }}
                              height={300}>
                              <img src="./assets/cars/seig3.jpg" alt="" />
                        </Lazy>
                        <br />
                        <span style="color:#eee">Baja 2019</span>
                  </div>
            </div>
            <div class="about">
                  <h1>
                        About the Baja
                        <img
                              src="./assets/cars/cybertruck.png"
                              style="transform:scaleX(-1);height:1.5em;position:relative;top:0.5em;filter: saturate(0) contrast(100%) brightness(30);"
                              alt="" />
                  </h1>

                  <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Fugiat velit molestiae dolorem officiis ducimus
                        beatae cum ipsa et sint. Voluptas ipsum dolore repellat
                        dignissimos ratione dolor earum quisquam perspiciatis
                        hic. Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Quo laborum exercitationem id voluptas expedita
                        necessitatibus maxime distinctio illo deserunt?
                        Accusamus laudantium placeat, repudiandae atque voluptas
                        adipisci temporibus aspernatur excepturi reiciendis.
                  </p>
            </div>
            <h1 style="padding:0.25em;font-size:3em;">Subsystems</h1>
            <div class="subsystems">
                  {#each subsystem as system}
                        <div class="system">
                              <Lazy
                                    offset={100}
                                    fadeOption={{ delay: 0, duration: 500 }}
                                    height={300}>
                                    <img src={system.img} alt="" />
                              </Lazy>
                              <br />
                              {system.name}
                        </div>
                  {/each}
            </div>
            <div style="display:flex;align-items:center;padding:0.25em 0;">
                  <hr
                        style="width:100%;border-radius:5px;border:2px dashed #ff666688;height:0;" />
                  <object
                        width="100px"
                        height="20px"
                        title="f1car"
                        data="./assets/micro/f1.svg"
                        type="image/svg+xml" />
            </div>
            <div style="display:flex;font-size:1.5em;padding:0.5em 0;">
                  <h1>The Team</h1>
                  <svg
                        style="position:relative;top:1.25em;left:0.5em;"
                        width="32pt"
                        height="32pt"
                        viewBox="0 -1250 1250 1250"
                        preserveAspectRatio="xMidYMid meet">
                        <g transform="scale(0.1,-0.1)" fill="#fff">
                              <path
                                    d="M1521 12322 l-81 -162 52 -30 c29 -16 406 -232 838 -479 l785 -449 -2 -128 c-3 -157 -24 -311 -63 -472 -124 -508 -428 -915 -892 -1196 l-77 -47 -808 462 c-444 254 -822 470 -840 481 l-32 19 -41 -80 -40 -81 45 -126 c171 -469 434 -893 728 -1171 469 -443 1087 -674 1877 -699 212 -7 259 -16 377 -79 229 -121 522 -350 963 -750 236 -214 353 -327 721 -693 l327 -324 642 642 643 641 -345 347 c-925 930 -1467 1555 -1666 1922 -61 113 -69 157 -76 395 -14 492 -80 830 -217 1124 -134 286 -364 533 -647 693 -432 245 -1019 370 -1854 394 l-236 7 -81 -161z" />
                              <path
                                    d="M10805 11524 c-434 -304 -796 -563 -803 -576 -7 -13 -46 -160 -88 -328 l-75 -304 -2320 -2318 -2319 -2318 -320 200 -320 200 -160 -160 c-156 -156 -160 -162 -160 -203 0 -61 -17 -171 -40 -259 -93 -362 -401 -708 -826 -925 -208 -107 -435 -181 -632 -205 l-103 -13 -1321 -1320 -1321 -1319 7 -86 c27 -362 234 -753 567 -1075 287 -277 601 -446 934 -500 50 -8 110 -15 134 -15 l44 0 1319 1319 c1220 1222 1318 1322 1318 1353 0 108 55 333 122 503 209 526 590 912 1015 1025 43 12 130 26 195 33 l116 11 157 156 157 157 -201 321 -201 322 2310 2309 c1271 1269 2317 2314 2325 2321 8 7 155 47 326 90 171 43 317 84 324 92 7 7 261 367 564 800 l550 787 -208 208 c-115 114 -224 222 -242 239 l-34 32 -790 -554z" />
                              <path
                                    d="M6957 5998 l-639 -641 435 -436 c614 -617 916 -935 1222 -1291 332 -386 540 -689 574 -840 5 -25 12 -139 16 -255 19 -728 166 -1185 488 -1522 144 -151 281 -251 477 -348 425 -212 972 -318 1752 -341 l236 -7 81 161 81 162 -52 30 c-29 16 -406 232 -838 479 l-785 449 2 123 c12 707 353 1310 945 1667 l87 53 808 -462 c444 -254 822 -470 840 -481 l32 -19 40 80 40 79 -28 84 c-70 206 -198 481 -314 673 -413 684 -1033 1083 -1872 1204 -161 23 -386 41 -528 41 -152 0 -259 42 -472 183 -339 226 -775 617 -1575 1414 -223 221 -408 403 -410 402 -3 0 -292 -289 -643 -641z" />
                        </g>
                  </svg>
            </div>
            <Lazy
                  offset={100}
                  fadeOption={{ delay: 0, duration: 500 }}
                  height={300}>
                  <img
                        style="width:100%;height:auto;object-fit:cover;border-radius:2em;pointer-events:none;"
                        src="https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/e35/72657580_164119181340968_1162159420967364475_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=Cma-QicNXr4AX97iTK7&_nc_tp=18&oh=2d504daffc8df1815ab86ec796741fac&oe=5FA14518"
                        alt="" />
            </Lazy>
      </div>
</section>
