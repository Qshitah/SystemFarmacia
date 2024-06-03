import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import {
  fetchMedicationsAsync,
  fetchMedicationsInventoryAsync,
} from '../../redux/MedicationSlice';
import { Link, useNavigate } from 'react-router-dom';
import { addOrderAsync, fetchOrdersAsync } from '../../redux/OrderSlice';
import axios from 'axios';

export default function AddOrder() {
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
  const [formDataOrder, setFormDataOrder] = useState({
    clientName: '',
    clientPhone: '',
    totalAmount: '',
  });

  const { inventory, statusMedications, errorMedications } = useSelector(
    (state) => state.medications,
  );

  useEffect(() => {
    if (statusMedications === 'failed-inventory') {
      console.log(errorMedications);
    } else if (statusMedications !== 'succeeded-inventory') {
      dispatch(fetchMedicationsInventoryAsync());
    }
  }, [dispatch, errorMedications, statusMedications]);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return inputValue.length === 0
      ? []
      : inventory.filter((data) =>
          data.data.reference.toLowerCase().includes(inputValueLowerCase),
        );
  };

  // Function to render suggestions
  const renderSuggestion = (suggestion) => (
    <div>{suggestion.data.reference}</div>
  );

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
        medicationId: suggestion.data.id,
        quantity: 1,
        price: suggestion.data.price,
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

  const calculateTotal = (array) => {
    return array.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({
      error: '',
      message: '',
    });

    if(formData.length === 0){
      return setError({
        error: 'order',
        message: 'Please add at least one medication',
      });
    }

    var error = null;

    formData.map((medication, index) => {
      if(medication.quantity <= 0){
        error = {
          error: 'order',
          message: 'Quantity must be greater than 0',
        };
      }

      if(medication.quantity > selectedSuggestions[index].data.quantity){
        error = {
          error: 'order',
          message: 'Quantity must be less than or equal to available quantity',
        };
      }

      if(medication.price <= 0){
        error = {
          error: 'order',
          message: 'Price must be greater than 0',
        };
      }
    });

    if(error){
      return setError(error);
    }

    const orderData = {
      clientName: formDataOrder.clientName,
      clientPhone: formDataOrder.clientPhone,
      status: 'Confirmed',
      totalAmount: calculateTotal(formData),
      userId: 1
    };
    
    dispatch(addOrderAsync(orderData))
      .then(async(response) => {
        const data = formData.map((medication) => {
          return {
            orderId: response.payload.id,
            medicationId: medication.medicationId,
            quantity: medication.quantity,
            price: medication.price,
          };
        });

        await axios.post('http://localhost:8080/api/orderItems/multiple', data)
          .then(() => {
            dispatch(fetchOrdersAsync());
            dispatch(fetchMedicationsInventoryAsync())
              .then(() => {
                navigate('/orders');
              })
          }).catch((error) => {
            console.log(error);
            window.electron.ipcRenderer.sendMessage('ipc-example', [
              'Error adding order items data',
            ]);
          });

      })
  }

  return (
    <>
      <React.Fragment>
        <div className="ec-content-wrapper">
          <div className="content">
            <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
              <div>
                <h1>Ajouter une nouvelle Commande</h1>
                <p className="breadcrumbs">
                  <span>
                    <Link to={'/'}>Accueil</Link>
                  </span>
                  <span>
                    <i className="mdi mdi-chevron-right"></i>
                  </span>
                  Ajouter une commande
                </p>
              </div>
            </div>
            {statusMedications === 'succeeded-inventory' && (
              <div className="ec-cat-form">
                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className="form-row">
                    <div className="form-group col-md-4 ">
                      <label htmlFor="contactName">
                        Contact Name <span>(Facultatif)</span>
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formDataOrder.clientName}
                        onChange={(event) =>
                          setFormDataOrder({
                            ...formDataOrder,
                            clientName: event.target.value,
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
                      <label htmlFor="contactPhone">
                        Contact Phone <span>(Facultatif)</span>
                      </label>
                      <input
                        type="text"
                        id="contactPhone"
                        value={formDataOrder.clientPhone}
                        onChange={(event) =>
                          setFormDataOrder({
                            ...formDataOrder,
                            clientPhone: event.target.value,
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
                    {error.error === 'order' && (
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
                                  <th>Quantité</th>
                                  <th>Prix</th>
                                  <th>Stock</th>
                                  <th>Cost total (Dh)</th>
                                  <th>Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {selectedSuggestions.length > 0 &&
                                  selectedSuggestions.map((suggestion, i) => (
                                    <tr key={suggestion.data.id}>
                                      <td>{suggestion.data.reference}</td>

                                      <td style={{ width: '100px' }}>
                                        <input
                                          type="number"
                                          value={formData[i].quantity}
                                          placeholder={formData[i].quantity}
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
                                          value={formData[i].price}
                                          placeholder={suggestion.data.price}
                                          name="price"
                                          onChange={(e) => {
                                            setFormData((prevState) => {
                                              const newState = [...prevState];
                                              newState[i].price =
                                                e.target.value;
                                              return newState;
                                            });
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <p
                                          style={{
                                            color:
                                              suggestion.inventory.quantity <=
                                              10
                                                ? 'red'
                                                : '',
                                          }}
                                        >
                                          {suggestion.inventory.quantity}
                                        </p>
                                      </td>
                                      <td>
                                        {formData[i].price *
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

                                <tr>
                                  <td colSpan="4"></td>
                                  <td className="text-right">
                                    <strong>Total</strong>
                                  </td>
                                  <td className="text-right">
                                    <strong>
                                      {calculateTotal(formData)} Dh
                                    </strong>
                                  </td>
                                </tr>
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
