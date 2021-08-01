import { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

class RequestRow extends Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      address: accounts[0]
    });
  }

  onApprove = async () => {
    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
    // location.reload();
    // return false;
  };

  onFinalize = async () => {
    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
    // location.reload();
    // return false;
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;

    const readyToFinalize =
      this.props.request.approvalCount > approversCount / 2;

    const isManager = this.state.address === this.props.manager;
    return (
      <Row
        disabled={this.props.request.complete}
        positive={readyToFinalize && !this.props.request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {!request.complete && !isManager && (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {!request.complete && readyToFinalize && isManager && (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
