import  express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

const configuration = new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json()) 


app.post('/',async (req,res)=>{
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
        model:"text-davinci-003",
        prompt:`${prompt}`,
        temperature:0,
        max_tokens:3000,
        top_p:1,
        frequency_penalty:0,
        presence_penalty:0,
    
    })

    res.status(200).send({
    bot: response.data.choices[0].text

    })
  } catch (error) {
    
    res.status(500).send(error)

    
  }
})

app.listen(7070,()=>{console.log('listening on : http://localhost:7070')})
