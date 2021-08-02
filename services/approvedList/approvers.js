export const storeApprover = (requestID, approver) => {
  const current = getApprovers();
  current.push(approver);
  localStorage.setItem(requestID, JSON.stringify(current));
};

export const getApprovers = (requestID) => {
  const data = JSON.parse(localStorage.getItem(requestID)) || [];
  return data;
};
