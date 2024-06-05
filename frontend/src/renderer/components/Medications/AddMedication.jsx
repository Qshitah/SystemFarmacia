import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addMedicationAsync } from '../../redux/MedicationSlice';

export default function AddMedication() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {statusMedications, errorMedications} = useSelector((state) => state.medications);


	const [formData,setFormData] = useState({
		medication:{
			name: "",
			reference: "",
			descritpion:"",
			price:0,
			dosage:"",
			expiresAt:"",
		}
	});

	const [error, setError] = useState({
		name:"",
		message: "",
	});

	const handleMedicationChange = (e) => {
		const {name,value} = e.target;
		setFormData({
			...formData,
			medication:{
				...formData.medication,
				[name]: name === price  ? parseFloat(value) : value
			}
		})
	};

	const handleSupplierChange = (e) => {
		const {name,value} = e.target;
		if(name === "quantity" || name === "cost"){
			setFormData({
				...formData,
				supply:{
					...formData.supply,
					[name]: name === "quantity" ? parseInt(value) : parseFloat(value)
				}
			})
		}else {
			setFormData({
				...formData,
				supplier:{
					...formData.supplier,
					[name]:value
				}
			})
		}
		
	};

	const handleSubmit = async(e) => {
		e.preventDefault();
		setError({
			name:"",
			message: "",
		});

		if(formData.medication.name === ""){
			return setError({
				name:"name",
				message: "Name is required",
			})
		};

		if(formData.medication.reference === ""){
			return setError({
				name:"reference",
				message: "Reference is required",
			})
		};

		if(formData.medication.price < 0){
			return setError({
				name:"price",
				message: "Price cannot be negative",
			})
		};

		const data = {...formData.medication};

		dispatch(addMedicationAsync(data))
			.then(() => {
				if(statusMedications === "failed-adding"){
					setError({
						name:"error",
						message: errorMedications,
					})
				}else{
					navigate("/medicaments")

				}
			});
	}

  return (
    <div className="ec-content-wrapper">
				<div className="content">
					<div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
						<div>
							<h1>Ajouter un médicament</h1>
							<p className="breadcrumbs"><span><Link to={"/"}>Home</Link></span>
								<span><i className="mdi mdi-chevron-right"></i></span>Médicament</p>
						</div>
						<div>
							<Link to={"/medications"} className="btn btn-primary"> Liste des Médicaments
							</Link>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card card-default">
								<div className="card-header card-header-border-bottom">
									<h2>Ajouter un médicament</h2>
								</div>

								<div className="card-body">
									<div className="row ec-vendor-uploads">
										<div className="col-lg-12">
											<div className="ec-vendor-upload-detail">
												<form className="row g-3">
													<div className="col-md-6">
														<label htmlFor="name" className="form-label">Nom</label>
														<input type="text" className="form-control" placeholder='Medication Name' onChange={(e) => handleMedicationChange(e)} name='name' value={formData.medication.name} id="name"/>
														{error.name === "name" && <p className="text-danger">{error.message}</p>}
													</div>
													<div className="col-md-6">
														<label htmlFor="reference" className="form-label">Référence</label> 
														{error.name === "reference" && <p className="text-danger" style={{color:"red"}}>{error.message}</p>}
														<input id="reference" name="reference" placeholder='Medication Reference' className="form-control" onChange={(e) => handleMedicationChange(e)} value={formData.medication.reference} type="text"/>
													</div>
													<div className="col-md-12">
														<label className="form-label">Description <span>(Facultatif)</span></label>
														<textarea className="form-control" rows="2" placeholder='Medication Description' name='description' onChange={(e) => handleMedicationChange(e)} value={formData.medication.descritpion}></textarea>
													</div>
													<div className="col-md-6">
														<label className="form-label">Prix <span>( MAD )</span></label>
														{error.name === "price" && <p className="text-danger" style={{color:"red"}}>{error.message}</p>}
														<input type="number" className="form-control" min={0} placeholder='Medication Price' name='price' id="price" onChange={(e) => handleMedicationChange(e)} value={formData.medication.price}/>
													</div>
													<div className="col-md-6">
														<label className="form-label">Dosage</label>
														<input type="text" placeholder='Par Example: 200mg' className="form-control" name='dosage' id="dosage" onChange={(e) => handleMedicationChange(e)} value={formData.medication.dosage}/>
													</div>
													<div className="col-md-6">
														<label className="form-label">Expire à</label>
														<input type="date" className="form-control" name='expiresAt' id="expiresAt" onChange={(e) => handleMedicationChange(e)} value={formData.medication.expiresAt}/>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
								
							</div>
						</div>
					</div>
					<br />
					<div className="col-md-12">
						<button type='button' onClick={(e) => handleSubmit(e)} className="btn btn-primary">Submit</button>
						{error.name === "error" && <p className="text-danger" style={{color:"red"}}>{error.message}</p>}
					</div>
				</div> 
			</div>
  )
}
