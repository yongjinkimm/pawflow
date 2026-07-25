import Resolver from '@forge/resolver';
import { kvs } from '@forge/kvs';

const resolver = new Resolver();

const PETS_KEY = 'pets';

const getCareTaskKey = (issueKey, petId, careType) =>
  `care-task-${issueKey}-${petId}-${careType}`;

// 등록된 반려동물 조회
resolver.define('getPets', async () => {
  const pets = await kvs.get(PETS_KEY);
  return Array.isArray(pets) ? pets : [];
});

// 반려동물 등록
resolver.define('createPet', async ({ payload }) => {
  const { pet } = payload ?? {};

  if (!pet?.species) {
    throw new Error('반려동물 종류는 필수입니다.');
  }

  if (!pet?.name?.trim()) {
    throw new Error('반려동물 이름은 필수입니다.');
  }

  const storedPets = await kvs.get(PETS_KEY);
  const pets = Array.isArray(storedPets) ? storedPets : [];

  const newPet = {
    id: `pet-${Date.now()}`,
    species: pet.species,
    name: pet.name.trim(),
    ownerName: pet.ownerName?.trim() ?? '',
    ownerPhone: pet.ownerPhone?.trim() ?? '',
    notes: pet.notes?.trim() ?? '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await kvs.set(PETS_KEY, [...pets, newPet]);

  return newPet;
});

// 반려동물 수정
resolver.define('updatePet', async ({ payload }) => {
  const { pet } = payload ?? {};

  if (!pet?.id) {
    throw new Error('petId is required');
  }

  if (!pet?.name?.trim()) {
    throw new Error('반려동물 이름은 필수입니다.');
  }

  const storedPets = await kvs.get(PETS_KEY);
  const pets = Array.isArray(storedPets) ? storedPets : [];

  const index = pets.findIndex(
    (currentPet) => currentPet.id === pet.id
  );

  if (index === -1) {
    throw new Error('반려동물을 찾을 수 없습니다.');
  }

  const updatedPet = {
    ...pets[index],
    species: pet.species,
    name: pet.name.trim(),
    ownerName: pet.ownerName?.trim() ?? '',
    ownerPhone: pet.ownerPhone?.trim() ?? '',
    notes: pet.notes?.trim() ?? '',
    updatedAt: new Date().toISOString(),
  };

  const nextPets = [...pets];
  nextPets[index] = updatedPet;

  await kvs.set(PETS_KEY, nextPets);

  return updatedPet;
});

// Issue + Pet + CareType별 케어 업무 조회
resolver.define('getCareTask', async ({ payload }) => {
  const {
    issueKey,
    petId,
    careType,
  } = payload ?? {};

  if (!issueKey || !petId || !careType) {
    return null;
  }

  const task = await kvs.get(
    getCareTaskKey(issueKey, petId, careType)
  );

  return task ?? null;
});

// Issue + Pet + CareType별 케어 업무 저장
resolver.define('saveCareTask', async ({ payload }) => {
  const {
    issueKey,
    petId,
    careType,
    checklist,
  } = payload ?? {};

  if (!issueKey) {
    throw new Error('issueKey is required');
  }

  if (!petId) {
    throw new Error('반려동물을 선택해주세요.');
  }

  if (!careType) {
    throw new Error('careType is required');
  }

  if (!Array.isArray(checklist)) {
    throw new Error('checklist must be an array');
  }

  const updatedAt = new Date().toISOString();

  const careTask = {
    issueKey,
    petId,
    careType,
    checklist,
    updatedAt,
  };

  await kvs.set(
    getCareTaskKey(issueKey, petId, careType),
    careTask
  );

  return {
    success: true,
    careTask,
  };
});

export const handler = resolver.getDefinitions();