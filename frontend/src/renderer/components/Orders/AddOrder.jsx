import React from "react";
import { Link, } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProductsAsync } from "../../../redux/ProductSlice";
import axios from "axios";
import { addOrderAsync } from "../../../redux/OrderMahalSlice";

function AddOrder() {
  const dispatch = useDispatch();
  const [error, setError] = useState({
    error: "",
    message: "",
  });

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [formData, setFormData] = useState([]);
  const [formDataOrder, setFormDataOrder] = useState({
    status: "CASH",
    priceDamana: 0,
    customerName: "",
    phoneNumber: "",
  });
  const { products, statusProducts, errorProducts } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (statusProducts !== "succeeded") {
      dispatch(fetchProductsAsync());
    } else if (statusProducts === "failed") {
      console.log(errorProducts);
    }

    if (statusProducts === "failed-deleteting") {
      alert(errorProducts);
    }
  }, [dispatch, errorProducts, statusProducts]);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return inputValue.length === 0
      ? []
      : products.filter((product) =>
        product.reference.toLowerCase().includes(inputValueLowerCase)
      );
  };

  // Function to render suggestions
  const renderSuggestion = (suggestion) => <div>
    <img
      className="tbl-thumb"
      style={{ width: "50px", height: "50px" }}
      src={
        suggestion.images !== null
          ? `http://localhost:3000/uploads/${suggestion.images[0]}`
          : "assets/img/products/p1.jpg"
      }
      alt="Product Image"
    />    {suggestion.reference}
  </div>;

  // Function to handle input change
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Function to handle suggestion selection
  const onSuggestionSelected = async (event, { suggestion }) => {
    // Check if the suggestion's ID already exists in selectedSuggestions
    const isDuplicate = selectedSuggestions.some((item) =>
      item.variant !== null
        ? false
        : item.product.productId === suggestion.productId
    );

    if (!isDuplicate) {
      // Add the suggestion to selectedSuggestions if it's not a duplicate
      const token = localStorage.getItem("accessToken");
      await axios
        .get(
          `http://localhost:8080/api/variants/product/${suggestion.productId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          }
        }
        )
        .then((response) => {
          setSelectedSuggestions([
            ...selectedSuggestions,
            {
              product: suggestion,
              variant: response.data,
            },
          ]);
          setFormData((prevState) => [
            ...prevState,
            {
              productId: suggestion.productId,
              quantity:
                response.data[
                  formData.filter((v) => v.productId === suggestion.productId)
                    .length
                ].quantityVariant,
              price: suggestion.price,
              variantId:
                response.data[
                  formData.filter((v) => v.productId === suggestion.productId)
                    .length
                ].variantId,
            },
          ]);
        })
        .catch(() => {
          setSelectedSuggestions([
            ...selectedSuggestions,
            {
              product: suggestion,
              variant: null,
            },
          ]);
          setFormData((prevState) => [
            ...prevState,
            {
              productId: suggestion.productId,
              quantity: 1,
              price: suggestion.price,
              variantId: null,
            },
          ]);
        });
    }

    // Clear the input value
    setValue("");
  };
  // Autosuggest input properties
  const inputProps = {
    placeholder: "Type a reference of product",
    value,
    onChange: onChange,
  };

  const calculateSubTotal = (array, productId, i) => {
    const filteredArray = array.find(
      (item, index) => item.productId === productId && index === i
    );
    return filteredArray ? filteredArray.quantity * filteredArray.price : 0;
  };

  const calculateTotal = (array) => {
    return array.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getStock = (select, i) => {
    return select.variant === null
      ? select.product.quantity
      : select.variant.find((item) => item.variantId === formData[i].variantId)
        .quantityVariant;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError({
      error: "",
      message: "",
    });

    if (formDataOrder.priceDamana < 0 || isNaN(formDataOrder.priceDamana)) {
      return setError({
        error: "priceDamana",
        message: "Please verify price damana",
      });
    }

    if (formData.length === 0) {
      return setError({
        error: "products",
        message: "Please add products",
      });
    } else {
      if (formData.map((v) => v.quantity).includes(0)) {
        return setError({
          error: "quantity",
          message: "Please verify quantity",
        });
      }

      if (formData.map((v) => v.price).includes(0)) {
        return setError({
          error: "price",
          message: "Please verify price",
        });
      }

      dispatch(addOrderAsync(formDataOrder))
        .then(async (responseData) => {
          const data = formData.map(v => {
            return {
              orderId: responseData.payload.orderId,
              productId: v.productId,
              variantId: v.variantId,
              quantityOrder: v.quantity,
              pricePerUnit: v.price
            }
          })
          const token = localStorage.getItem("accessToken");
          await axios.post("http://localhost:8080/api/orderMahalProducts/multiple", data, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            }
          })
            .then(() => {
              window.location.href = "/ordersMahal"
            }).catch((error) => {
              console.log(error)
            })
        }).catch((error) => {
          console.log(error)
        })

    }
  };

  return (
    <>
      <React.Fragment>
        <div className="ec-content-wrapper">
          <div className="content">
            <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
              <div>
                <h1>Ajouter une nouvelle commande</h1>
                <p className="breadcrumbs">
                  <span>
                    <Link to={"/"}>Accueil</Link>
                  </span>
                  <span>
                    <i className="mdi mdi-chevron-right"></i>
                  </span>
                  Ajouter une commande
                </p>
              </div>

            </div>
            {statusProducts === "succeeded" && (
              <div className="ec-cat-form">
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className="form-row">
                    <div className="form-group col-md-4 ">
                      <label htmlFor="customer_name">
                        Nom du client <span>(Facultatif)</span>
                      </label>
                      <input
                        type="text"
                        id="customer_name"
                        className="form-control "
                        value={formDataOrder.customerName}
                        onChange={(event) =>
                          setFormDataOrder({
                            ...formDataOrder,
                            customerName: event.target.value,
                          })
                        }
                      />
                      {error.error === "customerName" && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          {error.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-4 ">
                      <label htmlFor="phone_number">
                        Numéro de téléphone <span>(Facultatif)</span>
                      </label>
                      <input
                        type="text"
                        id="phone_number"
                        className="form-control "
                        value={formDataOrder.phoneNumber}
                        onChange={(event) =>
                          setFormDataOrder({
                            ...formDataOrder,
                            phoneNumber: event.target.value,
                          })
                        }
                      />
                      {error.error === "phoneNumber" && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          {error.message}
                        </div>
                      )}
                    </div>

                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="productName"
                      className="col-12 col-form-label"
                    >
                      Nom du produit
                    </label>
                    <div className="col-12">
                      <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={({ value }) =>
                          setSuggestions(getSuggestions(value))
                        }
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        getSuggestionValue={(suggestion) => suggestion.name}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        onSuggestionSelected={onSuggestionSelected}
                      />
                    </div>
                    {error.error === "products" && (
                      <div
                        className="invalid-feedback"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                        }}
                      >
                        {error.message}
                      </div>
                    )}
                    {error.error === "quantity" && (
                      <div
                        className="invalid-feedback"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                        }}
                      >
                        {error.message}
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="card card-default">
                        <div className="card-body">
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
                                  <th>Quantité</th>
                                  <th>Prix</th>
                                  <th>Variante</th>
                                  <th>Stock</th>
                                  <th>Coût total (Dh)</th>
                                  <th>Action</th>
                                </tr>

                              </thead>

                              <tbody>
                                {selectedSuggestions.length > 0 &&
                                  selectedSuggestions.map((select, i) => (
                                    <tr key={i} id={i}>
                                      <td>
                                        <img
                                          className="tbl-thumb"
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                          }}
                                          src={
                                            select.product.images !== null
                                              ? `http://localhost:3000/uploads/${select.product.images[0]}`
                                              : "assets/img/products/p1.jpg"
                                          }
                                          alt="Product Image"
                                        />
                                      </td>
                                      <td>
                                        {select.product.name} <br />{" "}
                                        <span>{select.product.reference}</span>
                                      </td>
                                      <td style={{ width: "15%" }}>
                                        <input
                                          type="number"
                                          className="form-control"
                                          value={formData[i].quantity}
                                          onChange={(e) => {
                                            setFormData((prev) =>
                                              prev.map((item, index) => {
                                                if (
                                                  item.productId ===
                                                  select.product.productId &&
                                                  index === i
                                                ) {
                                                  if (select.variant === null) {
                                                    if (
                                                      select.product
                                                        .quantity === 0
                                                    ) {
                                                      return {
                                                        ...item,
                                                        quantity: 0,
                                                      };
                                                    } else if (
                                                      e.target.value >
                                                      select.product.quantity
                                                    ) {
                                                      return item;
                                                    } else {
                                                      return {
                                                        ...item,
                                                        quantity:
                                                          parseInt(
                                                            e.target.value
                                                          ) <= 0
                                                            ? 1
                                                            : parseInt(
                                                              e.target.value
                                                            ),
                                                      };
                                                    }
                                                  } else {
                                                    if (
                                                      getStock(select, i) === 0
                                                    ) {
                                                      return {
                                                        ...item,
                                                        quantity: 0,
                                                      };
                                                    } else if (
                                                      e.target.value >
                                                      getStock(select, i)
                                                    ) {
                                                      return item;
                                                    } else {
                                                      return {
                                                        ...item,
                                                        quantity:
                                                          parseInt(
                                                            e.target.value
                                                          ) <= 0
                                                            ? 1
                                                            : parseInt(
                                                              e.target.value
                                                            ),
                                                      };
                                                    }
                                                  }
                                                }
                                                return item;
                                              })
                                            );
                                          }}
                                          step={1}
                                        />
                                      </td>
                                      <td style={{ width: "15%" }}>
                                        <input
                                          type="number"
                                          className="form-control "
                                          placeholder={select.product.price}
                                          value={
                                            formData.filter(
                                              (item, index) =>
                                                item.productId ===
                                                select.product.productId &&
                                                index === i
                                            )[0].price
                                          }
                                          onChange={(e) => {
                                            setFormData((prev) =>
                                              prev.map((item, index) => {
                                                if (
                                                  item.productId ===
                                                  select.product.productId &&
                                                  index === i
                                                ) {
                                                  return {
                                                    ...item,
                                                    price: e.target.value,
                                                  };
                                                }
                                                return item;
                                              })
                                            );
                                          }}
                                          min={1}
                                        />
                                      </td>

                                      <td>
                                        {select.variant === null ? (
                                          "-"
                                        ) : (
                                          <select
                                            className="form-control"
                                            value={formData[i].variantId}
                                            onChange={(e) => {
                                              setFormData((prev) =>
                                                prev.map((item, index) => {
                                                  if (
                                                    item.productId ===
                                                    select.product
                                                      .productId &&
                                                    index === i
                                                  ) {
                                                    return {
                                                      ...item,
                                                      variantId: parseInt(
                                                        e.target.value
                                                      ),
                                                      quantity: 0,
                                                    };
                                                  }
                                                  return item;
                                                })
                                              );
                                            }}
                                          >
                                            {select.variant.sort((a, b) => a.size - b.size).map((variant) => (
                                              <option
                                                key={variant.variantId}
                                                value={variant.variantId}
                                                disabled={
                                                  formData.filter(
                                                    (v) =>
                                                      v.variantId ===
                                                      variant.variantId
                                                  ).length > 0
                                                }
                                              >
                                                {variant.color} -{" "}
                                                {variant.size !== null
                                                  ? variant.size
                                                  : "-"}
                                              </option>
                                            ))}
                                          </select>
                                        )}
                                      </td>
                                      <td>
                                        <p
                                          style={{
                                            color:
                                              getStock(select, i) <= 10
                                                ? "red"
                                                : "",
                                          }}
                                        >
                                          {getStock(select, i)}
                                        </p>
                                      </td>
                                      <td>
                                        {calculateSubTotal(
                                          formData,
                                          select.product.productId,
                                          i
                                        )}
                                      </td>
                                      <td>
                                        <div className="btn-group mb-1">
                                          <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => {
                                              setSelectedSuggestions((prev) =>
                                                prev.filter(
                                                  (item, index) => index !== i
                                                )
                                              );
                                              setFormData((prev) =>
                                                prev.filter(
                                                  (item, index) => index !== i
                                                )
                                              );
                                            }}
                                          >
                                            Supprimer
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}

                                <tr>
                                  <td colSpan="6"></td>
                                  <td className="text-right">
                                    <strong>Total</strong>
                                  </td>
                                  <td className="text-right">
                                    <strong>
                                      {calculateTotal(formData)} Dh
                                    </strong>
                                  </td>
                                </tr>

                                <tr>
                                  <td colSpan="6"></td>
                                  <td className="text-right">
                                    <strong>Statut de paiement</strong>
                                  </td>
                                  <td
                                    className="text-right"
                                    style={{ width: "15%" }}
                                  >
                                    <select
                                      className="form-control"
                                      name="status"
                                      onChange={(e) => {
                                        setFormDataOrder((prev) => ({
                                          ...prev,
                                          status: e.target.value,
                                        }));
                                      }}
                                    >
                                      <option value="CASH">Cash</option>
                                      <option value="KRIDI">KRIDI</option>
                                      <option value="AARBON">Aarbon</option>
                                      <option value="AMANA">Amana</option>
                                    </select>
                                  </td>
                                </tr>
                                {(formDataOrder.status === "KRIDI" ||
                                  formDataOrder.status === "AARBON") && (
                                    <>
                                      <tr>
                                        <td colSpan="6"></td>
                                        <td className="text-right">
                                          <strong>Prix Damana</strong>
                                        </td>
                                        <td
                                          className="text-right"
                                          style={{ width: "15%" }}
                                        >
                                          <strong>
                                            <input
                                              type="number"
                                              className="form-control"
                                              value={formDataOrder.priceDamana}
                                              name="priceDamana"
                                              min={0}
                                              onChange={(e) => {
                                                setFormDataOrder((prev) => ({
                                                  ...prev,
                                                  priceDamana:
                                                    e.target.value < 0 ||
                                                      parseFloat(e.target.value) >
                                                      calculateTotal(formData)
                                                      ? 0
                                                      : e.target.value,
                                                }));
                                              }}
                                            />
                                            {error.error === "priceDamana" && (
                                              <div
                                                className="invalid-feedback"
                                                style={{
                                                  display: "block",
                                                  marginBottom: "10px",
                                                }}
                                              >
                                                {error.message}
                                              </div>
                                            )}
                                          </strong>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td colSpan="6"></td>
                                        <td className="text-right">
                                          <strong>Pertes</strong>
                                        </td>
                                        <td className="text-right">
                                          <strong style={{ color: "red" }}>
                                            {calculateTotal(formData) -
                                              formDataOrder.priceDamana}{" "}
                                            Dh
                                          </strong>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-md-12"
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "25px",
                      gap: "15px",
                    }}
                  >
                    <button type="submit" className="btn btn-primary">
                      Soumettre
                    </button>

                    <button type="cancel" className="btn btn-danger">
                      Annuler
                    </button>

                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    </>
  );
}

export default AddOrder;
