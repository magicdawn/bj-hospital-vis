import workUrl from 'file-loader!./worker.js'
const worker = new Worker(workUrl)

import * as comlink from 'comlink'
export default comlink.wrap(worker)
