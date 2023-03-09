import { Injector, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

export class BaseComponent {
    public _renderer: any;
    public _route: ActivatedRoute;
    constructor(injector: Injector) {
        this._renderer = injector.get(Renderer2);
        this._route = injector.get(ActivatedRoute);
    }

    // loadStyles(list: string[]) {
    //     const head = <HTMLDivElement> document.head;
    //     // const dynamicStyles = [
    //     //   '/assets/css/app.css',
    //     //   '/assets/css/farbtastic.css',
    //     //   '/assets/css/reset.css',
    //     //   '/assets/css/style.css',
    //     // ];
    
    //     for (let i = 0; i < list.length; i++) {
    //       const link = document.createElement('link');
    //       link.href = list[i];
    //       link.rel = 'stylesheet';
    //       link.type = 'text/css';
    //       head.appendChild(link);
    //     }
    //   }
    
    // loadScripts(list: string[]) {
    //     const body = <HTMLDivElement> document.body;
    //     const head = <HTMLDivElement> document.head;

    //     // const dynamicScripts = [
    //     //   '/assets/js/jquery-3.6.0.min.js',
    //     //   '/assets/js/app.js',
    //     //   // '/assets/js/farbtastic.js',
    //     //   '/assets/js/ntc.js',
    //     //   // '/assets/js/ntc_main.js',
    //     // ];

    //     for (let i = 0; i < list.length; i++) {
    //     const script = document.createElement('script');
    //     script.innerHTML = '';
    //     script.src = list[i];
    //     script.async = true;
    //     script.defer = true;

    //     body.appendChild(script);
    //     }
    // }   
    // stripScripts(s: any) {
    //     console.log(s)
    //     var div = document.createElement('div');
    //     div.innerHTML = s;
    //     var scripts: any = div.getElementsByTagName('script');
    //     var i = scripts.length;
    //     while (i--) {
    //       scripts[i].parentNode.removeChild(scripts[i]);
    //     }
    //     return div.innerHTML;
    //   }

    public loadScripts(list: string[] ) {
            list.forEach(x=> {
                this.renderExternalScript(x).onload = () => {
                }
            })
    }
    public renderExternalScript(src: string): HTMLScriptElement {
        // this.stripScripts('<span><script type="text/javascript">alert(\'foo\');<\/script><\/span>')
        const body = <HTMLDivElement> document.body;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.defer = true;
        this._renderer.appendChild(body, script);
        return script;
        
    }
    public loadStyles(list: string[] ) {
        list.forEach(x=> {
            this.renderExternalStyle(x).onload = () => {
            }
        })
    }
    public renderExternalStyle(src: string): HTMLStyleElement {
        const link = document.createElement('link');
        link.href = src;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        this._renderer.appendChild(document.head, link);
        return link;
    }
     
    
}