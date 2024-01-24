import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch, params }) {
	const resp = await fetch(
		PUBLIC_BACKEND_BASE_URL + `/api/collections/jobs/records/${params.slug}` //params.slug refer to the unique {job.id} in root page which is supposed to be the folder name
	);

	const res = await resp.json();
	if (resp.status == 200) {
		return {
			job: res
		};
	} else {
		return {
			jobs: []
		};
	}
}
