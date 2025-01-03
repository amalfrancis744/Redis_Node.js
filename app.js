import express from 'express';
import redis from 'redis';
const app = express();

let redisClient;

(
    async () => {
        redisClient=redis.createClient()
        redisClient.on('error', (err) => {
        console.log(err)
        })

        await redisClient.connect();
    }
)();

app.get('/', (req, res) => {
 res.send('Hello World');
});

app.get('/calculate', async (req, res) => {
    try {
      
        let result = 0

//    check if data is already in cache
const cacheData = await redisClient.get('result');
if(cacheData){
 return res.json({result: cacheData, message: 'Data retrieved from cache'})
}
        for (let i = 0; i < 10000000000; i++) {
            result += i;
        }
        await redisClient.set('result', result);

        return res.send(`The result is ${result}`);
    } catch (error) {
        return res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(3000, () => {

    console.log('Server is running on port 3000');
})