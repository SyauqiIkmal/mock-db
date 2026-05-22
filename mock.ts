import { fakerID_ID as faker } from '@faker-js/faker';
import fs from 'node:fs';

export type Channel =
  | 'WhatsApp'
  | 'Instagram'
  | 'Telegram'
  | 'Twitter'
  | 'Facebook';
export type TierStatus = 'Active' | 'Inactive';
export type AgentName = 'Nanda' | 'Maman' | 'Asep' | 'Budi';

interface Label {
  labelId: string;
  labelName: string;
  labelColor: string;
  totalContacts: string[];
}

interface Tier {
  tierId: string;
  numberPriority: number;
  tierName: string;
  tierColor: string;
  tierStatus: TierStatus;
  totalContacts: string[];
}

interface Group {
  groupId: string;
  groupName: string;
  groupDescription: string;
  totalContacts: string[];
}

interface Contact {
  contactId: string;
  contactName: string;
  avatar: string;
  channel: Channel[];
  contactBsuid: string;
  phoneNumber: string;
  email: string;
  tierId: string;
  labelIds: string[];
  groupId: string | null;
  isBlocked: boolean;
}

interface BlockedContact {
  contactId: string;
  blockedDetail: string;
  blockedDate: string;
  blockedBy: AgentName;
}

interface MockDatabase {
  contacts: Contact[];
  labels: Label[];
  tiers: Tier[];
  groups: Group[];
  blockedContacts: BlockedContact[];
}

const AGENT_NAMES: AgentName[] = ['Nanda', 'Maman', 'Asep', 'Budi'];
const CHANNELS: Channel[] = [
  'WhatsApp',
  'Instagram',
  'Telegram',
  'Twitter',
  'Facebook',
];
const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Platinum'];
const TIER_COLORS = ['#cd7f32', '#c0c0c0', '#ffd700', '#e5e4e2'];
const LABEL_NAMES = [
  'VIP',
  'New',
  'Loyal',
  'Prospect',
  'Inactive',
  'Support',
  'Priority',
];
const LABEL_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#6b7280',
  '#8b5cf6',
  '#ec4899',
];

function generateLabels(count = 5): Label[] {
  return Array.from({ length: count }, (_, i) => ({
    labelId: faker.string.uuid(),
    labelName: LABEL_NAMES[i % LABEL_NAMES.length],
    labelColor: LABEL_COLORS[i % LABEL_COLORS.length],
    totalContacts: [],
  }));
}

function generateTiers(): Tier[] {
  return TIER_NAMES.map((name, i) => ({
    tierId: faker.string.uuid(),
    numberPriority: i + 1,
    tierName: name,
    tierColor: TIER_COLORS[i],
    tierStatus: faker.helpers.arrayElement<TierStatus>(['Active', 'Inactive']),
    totalContacts: [],
  }));
}

function generateContacts(
  count: number,
  tiers: Tier[],
  labels: Label[],
): Contact[] {
  return Array.from({ length: count }, () => ({
    contactId: faker.string.uuid(),
    contactName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    channel: faker.helpers.arrayElements(CHANNELS, { min: 1, max: 3 }),
    contactBsuid: faker.string.alphanumeric(12),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    tierId: faker.helpers.arrayElement(tiers).tierId,
    labelIds: faker.helpers
      .arrayElements(labels, { min: 0, max: 3 })
      .map((l) => l.labelId),
    groupId: null,
    isBlocked: faker.datatype.boolean({ probability: 0.1 }),
  }));
}

function generateGroups(count: number, contacts: Contact[]): Group[] {
  return Array.from({ length: count }, () => {
    const members = faker.helpers.arrayElements(contacts, { min: 2, max: 8 });
    const group: Group = {
      groupId: faker.string.uuid(),
      groupName: faker.company.name(),
      groupDescription: faker.company.catchPhrase(),
      totalContacts: members.map((c) => c.contactId),
    };
    members.forEach((m) => (m.groupId = group.groupId));
    return group;
  });
}

function populateTotalContacts(
  contacts: Contact[],
  labels: Label[],
  tiers: Tier[],
): void {
  for (const contact of contacts) {
    const tier = tiers.find((t) => t.tierId === contact.tierId);
    if (tier) tier.totalContacts.push(contact.contactId);

    for (const labelId of contact.labelIds) {
      const label = labels.find((l) => l.labelId === labelId);
      if (label) label.totalContacts.push(contact.contactId);
    }
  }
}

function generateBlockedContact(contacts: Contact[]): BlockedContact[] {
  return contacts
    .filter((c) => c.isBlocked)
    .map((c) => ({
      contactId: c.contactId,
      blockedDetail: faker.lorem.sentence(),
      blockedDate: faker.date.recent({ days: 90 }).toISOString(),
      blockedBy: faker.helpers.arrayElement(AGENT_NAMES),
    }));
}

function generateDatabase(contactCount = 50, groupCount = 5): MockDatabase {
  const labels = generateLabels();
  const tiers = generateTiers();
  const contacts = generateContacts(contactCount, tiers, labels);
  const groups = generateGroups(groupCount, contacts);
  const blockedContacts = generateBlockedContact(contacts);
  populateTotalContacts(contacts, labels, tiers);

  return { contacts, labels, tiers, groups, blockedContacts };
}

const db = generateDatabase();
fs.writeFileSync('db-contact.json', JSON.stringify(db, null, 2));
console.log(
  `Generated ${db.contacts.length} contacts, ${db.groups.length} groups, ${db.labels.length} labels, ${db.tiers.length} tiers`,
);
