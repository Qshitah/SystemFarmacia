import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteOrderAsync, fetchOrdersAsync } from "../../redux/OrderSlice";
import { fetchMedicationsInventoryAsync } from "../../redux/MedicationSlice";

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

  const [searchTerm, setSearchTerm] = useState({
    date: "",
  });

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
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="date"
                className="form-control"
                value={searchTerm.date}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, date: e.target.value })
                }
              />
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
                          <th>Total Amount</th>
                          <th>Statut</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>

                      </thead>

                      <tbody>
                        {orders.length > 0 &&
                          orders
                            .slice(filter.start, filter.end)
                            .filter((order) => {
                              if (searchTerm.date === "") {
                                return order;
                              } else if (
                                order.createdAt
                                  .toLowerCase()
                                  .includes(searchTerm.date.toLowerCase())
                              ) {
                                return order;
                              }
                            })
                            .map((order) => (
                              <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>
                                  {order.clientName === "" ? "-" : order.clientName}
                                  <br />
                                  <strong>{order.clientEmail}</strong>
                                </td>

                                <td>{order.clientPhone === "" ? "-" : order.clientPhone}</td>
                                <td>{order.totalAmount} Dh</td>
                                <td>
                                  <span
                                    className={`badge ${order.status.toUpperCase() === "CONFIRMED"
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
                                      <Link to={`/orders/${order.id}`} className="btn btn-primary" >
                                        Info
                                      </Link>
                                      <Link onClick={(e) => {
                                        e.preventDefault();
                                        if(window.confirm("Voulez-vous vraiment supprimer cette medication ?")){
                                          dispatch(deleteOrderAsync(order.id))
                                            .then(() => {
                                              dispatch(fetchMedicationsInventoryAsync());
                                            })
                                        };
                                      }} className="btn btn-danger" >
                                        Supprimer
                                      </Link>
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
                        (<nav aria-label="...">
                        <ul className="pagination">
                          <li className="page-item ">
                            <a className="page-link" style={{color: filter.page === 1 ? "gray" : "#34c997"}} onClick={(e) => {
                                e.preventDefault();
                                if(filter.page > 1){
                                  setFilter({
                                    ...filter,
                                    start:
                                      filter.start -
                                      filter.step ,
                                    end:
                                      filter.end -
                                      filter.step ,
                                    page: filter.page - 1,
                                  });
                                }
                               
                            }}>Précédent</a>
                          </li>
                          <li className="page-item">
                            <a className="page-link " style={{color: filter.page === Math.ceil(orders.length / filter.step) ? "gray" : "#34c997"}} onClick={(e) => {
                              e.preventDefault();
                              if(filter.page < Math.ceil(orders.length / filter.step) ){
                                setFilter({
                                  ...filter,
                                  start:
                                    filter.start +
                                    filter.step ,
                                  end:
                                    filter.end +
                                    filter.step ,
                                  page: filter.page + 1,
                                });
                              }
                              
                            }}>Suivant</a>
                          </li>
                        </ul>
                      </nav>
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
