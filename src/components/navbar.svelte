<script>
</script>

<style type="text/scss">
      .header {
            position: fixed;
            background: #181818;
            width: 100%;
            z-index: 3;
            ul {
                  margin: 0;
                  padding: 0;
                  list-style: none;
                  overflow: hidden;
            }
            li {
                  a {
                        padding: 1.25em;
                  }
            }
            .menu-btn {
                  &:hover {
                        background-color: #f4f4f4;
                  }
                  display: none;
                  &:checked {
                        ~ {
                              .menu {
                                    max-height: 240px;
                              }
                              .menu-icon {
                                    .navicon {
                                          background: transparent;
                                          &:before {
                                                transform: rotate(-45deg);
                                          }
                                          &:after {
                                                transform: rotate(45deg);
                                          }
                                    }
                                    &:not(.steps) {
                                          .navicon {
                                                &:before,
                                                &:after {
                                                      top: 0;
                                                }
                                          }
                                    }
                              }
                        }
                  }
            }
            .logo {
                  display: block;
                  float: left;
                  font-size: 2em;
                  padding: 10px 20px;
                  text-decoration: none;
            }
            .menu {
                  clear: both;
                  max-height: 0;
                  transition: max-height 0.2s ease-out;
            }
            .menu-icon {
                  cursor: pointer;
                  float: right;
                  padding: 28px 20px;
                  position: relative;
                  user-select: none;
                  .navicon {
                        background: #ddd;
                        display: block;
                        height: 2px;
                        position: relative;
                        transition: background 0.2s ease-out;
                        width: 18px;
                        &::before,
                        &::after {
                              background: #ddd;
                              content: "";
                              display: block;
                              height: 100%;
                              position: absolute;
                              transition: all 0.2s ease-out;
                              width: 100%;
                        }
                        &:before {
                              top: 5px;
                        }
                        &:after {
                              top: -5px;
                        }
                  }
            }
      }
      @media (min-width: 48em) {
            .header {
                  li {
                        float: left;
                        a {
                              padding: 20px 30px;
                        }
                  }
                  .menu {
                        clear: none;
                        float: right;
                        max-height: none;
                  }
                  .menu-icon {
                        display: none;
                  }
            }
      }
</style>

<header id="purecss_header" class="header">
      <a href="/" class="logo">SAE</a>
      <input class="menu-btn" type="checkbox" id="menu-btn" />
      <label class="menu-icon" for="menu-btn"><span class="navicon" /></label>
      <ul class="menu">
            <li><a href="#">Home</a></li>
            <li><a href="#">Baja</a></li>
            <li><a href="#">Supra</a></li>
            <li><a href="#">Aero</a></li>
            <li><a href="#">Sponsor</a></li>
            <li><a href="#">Alumini</a></li>
            <li><a href="#">Contact</a></li>
      </ul>
</header>
