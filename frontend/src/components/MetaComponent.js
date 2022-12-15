// internal import
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function MetaComponent({ title = 'A2Z', description = 'Your one stop online shop ' }) {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content="{description}" />
            </Helmet>
        </HelmetProvider>
    );
}