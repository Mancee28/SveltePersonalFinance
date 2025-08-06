<script lang="ts">
	import { enhance } from '$app/forms';
    import { getFingerprint } from '$lib/client/fingerprint';
	import type { PageProps } from './$types';

    let { form } : PageProps = $props();
    
    let isSubmitting = $state(false); 

    const handleSubmit = async ({ formData } : { formData: FormData }) => {
        isSubmitting = true;

        const fp = await getFingerprint();
        formData.set('fingerprint', fp);

        return async ({ update }: { update: () => Promise<void> }) => {
            await update();
            isSubmitting = false;
        };
    };

</script>

<svelte:head>
    <title>Login - Personal Portfolio</title>
    <meta name="description" content="Access to personal portfolio panel" />
</svelte:head>

<div class="login-container">
    <h1 class="login-title">Welcome Back</h1>
    <p class="login-subtitle">Enter your password to access the portfolio</p>
    
    {#if form}
        <div class="error-message">
            {form.message}
        </div>
    {/if}
    
    <form method="POST" action="?/login" use:enhance={handleSubmit}>

        <!-- Hidden username for accessibility -->
        <div class="form-group" style="display: none;">
            <label for="username" class="form-label">Username</label>
            <input 
                type="text" 
                id="username" 
                name="username" 
                class="form-input"
                autocomplete="username"
                disabled={isSubmitting}
            />
        </div>
        
        <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                class="form-input"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
                disabled={isSubmitting}
            />
        </div>

        <button 
            type="submit" 
            class="login-button"
            disabled={isSubmitting}
        >
            {#if isSubmitting}
                <span class="loading"></span>
                Signing in...
            {:else}
                Sign In
            {/if}
        </button>
    </form>
</div>

<style>
    .login-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 3rem 2.5rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 400px;
        width: 100%;
        text-align: center;
    }

    .login-title {
        color: #2d3748;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .login-subtitle {
        color: #718096;
        margin-bottom: 2rem;
        font-size: 0.95rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
        text-align: left;
    }

    .form-label {
        display: block;
        color: #4a5568;
        font-weight: 600;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .form-input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #fff;
    }

    .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
    }

    .login-button {
        width: 100%;
        padding: 0.875rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1rem;
    }

    .login-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .login-button:active {
        transform: translateY(0);
    }

    .error-message {
        background: #fed7d7;
        color: #c53030;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        border-left: 4px solid #e53e3e;
    }

    /* Responsive */
    @media (max-width: 480px) {
        .login-container {
            margin: 1rem;
            padding: 2rem 1.5rem;
        }
        
        .login-title {
            font-size: 1.75rem;
        }
    }

    /* Loading animation */
    .login-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff40;
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>