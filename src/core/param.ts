import GUI from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Conf } from './conf';
import { Update } from '../libs/update';
import { FPS } from '../core/fps';

export class Param {
  private static _instance: Param;

  public fps: number = FPS.MIDDLE;
  public debug:HTMLElement = document.querySelector('.l-debug') as HTMLElement;

  private _dat: any;
  private _stats: any;

  public mesh = {
    scale:{value:850, min:1, max:5000},
    interval:{value:26, min:1, max:50},
    offsetX:{value:13, min:0, max:50},
    offsetY:{value:13, min:0, max:50},
    size:{value:1500, min:10, max:2000},
    zure:{value:223, min:0, max:500},
    zure2:{value:740, min:0, max:1000},
    speed:{value:15, min:0, max:100},
  }

  constructor() {
    if (Conf.instance.FLG_PARAM) {
      this.makeParamGUI();
    }

    if (Conf.instance.FLG_STATS) {
      this._stats = Stats();
      document.body.appendChild(this._stats.domElement);
    }

    Update.instance.add(() => {
      this._update();
    });
  }

  private _update(): void {
    if (this._stats != undefined) {
      this._stats.update();
    }
  }

  public static get instance(): Param {
    if (!this._instance) {
      this._instance = new Param();
    }
    return this._instance;
  }

  public makeParamGUI(): void {
    if (this._dat != undefined) return;

    this._dat = new GUI();
    this._add(this.mesh, 'mesh');
  }

  private _add(obj: any, folderName: string): void {
    const folder = this._dat.addFolder(folderName);
    for (var key in obj) {
      const val: any = obj[key];
      if (val.use == undefined) {
        if (val.type == 'color') {
          folder.addColor(val, 'value').name(key);
        } else {
          if (val.list != undefined) {
            folder.add(val, 'value', val.list).name(key);
          } else {
            folder.add(val, 'value', val.min, val.max).name(key);
          }
        }
      }
    }
  }
}
