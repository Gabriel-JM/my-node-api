import { RequestContent } from '../core/types/interfaces'

export default class AppRouter {

    constructor(private content: RequestContent) {
        this.run()
    }

    private run() {
        const { res } = this.content

        res.end(JSON.stringify({ message: 'hi' }))
    }

}