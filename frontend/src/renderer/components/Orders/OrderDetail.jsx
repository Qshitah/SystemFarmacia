import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [productsDetail, setProductsDetail] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const orderRes = await axios.get(
          `http://localhost:8080/api/orders/${id}`
        );
        setOrder(orderRes.data);

        const orderProductsRes = await axios.get(
          `http://localhost:8080/api/orderItems/order/${id}`
        
        );
        setOrderProducts(orderProductsRes.data);

        const productDetails = await Promise.all(
          orderProductsRes.data.map(async (order) => {
            return getProduct(order.medicationId);
          })
        );
        setProductsDetail(productDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
        setOrder(null);
        setOrderProducts([]);
        setProductsDetail([]);
      }
    }

    fetchData();
  }, [id]);

  const getDate = (date) => {
    const createdAt = new Date(date);
    const month = createdAt.toLocaleString("default", { month: "long" });
    const day = createdAt.getDate();
    const year = createdAt.getFullYear();
    const hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();

    // Ajout des zéros devant les chiffres si nécessaire
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");

    return `${month} ${day}, ${year} ${paddedHours}:${paddedMinutes}`;
  };

  const getProduct = async (productId) => {
    try {
        const productRes = await axios.get(
          `http://localhost:8080/api/medications/${productId}`
        );
        return productRes.data;
      
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  const calculateTotal = (array) => {
    return array.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  return (
    <React.Fragment>
      <div className="ec-content-wrapper">
        <div className="content">
          <div className="breadcrumb-wrapper breadcrumb-wrapper-2">
            <h1>Détail de la commande</h1>
            <p className="breadcrumbs">
              <span>
                <a href="index.html">Accueil</a>
              </span>
              <span>
                <i className="mdi mdi-chevron-right"></i>
              </span>
              Commandes
            </p>
          </div>

          {order && (
            <div className="row">
              <div className="col-12">
                <div className="ec-odr-dtl card card-default">
                  <div className="card-header card-header-border-bottom d-flex justify-content-between">
                    <h2 className="ec-odr">
                      Détail de la commande
                      <br />
                      <span className="small">
                        Commande ID: #00{order.id}
                      </span>
                    </h2>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-xl-3 col-lg-6">
                        <address className="info-grid">
                          <div className="info-title">
                            <strong>Client:</strong>
                          </div>
                          <br />
                          <div className="info-content">
                            {order.clientName}
                            <br />
                            {order.clientEmail}
                            <br />
                            {order.clientPhone}
                          </div>
                        </address>
                      </div>
                      <div className="col-xl-3 col-lg-6">
                        <address className="info-grid">
                          <div className="info-title">
                            <strong>Plus d'informations:</strong>
                          </div>
                          <br />
                          <div className="info-content">
                            Status: {order.status}
                            <br />
                          </div>
                        </address>
                      </div>
                      <div className="col-xl-3 col-lg-6">
                        <address className="info-grid">
                          <div className="info-title">
                            <strong>Commande Date:</strong>
                          </div>
                          <br />
                          <div className="info-content">
                          {getDate(order.createdAt)}
                          </div>
                        </address>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <h3 className="tbl-title">Résumé du produit</h3>
                        <div className="table-responsive">
                          <table
                            className="table table-striped o-tbl"
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            <thead>
                              <tr className="line">
                                <td>
                                  <strong>#</strong>
                                </td>
                                <td className="text-center">
                                  <strong>Medication</strong>
                                </td>
                                <td className="text-center">
                                  <strong>PRIX/UNITÉ</strong>
                                </td>
                                <td className="text-center">
                                  <strong>QUANTITÉ</strong>
                                </td>
                                <td className="text-center">
                                  <strong>SOUS-TOTAL</strong>
                                </td>

                              </tr>
                            </thead>
                            <tbody>
                              {orderProducts.length > 0 &&
                                productsDetail.length > 0 &&
                                orderProducts.map((orderProduct, index) => (
                                  <tr key={orderProduct.medicationId}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <strong>
                                        {productsDetail[index].reference}
                                      </strong>
                                    </td>
                                    <td className="text-center">
                                      {orderProduct.price} Dh
                                    </td>
                                    <td className="text-center">
                                      {orderProduct.quantity}
                                    </td>
                                    <td className="text-center">
                                      {orderProduct.price *
                                        orderProduct.quantity}{" "}
                                      Dh
                                    </td>
                                  </tr>
                                ))}
                              <tr>
                                <td colSpan="3"></td>
                                <td className="text-right">
                                  <strong>Total</strong>
                                </td>
                                <td className="text-right">
                                  <strong>
                                    {calculateTotal(orderProducts)} Dh
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="3"></td>
                                <td className="text-right">
                                  <strong>Status</strong>
                                </td>
                                <td className="text-right">
                                  <strong>{order.status}</strong>
                                </td>
                              </tr>


                              <tr></tr>
                            </tbody>
                          </table>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}