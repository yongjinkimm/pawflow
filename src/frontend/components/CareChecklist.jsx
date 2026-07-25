import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Label,
  ProgressBar,
  Select,
  Stack,
  Text,
} from '@forge/react';

const CareChecklist = ({
  issueKey,
  pets,
  selectedPet,
  selectedPetId,
  petOptions,
  careType,
  careTypeOptions,
  checklist,
  updatedAt,
  isCareLoading,
  getSpeciesLabel,
  onPetSelect,
  onCareTypeChange,
  onChecklistChange,
  onSave,
  onManagePets,
  onBack,
  message,
}) => {
  const completedCount = checklist.filter(
    (item) => item.checked
  ).length;

  const progress =
    checklist.length > 0
      ? completedCount / checklist.length
      : 0;

  const percentage = Math.round(progress * 100);

  const isCompleted =
    checklist.length > 0 &&
    completedCount === checklist.length;

  const status =
    completedCount === 0
      ? '○ 시작 전'
      : isCompleted
        ? '✓ 케어 완료'
        : '● 진행 중';

  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString('ko-KR')
    : null;

  return (
    <Stack space="space.300">
      <Button appearance="subtle" onClick={onBack}>
        ← 홈
      </Button>

      <Heading size="large">
        🐾 케어 업무
      </Heading>

      <Text>
        Jira Issue · {issueKey}
      </Text>

      {pets.length === 0 ? (
        <Stack space="space.200">
          <Heading size="small">
            등록된 반려동물이 없습니다
          </Heading>

          <Text>
            케어 업무를 시작하려면 먼저 반려동물을 등록해주세요.
          </Text>

          <Button
            appearance="primary"
            onClick={onManagePets}
          >
            반려동물 등록하기
          </Button>
        </Stack>
      ) : (
        <>
          <Heading size="medium">
            1. 케어 대상
          </Heading>

          <Stack space="space.100">
            <Label labelFor="care-pet">
              반려동물 *
            </Label>

            <Select
              inputId="care-pet"
              placeholder="케어할 반려동물을 선택하세요"
              options={petOptions}
              value={
                petOptions.find(
                  (option) =>
                    option.value === selectedPetId
                ) ?? null
              }
              onChange={onPetSelect}
            />
          </Stack>

          {selectedPet && (
            <Box
              padding="space.300"
              backgroundColor="color.background.neutral"
              borderRadius="border.radius.200"
            >
              <Stack space="space.100">
                <Heading size="small">
                  🐾 {selectedPet.name}
                </Heading>

                <Text>
                  {getSpeciesLabel(selectedPet.species)}
                  {' · '}
                  보호자 {selectedPet.ownerName || '미등록'}
                </Text>

                <Text>
                  연락처 · {selectedPet.ownerPhone || '미등록'}
                </Text>

                <Text>
                  특이사항 · {selectedPet.notes || '없음'}
                </Text>
              </Stack>
            </Box>
          )}

          <Heading size="medium">
            2. 케어 유형
          </Heading>

          <Stack space="space.100">
            <Label labelFor="care-type">
              업무 유형
            </Label>

            <Select
              inputId="care-type"
              options={careTypeOptions}
              value={careTypeOptions.find(
                (option) =>
                  option.value === careType
              )}
              onChange={onCareTypeChange}
              isDisabled={!selectedPetId}
            />
          </Stack>

          {!selectedPetId ? (
            <Text>
              먼저 케어할 반려동물을 선택해주세요.
            </Text>
          ) : isCareLoading ? (
            <Text>
              저장된 케어 업무를 불러오는 중...
            </Text>
          ) : (
            <>
              <Heading size="medium">
                3. 표준 체크리스트
              </Heading>

              <Box
                padding="space.300"
                backgroundColor="color.background.neutral"
                borderRadius="border.radius.200"
              >
                <Stack space="space.100">
                  <Heading size="small">
                    업무 진행 상태
                  </Heading>

                  <Text>{status}</Text>

                  <Text>
                    {percentage}% · {completedCount} /{' '}
                    {checklist.length} 완료
                  </Text>

                  <ProgressBar value={progress} />

                  {formattedUpdatedAt ? (
                    <Text>
                      마지막 저장 · {formattedUpdatedAt}
                    </Text>
                  ) : (
                    <Text>
                      아직 저장되지 않은 업무입니다.
                    </Text>
                  )}
                </Stack>
              </Box>

              {checklist.map((item) => (
                <Checkbox
                  key={item.id}
                  label={item.label}
                  isChecked={item.checked}
                  onChange={() =>
                    onChecklistChange(item.id)
                  }
                />
              ))}

              <Button
                appearance="primary"
                onClick={onSave}
              >
                케어 업무 저장
              </Button>

              
            </>
          )}
        </>
      )}

      {message && <Text>{message}</Text>}
    </Stack>
  );
};

export default CareChecklist;