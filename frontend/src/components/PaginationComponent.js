// external import
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function PaginationComponent({ categoryName, searchQuery, paginationLinksNumber, pageNum }) {
    const category = categoryName ? `category/${categoryName}/` : "";
    const search = searchQuery ? `search/${searchQuery}/` : "";
    const url = `/product-list/${category}${search}`;

    return (
        <Pagination className="mt-5"
        >
            <LinkContainer to={`${url}${pageNum - 1}`}>
                <Pagination.Prev disabled={pageNum === 1} />
            </LinkContainer>
            {[...Array(paginationLinksNumber).keys()].map((x) => (
                <LinkContainer key={x + 1} to={`${url}${x + 1}`}>
                    <Pagination.Item active={x + 1 === pageNum}>{x + 1}</Pagination.Item>
                </LinkContainer>
            ))}
            <LinkContainer to={`${url}${pageNum + 1}`}>
                <Pagination.Next disabled={pageNum === paginationLinksNumber} />
            </LinkContainer>
        </Pagination >
    );
};