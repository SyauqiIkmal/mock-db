import { faker } from '@faker-js/faker';
import fs from 'node:fs';

interface Label {
  id: string;
  labelName: string;
  labelDescription: string;
  color: string;
  totalContacts: number;
}

interface Contact {
  id: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  tier: string;
  labels: string[];
}

function generateLabels(total = 5): Label[] {
  const labelNames = ['Family', 'Friends', 'Work', 'Acquaintances', 'Office'];
  return Array.from({ length: Math.min(total, labelNames.length) }, (_, i) => ({
    id: faker.string.uuid(),
    labelName: labelNames[i],
    labelDescription: faker.lorem.sentence(),
    color: faker.color.human(),
    totalContacts: 0, // Will be updated later or kept as is
  }));
}

function generateContacts(labels: Label[], total = 20): Contact[] {
  const labelNames = labels.map((l) => l.labelName);

  return Array.from({ length: total }, () => {
    const selectedLabels = faker.helpers.arrayElements(labelNames, {
      min: 1,
      max: 5,
    });

    return {
      id: faker.string.uuid(),
      contactName: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      tier: faker.helpers.arrayElement([
        'VVIP',
        'VIP',
        'Gold',
        'Silver',
        'Bronze',
      ]),
      labels: selectedLabels,
    };
  });
}

function generateGroupContact(total = 10) {
  const groupContactsArray = [];

  for (let i = 1; i <= total; i++) {
    const memberCount = faker.number.int({ min: 1, max: 10 });
    const members = Array.from({ length: memberCount }, () => ({
      id: faker.string.uuid(),
      avatar: faker.image.avatar(),
      name: faker.person.firstName(),
    }));

    groupContactsArray.push({
      id: faker.string.uuid(),
      groupName: faker.company.name(),
      groupDescription: faker.company.catchPhrase(),
      member: members,
      totalMembers: memberCount,
    });
  }
  return groupContactsArray;
}

function generateBlockedContact(total = 20) {
  const blockedContactsArray = [];
  for (let i = 1; i <= total; i++) {
    blockedContactsArray.push({
      id: faker.string.uuid(),
      contactName: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      detail: faker.lorem.sentence(),
      blockedDate: faker.date.past().toISOString(),
      blockedBy: faker.person.fullName(),
    });
  }
  return blockedContactsArray;
}

// Execution
const labelData = generateLabels();
const contactData = generateContacts(labelData);
const groupData = generateGroupContact();
const blockedData = generateBlockedContact();

// Update totalContacts count for labels
labelData.forEach((label) => {
  label.totalContacts = contactData.filter((c) =>
    c.labels.includes(label.labelName),
  ).length;
});

fs.writeFileSync(
  'db.json',
  JSON.stringify(
    {
      contacts: contactData,
      groups: groupData,
      labels: labelData,
      blockedContacts: blockedData,
    },
    null,
    2,
  ),
);

console.log('Mock data generated in db.json');
