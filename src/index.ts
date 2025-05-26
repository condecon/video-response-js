import { open, stat } from "fs/promises";
import { createPartHeaders, createFullHeaders } from "./functions";


export type ConfigType = {
    mimeType: string | "video";
    nonPartial: boolean;
}

/**
 * Reads a file from the filesystem and returns it in a chunked format
 * as a `Response`.
 * @param filepath path of the video file
 * @param request request object 
 * @param config configuration for the video response 
 * @returns Promise<Response>
 */
export async function videoResponseFromPath(filepath: string, request: Request, config: ConfigType = {
    mimeType: "video",
    nonPartial: false
}): Promise<Response>{
    // get request headers
    const range = request.headers.get("range");
    if(!range){
        // check if config says non-partial
        if(config?.nonPartial == true){
            return await sendFullVideo(filepath, config.mimeType);
        }   
        else{
            return new Response("Range header required", {status: 401});
        }
    }

    // return video part
    return await sendVideoPart(filepath, range, config.mimeType);
}

/**
 * Creates the response for sending a complete video file
 * @param filepath video filepath
 * @param mimeType video mimetype
 * @returns 
 */
export async function sendFullVideo(filepath: string, mimeType: string): Promise<Response>{
    // get video information
    // read video stats
    const videoStat = await stat(filepath);
    const videoSize = videoStat.size;
    const fileHandle = await open(filepath, "r");
    const videoBuffer = Buffer.alloc(videoSize);
    // read file
    await fileHandle.read(videoBuffer, 0, videoSize, 0);
    await fileHandle.close();
    // read headers
   const headers = createFullHeaders(videoSize, mimeType);
    // make response
    return new Response(videoBuffer, {
                status: 200,
                headers: headers
            });
}

/**
 * Creates the response for sending a part of the video file
 * @param filepath video filepath
 * @param range range string from the request headers
 * @param mimeType video mimetype
 * @returns 
 */
export async function sendVideoPart(filepath: string, range: string, mimeType: string): Promise<Response>{
    // read video stats
    const videoStat = await stat(filepath);
    // get video size and calculate parts
    const videoSize = videoStat.size;
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

    // open video steam and create buffer
    const videoStream = await open(filepath, "r");
    const videoBuffer = Buffer.alloc(end - start + 1);
    await videoStream.read(
        videoBuffer,
        0,
        end - start + 1, start
    );

    // create response headers
    const headers = createPartHeaders(start, end, videoSize, mimeType);
    return new Response(videoBuffer, {
        status: 206,
        headers: headers
    });
}