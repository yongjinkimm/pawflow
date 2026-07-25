export const checklistTemplates = {
  healthCheck: [
    { id: 1, label: '체온 확인', checked: false },
    { id: 2, label: '몸무게 측정', checked: false },
    { id: 3, label: '건강 상태 확인', checked: false },
    { id: 4, label: '보호자 안내', checked: false },
    { id: 5, label: '다음 일정 안내', checked: false },
  ],

  vaccination: [
    { id: 1, label: '체온 확인', checked: false },
    { id: 2, label: '몸무게 측정', checked: false },
    { id: 3, label: '접종 가능 상태 확인', checked: false },
    { id: 4, label: '예방접종 실시', checked: false },
    { id: 5, label: '이상반응 및 다음 접종 안내', checked: false },
  ],

  grooming: [
    { id: 1, label: '피부 및 피모 상태 확인', checked: false },
    { id: 2, label: '발톱 관리', checked: false },
    { id: 3, label: '귀 청소', checked: false },
    { id: 4, label: '목욕 및 미용', checked: false },
    { id: 5, label: '보호자 안내', checked: false },
  ],
};

export const careTypeOptions = [
  { label: '건강검진', value: 'healthCheck' },
  { label: '예방접종', value: 'vaccination' },
  { label: '미용', value: 'grooming' },
];

export const createChecklist = (careType = 'healthCheck') => {
  const template =
    checklistTemplates[careType] ??
    checklistTemplates.healthCheck;

  return template.map((item) => ({
    ...item,
  }));
};