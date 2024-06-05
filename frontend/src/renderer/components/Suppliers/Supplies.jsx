import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteSuppliesAsync } from '../../redux/SupplySlice';
import { fetchMedicationsInventoryAsync } from '../../redux/MedicationSlice';

export default function Supplies() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    start: 0,
    end: 15,
    page: 1,
    step: 15,
  });

  const navigate = useNavigate();
  const [supplies, setSupplies] = useState([]);

  const [searchTerm, setSearchTerm] = useState({
    name: '',
    reference: '',
  });

  useEffect(() => {
    const fetchSupplies = async () => {
      const response = await axios
        .get('http://localhost:8080/api/supplies/details')
        .then((response) => {
          setSupplies(response.data);
        })
        .catch((error) => {
          console.log(error);
          window.electron.ipcRenderer.sendMessage('ipc-example', [
            'Error fetching Supplies data',
          ]);
        });
    };

    fetchSupplies();
  }, []);

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
            <h1>Fournitures</h1>
            <p className="breadcrumbs">
              <span>
                <Link to={'/'}>Accueil</Link>
              </span>
              <span>
                <i className="mdi mdi-chevron-right"></i>
              </span>
              Fournitures
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par Fournisage Nom"
              value={searchTerm.name}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, name: e.target.value })
              }
            />
             <input
              type="text"
              className="form-control"
              placeholder="Rechercher par Référence"
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
              <div
                className="card-body"
                style={{
                  boxShadow:
                    'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                  borderRadius: '10px',
                }}
              >
                <div className="table-responsive">
                  <table
                    id="responsive-data-table"
                    className="table"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    <thead>
                      <tr>
                        <th>Entreprise Nom</th>
                        <th>Référence</th>
                        <th>Quantité</th>
                        <th>Cout</th>
                        <th>Fourni à</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {supplies.length > 0 &&
                        supplies.slice(filter.start, filter.end)
                        .filter((data) => {
                            // Initialize variables to store the results of the search for name and reference
                            let matchName = true;
                            let matchReference = true;

                            // Check if searchTerm.name is not empty and the medication name includes the search term
                            if (searchTerm.name.trim() !== "") {
                              matchName = data.supplier.name
                                .toLowerCase()
                                .includes(searchTerm.name.toLowerCase());
                            }

                            // Check if searchTerm.reference is not empty and the medication reference includes the search term
                            if (searchTerm.reference.trim() !== "") {
                              matchReference = data.medication.reference
                                .toLowerCase()
                                .includes(searchTerm.reference.toLowerCase());
                            }

                            // Return true if either matchName or matchReference is true
                            return matchName && matchReference;
                          })
                          .map((data) => (
                            <tr key={data.supply.id}>
                              <td>{data.supplier.name}</td>
                              <td>{data.medication.reference}</td>
                              <td>{data.supply.quantity}</td>
                              <td>{data.supply.cost}</td>
                              <td>{getDate(data.supply.suppliedAt)}</td>
                              <td>
                                <Link
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      window.confirm(
                                        'Voulez-vous vraiment supprimer cette fournisseur ?',
                                      )
                                    ) {
                                      dispatch(deleteSuppliesAsync
                                        (data.supply.id),
                                      ).then(() => {
                                          dispatch(fetchMedicationsInventoryAsync());
                                          navigate('/inventaire');
                                      })
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
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignContent: 'center',
                      gap: '10px',
                    }}
                  >
                    {supplies.length > 0 && (
                      <nav aria-label="...">
                        <ul className="pagination">
                          <li className="page-item ">
                            <a
                              className="page-link"
                              style={{
                                color: filter.page === 1 ? 'gray' : '#34c997',
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                if (filter.page > 1) {
                                  setFilter({
                                    ...filter,
                                    start: filter.start - filter.step,
                                    end: filter.end - filter.step,
                                    page: filter.page - 1,
                                  });
                                }
                              }}
                            >
                              Précédent
                            </a>
                          </li>
                          <li className="page-item">
                            <a
                              className="page-link "
                              style={{
                                color:
                                  filter.page ===
                                  Math.ceil(supplies.length / filter.step)
                                    ? 'gray'
                                    : '#34c997',
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  filter.page <
                                  Math.ceil(supplies.length / filter.step)
                                ) {
                                  setFilter({
                                    ...filter,
                                    start: filter.start + filter.step,
                                    end: filter.end + filter.step,
                                    page: filter.page + 1,
                                  });
                                }
                              }}
                            >
                              Suivant
                            </a>
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
