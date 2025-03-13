import { useEffect, useState, KeyboardEvent } from "react"
import { CellContent } from "@/types/spreadsheet"
import { Update } from "next/dist/build/swc/types"

interface Props {
    content: CellContent
    onChange: (Updated: CellContent) => void
}

export default function Cell ({ content: initialContent, onChange }: Props) {
    const [editing, setEditing] = useState<boolean>(false)
    //セルが今入力欄か通常のセルかを表すための真偽値を格納するeditingというステート
    const [content, setContent] = useState<CellContent>(initialContent)
    
    
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', 'Escape'].includes(event.key)) {
            setEditing(false)
            setContent(initialContent)
        }
        if ( event.key === "Enter" ) {
            onChange(content)
        }   //Escapeキーを押下した際には呼び出さないようにしている
    }
    // "Enter" か "Escape" が押されるとeditingをfalseにもどす

    useEffect(() => {
        setContent(initialContent)
    }, [initialContent])

    const evaluateFormula = (exp:string) => {
        const sanitized = exp.slice(1).replace(/[^\=\+\-\*%/0-9]/g,'')
        return eval(sanitized)
    }

    return (  //セルをクリックした際に、editing の値をtoggle(反転)させる
        <td onClick={() => setEditing(!editing)}>
            {             //editing が true のときは、表示する内容は普通のテキストではなく、input 要素になる
            editing ? (           
                <input onClick={(e) => e.stopPropagation()}  
                //     |    イベントの伝搬をストップ       |
                onKeyDown={onKeyDown}
                value={content}
                onChange={(e) => setContent(e.target.value)} />
            ) : content.toString().startsWith("=") ? (
                evaluateFormula(content.toString())
            ) : (
                content
            )}
        </td>
    )
}