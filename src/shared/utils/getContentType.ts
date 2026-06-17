export default function getContentType(
    filename: string,
): string {

    if (filename.endsWith('.m3u8')) {
        return 'application/vnd.apple.mpegurl';
    }

    if (filename.endsWith('.ts')) {
        return 'video/mp2t';
    }

    return 'application/octet-stream';
}