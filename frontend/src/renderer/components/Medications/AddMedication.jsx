import React, { useState } from 'react'
import AddSupplier from './AddSupplier'
import { Link } from 'react-router-dom'

export default function AddMedication() {
	const [formData,setFormData] = useState({
		medication:{
			name: "",
			reference: "",
			descritpion:"",
			price:0,
			dosage:"",
		},
		supplier:{
			name: "",
			contactName: "",
			contactEmail:"",
			contactPhone:"",
			quantity:0,
			cost:0
		}
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
		setFormData({
			...formData,
			supplier:{
				...formData.supplier,
				[name]: name === quantity  ? parseInt(value) : name === cost  ? parseFloat(value) : value
			}
		})
	}
  return (
    <div className="ec-content-wrapper">
				<div className="content">
					<div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
						<div>
							<h1>Add Product</h1>
							<p className="breadcrumbs"><span><Link to={"/"}>Home</Link></span>
								<span><i className="mdi mdi-chevron-right"></i></span>Product</p>
						</div>
						<div>
							<Link to={"/medications"} className="btn btn-primary"> View All
							</Link>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card card-default">
								<div className="card-header card-header-border-bottom">
									<h2>Add Medication</h2>
								</div>

								<div className="card-body">
									<div className="row ec-vendor-uploads">
										<div className="col-lg-12">
											<div className="ec-vendor-upload-detail">
												<form className="row g-3">
													<div className="col-md-6">
														<label htmlFor="name" className="form-label">Name</label>
														<input type="text" className="form-control" placeholder='Medication Name' onChange={(e) => handleMedicationChange(e)} name='name' value={formData.medication.name} id="name"/>
													</div>
													<div className="col-md-6">
														<label htmlFor="reference" className="form-label">Reference</label> 
														<input id="reference" name="reference" placeholder='Medication Reference' className="form-control" onChange={(e) => handleMedicationChange(e)} value={formData.medication.reference} type="text"/>
													</div>
													<div className="col-md-12">
														<label className="form-label">Sort Description <span>(Optional)</span></label>
														<textarea className="form-control" rows="2" placeholder='Medication Description' name='description' onChange={(e) => handleMedicationChange(e)} value={formData.medication.descritpion}></textarea>
													</div>
													<div className="col-md-6">
														<label className="form-label">Price <span>( In MAD )</span></label>
														<input type="number" className="form-control" min={0} placeholder='Medication Price' name='price' id="price" onChange={(e) => handleMedicationChange(e)} value={formData.medication.price}/>
													</div>
													<div className="col-md-6">
														<label className="form-label">Dosage</label>
														<input type="text" placeholder='For Example: 200mg' className="form-control" name='dosage' id="dosage" onChange={(e) => handleMedicationChange(e)} value={formData.medication.dosage}/>
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
					<AddSupplier/>
					<br />
					<div class="col-md-12">
						<button type='button' class="btn btn-primary">Submit</button>
					</div>
				</div> 
			</div>
  )
}
