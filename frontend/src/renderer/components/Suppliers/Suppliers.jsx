import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import {  } from "../../redux/inventorylice";
import { deleteSupplierAsync, fetchSuppliersAsync } from "../../redux/SupplierSlice";

export default function Suppliers() {
    const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    start: 0,
    end: 15,
    page: 1,
    step: 15,
  });
  const { Suppliers, statusSuppliers, errorSuppliers } = useSelector(
    (state) => state.suppliers
  );

  const [searchTerm, setSearchTerm] = useState({
    name: "",
  });

  useEffect(() => {
    if (statusSuppliers === "failed") {
      console.log(errorSuppliers);
    }else if (statusSuppliers !== "succeeded") {
        dispatch(fetchSuppliersAsync());
    }  
  }, [
    dispatch,
    errorSuppliers,
    statusSuppliers
  ]);


  const getDate = (date) => {
    const createdAt = new Date(date);

    const month = createdAt.toLocaleString("default", { month: "long" });
    const day = createdAt.getDate();
    const year = createdAt.getFullYear();

    return `${month} ${day}, ${year}`;
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
            <h1>Fournisseurs</h1>
            <p className="breadcrumbs">
              <span>
                <Link to={"/"}>Accueil</Link>
              </span>
              <span>
                <i className="mdi mdi-chevron-right"></i>
              </span>
              Fournisseurs
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom de fournisseur"
              value={searchTerm.name}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, name: e.target.value })
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
                        <th>Entreprise Nom</th>
                        <th>Contact Nom</th>
                        <th>Contact Email</th>
                        <th>Contact Telephone</th>
                        <th>Créé à</th>
                        <th>Action</th>
                      </tr>
                      
                    </thead>

                    <tbody>
                      {Suppliers.length > 0 &&
                        Suppliers
                          .slice(filter.start, filter.end)
                          .filter((supplier) => {
                            // Initialize variables to store the results of the search for name and reference
                            let matchName = true;
                            let matchReference = true;

                            // Check if searchTerm.name is not empty and the supplier name includes the search term
                            if (searchTerm.name.trim() !== "") {
                              matchName = supplier.name
                                .toLowerCase()
                                .includes(searchTerm.name.toLowerCase());
                            }

                            // Return true if either matchName or matchReference is true
                            return matchName ;
                          })
                          .map((supplier) => (
                            <tr key={supplier.id}>
                              <td>{supplier.name}</td>
                              <td>{supplier.contactName}</td>
                              <td>{supplier.contactEmail}</td>
                              <td>{supplier.contactPhone}</td>
                              <td>{getDate(supplier.createdAt)}</td>
                              <td>
                                <Link
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if(window.confirm("Voulez-vous vraiment supprimer cette fournisseur ?")){
                                        dispatch(deleteSupplierAsync(supplier.id));
                                    }
                                  }}
                                  className="btn btn-primary"
                                >
                                  Supprimer
                                </Link>
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
                    {Suppliers.length > 0 &&
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
                          <a className="page-link " style={{color: filter.page === Math.ceil(Suppliers.length / filter.step) ? "gray" : "#34c997"}} onClick={(e) => {
                            e.preventDefault();
                            if(filter.page < Math.ceil(Suppliers.length / filter.step) ){
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
  )
}
