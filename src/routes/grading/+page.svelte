<script lang="ts">
    let test = "MMT 2024";
    let round = "Team Round";
    let numberOfProblems = 10;
</script>

<div>
    <h1>Grade {test}</h1>
    <p>Round: {round}</p>

    <br />
    
    <p style="font-style: italic;">Pick a problem to grade</p>

    {#each {length: numberOfProblems} as _, i}
        <div>
            <a class="problemContainer" href="/grading/{i+1}">Problem {i + 1}</a>
        </div>
    {/each}
</div>

<style>
    .problemContainer {
        background-color: white;
        border: 3px solid var(--primary-tint);
        padding: 10px;
        margin: 10px;
        border-radius: 20px;
        text-align: center;
        font-weight: bold;
        text-decoration: none;
        display: block;
        color: var(--text-color-dark);
    }

    .problemContainer:hover {
        background-color: var(--primary-tint);
    }
</style>