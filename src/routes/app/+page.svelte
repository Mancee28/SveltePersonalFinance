<script lang="ts">
	import type { PageData, PageProps } from './$types';
	import { onMount } from 'svelte';
	import { invalidate} from '$app/navigation';

	let { data }: PageProps = $props();

	let { portfolio }: PageData = data;

	onMount(() => {
		const portfolioInterval = setInterval(() => {
			invalidate('/api/portfolio');
		}, ( 5 * 60 * 1000 ) + ( 10 * 1000 )); // 5 minutes + 10 seconds

		return () => {
			clearInterval(portfolioInterval);
		};
	});
</script>

<svelte:head>
	<title>Portfolio</title>
</svelte:head>

<div class="container">
	<h1>Portfolio Results</h1>

	{#if portfolio}
		<div class="portfolio-data">
			<pre>{JSON.stringify(portfolio, null, 2)}</pre>
		</div>
	{:else}
		<p>Nessun dato del portfolio disponibile.</p>
	{/if}
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #333;
        margin-bottom: 2rem;
    }

    .portfolio-data {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 1.5rem;
        overflow-x: auto;
    }

    pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.4;
    }
</style>