<script>
	import Footer from '../../components/Footer.svelte';
	import '../../tailwind.css';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../utils/auth';
	import { isLogin } from '../../utils/stores.js';
	import lockLogo from '../../lib/images/lock.png';
	import binLogo from '$lib/images/bin.png';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { getUserId } from '../../utils/auth.js';
	import { getTokenFromLocalStorage } from '../../utils/auth.js';
	import { logOut } from '../../utils/auth';
	import { goto } from '$app/navigation';

	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte
		isLogin.set(await isLoggedIn());
	});

	const accountDeleteHandler = async () => {
		let value = confirm('Confirm to delete account?'); // will return boolean value
		if (value) {
			try {
				const resp = await fetch(
					PUBLIC_BACKEND_BASE_URL + '/api/collections/users/records/' + getUserId(),
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
					alert('Delete successfully');
					logOut();
					isLogin.set(false);
					goto('/');
				}
			} catch (err) {
				alert(err);
			}
		}
	};
</script>

<div class="lock-container">
	<img alt="cry-logo" src={lockLogo} class="cry-logo" />
	<div class="flex flex-row justify-center phase-container">
		<a class="text-center text-xs text-red-500 link-hover italic" href="/update/password"
			>Have better password? Change it!</a
		>
	</div>
</div>

<div class="bin-container">
	<img alt="bin-logo" src={binLogo} class="bin-logo" />
	<div class="flex flex-row justify-center phase-container">
		<button
			class="text-center text-xs text-red-500 link-hover italic"
			on:click={accountDeleteHandler}>Delete Account</button
		>
	</div>
</div>

<Footer />

<style>
	.lock-container,
	.bin-container {
		margin: 150px 45%;
	}
	.phase-container {
		margin-top: 10px;
	}
</style>
