import { Hono } from 'hono';
import { poweredBy } from "hono/powered-by";
import { logger } from 'hono/logger';
import dbConnect from './db/connect';
import FavYoutubeVideoModel from './db/fav-youtube-model';
import { isValidObjectId } from 'mongoose';
import { stream, streamText, streamSSE } from 'hono/streaming'

const app = new Hono();

//middlewares
app.use(poweredBy());
app.use(logger());

dbConnect().then(()=>{
    // GET the List
    app.get("/", async (c)=>{
        const doc = await FavYoutubeVideoModel.find();
        return c.json(
            doc.map((d)=>d.toObject()),
            200
        );
    });

    // Create docs
    app.post("/", async (c)=>{
        const formData = await c.req.json();
        if(!formData.thumbnailUrl)
            delete formData.thumbnailUrl;
        const favVideos = new FavYoutubeVideoModel(formData);
        try {
            const doc = await favVideos.save();
            return c.json(doc.toObject(),201);
        }
        catch (error) {
            return c.json(
                (error as any)?.message || "Internal Server Error",
                500
            )
        }
    });

    // View docs by id
    app.get("/:documentId", async (c)=>{
        const id = c.req.param("documentId");
        if(!isValidObjectId(id))
            return c.json({message: "Invalid ID"},400);
        const docs = await FavYoutubeVideoModel.findById(id);
        if(!docs)
            return c.json({message: "Docs Not Found"},404);
        return c.json(docs.toObject(),200);
    });

    // Stream by id
    app.get("/d/:documentId", async (c)=>{
        const id = c.req.param("documentId");
        if(!isValidObjectId(id))
            return c.json({message: "Invalid ID"},400);
        const docs = await FavYoutubeVideoModel.findById(id);
        if(!docs)
            return c.json({message: "Docs Not Found"},404);
        return streamText(c, async (stream) => {
            stream.onAbort(() => {
                console.log('Aborted!');
            });
            for (let i = 0; i < docs.description.length; i++) {
                await stream.write(docs.description[i]);
                await stream.sleep(100);
                
            }
        })
    });

    //Update by id
    app.patch("/:documentId", async (c)=>{
        const id = c.req.param("documentId");
        if(!isValidObjectId(id))
            return c.json({message: "Invalid ID"},400);
        const docs = await FavYoutubeVideoModel.findById(id);
        if(!docs)
            return c.json({message: "Docs Not Found"},404);

        const formData = await c.req.json();

        if(!formData.thumbnailUrl)
            delete formData.thumbnailUrl;

        try {
            const updatedDoc = await FavYoutubeVideoModel.findByIdAndUpdate(
                id,
                formData,
                {
                    new: true,
                }
            );
            return c.json(updatedDoc?.toObject(), 200);
        } catch (error) {
            return c.json(
                (error as any)?.message || "Internal Server Error",
                500
            )
        }
    });

    //Delete by id
    app.delete("/delete/:documentId", async(c)=>{
        const id = c.req.param("documentId");
        if(!isValidObjectId(id))
            return c.json({message: "Invalid ID"},400);
        try {
            const deleted = await FavYoutubeVideoModel.findByIdAndDelete(id);
            return c.json(deleted?.toObject(), 200);
        } catch (error) {
            return c.json(
                (error as any)?.message || "Internal Server Error",
                500
            )
        }
    })

    //Delete All
    app.delete("/delete", async (c)=>{
        try {
            const del = await FavYoutubeVideoModel.deleteMany();
            return c.json(del, 200);
        } catch (error) {
            return c.json(
                (error as any)?.message || "Internal Server Error",
                500
            )
        }
        

    })


})
.catch((err)=>{
    app.get("/*",(c)=>{
        return c.json({message: `Failed to connect mongoDB: ${err.message}`},500);
    })
});

app.onError((err, c) => {
    console.error(`${err}`)
    return c.json({message: `App Error: ${err.message}`}, 500);
});


export default app;