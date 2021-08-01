import React, { Component } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import ContributeForm from "../../component/ContributeForm";
import Layout from "../../component/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    // console.log(summary);
    //pass the data as a prop to the component
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      title: summary[5],
      description: summary[6]
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
      title,
      description
    } = this.props;
    const items = [
      {
        header: title,
        meta: "Campaign Title",
        // description: "Title of the Campaign",
        style: { overflowWrap: "break-word" }
      },
      {
        header: description,
        meta: "Campaign Description",
        description: "Summarizes and describes the objective of the campaign",
        style: { overflowWrap: "break-word" }
      },
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" }
      },
      {
        header: web3.utils.fromWei(minimumContribution, "ether"),
        meta: "Minimum Contribution (ether)",
        description:
          "You must contribute at least this much ether to become an approver",
        style: { overflowWrap: "break-word" }
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "Requests are made to withdraw money from the contract. Requests must be approved by a majority of approvers",
        style: { overflowWrap: "break-word" }
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have donated to campaign with minimum requirement",
        style: { overflowWrap: "break-word" }
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "Remaining funds that the campaign has left to spend",
        style: { overflowWrap: "break-word" }
      }
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3 style={{ margin: "32px 0", fontSize: 20 }}>Campaign Details</h3>

        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm
                address={this.props.address}
                manager={this.props.manager}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <Button content="View Requests" color="purple" />
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
