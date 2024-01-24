<script>
	export let data;
	import Footer from '../../../components/Footer.svelte';
	import '../../../tailwind.css';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../../utils/auth';
	import { isLogin } from '../../../utils/stores.js';
	import cryLogo from '../../../lib/images/cry.png';

	onMount(async () => {
		themeChange(false);
		// 👆false parameter is required for svelte

		isLogin.set(await isLoggedIn());
	});
</script>
<h1>Edit Your Job Posting</h1>
{#if data.jobs.length == 0}
	<div>
		<img alt="cry-logo" src={cryLogo} class="cry-logo" />
		<div class="flex flex-row justify-center phase-container">
			<a class="text-center text-xs text-red-500 link-hover italic" href="/jobs/new"
				>No Job Posting? Create One!</a
			>
		</div>
	</div>
{:else}
	<div class="big-container">
		{#each data.jobs as job}
			<a class="each-job-container btn-outline btn-accent" href="/update/{job.id}">
				<div>Title: <span class="special-font">{job.title}</span></div>
				<div>Employer: <span class="special-font">{job.employer}</span></div>
				<div class="italic text-xs opacity-50 mt-2">
					posted {new Date(job.created).toLocaleDateString(undefined, {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</div>
			</a>
		{/each}
	</div>
{/if}

<Footer />

<style>
	.big-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}

    .big-container a {
        width: 30%;
    }

	.each-job-container {
		width: auto;
		margin: 15px;
		border-radius: 50%;
	}

	.cry-logo {
		margin: 50px 45% 0;
	}

	h1 {
		margin-top: 100px;
		text-align: center;
		font-size: 35px;
		margin-bottom: 25px;
		font-family: Cambria;
	}

	.phase-container {
		margin-top: 10px;
	}

    .special-font {
        margin-left: 10px;
    }
</style>
