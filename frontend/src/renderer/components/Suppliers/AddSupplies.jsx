import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import { fetchMedicationsAsync } from '../../redux/MedicationSlice';
import { Link, useNavigate } from 'react-router-dom';
import {
  addSupplierAsync,
  fetchSuppliersAsync,
} from '../../redux/SupplierSlice';
import axios from 'axios';
import { addMultipleSuppliesAsync } from '../../redux/SupplySlice';

export default function AddSupplies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState({
    error: '',
    message: '',
  });

  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [formData, setFormData] = useState([]);
  const [selectSuppliers, setSelectSuppliers] = useState('');
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const { medications, statusMedications, errorMedications } = useSelector(
    (state) => state.medications,
  );

  const { Suppliers, statusSuppliers, errorSuppliers } = useSelector(
    (state) => state.suppliers,
  );

  useEffect(() => {
    if (statusMedications !== 'succeeded') {
      dispatch(fetchMedicationsAsync());
    } else if (statusMedications === 'failed') {
      console.log(errorMedications);
    }

    if (statusMedications === 'failed-deleteting') {
      alert(errorMedications);
    }
  }, [dispatch, errorMedications, statusMedications]);

  useEffect(() => {
    if (statusSuppliers !== 'succeeded') {
      dispatch(fetchSuppliersAsync());
    } else if (statusSuppliers === 'failed') {
      console.log(errorSuppliers);
    }
  }, [dispatch, errorSuppliers, statusSuppliers]);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return inputValue.length === 0
      ? []
      : medications.filter((medication) =>
          medication.reference.toLowerCase().includes(inputValueLowerCase),
        );
  };

  // Function to render suggestions
  const renderSuggestion = (suggestion) => <div>{suggestion.reference}</div>;

  // Function to handle input change
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Function to handle suggestion selection
  const onSuggestionSelected = async (event, { suggestion }) => {
    setSelectedSuggestions([...selectedSuggestions, suggestion]);
    setFormData((prevState) => [
      ...prevState,
      {
        medicationId: suggestion.id,
        quantity: 1,
        cost: 0,
      },
    ]);
    // Clear the input value
    setValue('');
  };
  // Autosuggest input properties
  const inputProps = {
    placeholder: 'Type a reference of product',
    value,
    onChange: onChange,
  };

  const submitSupplies =  (supplierId) => {
    const data = formData.map((supply) => {
      return {
        medicationId: supply.medicationId,
        supplierId: supplierId,
        quantity: parseInt(supply.quantity),
        cost: parseFloat(supply.cost),
      };
    });

    dispatch(addMultipleSuppliesAsync(data))
        .then(() => {
            navigate('/medications')
        })
        .catch((error) => {
            setError({
                name: 'supply',
                message: 'Error adding supplies',
            })
        });
}

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.length === 0) {
      return setError({
        name: 'supply',
        message: 'Please add at least one supply',
      });
    }

    if (supplierInfo.name === '') {
      return setError({
        name: 'name',
        message: 'Please enter name of a supplier',
      });
    }

    formData.map((supply, index) => {
      if (supply.quantity <= 0) {
        return setError({
          name: 'supply',
          message: 'Quantity must be greater than 0',
        });
      }

      if (supply.cost <= 0) {
        return setError({
          name: 'supply',
          message: 'Cost must be greater than 0',
        });
      }

      if (supply.cost > selectedSuggestions[index].price) {
        return setError({
          name: 'supply',
          message: 'Cost must be less than or equal to supplier price',
        });
      }
    });

    if (selectSuppliers === '') {
      dispatch(addSupplierAsync(supplierInfo))
        .then(async (response) => {
          const supplierId = response.payload.id;
           submitSupplies(supplierId);
        })
        .catch((error) => {
          return setError({
            name: 'supply',
            message: 'Failed to add supplier',
          });
        });
    }else{
        submitSupplies(selectSuppliers);
    }
  };

  return (
    <>
      <React.Fragment>
        <div className="ec-content-wrapper">
          <div className="content">
            <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
              <div>
                <h1>Ajouter une nouvelle supply</h1>
                <p className="breadcrumbs">
                  <span>
                    <Link to={'/'}>Accueil</Link>
                  </span>
                  <span>
                    <i className="mdi mdi-chevron-right"></i>
                  </span>
                  Ajouter une supply
                </p>
              </div>
            </div>
            {statusMedications === 'succeeded' && (
              <div className="ec-cat-form">
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className="form-row">
                    <div className="form-group col-md-4 ">
                      <label htmlFor="supplier">Select a supplier</label>
                      <select
                        name="supplier"
                        className="form-control"
                        value={selectSuppliers}
                        onChange={(e) => {
                          setSelectSuppliers(e.target.value);
                          if (e.target.value !== '') {
                            setSupplierInfo(
                              ...Suppliers.filter(
                                (supplier) => supplier.id == e.target.value,
                              ),
                            );
                          }
                        }}
                        id="supplier"
                      >
                        <option value={''}>Select a supplier</option>
                        {Suppliers.length > 0 &&
                          Suppliers.map((supplier) => (
                            <option value={supplier.id}>{supplier.name}</option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group col-md-4 ">
                      <label htmlFor="customer_name">Name Entreprise</label>
                      <input
                        type="text"
                        id="name"
                        className="form-control "
                        name="name"
                        value={supplierInfo.name}
                        disabled={selectSuppliers === '' ? false : true}
                        onChange={(e) =>
                          setSupplierInfo({
                            ...supplierInfo,
                            name: e.target.value,
                          })
                        }
                      />
                      {error.error === 'name' && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: 'block',
                            marginBottom: '10px',
                          }}
                        >
                          {error.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-4 ">
                      <label htmlFor="contactName">
                        Contact Name <span>(Facultatif)</span>
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        disabled={selectSuppliers === '' ? false : true}
                        value={supplierInfo.contactName}
                        onChange={(e) =>
                          setSupplierInfo({
                            ...supplierInfo,
                            contactName: e.target.value,
                          })
                        }
                        className="form-control "
                      />
                      {error.error === 'phoneNumber' && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: 'block',
                            marginBottom: '10px',
                          }}
                        >
                          {error.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-4 ">
                      <label htmlFor="contactEmail">
                        Contact Email <span>(Facultatif)</span>
                      </label>
                      <input
                        type="text"
                        id="contactEmail"
                        name="contactEmail"
                        value={supplierInfo.contactEmail}
                        disabled={selectSuppliers === '' ? false : true}
                        onChange={(e) =>
                          setSupplierInfo({
                            ...supplierInfo,
                            contactEmail: e.target.value,
                          })
                        }
                        className="form-control "
                      />
                      {error.error === 'contactEmail' && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: 'block',
                            marginBottom: '10px',
                          }}
                        >
                          {error.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-4 ">
                      <label htmlFor="contactPhone">
                        Contact Phone <span>(Facultatif)</span>
                      </label>
                      <input
                        type="text"
                        id="contactPhone"
                        value={supplierInfo.contactPhone}
                        disabled={selectSuppliers === '' ? false : true}
                        onChange={(e) =>
                          setSupplierInfo({
                            ...supplierInfo,
                            contactPhone: e.target.value,
                          })
                        }
                        name="contactPhone"
                        className="form-control "
                      />
                      {error.error === 'contactPhone' && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: 'block',
                            marginBottom: '10px',
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
                      Reference Medication
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
                    {error.error === 'supply' && (
                      <div
                        className="invalid-feedback"
                        style={{
                          display: 'block',
                          marginBottom: '10px',
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
                              style={{ width: '100%', textAlign: 'center' }}
                            >
                              <thead>
                                <tr>
                                  <th>Reference</th>
                                  <th>Price</th>
                                  <th>Quantité</th>
                                  <th>Cost</th>
                                  <th>Cost total (Dh)</th>
                                  <th>Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {selectedSuggestions.length > 0 &&
                                  selectedSuggestions.map((suggestion, i) => (
                                    <tr key={suggestion.id}>
                                      <td>{suggestion.reference}</td>
                                      <td>{suggestion.price}</td>
                                      <td style={{ width: '100px' }}>
                                        <input
                                          type="number"
                                          value={formData[i].quantity}
                                          name="quantity"
                                          onChange={(e) => {
                                            setFormData((prevState) => {
                                              const newState = [...prevState];
                                              newState[i].quantity =
                                                e.target.value;
                                              return newState;
                                            });
                                          }}
                                        />
                                      </td>
                                      <td style={{ width: '100px' }}>
                                        <input
                                          type="number"
                                          value={formData[i].cost}
                                          name="cost"
                                          onChange={(e) => {
                                            setFormData((prevState) => {
                                              const newState = [...prevState];
                                              newState[i].cost = e.target.value;
                                              return newState;
                                            });
                                          }}
                                        />
                                      </td>
                                      <td>
                                        {formData[i].cost *
                                          formData[i].quantity}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-danger"
                                          onClick={(e) => {
                                            setSelectedSuggestions(
                                              selectedSuggestions.filter(
                                                (value, index) => index !== i,
                                              ),
                                            );
                                            setFormData(
                                              formData.filter(
                                                (value, index) => index !== i,
                                              ),
                                            );
                                          }}
                                        >
                                          <i className="mdi mdi-delete"></i>
                                        </button>
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

                  <div
                    className="col-md-12"
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      marginTop: '25px',
                      gap: '15px',
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
