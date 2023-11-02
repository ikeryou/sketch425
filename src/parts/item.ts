import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _isHover:boolean = false
  private _lineEl:HTMLElement

  constructor(opt:any) {
    super(opt)

    const txt = this.el.innerHTML

    this.el.innerHTML = ''
    const txtEl = document.createElement('span')
    txtEl.classList.add('js-link-txt')
    this.el.appendChild(txtEl)
    txtEl.innerHTML = txt

    const lineEl = document.createElement('span')
    lineEl.classList.add('js-link-line')
    this.el.appendChild(lineEl)
    this._lineEl = lineEl

    this._setHover()
  }

  //
  protected _eRollOver() {
    this._isHover = true
  }

  //
  protected _eRollOut() {
    this._isHover = false
  }

  protected _update():void {
    super._update();

    if(this._isHover) this._setLineTxt()
  }

  private _setLineTxt():void {
    for(let i = 0; i < 100; i++) {
      this._lineEl.innerHTML += Util.randomArr([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9])
    }
  }
}







