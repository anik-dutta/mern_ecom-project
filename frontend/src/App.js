// * external imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// * internal imports
// components
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';

// user component
import RoutesWithUserChatComponent from './components/userComponents/RoutesWithUserChatComponent';

// publicly available pages
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductListPage from './pages/ProductListPage';
import RegisterPage from './pages/RegisterPage';

import ProtectedRoutesComponent from './components/ProtectedRoutesComponent';

// protected user pages
import UserCartDetailsPage from './pages/user/UserCartDetailsPage';
import UserOrderDetailsPage from './pages/user/UserOrderDetailsPage';
import UserOrdersPage from './pages/user/UserOrdersPage';
import UserProfilePage from './pages/user/UserProfilePage';

// protected admin pages
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminChatsPage from './pages/admin/AdminChatsPage';
import AdminCreateProductPage from './pages/admin/AdminCreateProductPage';
import AdminEditProductPage from './pages/admin/AdminEditProductPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminEditUsersPage from './pages/admin/AdminEditUsersPage';

// util component
import ScrollToTop from './components/utils/ScrollToTop';

export default function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<HeaderComponent />
			<Routes>
				<Route element={<RoutesWithUserChatComponent />}>
					{/* publicly available routes */}
					<Route path="/" element={<HomePage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/product-list" element={<ProductListPage />} />
					<Route path="/product-list/:pageNumParam" element={<ProductListPage />} />
					<Route path="/product-list/category/:categoryName" element={<ProductListPage />} />
					<Route path="/product-list/category/:categoryName/:pageNumParam" element={<ProductListPage />} />
					<Route path="/product-list/search/:searchQuery" element={<ProductListPage />} />
					<Route path="/product-list/search/:searchQuery/:pageNumParam" element={<ProductListPage />} />
					<Route path="/product-list/category/:categoryName/search/:searchQuery" element={<ProductListPage />} />
					<Route path="/product-list/category/:categoryName/search/:searchQuery/:pageNumParam" element={<ProductListPage />} />
					<Route path="/product-details/:id" element={<ProductDetailsPage />} />
					<Route path="/signup" element={<RegisterPage />} />
					{/* 404! Page not found */}
					<Route path="*" element="404! Page not found" />
				</Route>

				{/* protected user routes */}
				<Route element={<ProtectedRoutesComponent admin={false} />}>
					<Route path="/user" element={<UserProfilePage />} />
					<Route path="/user/my-orders" element={<UserOrdersPage />} />
					<Route path="/user/order-details/:id" element={<UserOrderDetailsPage />} />
					<Route path="/user/cart-details" element={<UserCartDetailsPage />} />
				</Route>

				{/* protected admin routes */}
				<Route element={<ProtectedRoutesComponent admin={true} />}>
					<Route path="/admin/users" element={<AdminUsersPage />} />
					<Route path="/admin/edit-user/:id" element={<AdminEditUsersPage />} />
					<Route path="/admin/products" element={<AdminProductsPage />} />
					<Route path="/admin/create-new-product" element={<AdminCreateProductPage />} />
					<Route path="/admin/edit-product/:id" element={<AdminEditProductPage />} />
					<Route path="/admin/orders" element={<AdminOrdersPage />} />
					<Route path="/admin/order-details/:id" element={<AdminOrderDetailsPage />} />
					<Route path="/admin/chats" element={<AdminChatsPage />} />
					<Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
				</Route>
			</Routes>
			<FooterComponent />
		</BrowserRouter>
	);
}