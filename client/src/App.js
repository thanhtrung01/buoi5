import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";
// import React, { Component } from 'react';

// import ListAddress from "./components/ListAddress.js";
import "./App.css";

class App extends Component {
  state = { loaded:false, cost:0, itemName: "Supplychain_example_1"};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
      this.itemManager  = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.listenToPaymentEvent();
      this.setState({ loaded:true });
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Không thể tải Web3! Lỗi tài khoản hoặc hợp đồng. Kiểm tra bảng điều khiển để biết chi tiết.`,
      );
      console.error(error);
    }
  };

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data", async function(evt) {
      console.log(evt);
      let itemObject = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
      alert("Item" + itemObject._identifier + " đã được trả tiền, giao nó ngay bây giờ");
    });

  }
  constructor(props) {
    super(props);
    this.state = {
      listAddress: []
    }
  }
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked: target.value;
    const name =target.name;
    const cost = target.cost;
    this.setState({
      [name]:value,
      [cost]:value
    });
  }

  handleSubmit = async() => {
    const {cost, itemName} = this.state;
    let result = await this.itemManager.methods.createItem(itemName, cost).send({from:this.accounts[0]});
    console.log(result);
    alert("gửi "+cost+" đến "+result.events.SupplyChainStep.returnValues._itemAddress);
  }
  
  // xem lịch sử giao dịch trên trang ethereum
  // onClick = async() => {
  //   const address = window.ethereum.selectedAddress;
  //   if (address === null) {
  //     console.log(window.ethereum.selectedAddress)
  //   }
  // };
  render() {
    
    if (!this.state.loaded) {
      return <div className="connecting">connecting...</div>;
    }
    // const {cost, itemName, _itemAddress} = this.state;
    const listAddress = this.state.listAddress.map((cost, itemName, _itemAddress) => {
      return(
                <AddressItem stt={_itemAddress+1} cate={cost}  name={itemName} address={_itemAddress}/>
            ) 
      })
    return (
      <div className="App">
        <h1>BÀI GIỮA KÌ</h1>  
        <div className="item-add-address">
          <div className="add-item">
            Cost in wei: <input type="text" name ="cost" value={this.state.cost} onChange={this.handleInputChange} />
            Item Identifier: <input type="text" name ="itemName" value={this.state.itemName} onChange={this.handleInputChange} />
            <button type="button" onClick={this.handleSubmit}>Create new</button>
          </div>
          <div className="item-owner">
            <div className="ether-address">
              <h2>Owner:  </h2>
                {window.ethereum.selectedAddress}
              <button title="Xem địch chỉ owner trên ethereum" type="button" onClick={() =>
                    window.open(
                      `https://etherscan.io/address/${window.ethereum.selectedAddress}`,
                    )
                  }>
                  Ethereum
              </button>
            </div>
          </div>
          <table className="content-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>cost</th>
                <th>name</th>
                <th>address</th>
              </tr>
            </thead>
            <tbody>
                  {listAddress}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
class AddressItem extends Component {
  render() {
    let {cate} = this.props;
    return (
        <tr>
            <td>{this.props.stt}</td>
            <td>{cate.cost}</td>
            <td>{cate.itemName}</td>
            <td>{cate._itemAddress}</td>
        </tr>
        );
    }
}

