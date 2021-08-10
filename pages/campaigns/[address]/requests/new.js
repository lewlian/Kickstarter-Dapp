import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../../component/Layout';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import { Link, Router } from '../../../../routes';

class RequestNew extends Component {
  state = {
    value: '',
    description: '',
    recipientAddress: '',
    loading: false,
    errorMessage: ''
  };
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async (event) => {
    console.log('test');
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });
    const campaign = Campaign(this.props.address);

    const { description, value, recipientAddress } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();
      //make use of metamask to calculate gas
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(value, 'ether'),
          recipientAddress
        )
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <div style={{ marginTop: '24px' }}>
          <Link route={`/campaigns/${this.props.address}/requests`}>
            <a>Back</a>
          </Link>
        </div>

        <h3 style={{ fontSize: 20 }}>Create a Request</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              type='number'
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient Address</label>
            <Input
              value={this.state.recipientAddress}
              onChange={(event) =>
                this.setState({ recipientAddress: event.target.value })
              }
            />
          </Form.Field>
          <Message error header='Oops!' content={this.state.errorMessage} />
          <Button
            content='Create!'
            color='purple'
            loading={this.state.loading}
          />
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
