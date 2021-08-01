import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../component/Layout";
import RequestRow from "../../../component/RequestRow";
import Campaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";

class RequestIndex extends Component {
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

  //helper method to rendorrow
  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          id={index}
          address={this.props.address}
          approversCount={this.props.approversCount}
          manager={this.props.manager}
        />
      );
    });
  }
  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3 style={{ margin: "32px 0 0 0", fontSize: 20 }}>Request list</h3>

        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button
              content="Add Request"
              color="purple"
              floated="right"
              style={{ marginBottom: 10 }}
            />
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Receipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>
          Found {this.props.requestCount}{" "}
          {this.props.requestCount === 1 ? "request" : "requests"}
        </div>
      </Layout>
    );
  }
}

export default RequestIndex;
