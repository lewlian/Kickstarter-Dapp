import React from "react";
import { Button, Menu } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  return (
    <Menu style={{ marginTop: "16px" }}>
      <Link route="/">
        <a
          className="item"
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "purple"
          }}
        >
          IdeaFi
        </a>
      </Link>
      <Menu.Menu
        style={{ margin: "auto 0", marginRight: "16px" }}
        position="right"
      >
        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              color="purple"
            />
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
