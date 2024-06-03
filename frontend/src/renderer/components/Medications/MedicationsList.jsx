import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteMedicationAsync, fetchMedicationsAsync } from "../../redux/MedicationSlice";

export default function MedicationsList() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    start: 0,
    end: 15,
    page: 1,
    step: 15,
  });
  const { medications, statusMedications, errorMedications } = useSelector(
    (state) => state.medications
  );

  const [searchTerm, setSearchTerm] = useState({
    name: "",
    reference: "",
  });

  useEffect(() => {
    if (statusMedications === "failed") {
      console.log(errorMedications);
    }else if (statusMedications !== "succeeded") {
        dispatch(fetchMedicationsAsync());
      }  
    else if (statusMedications === "failed-deleteting") {
      alert(errorMedications);
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
              <h1>Medication</h1>
              <p className="breadcrumbs">
                <span>
                  <Link to={"/"}>Accueil</Link>
                </span>
                <span>
                  <i className="mdi mdi-chevron-right"></i>
                </span>
                Medication
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
                          <th>Prix</th>
                          <th>Dosage</th>
                          <th>ExpiresAt</th>
                          <th>Créé à</th>
                          <th>Action</th>
                        </tr>
                        
                      </thead>

                      <tbody>
                        {medications.length > 0 &&
                          medications
                            .slice(filter.start, filter.end)
                            .filter((medication) => {
                              // Initialize variables to store the results of the search for name and reference
                              let matchName = true;
                              let matchReference = true;

                              // Check if searchTerm.name is not empty and the medication name includes the search term
                              if (searchTerm.name.trim() !== "") {
                                matchName = medication.name
                                  .toLowerCase()
                                  .includes(searchTerm.name.toLowerCase());
                              }

                              // Check if searchTerm.reference is not empty and the medication reference includes the search term
                              if (searchTerm.reference.trim() !== "") {
                                matchReference = medication.reference
                                  .toLowerCase()
                                  .includes(searchTerm.reference.toLowerCase());
                              }

                              // Return true if either matchName or matchReference is true
                              return matchName && matchReference;
                            })
                            .map((medication) => (
                              <tr key={medication.id}>
                                <td>{medication.name}</td>
                                <td>{medication.reference}</td>
                                <td>{medication.price}Dh</td>
                                <td>{medication.dosage}</td>
                                <td >{medication.expiresAt === null ? "-" : getDate(medication.expiresAt) }</td>
                                <td>
                                  {medication.createdAt === null
                                    ? getDate(new Date())
                                    : getDate(medication.createdAt)}
                                </td>
                                <td>
                                  <div className="btn-group mb-1">
                                      <Link to={`/medications/edit/${medication.id}`} className="btn btn-primary" >
                                        Modifier
                                      </Link>
                                      <Link onClick={(e) => {
                                        e.preventDefault();
                                        if(window.confirm("Voulez-vous vraiment supprimer cette medication ?")){
                                          dispatch(deleteMedicationAsync(medication.id));
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
                      {medications.length > 0 &&
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
                            <a className="page-link " style={{color: filter.page === Math.ceil(medications.length / filter.step) ? "gray" : "#34c997"}} onClick={(e) => {
                              e.preventDefault();
                              if(filter.page < Math.ceil(medications.length / filter.step) ){
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