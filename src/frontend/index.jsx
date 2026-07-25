import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke, view } from '@forge/bridge';

import Home from './components/Home';
import PetManager from './components/PetManager';
import CareChecklist from './components/CareChecklist';

import {
  careTypeOptions,
  createChecklist,
} from './data/checklistTemplates';

import {
  speciesOptions,
  getSpeciesLabel,
  createEmptyPetForm,
} from './utils/petUtils';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const [issueKey, setIssueKey] = useState(null);

  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const [petForm, setPetForm] = useState(createEmptyPetForm);
  const [editingPet, setEditingPet] = useState(null);

  const [careType, setCareType] = useState('healthCheck');
  const [checklist, setChecklist] = useState(
    createChecklist('healthCheck')
  );

  const [updatedAt, setUpdatedAt] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCareLoading, setIsCareLoading] = useState(false);

  const [message, setMessage] = useState('');

  // 최초 데이터 로드
  useEffect(() => {
    const initialize = async () => {
      try {
        const context = await view.getContext();
        const key = context?.extension?.issue?.key;

        if (!key) {
          throw new Error('Jira Issue 정보를 찾을 수 없습니다.');
        }

        setIssueKey(key);

        const storedPets = await invoke('getPets');
        const petList = Array.isArray(storedPets)
          ? storedPets
          : [];

        setPets(petList);
      } catch (error) {
        console.error('PawFlow 초기화 실패:', error);
        setMessage('PawFlow 데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // 선택한 Pet + CareType의 업무 조회
  const loadCareTask = async (
    petId,
    nextCareType = careType
  ) => {
    if (!issueKey || !petId || !nextCareType) {
      setChecklist(createChecklist(nextCareType));
      setUpdatedAt(null);
      return;
    }

    setIsCareLoading(true);

    try {
      const savedTask = await invoke('getCareTask', {
        issueKey,
        petId,
        careType: nextCareType,
      });

      if (savedTask && Array.isArray(savedTask.checklist)) {
        setChecklist(savedTask.checklist);
        setUpdatedAt(savedTask.updatedAt ?? null);
      } else {
        setChecklist(createChecklist(nextCareType));
        setUpdatedAt(null);
      }
    } catch (error) {
      console.error('케어 업무 조회 실패:', error);

      setChecklist(createChecklist(nextCareType));
      setUpdatedAt(null);
      setMessage('케어 업무를 불러오지 못했습니다.');
    } finally {
      setIsCareLoading(false);
    }
  };

  const handlePetFormChange = (field, value) => {
    setPetForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // 신규 등록
  const handleCreatePet = async () => {
    if (!petForm.name.trim()) {
      setMessage('반려동물 이름을 입력해주세요.');
      return;
    }

    try {
      const newPet = await invoke('createPet', {
        pet: petForm,
      });

      setPets((current) => [...current, newPet]);
      setPetForm(createEmptyPetForm());

      setMessage(`${newPet.name} 등록이 완료되었습니다.`);
    } catch (error) {
      console.error('반려동물 등록 실패:', error);
      setMessage('반려동물 등록에 실패했습니다.');
    }
  };

  // 수정 시작
  const handleStartEditPet = (pet) => {
    setEditingPet({ ...pet });
    setMessage('');
  };

  const handleEditPetChange = (field, value) => {
    setEditingPet((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCancelEditPet = () => {
    setEditingPet(null);
    setMessage('');
  };

  // 수정 저장
  const handleUpdatePet = async () => {
    if (!editingPet?.name?.trim()) {
      setMessage('반려동물 이름을 입력해주세요.');
      return;
    }

    try {
      const updatedPet = await invoke('updatePet', {
        pet: editingPet,
      });

      setPets((current) =>
        current.map((pet) =>
          pet.id === updatedPet.id ? updatedPet : pet
        )
      );

      setEditingPet(null);
      setMessage(`${updatedPet.name} 정보가 수정되었습니다.`);
    } catch (error) {
      console.error('반려동물 수정 실패:', error);
      setMessage('반려동물 정보 수정에 실패했습니다.');
    }
  };

  // 케어 대상 변경
  const handlePetSelect = async (option) => {
    const petId = option?.value ?? null;

    setSelectedPetId(petId);
    setMessage('');

    if (!petId) {
      setChecklist(createChecklist(careType));
      setUpdatedAt(null);
      return;
    }

    await loadCareTask(petId, careType);
  };

  // 케어 유형 변경
  const handleCareTypeChange = async (option) => {
    if (!option) {
      return;
    }

    const nextCareType = option.value;

    setCareType(nextCareType);
    setMessage('');

    if (!selectedPetId) {
      setChecklist(createChecklist(nextCareType));
      setUpdatedAt(null);
      return;
    }

    await loadCareTask(
      selectedPetId,
      nextCareType
    );
  };

  const handleChecklistChange = (id) => {
    setChecklist((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
            }
          : item
      )
    );

    setMessage('');
  };

  // 업무 저장
  const handleSave = async () => {
    if (!selectedPetId) {
      setMessage('반려동물을 선택해주세요.');
      return;
    }

    try {
      const result = await invoke('saveCareTask', {
        issueKey,
        petId: selectedPetId,
        careType,
        checklist,
      });

      setUpdatedAt(result.careTask.updatedAt);
      setMessage('케어 업무가 저장되었습니다.');
    } catch (error) {
      console.error('케어 업무 저장 실패:', error);
      setMessage('케어 업무 저장에 실패했습니다.');
    }
  };

  const selectedPet =
    pets.find((pet) => pet.id === selectedPetId) ?? null;

  const petOptions = pets.map((pet) => ({
    label: `${pet.name} · ${getSpeciesLabel(pet.species)}`,
    value: pet.id,
  }));

  const completedCount = checklist.filter(
    (item) => item.checked
  ).length;

  if (isLoading) {
    return <Text>PawFlow 데이터를 불러오는 중...</Text>;
  }

  if (currentPage === 'home') {
    return (
      <Home
        issueKey={issueKey}
        petCount={pets.length}
        completedCount={completedCount}
        totalCount={checklist.length}
        onStartCare={() => {
          setMessage('');
          setCurrentPage('care');
        }}
        onManagePets={() => {
          setMessage('');
          setCurrentPage('pets');
        }}
      />
    );
  }

  if (currentPage === 'pets') {
    return (
      <PetManager
        pets={pets}
        petForm={petForm}
        editingPet={editingPet}
        speciesOptions={speciesOptions}
        getSpeciesLabel={getSpeciesLabel}
        onPetFormChange={handlePetFormChange}
        onCreatePet={handleCreatePet}
        onStartEdit={handleStartEditPet}
        onEditChange={handleEditPetChange}
        onUpdatePet={handleUpdatePet}
        onCancelEdit={handleCancelEditPet}
        onBack={() => {
          setEditingPet(null);
          setMessage('');
          setCurrentPage('home');
        }}
        message={message}
      />
    );
  }

  if (currentPage === 'care') {
    return (
      <CareChecklist
        issueKey={issueKey}
        pets={pets}
        selectedPet={selectedPet}
        selectedPetId={selectedPetId}
        petOptions={petOptions}
        careType={careType}
        careTypeOptions={careTypeOptions}
        checklist={checklist}
        updatedAt={updatedAt}
        isCareLoading={isCareLoading}
        getSpeciesLabel={getSpeciesLabel}
        onPetSelect={handlePetSelect}
        onCareTypeChange={handleCareTypeChange}
        onChecklistChange={handleChecklistChange}
        onSave={handleSave}
        onManagePets={() => {
          setMessage('');
          setCurrentPage('pets');
        }}
        onBack={() => {
          setMessage('');
          setCurrentPage('home');
        }}
        message={message}
      />
    );
  }

  return <Text>화면을 불러올 수 없습니다.</Text>;
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);