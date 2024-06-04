import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchOrdersAsync } from "../../../redux/OrderSlice";

export default function AllOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    start: 0,
    end: 3, // Afficher seulement les 3 dernières commandes
    page: 1,
    step: 3, // Nombre de commandes à afficher par page
  });
  const { orders, statusOrders, errorOrders } = useSelector(
    (state) => state.orders
  );

  const [totalPrices, setTotalPrices] = useState({});

  const calculateTotal = async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:8080/api/orderMahalProducts/order/${orderId}/totalPrice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.totalPrice;
    } catch (error) {
      console.error("Error calculating total price:", error);
      return 0; // Return 0 if there's an error
    }
  };

  useEffect(() => {
    // Fetch total prices for all orders
    const fetchTotalPrices = async () => {
      const prices = {};
      for (const order of orders) {
        const totalPrice = await calculateTotal(order.orderId);
        prices[order.orderId] = totalPrice;
      }
      setTotalPrices(prices);
    };

    fetchTotalPrices();
  }, [orders]);

  useEffect(() => {
    if (statusOrders !== "succeeded") {
      dispatch(fetchOrdersAsync());
    } else if (statusOrders === "failed") {
      console.log(errorOrders);
    }

    if (statusOrders === "failed-deleting") {
      alert(errorOrders);
    }
  }, [dispatch, errorOrders, statusOrders]);

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

  const pagination = (items, pagination) => {
    const array = [];
    for (let index = 0; index < Math.ceil(items / pagination); index++) {
      array.push(index + 1);
    }
    return array;
  };

  return (
    <React.Fragment>
      <div className="ec-content-wrapper">
        <div className="content">

          <div className="row">
            <div className="col-12">
              <div className="card card-default">
                <div className="card-body" style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px', borderRadius: '10px' }}>
                  <div className="card-header justify-content-between">
                    <h2>Commandes récentes Site</h2>
                  </div>
                  <div className="table-responsive">
                    <table
                      id="responsive-data-table"
                      className="table"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nom complet</th>
                          <th>Date</th>
                          <th>Statut</th>
                          <th>Pertes</th>
                          <th>Prix Damana</th>
                          <th>Prix total</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orders.slice(-3)
                        .sort((a, b) => {
                          return new Date(b.created_at) - new Date(a.created_at);
                        }).map((order) => (
                          <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>
                              {order.customerName
                                ? order.customerName
                                : "-"}
                              <br />
                            </td>

                            <td>{getDate(order.orderDate)}</td>
                            <td>
                              <span
                                className={`badge ${order.status === "CASH"
                                    ? "bg-success"
                                    : order.status === "KRIDI"
                                      ? "bg-warning"
                                      : order.status === "AARBON"
                                        ? "bg-info"
                                        : "bg-danger"
                                  }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td
                              style={{
                                color:
                                  order.status === "CASH" ? "green" : "red",
                              }}
                            >
                              {order.status === "CASH" ||
                                order.status === "RETURNED"
                                ? "-"
                                : totalPrices[order.orderId] -
                                order.priceDamana}
                            </td>
                            <td style={{ color: "green" }}>
                              {order.status === "CASH" ||
                                order.status === "RETURNED"
                                ? "-"
                                : order.priceDamana}
                            </td>
                            <td style={{ color: order.status === "RETURNED" ? "red" : "black" }}>{totalPrices[order.orderId]}</td>

                            <td>
                              <div className="btn-group mb-1">
                                <button
                                  type="button"
                                  className="btn btn-outline-success"
                                  onClick={() => {
                                    navigate(
                                      `/ordersMahal/${order.orderId}`
                                    );
                                  }}
                                >
                                  Info
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-success dropdown-toggle dropdown-toggle-split"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  data-display="static"
                                >
                                  <span className="sr-only">Info</span>
                                </button>

                                <div className="dropdown-menu">
                                  <a
                                    className="dropdown-item"
                                    style={{
                                      cursor: "pointer",
                                      color: "orange",
                                    }}
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      if (
                                        window.confirm(
                                          "Are you sure you want to return this order?"
                                        )
                                      ) {
                                        const token = localStorage.getItem("accessToken");
                                        await axios
                                          .put(
                                            "http://localhost:8080/api/orderMahalProducts/order/" +
                                            order.orderId +
                                            "/return",
                                            {},
                                            {
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                              },
                                            }
                                          )
                                          .then(() => {
                                            window.location.reload();
                                          })
                                          .catch((error) => {
                                            console.log(error);
                                          });
                                      }
                                    }}
                                  >
                                    Retour
                                  </a>
                                  <a
                                    className="dropdown-item"
                                    style={{
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      if (
                                        window.confirm(
                                          "Are you sure you want to delete this order?"
                                        )
                                      ) {
                                        const token = localStorage.getItem("accessToken");
                                        await axios
                                          .delete(
                                            "http://localhost:8080/api/orderMahalProducts/order/" +
                                            order.orderId,
                                            {
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                              },
                                            }
                                          )
                                          .then(() => {
                                            {
                                              window.location.reload();
                                            }
                                          })
                                          .catch((error) => {
                                            console.log(error);
                                          });
                                      }
                                    }}
                                  >
                                    Supprimer
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
