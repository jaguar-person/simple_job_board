<script>
	import { isLogin } from '../../utils/stores.js';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../utils/auth.js';
	import '../../tailwind.css';
	import { goto } from '$app/navigation';
	import { authenticateUser } from '../../utils/auth.js';
	import Footer from '../../components/Footer.svelte';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte

		isLogin.set(await isLoggedIn());
	});

	const postLogin = () => {
		isLogin.set(true);
		goto('/jobs/new');
	};

	// loading spin when clicked button
	let isSpin = false
	$: buttonClass = `btn btn-md login-btn ${isSpin ? "btn--loading" : ""}`;
	const submitHandler = async (event) => {
		event.preventDefault();
		isSpin = true

		const userData = {
			username: event.target.username.value,
			password: event.target.password.value
		};

		const res = await authenticateUser(userData.username, userData.password);

		if (res.success) {
			isSpin = false
			postLogin();
		} else {
			isSpin = false
			alert('Wrong Username Or Password');
			throw 'Authentication failed';
		}
	};

	let enteredUsername = '';
	let nameIsValid = false;
	let nameIsTouched = false;
	$: nameHasError = !nameIsValid && nameIsTouched;
	const nameChangeHandler = (event) => {
		enteredUsername = event.target.value;
		if (enteredUsername.trim() !== '') {
			nameIsValid = true;
		} else {
			nameIsValid = false;
		}
	};
	const nameBlurHandler = (event) => {
		nameIsTouched = true;
		if (enteredUsername.trim() == '') {
			nameIsValid = false;
		}
	};

	let enteredPassword = '';
	let passwordIsValid = false;
	let passwordIsTouched = false;
	$: passwordHasError = !passwordIsValid && passwordIsTouched;
	const passwordChangeHandler = (event) => {
		enteredPassword = event.target.value;
		if (enteredPassword.length !== 0) {
			passwordIsValid = true;
		} else {
			passwordIsValid = false;
		}
	};
	const passwordBlurHandler = (event) => {
		passwordIsTouched = true;
		if (enteredPassword.length == 0) {
			nameIsValid = false;
		}
	};

	let formIsValid = false;
	$: if (nameIsValid && passwordIsValid) {
		formIsValid = true;
	} else {
		formIsValid = false;
	}

</script>
<div class="flex justify-center items-center mt-8 adjust-for-fixed">
	<form class="w-1/3" on:submit={submitHandler}>
		<div class="form-control w-full">
			<label for="username" class="label">Username</label>
			<input
				type="text"
				name="username"
				class="input input-bordered w-full"
				placeholder="What's your Username"
				on:input={nameChangeHandler}
				on:blur={nameBlurHandler}
			/>
			{#if nameHasError}
				<label class="label" for="username">
					<span class="label-text-alt text-red-500">Name must not be empty.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label for="password" class="label">Password</label>
			<input
				type="password"
				name="password"
				class="input input-bordered w-full"
				on:input={passwordChangeHandler}
				on:blur={passwordBlurHandler}
			/>
			{#if passwordHasError}
				<label class="label" for="password">
					<span class="label-text-alt text-red-500">Password must not be empty.</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full mt-4">
			<button class={buttonClass} disabled={!formIsValid}> <span class="btn-text">LOG IN</span></button>
		</div>
	</form>
</div>
<div class="text-center">
	<a class="link-hover italic text-xs text-blue-600" href="/signUp">No account? Create one!</a>
</div>

<Footer />

<style>
	.adjust-for-fixed {
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
		content: "";
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
		animation: spin 1s ease infinite
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
