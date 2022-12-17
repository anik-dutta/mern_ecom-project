// external imports
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';

// internal imports
import EditProductPageComponent from "./adminPageComponents/EditProductPageComponent";
import { saveAttributeToCategory } from '../../redux/actions/categoryActions';
import { uploadImagesApiRequest, uploadImagesCloudinaryApiRequest } from "./utils/utils";

const fetchProduct = async (productId) => {
    const { data } = await axios.get(`/api/products/get-one/${productId}`);
    return data;
};

const updateProductApiRequest = async (productId, formInputs) => {
    const { data } = await axios.put(`/api/products/admin/${productId}`, { ...formInputs });
    return data;
};

const imageDeleteHandler = async (imagePath, productId) => {
    let encoded = encodeURIComponent(imagePath);
    if (process.env.NODE_ENV !== 'production') {
        await axios.delete(`/api/products/admin/image/${encoded}/${productId}`);
    } else {
        await axios.delete(`/api/products/admin/image/${encoded}/${productId}?cloudinary=true`);
    }
};

export default function AdminEditProductPage() {
    const { categories } = useSelector(state => state.getCategories);
    const reduxDispatch = useDispatch();

    return <EditProductPageComponent categories={categories} fetchProduct={fetchProduct} updateProductApiRequest={updateProductApiRequest} reduxDispatch={reduxDispatch} saveAttributeToCategory={saveAttributeToCategory} imageDeleteHandler={imageDeleteHandler} uploadImagesApiRequest={uploadImagesApiRequest} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest} />;
};