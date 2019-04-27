import { Observable } from 'rxjs';
import { InternalMdlDialogReference } from './internal-dialog-reference';

/**
 * The reference to the created and displayed dialog.
 */
export class MdlDialogReference
{
	constructor(
		private internaleRef: InternalMdlDialogReference
	) {
		internaleRef.dialogRef = this;
	}

	/**
	 * closes the dialog
	 */
	public hide(data?: any)
	{
		this.internaleRef.hide(data);
	}

	/**
	 * Observable that emits, if the dialog was closed.
	 */
	public onHide(): Observable<any>
	{
		return this.internaleRef.onHide();
	}

	/**
	 * Observable that emits, if the dialog is really visible and not only created.
	 */
	public onVisible(): Observable<void>
	{
		return this.internaleRef.onVisible();
	}
}
