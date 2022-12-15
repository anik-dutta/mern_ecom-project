// external imports
import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from 'react-redux';

export default function CategoryFilterComponent({ setCategoriesFromFilter }) {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const { categories } = useSelector(state => state.getCategories);

    const myRefs = useRef([]);

    const selectCategory = (e, category, idx) => {
        setCategoriesFromFilter((items) => {
            return { ...items, [category.name]: e.target.checked };
        });

        let selectedMainCategory = category.name.split("/")[0];
        let allCategories = myRefs.current.map((_, id) => {
            return { name: categories[id].name, idx: id };
        });
        let indexesOfMainCategory = allCategories.reduce((acc, item) => {
            let cat = item.name.split("/")[0];
            if (selectedMainCategory === cat) {
                acc.push(item.idx);
            }
            return acc;
        }, []);

        if (e.target.checked) {
            setSelectedCategories((oldCategories) => [...oldCategories, "cat"]);
            myRefs.current.map((_, idx) => {
                if (!indexesOfMainCategory.includes(idx)) {
                    myRefs.current[idx].disabled = true;
                }
                return "";
            });
        } else {
            setSelectedCategories((oldCategories) => {
                let a = [...oldCategories];
                a.pop();
                if (a.length === 0) {
                    window.location.href = "/product-list";
                }
                return a;
            });
            myRefs.current.map((_, idx2) => {
                if (allCategories.length === 1) {
                    if (idx2 !== idx) {
                        myRefs.current[idx2].disabled = false;
                    }
                } else if (selectedCategories.length === 1) {
                    myRefs.current[idx2].disabled = false;
                }
                return "";
            });
        }
    };

    return (
        <>
            <span className="fw-bold">Category</span>
            <Form className="mt-2">
                {categories.map((category, idx) => (
                    <div key={idx}>
                        <Form.Check type="checkbox" id={`check-api2-${idx}`} >
                            <Form.Check.Input ref={ele => (myRefs.current[idx] = ele)} type="checkbox" isValid onChange={e => selectCategory(e, category, idx)} />
                            <Form.Check.Label style={{ cursor: "pointer" }}>{category.name}</Form.Check.Label>
                        </Form.Check>
                    </div>
                ))}
            </Form>
        </>
    );
};