
// TODO: Confirm replacement of `el: Element` --> `el: any`
export function callNative(el: any, method: string, arg = null)
{
	/* istanbul ignore next */ // if this code runs in browser this is always true!
	if (el[method]) {
		el[method](arg);
	}
}
