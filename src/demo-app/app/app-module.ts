import {
	NgModule,
	ApplicationRef,
	ApplicationInitStatus
} from '@angular/core';
import {
	BrowserModule,
	Title
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MdlAnimationsModule, MdlRippleModule } from '../../mdl/common';
import { MdlBadgeModule } from '../../mdl/badge';
import { MdlButtonModule } from '../../mdl/button';
import { MdlCardModule } from '../../mdl/card';
import { MdlCheckboxModule } from '../../mdl/checkbox';
import { MdlChipModule } from '../../mdl/chips';
import { MdlDialogModule } from '../../mdl/dialog';
import { MdlIconModule } from '../../mdl/icon';
import { MdlIconToggleModule } from '../../mdl/icon-toggle';
import { MdlLayoutModule } from '../../mdl/layout';
import { MdlListModule } from '../../mdl/list';
import { MdlMenuModule } from '../../mdl/menu';
// import { MdlPopoverModule } from '../../mdl/popover';
import { MdlProgressModule } from '../../mdl/progress';
import { MdlRadioModule } from '../../mdl/radio';
// import { MdlSelectModule } from '../../mdl/select';
import { MdlShadowModule } from '../../mdl/shadow';
import { MdlSliderModule } from '../../mdl/slider';
import { MdlSnackbarModule } from '../../mdl/snackbar';
import { MdlSpinnerModule } from '../../mdl/spinner';
import { MdlSwitchModule } from '../../mdl/switch';
import { MdlTableModule } from '../../mdl/table';
import { MdlTabsModule } from '../../mdl/tabs';
import { MdlTextFieldModule } from '../../mdl/textfield';
import { MdlTooltipModule } from '../../mdl/tooltip';

import { Angular2MdlAppComponent, Home, appRoutes } from './app.component';
import { ButtonDemo } from './button/button.component';
import { BadgeDemo } from './badge/badge.component';
import { CardDemo } from './card/card.component';
import { ChipsDemo } from './chips/chips.component';
import { IconDemo } from './icon/icon.component';
import { ShadowDemo } from './shadow/shadow.component';
import { LoadingDemo } from './loading/loading.component';
import { ListDemo } from './list/list.component';
import {
	LayoutDemo,
	Layout0Demo,
	Layout1Demo,
	Layout2Demo,
	Layout3Demo
} from './layout/layout.component';
import { MenuDemo } from './menus/menu.component';
import { ToggleDemo } from './toggle/toggle.component';
import { TooltipDemo } from './tooltip/tooltip.component';
import { SliderDemo } from './slider/slider.component';
import { SnackbarDemo } from './snackbar/snackbar.component';
import { TableDemo } from './tables/table.component';
import { TabsDemo } from './tabs/tabs.component';
import { TextFieldDemo } from './textfield/textfield.component';
import { PrismDirective } from './prism/prism.component';
import { ReactiveFormsDemo } from './reactiveforms/reactiveform.component';
import { ThemeDemo } from './theme/theme.component';
import { DialogDemo } from './dialog/dialog.component';
import { DialogDeclarativeDemo } from './dialog-declarative/dialog-declarative.component';
import { LoginModule } from './dialog/login.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,

		MdlAnimationsModule,
		MdlRippleModule,
		MdlBadgeModule,
		MdlButtonModule,
		MdlCardModule,
		MdlCheckboxModule,
		MdlChipModule,
		MdlDialogModule,
		MdlIconModule,
		MdlIconToggleModule,
		MdlLayoutModule,
		MdlListModule,
		MdlMenuModule,
		// MdlPopoverModule,
		MdlProgressModule,
		MdlRadioModule,
		// MdlSelectModule,
		MdlShadowModule,
		MdlSliderModule,
		MdlSnackbarModule,
		MdlSpinnerModule,
		MdlSwitchModule,
		MdlTableModule,
		MdlTabsModule,
		MdlTextFieldModule,
		MdlTooltipModule,

		RouterModule.forRoot(appRoutes, { enableTracing: false }),
		LoginModule,
		BrowserAnimationsModule
	],
	declarations: [
		Angular2MdlAppComponent,
		Home,
		ButtonDemo,
		BadgeDemo,
		CardDemo,
		ChipsDemo,
		DialogDemo,
		DialogDeclarativeDemo,
		IconDemo,
		ShadowDemo,
		LoadingDemo,
		ListDemo,
		LayoutDemo,
		Layout0Demo,
		Layout1Demo,
		Layout2Demo,
		Layout3Demo,
		MenuDemo,
		ToggleDemo,
		TooltipDemo,
		SliderDemo,
		SnackbarDemo,
		TableDemo,
		TabsDemo,
		TextFieldDemo,
		ThemeDemo,
		PrismDirective,
		ReactiveFormsDemo
	],
	providers: [
		Title
	],
	entryComponents: [Angular2MdlAppComponent],
	bootstrap: [],
})
export class Angular2MdlAppModule
{
	constructor(
		private appRef: ApplicationRef,
		private appStatus: ApplicationInitStatus
	) {}

	public ngDoBootstrap()
	{
		this.appStatus.donePromise.then(() => {
			let script = document.createElement('script');
			script.innerHTML = '';
			script.src = 'https://buttons.github.io/buttons.js';

			let anyScriptTag: any = document.getElementsByTagName('script')[0];
			anyScriptTag.parentNode.insertBefore(script, anyScriptTag);
		});

		this.appRef.bootstrap(Angular2MdlAppComponent);
	}
}
