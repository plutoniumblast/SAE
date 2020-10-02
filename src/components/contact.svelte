<script>
      import Lazy from "svelte-lazy";

      export let data;
      const people = data.people;
      let email = "",
            msg = "",
            name = "";
</script>

<style type="text/scss">
      .contact {
            display: flex;
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
                  cursor: pointer;
                  color: #f66;
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
      }
</style>

<div class="contact">
      <section class="left">Gallery aayegi ruko</section>
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
                              id="i-heart"
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
                                    d="M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z" />
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
            <div style="margin:1em 0">
                  {#each people as person}
                        <div class="person">
                              <Lazy
                                    offset={100}
                                    fadeOption={{ delay: 0, duration: 500 }}
                                    height={300}>
                                    <img
                                          height="1em"
                                          width="1em"
                                          alt=""
                                          src={person.img} />
                              </Lazy>
                              <div class="subperson">
                                    <span style="font-weight:500">
                                          {person.name}
                                    </span>
                                    <br />
                                    <span
                                          style="font-weight:300;color:#bbb;font-size:0.75em">{person.post}</span>
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
</div>
