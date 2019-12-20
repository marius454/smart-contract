import React, { Component } from 'react';

class Shipments extends Component {

  render() {
   return (
      <div id="content">
        <p>&nbsp;</p>
        <h2>Ship this product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Seller</th>
              <th scope="col">Buyer</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.orders.map((product,key) => {
              this.price = window.web3.utils.fromWei((product.price).toString(), 'Ether')
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.productName}</td>
                  <td>{(this.price)} Eth</td>
                  <td>{product.owner}</td>
                  <td>{product.buyer}</td>
                  <td>
                  {product.needsShipment && this.props.account !== product.owner && this.props.account !== product.buyer
                    ? <button
                        name = {product.id}
                        onClick={(event) => { 
                          this.props.shipProduct(event.target.name)
                        }}
                        >Ship
                      </button>
                    : null
                  }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Shipments;
