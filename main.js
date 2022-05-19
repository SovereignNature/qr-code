const QRCode = require("qrcode");
const {
    createCanvas,
    loadImage
} = require("canvas");
const fs = require('fs');
const processArgs = require('command-line-args');

const ArgsDefinitions = [
    {
        name: 'verbose',
        alias: 'v',
        type: Boolean,
        defaultValue: false
    },
    {
        name: 'data',
        alias: 'd',
        type: String
    },
    {
        name: 'out',
        alias: 'o',
        type: String
    },
    {
        name: 'logo',
        alias: 'l',
        type: String,
        defaultValue: './logos/logo.png'
    },
    {
        name: 'color',
        alias: 'c',
        type: String,
        defaultValue: '#000'
    },
    {
        name: 'size',
        alias: 's',
        type: Number,
        defaultValue: 720
    }
];

async function drawQRCode(canvas, data, size, color) {
    return new Promise((resolve, reject) => {
        QRCode.toCanvas(
            canvas,
            data, {
                errorCorrectionLevel: 'H',
                margin: 1,
                width: size,
                height: size,
                color: {
                    dark: color,
                    light: '#0000' // Transparent background
                },
            },
            (err) => {
                if (err) reject(err);

                resolve();
            }
        );
    });
}

async function drawLogo(canvas, logo, ratio = 0.37) {
    const logo_size = size * ratio;
    const pos = (size - logo_size) / 2;

    const img = await loadImage(logo);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(pos, pos, logo_size, logo_size);
    ctx.drawImage(img, pos, pos, logo_size, logo_size);
}

async function genQRCode(options) {

    const {
        verbose,
        data,
        logo,
        out,
        color,
        size
    } = options;

    const canvas = createCanvas(size, size);

    await drawQRCode(canvas, data, size, color);

    await drawLogo(canvas, logo);

    // Save to .png
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(out, buffer);

    if (verbose)
        console.log(`out: ${out} size: ${size} pos: ${pos} data: ${data}`);
}

async function main() {
    // Process Args
    const args = processArgs(ArgsDefinitions);

    await genQRCode(args);
}

main();
