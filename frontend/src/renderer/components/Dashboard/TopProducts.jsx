import React from "react";

// Définition de la liste des produits (simulée)
const products = [
  {
    id: 1,
    name: "Baby cotton shoes",
    imageSrc: "assets/img/products/p1.jpg",
    sales: 58,
    description: "Statement belting with double-turnlock hardware adds “swagger” to a simple.",
    price: 520,
    discountedPrice: 580
  },
  // Ajoutez d'autres produits ici si nécessaire
];

export default function TopProducts() {
  return (

    <div className="col-xl-7">
      <div className="card card-default ec-card-top-prod" style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px', borderRadius: '10px' }}>
        <div className="card-header justify-content-between">
          <h2>Top Produits</h2>
          <div>
            <button className="text-black-50 mr-2 font-size-20"><i className="mdi mdi-cached"></i></button>
            <div className="dropdown show d-inline-block widget-dropdown">
              <a className="dropdown-toggle icon-burger-mini" href="#" role="button"
                id="dropdown-product" data-bs-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false" data-display="static">
              </a>
              <ul className="dropdown-menu dropdown-menu-right">
                <li className="dropdown-item"><a href="#">Mettre à jour les données</a></li>
                <li className="dropdown-item"><a href="#">Journal détaillé</a></li>
                <li className="dropdown-item"><a href="#">Statistiques</a></li>
                <li className="dropdown-item"><a href="#">Effacer les données</a></li>
              </ul>

            </div>
          </div>
        </div>
        <div className="card-body mt-10px mb-10px py-0">
          {products.map((product) => (
            <div key={product.id} className="row media d-flex pt-15px pb-15px">
              <div className="col-lg-3 col-md-3 col-2 media-image align-self-center rounded">
                <a href="#"><img src={product.imageSrc} alt="product image" /></a>
              </div>
              <div className="col-lg-9 col-md-9 col-10 media-body align-self-center ec-pos">
                <a href="#">
                  <h6 className="mb-10px text-dark font-weight-medium">{product.name}</h6>
                </a>
                <p className="float-md-right sale"><span className="mr-2">{product.sales}</span>Ventes</p>
                <p className="d-none d-md-block">{product.description}</p>
                <p className="mb-0 ec-price">
                  <span className="text-dark">${product.price}</span>
                  <del>${product.discountedPrice}</del>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
