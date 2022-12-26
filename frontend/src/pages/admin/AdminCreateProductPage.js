// external imports
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import CreateProductPageComponent from "./adminPageComponents/CreateProductPageComponent";
import { uploadImagesApiRequest, uploadImagesCloudinaryApiRequest } from "./utils/utils";
import { newCategory, deleteCategory, saveAttributeToCategory } from "../../redux/actions/categoryActions";

const createProductApiRequest = async (formInputs) => {
    const { data } = await axios.post('/api/products/admin', { ...formInputs });
    return data;
};

export default function AdminCreateProductPage() {
    const { categories } = useSelector(state => state.getCategories);
    const reduxDispatch = useDispatch();

    return <CreateProductPageComponent createProductApiRequest={createProductApiRequest} uploadImagesApiRequest={uploadImagesApiRequest} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest} categories={categories} reduxDispatch={reduxDispatch} newCategory={newCategory} deleteCategory={deleteCategory} saveAttributeToCategory={saveAttributeToCategory} />;
};