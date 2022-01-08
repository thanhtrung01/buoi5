import React, { Component } from 'react'
import getWeb3 from "../getWeb3";
import MyContext from '../myContext';
import ItemManagerContract from "../contracts/ItemManager.json";
import ItemContract from "../contracts/Item.json";
class ListAddress extends Component {
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
  render() {
      const ListAddress = this.context.ListAddress.map((item, key) => (
          <AddressItem author={item} key={key} stt={key + 1} />
      ))
      return (
          <div className="content-wrapper">
              <div className="main-list">
                  <h2 className="fl-left">DANH SÁCH TÁC GIẢ</h2>
                  <div className="hr" />
                  <div className="list">
                      <table className="content-table">
                          <thead>
                              <tr>
                                  <th>STT</th>
                                  <th>Tên tác giả</th>
                                  <th>Hành động</th>
                              </tr>
                          </thead>
                          <tbody>
                              {ListAddress}
                          </tbody>
                      </table>
                  </div>
                  <div className="num-record">(Có {this.context.ListAddress.length} bản ghi)</div>
              </div>
          </div>
      )
  }
}

ListAddress.contextType = MyContext;
export default ListAddress;

class AddressItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAddress: []
    }
  }
  render() {
    
    let {cate} = this.props;
    return (
        <tr>
            <td>{this.props.stt}</td>
            <td>{cate.cost}</td>
            <td>{cate._itemAddress}</td>
            </tr>
        );
    }
}
AddressItem.contextType = MyContext;