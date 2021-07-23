import React, { Component } from 'react';
import { Card, Container, Grid, Button } from 'semantic-ui-react';
import Layout from '../../component/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../component/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    console.log(campaign);

    const summary = await campaign.methods.getSummary().call();

    console.log(summary);
    //pass the data as a prop to the component
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      title: summary[5],
      description: summary[6],
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
      description,
    } = this.props;
    const items = [
      {
        header: title,
        meta: 'Title of Campaign',
        description: 'Title of the Campaign',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: description,
        meta: 'Campaign Description',
        description: 'Summarizes and describes the objective of the campaign',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become an approver',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A requests tries to withdraw money from the contract. Requests must be approved by majority approvers',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description:
          'Number of people who have donated to campaign with minimum requirement',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'How much money this campaign have left to spend',
        style: { overflowWrap: 'break-word' },
      },
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
