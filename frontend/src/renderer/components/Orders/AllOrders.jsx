import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchOrdersAsync } from "../../redux/OrderSlice";

export default function AllOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    start: 0,
    end: 10,
    page: 1,
    step: 10,
  });
  const { orders, statusOrders, errorOrders } = useSelector(
    (state) => state.orders
  );

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
          <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
            <div>
              <h1>Nouvelles commandes</h1>
              <p className="breadcrumbs">
                <span>
                  <Link to={"/"}>Accueil</Link>
                </span>
                <span>
                  <i className="mdi mdi-chevron-right"></i>
                </span>
                Commandes
              </p>
            </div>

          </div>
          <div className="row">
            <div className="col-12">
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
                          <th>ID</th>
                          <th>Nom complet</th>
                          <th>Numéro de téléphone</th>
                          <th>Statut</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>

                      </thead>

                      <tbody>
                        {orders.length > 0 &&
                          orders
                            .slice(filter.start, filter.end)
                            .map((order) => (
                              <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>
                                  {order.fullName}
                                  <br />
                                  <strong>{order.email}</strong>
                                </td>

                                <td>{order.phoneNumber}</td>
                                <td>
                                  <span
                                    className={`badge ${order.status === "CONFIRM"
                                      ? "bg-success"
                                      : order.status === "WAIT"
                                        ? "bg-warning"
                                        : "bg-danger"
                                      }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{getDate(order.createdAt)}</td>

                                <td>
                                  <div className="btn-group mb-1">
                                    <button
                                      type="button"
                                      className="btn btn-outline-success"
                                      onClick={() => {
                                        navigate(`/orders/${order.orderId}`)
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
                                      <a className="dropdown-item" href="#">
                                        Track
                                      </a>
                                      <a className="dropdown-item" href="#">
                                        Cancel
                                      </a>
                                    </div>
                                  </div>
                                </td>
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
                      {orders.length > 0 &&
                        pagination(orders.length, filter.step).map(
                          (pagination) => (
                            <button
                              type="button"
                              className={
                                filter.page === pagination
                                  ? "btn btn-success"
                                  : "btn btn-outline-success"
                              }
                              key={pagination}
                              onClick={() => {
                                if (filter.page < pagination) {
                                  setFilter({
                                    ...filter,
                                    start:
                                      filter.start +
                                      filter.step * (pagination - filter.page),
                                    end:
                                      filter.end +
                                      filter.step * (pagination - filter.page),
                                    page: pagination,
                                  });
                                } else {
                                  setFilter({
                                    ...filter,
                                    start:
                                      filter.start -
                                      filter.step * (filter.page - pagination),
                                    end:
                                      filter.end -
                                      filter.step * (filter.page - pagination),
                                    page: pagination,
                                  });
                                }
                              }}
                            >
                              {pagination}
                            </button>
                          )
                        )}
                    </div>
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
