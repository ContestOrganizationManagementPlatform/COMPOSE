<script>
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    let items = [
        { id: 1, name: "item1" },
        { id: 2, name: "item2" },
        { id: 3, name: "item3" },
        { id: 4, name: "item4" }
    ];
    const flipDurationMs = 300;

    let startX, startY;

    function handleDndConsider(e) {
        items = e.detail.items;
    }

    function handleDndFinalize(e) {
        items = e.detail.items;
    }

    function handleMove(event) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal movement
            if (deltaX > 0) {
                alert("Right");
            } else {
                alert("Left");
            }
        } else {
            // Vertical movement
            if (deltaY > 0) {
                alert("Down");
            } else {
                alert("Up");
            }
        }

        startX = event.clientX;
        startY = event.clientY;
    }
</script>

<style>
    section {
        width: 50%;
        padding: 0.3em;
        border: 1px solid black;
        /* this will allow the dragged element to scroll the list */
        overflow: scroll;
        height: 200px;
    }

    div {
        width: 50%;
        padding: 0.2em;
        border: 1px solid blue;
        margin: 0.15em 0;
    }
</style>

<section use:dndzone="{{ items, flipDurationMs }}" on:consider="{ handleDndConsider }" on:finalize="{ handleDndFinalize }">
    {#each items as item(item.id)}
        <div animate:flip="{{ duration: flipDurationMs }}">{ item.name }</div>
    {/each}
</section>

<svelte:window on:mousemove="{ handleMove }" />
