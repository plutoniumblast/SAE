<script>
      import Lazy from "svelte-lazy";
      import Carousel from "../micro/folderview.svelte";
      import { fade } from "svelte/transition";

      export let data;
      const people = data.people;
      const gallery = data.gallery;
      let email = "",
            msg = "",
            name = "";

      $: pics = gallery[0].data;
      $: showFolder = 0;

      const hideCar = () => {
            showFolder = 0;
      };
      const crs = (e) => {
            pics = gallery[+e.target.id].data;
            showFolder = 1;
            window.scrollTo(0, 0);
      };
</script>

<style type="text/scss">
      .contact {
            display: flex;
            flex-direction: row-reverse;
            flex-wrap: wrap;
            padding-top: 4em;
            color: white;
            section {
                  width: calc(50% - 2.25em);
                  padding: 1em;
                  text-align: center;
            }
            .left {
                  background: #222;
            }
            .right {
                  border-radius: 0.25em 0.5em 0.25em 3em;
                  display: flex;
                  flex-direction: column;
                  background: #333;
                  border-top: 0.25em solid #c00;
                  border-right: 0.25em solid #c00;
            }
      }
      .inputBox {
            position: relative;
            width: 100%;
            padding: 0.5em 0;
            font-weight: 300;
            margin: 1em 0;
            text-align: left;
            input {
                  color: white;
                  font-size: 1.25rem;
                  background: transparent;
                  width: 100%;
                  outline: 0;
                  border: 0;
                  margin-bottom: 0.05em;
                  border-bottom: 0.1em solid #ff666688;
                  ~ label {
                        position: absolute;
                        pointer-events: none;
                        top: 0.5rem;
                        color: #fff;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                  }
                  &:hover,
                  &:focus,
                  &:valid {
                        font-weight: 200;
                        margin-bottom: 0;
                        border-bottom: 0.15em solid #ff333388;
                        transition: border 0.3s ease;
                        ~ label {
                              top: -0.5rem;
                              color: #f66;
                              font-size: 0.75rem;
                        }
                  }
            }
      }
      input[type="submit"] {
            border: 0.05em solid #ff666688;
            outline: none;
            background: transparent;
            color: #ff666688;
            font-size: 1.25rem;
            line-height: 1.25em;
            padding: 0.5em;
            text-transform: uppercase;
            border-radius: 0.75em;
            width: 100%;
            &:hover {
                  border: 0.05em solid #f66;
                  background-color: #f66;
                  cursor: pointer;
                  font-weight: 600;
                  color: #fff;
                  transition: all 0.3s ease;
            }
      }
      .person {
            display: flex;
            text-align: left;
            padding-left: 20%;
            align-items: center;
            img {
                  object-fit: cover;
                  width: 8em;
                  height: 8em;
                  border-radius: 50%;
            }
            div {
                  padding: 0.5em 1em;
                  font-size: 1.75em;
                  svg {
                        width: 22px;
                        height: 22px;
                        padding: 12px 3px;
                        border-radius: 0;
                        color: #aaa;
                  }
            }
      }
      .folder {
            width: 50%;
            img {
                  margin: 1em;
                  width: 300px;
                  height: 200px;
                  border-radius: 0.5em;
                  object-fit: cover;
                  transition: transform 0.5s ease;
                  &:hover {
                        transform: scale(1.1);
                        cursor: pointer;
                        transition: transform 0.7s ease;
                  }
            }
      }
      @media (max-width: 1200px) {
            .person {
                  padding-left: 10%;
            }
            .folder {
                  img {
                        margin: 1em;
                        width: 225px;
                        height: 150px;
                  }
            }
      }
      @media (max-width: 768px) {
            .contact section {
                  width: 100%;
            }
            .person {
                  padding-left: 5%;
                  img {
                        width: 7em;
                        height: 7em;
                  }
                  .subperson {
                        padding: 0.5em;
                        font-size: 1.5em;
                        svg {
                              width: 22px;
                              height: 22px;
                              padding: 10px 3px;
                              border-radius: 0;
                              color: #aaa;
                        }
                  }
            }
            .folder {
                  width: 100%;
                  img {
                        margin: 0;
                        width: 100%;
                        height: 225px;
                  }
            }
      }
</style>

<div class="contact" style="z-index:1" id="#contTop">
      <section class="right">
            <div
                  style="display:flex;justify-content:space-around;padding:0.5em 0;pointer-events:none;">
                  <div>
                        <svg
                              id="i-msg"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 32 32"
                              width="32"
                              height="32"
                              fill="none"
                              stroke="currentcolor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2">
                              <path
                                    d="M2 4 L30 4 30 22 16 22 8 29 8 22 2 22 Z" />
                        </svg><br />
                        Let's Talk!
                  </div>
                  <div>
                        <svg
                              id="i-info"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 32 32"
                              width="32"
                              height="32"
                              fill="none"
                              stroke="currentcolor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2">
                              <path d="M16 14 L16 23 M16 8 L16 10" />
                              <circle cx="16" cy="16" r="14" />
                        </svg><br />
                        Queries?
                  </div>
                  <div>
                        <svg
                              width="48"
                              height="34"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="308 260 580 170">
                              <path
                                    d="M897 306l-80-137c-2-4-7-5-11-4 0 0-22 9-46 9 -9 0-20-5-33-12 -18-9-40-19-66-19 -24 0-44 7-60 17 -18-12-37-20-59-22 -26-2-49 7-67 14 -13 5-25 10-34 9 -23-2-44-12-45-13 -4-2-9-1-11 3l-91 130c-3 4-2 9 2 12l97 81 0 0c-7 7-11 17-11 27 0 10 4 20 11 27 7 7 17 11 27 11 2 0 5 0 7-1 0 10 4 20 11 27 7 7 17 11 27 11 3 0 6 0 10-1 1 9 4 18 11 25 7 7 17 11 27 11 3 0 5 0 8-1 17 21 38 28 58 28 12 0 24-3 32-6 6 2 13 3 20 3 15 0 29-5 39-14 5 2 9 3 14 3 10 0 20-4 27-11 5-5 9-12 10-20 6 3 12 5 19 5 10 0 19-4 27-11 6-6 10-15 11-23 4 1 7 2 11 2 10 0 20-4 27-11 7-7 11-17 11-27 0-10-4-20-11-27l-15-15 95-66C898 315 900 310 897 306zM433 414c-4 4-9 6-14 6 -5 0-10-2-14-6 -4-4-6-9-6-14 0-5 2-10 6-14l17-17c4-4 9-6 14-6 5 0 10 2 14 6 4 4 6 9 6 14 0 5-2 10-6 14L433 414zM485 445l-6 6c-4 4-9 6-14 6 -5 0-10-2-14-6 -4-4-6-9-6-14 0-5 2-10 6-14l39-39c4-4 9-6 14-6 5 0 10 2 14 6 4 4 6 9 6 14 0 5-2 10-6 14l-32 32C485 445 485 445 485 445zM511 492c-5 0-10-2-14-6 -8-8-8-20 0-28l32-32c0 0 0 0 0 0l6-6c4-4 9-6 14-6 5 0 10 2 14 6 4 4 6 9 6 14 0 5-2 10-6 14l-39 39C522 490 517 492 511 492zM579 506c1 4 4 8 8 12 -14 2-35 1-51-17 1-1 2-1 2-2l39-39c0 0 1-1 1-2 14 11 11 16 6 24C581 489 577 496 579 506zM801 412c4 4 6 9 6 14 0 5-2 10-6 14 -4 4-9 6-14 6 -5 0-10-2-14-6l-90-90c-4-4-9-4-13 0 -4 4-4 9 0 13l82 82c0 0 0 0 0 0 4 4 6 9 6 14 0 5-2 10-6 14 -4 4-9 6-14 6s-10-2-14-6l-15-15c0 0 0 0 0 0 0 0 0 0 0 0l-54-54c-4-4-9-4-13 0 -4 4-4 9 0 13l54 54c4 4 6 9 6 14 0 5-2 10-6 14 -4 4-9 6-14 6h0c-5 0-10-2-14-6l-33-33c-4-4-9-4-13 0 -4 4-4 9 0 13l30 30c-6 4-15 7-24 7 -6 0-12-1-17-3 -13-7-15-11-15-12 -1-2 1-5 3-9 8-13 13-29-13-49 1-3 1-6 1-9 0-10-4-20-11-27 -7-7-17-11-27-11 -3 0-6 0-10 1 -1-9-4-18-11-25 -7-7-17-11-27-11s-20 4-27 11l-2 2c-2-7-5-13-10-18 -7-7-17-11-27-11 -10 0-20 4-27 11l-4 4c0 0 0 0-1-1l-91-76 82-117c9 4 26 10 44 11 13 1 27-4 42-10 18-7 38-14 59-13 16 1 30 6 44 15 -18 14-30 31-38 43 -4 7-42 68-32 99 2 7 7 13 14 15 5 2 10 3 15 3 24 0 42-22 59-43 13-16 26-32 39-35l82 82 9 9 45 46c0 0 0 0 0 0L801 412zM786 371l-49-49c0 0 0 0 0 0l-86-86c-2-2-4-3-6-3 0 0 0 0-1 0 -22 1-39 22-55 42 -15 18-30 37-45 37 -3 0-5-1-8-2 -1-1-3-1-4-4 -5-15 12-55 30-84 15-23 47-63 99-63 22 0 41 9 58 18 14 7 28 13 41 13 18 0 35-4 45-7l72 124L786 371z"
                                    fill="currentcolor" />
                        </svg>
                        <br />
                        Sponsor Us :)
                  </div>
            </div>
            <div>
                  <form onsubmit>
                        <div class="inputBox">
                              <input
                                    required
                                    bind:value={name}
                                    type="text"
                                    name="name"
                                    style="height: 1.75rem;" />
                              <label for="name">Name</label>
                        </div>
                        <div class="inputBox">
                              <input
                                    required
                                    bind:value={email}
                                    type="text"
                                    name="email"
                                    style="height: 1.75rem;" />
                              <label for="email">Email</label>
                        </div>
                        <div class="inputBox">
                              <input required name="msg" bind:value={msg} />
                              <label for="msg" size="10">Message</label>
                        </div>
                        <input type="submit" />
                  </form>
            </div>
            <div style="display:flex;align-items:center;padding:1em 0;">
                  <hr
                        style="width:100%;border-radius:5px;border:2px dashed #ff666688;height:0;" />
                  <object
                        width="100px"
                        height="20px"
                        title="f1car"
                        data="./assets/micro/f1.svg"
                        type="image/svg+xml" />
            </div>
            <div style="margin:1em 0">
                  {#each people as person}
                        <div class="person">
                              <img
                                    height="1em"
                                    width="1em"
                                    alt=""
                                    src={person.img} />
                              <div class="subperson">
                                    <span style="font-weight:500">
                                          {person.name}
                                    </span>
                                    <br />
                                    <span
                                          style="font-weight:400;color:#bbb;font-size:0.75em">{person.post}</span>
                                    <div
                                          style="padding:0;margin:0;display:flex;">
                                          <a href={person.mail}>
                                                <svg
                                                      id="i-mail"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      viewBox="0 0 32 32"
                                                      fill="none"
                                                      stroke="currentcolor"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      stroke-width="2">
                                                      <path
                                                            d="M2 26 L30 26 30 6 2 6 Z M2 6 L16 16 30 6" />
                                                </svg>
                                          </a>
                                          <a href={person.linkedin}>
                                                <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      viewBox="0 0 512 512">
                                                      <path
                                                            fill="#aaa"
                                                            d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                                                </svg>
                                          </a>
                                    </div>
                              </div>
                        </div>
                  {/each}
            </div>
      </section>
      <section class="left">
            <div style="line-height:0.75rem;padding:1em;margin-bottom:1em;">
                  <span style="font-size:2.5em;">Gallery</span>
                  <svg
                        id="i-photo"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        width="32"
                        height="32"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2">
                        <path
                              d="M20 24 L12 16 2 26 2 2 30 2 30 24 M16 20 L22 14 30 22 30 30 2 30 2 24" />
                        <circle cx="10" cy="9" r="3" />
                  </svg>
            </div>
            <div
                  style="display: flex;flex-wrap: wrap;justify-content: space-around;">
                  {#each gallery as folder, i}
                        <div class="folder">
                              <img
                                    alt=""
                                    id={i}
                                    on:click={crs}
                                    src={folder.thumb} />
                              {folder.name}
                              ({folder.data.length}
                              items)
                        </div>
                  {/each}
            </div>
      </section>
</div>

{#if showFolder}
      <div
            style="width:100vw;height:100vh;background:#00000088:z-index:2:position:absolute;top:0"
            transition:fade>
            <div
                  style="position:absolute;right:1em;top:5em;z-index:3"
                  on:click={hideCar}>
                  <svg
                        id="i-close"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        width="32"
                        height="32"
                        fill="none"
                        stroke="#fff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2">
                        <path d="M2 30 L30 2 M30 30 L2 2" />
                  </svg>
            </div>
            <Carousel {pics} />
      </div>
{/if}
