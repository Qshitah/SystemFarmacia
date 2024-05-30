import React from 'react'

export default function AddSupplier() {
  return (
    <React.Fragment>
        <div className="row">
						<div className="col-12">
							<div className="card card-default">
								<div className="card-header card-header-border-bottom">
									<h2>Add Supplier</h2>
								</div>

								<div className="card-body">
									<div className="row ec-vendor-uploads">
										<div className="col-lg-12">
											<div className="ec-vendor-upload-detail">
												<form className="row g-3">
                                                <div className="col-md-6">
														<label htmlFor="supplierName" className="form-label">Supplier Name</label>
														<input type="text" className="form-control" name='supplierName' id="supplierName"/>
													</div>
													<div className="col-md-6">
														<label htmlFor="contactName" className="form-label">Contact Name<span>(Optional)</span></label>
														<input type="text" className="form-control" name='contactName' id="contactName"/>
													</div>
													<div className="col-md-6">
														<label htmlFor="contactEmail" className="form-label">Contact Email<span>(Optional)</span></label> 
														<input id="contactEmail" name="contactEmail" className="form-control" type="text"/>
													</div>
                                                    <div className="col-md-6">
														<label htmlFor="contactPhone" className="form-label">Contact Phone<span>(Optional)</span></label> 
														<input id="contactPhone" name="contactPhone" className="form-control" type="text"/>
													</div>
													<div className="col-md-6">
														<label className="form-label" htmlFor='cost'>Cost <span>( In MAD )</span></label>
														<input type="number" min={0} className="form-control" name='cost' id="cost"/>
													</div>
                                                    <div className="col-md-6">
														<label className="form-label" htmlFor='quantity'>Quantity</label>
														<input type="number" min={0} step={1} className="form-control" name='quantity' id="quantity"/>
													</div>
												</form>
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
