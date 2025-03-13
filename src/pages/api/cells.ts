import { CellContent } from '@/types/spreadsheet'
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"

type Data = {
    cells?: Array<Array<CellContent>>
}

const PATH = "db.json"

const storage = { cells: undefined }

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { method } = req

    switch (method) {
        case 'GET':
            if (fs.existsSync(PATH)) {
                const content = fs.readFileSync(PATH, "utf-8")
                const data = JSON.parse(content)
                res.status(200).json(storage)
            } else {
                res.status(200).json({})
            }
            break
        case 'POST':
            const { cells } = req.body
            const data = JSON.stringify({ cells })
            fs.writeFileSync(PATH, data, "utf-8")
            res.status(200).json({})
            break
        default:
            break
    }
}