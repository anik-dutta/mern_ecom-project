// external import
import axios from 'axios';

export const uploadImagesApiRequest = async (images, productId) => {
    const formData = new FormData();

    Array.from(images).forEach((image) => {
        formData.append('images', image);
    });

    const { data } = await axios.post(`/api/products/admin/upload?productId=${productId}`, formData);
    return data;
};

export const checkImage = (images, text = 'upload') => {
    let error = { length: '', size: '', type: '' };

    if (images.length > 3) {
        error.length = `Maximum 3 images can be ${text}ed at once. `;
        return { error };
    }

    for (let i = 0; i < images.length; i++) {
        let file = images[i];
        const imageSizeInBytes = 1048576;
        if (file.size > imageSizeInBytes) {
            error.size = `Can't ${text}. File size must be 1 MB at maximum. `;
            continue;
        }
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
            error.type = `Can't ${text}. File type must be jpg, jpeg or png.`;
            continue;
        }
    }
    return { error };
};

export const uploadImagesCloudinaryApiRequest = (images, productId, text = '') => {
    let data = { error: '' };
    if (text !== 'create') {
        data = checkImage(images);
    }
    if (text === 'create' || (!data.error.length && !data.error.size && !data.error.type)) {
        const url = process.env.REACT_APP_CLOUDINARY_URI;
        const formData = new FormData();

        for (let i = 0; i < images.length; i++) {
            let file = images[i];

            formData.append('file', file);
            formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);

            fetch(url, { method: 'POST', body: formData })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    axios.post(`/api/products/admin/upload?cloudinary=true&productId=${productId}`, data);
                });
        }
    }
    return data.error;
};