import express from 'express'
import path from 'node:path'
import {readdir} from 'node:fs/promises'

const app = express()
const port = 4412
const staticMountPoint = '/static'
const staticRoot = 'C:/'
const currentIP = '192.168.0.102'

// app.get('/pptFile', (req, res) => {
//   res.sendFile(path.join(staticRoot, 'a.pptx'))
// })
// app.get('/list', async (req, res) => {
//   try {
//     const files = await readdir(staticRoot)
//     const files_url = []
//     for (const file of files) {
//       files_url.push(`http://${currentIP}:${port}${staticMountPoint}/${file}`)
//     }
//     res.send(files_url)
//   } catch (err) {
//     res.send(500, err)
//   }
// })
app.use(staticMountPoint, express.static(staticRoot))

app.listen(port, () => {
  console.log(`app run at http://${currentIP}:${port}`)
})
