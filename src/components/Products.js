import React, { Component } from 'react';

class Products extends Component {


  render() {
    return (
      <div id="content">
        <p>&nbsp;</p>
        <h2>Order product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products.map((product,key) => {
              this.price = window.web3.utils.fromWei((product.price).toString(), 'Ether')
              this.fee = window.web3.utils.fromWei((product.price).toString(), 'Ether') / 25
              console.log(typeof(this.fee))
              this.total = Number(this.price) + Number(this.fee)
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{(this.total)} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                  {!product.purchased && this.props.account !== product.owner
                    ? <button
                        name = {product.id}
                        value = {Number(product.price) + Number(product.price) /25 }
                        onClick={(event) => { 
                          this.props.orderProduct(event.target.name, event.target.value)
                        }}
                        >Order
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

export default Products;
