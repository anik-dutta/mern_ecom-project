// external import
import axios from 'axios';

// internal import
import ProductsPageComponent from './adminPageComponents/ProductsPageComponent';

const fetchProducts = async (abctrl) => {
    const { data } = await axios.get('/api/products/admin', {
        signal: abctrl.signal
    });
    return data;
};

const deleteProduct = async (productId) => {
    const { data } = await axios.delete(`/api/products/admin/${productId}`);
    return data;
};

export default function AdminProductsPage() {
    return <ProductsPageComponent fetchProducts={fetchProducts} deleteProduct={deleteProduct} />;
}