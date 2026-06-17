import { spawn } from 'child_process';

export default async function execFFmpeg(
    command: string,
): Promise<void> {

    return new Promise(
        (
            resolve,
            reject,
        ) => {

            const process =
                spawn(
                    command,
                    {
                        shell: true,
                    },
                );

            let stderr = '';

            process.stderr.on(
                'data',
                data => {

                    const output =
                        data.toString();

                    stderr += output;
                },
            );

            process.stdout.on(
                'data',
                data => {

                    const output =
                        data.toString();

                    const lines =
                        output
                            .split('\n')
                            .filter(Boolean);

                    for (const line of lines) {

                        if (
                            line.startsWith(
                                'out_time=',
                            )
                        ) {

                            console.log(
                                `[FFMPEG] ${line}`,
                            );
                        }

                        if (
                            line.startsWith(
                                'speed=',
                            )
                        ) {

                            console.log(
                                `[FFMPEG] ${line}`,
                            );
                        }

                        if (
                            line.startsWith(
                                'progress=',
                            )
                        ) {

                            console.log(
                                `[FFMPEG] ${line}`,
                            );
                        }
                    }
                },
            );

            process.on(
                'close',
                code => {

                    if (code === 0) {
                        resolve();
                    } else {
                        reject(
                            new Error(
                                stderr,
                            ),
                        );
                    }
                },
            );
        },
    );
}