import { MyDisplay } from "../core/myDisplay";
import { Item } from "./item";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  constructor(opt:any) {
    super(opt)

    this.qsAll('.js-link').forEach((el:HTMLElement) => {
      new Item({
        el: el,
      })
    })
  }

  protected _update():void {
    super._update()
  }
}