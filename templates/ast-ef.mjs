import 'ef.js'
import hljs from 'highlight.js';
const { highlight, highlightAuto } = hljs;

export function ASTnode2DOM_EF( ASTnode ){
    switch( ASTnode.type ){
        case "section":
            return new templates.section(
                ASTnode.title,
                ASTnode.content,
                ASTnode.date
            )
        case "itemization":
        case "enumeration":
            return new 
                templates[
                    ASTnode.type
                ]( ASTnode.items );
        case "normal-item":
            return new 
                templates[
                    ASTnode.type
                ]( ASTnode.title, ASTnode.content )
        case "math":
            return new
                templates[
                    `${ ASTnode.mode }Math`
                ]( ASTnode.content );
        case "figure":
            return new templates.figure(
                ASTnode.caption,
                ASTnode.path
            )
        case "link":
            return new templates.link(
                ASTnode.text,
                ASTnode.link
            )
        case "paragraph":
        case "plain":
        case "plain-item":
        case "italic":
        case "bold":
        case "underlined":
            return new 
                templates[
                    ASTnode.type
                ]( ASTnode.content );
        case "code-block":
            return new templates.code(
                ASTnode.content,
                ASTnode.language,
                ASTnode["line-number"]
            )
        case "table":
            return new templates.table(
                ASTnode.header,
                ASTnode.rows
            )
    }
    throw new Error(`unrecognized element type ${ASTnode.type}, please upgrade your backend`);
}

const templates = {
    plain: class extends (ef.t`
        >span.plain.md
            .{{text}}
        `) {
        constructor( text ){
            super({ $data: { text } });
        }
    },
    italic: emphasis("italic"),
    bold: emphasis("bold"),
    underlined: emphasis("underlined"),
    inlineMath: math("inline"),
    displayMath: math("display"),
    paragraph: class extends (ef.t`
        >p.md
            +content
        `) {
        constructor( content ){
            super();
            this.content = content.map( ASTnode2DOM_EF );
        }
    },
    figure: class extends (ef.t`
        >p.md
            >img.md
                #src = {{path}}
            >p.caption.md
                +caption
        `) {
        constructor( caption, path ){
            super( { $data: { path } } );
            this.caption = caption.content.map( ASTnode2DOM_EF );
        }
    },
    link: class extends (ef.t`
        >a.md
            #href = {{src}}
            +text
        `) {
        constructor( text, src ){
            super( { $data: { src } } );
            this.text = text.content.map( ASTnode2DOM_EF );
        }
    },
    itemization: class extends (ef.t`
        >ul.itemization
            +content
        `){
        constructor( content ){
            super();
            this.content = content.map( ASTnode2DOM_EF );
        }
    },
    "normal-item": class extends (ef.t`
        >li
            >p.item.md
                +title
            >div.item
                +content
        `){
        constructor( title, content ){
            super();
            this.title = ASTnode2DOM_EF( title ).content;
            this.content = content.map( ASTnode2DOM_EF );
        }
    },
    "plain-item": class extends (ef.t`
        >li.plain
            >div.item
                -content
        `){
        constructor( content ){
            super();
            this.content = ASTnode2DOM_EF( content );
        }
    },
    section: class extends (ef.t`
        >div.title
            >h2
                +title
            >span
                .{{ time }}
        +content
        `){
        constructor( title, content, time ){
            super({
                $data: { time: time??"" }
            });
            this.title = ASTnode2DOM_EF( title ).content
            this.content = content.map( ASTnode2DOM_EF );
        }
    },
    code: class extends (ef.t`
        >pre.code
            >p.language
                .{{ language }}
            #style = counter-reset: line-number {{lineno}};
            >code
                +lines
        `){
        constructor( code, language, lineno ){
            lineno ??= 1;
            super({ $data: { language, lineno: lineno-1 } });
            const highlighter = language ?
                ( code => highlight( code, { language, ignoreIllegals: true } ) ) :
                highlightAuto;
            const html = highlighter( code ).value;
            const lines = html.trimEnd().split( /\n/g );
            this.lines = lines.map( line => new codeline( line ) );
        }
    },
    table: class extends (ef.t`
        >table
            >thead
                +th
            >tbody
                +tr
        `){
        constructor( header, body ){
            super();
            this.th = [new tablerow(header)];
            this.tr = body.map(x => new tablerow(x));
        }
    }
}

class tablerow extends (ef.t`
>tr
    +cells
`){
    constructor(row){
        super();
        this.cells = row.map(tablecell);
    }
}


class tableheadercell extends (ef.t`
>th.{{align}}
    +content
`){
    constructor(cell){
        console.log( cell );
        super({
            $data: {
                align: cell.align
            }
        });
        this.content = cell.content.content.map( ASTnode2DOM_EF );
    }
}

class tablerowcell extends (ef.t`
>td.{{align}}
    +content
`){
    constructor(cell){
        console.log( cell );
        super({
            $data: {
                align: cell.align
            }
        });
        this.content = cell.content.content.map( ASTnode2DOM_EF );
    }
}

function tablecell(cell){
    return new (cell.isHeader ? tableheadercell : tablerowcell)(cell)
}

class codeline extends (ef.t`
>p.code#self
`){
    constructor( line ){
        super();
        this.$refs.self.innerHTML = line;
    }
}

function emphasis( type ){
    return class extends (ef.t`
        >span.${ type }.md
            >${type[0]}
                +content
        `) {
        constructor( { content } ){
            super();
            this.content = content.map( ASTnode2DOM_EF );
        }
    }
}

import { render } from "katex";

function math( mode ){
    return class extends (ef.t`
        >span.math.${mode}.md#elem
        `) {
        constructor( expression ){
            super();
            render(
                expression,
                this.$refs.elem,
                { displayMode: mode === "display" }
            )
        }
    }
}

const containerd = ef.t`
>div
    +root
`;

const container = new containerd();
export {
    container
}
