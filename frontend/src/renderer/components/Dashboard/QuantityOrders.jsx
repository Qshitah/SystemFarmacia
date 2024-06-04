import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  deleteProductAsync,
  fetchProductsAsync,
  updateProductAsync,
} from "../../../redux/ProductSlice";
import { useState } from "react";
import { fetchCategoriesAsync } from "../../../redux/CategorySlice";
import { Link } from "react-router-dom";

export default function Products() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    start: 0,
    end: 10,
    page: 1,
    step: 10,
  });
  const { products, statusProducts, errorProducts } = useSelector(
    (state) => state.products
  );
  const { categories, statusCategories, errorCategories } = useSelector(
    (state) => state.categories
  );

  const [searchTerm, setSearchTerm] = useState({
    name: "",
    reference: "",
  });

  const getCategoryName = (id) => {
    if (categories.length > 0 && id !== null) {
      const category = categories.find((c) => c.categoryId === id);
      return category.name;
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (statusProducts !== "succeeded") {
      dispatch(fetchProductsAsync());
    } else if (statusProducts === "failed") {
      console.log(errorProducts);
    }

    if (statusCategories !== "succeeded") {
      dispatch(fetchCategoriesAsync());
    } else if (statusCategories === "failed") {
      console.log(errorCategories);
    }

    if (statusProducts === "failed-deleteting") {
      alert(errorProducts);
    }
  }, [
    dispatch,
    errorProducts,
    statusProducts,
    statusCategories,
    errorCategories,
  ]);

  const getDate = (date) => {
    const createdAt = new Date(date);
    const month = createdAt.toLocaleString("default", { month: "long" });
    const day = createdAt.getDate();
    const year = createdAt.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <React.Fragment>

      <div className="col-xl-5">
        <div className="card card-default">
          <div className="card-body" style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px', borderRadius: '10px' }}>
            <div className="table-responsive">
              <table
                id="responsive-data-table"
                className="table"
                style={{ width: "100%", textAlign: "center" }}
              >
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Nom</th>
                    <th>Référence</th>
                    <th>Quantité</th>
                    <th>Catégorie</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length > 0 &&
                    products
                      .slice(filter.start, filter.end)
                      .sort((a, b) => {
                        return (
                          new Date(b.createdAt) - new Date(a.createdAt)
                        );
                      })
                      .filter((product) => product.quantity <= 5) // Filtrer les produits dont la quantité est inférieure à 5
                      .map((product) => (
                        <tr key={product.productId}>
                          <td>
                            <img
                              className="tbl-thumb"
                              style={{ width: "50px", height: "50px" }}
                              src={
                                product.images !== null
                                  ? `http://localhost:3000/uploads/${product.images[0]}`
                                  : "assets/img/products/p1.jpg"
                              }
                              alt="Product Image"
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.reference}</td>
                          <td
                            style={{
                              color:
                                product.quantity <= 5 ? "red" : "",
                            }}
                          >
                            {product.quantity}
                          </td>

                          <td>{getCategoryName(product.categoryId)}</td>


                        </tr>
                      ))}
                </tbody>
              </table>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignContent: "center",
                  gap: "10px",
                }}
              >

              </div>
            </div>
          </div>
        </div>
      </div>

    </React.Fragment>
  );
}
