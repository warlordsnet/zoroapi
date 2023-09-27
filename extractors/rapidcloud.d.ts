import { Video, Subtitle } from "../models/extractor";
type extractReturn = {
    sources: Video[];
    subtitles: Subtitle[];
};
declare class RapidCloud {
    private serverName;
    private sources;
    private readonly fallbackKey;
    private readonly host;
    extract(videoUrl: URL): Promise<extractReturn>;
}
export default RapidCloud;
