import React, { Component } from "react";
import { Card, Grid, Image } from "semantic-ui-react";
import Layout from "../component/Layout";
import Campaign from "../ethereum/campaign";
import factory from "../ethereum/factory";
import { Link } from "../routes";
class CampaignIndex extends Component {
  static async getInitialProps() {
    let campaigns = await factory.methods.getDeployedCampaigns().call();
    const promise = campaigns.map(async (item) => {
      // const title = await Campaign(item).methods.campaignTitle().call();
      // const description = await Campaign(item)
      //   .methods.campaignDescription()
      //   .call();

      const summary = await Campaign(item).methods.getSummary().call();
      // minimumContribution: summary[0],
      // balance: summary[1],
      // const requestsCount = summary[2];
      const approversCount = summary[3];
      const manager = summary[4];
      const title = summary[5];
      const description = summary[6];

      const body = {};
      body.campaignAddress = item;
      body.approversCount = approversCount;
      body.manager = manager;
      body.title = title;
      body.description = description;
      return body;
    });
    campaigns = await Promise.all(promise);
    return { campaigns: campaigns };
  }

  renderCampaigns() {
    const list = this.props.campaigns.map((item) => (
      <Card fluid>
        <Card.Content header={item.title} />
        <Card.Content>
          <p style={{ fontSize: "16px" }}>{item.description}</p>

          <p style={{ color: "purple", marginTop: "8px" }}>
            {item.approversCount} people have donated to this campaign
          </p>
          <p style={{ fontSize: "12px", color: "#383838" }}>
            Campaign address: {item.campaignAddress}
          </p>
          <p style={{ fontSize: "12px", color: "#383838" }}>
            Owner: {item.manager}
          </p>
        </Card.Content>

        <Card.Content>
          <Link route={`/campaigns/${item.campaignAddress}`}>
            <a style={{ color: "purple", fontWeight: "bold" }}>View Campaign</a>
          </Link>
        </Card.Content>
      </Card>
    ));

    return list;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3 style={{ margin: "32px 0", fontSize: 20 }}>Open Campaigns</h3>

          <Grid stackable columns={2}>
            <Grid.Column>{this.renderCampaigns()}</Grid.Column>
            <Grid.Column>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  marginTop: "16px",
                  marginBottom: "16px"
                }}
              >
                We are IdeaFi. The safest way to support creative projects.
              </h1>
              <Image
                style={{
                  margin: "56px",
                  marginTop: 0
                }}
                src="/homepage.svg"
              />
            </Grid.Column>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
