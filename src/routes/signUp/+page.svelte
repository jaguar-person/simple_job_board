<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { isLogin } from '../../utils/stores.js';
	import '../../tailwind.css';
	import Footer from '../../components/Footer.svelte';

	//third party library: theme-change
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte

		isLogin.set(await isLoggedIn());
	});

	import { goto } from '$app/navigation';
	import { authenticateUser } from '../../utils/auth.js';
	import { isLoggedIn } from '../../utils/auth.js';

	async function postSignUp() {
		// svelte syntax to change page at routes/jobs/new/+page.svelte
		isLogin.set(true);
		goto('/jobs/new');
	}

	let isLoading = false;
	$: buttonClass = `btn btn-md login-btn ${isLoading ? 'btn--loading' : ''}`;
	async function createUser(evt) {
		evt.preventDefault();
		isLoading = true;

		if (evt.target['password'].value != evt.target['password-confirmation'].value) {
			alert('Password Confirmation does not match');
			isLoading = false;
			return;
		}
		// as using onSubmit, more than 1 event.target.value so use event.target.nameOfInput.value
		// the key names below are the one needed as mentioned in this POST API request part
		const userData = {
			username: evt.target['username'].value,
			email: evt.target['email'].value,
			password: evt.target['password'].value,
			passwordConfirm: evt.target['password-confirmation'].value
		};

		console.log(userData);
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/api/collections/users/records', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});
		console.log(resp);

		if (resp.status == 200) {
			isLoading = false;
			// If signed up successfully, alert out and perform authentication via POST request because we want to let users straight away login once sign up
			alert('Sign Up Successfully');
			const res = await authenticateUser(userData.username, userData.password);

			if (res.success) {
				postSignUp(); //authenticated successfully then call this
			} else {
				isLoading = false;
				throw 'Sign up succeeded but authentication failed';
			}
		} else {
			isLoading = false;
			const res = await resp.json(); //an object with key named "nameOfInput", the value of this key is an object containing a key named message
		}
	}

	let enteredUsername = '';
	let nameIsValid = false;
	let nameIsTouched = false;
	$: nameHasError = !nameIsValid && nameIsTouched;
	const nameChangeHandler = (event) => {
		enteredUsername = event.target.value;
		if (enteredUsername.length >= 3) {
			nameIsValid = true;
		} else {
			nameIsValid = false;
		}
	};
	const nameBlurHandler = (event) => {
		nameIsTouched = true;
		if (enteredUsername.length < 3) {
			nameIsValid = false;
		}
	};

	let enteredEmail = '';
	let emailIsValid = false;
	let emailIsTouched = false;
	$: emailHasError = !emailIsValid && emailIsTouched;
	const emailChangeHandler = (event) => {
		enteredEmail = event.target.value;
		if (enteredEmail.includes('@') && enteredEmail.includes('.com')) {
			emailIsValid = true;
		} else {
			emailIsValid = false;
		}
	};
	const emailBlurHandler = (event) => {
		emailIsTouched = true;
		if (!(enteredEmail.includes('@') && enteredEmail.includes('.com'))) {
			emailIsValid = false;
		}
	};

	let enteredPassword = '';
	let passwordIsValid = false;
	let passwordIsTouched = false;
	$: passwordHasError = !passwordIsValid && passwordIsTouched;
	const passwordChangeHandler = (event) => {
		enteredPassword = event.target.value;
		if (enteredPassword.length >= 8) {
			passwordIsValid = true;
		} else {
			passwordIsValid = false;
		}
	};
	const passwordBlurHandler = (event) => {
		passwordIsTouched = true;
		if (enteredPassword.length < 8) {
			passwordIsValid = false;
		}
	};

	let enteredConfirmPassword = '';
	let confirmPasswordIsValid = false;
	let confirmPasswordIsTouched = false;
	$: confirmPasswordHasError = !confirmPasswordIsValid && confirmPasswordIsTouched;
	const confirmPasswordChangeHandler = (event) => {
		enteredConfirmPassword = event.target.value;
		if (enteredConfirmPassword.length >= 8) {
			confirmPasswordIsValid = true;
		} else {
			confirmPasswordIsValid = false;
		}
	};
	const confirmPasswordBlurHandler = (event) => {
		confirmPasswordIsTouched = true;
		if (enteredConfirmPassword.length < 8) {
			confirmPasswordIsValid = false;
		}
	};

	let formIsValid = false;
	$: if (nameIsValid && emailIsValid && passwordIsValid && confirmPasswordIsValid) {
		formIsValid = true;
	} else {
		formIsValid = false;
	}
</script>

<h1 class="text-center text-2xl">Create an Account to Post a Job</h1>
<div class="text-center">
	<a class="link-hover italic text-xs text-blue-600" href="/login"
		>Already have an account? Click here to login instead.</a
	>
