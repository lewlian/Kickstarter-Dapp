import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../component/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
    title: "",
    description: ""
  };

  onSubmit = async (event) => {
    //keep the browser from attempting to sub it the form
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    //capture case when there are any error in the transaction
    try {
      const accounts = await web3.eth.getAccounts();
      //make use of metamask to calculate gas

      await factory.methods
        .createCampaign(
          web3.utils.toWei(this.state.minimumContribution, "ether"),
          this.state.title,
          this.state.description
        )
        .send({
          from: accounts[0]
        });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3 style={{ margin: "32px 0", fontSize: 20 }}>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="ether"
              labelPosition="right"
              type="number"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
            <label style={{ marginTop: "8px" }}>Title of Campaign</label>
            <Input
              value={this.state.title}
              onChange={(event) => this.setState({ title: event.target.value })}
            />
            <label style={{ marginTop: "8px" }}>Description of Campaign</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button
            loading={this.state.loading}
            content="Create!"
            color="purple"
          />
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
