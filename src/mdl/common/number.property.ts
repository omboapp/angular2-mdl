
export function toNumber(value: null | number | string): null | number
{
	if (typeof value === 'undefined') {
		return null;
	} else if (typeof value === 'string') {
		return parseInt(<string>value);
	}

	return value;
}
