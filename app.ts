import { faker } from '@faker-js/faker';
import fs from 'node:fs';

function generateContact(total = 20) {
  const usersArray = [];

  for (let i = 1; i <= total; i++) {
    usersArray.push({
      id: faker.string.uuid(),
      contactName: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      tier: faker.helpers.arrayElement(['VVIP','VIP','Gold', 'Silver', 'Bronze']),
      label: faker.helpers.arrayElement(['Family', 'Friends', 'Work', 'Acquaintances']),
    });
  }

  return usersArray;
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

function generateLabel(total = 5) {
    const labelsArray = [];
    for (let i = 1; i <= total; i++) {
        labelsArray.push({
            id: faker.string.uuid(),
            labelName: faker.commerce.department(),
            color: faker.color.human(),
            totalContacts: faker.number.int({ min: 1, max: 100 }),
        });
    }
    return labelsArray;
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

const data = generateContact();
const groupData = generateGroupContact();
const labelData = generateLabel();
const blockedData = generateBlockedContact();

fs.writeFileSync(
  'db.json',
  JSON.stringify({ contacts: data, groups: groupData, labels: labelData, blockedContacts: blockedData }, null, 2),
);
console.log('Mock data generated in db.json');
