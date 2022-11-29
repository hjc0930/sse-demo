const Koa = require('koa');
const { PassThrough } = require('stream');
const cors = require('koa2-cors');

const app = new Koa();

app.use(cors())

const responseData = {
  id: 1,
  name: '123'
}

app.use(async (ctx) => {
  const { url } = ctx;

  if (url === '/sse') {
    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    const stream = new PassThrough();
    ctx.status = 200;

    const timer = setInterval(() => {
      if (responseData.id % 2 === 0) {
        stream.write("event: demoEvent\n");
        stream.write(`data: ${JSON.stringify(responseData)}\n\n`);
      } else {
        stream.write("event: message\n");
        stream.write(`data: ${JSON.stringify(responseData)}\n\n`);
      }
      responseData.id += 1;
    }, 3000)

    stream.on('close', () => {
      console.log('连接断开');
      clearInterval(timer)
    })


    ctx.body = stream;
  }
})

app.listen(8081, () => {
  console.log("监听端口:8081,地址:127.0.0.1:8081");
});