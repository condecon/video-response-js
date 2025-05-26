/**
 * Creates the headers for sending a part of a video file
 * @param start 
 * @param end 
 * @param videoSize 
 * @param mimeType e.g. "video/mp4"
 * @returns headers object
 */
export function createPartHeaders(
    start: number,
    end: number,
    videoSize: number,
    mimeType: string
): HeadersInit{
    const headers: HeadersInit = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": (end - start + 1).toString(),
      "Content-Type": mimeType,
    };

    return headers;
}

/**
 * Create heders for sending a full video file
 * @param videoSize 
 * @param mimeType e.g. "video/mp4"
 * @returns 
 */
export function createFullHeaders(videoSize: number, mimeType: string): HeadersInit{
    const headers: HeadersInit = {
        "Content-Length": videoSize.toString(),
        "Content-Type": mimeType,
    }

    return headers;
}