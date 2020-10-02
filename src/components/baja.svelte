<script>
      import Lazy from "svelte-lazy";
</script>

<style type="text/scss">
      section {
            padding: 1em;
            padding-top: 4em;
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
      }
</style>

<section>
      bg img
      <br />
      specs
      <hr />
      <div style="width:100%;text-align:center;">
            <button class="sponsor-btn">
                  <span style="font-size:4em;font-weight:200;padding:0 0.15em;">
                        <i> Sponsor Us </i></span>
                  <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                        <img
                              src="https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/29088313_152208615475047_8892872332037586944_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=208asltyTuQAX9rfILr&oh=3d359835c4ce849cc055e057aff5e185&oe=5FA22B52"
                              alt="" />
                  </Lazy>
                  <br />
                  <span style="color:#ccc">Baja 2017</span>
            </div>
            <div class="car">
                  <Lazy
                        offset={100}
                        fadeOption={{ delay: 0, duration: 500 }}
                        height={300}>
                        <img
                              src="https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/29088313_152208615475047_8892872332037586944_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=208asltyTuQAX9rfILr&oh=3d359835c4ce849cc055e057aff5e185&oe=5FA22B52"
                              alt="" />
                  </Lazy>
                  <br />
                  <span style="color:#ddd">Baja 2018</span>
            </div>
            <div class="car">
                  <Lazy
                        offset={100}
                        fadeOption={{ delay: 0, duration: 500 }}
                        height={300}>
                        <img
                              src="https://instagram.fbom36-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/29088313_152208615475047_8892872332037586944_n.jpg?_nc_ht=instagram.fbom36-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=208asltyTuQAX9rfILr&oh=3d359835c4ce849cc055e057aff5e185&oe=5FA22B52"
                              alt="" />
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
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Fugiat velit molestiae dolorem officiis ducimus beatae cum
                  ipsa et sint. Voluptas ipsum dolore repellat dignissimos
                  ratione dolor earum quisquam perspiciatis hic. Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Quo laborum
                  exercitationem id voluptas expedita necessitatibus maxime
                  distinctio illo deserunt? Accusamus laudantium placeat,
                  repudiandae atque voluptas adipisci temporibus aspernatur
                  excepturi reiciendis.
            </p>
      </div>
      subsystems
      <hr />
      team photo
</section>
