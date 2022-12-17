// external import
import { useSelector } from 'react-redux';
import axios from 'axios';

// internal import
import HomePageComponent from './pageComponents/HomePageComponent';

const getBestsellers = async () => {
    const { data } = await axios.get('/api/products/bestsellers');
    return data;
};

export default function HomePage() {
    const { categories } = useSelector((state) => state.getCategories);

    return <HomePageComponent categories={categories} getBestsellers={getBestsellers} />;
}