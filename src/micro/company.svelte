<script>
    export let cpy;
    let card;
    setTimeout(() => card.classList.toggle("active"), 500);
    setInterval(
        () => card.classList.toggle("active"),
        (Math.random() * 5 + 3) * 1000
    );
</script>

<style type="text/scss">
    .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
    }
    .flip-card {
        background-color: transparent;
        width: 20%;
        height: 150px;
        perspective: 1000px;
    }
    .active .flip-card-inner {
        transform: rotateY(180deg);
    }

    .flip-card-front,
    .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    .flip-card-front {
        img {
            width: 80%;
            height: 100%;
            object-fit: contain;
            filter: grayscale(100%);
        }
    }

    .flip-card-back {
        display: flex;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        transform: rotateY(180deg);
        .backDat {
            background: #8884;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(7px);
            -webkit-backdrop-filter: blur(7px);
            -moz-backdrop-filter: blur(7px);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }
    @media (max-width: 991px) {
        .flip-card {
            width: 25%;
            height: 150px;
        }
    }
    @media (max-width: 768px) {
        .flip-card {
            width: 33.33%;
            height: 125px;
        }
    }
    @media (max-width: 450px) {
        .flip-card {
            width: 50%;
            height: 125px;
        }
    }
</style>

<div class="flip-card active" bind:this={card}>
    <div class="flip-card-inner">
        <div class="flip-card-front" style="background:{cpy.color || '#fff'}">
            <img src="https://{cpy.logo}" alt={cpy.company} />
        </div>
        <div
            class="flip-card-back"
            style="background-image: url(https://{cpy.logo + ')'}">
            <div class="backDat">
                <h1>{cpy.person}</h1>
                <p>{cpy.position}</p>
            </div>
        </div>
    </div>
</div>
