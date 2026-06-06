export const ROLES = [
  {
    value: "AGENT",
    label: "Agent",
    description:
      "Can view and make changes to the entire chat history. Cannot invite other agents.",
  },
  {
    value: "MANAGER",
    label: "Manager",
    description:
      "Can invite agents and can edit/manage everything inside the chatbot. Cannot invite other managers.",
  },
  {
    value: "ADMIN",
    label: "Admin",
    description:
      "Can invite and remove other admins and managers. Cannot invite others as super admin.",
  },
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full access to everything including deleting the chatbot.",
  },
];

export const ROLE_LEVEL = { AGENT: 0, MANAGER: 1, ADMIN: 2, SUPER_ADMIN: 3 };
