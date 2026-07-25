export const speciesOptions = [
  { label: '강아지', value: 'dog' },
  { label: '고양이', value: 'cat' },
  { label: '기타', value: 'other' },
];

export const getSpeciesLabel = (species) => {
  return (
    speciesOptions.find(
      (option) => option.value === species
    )?.label ?? '기타'
  );
};

export const createEmptyPetForm = () => ({
  species: 'dog',
  name: '',
  ownerName: '',
  ownerPhone: '',
  notes: '',
});