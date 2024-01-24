<script>
	import Footer from '../../../components/Footer.svelte';
	import '../../../tailwind.css';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import { isLoggedIn, logOut } from '../../../utils/auth';
	import { isLogin } from '../../../utils/stores.js';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { getUserId } from '../../../utils/auth';
	import { getTokenFromLocalStorage } from '../../../utils/auth';
	import { goto } from '$app/navigation';

	onMount(async () => {
		themeChange(false);
		// 👆false parameter is required for svelte
		isLogin.set(await isLoggedIn());
	});

	let isLoading = false
	$: buttonClass = `btn btn-md login-btn ${isLoading ? "btn--loading" : ""}`
	const submitHandler = async (event) => {
		event.preventDefault();
		isLoading = true

		if (event.target['new-password'].value !== event.target['confirm-new-password'].value) {
			isLoading = false
			alert('Password Confirmation does not match');
			return;
		}

		try {
			const userData = {
				oldPassword: event.target["old-password"].value,
				password: event.target['new-password'].value,
				passwordConfirm: event.target['confirm-new-password'].value,

			};
			const resp = await fetch(
				PUBLIC_BACKEND_BASE_URL + "/api/collections/users/records/" + getUserId(),
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
			if (resp.ok) {
				isLoading = false
				alert('Password Updated Successfully');
				logOut();
				goto("/login")
			} else {
				isLoading = false
				alert('Old Password is invalid, please try again.');
			}
		} catch (error) {
			isLoading = false
			alert(error);
		}
	};

	let enteredOldPassword = ""
	let oldPasswordIsValid = false
	let oldPasswordIsTouched = false
	$: oldPasswordHasError = !oldPasswordIsValid && oldPasswordIsTouched
	const oldPasswordChangeHandler = (event) => {
		enteredOldPassword = event.target.value
		if (enteredOldPassword.length >= 8) {
			oldPasswordIsValid = true
		} else {
			oldPasswordIsValid = false
		}
	}
	const oldPasswordBlurHandler = (event) => {
		oldPasswordIsTouched = true
		if (enteredOldPassword.length < 8) {
			oldPasswordIsValid = false
		}
	}

	let enteredPassword = ""
	let passwordIsValid = false
	let passwordIsTouched = false
	$: passwordHasError = !passwordIsValid && passwordIsTouched
	const passwordChangeHandler = (event) => {
		enteredPassword = event.target.value
		if (enteredPassword.length >= 8) {
			passwordIsValid = true
		} else {
			passwordIsValid = false
		}
	}
	const passwordBlurHandler = (event) => {
		passwordIsTouched = true
		if (enteredPassword.length < 8) {
			passwordIsValid = false
		}
	}

	let enteredConfirmPassword = ""
	let confirmPasswordIsValid = false
	let confirmPasswordIsTouched = false
	$: confirmPasswordHasError = !confirmPasswordIsValid && confirmPasswordIsTouched
	const confirmPasswordChangeHandler = (event) => {
		enteredConfirmPassword = event.target.value
		if (enteredConfirmPassword.length >= 8) {
			confirmPasswordIsValid = true
		} else {
			confirmPasswordIsValid = false
		}
	}
	const confirmPasswordBlurHandler = (event) => {
		confirmPasswordIsTouched = true
		if (enteredConfirmPassword.length < 8) {
			confirmPasswordIsValid = false
		}
	}
	
	let formIsValid = false
	$: if (passwordIsValid && confirmPasswordIsValid) {
		formIsValid = true
	} else {
		formIsValid = false
	}
</script>

<h1 class="text-center">Change Your Password</h1>

<div class="flex flex-row justify-center items-center big-container">
	<form class="w-1/3" on:submit={submitHandler}>
		<div class="form-control w-full">
			<label for="old-password" class="label">Old Password:</label>
			<input type="password" name="old-password" class="input w-full input-bordered" on:input={oldPasswordChangeHandler} on:blur={oldPasswordBlurHandler} />
			{#if oldPasswordHasError}
			<label class="label" for="old-password">
				<span class="label-text-alt text-red-500">Password must be at least 8 characters.</span>
			</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label for="new-password" class="label">New Password:</label>
			<input type="password" name="new-password" class="input w-full input-bordered" on:input={passwordChangeHandler} on:blur={passwordBlurHandler} />
			{#if passwordHasError}
			<label class="label" for="new-password">
				<span class="label-text-alt text-red-500">Password must be at least 8 characters.</span>
			</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label for="confirm-new-password" class="label">Confirm New Password:</label>
			<input type="password" name="confirm-new-password" class="input w-full input-bordered" on:input={confirmPasswordChangeHandler} on:blur={confirmPasswordBlurHandler} />
			{#if confirmPasswordHasError}
			<label class="label" for="confirm-new-password">
				<span class="label-text-alt text-red-500">Password must be at least 8 characters.</span>
			</label>
			{/if}
		</div>
		<div class="form-control w-full mt-4">
			<button class={buttonClass} disabled={!formIsValid}><span class="btn-text">Update</span></button>
		</div>
	</form>
</div>

<Footer />

<style>
	h1 {
		margin-top: 100px;
		font-size: 35px;
		font-family: Cambria;
	}

	.big-container {
		margin-top: 35px;
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
