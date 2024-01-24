<script>
	import { isLogin } from '../../../utils/stores.js';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { isLoggedIn } from '../../../utils/auth.js';
	import '../../../tailwind.css';
	import Footer from '../../../components/Footer.svelte';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { getUserId } from '../../../utils/auth.js';
	import { goto } from '$app/navigation';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte

		isLogin.set(await isLoggedIn());
	});

	let isLoading = false
	$: buttonClass = `btn btn-md btn-outline btn-accent login-btn ${isLoading ? "btn--loading" : ""}`
	const submitHandler = async (event) => {
		event.preventDefault();
		isLoading = true

		const userData = {
			user: getUserId(),
			title: event.target['job-title'].value,
			minAnnualCompensation: event.target['min-annual-compensation'].value,
			maxAnnualCompensation: event.target['max-annual-compensation'].value,
			description: event.target['job-description'].value,
			requirements: event.target['requirements'].value,
			applicationInstructions: event.target['application-instructions'].value,
			location: event.target['location'].value,
			employer: event.target['company-name'].value
		};
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/api/collections/jobs/records', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});
		if (resp.ok) {
			isLoading = false
			const res = await resp.json();
			alert('Job Posted Successfully!');
			goto('/');
		} else {
			isLoading = false
			alert('Failed');
		}
	};

	let enteredTitle = '';
	let titleIsValid = false;
	let titleIsTouched = false;
	$: titleHasError = !titleIsValid && titleIsTouched;
	const titleChangeHandler = (event) => {
		enteredTitle = event.target.value;
		if (enteredTitle.length >= 3) {
			titleIsValid = true;
		} else {
			titleIsValid = false;
		}
	};
	const titleBlurHandler = (event) => {
		titleIsTouched = true;
		if (enteredTitle.length < 3) {
			titleIsValid = false;
		}
	};

	let enteredMin = '';
	let minIsValid = false;
	let minIsTouched = false;
	$: minHasError = !minIsValid && minIsTouched;
	const minChangeHandler = (event) => {
		enteredMin = event.target.value;
		if (+enteredMin >= 1000) {
			minIsValid = true;
		} else {
			minIsValid = false;
		}
	};
	const minBlurHandler = (event) => {
		minIsTouched = true;
		if (+enteredMin < 1000) {
			minIsValid = false;
		}
	};

	let enteredMax = '';
	let maxIsValid = false;
	let maxIsTouched = false;
	$: maxHasError = !maxIsValid && maxIsTouched;
	const maxChangeHandler = (event) => {
		enteredMax = event.target.value;
		if (+enteredMax >= 1000) {
			maxIsValid = true;
		} else {
			maxIsValid = false;
		}
	};
	const maxBlurHandler = (event) => {
		maxIsTouched = true;
		if (+enteredMax < 1000) {
			maxIsValid = false;
		}
	};

	let enteredCompany = '';
	let companyIsValid = false;
	let companyIsTouched = false;
	$: companyHasError = !companyIsValid && companyIsTouched;
	const companyChangeHandler = (event) => {
		enteredCompany = event.target.value;
		if (enteredCompany.trim() !== '') {
			companyIsValid = true;
		} else {
			companyIsValid = false;
		}
	};
	const companyBlurHandler = (event) => {
		companyIsTouched = true;
		if (enteredCompany.trim() == '') {
			companyIsValid = false;
		}
	};

	let enteredLocation = '';
	let locationIsValid = false;
	let locationIsTouched = false;
	$: locationHasError = !locationIsValid && locationIsTouched;
	const locationChangeHandler = (event) => {
		enteredLocation = event.target.value;
		if (enteredLocation.trim() !== '') {
			locationIsValid = true;
		} else {
			locationIsValid = false;
		}
	};
	const locationBlurHandler = (event) => {
		locationIsTouched = true;
		if (enteredLocation.trim() == '') {
			locationIsValid = false;
		}
	};

	let enteredJd = '';
	let jdIsValid = false;
	let jdIsTouched = false;
	$: jdHasError = !jdIsValid && jdIsTouched;
	const jdChangeHandler = (event) => {
		enteredJd = event.target.value;
		if (enteredJd.trim() !== '') {
			jdIsValid = true;
		} else {
			jdIsValid = false;
		}
	};
	const jdBlurHandler = (event) => {
		jdIsTouched = true;
		if (enteredJd.trim() == '') {
			jdIsValid = false;
		}
	};

	let enteredR = '';
	let rIsValid = false;
	let rIsTouched = false;
	$: rHasError = !rIsValid && rIsTouched;
	const rChangeHandler = (event) => {
		enteredR = event.target.value;
		if (enteredR.trim() !== '') {
			rIsValid = true;
		} else {
			rIsValid = false;
		}
	};
	const rBlurHandler = (event) => {
		rIsTouched = true;
		if (enteredR.trim() == '') {
			rIsValid = false;
		}
	};

	let enteredApp = '';
	let appIsValid = false;
	let appIsTouched = false;
	$: appHasError = !appIsValid && appIsTouched;
	const appChangeHandler = (event) => {
		enteredApp = event.target.value;
		if (enteredApp.length >= 10) {
			appIsValid = true;
		} else {
			appIsValid = false;
		}
	};
	const appBlurHandler = (event) => {
		appIsTouched = true;
		if (enteredApp.length < 10) {
			appIsValid = false;
		}
	};

	let formIsValid = false;
	$: if (
		titleIsValid &&
		minIsValid &&
		maxIsValid &&
		companyIsValid &&
		locationIsValid &&
		jdIsValid &&
		rIsValid &&
		appIsValid
	) {
		formIsValid = true;
	} else {
		formIsValid = false;
	}
