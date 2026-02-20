const isValidStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = {
    open: ["in_progress"],
    in_progress: ["resolved"],
    resolved: ["closed", "in_progress"],
    closed: []
  };

  return allowedTransitions[currentStatus]?.includes(newStatus);
};

module.exports = { isValidStatusTransition };