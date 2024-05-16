import { Hono } from 'hono';
import { stream, streamText, streamSSE } from 'hono/streaming'
import { v4 as uuidv4 } from "uuid";

const app = new Hono();


let videos : any = [];
app.get("/", (c) => {
  return c.html('<h1>Welcome to Hono Crash Course</h1>')
});

app.post("/videos",async(c)=>{
  const {videoName, channelName, duration } = await c.req.json();

  const newVideo = {
    id: uuidv4(),
    videoName,
    channelName,
    duration,
  }
  videos.push(newVideo);
  return c.json(newVideo);
})

// Read All using stream

app.get("/all_videos",(c)=>{
  return streamText(c, async(stream)=>{
    for(const video  of videos){
      await stream.writeln(JSON.stringify(video));
      await stream.sleep(1000);
    }
  })
});

// Read by ID

app.get("video/:id",(c)=>{
  const id = c.req.param("id");
  const video = videos.find((val:any)=>val.id===id);
  if(!video){
    return c.json({message:"Not Found"},404);
  }
  return c.json(video,200,);
})

export default app;