</script>
<div class="adjust-for-fixed container mx-auto px-2 lg:px-0">
	<form class="text-xl" on:submit={submitHandler}>
		<div class="form-control w-full form-input-div">
			<label class="label" for="job-title">Job Title</label>
			<input
				class="form-input"
				type="text"
				name="job-title"
				on:input={titleChangeHandler}
				on:blur={titleBlurHandler}
			/>
			{#if titleHasError}
				<label class="label" for="job-title">
					<span class="label-text-alt text-red-500">Must at least 3 characters.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="min-annual-compensation">Min Annual Compensation (USD)</label>
			<input
				class="form-input"
				type="number"
				name="min-annual-compensation"
				on:input={minChangeHandler}
				on:blur={minBlurHandler}
			/>
			{#if minHasError}
				<label class="label" for="min-annual-compensation">
					<span class="label-text-alt text-red-500">Must be larger than 1000.</span
					>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="max-annual-compensation">Max Annual Compensation (USD)</label>
			<input
				class="form-input"
				type="number"
				name="max-annual-compensation"
				on:input={maxChangeHandler}
				on:blur={maxBlurHandler}
			/>
			{#if maxHasError}
				<label class="label" for="max-annual-compensation">
					<span class="label-text-alt text-red-500">Must be larger than 1000.</span
					>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="company-name">Company Name</label>
			<input
				class="form-input"
				type="text"
				name="company-name"
				on:input={companyChangeHandler}
				on:blur={companyBlurHandler}
			/>
			{#if companyHasError}
				<label class="label" for="company-name">
					<span class="label-text-alt text-red-500">Must not be empty.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="location">Location</label>
			<input
				class="form-input"
				type="text"
				name="location"
				on:input={locationChangeHandler}
				on:blur={locationBlurHandler}
			/>
			{#if locationHasError}
				<label class="label" for="location">
					<span class="label-text-alt text-red-500">Must not be empty.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="job-description">Job Description</label>
			<textarea
				class="form-textarea"
				name="job-description"
				on:input={jdChangeHandler}
				on:blur={jdBlurHandler}
			/>
			{#if jdHasError}
				<label class="label" for="job-description">
					<span class="label-text-alt text-red-500">Must not be empty.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="requirements">Requirements</label>
			<textarea
				class="form-textarea"
				name="requirements"
				on:input={rChangeHandler}
				on:blur={rBlurHandler}
			/>
			{#if rHasError}
				<label class="label" for="requirements">
					<span class="label-text-alt text-red-500">Must not be empty.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="application-instructions">Application Instructions</label>
			<textarea
				class="form-textarea"
				name="application-instructions"
				on:input={appChangeHandler}
				on:blur={appBlurHandler}
			/>
			{#if appHasError}
				<label class="label" for="application-instructions">
					<span class="label-text-alt text-red-500"
						>Must at least 10 characters.</span
					>
				</label>
			{/if}
		</div>
		<div class="flex flex-row justify-center align-bottom">
			<button class={buttonClass} disabled={!formIsValid}><span class="btn-text">Submit</span></button>
		</div>
	</form>
</div>
<Footer />

<style>
	.adjust-for-fixed {
		margin-top: 100px;
	}

	.form-input {
		background-color: rgb(170, 178, 178);
		font-size: large;
		border-radius: 10px;
		color: black;
	}

	.form-textarea {
		background-color: rgb(170, 178, 178);
		height: 80px;
		font-size: large;
		border-radius: 10px;
		color: black;
	}

	.form-input-div {
		margin-bottom: 20px;
	}

	/* loading spin after clicked button */
	/* 1 class for <span> inside <button> which is .btn-text and 2 class for <button> which are .login-btn and .btn--loading (must use --loading) */
	/* Use .login-btn to set relative position only, to control spin position later */
	/* Use .btn-text to set the content (such as LOG IN ) hidden only when .btn--loading class is added */
	/* Main thing is to construct .btn--loading (with ::after pseudo ) and keyframes together. By default this class is not inside <button>, add in only when clicked button. When add inside, hide the text in .btn-text. Rmb to remove it when loading is done. 
	*/
	.login-btn {
		position: relative;
	}
	.btn--loading .btn-text {
		visibility: hidden;
		opacity: 0;
	}
	.btn--loading::after {
		content: '';
		position: absolute;
		width: 25px;
		height: 25px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		border: 4px solid transparent;
		border-top-color: rgb(87, 92, 90);
		border-radius: 50%;
		animation: spin 1s ease infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0turn);
		}
		to {
			transform: rotate(1turn);
		}
	}
</style>
