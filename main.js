const QRCode = require("qrcode");
const {
    createCanvas,
    loadImage
} = require("canvas");
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
  { name: 'data', alias: 'd', type: String },
  { name: 'out', alias: 'o', type: String },
  { name: 'logo', alias: 'l', type: String, defaultValue: './logos/sni-logo2.png' },
  { name: 'color', alias: 'c', type: String, defaultValue: '#3ba859' },
  { name: 'size', alias: 's', type: Number, defaultValue: 720 }
];

async function genQRCode(options) {

    const {verbose, data, logo, out, color, size} = options;

    const canvas = createCanvas(size, size);

    let p = new Promise((resolve, reject) => {
        QRCode.toCanvas(
            canvas,
            data,
            {
                errorCorrectionLevel: 'H',
                margin: 1,
                width: size,
                height: size,
                color: {
                    //dark: "#000000",
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

    await p;


    const ctx = canvas.getContext("2d");

    const logo_size = size*0.37;
    const pos = ((size - logo_size) / 2);

    //ctx.save();
    //ctx.globalCompositeOperation = 'destination-out';
    //ctx.beginPath();
    //ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    //ctx.fillRect(pos, pos, logo_size, logo_size);
    //ctx.restore();

    const img = await loadImage(logo);

    ctx.clearRect(pos, pos, logo_size, logo_size);
    ctx.drawImage(img, pos, pos, logo_size, logo_size);

    //return canvas.toDataURL("image/png");
    /*const out = fs.createWriteStream(output);
    const stream = canvas.createPNGStream({resolution: 500});
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was created.'));*/

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(out, buffer);

    if(verbose)
        console.log(`out: ${out} size: ${size} logo_size: ${logo_size} pos: ${pos} data: ${data}`);
}

async function main() {
    const options = commandLineArgs(optionDefinitions);

    await genQRCode(options);
}

main();
