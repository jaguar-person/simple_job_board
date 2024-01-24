<script>
	import Footer from '../../../components/Footer.svelte';
	import '../../../tailwind.css';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	export let data;
	import { getUserId } from '../../../utils/auth.js';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { isLoggedIn } from '../../../utils/auth.js';
	import { isLogin } from '../../../utils/stores.js';
	import { getTokenFromLocalStorage } from '../../../utils/auth.js';

	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte
		isLogin.set(await isLoggedIn());
	});

	let isLoading = false
	$: buttonClass = `btn btn-md btn-outline btn-accent login-btn ${isLoading ? "btn--loading" : ""}`
	const submitHandler = async (event) => {
		isLoading = true
		event.preventDefault();

		const userData = {
			user: getUserId(),
			title: event.target['job-title'].value,
			minAnnualCompensation: Number(event.target['min-annual-compensation'].value),
			maxAnnualCompensation: Number(event.target['max-annual-compensation'].value),
			description: event.target['job-description'].value,
			requirements: event.target['requirements'].value,
			applicationInstructions: event.target['application-instructions'].value,
			location: event.target['location'].value,
			employer: event.target['company-name'].value
		};

		const resp = await fetch(
			PUBLIC_BACKEND_BASE_URL + '/api/collections/jobs/records/' + data.job.id,
			{
				method: 'PATCH',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: getTokenFromLocalStorage()
				},
				body: JSON.stringify(userData)
			}
		);
		const rep = resp.json();
		if (resp.ok) {
			isLoading = false
			alert('Updated successfully');
			goto('/');
		} else {
			isLoading = false
			alert('Failed');
		}
	};

	const deleteHandler = async () => {
		const value = confirm('Confirm to delete this job?');
		if (value) {
			const resp = await fetch(
				PUBLIC_BACKEND_BASE_URL + `/api/collections/jobs/records/${data.job.id}`,
				{
					method: 'DELETE',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
						Authorization: getTokenFromLocalStorage()
					}
				}
			);

			if (resp.ok) {
				alert('Delete Successfully');
				goto('/');
			} else {
				alert('Failed');
			}
		}
	};

	let enteredTitle = '';
	let titleIsValid = true;
	const titleChangeHandler = (event) => {
		enteredTitle = event.target.value;
		if (enteredTitle.length >= 3) {
			titleIsValid = true;
		} else {
			titleIsValid = false;
		}
	};

	let enteredMin = '';
	let minIsValid = true;
	const minChangeHandler = (event) => {
		enteredMin = event.target.value;
		if (+enteredMin >= 1000) {
			minIsValid = true;
		} else {
			minIsValid = false;
		}
	};

	let enteredMax = '';
	let maxIsValid = true;
	const maxChangeHandler = (event) => {
		enteredMax = event.target.value;
		if (+enteredMax >= 1000) {
			maxIsValid = true;
		} else {
			maxIsValid = false;
		}
	};

	let enteredCompany = '';
	let companyIsValid = true;
	const companyChangeHandler = (event) => {
		enteredCompany = event.target.value;
		if (enteredCompany.trim() !== '') {
			companyIsValid = true;
		} else {
			companyIsValid = false;
		}
	};

	let enteredLocation = '';
	let locationIsValid = true;
	const locationChangeHandler = (event) => {
		enteredLocation = event.target.value;
		if (enteredLocation.trim() !== '') {
			locationIsValid = true;
		} else {
			locationIsValid = false;
		}
	};

	let enteredJd = '';
	let jdIsValid = true;
	const jdChangeHandler = (event) => {
		enteredJd = event.target.value;
		if (enteredJd.trim() !== '') {
			jdIsValid = true;
		} else {
			jdIsValid = false;
		}
	};

	let enteredR = '';
	let rIsValid = true;
	const rChangeHandler = (event) => {
		enteredR = event.target.value;
		if (enteredR.trim() !== '') {
			rIsValid = true;
		} else {
			rIsValid = false;
		}
	};

	let enteredApp = '';
	let appIsValid = true;
	const appChangeHandler = (event) => {
		enteredApp = event.target.value;
		if (enteredApp.length >= 10) {
			appIsValid = true;
		} else {
			appIsValid = false;
		}
	};

	let formIsValid = true;
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

<div class="flex flex-row justify-end align-bottom delete-button-container">
	<button class="btn btn-md btn-outline btn-error" on:click={deleteHandler}>Delete</button>
</div>

<div class="container mx-auto px-2 lg:px-0">
	<form class="text-xl" on:submit={submitHandler}>
		<div class="form-control w-full form-input-div">
			<label class="label" for="job-title">Job Title</label>
			<input
				class="form-input"
				type="text"
				name="job-title"
				value={data.job.title}
				on:input={titleChangeHandler}
			/>
			{#if !titleIsValid}
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
				value={data.job.minAnnualCompensation}
				on:input={minChangeHandler}
			/>
			{#if !minIsValid}
				<label class="label" for="min-annual-compensation">
					<span class="label-text-alt text-red-500"> Must be larger than 1000.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="max-annual-compensation">Max Annual Compensation (USD)</label>
			<input
				class="form-input"
				type="number"
				name="max-annual-compensation"
				value={data.job.maxAnnualCompensation}
				on:input={maxChangeHandler}
			/>
			{#if !maxIsValid}
				<label class="label" for="max-annual-compensation">
					<span class="label-text-alt text-red-500">Must be larger than 1000.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full form-input-div">
			<label class="label" for="company-name">Company Name</label>
			<input
				class="form-input"
				type="text"
				name="company-name"
				value={data.job.employer}
				on:input={companyChangeHandler}
			/>
			{#if !companyIsValid}
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
				value={data.job.location}
				on:input={locationChangeHandler}
			/>
			{#if !locationIsValid}
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
				value={data.job.description}
				on:input={jdChangeHandler}
			/>
			{#if !jdIsValid}
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
				value={data.job.requirements}
				on:input={rChangeHandler}
			/>
			{#if !jdIsValid}
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
				value={data.job.applicationInstructions}
				on:input={appChangeHandler}
			/>
			{#if !appIsValid}
				<label class="label" for="application-instructions">
					<span class="label-text-alt text-red-500">Must at least 10 characters.</span>
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

	.delete-button-container {
		margin-top: 100px;
	}

	.delete-button-container button {
		border: none;
		font-weight: 800;
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
