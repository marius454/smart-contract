import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
import Products from './Products'
import Shipments from './Shipments'
import PayCourier from './PayCourier'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if(networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })

      const productCount = await marketplace.methods.productCount().call()
      console.log(productCount.toString())
      const orderCount = await marketplace.methods.orderCount().call()
      console.log(orderCount.toString())
      const shipmentCount = await marketplace.methods.shipmentCount().call()
      console.log(shipmentCount.toString())

      this.setState({ loading: false})
      this.setState({productCount})
      //Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      for (var i = 1; i <= orderCount; i++) {
        const order = await marketplace.methods.orders(i).call()
        this.setState({
          orders: [...this.state.orders, order]
        })
      }
      for (var i = 1; i <= orderCount; i++) {
        const shipment = await marketplace.methods.shipments(i).call()
        this.setState({
          shipments: [...this.state.shipments, shipment]
        })
      }
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      orders: [],
      shipments: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.orderProduct = this.orderProduct.bind(this)
    this.shipProduct = this.shipProduct.bind(this)
    this.payCourier = this.payCourier.bind(this)
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  orderProduct(id, price){
    this.setState({ loading: true })
    this.state.marketplace.methods.orderProduct(id).send({ from: this.state.account, value: price})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  shipProduct(id){
    this.setState({ loading: true })
    this.state.marketplace.methods.shipProduct(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  payCourier(id, price){
    this.setState({ loading: true })
    this.state.marketplace.methods.payCourier(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <div><Main
                account = {this.state.account}
                products = {this.state.products}
                createProduct = {this.createProduct}
                purchaseProduct = {this.purchaseProduct} />
                <Products 
                account = {this.state.account}
                products = {this.state.products}
                orderProduct = {this.orderProduct} />
                <Shipments 
                account = {this.state.account}
                orders = {this.state.orders}
                shipProduct = {this.shipProduct} />
                <PayCourier 
                account = {this.state.account}
                shipments = {this.state.shipments}
                payCourier = {this.payCourier} />
                </div>
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
