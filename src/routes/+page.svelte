<script>
	import humanize from 'humanize-plus';
	import '../tailwind.css';
	export let data; // to receive the props passed via +page.js but in different way (+page.js using export)

	//third party library: theme-change
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	//store
	import { isLogin } from '../utils/stores.js';

	import { isLoggedIn } from '../utils/auth.js';
	import Footer from "../components/Footer.svelte"
	import jobLogo from "$lib/images/job-logo.png"
	import smallJobLogo from "$lib/images/small-job-logo.png"
	import owlLogo from "$lib/images/owl.png"
	import logo1 from "$lib/images/maybank.jpeg"
	import logo2 from "$lib/images/publicbank.jpeg"
	import logo3 from "$lib/images/kfc.png"
	import logo4 from "$lib/images/shell.png"
	import logo5 from "$lib/images/digi.png"
	import logo6 from "$lib/images/mcd.jpeg"
	import bgImg from "../lib/images/bg-img.webp"

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte
		
		// check local storage to see if login-ed, refer function named "isLoggedIn" in auth.js
		isLogin.set(await isLoggedIn())
	});

	let position = ""
	$: if (data.jobs.length === 0 || data.jobs.length === 1) {
		position = "position"
	} else {
		position = "positions"
	}
</script>
<img alt="bg-img" src={bgImg} class="bg-img"/>
<h1 class="text-center text-2xl font-bold italic">Showing {data.jobs.length} available {position}</h1>

{#if data.jobs.length === 0 }
<div class="owl-container">
	<img alt="owl-logo" src={owlLogo} class="owl-logo"/>
	<p class="text-center text-xl text-red-500 phase-text">Oops ... No Job Available Now</p>
</div>
{:else}
<div class="flex">
	<img alt="job-logo" src={jobLogo} />
	<div class="flex items-end">
		<img alt="small-job-logo" src={smallJobLogo} class="small-job-logo" />
		<img alt="small-job-logo" src={smallJobLogo} class="small-job-logo"/>
		<img alt="small-job-logo" src={smallJobLogo} class="small-job-logo"/>
	</div>
</div>
<div class="overflow-x-auto w-full">
	{#each data.jobs as job}
		<div class="flex flex-col mt-10">
			<div>
				<a class="font-bold text-2xl btn-outline btn-accent" href="/jobs/{job.id}">{job.title}</a>
				<div class="text-sm mt-1">
					{job.employer} . {job.location} .
					<span class="text-sm"
						>USD {humanize.formatNumber(job.minAnnualCompensation)} - USD {humanize.formatNumber(
							job.maxAnnualCompensation
						)}</span
					>
				</div>
				<div class="italic text-xs opacity-50 mt-2">
					posted {new Date(job.created).toLocaleDateString(undefined, {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</div>
			</div>
			<div class="mt-4">
				{job.description.slice(0, 240)}...
			</div>
		</div>
	{/each}
</div>
{/if}
<div class="trusted-container">
	<h2 class="text-center text-2xl font-bold">Trusted by SMEs and Corporations for 18 years</h2>
	<div class="flex flex-row justify-between items-center logo-container">
		<img alt="maybank" src={logo1} class="image-logo" id="img-1" />
		<img alt="pbb" src={logo2} class="image-logo" />
		<img alt="kfc" src={logo3} class="image-logo" />
		<img alt="shell" src={logo4} class="image-logo" />
		<img alt="digi" src={logo5} class="image-logo" />
		<img alt="mcd" src={logo6} class="image-logo" />
	</div>
</div>
<Footer />
<style>
	h1 {
		margin-top: 280px;
		font-size: 27px;
	}

	.owl-container {
		margin-bottom: 300px;
	}

	.small-job-logo {
		height: 40px;
	}

	.owl-logo {
		margin: 80px 45% 0;
	}

	.trusted-container {
		margin-top: 160px;
		padding: 15px;
	}

	.logo-container img{
		height: 100px;
		margin-top: 20px;
		width: 8%;
		border-radius: 50%;
	}

	.bg-img {
		width: 100%;
		height: 215px;
		position: absolute;
		left: 0;
		right: 0;
		top: 40px
	}
</style>

<!-- 5. Notice the number is not readable such as 250000, want to make it 250,000 by using third party library "humanize-plus". Google relevant info, npm install humanize-plus > import it and use -->

<!-- 6. The <a> tag when clicking job title to switch to another page showing job description is not working, using href="jobs/{job.id}" because it cannot be hard coded since should be a new page for every different job showing their own job description, and "job.id" is the query parameter for making the GET request later on. Based on what we learnt previously, href="/jobs/{job.id}" meaning have to create /src/routes/jobs/{job.id}/+page.svelte but every job.id is unique. It is not practical to create so many different folders named with each {job.id} respectively. How? 

	6.1 When the folder name is {} and impractical to open so many new pages like this scenario, use this way. In routes, create a folder "jobs" first. Then inside "jobs" folder we don't create folder name {job.id}, create a folder named [slug], then create +page.svelte inside [slug]. We can access to this page via /jobs/anyTextAnyThing. Obviously this is not something we want yet

	6.2 create routes/jobs/[slug]/+page.js and do as per normal doing the GET request there because we want GET request to be done before html page is rendered. 1 extra parameter "params" used to grab the params.slug which is the {job.id} query parameter to be used in the API request. Now the {job.id} used in href earlier is not treated as specific folder to dive in to look for +page.svelete, it is used as query parameter in GET http request
-->

<!-- 7. Using third party library "theme-change" to change background color -->
