import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({fetch, params}) {
    const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/api/collections/jobs/records/${params.slug}`)

    const res = await resp.json();
    if (resp.ok) {
        return {
            job: res
        } 
    } else {
        return {
            job: {}
        }
    }
}