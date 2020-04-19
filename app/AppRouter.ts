import * as path from 'path'
import { RequestContent } from '../core/types/interfaces'
import ImportsBuilder from '../core/ImportsBuilder/ImportsBuilder'

const srcPath = path.join(__dirname, 'src')

export default function appRouter(content: RequestContent) {
    const { res, pathArray } = content
    const result = ImportsBuilder(srcPath)
    console.log(result)

    res.end(JSON.stringify('hi'))
}