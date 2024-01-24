<script>
	import humanize from 'humanize-plus';
	export let data; // resolved value is an object with key named "job", value of "job" is an object (get from responseObj.json)

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { isLoggedIn } from '../../../utils/auth.js';
	import "../../../tailwind.css"
	import Footer from '../../../components/Footer.svelte';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte
		
		isLogin.set(await isLoggedIn())
	});

	import SvelteMarkdown from 'svelte-markdown';
	import { isLogin } from '../../../utils/stores.js';

</script>

<div class="mt-10 adjust-for-fixed">
	<div class="flex">
		<div class="flex-1">
			<h1 class="text-3xl font-extrabold">{data.job.title}</h1>
			<p class="text-xl">{data.job.employer}</p>
		</div>
	</div>

	<div class="flex flex-row w-full mt-8">
		<div class="basis-2/3 prose max-w-none w-full">
			<h2 class="text-xl font-thin">Description</h2>
			<SvelteMarkdown source={data.job.description} />
			<div class="mt-6" />
			<h2 class="text-xl font-thin">Requirements</h2>
			<SvelteMarkdown source={data.job.requirements} />
			<div class="mt-6" />
			<h2 class="text-xl font-thin">How to Apply?</h2>
			<p>{data.job.applicationInstructions}</p>
		</div>
		<div class="basis-1/3 ml-4">
			<h2 class="text-xl font-thin">Location</h2>
			<p>{data.job.location}</p>
			<div class="mt-6" />
			<h2 class="text-xl font-thin">Salary Range</h2>
			<p>
				USD {humanize.formatNumber(data.job.minAnnualCompensation)} - USD
				{humanize.formatNumber(data.job.maxAnnualCompensation)}
			</p>
		</div>
	</div>
</div>
<Footer />

<style>
	.adjust-for-fixed {
		margin-top: 100px;
	}
</style>

<!-- 8. Use third party library "markdown" to make  plain text looks nicely 
        8.1 npm install svelte-markdown
        8.2 import and use as above
-->

<!-- 9. As Tailwind CSS renders all special tags such as <h1> as normal <p> tag, use third party library "Tailwind Typography" to restore special tag's default behavior (google details to npm install and adjust tailwind.config.js) -->
