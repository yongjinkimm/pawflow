import Resolver from '@forge/resolver';
import { kvs } from '@forge/kvs';

const resolver = new Resolver();

const PETS_KEY = 'pets';
const CARE_TASK_INDEX_KEY = 'care-task-index';

const getCareTaskKey = (issueKey, petId, careType) =>
  `care-task-${issueKey}-${petId}-${careType}`;


// ========================================
// PET
// ========================================

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
  const pets = Array.isArray(storedPets)
    ? storedPets
    : [];

  const now = new Date().toISOString();

  const newPet = {
    id: `pet-${Date.now()}`,
    species: pet.species,
    name: pet.name.trim(),
    ownerName: pet.ownerName?.trim() ?? '',
    ownerPhone: pet.ownerPhone?.trim() ?? '',
    notes: pet.notes?.trim() ?? '',
    createdAt: now,
    updatedAt: now,
  };

  await kvs.set(
    PETS_KEY,
    [...pets, newPet]
  );

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
  const pets = Array.isArray(storedPets)
    ? storedPets
    : [];

  const index = pets.findIndex(
    (currentPet) => currentPet.id === pet.id
  );

  if (index === -1) {
    throw new Error(
      '반려동물을 찾을 수 없습니다.'
    );
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

  await kvs.set(
    PETS_KEY,
    nextPets
  );

  return updatedPet;
});


// ========================================
// CARE TASK
// ========================================

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
    getCareTaskKey(
      issueKey,
      petId,
      careType
    )
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
    throw new Error(
      'issueKey is required'
    );
  }

  if (!petId) {
    throw new Error(
      '반려동물을 선택해주세요.'
    );
  }

  if (!careType) {
    throw new Error(
      'careType is required'
    );
  }

  if (!Array.isArray(checklist)) {
    throw new Error(
      'checklist must be an array'
    );
  }

  const updatedAt =
    new Date().toISOString();

  const careTask = {
    issueKey,
    petId,
    careType,
    checklist,
    updatedAt,
  };

  const taskKey = getCareTaskKey(
    issueKey,
    petId,
    careType
  );

  // 실제 케어 업무 저장
  await kvs.set(
    taskKey,
    careTask
  );


  // ======================================
  // Dashboard용 Care Task Index
  // ======================================

  const storedIndex =
    await kvs.get(CARE_TASK_INDEX_KEY);

  const taskIndex =
    Array.isArray(storedIndex)
      ? storedIndex
      : [];

  const alreadyExists =
    taskIndex.includes(taskKey);

  if (!alreadyExists) {
    await kvs.set(
      CARE_TASK_INDEX_KEY,
      [...taskIndex, taskKey]
    );
  }


  return {
    success: true,
    careTask,
  };
});


// ========================================
// DASHBOARD
// ========================================

resolver.define('getDashboard', async () => {

  // 반려동물 조회
  const storedPets =
    await kvs.get(PETS_KEY);

  const pets =
    Array.isArray(storedPets)
      ? storedPets
      : [];


  // Care Task Index 조회
  const storedIndex =
    await kvs.get(CARE_TASK_INDEX_KEY);

  const taskKeys =
    Array.isArray(storedIndex)
      ? storedIndex
      : [];


  // 실제 Care Task 조회
  const tasks = (
    await Promise.all(
      taskKeys.map(
        async (taskKey) =>
          await kvs.get(taskKey)
      )
    )
  ).filter(Boolean);


  // Pet ID → Pet 정보
  const petMap = Object.fromEntries(
    pets.map((pet) => [
      pet.id,
      pet,
    ])
  );


  // Dashboard용 데이터 변환
  const careTasks = tasks.map((task) => {

    const checklist =
      Array.isArray(task.checklist)
        ? task.checklist
        : [];

    const completedCount =
      checklist.filter(
        (item) => item.checked
      ).length;

    const totalCount =
      checklist.length;

    const progress =
      totalCount > 0
        ? completedCount / totalCount
        : 0;

    let status = 'NOT_STARTED';

    if (
      totalCount > 0 &&
      completedCount === totalCount
    ) {
      status = 'COMPLETED';
    } else if (completedCount > 0) {
      status = 'IN_PROGRESS';
    }

    return {
      ...task,

      pet:
        petMap[task.petId] ?? null,

      completedCount,
      totalCount,
      progress,
      status,
    };
  });


  // 최근 저장 순
  careTasks.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  );


  const activeCareTasks =
    careTasks.filter(
      (task) =>
        task.status === 'IN_PROGRESS'
    ).length;


  const completedCareTasks =
    careTasks.filter(
      (task) =>
        task.status === 'COMPLETED'
    ).length;


  return {
    petCount: pets.length,

    activeCareTasks,

    completedCareTasks,

    totalCareTasks:
      careTasks.length,

    careTasks,
  };
});


export const handler =
  resolver.getDefinitions();