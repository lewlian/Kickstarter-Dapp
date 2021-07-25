pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum, string title, string description) public {
        address managerAddress = msg.sender;
        address newCampaign = new Campaign(minimum, managerAddress, title, description);
        deployedCampaigns.push(newCampaign); 
    }
    
    //view means no data is modified
    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        
        //don't need to create a reference type when creating Request
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    string public campaignTitle;
    string public campaignDescription;
    //this approvers here is basically contributers not for a specifc request
    mapping(address=>bool) public approvers;
    
    
   
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address managerAddress, string title, string description) public {
        manager = managerAddress;
        minimumContribution = minimum;
        campaignTitle = title;
        campaignDescription = description;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    //create Request function should only be available to the manager
    function createRequest(string description, uint value, address recipient) public restricted {
        // automatically gets created in memory but solidity still needs you to specify
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });
        
        //adding the new request to the array of requests
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        //index tells us which requests the approver is trying to approver
        //check that the person approving has already contributed to the contract
        require(approvers[msg.sender]);
        //check if the person has voted on the requests already
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }    
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount/2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete=true;      
    }

    function getSummary() public view returns (uint,uint,uint,uint,address,string,string) {
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager,
            campaignTitle,
            campaignDescription
        );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }
}
