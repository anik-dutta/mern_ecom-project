const imageValidate = (images) => {
    let imagesTable = [];
    if (Array.isArray(images)) {
        imagesTable = images;
    } else {
        imagesTable.push(images);
    }

    if (imagesTable.length > 3) {
        return { error: 'Maximum 3 images can be sent at once' };
    }
    const imageSizeInBytes = 1048576;
    for (let image of imagesTable) {
        if (image.size > imageSizeInBytes) {
            return { error: 'File larger than 1 MB' };
        }
        const filetypes = /jpg|jpeg|png/;
        const mimetype = filetypes.test(image.mimetype);
        if (!mimetype) {
            return { error: 'Image file should be of jpg, jpeg or png type' };
        }
    }
    return { error: false };
};
module.exports = imageValidate;