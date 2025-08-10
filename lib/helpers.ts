export const getStatusColor = (status: string) => {
  switch (status) {
    case "minted":
      return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    case "listed":
      return "bg-green-500/20 text-green-400 border-green-500/50";
    case "sold":
      return "bg-purple-500/20 text-purple-400 border-purple-500/50";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  }
};
