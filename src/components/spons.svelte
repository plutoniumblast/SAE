<script>
    export let data;
</script>

<style type="text/scss">
    section {
        color: white;
        padding: 1em;
        padding-top: 4em;
        font-size: 1.1em;
    }
    p {
        line-height: 1.75em;
    }
    .car {
        width: calc(33% - 40px);
        padding: 10px;
        border-radius: 10px;
        margin: 10px;
        background: #333;
        text-align: center;
        img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 50px;
            filter: grayscale(100%);
        }
        svg {
            height: 16px;
            width: 16px;
            fill: none;
            stroke: currentColor;
            position: relative;
            top: 3px;
            stroke-width: 4;
            transition: left 1s ease;
        }
        &:hover {
            svg {
                left: 4px;
            }
        }
    }
    .spacer {
        margin: 10px;
        text-align: center;
        color: #aaa;
    }
    .company {
        width: 300px;
        height: 150px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            max-width: 90%;
            max-height: 80%;
            object-fit: contain;
            filter: grayscale(100%);
        }
    }
    @media (max-width: 768px) {
        .car {
            width: calc(100% - 40px);
            padding: 10px;
            border-radius: 10px;
            margin: 10px;
            background: #333;
            text-align: center;
        }
    }
</style>

<section>
    <h2>Why Us?</h2>
    <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus
        doloremque exercitationem qui vero tempora natus magnam officiis dolorem
        aliquid, totam accusamus, quas quos! Assumenda rem deleniti voluptate.
        Ipsum numquam aliquid asperiores provident adipisci omnis soluta maiores
        autem odio eaque quam id reiciendis et voluptatum illum, quos rem
        inventore deserunt, perspiciatis recusandae commodi vel vitae harum.
        Suscipit quod assumenda incidunt, aliquam at explicabo voluptatem
        itaque? Voluptatum temporibus doloribus, non alias, et vel pariatur rem
        modi adipisci eum possimus accusamus delectus ut omnis maxime nam. Nulla
        error ratione blanditiis quidem? A soluta assumenda totam! Explicabo
        quis dignissimos praesentium tenetur consectetur dolore nulla.
    </p>

    <div style="display:flex;flex-wrap:wrap;">
        {#each data.cars as car}
            <div class="car">
                <h3>{car.name}</h3>
                <div>
                    <img src="https://{car.handlerImg}" alt="" />
                    <div>{car.handler}</div>
                </div>
                <div style="padding:1em 0;color:#f66">
                    Brochure
                    <svg viewBox="0 0 32 32">
                        <path d="M12 30 L24 16 12 2" />
                    </svg>
                </div>
            </div>
        {/each}
    </div>

    <h2>Our Sponsors</h2>
    <div style="display:flex;flex-wrap:wrap;justify-content: space-between;">
        {#each data.spons as cpy}
            <div class="spacer">
                <div class="company">
                    <img src="https://{cpy.image}" alt="" />
                </div>
                <div>{cpy.name}</div>
            </div>
        {/each}
    </div>
</section>
