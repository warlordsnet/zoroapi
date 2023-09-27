import { Video } from "../models/extractor";
declare class StreamTape {
    private serverName;
    private sources;
    extract(videoUrl: URL): Promise<Video[]>;
}
export default StreamTape;
