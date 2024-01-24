import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';


const emptyAuth = {
	token: '',
	userId: ''
};

export function logOut() {
	localStorage.setItem('auth', JSON.stringify(emptyAuth));
	return true;
}

export function getUserId() {
	const auth = localStorage.getItem('auth');
	if (auth) {
		return JSON.parse(auth)['userId'];
	}
	return null;
}

export function getTokenFromLocalStorage() {
	const auth = localStorage.getItem('auth');
	if (auth) {
		return JSON.parse(auth)['token'];
	}
	return null;
}

export async function isLoggedIn() {
	if (!getTokenFromLocalStorage()) {
		return false;
	}

	try {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/api/collections/users/auth-refresh', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: getTokenFromLocalStorage()
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			localStorage.setItem(
				'auth',
				JSON.stringify({
					token: res.token,
					userId: res.record.id
				})
			);

			return true;
		}

		return false;
	} catch {
		return false;
	}
}

// Lets say when users key in login credential (username & password), we authenticate it by posting it to backend and check
export async function authenticateUser(username, password) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/api/collections/users/auth-with-password', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
        // keys named identity and password are mentioned needed for this POST request
		body: JSON.stringify({
			identity: username,
			password
		})
	});

    // If matched successfully, it return an object with keys "token" and "record"
	const res = await resp.json();

    // If this is matched (users already sign up), response status will be 200, return an object with as resolved value and store value in local storage meaning user is verified and approved to login now (have to use JSON.stringify to convert res). Take note the properties stored in localstorage stay there forever till we delete it
	if (resp.status == 200) {
		localStorage.setItem(
			'auth',
			JSON.stringify({
				token: res.token,
				userId: res.record.id
			})
		);

		return {
			success: true,
			res: res
		};
	}

    // if 
	return {
		success: false,
		res: res
	};
}
