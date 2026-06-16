import fs from 'node:fs';
import https from 'node:https';

export default async function downloadFile(
    url: string,
    destination: string,
): Promise<void> {

    return new Promise(
        (resolve, reject) => {

            const file =
                fs.createWriteStream(
                    destination,
                );

            https
                .get(
                    url,
                    response => {

                        response.pipe(file);

                        file.on(
                            'finish',
                            () => {
                                file.close();
                                resolve();
                            },
                        );
                    },
                )
                .on(
                    'error',
                    error => {

                        fs.unlink(
                            destination,
                            () => { },
                        );

                        reject(error);
                    },
                );
        },
    );
}