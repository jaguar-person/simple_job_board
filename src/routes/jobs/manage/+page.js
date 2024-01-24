import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { getUserId } from '../../../utils/auth';

export async function load({ fetch }) {
	const resp = await fetch(
		PUBLIC_BACKEND_BASE_URL + `/api/collections/jobs/records?filter=user="${getUserId()}"`
	);

    const rep = await resp.json();
	if (resp.ok) {
		return { jobs: rep.items };
	} else {
		return { jobs: [] };
	}
}
