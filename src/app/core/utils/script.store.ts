interface Scripts {
    name: string;
    src: string;
}  
export const ScriptStore: Scripts[] = [
    {name: 'app', src: '/assets/js/app.js'},
    {name: 'jquery', src: '/assets/js/jquery-3.6.0.min.js'},
    {name: 'jquery-ui', src: '/assets/js/jquery-ui.min.js'},
    {name: 'main', src: '/assets/js/main.js'},
    {name: 'ntc', src: '/assets/js/ntc.js'}
];