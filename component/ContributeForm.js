import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

class ContributeForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: "",
    walletAddress: ""
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      walletAddress: accounts[0]
    });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      //make use of metamask to calculate gas
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });
      location.reload();
      return false;
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  render() {
    const isManager = this.state.walletAddress === this.props.manager;
    const isApprover = this.props.isApprover;

    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
            type="number"
            label="ether"
            labelPosition="right"
            disabled={isManager || isApprover}
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {isManager ? (
          <b
            style={{
              color: "red"
            }}
          >
            Managers cannot contribute to their own campaigns
          </b>
        ) : isApprover ? (
          <b
            style={{
              color: "red"
            }}
          >
            You have already contributed to this campaign
          </b>
        ) : (
          <Button
            content="Contribute!"
            color="purple"
            loading={this.state.loading}
          />
        )}
      </Form>
    );
  }
}

export default ContributeForm;
