import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../../component/Layout';
import RequestRow from '../../../../component/RequestRow';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import { Link } from '../../../../routes';

class RequestIndex extends Component {
  state = {
    isApprover: false,
    isManager: false
  };

  //initial call
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const manager = await campaign.methods.manager().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );
    return { address, requests, requestCount, approversCount, manager };
  }

  async componentDidMount() {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    const isApprover = await campaign.methods.approvers(accounts[0]).call();
    const isManager = accounts[0] === this.props.manager;

    this.setState({
      isApprover,
      isManager
    });
  }

  //helper method to rendorrow
  renderRows() {
    const { isApprover, isManager } = this.state;

    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          id={index}
          address={this.props.address}
          approversCount={this.props.approversCount}
          manager={this.props.manager}
          isApprover={isApprover}
          isManager={isManager}
        />
      );
    });
  }
  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <div style={{ marginTop: '24px' }}>
          <Link route={`/campaigns/${this.props.address}`}>
            <a>Back</a>
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px'
          }}
        >
          <h3 style={{ fontSize: 20 }}>Request list</h3>

          {this.state.isManager && (
            <Link route={`/campaigns/${this.props.address}/requests/new`}>
              <a>
                <Button
                  content='Add Request'
                  color='purple'
                  floated='right'
                  style={{ marginBottom: 10 }}
                />
              </a>
            </Link>
          )}
        </div>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>
          Found {this.props.requestCount}{' '}
          {this.props.requestCount == 1 ? 'request' : 'requests'}
        </div>
      </Layout>
    );
  }
}

export default RequestIndex;
