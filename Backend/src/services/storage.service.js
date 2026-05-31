const {ImageKit} = require("@imagekit/nodejs")

const ImageKitClient = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
})


async function uploadFile(file, fileNamePrefix = "music"){
    const result = await ImageKitClient.files.upload({
        file,
        fileName:fileNamePrefix+"_"+Date.now(),
        folder:"music_app"
    })
    return result;
}

module.exports = {uploadFile}
