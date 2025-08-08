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

	function formatCurrency(value: number | undefined, currency: string): string {
		if (value === undefined) return '-';

		// Fallback a EUR se la valuta è vuota o non valida
		const validCurrency = currency && currency.trim() !== '' ? currency : 'EUR';

		return new Intl.NumberFormat('it-IT', {
			style: 'currency',
			currency: validCurrency
		}).format(value);
	}

	function formatPercentage(value: number | undefined): string {
		if (value === undefined) return '-';
		return `${value.toFixed(2)}%`;
	}
</script>

<svelte:head>
	<title>Portfolio</title>
</svelte:head>

<div class="container">
	<header class="page-header">
		<h1>🏦 Il Mio Portfolio</h1>
		<div class="update-indicator">
			<span class="pulse"></span>
			Aggiornamento ogni 5 minuti
		</div>
	</header>

	{#if portfolio}
		<div class="portfolio-overview">
			<div class="total-assets-card">
				<h2>Valore Totale Portfolio</h2>
				<div class="total-value">€{portfolio.totalAssets.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</div>
			</div>
		</div>

		<div class="portfolio-sections">
			{#if portfolio.equity.length > 0}
				<section class="asset-section">
					<h3 class="section-title">📈 Azioni</h3>
					<div class="assets-grid">
						{#each portfolio.equity as asset (asset.isin)}
							<div class="asset-card">
								<div class="asset-header">
									<h4>{asset.name}</h4>
									<span class="ticker">{asset.ticker}</span>
								</div>
								<div class="asset-details">
									<div class="detail-row">
										<span>Unità:</span>
										<span>{asset.units}</span>
									</div>
									<div class="detail-row">
										<span>Prezzo:</span>
										<span>{formatCurrency(asset.currentPrice, asset.currency)}</span>
									</div>
									<div class="detail-row">
										<span>Valore:</span>
										<span class="value">{formatCurrency(asset.currentValue, asset.currency)}</span>
									</div>
									<div class="detail-row">
										<span>TER:</span>
										<span>{formatPercentage(asset.ter)}</span>
									</div>
									{#if asset.percentage}
										<div class="detail-row">
											<span>% Portfolio:</span>
											<span class="percentage">{formatPercentage(asset.percentage)}</span>
										</div>
									{/if}
								</div>
								<div class="asset-footer">
									<span class="provider">{asset.provider}</span>
									<span class="accumulating {asset.accumulating ? 'yes' : 'no'}">
          {asset.accumulating ? '📈 Acc.' : '💰 Dist.'}
         </span>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			{#if portfolio.bonds.length > 0}
				<section class="asset-section">
					<h3 class="section-title">🏛️ Obbligazioni</h3>
					<div class="assets-grid">
						{#each portfolio.bonds as asset (asset.isin)}
							<div class="asset-card">
								<div class="asset-header">
									<h4>{asset.name}</h4>
									<span class="ticker">{asset.ticker}</span>
								</div>
								<div class="asset-details">
									<div class="detail-row">
										<span>Unità:</span>
										<span>{asset.units}</span>
									</div>
									<div class="detail-row">
										<span>Prezzo:</span>
										<span>{formatCurrency(asset.currentPrice, asset.currency)}</span>
									</div>
									<div class="detail-row">
										<span>Valore:</span>
										<span class="value">{formatCurrency(asset.currentValue, asset.currency)}</span>
									</div>
									<div class="detail-row">
										<span>TER:</span>
										<span>{formatPercentage(asset.ter)}</span>
									</div>
									{#if asset.percentage}
										<div class="detail-row">
											<span>% Portfolio:</span>
											<span class="percentage">{formatPercentage(asset.percentage)}</span>
										</div>
									{/if}
								</div>
								<div class="asset-footer">
									<span class="provider">{asset.provider}</span>
									<span class="accumulating {asset.accumulating ? 'yes' : 'no'}">
          {asset.accumulating ? '📈 Acc.' : '💰 Dist.'}
         </span>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			{#if portfolio.commodities.length > 0}
				<section class="asset-section">
					<h3 class="section-title">🥇 Materie Prime</h3>
					<div class="assets-grid">
						{#each portfolio.commodities as asset (asset.isin)}
							<div class="asset-card">
								<div class="asset-header">
									<h4>{asset.name}</h4>
									<span class="ticker">{asset.ticker}</span>
								</div>
								<div class="asset-details">
									<div class="detail-row">
										<span>Unità:</span>
										<span>{asset.units}</span>
									</div>
									<div class="detail-row">
										<span>Prezzo:</span>
										<span>{formatCurrency(asset.currentPrice, asset.currency)}</span>
									</div>
									<div class="detail-row">
										<span>Valore:</span>
										<span class="value">{formatCurrency(asset.currentValue, asset.currency)}</span>
									</div>
									<div class="detail-row">
										<span>TER:</span>
										<span>{formatPercentage(asset.ter)}</span>
									</div>
									{#if asset.percentage}
										<div class="detail-row">
											<span>% Portfolio:</span>
											<span class="percentage">{formatPercentage(asset.percentage)}</span>
										</div>
									{/if}
								</div>
								<div class="asset-footer">
									<span class="provider">{asset.provider}</span>
									<span class="accumulating {asset.accumulating ? 'yes' : 'no'}">
          {asset.accumulating ? '📈 Acc.' : '💰 Dist.'}
         </span>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	{:else}
		<div class="no-data">
			<div class="no-data-icon">📊</div>
			<h2>Nessun dato del portfolio disponibile</h2>
			<p>I dati del portfolio verranno caricati automaticamente.</p>
		</div>
	{/if}
</div>

<style>
    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    }

    .page-header {
        text-align: center;
        margin-bottom: 3rem;
        color: white;
    }

    .page-header h1 {
        font-size: 3rem;
        margin: 0 0 1rem 0;
        font-weight: 700;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .update-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .pulse {
        width: 8px;
        height: 8px;
        background: #4ade80;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    .portfolio-overview {
        margin-bottom: 3rem;
    }

    .total-assets-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .total-assets-card h2 {
        font-size: 1.2rem;
        color: #6b7280;
        margin: 0 0 1rem 0;
        font-weight: 500;
    }

    .total-value {
        font-size: 3rem;
        font-weight: 700;
        color: #1f2937;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .portfolio-sections {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .asset-section {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .section-title {
        font-size: 1.5rem;
        margin: 0 0 1.5rem 0;
        color: #1f2937;
        font-weight: 600;
    }

    .assets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
    }

    .asset-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        border: 1px solid #e5e7eb;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .asset-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .asset-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f3f4f6;
    }

    .asset-header h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
        flex: 1;
        line-height: 1.3;
    }

    .ticker {
        background: #f3f4f6;
        color: #6b7280;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-left: 1rem;
    }

    .asset-details {
        margin-bottom: 1rem;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f9fafb;
    }

    .detail-row:last-child {
        border-bottom: none;
    }

    .detail-row span:first-child {
        color: #6b7280;
        font-size: 0.9rem;
    }

    .detail-row span:last-child {
        font-weight: 600;
        color: #1f2937;
    }

    .value {
        color: #059669 !important;
        font-weight: 700 !important;
    }

    .percentage {
        color: #dc2626 !important;
        font-weight: 700 !important;
    }

    .asset-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;
    }

    .provider {
        font-size: 0.85rem;
        color: #6b7280;
        font-weight: 500;
    }

    .accumulating {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .no-data {
        text-align: center;
        padding: 4rem 2rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .no-data-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .no-data h2 {
        color: #1f2937;
        margin: 0 0 1rem 0;
        font-weight: 600;
    }

    .no-data p {
        color: #6b7280;
        margin: 0;
    }

    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }

        .page-header h1 {
            font-size: 2rem;
        }

        .total-value {
            font-size: 2rem;
        }

        .assets-grid {
            grid-template-columns: 1fr;
        }

        .asset-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .ticker {
            margin-left: 0;
        }
    }
</style>