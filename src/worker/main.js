// https://webpack.js.org/loaders/file-loader/#name
import workUrl from 'file-loader?name=assets/worker/[name].[md5:hash:hex:8].[ext]!./worker.js'
const worker = new Worker(workUrl)

import * as comlink from 'comlink'
export default comlink.wrap(worker)