</div>
<div class="flex justify-center items-center mt-8">
	<form on:submit={createUser} class="w-1/3">
		<div class="form-control w-full">
			<label class="label" for="username">
				<span class="label-text">Username</span>
			</label>
			<input
				type="text"
				name="username"
				placeholder="MickyMouse88"
				class="input input-bordered w-full"
				on:input={nameChangeHandler}
				on:blur={nameBlurHandler}
			/>
			{#if nameHasError}
				<label class="label" for="username">
					<span class="label-text-alt text-red-500">Must at least 3 characters.</span>
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="email">
				<span class="label-text">Email</span>
			</label>
			<input
				type="email"
				name="email"
				placeholder="mickymouse@example.com"
				class="input input-bordered w-full"
				on:input={emailChangeHandler}
				on:blur={emailBlurHandler}
			/>
			{#if emailHasError}
				<label class="label" for="email">
					<span class="label-text-alt text-red-500"
						>Please enter a valid email with "@" and ".com".</span
					>
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text">Password</span>
			</label>
			<input
				type="password"
				name="password"
				placeholder=""
				class="input input-bordered w-full"
				on:input={passwordChangeHandler}
				on:blur={passwordBlurHandler}
			/>
			{#if passwordHasError}
				<label class="label" for="password">
					<span class="label-text-alt text-red-500">Password must be at least 8 characters.</span>
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="password-confirmation">
				<span class="label-text">Confirm Password</span>
			</label>
			<input
				type="password"
				name="password-confirmation"
				placeholder=""
				class="input input-bordered w-full"
				on:input={confirmPasswordChangeHandler}
				on:blur={confirmPasswordBlurHandler}
			/>
			{#if confirmPasswordHasError}
				<label class="label" for="passwod-confirmation">
					<span class="label-text-alt text-red-500">Password must be at least 8 characters.</span>
				</label>
			{/if}
		</div>

		<div class="form-control w-full mt-4">
			<button class={buttonClass} disabled={!formIsValid}
				><span class="btn-text">Create an Account</span></button
			>
		</div>
	</form>
</div>
<Footer />

<!-- 10. C, Create in CRUD = POST request meaning like when users clicked submit button and post the details (event.target.value) to store in database 
        10.1 So we just need a post-a-job form to grab all the job details and send (post) to database? This is correct but imagine if everyone can post the data to database, will kena spam. To avoid spam via authenticated API request
        10.2 The GET requests done previously are considered unauthenticated API request meaning everyone can make it. For this POST request, users need to make authenticated API request (backend will determine the method of authentication such as only paid users or login users able to post job)
        10.3 In this project, users need to login to post job. So we need another sign-up form to users to sign up and login
        10.4 routes/new refers to post-a-job form which is unauthenticated API POST request to store user sign up information in database
-->

<!-- 11. routes/new did the part of post-a-job form. Now see the functions storing in src/utils/auth.js to see how we authenticate users -->

<!-- 12. Doing POST request, decide authenticated or not and go check the API what info is needed by the API so we create a form to grab all these data 
		12.1 Sign-up-form is unauthenticated API request, see "CREATE" API preview to send the data required to store in database;
		12.2 Login-page-form is unauthenticated API request, see "AUTH-WITH-PASSWORD" API preview to send the credentials to database for matching
		12.3 Post-job-form is authenticated API request (in this case, must log in as users), see "CREATE" API preview to send the data required to store in database. Authenticated meaning users cannot access to the page unless they are authenticated (after login as user)
-->

<!-- 13. In POST request, see variable "userData" above on how we prepare all the details required by API POST request -->
<!-- 14. 	import { goto } from '$app/navigation' is a built in command to switch page -->

<!-- 15. PATCH request updating details here is authenticated API request (have to login as user, after validated by function named "authenticateUser" will receive a token, must use this token to send PATCH request), refer /update/[slug]/+page.svelte, create variable "userData" as POST request above to grab the required by API PATCH request, jus that change mode to "PATCH" and header need authorization which is the token received from authentication -->

<!-- 16. 2 types of authenticated API request: First is set by ourself such as the POST request in post-job-form, we only allow users access to it after login (don't use the token received after authentication in sending this POST request); Second is required by API such as the PATCH request in update-form to modify details in database (need to use token in sending this PATCH request) -->

<!-- 17. DELETE API request same way of doing as PATCH, just the change mode to "DELETE",can refer /update/[slug]/+page.svelte. It is authenticated API request, need token to speicified in sending this DELETE request such as:

				{
				method: 'DELETE',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: tokenName //Authorization key stores the token received upon authentication
				},
			
-->

<style>
	h1 {
		margin-top: 100px;
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
