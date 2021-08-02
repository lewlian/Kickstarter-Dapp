import { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {
  getApprovers,
  storeApprover
} from '../services/approvedList/approvers';

class RequestRow extends Component {
  state = {
    loading: false,
    hasApproved: false
  };

  async componentDidMount() {
    const approvers = getApprovers(`${this.props.address}+${this.props.id}`);
    const accounts = await web3.eth.getAccounts();
    if (approvers.includes(accounts[0])) {
      this.setState({
        hasApproved: true
      });
    }
  }

  onApprove = async () => {
    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
    storeApprover(`${this.props.address}+${this.props.id}`, accounts[0]);
    this.setState({ loading: false });
    location.reload();
    return false;
  };

  onFinalize = async () => {
    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
    this.setState({ loading: false });
    location.reload();
    return false;
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount, isApprover, isManager } = this.props;

    const readyToFinalize =
      this.props.request.approvalCount > approversCount / 2;

    const { loading, hasApproved } = this.state;
    return (
      <Row
        disabled={this.props.request.complete}
        positive={readyToFinalize && !this.props.request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {!request.complete && !isManager && isApprover && !hasApproved && (
            <Button
              color='green'
              basic
              onClick={this.onApprove}
              loading={loading}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {!request.complete && readyToFinalize && isManager && (
            <Button
              color='teal'
              basic
              onClick={this.onFinalize}
              loading={loading}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
