import React, { Component } from 'react';

class PayCourier extends Component {


  render() {
    return (
      <div id="content">
        <p>&nbsp;</p>
        <h2>PayCourier</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Payment</th>
              <th scope="col">Shiped by</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.shipments.map((product,key) => {
              console.log(product.owner)
              console.log(this.props.account)
              if (this.props.account == product.owner){
              this.price = window.web3.utils.fromWei((product.price).toString(), 'Ether')
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.productName}</td>
                  <td>{this.price} Eth</td>
                  <td>{product.courier}</td>
                  <td>
                  {!product.payed && this.props.account == product.owner
                    ? <button
                        name = {product.id}
                        value = {product.price}
                        onClick={(event) => { 
                          this.props.payCourier(event.target.name, event.target.value)
                        }}
                        >Pay
                      </button>
                    : null
                  }
                  </td>
                </tr>
              )}
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PayCourier;
