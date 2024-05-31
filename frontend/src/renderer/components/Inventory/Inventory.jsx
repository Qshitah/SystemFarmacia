import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import {  } from "../../redux/inventorylice";
import { fetchMedicationsInventoryAsync } from "../../redux/MedicationSlice";
export default function Inventory() {
    const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    start: 0,
    end: 15,
    page: 1,
    step: 15,
  });
  const { inventory, statusMedications, errorMedications } = useSelector(
    (state) => state.medications
  );

  const [searchTerm, setSearchTerm] = useState({
    name: "",
    reference: "",
  });

  useEffect(() => {
    if (statusMedications === "failed-inventory") {
      console.log(errorMedications);
    }else if (statusMedications !== "succeeded-inventory") {
        dispatch(fetchMedicationsInventoryAsync());
    }  
  }, [
    dispatch,
    errorMedications,
    statusMedications
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
              <h1>Inventory</h1>
              <p className="breadcrumbs">
                <span>
                  <Link to={"/"}>Accueil</Link>
                </span>
                <span>
                  <i className="mdi mdi-chevron-right"></i>
                </span>
                Inventory
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search By Name"
                value={searchTerm.name}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, name: e.target.value })
                }
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search By Reference"
                value={searchTerm.reference}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, reference: e.target.value })
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
                          <th>Nom</th>
                          <th>Référence</th>
                          <th>Quantité</th>
                        </tr>
                        
                      </thead>

                      <tbody>
                        {inventory.length > 0 &&
                          inventory
                            .slice(filter.start, filter.end)
                            .sort((a, b) => {
                              return (
                                new Date(b.data.createdAt) - new Date(a.data.createdAt)
                              );
                            })
                            .filter((medication) => {
                              // Initialize variables to store the results of the search for name and reference
                              let matchName = true;
                              let matchReference = true;

                              // Check if searchTerm.name is not empty and the medication name includes the search term
                              if (searchTerm.name.trim() !== "") {
                                matchName = medication.data.name
                                  .toLowerCase()
                                  .includes(searchTerm.name.toLowerCase());
                              }

                              // Check if searchTerm.reference is not empty and the medication reference includes the search term
                              if (searchTerm.reference.trim() !== "") {
                                matchReference = medication.data.reference
                                  .toLowerCase()
                                  .includes(searchTerm.reference.toLowerCase());
                              }

                              // Return true if either matchName or matchReference is true
                              return matchName && matchReference;
                            })
                            .map((medication) => (
                              <tr key={medication.data.id}>
                                <td>{medication.data.name}</td>
                                <td>{medication.data.reference}</td>
                                <td style={{color: medication.inventory.quantity <= 20? "red" : "green"}}>{medication.inventory.quantity}</td>
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
                      {inventory.length > 0 &&
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
                            <a className="page-link " style={{color: filter.page === Math.ceil(inventory.length / filter.step) ? "gray" : "#34c997"}} onClick={(e) => {
                              e.preventDefault();
                              if(filter.page < Math.ceil(inventory.length / filter.step) ){
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
