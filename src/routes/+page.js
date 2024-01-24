// import { onMount } from "svelte";

// // define a function that makes a http request to our backend to get data (GET request is = READ)
// async function getJobs() {
//   const resp = await fetch("https://next-jobs-db-backend.fly.dev" + '/api/collections/jobs/records');

//   const res = await resp.json();
//   if (resp.status == 200) {
//     return {
//       jobs: res.items
//     }
//   } else {
//     return {
//       jobs: []
//     }
//   }
// }

// // initialize a data variable when our route first gets loaded
// let data = {
//   jobs: []
// }

// // onMount is a Svelte function that gets called as soon as our component gets loaded, we then call our getJobs function to retrieve data
// onMount(async () => {
//   data = await getJobs()
// })

// R, Read in CRUD = GET request meaning like get data from datanase when users click a button OR when html page is render such as this project. ALWAYS MOVE GET request to +page.js if want it to be auto loaded before html page render (/routes and /routes/[slug] are doing GET request )
// 1. The above previously stored within <script></script> of routes/+page.svelte. We are using onMount to run the funcion to get data from database via GET request when the component is loaded into HTML and therefore the html area in +page.svelte able to access and use the data from database when the component is loaded.
// 2. One bad thing is onMount run only after component is loaded into HTML, meaning there is a sec the html page is showing blank since the html area cannot access to data from database before GET request is made. To solve this, move the GET request to +page.js because +page.js will run before +page.svelte
// 3. export the async function (must use function name "load" with parameter {fetch}) in +page.js; +page.svelte need to receive the resolved value of this promise via props using export let (variable name must be "data")

import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
export async function load({ fetch }) {
	const resp = await fetch(
		PUBLIC_BACKEND_BASE_URL + '/api/collections/jobs/records' 
	);

	const res = await resp.json();
	if (resp.status == 200) {
		return {
			jobs: res.items
		};
	} else {
		return {
			jobs: []
		};
	}
}

// 4. Use third party library "dotenv" as in project email automater. However Sveltekit automatically allow dotenv so we don't have to npm install it. Go ahead and use .env to hide sensitive data which is our backend base URL (Take note: need to import as above; no need to use process.env to access environment variable). We don't want others to do Create, Update, Delete to our database.
