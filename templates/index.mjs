const { pathname } = location;
const head = pathname.startsWith("/"), tail = pathname.endsWith("/");

const position = pathname.slice(head ? 1 : 0, tail ? -1 : +Infinity);
Promise.all(
    [import(new URL(`/ast/${position ? position : "index" }.json`, location.origin), { with: { type: "json" } })
        , import("/ast-ef.mjs")
    ]
).then(([{ default: [ast, warning] }, { ASTnode2DOM_EF, container, sectionLink }]) => {
    let nodes = ast.map(e => { try { return ASTnode2DOM_EF(e) } catch(e) { console.error(e) } }).filter(_ => _);
    container.$mount({target: document.body, option: "attach"});
    container.root = nodes;
    container.links = nodes.map(sectionLink);
    console.log( document.body, container );
})
