export type Deliverable = {
  title: string;
  description: string;
  outcome: string;
};

export type Proposal = {
  id: string;
  number: string;
  title: string;
  tagline: string;
  priceLabel: string;
  pricePeriod: string;
  issuedAt: string;
  validUntil: string;
  from: { name: string; contact: string; location: string };
  to: { name: string; description: string };
  summary: string[];
  deliverables: Deliverable[];
  outOfScope: string[];
  termsUrl: string;
  stripePaymentLink?: string;
};

const proposals: Record<string, Proposal> = {
  "fde-beadedstream": {
    id: "fde-beadedstream",
    number: "2026-FDE-001",
    title: "Forward Deployed Engineer",
    tagline:
      "A dedicated integration engineer embedded in your product workflow — reducing operational overhead and building toward a more automated, connected stack.",
    priceLabel: "$1,000",
    pricePeriod: "/ month",
    issuedAt: "April 2, 2026",
    validUntil: "May 2, 2026",
    from: {
      name: "Circumpolar.ai",
      contact: "Erik Williams · erik@beaded.cloud",
      location: "Anchorage, Alaska",
    },
    to: {
      name: "Beadedstream",
      description: "Arctic permafrost monitoring hardware",
    },
    summary: [
      "Beadedstream can significantly improve operational efficiency through more automation. Right now, a lot of data tracking and order management happens manually — it's a source of friction, errors, and staff time that doesn't need to be spent that way.",
      "This engagement embeds a dedicated engineer into your workflow to make your existing apps talk to each other, reduce the manual steps between them, and progressively automate the processes that slow your team down.",
      "One example of where this is heading: an AI agent inside ERPNext that can answer questions about orders, customers, and inventory — with source documents linked — using a RAG model against your own data. That's the direction. The work below is how we get there.",
    ],
    deliverables: [
      {
        title: "Factory App",
        description:
          "Ongoing integration work connecting the factory application to downstream systems. Production logs, serial numbers, and quality records should flow automatically — the goal is reducing manual data entry between stations over time.",
        outcome: "Less manual tracking; more automatic handoffs between factory and record systems",
      },
      {
        title: "Cable Builder — customer-facing UI",
        description:
          "Iterative development of the ward-facing cable configurator. Customers should be able to spec thermistor cable layouts (sensor spacing, depth, connector type) and submit structured orders instead of relying on email threads.",
        outcome: "Structured order intake that keeps improving as edge cases get handled",
      },
      {
        title: "Shop page → ERPNext",
        description:
          "Ongoing work to keep the e-commerce shop and ERPNext in sync — sales orders, inventory, and customer records. Integration points are rarely fully done; this keeps them healthy and extends them as the shop evolves.",
        outcome: "Orders flowing into ERPNext reliably, with fewer manual steps over time",
      },
      {
        title: "Capture App",
        description:
          "Continuous improvement of the field data capture app's connection to the central platform and ERPNext. Field readings should sync without manual uploads or human steps — and the integration should hold up through app updates on both sides.",
        outcome: "Reliable field-to-platform sync that doesn't require babysitting",
      },
    ],
    outOfScope: [
      "New product features outside integration work",
      "ERPNext module setup or configuration",
      "Hardware or firmware work",
      "On-site visits",
      "Server or infrastructure provisioning",
      "Customer support or end-user training",
    ],
    termsUrl:
      "https://docs.google.com/document/d/1Qg8VXzha_YfL9YB1uU6WSXoOQNTe7Ef9P8MxvDwsD8Y/edit?tab=t.0#heading=h.gxt8zfy2vr1i",
    stripePaymentLink: undefined,
  },
};

export function getProposal(id: string): Proposal | null {
  return proposals[id] ?? null;
}

export function listProposals(): Proposal[] {
  return Object.values(proposals);
}
