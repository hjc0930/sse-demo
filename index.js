const express = require('express');
const cors = require('cors');
const SSEStream = require('ssestream').default;

const app = express();

app.use(cors());

const response = {
  id: 1,
  name: '123'
}

let timer = null;

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/sse', (req, res) => {


  const sse = new SSEStream(req);
  sse.pipe(res);

  res.on('close', () => {
    console.log('连接关闭');
    clearInterval(timer);
    sse.unpipe(res);
  })

  timer = setInterval(() => {
    if (response.id % 2 === 0) {
      sse.writeMessage({
        event: 'demoEvent',
        data: response
      })
    } else {
      sse.writeMessage({
        data: response
      });
    }

    response.id += 1;
  }, 2000)
})

app.listen(8081, () => {
  console.log('http://localhost:8081');
})