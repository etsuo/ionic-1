import { Component, ElementRef, Input, Optional, Renderer, ViewChild } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { NavController } from '../../navigation/nav-controller';
import { ToolbarBase } from '../toolbar/toolbar';
import { ViewController } from '../../navigation/view-controller';


/**
 * @name Navbar
 * @description
 * Navbar acts as the navigational toolbar, which also comes with a back
 * button. A navbar can contain a `ion-title`, any number of buttons,
 * a segment, or a searchbar. Navbars must be placed within an
 * `<ion-header>` in order for them to be placed above the content.
 * It's important to note that navbar's are part of the dynamica navigation
 * stack. If you need a static toolbar, use ion-toolbar.
 *
 * @usage
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <button ion-button menuToggle>
 *       <ion-icon name="menu"></ion-icon>
 *     </button>
 *
 *     <ion-title>
 *       Page Title
 *     </ion-title>
 *
 *     <ion-buttons end>
 *       <button ion-button (click)="openModal()">
 *         <ion-icon name="options"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * @demo /docs/v2/demos/navbar/
 * @see {@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
@Component({
  selector: 'ion-navbar',
  template:
    '<div class="toolbar-background"></div>' +
    '<button (click)="backButtonClick($event)" ion-button="bar-button" class="back-button" [hidden]="_hideBb">' +
      '<span class="button-inner">' +
        '<ion-icon class="back-button-icon" [name]="_bbIcon"></ion-icon>' +
        '<span class="back-button-text" #bbTxt></span>' +
      '</span>' +
    '</button>' +
    '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
    '<ng-content select="ion-buttons[start]"></ng-content>' +
    '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
    '<div class="toolbar-content">' +
      '<ng-content></ng-content>' +
    '</div>',
  host: {
    '[hidden]': '_hidden',
    'class': 'toolbar',
    '[class.statusbar-padding]': '_sbPadding'
  }
})
export class Navbar extends ToolbarBase {
  /**
   * @internal
   */
  @ViewChild('bbTxt') _bbTxt: ElementRef;
  /**
   * @internal
   */
  _bbIcon: string;
  /**
   * @internal
   */
  _hidden: boolean = false;
  /**
   * @internal
   */
  _hideBb: boolean = false;
  /**
   * @internal
   */
  _sbPadding: boolean;

  /**
   * @input {boolean} whether the back button should be shown or not
   */
  @Input()
  get hideBackButton(): boolean {
    return this._hideBb;
  }
  set hideBackButton(val: boolean) {
    this._hideBb = isTrueProperty(val);
  }

  constructor(
    public _app: App,
    @Optional() viewCtrl: ViewController,
    @Optional() private navCtrl: NavController,
    elementRef: ElementRef,
    private _config: Config,
    private _renderer: Renderer
  ) {
    super(elementRef);

    viewCtrl && viewCtrl._setNavbar(this);

    this._bbIcon = _config.get('backButtonIcon');
    this._sbPadding = _config.getBoolean('statusbarPadding');
  }

  ngAfterViewInit() {
    this.setBackButtonText(this._config.get('backButtonText', 'Back'));
  }

  backButtonClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.navCtrl && this.navCtrl.pop(null, null);
  }

  /**
   * Set the text of the Back Button in the Nav Bar. Defaults to "Back".
   */
  setBackButtonText(text: string) {
    this._renderer.setText(this._bbTxt.nativeElement, text);
  }

  /**
   * @private
   */
  didEnter() {
    try {
      this._app.setTitle(this.getTitleText());
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @private
   */
  setHidden(isHidden: boolean) {
    // used to display none/block the navbar
    this._hidden = isHidden;
  }

}
