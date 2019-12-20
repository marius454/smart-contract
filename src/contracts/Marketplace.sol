pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    uint public orderCount = 0;
    uint public shipmentCount = 0;
    mapping(uint => Product) public products;
    mapping(uint => Order) public orders;
    mapping(uint => Shipment) public shipments;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }
    struct Shipment {
        uint id;
        uint productId;
        string productName;
        uint price;
        address payable courier;
        address payable owner;
        bool payed;
    }
    struct Order {
        uint id;
        uint productId;
        string productName;
        uint price;
        address payable buyer;
        address payable owner;
        address payable courier;
        bool needsShipment;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductOrdered(
        uint id,
        uint productId,
        string productName,
        uint price,
        address payable buyer,
        address payable owner,
        address payable courier,
        bool needsShipment
    );
    event ProductShipped(
        uint id,
        uint productId,
        string productName,
        uint price,
        address payable courier,
        address payable owner,
        bool payed
    );
    event courierPayed(
        uint id,
        uint productId,
        string productName,
        uint price,
        address payable courier,
        address payable owner,
        bool payed
    );


    constructor() public {
        name = "My Business";
    }

    function createProduct(string memory _name, uint _price) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        // Increment product count
        productCount ++;
        // Create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.owner;
        // Check validity
        require(_product.id > 0 && _product.id <= productCount);
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        _product.owner = msg.sender;
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }

    function orderProduct(uint _id) public payable{
        orderCount ++;
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        uint _price = _product.price / 25;
        _product.purchased = true;
        products[_id] = _product;
        // Create order
        orders[orderCount] = Order(orderCount, _id, _product.name, _price, msg.sender, _seller, _seller, true);
        // Pay seller
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit ProductOrdered (orderCount, _id, _product.name, _price, msg.sender, _seller, _seller, true);
    }

    function shipProduct(uint _id) public {
        shipmentCount ++;
        Order memory _order = orders[_id];
        
        address payable _courier = msg.sender;

        Product memory _product = products[_order.productId];
        _product.owner = _order.buyer;
        products[_order.productId] = _product;

        _order.needsShipment = false;
        _order.courier = _courier;
        orders[_id] = _order;

        shipments[shipmentCount] = Shipment(shipmentCount, _product.id, _product.name, _order.price, _courier, _order.owner, false);

        emit ProductShipped (shipmentCount, _product.id, _product.name, _order.price, _courier, _order.owner, false);
    }

    function payCourier(uint _id) public payable {
        Shipment memory _shipment = shipments[_id];
        address payable _courier = _shipment.courier;

        address(_courier).transfer(_shipment.price);

        _shipment.payed = true;
        shipments[_id] = _shipment;

        emit courierPayed (shipmentCount, _shipment.productId, _shipment.productName, _shipment.price, _courier, msg.sender, true);
    }
}
