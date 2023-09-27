import { Video } from "../models/extractor";
declare class StreamSB {
    private serverName;
    private sources;
    private readonly host;
    private readonly host2;
    private PAYLOAD;
    extract(videoUrl: URL, isAlt?: boolean): Promise<Video[]>;
    private addSources;
}
export default StreamSB;
